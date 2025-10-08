import User from '../../model/user.js';
import Registration from '../../model/registration.js';
import Application from '../../model/application.js';
import Course from '../../model/course.js';

export const getCounts = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const registrations = await Registration.countDocuments();
    const applications = await Application.countDocuments();
    const courses = await Course.countDocuments();

    res.status(200).json({ users, registrations, applications, courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
