import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  status: { type: String, required: true }, // In Progress, Cancelled, Completed
  approvedDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
