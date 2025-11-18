import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../model/user.js';

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide your email/username and password.' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { userName: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid username or email.' });
    }

    if (user.status === 0) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/'
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json(userData);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong during login.' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  res.status(200).json({ message: 'Logout success' });
};
