import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  status: { type: String, required: true },
  requestDate: { type: Date, required: true },
  certificate: String,
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
