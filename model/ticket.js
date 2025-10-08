import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  applicantEmail: {
    type: String,
    required: true,
  },
  adminResponse: String,
  status: {
    type: String,
    default: 'open',
  },
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
