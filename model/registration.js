import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  idPicture: { type: String },
  uliNumber: { type: String }, // removed unique & required
  entryDate: { type: Date },

  // Learner Info
  lastName: { type: String },
  firstName: { type: String },
  middleName: { type: String },
  extensionName: { type: String },
  address: {
    street: { type: String },
    barangay: { type: String },
    district: { type: String },
    city: { type: String },
    province: { type: String },
    region: { type: String },
  },
  email: { type: String },
  facebook: { type: String },
  contactNumber: { type: String },
  nationality: { type: String },

  // Personal Info
  sex: { type: String },
  civilStatus: { type: String },
  employmentStatus: { type: String },
  dob: { type: Date },
  birthPlace: {
    city: { type: String },
    province: { type: String },
    region: { type: String },
  },
  educationalAttainment: { type: [String] },
  parentGuardian: {
    name: { type: String },
    address: { type: String },
  },

  // Classification
  classifications: [String],
  disabilityType: [String],
  disabilityCause: [String],

  // Training Info
  courseId: { type: String },
  scholarshipType: { type: String },

  // Consent
  privacyAgreement: { type: Boolean },

  // Metadata
  dateAccomplished: { type: Date },
  //applicantSignature: { type: String },
  //registrarSignature: { type: String },
  dateReceived: { type: Date },
  image: { type: String },
  thumbmark: { type: String },

  // Approval / Feedback
  isApproved: {
    type: Boolean,
    default: false, // default false, but not required
  },
  feedback: { type: String, default: '' },
});

export default mongoose.model('Registration', registrationSchema);
