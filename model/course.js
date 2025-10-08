import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String, // URL or base64 if stored directly
  quota: Number,
  status: Number,
  instructor: String,
  startDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        // If endDate exists, startDate should be before endDate
        return !this.endDate || value < this.endDate;
      },
      message: 'Start date must be before end date'
    }
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        // If startDate exists, endDate should be after startDate
        return !this.startDate || value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
}, { timestamps: true });

// Add a method to check if course is currently available
CourseSchema.methods.isAvailable = function() {
  const now = new Date();
  return this.startDate <= now && now <= this.endDate;
};

// Add a method to check if course is upcoming
CourseSchema.methods.isUpcoming = function() {
  const now = new Date();
  return this.startDate > now;
};

// Add a method to check if course is expired
CourseSchema.methods.isExpired = function() {
  const now = new Date();
  return this.endDate < now;
};

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
