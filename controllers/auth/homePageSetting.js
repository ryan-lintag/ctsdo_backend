import express from "express";
import PageSettings from "../../model/setting.js";
import upload from "../../middlewares/upload.js";

const router = express.Router();

// Public: Get settings
router.get("/", async (req, res) => {
  let settings = await PageSettings.findOne();
  if (!settings) {
    settings = new PageSettings();
    await settings.save();
  }
  res.json(settings);
});

// Admin: Update text fields
router.put("/", async (req, res) => {
  try {
    let settings = await PageSettings.findOne();
    if (!settings) settings = new PageSettings(req.body);
    else Object.assign(settings, req.body);

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// Admin: Upload images
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Use the filename that multer assigned and return the uploads path
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl });
});

export default router;
