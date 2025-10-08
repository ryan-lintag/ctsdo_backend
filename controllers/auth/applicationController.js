import Application from '../../model/application.js';
import Student from '../../model/students.js';

// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ entryDate: -1 }).lean();
    const formattedApplications = applications.map(app => ({
      ...app,
      requestDate: app.entryDate
    }));
    res.status(200).json(formattedApplications);
  } catch (err) {
    console.error('Error in getAllApplications:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get applications by user
export const getApplicationsByUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: userId missing" });
    }

    // Fetch applications belonging to the logged-in user
    const applications = await Application.find({ userId: req.userId })
      .sort({ entryDate: -1 })
      .lean();

    // Add requestDate field (fall back to createdAt if entryDate missing)
    const formattedApplications = applications.map(app => ({
      ...app,
      requestDate: app.entryDate || app.createdAt,
    }));

    res.status(200).json(formattedApplications);
  } catch (err) {
    console.error("Error in getApplicationsByUser:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    if (req.params.id === 'user') {
      return res.status(400).json({ error: 'Invalid route - user endpoint should not reach here' });
    }
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    console.error('Error in getApplicationById:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new application
export const createApplication = async (req, res) => {
  try {
    console.log("Application request body:", req.body);

    // Include userId and requestDate
    const applicationData = {
      ...req.body,
      userId: req.userId,      // ✅ attach userId from auth middleware
      requestDate: new Date(),
    };

    // Parse JSON string fields back to arrays
    ['educationalAttainment', 'classifications', 'disabilityType', 'disabilityCause'].forEach(field => {
      if (applicationData[field] && typeof applicationData[field] === 'string') {
        try {
          applicationData[field] = JSON.parse(applicationData[field]);
        } catch (e) {
          applicationData[field] = [applicationData[field]];
        }
      }
    });

    // Convert boolean strings to actual booleans
    if (applicationData.privacyAgreement === 'true') {
      applicationData.privacyAgreement = true;
    } else if (applicationData.privacyAgreement === 'false') {
      applicationData.privacyAgreement = false;
    }

    // Create and save application
    const newApplication = new Application(applicationData);
    const savedApplication = await newApplication.save();

    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Update application by ID
export const updateApplication = async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete application by ID
export const deleteApplication = async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Application.findByIdAndUpdate(
      id,
      { isApproved: true, feedback: null },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }
    const student = new Student({
      userId: updated._id,
      courseId: updated.courseId,
      status: 'In Progress',
      approvedDate: new Date()
    });
    await student.save();
    res.status(200).json({
      message: 'Student approved successfully',
      data: {
        application: updated,
        student: student
      }
    });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectApplication = async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;
  try {
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ message: 'Feedback is required for rejection' });
    } 
    const updated = await Application.findByIdAndUpdate(
      id,
      { isApproved: false, feedback: feedback.trim() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({
      message: 'Application rejected successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 

export const getApplicationsByMonth = async (req, res) => {
  try {
    // Aggregate applications by month
    const data = await Application.aggregate([
      {
        $match: {
          dateOfApplication: { $exists: true, $ne: null } // ✅ match dateOfApplication
        }
      },
      {
        $group: {
          _id: { $month: "$dateOfApplication" }, // 1 = Jan, 2 = Feb, ...
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Fill array with 0 totals for all months
    const result = months.map((m, index) => {
      const monthData = data.find(item => item._id === index + 1);
      return { month: m, total: monthData ? monthData.total : 0 };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getApplicationsByMonth:", err);
    res.status(500).json({ error: "Failed to fetch applications by month" });
  }
};
