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
  },

  certificateDesign: {
    backgroundImage: { type: String, default: "img/certificate.png" },
    containerWidth: { type: String, default: "1000px" },
    containerHeight: { type: String, default: "707px" },
    
    // Logo images
    logo1: { type: String, default: "" },
    logo2: { type: String, default: "" },
    logo3: { type: String, default: "" },
    
    // Certificate title and subtitle
    certificateTitle: { type: String, default: "CERTIFICATE" },
    certificateSubtitle: { type: String, default: "Of Completion" },
    presentedToText: { type: String, default: "This certificate is presented to:" },
    
    // Title styling
    titleFontSize: { type: String, default: "60px" },
    titleFontFamily: { type: String, default: "'Arial', sans-serif" },
    titleColor: { type: String, default: "#000000" },
    titleFontWeight: { type: String, default: "bold" },
    
    // Subtitle styling
    subtitleFontSize: { type: String, default: "32px" },
    subtitleFontFamily: { type: String, default: "'Georgia', serif" },
    subtitleColor: { type: String, default: "#333333" },
    
    // Presented to text styling
    presentedToFontSize: { type: String, default: "18px" },
    presentedToFontFamily: { type: String, default: "'Georgia', serif" },
    presentedToColor: { type: String, default: "#333333" },
    
    // Name styling
    nameFontSize: { type: String, default: "80px" },
    nameFontFamily: { type: String, default: "'Imperial Script'" },
    nameColor: { type: String, default: "#cfaa51" },
    nameLetterSpacing: { type: String, default: "2px" },
    nameFontWeight: { type: String, default: "bold" },
    namePaddingTop: { type: String, default: "20px" },
    
    // Text block styling
    textBlockFontFamily: { type: String, default: "'Georgia', serif" },
    textBlockFontSize: { type: String, default: "20px" },
    textBlockColor: { type: String, default: "#000000" },
    textBlockLetterSpacing: { type: String, default: "1px" },
    
    // Signature styling
    signatureNameFontSize: { type: String, default: "20px" },
    signatureTitleFontSize: { type: String, default: "16px" },
    signatureNameFontWeight: { type: String, default: "bold" },
    signatureColor: { type: String, default: "#000000" },
    
    // Signature content
    leftSignatureName: { type: String, default: "HON. MYLA B. CLARETE" },
    leftSignatureTitle: { type: String, default: "ACTING MUNICIPAL MAYOR" },
    rightSignatureName: { type: String, default: "JOHN PAUL L. MARTINEZ EN.P" },
    rightSignatureTitle: { type: String, default: "OIC - CTSDO" }
  }
}, { timestamps: true });

export default mongoose.model("PageSettings", PageSettingsSchema);
