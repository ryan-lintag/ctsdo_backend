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
    default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30814.727311615177!2d120.50327758173422!3d15.11209407047506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33968cbf29ec7ebb%3A0x66f07782278c9b64!2sDolores%20(Hacienda%20Dolores)%2C%20Porac%2C%20Pampanga%2C%20Philippines!5e0!3m2!1sen!2sph"
  }
}, { timestamps: true });

export default mongoose.model("PageSettings", PageSettingsSchema);
