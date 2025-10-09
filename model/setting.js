import mongoose from "mongoose";

const PageSettingsSchema = new mongoose.Schema({
  heroTitle: { type: String, default: "Start Learning Today" },
  heroSubtitle: { type: String, default: "Pick Your Course" },

  aboutTitle: { type: String, default: "We Are Community Training and Skills Development Office (CTSDO)" },
  aboutDescription: { type: String, default: "We aim to improve access to technical education and job opportunities for Hacienda Dolores residents" },
  aboutButtonText: { type: String, default: "Enroll Now" },
  aboutButtonLink: { type: String, default: "/login" },

  headerImage: { type: String, default: "img/header.jpg" },
  enrollmentStepsImage: { type: String, default: "img/enrollment-steps.jpg" },

  googleMapEmbed: { 
    type: String, 
    default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30825.60999142209!2d120.53474184188458!3d15.079738099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f4bb560fd10b%3A0xd96b63f6379b3384!2sPorac%20Manpower%20Training%20Center!5e0!3m2!1sen!2sph!4v1696516279075!5m2!1sen!2sph"
  }
}, { timestamps: true });

export default mongoose.model("PageSettings", PageSettingsSchema);
