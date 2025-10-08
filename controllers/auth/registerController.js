import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../../model/User.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // should be an App Password if Gmail has 2FA enabled
  },
});

export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role = 'applicant',
      firstName,
      middleName = '',
      lastName,
      dateOfBirth,
    } = req.body;

    // ✅ Normalize email
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // ✅ Limit admins
    if (role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount >= 2) {
        return res.status(400).json({ message: 'Admin limit reached. Only 2 admins allowed.' });
      }
    }

    // ✅ Hash password
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // ✅ Save user
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      role,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      status: 0, // 0 = unverified
    });

    await newUser.save();

    // ✅ Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    // ✅ Generate email verification token
    const token = jwt.sign(
      { email: normalizedEmail },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // ✅ Ensure CLIENT_URL is set
    if (!process.env.CLIENT_URL) {
      throw new Error('CLIENT_URL is not defined in environment variables.');
    }

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    // ✅ Try sending email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: 'Verify Your Email',
        html: `
          <h3>Email Verification</h3>
          <p>Thank you for registering. Please click the button below to verify your email:</p>
          <a href="${verificationLink}" target="_blank" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Verify Email</a>
          <p>This link will expire in 15 minutes.</p>
        `,
      });

      return res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
      return res.status(200).json({
        message: 'User registered, but failed to send verification email. Please contact support.',
      });
    }
  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};
