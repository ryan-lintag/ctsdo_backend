import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  idPicture: { type: String, required: true },
  uliNumber: { type: String, required: true }, // removed unique & required
  entryDate: { type: Date, required: true },

  // Learner Info
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  extensionName: { type: String },
  address: {
    street: { type: String, required: true },
    barangay: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    region: { type: String, required: true },
  },
  email: { type: String, required: true },
  facebook: { type: String, required: true },
  contactNumber: { type: String, required: true },
  nationality: { type: String, required: true },

  // Personal Info
  sex: { type: String, required: true },
  civilStatus: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  dob: { type: Date, required: true },
  birthPlace: {
    city: { type: String, required: true },
    province: { type: String, required: true },
    region: { type: String, required: true },
  },
  educationalAttainment: { type: [String], required: true },
  parentGuardian: {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },

  // Classification
  classifications: { type: [String], required: false },
  disabilityType: { type: [String], required: false },
  disabilityCause: { type: [String], required: false },

  // Training Info
  courseId: { type: String, required: true },
  scholarshipType: { type: String, required: true },

  // Consent
  privacyAgreement: { type: Boolean, required: true },

  // Metadata
  dateAccomplished: { type: Date, required: true },
  //applicantSignature: { type: String },
  //registrarSignature: { type: String },
  dateReceived: { type: Date, required: false },
  image: { type: String, required: true },
  thumbmark: { type: String, required: false },

  // Approval / Feedback
  isApproved: {
    type: Boolean,
    default: false,
    required: true // default false, but not required
  },
  feedback: { type: String, default: '' },
});

export default mongoose.model('Registration', registrationSchema);
