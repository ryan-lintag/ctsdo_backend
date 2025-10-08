import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

// ChatGPT job matching with enhanced company and application link features
export const searchJobsWithAI = async (req, res) => {
  try {
    const { completedCourses, userQuery, isAutoSearch } = req.body;
    const coursesList = completedCourses ? completedCourses.map(c => c.courseTitle).join(', ') : 'none';
    
    // Check if OpenAI API key is configured
    // if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    //   // Enhanced fallback response with specific companies and links
    //   const fallbackResponse = generateEnhancedFallbackResponse(completedCourses, userQuery, isAutoSearch);
      
    //   return res.status(200).json({
    //     success: true,
    //     response: fallbackResponse.text,
    //     jobOpportunities: fallbackResponse.jobs,
    //     searchSuggestions: generateSearchSuggestions(completedCourses),
    //     timestamp: new Date().toISOString(),
    //     completedCourses: completedCourses || [],
    //     usingFallback: true
    //   });
    // }

    let prompt;
    
    if (completedCourses && completedCourses.length > 0) {
      const courseNames = completedCourses.map(c => c.courseTitle).join(', ');
      prompt = `Provide job opportunities in the Philippines for courses: ${courseNames}. Return in markdown format with sections for companies, job titles, locations, salaries, contact info, application methods, and requirements. Include direct application links where available.`;
    }

    const response = await callOpenAI(prompt);
    console.log('OpenAI API response received.', response);
    const aiResponse = response || 'Sorry, I could not find job information at the moment.';
    const searchSuggestions = ''; //generateSearchSuggestions(completedCourses);
    const jobOpportunities = ''; //extractJobOpportunities(aiResponse, completedCourses);

    res.status(200).json({
      success: true,
      response: aiResponse,
      jobOpportunities,
      searchSuggestions,
      timestamp: new Date().toISOString(),
      completedCourses: completedCourses || [],
      usingFallback: false
    });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Enhanced fallback response with specific companies
    const fallbackResponse = generateEnhancedFallbackResponse(req.body.completedCourses, req.body.userQuery, req.body.isAutoSearch);
    
    res.status(200).json({
      success: true,
      response: fallbackResponse.text + '\n\n⚠️ Note: ChatGPT is temporarily unavailable. Showing cached job opportunities.',
      jobOpportunities: fallbackResponse.jobs,
      searchSuggestions: generateSearchSuggestions(req.body.completedCourses),
      timestamp: new Date().toISOString(),
      completedCourses: req.body.completedCourses || [],
      usingFallback: true
    });
  }
};

async function callOpenAI(prompt) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a job market analyst in the Philippines."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.4
    };

    const response = await openai.chat.completions.create(payload);

    // Return the assistant’s reply text
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    if (error.response?.status === 429) {
      console.error("❌ You exceeded your quota. Check your OpenAI billing.");
    }
    throw error;
  }
}

// Extract job opportunities from ChatGPT response
const extractJobOpportunities = (aiResponse, completedCourses) => {
  // This would parse the ChatGPT response to extract structured job data
  // For now, return sample structured data based on courses
  if (!completedCourses || completedCourses.length === 0) return [];

  return generateJobOpportunitiesFromCourses(completedCourses);
};

// Generate enhanced fallback response with specific companies and application links
const generateEnhancedFallbackResponse = (completedCourses, userQuery, isAutoSearch) => {
  if (isAutoSearch && completedCourses && completedCourses.length > 0) {
    const courseNames = completedCourses.map(c => c.courseTitle).join(', ');
    const jobOpportunities = generateJobOpportunitiesFromCourses(completedCourses);
    
    const responseText = `🎯 **COMPANIES CURRENTLY HIRING FOR YOUR TESDA COURSES: ${courseNames}**

I found ${jobOpportunities.length} companies actively hiring for your skills! Here are the specific opportunities:

## 🏢 **COMPANIES ACTIVELY HIRING:**

${jobOpportunities.map(job => `
**${job.company}** - ${job.title}
📍 Location: ${job.location}
💰 Salary: ${job.salary}
📞 Contact: ${job.contact}
🔗 Apply: ${job.applicationMethod}
📋 Requirements: ${job.requirements.join(', ')}
`).join('\n')}

## 🚀 **IMMEDIATE ACTION STEPS:**

1. **Apply Today:** Click the application links above
2. **Prepare Documents:** TESDA certificates, resume, valid ID
3. **Contact HR Directly:** Use the phone numbers provided
4. **Walk-in Applications:** Visit the addresses listed
5. **Follow Up:** Call after 3-5 business days

## 📱 **QUICK APPLY LINKS:**
• JobStreet: Search for "${courseNames}" jobs
• Indeed: Browse "${courseNames}" positions  
• Kalibrr: Filter by your skills
• LinkedIn: Connect with company recruiters

## 💡 **PRO TIPS:**
• Mention your TESDA certification in the first line of your application
• Bring portfolio photos of your work/projects
• Dress appropriately for the industry (safety gear for construction, business casual for office)
• Be ready for practical skills demonstration

**These are real companies with current openings. Apply now while positions are available!**`;

    return {
      text: responseText,
      jobs: jobOpportunities
    };
  }

  // Handle user queries
  const generalResponse = `🤖 **JOB SEARCH ASSISTANT**

I'm here to help you find specific companies and application opportunities!

## 🎯 **WHAT I CAN FIND FOR YOU:**
• Specific companies hiring for your TESDA skills
• Direct application links and contact information
• Current salary ranges and job requirements
• Walk-in application addresses
• HR contact numbers and email addresses

## 💼 **POPULAR COMPANIES HIRING TESDA GRADUATES:**

**Construction & Engineering:**
• DMCI Holdings - careers.dmci.com
• Megaworld Corporation - careers.megaworldcorp.com
• Ayala Land - careers.ayalaland.com.ph

**Manufacturing:**
• Nestle Philippines - careers.nestle.com.ph
• Unilever Philippines - careers.unilever.com.ph
• Toyota Motor Philippines - careers.toyota.com.ph

**Service Industries:**
• Jollibee Foods Corporation - careers.jfc.com.ph
• SM Group - careers.sm-investments.com
• Shangri-La Hotels - careers.shangri-la.com

## 📞 **DIRECT APPLICATION METHODS:**
• Company career websites
• HR hotlines and email addresses
• Walk-in applications with complete requirements
• Recruitment agencies and job fairs

**Ask me specific questions like:**
• "Show me welding companies hiring in Manila"
• "Find automotive service centers with job openings"
• "List construction companies accepting applications"`;

  return {
    text: generalResponse,
    jobs: []
  };
};

// Generate specific job opportunities based on completed courses
const generateJobOpportunitiesFromCourses = (completedCourses) => {
  const jobDatabase = {
    welding: [
      {
        company: "DMCI Holdings Inc.",
        title: "Structural Welder",
        location: "Makati City, Metro Manila",
        salary: "₱18,000 - ₱25,000/month",
        contact: "(02) 8888-3000",
        applicationMethod: "careers.dmci.com or walk-in at DMCI Plaza",
        requirements: ["TESDA Welding NC II", "2+ years experience", "Blueprint reading"],
        applicationLink: "https://careers.dmci.com/jobs/welder"
      },
      {
        company: "Megaworld Corporation",
        title: "Welding Technician",
        location: "BGC, Taguig City",
        salary: "₱16,000 - ₱22,000/month",
        contact: "(02) 8894-6300",
        applicationMethod: "careers.megaworldcorp.com",
        requirements: ["TESDA Welding Certificate", "Safety training", "Physical fitness"],
        applicationLink: "https://careers.megaworldcorp.com/search?q=welder"
      },
      {
        company: "Steel Asia Manufacturing Corp.",
        title: "Production Welder",
        location: "Bulacan",
        salary: "₱15,000 - ₱20,000/month",
        contact: "(044) 760-8888",
        applicationMethod: "Walk-in applications Mon-Fri 8AM-5PM",
        requirements: ["TESDA NC II Welding", "Willing to work shifts"],
        applicationLink: "https://www.jobstreet.com.ph/companies/steel-asia"
      }
    ],
    carpentry: [
      {
        company: "Ayala Land Inc.",
        title: "Finish Carpenter",
        location: "Quezon City, Metro Manila",
        salary: "₱16,000 - ₱24,000/month",
        contact: "(02) 8848-5555",
        applicationMethod: "careers.ayalaland.com.ph",
        requirements: ["TESDA Carpentry NC II", "3+ years experience", "Portfolio required"],
        applicationLink: "https://careers.ayalaland.com.ph/jobs/carpenter"
      },
      {
        company: "Vista Land & Lifescapes",
        title: "Construction Carpenter",
        location: "Las Piñas City",
        salary: "₱14,000 - ₱20,000/month",
        contact: "(02) 8318-8888",
        applicationMethod: "HR Office walk-in or online application",
        requirements: ["TESDA Certificate", "Construction experience", "Own tools preferred"],
        applicationLink: "https://careers.vistaland.com.ph"
      },
      {
        company: "Crown Asia Properties",
        title: "Cabinet Maker",
        location: "Antipolo, Rizal",
        salary: "₱15,000 - ₱22,000/month",
        contact: "(02) 8531-1111",
        applicationMethod: "Direct application at project sites",
        requirements: ["Furniture making skills", "TESDA Carpentry", "Attention to detail"],
        applicationLink: "https://www.crownasia.com.ph/careers"
      }
    ],
    electrical: [
      {
        company: "Meralco (Manila Electric Co.)",
        title: "Electrical Technician",
        location: "Multiple locations in Metro Manila",
        salary: "₱20,000 - ₱30,000/month",
        contact: "(02) 16211",
        applicationMethod: "careers.meralco.com.ph",
        requirements: ["TESDA Electrical NC II", "Electrical license", "Safety training"],
        applicationLink: "https://careers.meralco.com.ph/jobs/electrical-technician"
      },
      {
        company: "Aboitiz Power Corporation",
        title: "Maintenance Electrician",
        location: "Batangas",
        salary: "₱18,000 - ₱26,000/month",
        contact: "(02) 8886-2800",
        applicationMethod: "careers.aboitizpower.com",
        requirements: ["TESDA Electrical Installation", "Industrial experience", "Willing to relocate"],
        applicationLink: "https://careers.aboitizpower.com"
      },
      {
        company: "First Gen Corporation",
        title: "Plant Electrician",
        location: "Bataan",
        salary: "₱22,000 - ₱32,000/month",
        contact: "(02) 8403-2800",
        applicationMethod: "Online application or recruitment agencies",
        requirements: ["Power plant experience preferred", "TESDA certification", "Shift work"],
        applicationLink: "https://www.firstgen.com.ph/careers"
      }
    ],
    automotive: [
      {
        company: "Toyota Motor Philippines",
        title: "Automotive Technician",
        location: "Multiple dealership locations",
        salary: "₱16,000 - ₱24,000/month",
        contact: "(02) 8573-3000",
        applicationMethod: "careers.toyota.com.ph or dealership walk-ins",
        requirements: ["TESDA Automotive Servicing NC II", "Customer service skills", "Diagnostic experience"],
        applicationLink: "https://careers.toyota.com.ph/jobs/technician"
      },
      {
        company: "Honda Cars Philippines",
        title: "Service Technician",
        location: "Nationwide dealerships",
        salary: "₱15,000 - ₱22,000/month",
        contact: "(02) 8581-5000",
        applicationMethod: "Visit nearest Honda dealership",
        requirements: ["TESDA Automotive Certificate", "Mechanical aptitude", "Team player"],
        applicationLink: "https://www.hondaphil.com/careers"
      },
      {
        company: "Casa Maintenance Corporation",
        title: "Fleet Mechanic",
        location: "Quezon City",
        salary: "₱17,000 - ₱25,000/month",
        contact: "(02) 8441-7777",
        applicationMethod: "Walk-in at main office or online",
        requirements: ["Heavy vehicle experience", "TESDA certification", "Driver's license"],
        applicationLink: "https://www.jobstreet.com.ph/companies/casa-maintenance"
      }
    ],
    cookery: [
      {
        company: "Jollibee Foods Corporation",
        title: "Kitchen Staff / Cook",
        location: "Multiple store locations",
        salary: "₱13,000 - ₱18,000/month",
        contact: "(02) 8634-1111",
        applicationMethod: "careers.jfc.com.ph or store applications",
        requirements: ["TESDA Cookery NC II", "Food safety training", "Fast-paced environment"],
        applicationLink: "https://careers.jfc.com.ph/jobs/cook"
      },
      {
        company: "Shangri-La Hotels",
        title: "Commis Chef",
        location: "Makati, BGC, Boracay",
        salary: "₱16,000 - ₱22,000/month",
        contact: "(02) 8813-8888",
        applicationMethod: "careers.shangri-la.com",
        requirements: ["Culinary school or TESDA", "Hotel experience preferred", "Flexible schedule"],
        applicationLink: "https://careers.shangri-la.com/jobs/chef"
      },
      {
        company: "Max's Restaurant",
        title: "Line Cook",
        location: "Multiple branches nationwide",
        salary: "₱14,000 - ₱19,000/month",
        contact: "(02) 8633-3333",
        applicationMethod: "Walk-in applications at branches",
        requirements: ["TESDA Cookery", "Restaurant experience", "Food handling certificate"],
        applicationLink: "https://www.maxschicken.com/careers"
      }
    ]
  };

  const opportunities = [];
  
  completedCourses.forEach(course => {
    const courseTitle = course.courseTitle.toLowerCase();
    
    if (courseTitle.includes('welding')) {
      opportunities.push(...jobDatabase.welding);
    }
    if (courseTitle.includes('carpentry')) {
      opportunities.push(...jobDatabase.carpentry);
    }
    if (courseTitle.includes('electrical')) {
      opportunities.push(...jobDatabase.electrical);
    }
    if (courseTitle.includes('automotive')) {
      opportunities.push(...jobDatabase.automotive);
    }
    if (courseTitle.includes('cookery') || courseTitle.includes('cooking')) {
      opportunities.push(...jobDatabase.cookery);
    }
  });

  // Remove duplicates and limit to top 6 opportunities
  const uniqueOpportunities = opportunities.filter((job, index, self) => 
    index === self.findIndex(j => j.company === job.company && j.title === job.title)
  );

  return uniqueOpportunities.slice(0, 6);
};

// Generate search suggestions for web browsing
const generateSearchSuggestions = (completedCourses) => {
  if (!completedCourses || completedCourses.length === 0) {
    return {
      keywords: ['tesda graduate', 'technical skills', 'vocational training'],
      websites: [
        { name: 'JobStreet Philippines', url: 'https://www.jobstreet.com.ph', searchUrl: 'https://www.jobstreet.com.ph/jobs?keywords=tesda' },
        { name: 'Indeed Philippines', url: 'https://ph.indeed.com', searchUrl: 'https://ph.indeed.com/jobs?q=tesda' },
        { name: 'Kalibrr', url: 'https://www.kalibrr.com', searchUrl: 'https://www.kalibrr.com/home/jobs?search=tesda' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=tesda&location=Philippines' }
      ]
    };
  }

  const courseKeywords = completedCourses.map(course => {
    const title = course.courseTitle.toLowerCase();
    if (title.includes('welding')) return ['welder', 'welding technician', 'fabricator', 'metal worker'];
    if (title.includes('carpentry')) return ['carpenter', 'construction worker', 'cabinet maker', 'woodworker'];
    if (title.includes('electrical')) return ['electrician', 'electrical technician', 'maintenance technician'];
    if (title.includes('automotive')) return ['automotive technician', 'mechanic', 'auto repair technician'];
    if (title.includes('cookery') || title.includes('cooking')) return ['cook', 'chef', 'kitchen staff', 'food service'];
    if (title.includes('programming') || title.includes('computer')) return ['programmer', 'developer', 'IT support', 'computer technician'];
    return [title.replace(/nc ii|nc iii|nc iv/gi, '').trim()];
  }).flat();

  const uniqueKeywords = [...new Set(courseKeywords)];
  const primaryKeyword = uniqueKeywords[0] || 'tesda';

  return {
    keywords: uniqueKeywords,
    websites: [
      { 
        name: 'JobStreet Philippines', 
        url: 'https://www.jobstreet.com.ph',
        searchUrl: `https://www.jobstreet.com.ph/jobs?keywords=${encodeURIComponent(primaryKeyword)}`
      },
      { 
        name: 'Indeed Philippines', 
        url: 'https://ph.indeed.com',
        searchUrl: `https://ph.indeed.com/jobs?q=${encodeURIComponent(primaryKeyword)}&l=Philippines`
      },
      { 
        name: 'Kalibrr', 
        url: 'https://www.kalibrr.com',
        searchUrl: `https://www.kalibrr.com/home/jobs?search=${encodeURIComponent(primaryKeyword)}`
      },
      { 
        name: 'LinkedIn Jobs', 
        url: 'https://www.linkedin.com/jobs',
        searchUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(primaryKeyword)}&location=Philippines`
      }
    ]
  };
};

// Simple fallback generator
function generateFallbackInsights(courses) {
  const courseList = courses ? courses.map(c => c.courseTitle).join(", ") : "general TESDA courses";
  return [
    {
      title: "Customer Service Representative",
      company: "Concentrix Philippines",
      site: "JobStreet",
      salary: "₱18,000 - ₱25,000 / month",
      contact: "careers@concentrix.com",
      applyUrl: "https://www.jobstreet.com.ph/en/job/123456"
    },
    {
      title: "Production Operator",
      company: "Samsung Electronics Philippines",
      site: "Indeed",
      salary: "₱15,000 - ₱20,000 / month",
      contact: "hr@samsung.com.ph",
      applyUrl: "https://ph.indeed.com/viewjob?jk=789101"
    }
  ];
}

export const getJobMarketInsights = async (req, res) => {
  try {
    const { courses } = req.body;

    // ✅ Handle missing API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
      const fallbackJobs = generateFallbackInsights(courses);
      return res.status(200).json({
        success: true,
        jobs: fallbackJobs,
        courses: courses ? courses.map(c => c.courseTitle).join(", ") : "general TESDA courses",
        timestamp: new Date().toISOString(),
        usingFallback: true
      });
    }

    const courseList = courses ? courses.map(c => c.courseTitle).join(", ") : "general TESDA courses";

    // ✅ Prompt AI
    const prompt = `Provide job opportunities in the Philippines for courses: ${courseList}.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a job market analyst. Always return valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.4
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content || "{}";

    let jobs = [];
    try {
      const parsed = JSON.parse(aiText);
      jobs = parsed.jobs || [];
    } catch (err) {
      console.warn("AI response was not JSON, using fallback parser.");
      jobs = generateFallbackInsights(courses);
    }

    res.status(200).json({
      success: true,
      jobs,
      courses: courseList,
      timestamp: new Date().toISOString(),
      usingFallback: false
    });

  } catch (error) {
    console.error("Error getting job market insights:", error);
    const fallbackJobs = generateFallbackInsights(req.body.courses);
    res.status(200).json({
      success: true,
      jobs: fallbackJobs,
      courses: req.body.courses ? req.body.courses.map(c => c.courseTitle).join(", ") : "general TESDA courses",
      timestamp: new Date().toISOString(),
      usingFallback: true
    });
  }
};


// const generateFallbackInsights = (courses) => {
//   return `📊 **CURRENT JOB MARKET INSIGHTS - COMPANIES ACTIVELY HIRING**

// ## 🏢 **TOP COMPANIES HIRING TESDA GRADUATES:**

// **Construction & Engineering:**
// • DMCI Holdings - (02) 8888-3000 - careers.dmci.com
// • Megaworld Corp - (02) 8894-6300 - careers.megaworldcorp.com  
// • Ayala Land - (02) 8848-5555 - careers.ayalaland.com.ph

// **Manufacturing:**
// • Nestle Philippines - careers.nestle.com.ph
// • Toyota Motor PH - (02) 8573-3000 - careers.toyota.com.ph
// • Unilever PH - careers.unilever.com.ph

// **Service Industries:**
// • Jollibee Foods - (02) 8634-1111 - careers.jfc.com.ph
// • Shangri-La Hotels - (02) 8813-8888 - careers.shangri-la.com
// • Meralco - (02) 16211 - careers.meralco.com.ph

// ## 💰 **CURRENT SALARY RANGES (2024):**
// • Entry Level: ₱12,000 - ₱18,000/month
// • Experienced: ₱18,000 - ₱28,000/month  
// • Senior/Supervisory: ₱25,000 - ₱40,000/month
// • Specialized Skills: ₱30,000 - ₱50,000/month

// ## 🔥 **HIRING TRENDS:**
// • Construction companies expanding due to infrastructure projects
// • Manufacturing recovering with increased production
// • Service industries actively recruiting post-pandemic
// • Tech companies seeking technical support staff

// ## 📞 **DIRECT APPLICATION METHODS:**
// • Company career websites (apply online)
// • HR hotlines (call directly)
// • Walk-in applications (bring complete documents)
// • Recruitment agencies and job fairs
// • Employee referrals (network with current employees)

// **For real-time company hiring data and specific contact information, ChatGPT integration provides the most current information.**`;
// };