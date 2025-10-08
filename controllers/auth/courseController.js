import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Course from '../model/course.js';

const router = express.Router();

// Ensure 'uploads' folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 1683999123.jpg
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Create and save new course
    const course = new Course({ title, description, imageUrl });
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to create course', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
});

export default router;
