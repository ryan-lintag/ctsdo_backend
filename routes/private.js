import express from "express";
import User from '../model/User.js';
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.get('/', checkAuth, (req, res) => {
  res.json("You accessed the private route");
});

router.get('/applicants', checkAuth, async (req, res) => {
  try {
    const applicants = await User.find({ role: 'applicant' }).select('-password'); 
    res.json(applicants);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/profile', checkAuth, async (req, res) => {
  try {
    const userId = req.userId; // Provided by checkAuth middleware
    const user = await User.findById(userId).select('-password'); 
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/admin-count", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "admin" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





export default router;
