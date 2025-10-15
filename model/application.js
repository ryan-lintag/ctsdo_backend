import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referenceNumber: { type: String, required: false },
    uliNumber: { type: String, required: false, unique: false },
    firstName: { type: String, required: false },
    middleName: { type: String, required: false },
    middleInitial: { type: String, required: false },
    lastName: { type: String, required: false },
    extensionName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    dateOfApplication: { type: Date, required: true },
    age: { type: Number, required: false },
    birthPlace: {
      region: { type: String, required: false },
      province: { type: String, required: false },
      city: { type: String, required: false },
    },
    sex: { type: String, required: false },
    civilStatus: { type: [String], required: false },
    motherName: { type: String, required: false },
    fatherName: { type: String, required: false },

    nameOfSchool: { type: String, required: false },
    addressOfSchool: { type: String, required: false },

    contactInfo: {
      mobile: { type: String, required: false },
      telephone: { type: String, required: false },
      email: { type: String, required: false },
      fax: { type: String, required: false },
      others: { type: String, required: false },
    },
    address: {
      houseNumberStreet: { type: String },
      barangay: { type: String, required: false },
      district: { type: String, required: false },
      city: { type: String, required: false },
      province: { type: String, required: false },
      region: { type: String },
      zipCode: { type: String, required: false },
    },
    education: {
      highestEducationalAttainment: [String],
    },

    trainingCenter: { type: String, required: false },
    titleOfAssessment: { type: [String], required: false },

    workExperience: [],

    trainingsAttended: [],

    licensureExamsPassed: [],

    competencyAssessmentsPassed: [],

    pictures: [],

    idPicture: { type: String, required: false },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false }
);

export default mongoose.model("Application", applicationSchema);
