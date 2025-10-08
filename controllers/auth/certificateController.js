import Certificate from '../../model/certificate.js';

// Get all certificates
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.aggregate([
      {
        $addFields: {
          courseId: { $toObjectId: "$courseId" },
          userId: { $toObjectId: "$userId" }
        }
      }, {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "studentCourse"
        }
      },
      { $unwind: "$studentCourse" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "studentProfile"
        }
      },
      { $unwind: "$studentProfile" },
      {
        $project: {
          userId: 1,
          firstName: '$studentProfile.firstName',
          middleName: '$studentProfile.middleName',
          lastName: '$studentProfile.lastName',
          courseId: 1,
          courseTitle: '$studentCourse.title',
          status: 1
        }
      }]).exec();
    res.status(200).json(certificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all certificates by user
export const getAllCertificatesByUser = async (req, res) => {
  try {
    const userCertificates = await Certificate.aggregate([
      { $match: { userId: req.userId } },
      {
        $addFields: {
          courseId: { $toObjectId: "$courseId" }
        }
      }, {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "studentCourse"
        }
      },
      { $unwind: "$studentCourse" },
      {
        $project: {
          userId: 1,
          courseId: 1,
          courseTitle: '$studentCourse.title',
          status: 1
        }
      }]).exec();
    res.status(200).json(userCertificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get certificate by ID
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.status(200).json(certificate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new certificate
export const createCertificate = async (req, res) => {
  try {
    const {
      userId,
      courseId
    } = req.body;

    const newCertificate = new Certificate({
      userId,
      courseId,
      status: 'In Progress',
      requestDate: new Date()
    });

    const savedCertificate = await newCertificate.save();
    res.status(201).json(savedCertificate);
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};

// Update certificate by ID
export const updateCertificate = async (req, res) => {
  try {
    // Pick only allowed fields from req.body
    const { status, courseId, certificate } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (courseId) updateData.courseId = courseId;
    if (certificate) updateData.certificate = certificate;

    const updated = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating certificate:", err);
    res.status(400).json({ error: err.message });
  }
};


// Delete certificate by ID
export const deleteCertificate = async (req, res) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};