import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// -----------------------------------------------------------------
// 1. API INITIALIZATION & SCHEMAS
// -----------------------------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the schema for a single job posting using Zod
const JobSchema = z.object({
  job_title: z.string().describe("The specific job role (e.g., Welder, Barista, Cook)."),
  company_name: z.string().describe("The name of the company posting the job."),
  location: z.string().describe("The city or province where the job is located."),
  salary_range: z.string().describe("The monthly salary range or 'N/A' if not found in the snippet."),
  match_relevance: z.string().describe("A brief, one-sentence statement explaining which of the user's completed courses this job matches (e.g., 'Matches Welder course')."),
  url: z.string().url().describe("The link to the job posting."),
});

// CORRECTED JSON SCHEMA GENERATION - Defined globally for access
const finalJsonSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            // Accessing the .shape of the object schema (JobSchema)
            job_title: { type: "string", description: JobSchema.shape.job_title.description },
            company_name: { type: "string", description: JobSchema.shape.company_name.description },
            location: { type: "string", description: JobSchema.shape.location.description },
            salary_range: { type: "string", description: JobSchema.shape.salary_range.description },
            match_relevance: { type: "string", description: JobSchema.shape.match_relevance.description },
            url: { type: "string", description: JobSchema.shape.url.description },
        },
        required: ["job_title", "company_name", "location", "salary_range", "match_relevance", "url"],
    },
};


// -----------------------------------------------------------------
// 2. STEP 1: DATA RETRIEVAL (SIMULATED)
// -----------------------------------------------------------------
async function fetchRealJobPostings(courseTitles) {
  const searchTerms = courseTitles.join(", ") + " jobs Philippines";
  console.log(`Searching for: ${searchTerms}`);

  // Simulating comprehensive, yet mixed, job postings based on the requested courses.
  const rawJobSnippets = `
    [
      { "snippet": "Reliever Welder at Skills and Talent Employment Pool Inc. (STEP). Mandaluyong City, Metro Manila. Salary: ₱18,000 – ₱18,500 per month Benefits: Opportunities for promotion. Pay raise.", "url": "https://ph.jobstreet.com/welder-jobs?jobId=88333734&type=standard" },
      { "snippet": "Welder II at The Local Government of Quezon City - Government. Metro Manila. Salary: N/A. TESDA NC II Certified is a plus.", "url": "https://ph.jobstreet.com/welder-jobs?jobId=88546744&type=standard" },
      { "snippet": "Welder at Arktech Philippines Inc. Santo Tomas City, Batangas. Salary:₱15,000 – ₱16,000 per month. TESDA NC II Certified is a plus.", "url": "https://ph.jobstreet.com/welder-jobs?jobId=88527931&type=standard" },

      { "snippet": "Barista / Bar tender / Mixologist at Purveyor of Ambitious Curios. Alabang Metro Manila. Salary: ₱18,000 – ₱20,000 per month. Needs food handler certificate.", "url": "https://ph.jobstreet.com/barista-jobs?jobId=88176184&type=standard" },
      { "snippet": "Dining Staff / Barista at BANANA LEAF ASIAN CAFE INCORP.. Metro Manila. Part-time. Salary: N/A. No experience required.", "url": "https://ph.jobstreet.com/barista-jobs?jobId=88472518&type=standard" },
      { "snippet": "Barista - (Multiple Locations) at MUJI PHILIPPINES CORP. Makati City, Metro Manila. Full-time. Salary: N/A. No experience required.", "url": "https://ph.jobstreet.com/barista-jobs?jobId=88278690&type=standard" },
       
      { "snippet": "Multi Skilled Technician/Maintenance Technician/Electrician at CBRE GWS IFM PHILS. CORP. Metro Manila. Salary: ₱18,000 – ₱23,000 per month. Requires PRC license and 5 years experience.", "url": "https://ph.jobstreet.com/electrician-jobs?jobId=88536161&type=standard" },
      { "snippet": "Electrician [URGENT] – Various Locations at Filoil Logistics Corporation. Mandaluyong City, Metro Manila. Salary: ₱25,000 – ₱30,000 per month. Requires TESDA Electrical Installation and Maintenance (EIM) NC II.", "url": "https://ph.jobstreet.com/electrician-jobs?jobId=87917782&type=standard" },
      { "snippet": "Electrical Technician at Isuzu Philippines Corporation.Laguna, Calabarzon. Salary: N/A. Requires TESDA Electrical Installation and Maintenance (EIM) NC II.", "url": "https://ph.jobstreet.com/electrician-jobs?jobId=88539404&type=standard" },
 
      { "snippet": "Product Sewer at Knoll Ridges Consultancy, Inc. Paranaque City, Metro Manila. Salary: ₱18,000 – ₱20,500 per month. Must be skilled in high-end sewing and patterns.", "url": "https://ph.jobstreet.com/sewing-jobs?jobId=88456287&type=standard" },
      { "snippet": "Sewer at O & G Manufacturing Corp. Clark Freeport Zone, Pampanga. Salary: ₱14,800 – ₱17,000 per month. Piece-rate pay.", "url": "https://ph.jobstreet.com/sewing-jobs?jobId=88471162&type=standardd" },
      { "snippet": "Sewing Line Leader at HUADI DRESS PHILIPPINES INC. Tanza, Cavite. Salary: N/A. Piece-rate pay.", "url": "https://ph.jobstreet.com/sewing-jobs?jobId=88284322&type=standard" },
      
      { "snippet": "ASSISTANT COOK at St. Luke's Medical Center. Taguig City, Metro Manila. Salary: N/A. Cookery experience essential.", "url": "https://ph.jobstreet.com/cook-jobs?jobId=88280192&type=standard" },
      { "snippet": "COOK at Hotel Ava group of companies. Manila City, Metro Manila. Salary: ₱17,000 – ₱19,000 per month. Requires extensive cookery background.", "url": "https://ph.jobstreet.com/cook-jobs?jobId=88274018&type=standard" },
      { "snippet": "KITCHEN CREW/COOK at Giligan's Island Restaurant & Bar. Quezon City, Metro Manila. Salary:Quezon City, Metro Manila. Requires extensive cookery background.", "url": "https://ph.jobstreet.com/cook-jobs?jobId=88516032&type=standard" },

      { "snippet": "Driver/Mechanic at Public Safety Mutual Benefit Fund, Inc. (PSMBFI). San Juan City, Metro Manila. Salary: ₱20,000 – ₱25,000 per month. Must have clean driving record.", "url": "https://ph.jobstreet.com/driver-jobs?jobId=88526094&type=standard" },
      { "snippet": "Logistics Driver at ASIAPEOPLEWORKS INC. Pasig City, Metro Manila. Salary: ₱18,500 – ₱19,500 per month. Must have clean driving record.", "url": "https://ph.jobstreet.com/driver-jobs?jobId=88525044&type=standard" },
      { "snippet": "Company Driver atHARI Group of Companies. Makati City, Metro Manila. Salary: N/A. Must have clean driving record.", "url": "https://ph.jobstreet.com/driver-jobs?jobId=88427224&type=standard" },
     
      { "snippet": "Unrelated Job Posting: Call Center Agent at Sitel. Remote. Salary: ₱25,000. Must have BPO experience.", "url": "https://ph.jobstreet.com/bpo-jobs" }
    ]
  `;

  return rawJobSnippets;
}


// -----------------------------------------------------------------
// 3. STEP 2: DATA PROCESSING (Final, working version)
// -----------------------------------------------------------------
export const searchJobsWithAI = async (req, res) => {
    try {
        const { completedCourses, userQuery } = req.body;
        // Ensure course titles are consistent for matching
        const courseTitles = completedCourses.map(c => c.courseTitle.toUpperCase());

        if (courseTitles.length === 0) {
            return res.status(400).json({ success: false, message: "No courses provided." });
        }

        // --- STEP 1: Get the REAL job data from the web (Simulated) ---
        const realJobData = await fetchRealJobPostings(courseTitles);

        // --- STEP 2: Set up the prompt for filtering and structured output (ENHANCED) ---
        const prompt = `
            You are an expert AI Job Filter and Parser. Your ONLY goal is to transform the provided Raw Job Data into a clean JSON array that STRICTLY adheres to the schema.
            
            User's Completed TESDA Courses: ${courseTitles.join(", ")}.
            
            **CRITICAL FILTERING CONDITION:**
            
            1.  **AUTHORIZED COURSES (Keywords):** You MUST filter the jobs to include ONLY those that match one of these specific keywords: 
                - ${courseTitles.join(", ")}
                
            2.  **ACTIONS:**
                -   For every job snippet, you must determine if it is a **DIRECT MATCH** for one of the AUTHORIZED COURSES.
                -   If a job does **NOT** contain a term directly related to ${courseTitles.join(", ")}, you **MUST EXCLUDE** it from the final JSON array (e.g., exclude "Call Center Agent" unless "BPO" is an authorized course).
                -   The 'match_relevance' field must state which specific course (e.g., 'Matches Electrician course') the job relates to.
                
            Raw Job Data Context:
            ${realJobData}

            **STRICT INSTRUCTIONS (Repeat):**
            * You MUST return a single JSON array that strictly adheres to the provided JSON Schema.
            * Do NOT include any introductory text, markdown formatting (like triple backticks), or concluding remarks—ONLY the raw JSON array.
            * If the salary is not explicitly mentioned, use 'N/A' for the 'salary_range' field.
            * **FAIL-SAFE:** If you filter out ALL jobs and none are relevant, you MUST return a single JSON array containing only this object: [{"job_title": "No Match", "company_name": "N/A", "location": "N/A", "salary_range": "N/A", "match_relevance": "No relevant jobs found based on courses.", "url": "N/A"}].
        `;
        
        // --- STEP 3: Initialize Model with Configuration ---
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            config: {
                responseMimeType: "application/json",
                responseSchema: finalJsonSchema,
                temperature: 0.1, 
            },
        });


        // --- STEP 4: Call the Model ---
        const result = await model.generateContent({
            // This is the correct, standard contents format
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        // The model's text response will be the clean JSON string
        // FIX: Access .text as a function: result.response.text()
        const aiResponse = result.response.text().trim(); 
        
        // --- STEP 5: Return the clean JSON string ---
        return res.json({
            success: true,
            response: aiResponse, 
        });

    } catch (error) {
        console.error("GEMINI ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "AI job search failed.",
            error: error.message
        });
    }
};