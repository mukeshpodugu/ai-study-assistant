import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export class GeminiService {
  /**
   * Generates a descriptive, structured summary of a text document.
   */
  async generateSummary(text: string): Promise<string> {
    if (!genAI) {
      console.warn("Gemini API key missing. Returning mock summary.");
      return this.getMockSummary();
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an expert AI Study Assistant. Below is the text extracted from a study document.
        Provide a structured, comprehensive study summary. It should include:
        1. Overview / Executive Summary
        2. Key Core Concepts (bullet points with concise explanations)
        3. Important Terminology
        4. Summary Formulae/Equations or Practical Takeaways (if applicable)
        
        Keep it academic, readable, and structured for quick exam revision.
        
        Document Text:
        ${text.substring(0, 15000)} // Truncate to stay within prompt boundaries safely
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini summary generation failed:", error);
      throw new Error("Failed to generate document summary via Gemini AI.");
    }
  }

  /**
   * Generates a list of structured multiple-choice quiz questions based on the text.
   */
  async generateQuiz(topic: string, textContext: string, questionCount: number = 5): Promise<any[]> {
    if (!genAI) {
      console.warn("Gemini API key missing. Returning mock quiz questions.");
      return this.getMockQuiz(topic, questionCount);
    }

    try {
      // Use gemini-1.5-flash which supports JSON schema response type
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });

      const prompt = `
        Generate a multiple-choice quiz based on the following topic and source text.
        Topic: "${topic}"
        Question Count: ${questionCount}
        
        Source Text (if available):
        ${textContext.substring(0, 10000)}

        Return a JSON array of questions matching this exact structure:
        [
          {
            "question": "What is the primary function of DNA?",
            "options": ["Store genetic information", "Synthesize lipids", "Provide energy", "Transport oxygen"],
            "correctOptionIndex": 0,
            "explanation": "DNA stands for Deoxyribonucleic Acid, and its fundamental biological role is the long-term storage of genetic information."
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Gemini quiz generation failed:", error);
      throw new Error("Failed to generate quiz. Check API configurations.");
    }
  }

  /**
   * Generates active recall flashcards from study text.
   */
  async generateFlashcards(text: string, count: number = 8): Promise<any[]> {
    if (!genAI) {
      console.warn("Gemini API key missing. Returning mock flashcards.");
      return this.getMockFlashcards(count);
    }

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });

      const prompt = `
        Extract ${count} core concept flashcards from the text below. 
        Flashcards must focus on active recall. The front should ask a specific question or specify a term to define, and the back should have a concise, comprehensive answer.
        
        Text:
        ${text.substring(0, 10000)}

        Return a JSON array matching this format:
        [
          {
            "front": "What is RAG (Retrieval-Augmented Generation)?",
            "back": "A technique that improves LLM responses by fetching relevant context from an external knowledge base (like a vector database) before generation.",
            "explanation": "RAG reduces hallucinations and keeps models updated with domain-specific knowledge without fine-tuning."
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error("Gemini flashcard generation failed:", error);
      throw new Error("Failed to generate flashcards.");
    }
  }

  /**
   * Generates AI study planner suggestions based on upcoming tasks.
   */
  async getPlannerAdvice(tasks: any[]): Promise<string> {
    if (!genAI) {
      return "Ensure you prioritize high-weight subjects. Focus on active recall and spaced repetition for the upcoming deadlines.";
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are a highly efficient AI Study Planner. Below is the list of upcoming study tasks and deadlines for a student.
        Analyze the list and provide a 3-step actionable study roadmap (max 200 words).
        Suggest which topic to study first, how much time to spend, and what learning technique (e.g. active recall, Feynman technique) fits best.
        
        Tasks:
        ${JSON.stringify(tasks)}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return "Prioritize tasks due soonest. Split study sessions into 25-minute Pomodoro segments followed by short tests.";
    }
  }

  // --- Fallback Mock Data Generators for Development/Verification ---

  private getMockSummary(): string {
    return `
# Summary: Foundations of Retrieval-Augmented Generation (RAG)

## Overview
Retrieval-Augmented Generation (RAG) is a framework that optimizes the output of Large Language Models (LLMs) by querying an external knowledge base before generating responses. It addresses LLM limitations like hallucinations and outdated knowledge training sets.

## Key Core Concepts
* **Vector Embeddings:** Representing textual data as multi-dimensional numerical vectors that capture semantic meaning.
* **Similarity Search:** Performing cosine distance searches in a vector space (e.g., using databases like Pinecone or Chroma) to retrieve top-k matching chunks.
* **Retrieval Phase:** Fetching contextually relevant document segments matching the user query.
* **Generation Phase:** Appending the retrieved context into the LLM's prompt window alongside the user's question, instructing the model to ground its answer in the provided text.

## Key Terminology
* **Hallucination:** When an LLM fabricates false information confidently due to lack of source facts.
* **Chunking:** Slicing raw documents (PDF, text) into smaller, overlapping segments (e.g., 500 characters with 100 character overlap) to maintain readability without splitting critical sentences.
* **Spaced Repetition:** An evidence-based learning system that increases the intervals of review cards based on user confidence.
    `;
  }

  private getMockQuiz(topic: string, count: number): any[] {
    const list = [
      {
        question: `In the context of ${topic || 'Computer Science'}, what is the main benefit of Spaced Repetition?`,
        options: ["Encourages rote memorization", "Optimizes cognitive retention by scheduling reviews at the forgetting curve", "Minimizes the necessity for self-testing", "Helps in speed reading large textbooks"],
        correctOptionIndex: 1,
        explanation: "Spaced repetition schedules card reviews right when you are about to forget them, flattening the forgetting curve and boosting long-term memory."
      },
      {
        question: "How does a Vector Database retrieve relevant context for an LLM?",
        options: ["By running standard SQL regex patterns on the document title", "By mapping text to semantic embeddings and calculating similarity distance (e.g., cosine)", "By alphabetical sort structures", "By counting keyword occurrence metrics"],
        correctOptionIndex: 1,
        explanation: "Vector databases represent text as numbers in vector space. Semantic matches are identified by calculating geometric distance (cosine or dot product) between the query and text chunks."
      },
      {
        question: "What is document 'chunking' with overlap?",
        options: ["Splitting paragraphs into separate files", "Slicing text into logical fragments with overlapping boundaries to ensure context is not severed", "Compressing text into zip files to save server database space", "Translating code into machine instructions"],
        correctOptionIndex: 1,
        explanation: "Chuncking with overlap (e.g., 100-character overlap) preserves context that sits on the boundary lines of split paragraphs, preventing AI retrieval failure."
      },
      {
        question: "What role does the Gemini API play in a RAG pipeline?",
        options: ["Hosting the database structure", "Generating high-quality text embeddings and final answers grounded in retrieved documents", "Extracting physical PDF files from folders", "Managing authentication tokens for users"],
        correctOptionIndex: 1,
        explanation: "Gemini APIs can create text embeddings (e.g., text-embedding-004) and act as the generative solver (e.g., gemini-1.5-flash) to formulate the final grounded response."
      },
      {
        question: "Why are raw text extractions from PDFs frequently noisy?",
        options: ["PDFs are encrypted automatically", "PDFs format files visually, splitting lines, text blocks, page headers, footers, and multi-column paragraphs in non-linear ways", "Vector databases do not accept PDF formats", "PDF text is always written in binary code"],
        correctOptionIndex: 1,
        explanation: "PDFs compile characters by physical coordinates on a canvas, meaning reading text top-to-bottom often merges headers, footers, sidebars, and column dividers, creating garbled text sequences."
      }
    ];
    return list.slice(0, count);
  }

  private getMockFlashcards(count: number): any[] {
    const list = [
      {
        front: "What does active recall mean?",
        back: "A learning principle that involves testing yourself to retrieve knowledge from memory, rather than passively re-reading notes.",
        explanation: "Active recall forces the brain to construct neural paths to retrieve stored information, building far stronger memories."
      },
      {
        front: "Explain the SM-2 Spaced Repetition Algorithm.",
        back: "An algorithm developed by SuperMemo that computes the ideal number of days to wait before reviewing a card based on a user self-assessed response grade (0-5).",
        explanation: "Successive correct answers increase intervals exponentially, while a low score resets the sequence."
      },
      {
        front: "What is an Embedding Vector?",
        back: "A list of floating-point numbers representing semantic meanings of words or sentences in high-dimensional space.",
        explanation: "Words with similar definitions map to coordinates that are geometrically closer together."
      },
      {
        front: "What are the limitations of keyword search compared to vector search?",
        back: "Keyword search checks for exact matching characters; vector search resolves meaning, synonyms, and conceptual relationships (e.g., searching 'pup' returns 'dog').",
        explanation: "Vector search handles semantic search far better, especially for ambiguous query formats."
      },
      {
        front: "How does the Pomodoro technique boost focus?",
        back: "By structuring study into 25 minutes of complete focus followed by a 5-minute break, matching the natural attention cycle.",
        explanation: "Regular breaks prevent mental fatigue and promote sustained concentration over long sessions."
      }
    ];
    return list.slice(0, count);
  }
}
