import bcrypt from 'bcryptjs';
import User from '../../model/user.js';

// Update registration by ID
export const update = async (req, res) => {
  try {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};