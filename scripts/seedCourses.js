import mongoose from 'mongoose';
import Course from '../model/course.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleCourses = [
  {
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    instructor: 'John Smith',
    quota: 25,
    status: 1,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    imageUrl: 'https://example.com/web-dev.jpg'
  },
  {
    title: 'Digital Marketing Essentials',
    description: 'Master the fundamentals of digital marketing including SEO, social media, and content marketing.',
    instructor: 'Sarah Johnson',
    quota: 30,
    status: 1,
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-06-15'),
    imageUrl: 'https://example.com/digital-marketing.jpg'
  },
  {
    title: 'Data Analysis with Python',
    description: 'Learn data analysis techniques using Python, pandas, and visualization libraries.',
    instructor: 'Michael Chen',
    quota: 20,
    status: 1,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    imageUrl: 'https://example.com/python-data.jpg'
  },
  {
    title: 'Graphic Design Basics',
    description: 'Introduction to graphic design principles using Adobe Creative Suite.',
    instructor: 'Emily Rodriguez',
    quota: 15,
    status: 1,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-07-01'),
    imageUrl: 'https://example.com/graphic-design.jpg'
  },
  {
    title: 'Mobile App Development',
    description: 'Build mobile applications for iOS and Android using React Native.',
    instructor: 'David Kim',
    quota: 18,
    status: 1,
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-08-31'),
    imageUrl: 'https://example.com/mobile-dev.jpg'
  },
  {
    title: 'Cybersecurity Fundamentals',
    description: 'Learn essential cybersecurity concepts and best practices for protecting digital assets.',
    instructor: 'Lisa Wang',
    quota: 22,
    status: 1,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-05-15'),
    imageUrl: 'https://example.com/cybersecurity.jpg'
  },
  {
    title: 'Project Management Professional',
    description: 'Comprehensive project management training covering methodologies, tools, and best practices.',
    instructor: 'Robert Brown',
    quota: 25,
    status: 1,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-09-30'),
    imageUrl: 'https://example.com/project-mgmt.jpg'
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'Introduction to Amazon Web Services and cloud computing fundamentals.',
    instructor: 'Jennifer Lee',
    quota: 20,
    status: 1,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-31'),
    imageUrl: 'https://example.com/aws-cloud.jpg'
  }
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ctsdo');
    console.log('Connected to MongoDB');

    // Clear existing courses (optional - remove this if you want to keep existing data)
    // await Course.deleteMany({});
    // console.log('Cleared existing courses');

    // Insert sample courses
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`Successfully inserted ${insertedCourses.length} sample courses:`);
    
    insertedCourses.forEach(course => {
      console.log(`- ${course.title} (${course.startDate.toDateString()} - ${course.endDate.toDateString()})`);
    });

    console.log('\nSample courses have been added to the database!');
    console.log('You can now test the calendar functionality with these courses.');
    
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedCourses();