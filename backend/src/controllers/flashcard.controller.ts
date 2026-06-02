import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const geminiService = new GeminiService();

export class FlashcardController {
  /**
   * Create a new flashcard deck from document text.
   */
  async generateDeck(req: Request, res: Response): Promise<void> {
    try {
      const { documentId, userId, cardCount, title } = req.body;

      if (!userId) {
        res.status(400).json({ error: "Missing authenticating User ID." });
        return;
      }

      let textContent = "";
      let deckTitle = title || "New Study Deck";

      if (documentId) {
        const doc = await prisma.document.findUnique({ where: { id: documentId } });
        if (doc) {
          textContent = doc.summary || "";
          deckTitle = `Flashcards: ${doc.title}`;
        }
      }

      console.log(`Generating flashcards for deck: "${deckTitle}"`);

      // Generate flashcards using Gemini structured JSON response
      const generatedCards = await geminiService.generateFlashcards(
        textContent || "General learning and active recall study strategies", 
        cardCount || 5
      );

      // Create deck and cards in database transaction
      const deck = await prisma.flashcardDeck.create({
        data: {
          title: deckTitle,
          userId,
          documentId: documentId || null,
          cards: {
            create: generatedCards.map((card: any) => ({
              front: card.front,
              back: card.back,
              explanation: card.explanation || '',
              interval: 1,
              repetition: 0,
              easeFactor: 2.5,
              dueDate: new Date()
            }))
          }
        },
        include: {
          cards: true
        }
      });

      res.status(201).json(deck);
    } catch (error: any) {
      console.error("Flashcard generation failed:", error);
      res.status(500).json({ error: "Failed to generate flashcard deck: " + error.message });
    }
  }

  /**
   * Process a review response utilizing the SuperMemo SM-2 algorithm.
   * Student design decision: 
   * Grade values:
   * 0-2: Reset interval (failed card, repeat sooner)
   * 3: Pass (hard review, slow interval increase)
   * 4: Good (solid response)
   * 5: Easy (extremely comfortable, long interval increase)
   */
  async reviewCard(req: Request, res: Response): Promise<void> {
    try {
      const { cardId, grade } = req.body; // grade 0 - 5

      if (!cardId || grade === undefined || grade < 0 || grade > 5) {
        res.status(400).json({ error: "Valid cardId and grade (0-5) are required." });
        return;
      }

      const card = await prisma.flashcard.findUnique({
        where: { id: cardId }
      });

      if (!card) {
        res.status(404).json({ error: "Flashcard not found." });
        return;
      }

      let interval = card.interval;
      let repetition = card.repetition;
      let easeFactor = card.easeFactor;

      if (grade >= 3) {
        // Correct response - increment rep and recalculate interval
        if (repetition === 0) {
          interval = 1;
        } else if (repetition === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
        repetition += 1;
      } else {
        // Incorrect response - reset repetition and schedule for immediate review
        repetition = 0;
        interval = 1;
      }

      // Calculate ease factor adjustment
      easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
      if (easeFactor < 1.3) {
        easeFactor = 1.3; // SM-2 boundary floor limit
      }

      // Compute next due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + interval);

      // Update card statistics
      const updatedCard = await prisma.flashcard.update({
        where: { id: cardId },
        data: {
          interval,
          repetition,
          easeFactor,
          dueDate
        }
      });

      res.status(200).json({
        message: "Spaced repetition metrics updated successfully.",
        card: updatedCard
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update flashcard metrics: " + error.message });
    }
  }

  /**
   * Retrieve active decks for a user.
   */
  async getUserDecks(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const decks = await prisma.flashcardDeck.findMany({
        where: { userId },
        include: {
          _count: {
            select: { cards: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(decks);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch decks: " + error.message });
    }
  }

  /**
   * Get all cards due for review inside a deck.
   */
  async getDeckCardsForReview(req: Request, res: Response): Promise<void> {
    try {
      const { deckId } = req.params;
      const cards = await prisma.flashcard.findMany({
        where: {
          deckId,
          dueDate: {
            lte: new Date() // Due now or overdue
          }
        }
      });
      res.status(200).json(cards);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch due review cards: " + error.message });
    }
  }
}
