import Student from '../../model/students.js';
import User from '../../model/user.js'; // your User model
import course from '../../model/course.js';


export const getAllStudents = async (req, res) => {
  try {
    // Populate both user and course
    const students = await Student.find({})
      .populate({ path: 'userId', select: 'firstName lastName email' })
      .populate({ path: 'courseId', select: 'title startDate endDate' })
      .lean();

    const result = students.map(s => ({
      ...s,
      name: s.userId ? `${s.userId.firstName} ${s.userId.lastName}` : 'Unknown',
      courseTitle: s.courseId ? s.courseId.title : 'Unknown',
      courseStartDate: s.courseId?.startDate,
      courseEndDate: s.courseId?.endDate,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: err.message });
  }
};

export const markStudentCompleted = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ error: 'Student not found' });

    const today = new Date();
    const courseEnd = new Date(student.endDate); // make sure endDate is stored

    if (today < courseEnd) {
      return res.status(400).json({ error: 'Course has not ended yet' });
    }

    student.status = 'Completed';
    await student.save();

    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};