import express from "express";
import PageSettings from "../../model/setting.js";

import fs from "fs";
import path from"path";
import multer from"multer";

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

// Configure multer to store files in /tmp (Vercel-safe)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Read file buffer and convert to Base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64String = fileBuffer.toString("base64");

    // Build the data URL
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return res.json({ base64: dataUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to process image" });
  }
});

export default router;
