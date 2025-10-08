import express from 'express';
import Faq from '../model/Faq.js'; // Make sure this is an ES Module too

const router = express.Router();

// ✅ Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// ✅ Create a new FAQ
router.post('/', async (req, res) => {
  try {
    const { question, answer } = req.body;

    const newFaq = new Faq({ question, answer });
    const savedFaq = await newFaq.save();

    console.log('Saved FAQ:', savedFaq);
    res.status(201).json(savedFaq);
  } catch (err) {
    console.error('Error creating FAQ:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update a FAQ by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const updatedFaq = await Faq.findByIdAndUpdate(id, { question, answer }, { new: true });

    if (!updatedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json(updatedFaq);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// ✅ Delete a FAQ by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;
