import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const geminiService = new GeminiService();

export class QuizController {
  /**
   * Generates a new quiz for a topic or document.
   */
  async generateNewQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { topic, documentId, userId, questionCount } = req.body;

      if (!userId) {
        res.status(400).json({ error: "Authenticating User ID required." });
        return;
      }

      let contentContext = "";
      let quizTitle = topic || "Study Quiz";

      // If document ID is provided, retrieve document text/summary to ground questions
      if (documentId) {
        const doc = await prisma.document.findUnique({
          where: { id: documentId }
        });
        if (doc) {
          contentContext = doc.summary || "";
          quizTitle = `Quiz on ${doc.title}`;
        }
      }

      console.log(`Generating quiz: "${quizTitle}" for user: ${userId}`);

      // Call Gemini model structured quiz creator
      const questions = await geminiService.generateQuiz(quizTitle, contentContext, questionCount || 5);

      // Save database quiz model
      const quiz = await prisma.quiz.create({
        data: {
          title: quizTitle,
          questions: questions,
          maxScore: questions.length,
          userId: userId,
          documentId: documentId || null
        }
      });

      res.status(201).json(quiz);
    } catch (error: any) {
      console.error("Quiz generation route failed:", error);
      res.status(500).json({ error: "Failed to construct quiz: " + error.message });
    }
  }

  /**
   * Submit quiz score after completion.
   */
  async submitQuizScore(req: Request, res: Response): Promise<void> {
    try {
      const { quizId, score } = req.body;

      if (!quizId || score === undefined) {
        res.status(400).json({ error: "Parameters quizId and score are required." });
        return;
      }

      const updatedQuiz = await prisma.quiz.update({
        where: { id: quizId },
        data: { score }
      });

      res.status(200).json({
        message: "Quiz results submitted successfully.",
        quiz: updatedQuiz
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to submit quiz scores: " + error.message });
    }
  }

  /**
   * Retrieve previous quizzes taken by user.
   */
  async getUserQuizzes(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const quizzes = await prisma.quiz.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(quizzes);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to load quizzes: " + error.message });
    }
  }
}
