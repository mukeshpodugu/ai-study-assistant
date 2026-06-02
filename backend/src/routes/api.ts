import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { DocumentController } from '../controllers/document.controller';
import { QuizController } from '../controllers/quiz.controller';
import { FlashcardController } from '../controllers/flashcard.controller';
import { PlannerController } from '../controllers/planner.controller';

const router = Router();

// Configure multer file upload structure
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and plain text documents are supported.'));
    }
  }
});

// Initialize controller instances
const docController = new DocumentController();
const quizController = new QuizController();
const flashcardController = new FlashcardController();
const plannerController = new PlannerController();

// --- Document Routes ---
router.post('/documents/upload', upload.single('document'), (req, res) => docController.uploadDocument(req, res));
router.post('/documents/chat', (req, res) => docController.chatWithDocument(req, res));
router.get('/documents/user/:userId', (req, res) => docController.getUserDocuments(req, res));

// --- Quiz Routes ---
router.post('/quizzes/generate', (req, res) => quizController.generateNewQuiz(req, res));
router.post('/quizzes/submit', (req, res) => quizController.submitQuizScore(req, res));
router.get('/quizzes/user/:userId', (req, res) => quizController.getUserQuizzes(req, res));

// --- Flashcard Routes ---
router.post('/flashcards/generate', (req, res) => flashcardController.generateDeck(req, res));
router.post('/flashcards/review', (req, res) => flashcardController.reviewCard(req, res));
router.get('/flashcards/user/:userId', (req, res) => flashcardController.getUserDecks(req, res));
router.get('/flashcards/deck/:deckId/review', (req, res) => flashcardController.getDeckCardsForReview(req, res));

// --- Planner Routes ---
router.get('/planner/tasks/:userId', (req, res) => plannerController.getTasks(req, res));
router.post('/planner/tasks', (req, res) => plannerController.createTask(req, res));
router.patch('/planner/tasks/:taskId/toggle', (req, res) => plannerController.toggleTaskComplete(req, res));
router.get('/planner/roadmap/:userId', (req, res) => plannerController.getAIStudyRoadmap(req, res));

// Default health probe
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

export default router;
