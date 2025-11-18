import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['applicant', 'admin'],
    default: 'applicant',
  },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  status: { type: Number, default: 0 }, // 0 = unverified, 1 = verified
  
  // Portfolio fields
  contactNumber: { 
    type: String, 
    default: '',
    maxlength: 15 
  },
  address: { 
    type: String, 
    default: '',
    maxlength: 1000 
  },
  education: [{
    school: { type: String, maxlength: 200 },
    degree: { type: String, maxlength: 100 },
    year: { type: String, maxlength: 100 }
  }],
  experience: [{
    company: { type: String, maxlength: 200 },
    period: { type: String, maxlength: 100 },
    description: { type: String, maxlength: 500 },
  }],
  bio: { 
    type: String, 
    default: '',
    maxlength: 1000 
  },
  profilePicture: { 
    type: String, 
    default: '' 
  },
  socialLinks: [{
    platform: { 
      type: String, 
      enum: ['linkedin', 'github', 'facebook', 'twitter', 'instagram', 'website', 'other']
    },
    url: { 
      type: String,
      validate: {
        validator: function(v) {
          // Only validate if the value exists (not empty)
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'URL must be a valid HTTP/HTTPS URL'
      }
    }
  }],
  highlightedSkills: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
