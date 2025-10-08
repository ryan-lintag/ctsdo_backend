import jwt from 'jsonwebtoken';
import User from '../../model/user.js';

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Invalid or missing token.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.status === 1) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    user.status = 1;
    await user.save();

    res.status(200).json({ message: 'Email successfully verified. You can now log in.' });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};
