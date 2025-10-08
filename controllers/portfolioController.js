import User from '../model/user.js';
import Student from '../model/students.js';
import Course from '../model/course.js';
import Certificate from '../model/certificate.js';

// Get student portfolio with completed courses
export const getPortfolio = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Fetch user profile
    const user = await User.findById(studentId).select('-password -resetToken -resetTokenExpiration');
    if (!user) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch completed courses with course details
    const completedCourses = await Student.aggregate([
      {
        $match: {
          userId: studentId,
          status: 'Completed'
        }
      },
      {
        $addFields: {
          courseId: { $toObjectId: "$courseId" }
        }
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $unwind: "$courseDetails"
      },
      {
        $lookup: {
          from: "certificates",
          let: { userId: "$userId", courseId: "$courseId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: [{ $toObjectId: "$courseId" }, "$$courseId"] }
                  ]
                }
              }
            }
          ],
          as: "certificate"
        }
      },
      {
        $project: {
          courseId: 1,
          courseTitle: "$courseDetails.title",
          courseDescription: "$courseDetails.description",
          instructor: "$courseDetails.instructor",
          startDate: "$courseDetails.startDate",
          endDate: "$courseDetails.endDate",
          completionDate: "$approvedDate",
          status: 1,
          certificate: { $arrayElemAt: ["$certificate", 0] },
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $sort: { completionDate: -1 }
      }
    ]);

    // Calculate portfolio statistics
    const stats = {
      totalCompletedCourses: completedCourses.length,
      certificatesEarned: completedCourses.filter(course => course.certificate).length,
      skillsCount: user.highlightedSkills ? user.highlightedSkills.length : 0,
      socialLinksCount: user.socialLinks ? user.socialLinks.length : 0
    };

    const portfolio = {
      profile: user,
      completedCourses,
      stats
    };

    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio', details: error.message });
  }
};

// Update student portfolio
export const updatePortfolio = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { bio, profilePicture, socialLinks, highlightedSkills, contactNumber, address, education, experience } = req.body;

    // Validate that the user exists and is an applicant
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (user.role !== 'applicant') {
      return res.status(403).json({ error: 'Only applicants can update portfolios' });
    }

    // Validate bio
    if (bio && bio.length > 1000) {
      return res.status(400).json({ error: 'Bio must be maximum 1000 characters' });
    }

    // Validate skills
    if (highlightedSkills && Array.isArray(highlightedSkills)) {
      if (highlightedSkills.length > 20) {
        return res.status(400).json({ error: 'Maximum 20 skills allowed' });
      }
      for (const skill of highlightedSkills) {
        if (typeof skill !== 'string' || skill.length > 50) {
          return res.status(400).json({ error: 'Each skill must be a string with maximum 50 characters' });
        }
      }
    }

    // Update portfolio fields
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (highlightedSkills !== undefined) updateData.highlightedSkills = highlightedSkills;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (address !== undefined) updateData.address = address;
    if (education !== undefined) updateData.education = education;
    if (experience !== undefined) updateData.experience = experience;

    // Validate and process social links
    if (socialLinks && Array.isArray(socialLinks)) {
      // Filter out empty social links and validate the rest
      const validSocialLinks = socialLinks.filter(link => link.platform && link.url);
      
      for (const link of validSocialLinks) {
        if (!/^https?:\/\/.+/.test(link.url)) {
          return res.status(400).json({ error: 'Social link URLs must be valid HTTP/HTTPS URLs' });
        }
      }
      
      // Update socialLinks to only include valid ones
      updateData.socialLinks = validSocialLinks;
    }

    const updatedUser = await User.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpiration');

    res.json({
      message: 'Portfolio updated successfully',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ error: 'Failed to update portfolio', details: error.message });
  }
};

// Get public portfolio (for sharing)
export const getPublicPortfolio = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Fetch user profile (excluding sensitive information)
    const user = await User.findById(studentId).select('firstName middleName lastName bio profilePicture socialLinks highlightedSkills createdAt');
    if (!user) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch completed courses with course details
    const completedCourses = await Student.aggregate([
      {
        $match: {
          userId: studentId,
          status: 'Completed'
        }
      },
      {
        $addFields: {
          courseId: { $toObjectId: "$courseId" }
        }
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $unwind: "$courseDetails"
      },
      {
        $project: {
          courseTitle: "$courseDetails.title",
          courseDescription: "$courseDetails.description",
          instructor: "$courseDetails.instructor",
          completionDate: "$approvedDate",
          duration: {
            $dateDiff: {
              startDate: "$courseDetails.startDate",
              endDate: "$courseDetails.endDate",
              unit: "day"
            }
          }
        }
      },
      {
        $sort: { completionDate: -1 }
      }
    ]);

    const portfolio = {
      profile: user,
      completedCourses,
      stats: {
        totalCompletedCourses: completedCourses.length,
        skillsCount: user.highlightedSkills ? user.highlightedSkills.length : 0
      }
    };

    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio', details: error.message });
  }
};