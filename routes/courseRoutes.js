import express from 'express';
import Course from '../model/course.js';
import Student from '../model/students.js';
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      startDate,
      endDate
    } = req.body;

    // Create and save new course
    const course = new Course({
      title,
      description,
      instructor,
      startDate,
      endDate,
      status: 1
    });
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to create course', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to update course', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { available } = req.query;
    let query = { status: { $in: [0, 1] } };
    
    // If available=true, only return courses that are currently available
    if (available === 'true') {
      const now = new Date();
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }
    
    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
});

router.get('/completed', checkAuth, async (req, res) => {
  try {
    console.log (req.userId)
    const studentCourses = await Student.aggregate([
      {
        $match: {
          userId: req.userId,
          status: 'Completed'
        }
      },
      {
        $addFields: {
          courseId: { $toObjectId: "$courseId" }
        }
      }, {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "studentCourse"
        }
      },
      { $unwind: "$studentCourse" },
      {
        $project: {
          userId: 1,
          courseId: 1,
          courseTitle: '$studentCourse.title'
        }
      }]).exec();
    res.json(studentCourses);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { status: 2 },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
});

export default router;
