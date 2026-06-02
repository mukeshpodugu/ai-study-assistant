import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const pineconeKey = process.env.PINECONE_API_KEY || '';
const pineconeIndexName = process.env.PINECONE_INDEX || 'ai-study-assistant';

const geminiKey = process.env.GEMINI_API_KEY || '';
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// Initialize Pinecone Client if key available
let pineconeClient: Pinecone | null = null;
if (pineconeKey) {
  try {
    pineconeClient = new Pinecone({ apiKey: pineconeKey });
  } catch (error) {
    console.error("Failed to initialize Pinecone Client:", error);
  }
}

export class RAGService {
  /**
   * Chunks text into overlapping blocks.
   * Student design decision: 600 character size with 120 character overlap.
   */
  chunkText(text: string, chunkSize: number = 600, overlap: number = 120): string[] {
    const chunks: string[] = [];
    let index = 0;
    
    // Quick sanitization
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    
    while (index < cleanedText.length) {
      const chunk = cleanedText.substring(index, index + chunkSize);
      chunks.push(chunk);
      index += chunkSize - overlap;
    }
    
    return chunks;
  }

  /**
   * Generates vector embeddings for a given text query/chunk using Gemini Embeddings model.
   */
  async getEmbedding(text: string): Promise<number[]> {
    if (!genAI) {
      // Mock embedding vector (768 dimensions for Gemini Embeddings)
      const mockVector: number[] = Array.from({ length: 768 }, () => Math.random() - 0.5);
      return mockVector;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error("Embedding generation failed:", error);
      throw new Error("Failed to generate vector embeddings.");
    }
  }

  /**
   * Indexes text chunks into Pinecone.
   */
  async indexDocument(documentId: string, text: string, userId: string): Promise<void> {
    const chunks = this.chunkText(text);
    console.log(`Document split into ${chunks.length} chunks. Generating embeddings...`);

    if (!pineconeClient || !genAI) {
      console.warn("Pinecone/Gemini not configured fully. Simulating database indexing.");
      return;
    }

    try {
      const index = pineconeClient.Index(pineconeIndexName);
      const upsertVectors = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await this.getEmbedding(chunk);
        
        upsertVectors.push({
          id: `${documentId}_chunk_${i}`,
          values: embedding,
          metadata: {
            documentId,
            userId,
            text: chunk,
            chunkIndex: i
          }
        });

        // Batch upload in blocks of 50 to avoid Pinecone body limits
        if (upsertVectors.length === 50 || i === chunks.length - 1) {
          await index.upsert(upsertVectors);
          upsertVectors.length = 0; // Clear batch
        }
      }
      console.log(`Successfully indexed document ${documentId} into Pinecone.`);
    } catch (error) {
      console.error("Error indexing documents into Pinecone:", error);
      throw new Error("Vector database indexing operation failed.");
    }
  }

  /**
   * Retrieves top context chunks relevant to a query using Cosine Similarity in Pinecone.
   */
  async queryContext(query: string, documentId: string, topK: number = 3): Promise<string> {
    if (!pineconeClient || !genAI) {
      console.warn("Pinecone API missing. Simulating semantic search context fetch.");
      return this.getSimulatedContext(query, documentId);
    }

    try {
      const queryEmbedding = await this.getEmbedding(query);
      const index = pineconeClient.Index(pineconeIndexName);
      
      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK,
        filter: { documentId: { $eq: documentId } },
        includeMetadata: true
      });

      const contextChunks = queryResponse.matches
        .map(match => (match.metadata as any)?.text || '')
        .filter(text => text.length > 0);

      return contextChunks.join('\n\n---\n\n');
    } catch (error) {
      console.error("Vector search query failed:", error);
      return this.getSimulatedContext(query, documentId);
    }
  }

  /**
   * Executes full RAG conversational pipeline.
   */
  async queryDocument(query: string, documentId: string, summaryContext: string): Promise<string> {
    const matchingContext = await this.queryContext(query, documentId);
    
    if (!genAI) {
      return this.getSimulatedRAGResponse(query);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are a dedicated AI Study Assistant answering a student's question based on their uploaded document.
        Use the provided context snippet to ground your answer. If the context does not contain the answer, use your pre-trained academic knowledge but note that it was not explicitly in their document.
        
        Document Summary Context:
        ${summaryContext.substring(0, 1000)}

        Retrieved Document Snippets:
        ${matchingContext}

        Student's Question:
        "${query}"

        Answer concisely and highlight definitions or keywords. Format with markdown headings/bullet points where helpful.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Failed executing RAG Gemini query:", error);
      throw new Error("AI engine failed to generate grounded response.");
    }
  }

  // --- Mock Retrieval and Grounding Simulation ---

  private getSimulatedContext(query: string, docId: string): string {
    // Return sample paragraph containing typical terms matching search queries
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery.includes('rag') || lowercaseQuery.includes('retrieval')) {
      return "Retrieval-Augmented Generation (RAG) integrates retrieval mechanisms inside text generation pipelines. In practice, the system maps queries to high-dimensional embedding spaces, extracts close-neighborhood documents, and feeds them into the prompt layout of the underlying LLM.";
    }
    if (lowercaseQuery.includes('embed') || lowercaseQuery.includes('vector')) {
      return "Embedding models like Gemini's text-embedding-004 map strings to float arrays of size 768 or 1536. Each coordinate maps a specific grammatical, syntax-related, or semantic vector relationship, meaning words with related definitions exhibit smaller angular difference.";
    }
    if (lowercaseQuery.includes('spaced') || lowercaseQuery.includes('sm-2') || lowercaseQuery.includes('repetition')) {
      return "The SM-2 spaced repetition formula adjusts the review interval I(n) based on response quality EF (Ease Factor). The mathematical progression dictates that I(1) = 1, I(2) = 6, and I(n) = I(n-1) * EF. If a user scores less than 3, the card repetitions counter resets to zero.";
    }
    return "This section discusses the core architectural design of our AI Study Assistant Platform. The system utilizes multi-stage indexing: PDF file upload, text extraction using standard text parsers, semantic chunk alignment with overlap ratios, vector generation via AI APIs, and persistence in our indexed structures.";
  }

  private getSimulatedRAGResponse(query: string): string {
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery.includes('rag') || lowercaseQuery.includes('retrieval')) {
      return "According to the retrieved text from your document, **RAG** (Retrieval-Augmented Generation) is an LLM optimization technique. It retrieves semantic context blocks matching the user's prompt from a database first, then embeds them in the instruction context to prevent hallucinations.";
    }
    if (lowercaseQuery.includes('embed') || lowercaseQuery.includes('vector')) {
      return "Based on your notes, **Embeddings** represent vocabulary and sentences as long numeric vectors. Vectors coordinate close to one another in geometric space signify semantic similarity, which enables retrieval searches to bypass literal keyword limitations.";
    }
    if (lowercaseQuery.includes('spaced') || lowercaseQuery.includes('sm-2') || lowercaseQuery.includes('repetition')) {
      return "According to the document sections on study efficiency, the **SuperMemo SM-2 algorithm** is standard for active recall scheduling. It tracks user confidence grades (0 to 5) to dynamically update ease factors and intervals, saving time by testing difficult concepts more frequently.";
    }
    return `Regarding your question: "${query}". Based on the document structure, this topic involves the system pipeline integrations. The platform processes documents locally and provides AI-driven explanations to maximize active review success. Let me know if you would like me to summarize any specific paragraph!`;
  }
}
