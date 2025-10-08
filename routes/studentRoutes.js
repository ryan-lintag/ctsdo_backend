import express from 'express';
import {
  getAllStudents,
  markStudentCompleted,
} from '../controllers/auth/studentsController.js';

const router = express.Router();

// Fetch all students
router.get('/', getAllStudents);

// Mark a student as completed
router.put('/:id/complete', markStudentCompleted);

export default router;
