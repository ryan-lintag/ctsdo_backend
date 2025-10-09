import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../model/User.js';


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not registered' });

    if (user.status === 0) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });

    delete user.password;
    res.status(200).json(user);

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong during login' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(200).json({ message: 'Logout success' });
};
