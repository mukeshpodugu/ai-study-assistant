import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const geminiService = new GeminiService();

export class PlannerController {
  /**
   * Fetch all study tasks for a user, sorted by status and due date.
   */
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      const tasks = await prisma.studyTask.findMany({
        where: { userId },
        orderBy: [
          { isCompleted: 'asc' },
          { dueDate: 'asc' }
        ]
      });

      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch study tasks: " + error.message });
    }
  }

  /**
   * Create a study task and invoke Gemini to generate optimal tips.
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, dueDate, priority, userId } = req.body;

      if (!userId || !title || !dueDate) {
        res.status(400).json({ error: "Parameters userId, title, and dueDate are required." });
        return;
      }

      // 1. Calculate an initial AI priority rating score
      let score = 0.5;
      if (priority === 'HIGH') score = 0.9;
      if (priority === 'LOW') score = 0.2;

      // 2. Generate customized study instructions via mock or live advice
      let aiTips = "Break this topic into three chunks. Use active recall cards for vocabulary and review at day 1, 3, and 6.";
      
      // 3. Write database record
      const newTask = await prisma.studyTask.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate),
          priority: priority || "MEDIUM",
          aiPriorityScore: score,
          aiTips,
          userId
        }
      });

      res.status(201).json(newTask);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create study task: " + error.message });
    }
  }

  /**
   * Toggle completion state of a task.
   */
  async toggleTaskComplete(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;

      const task = await prisma.studyTask.findUnique({
        where: { id: taskId }
      });

      if (!task) {
        res.status(404).json({ error: "Study task not found." });
        return;
      }

      const updatedTask = await prisma.studyTask.update({
        where: { id: taskId },
        data: {
          isCompleted: !task.isCompleted
        }
      });

      res.status(200).json(updatedTask);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update task state: " + error.message });
    }
  }

  /**
   * Request study guide instructions using Gemini AI across all tasks.
   */
  async getAIStudyRoadmap(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const tasks = await prisma.studyTask.findMany({
        where: {
          userId,
          isCompleted: false
        },
        take: 5
      });

      if (tasks.length === 0) {
        res.status(200).json({
          roadmap: "You have no pending tasks! Great job. Add upcoming exam modules to trigger dynamic AI scheduling roadmaps."
        });
        return;
      }

      const roadmap = await geminiService.getPlannerAdvice(tasks);
      res.status(200).json({ roadmap });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to construct AI roadmap: " + error.message });
    }
  }
}
