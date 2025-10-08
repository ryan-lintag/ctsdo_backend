import Registration from '../../model/registration.js';
import Student from '../../model/students.js';
import mongoose from 'mongoose';

// Get all registrations
export const getAllRegistrations = async (req, res) => {
  try {
    // Simple find operation to avoid aggregation issues
    const registrations = await Registration.find({}).sort({ entryDate: -1 }).lean();
    
    // Add requestDate field for frontend compatibility
    const formattedRegistrations = registrations.map(reg => ({
      ...reg,
      requestDate: reg.entryDate
    }));

    res.status(200).json(formattedRegistrations);
  } catch (err) {
    console.error('Error in getAllRegistrations:', err);
    res.status(500).json({ error: err.message });
  }
};


export const getRegistrationsByUser = async (req, res) => {
  try {
    console.log("getRegistrationsByUser called with userId:", req.userId);

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: No userId found" });
    }

    // Fetch only registrations that belong to the logged-in user
    const registrations = await Registration.find({ userId: req.userId })
      .sort({ entryDate: -1 })
      .lean();

    // Add requestDate for frontend compatibility
    const formattedRegistrations = registrations.map((reg) => ({
      ...reg,
      requestDate: reg.entryDate,
    }));

    res.status(200).json(formattedRegistrations);
  } catch (err) {
    console.error("Error in getRegistrationsByUser:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    console.log('getRegistrationById called with ID:', req.params.id);
    console.log('Full request path:', req.path);
    console.log('Full request URL:', req.url);
    
    if (req.params.id === 'user') {
      console.log('ERROR: getRegistrationById was called with "user" - this should not happen!');
      return res.status(400).json({ error: 'Invalid route - user endpoint should not reach here' });
    }
    
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.status(200).json(registration);
  } catch (err) {
    console.error('Error in getRegistrationById:', err);
    res.status(500).json({ error: err.message });
  }
};


export const createRegistration = async (req, res) => {
  try {
    console.log("Registration request body:", req.body);

    // Spread request body and attach userId from auth middleware
    const registrationData = {
      ...req.body,
      userId: req.userId,        // ✅ direct use (no need for new ObjectId here)
      requestDate: new Date(),
    };

    // Helper: safely parse array fields
    const parseArray = (field) => {
      if (registrationData[field] && typeof registrationData[field] === "string") {
        try {
          registrationData[field] = JSON.parse(registrationData[field]);
        } catch {
          registrationData[field] = [registrationData[field]];
        }
      }
    };

    parseArray("educationalAttainment");
    parseArray("classifications");
    parseArray("disabilityType");
    parseArray("disabilityCause");

    // Convert string booleans
    if (registrationData.privacyAgreement === "true") registrationData.privacyAgreement = true;
    if (registrationData.privacyAgreement === "false") registrationData.privacyAgreement = false;

    console.log("Processed registration data:", registrationData);

    // Save to DB
    const newRegistration = new Registration(registrationData);
    const savedRegistration = await newRegistration.save();

    res.status(201).json(savedRegistration);
  } catch (err) {
    console.log("Registration creation error:", err);
    res.status(400).json({ error: err.message });
  }
};



// Update registration by ID
export const updateRegistration = async (req, res) => {
  try {
    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete registration by ID
export const deleteRegistration = async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveRegistration = async (req, res) => {
  const { id } = req.params;

  try {
    // Update the registration document
    const updated = await Registration.findByIdAndUpdate(
      id,
      { isApproved: true, feedback: null },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const student = new Student({
      userId: updated.userId,      // ✅ fixed
      courseId: updated.courseId,
      status: 'In Progress',
      approvedDate: new Date()
    });

    await student.save();

    res.status(200).json({
      message: 'Student approved successfully',
      data: {
        registration: updated,
        student: student
      }
    });
  } catch (error) {
    console.error('Error approving registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const rejectRegistration = async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;

  try {
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ message: 'Feedback is required for rejection' });
    }

    // Update the registration document
    const updated = await Registration.findByIdAndUpdate(
      id,
      { 
        isApproved: false, 
        feedback: feedback.trim() 
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.status(200).json({
      message: 'Registration rejected successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error rejecting registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRegistrationsByMonth = async (req, res) => {
  try {
    // Aggregate registrations by month
    const data = await Registration.aggregate([
      {
        $match: {
          entryDate: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: { $month: "$entryDate" }, // 1 = Jan, 2 = Feb, ...
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Initialize array with 0 totals for all months
    const result = months.map((m, index) => {
      const monthData = data.find(item => item._id === index + 1);
      return { month: m, total: monthData ? monthData.total : 0 };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getRegistrationsByMonth:", err);
    res.status(500).json({ error: "Failed to fetch registrations by month" });
  }
};
