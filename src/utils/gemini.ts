import { GoogleGenAI } from '@google/genai';

// Retrieve the API key from Vite defined variables or import meta env
const apiKey = (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '') || import.meta.env.VITE_GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error('Failed to initialize Google Gen AI Client:', error);
  }
}

// Siddhartha Gupta's Professional Profile & Background
const SIDDHARTHA_RESUME_CONTEXT = `
You are Siddhartha Gupta's AI Recruiter Twin. You speak on behalf of Siddhartha, a Computer Science Undergraduate (Class of 2026) at KIIT Deemed to be University, Bhubaneswar, India.
Your goal is to answer recruiter queries, highlight his strengths, analyze matching job descriptions, and encourage them to schedule a meeting or hire him.

---
SIDDHARTHA GUPTA'S PROFILE:
- **Current Role**: B.Tech Computer Science Undergraduate (Graduating in 2026), seeking software engineering internships, remote freelance, or full-time junior positions.
- **Location**: India (available for remote work globally).
- **Email**: siddhartha@kiit.ac.in
- **Website**: https://peerconnect.siddhartha.dev (or portfolio app)

TECHNICAL SKILLS:
- **Frontend Core**: React.js (hooks, state management, context), JavaScript (ES6+, asynchronous architectures), HTML5 & Semantic HTML, CSS3 & Tailwind CSS (v3 and v4), Framer Motion, Responsive Design.
- **Backend & Systems**: Node.js (event loop, file scripting), Express.js (middleware, routes, security, proxying), REST APIs.
- **Databases**: MongoDB (document indexes, aggregation pipelines), MySQL & SQL (relational database designs, complex joins, query optimization).
- **Tools & Workflows**: Git & GitHub (branching, actions, CI/CD, pull requests), VS Code, Postman (API debugging, mocking).
- **Cloud & Ops**: AWS (EC2, S3 bucket storage, cloud routing - currently actively learning and exploring).

FEATURED LAB PROJECTS:
1. **KIIT PeerConnect (Full Stack)**
   - *Description*: A collaborative workspace for KIIT Computer Science teams, solving project coordination pain points. Outfitted with real-time chats, local index searching, and a project delegation pipeline.
   - *Tech Stack*: React.js, Node.js, Express.js, MongoDB, REST APIs.
   - *Metrics/Impact*: Used by 450+ KIIT CS students.
   - *URLs*: Demo: https://peerconnect.siddhartha.dev | Repo: https://github.com/siddhartha-gupta/peerconnect
   
2. **Athena Rest Gateway (Backend Systems)**
   - *Description*: High-performance API routing and serialization broker ensuring secure access log compliance. Express-based gateway proxy utilizing validator middlewares, route logging, and MySQL.
   - *Tech Stack*: Node.js, Express.js, MySQL, SQL Joins, Postman Specs.
   - *Metrics/Impact*: Less than 15ms route latency profile.
   - *URLs*: Demo: https://athena.siddhartha.dev | Repo: https://github.com/siddhartha-gupta/athena-rest-gateway

3. **S3 Automated Pipe (Cloud & Ops)**
   - *Description*: Active cloud prototype for secure, pre-signed asset uploads directly to S3 buckets, bypassing client-side key exposures.
   - *Tech Stack*: AWS S3, Server Secrets, Node.js, React Frontends, Git Flows.
   - *Metrics/Impact*: Active Cloud Vault Integration.
   - *URLs*: Demo: https://s3pipe.siddhartha.dev | Repo: https://github.com/siddhartha-gupta/s3-automated-pipeline

GUIDELINES FOR CONVERSATION:
- Be professional, highly technical, polite, and confident.
- Always speak in the third person or first person representing Siddhartha. "I built..." or "Siddhartha built...". Let's stick to first person "I" for a warmer connection.
- Highlight project metrics (e.g., 450+ students on PeerConnect, <15ms latency on Athena).
- If asked about areas Siddhartha is weaker in (like advanced AWS, Docker, or Kubernetes), mention that he is a fast learner, actively exploring AWS (EC2/S3), and is excited to expand his skills.
- End answers with a polite call to action encouraging the recruiter to fill out the contact form or email him directly.
`;

// Helper to clean markdown blocks from Gemini response
function cleanGeminiResponse(text: string): string {
  return text.trim();
}

/**
 * Sends a query to Siddhartha's AI Twin
 */
export async function askAITwin(query: string): Promise<string> {
  if (!aiClient) {
    // If no API key, generate a high-quality simulated response locally
    return getMockAITwinResponse(query);
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: SIDDHARTHA_RESUME_CONTEXT,
        temperature: 0.7,
      }
    });

    if (response && response.text) {
      return cleanGeminiResponse(response.text);
    }
    throw new Error('Empty text response');
  } catch (error) {
    console.error('Gemini API Error, falling back to simulation:', error);
    return getMockAITwinResponse(query);
  }
}

/**
 * Compares a job description with Siddhartha's resume context
 */
export async function grillAITwin(jobDescription: string): Promise<{
  matchPercentage: number;
  pitch: string;
  matchingKeywords: string[];
  missingKeywords: string[];
}> {
  const prompt = `
  Analyze this Job Description:
  """
  ${jobDescription}
  """
  
  Provide a JSON-only response (no markdown blocks, no triple backticks, just raw JSON) matching this structure:
  {
    "matchPercentage": 85, // number from 0 to 100
    "pitch": "A tailored 2-3 paragraph cover-letter pitch highlighting how Siddhartha's projects (like PeerConnect or Athena Rest Gateway) match this job.",
    "matchingKeywords": ["React", "Node.js", "MongoDB"], // list of matching technologies/skills found in both
    "missingKeywords": ["Docker", "TypeScript"] // list of skills in the job description that Siddhartha doesn't explicitly highlight as expert in
  }
  `;

  if (!aiClient) {
    return getMockGrillResponse(jobDescription);
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SIDDHARTHA_RESUME_CONTEXT,
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    });

    if (response && response.text) {
      const data = JSON.parse(response.text.trim());
      return {
        matchPercentage: data.matchPercentage || 70,
        pitch: data.pitch || '',
        matchingKeywords: data.matchingKeywords || [],
        missingKeywords: data.missingKeywords || []
      };
    }
    throw new Error('Failed to parse Gemini response as JSON');
  } catch (error) {
    console.error('Gemini Grill API Error, falling back to simulation:', error);
    return getMockGrillResponse(jobDescription);
  }
}

// --- MOCK FALLBACK SYSTEM FOR LOCAL/OFFLINE USE ---

function getMockAITwinResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('project') || lowerQuery.includes('build') || lowerQuery.includes('portfolio')) {
    return "Siddhartha has built several full-stack architectures. His primary projects are: \n\n" +
      "1. **KIIT PeerConnect:** A team delegation chat system built for KIIT CS course groups (React, Node, Mongo, Express), currently used by 450+ students.\n" +
      "2. **Athena Rest Gateway:** An Express routing proxy with MySQL and custom middleware routing that has a sub-15ms response latency.\n" +
      "3. **S3 Automated Pipe:** An asset storage cloud pipeline using AWS S3 pre-signed URLs to prevent client-side credential leaks.\n\n" +
      "Would you like to initiate a discussion regarding these systems or inspect the source code? I can help you contact him!";
  }
  
  if (lowerQuery.includes('skill') || lowerQuery.includes('stack') || lowerQuery.includes('tech') || lowerQuery.includes('react') || lowerQuery.includes('node')) {
    return "Siddhartha's main stack is based on **React.js, Node.js, Express, MongoDB, and MySQL**, compiled strictly in TypeScript environments. He also has active experience with Tailwind CSS, Git/GitHub Actions, and is currently learning cloud storage pipelines with AWS (EC2 and S3).\n\nHe is graduating from KIIT in 2026, meaning he has strong foundations in Computer Science principles. You can find his full skills metrics under the 'Technical Metrics' tab!";
  }
  
  if (lowerQuery.includes('education') || lowerQuery.includes('kiit') || lowerQuery.includes('university') || lowerQuery.includes('college')) {
    return "Siddhartha is currently a B.Tech Computer Science Undergraduate at **Kalinga Institute of Industrial Technology (KIIT) Deemed to be University**, Bhubaneswar, India. He belongs to the graduating class of 2026. He has maintained excellent academic foundations while building live full-stack projects for his student peers.";
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('hire') || lowerQuery.includes('job') || lowerQuery.includes('internship')) {
    return "Siddhartha is actively seeking Software Engineering internships, remote contracts, or full-time junior positions. You can contact him directly at **siddhartha@kiit.ac.in**. Alternatively, you can fill in the Lead Inquiry Form just above this dashboard, and it will immediately add your ticket to my queue!";
  }

  return "Thank you for asking! As Siddhartha's AI Twin, I can tell you that he is a highly focused full-stack developer who loves designing clean APIs and fluid client interfaces. He is graduating in 2026 from KIIT University and is looking for software engineering roles.\n\nFeel free to ask me about his project architectures (PeerConnect, Athena Gateway, S3 Pipe), technical skills, or his academic timelines. If you like, you can also paste a job description here and I will tell you how well he matches!";
}

function getMockGrillResponse(jobDescription: string): {
  matchPercentage: number;
  pitch: string;
  matchingKeywords: string[];
  missingKeywords: string[];
} {
  const lowerJD = jobDescription.toLowerCase();
  
  // Basic heuristic keyword extraction
  const keywordsList = [
    { word: 'react', label: 'React.js' },
    { word: 'node', label: 'Node.js' },
    { word: 'express', label: 'Express.js' },
    { word: 'mongodb', label: 'MongoDB' },
    { word: 'sql', label: 'SQL / MySQL' },
    { word: 'aws', label: 'AWS Cloud' },
    { word: 'git', label: 'Git / GitHub' },
    { word: 'tailwind', label: 'Tailwind CSS' },
    { word: 'typescript', label: 'TypeScript' }
  ];

  const missingList = [
    { word: 'docker', label: 'Docker' },
    { word: 'kubernetes', label: 'Kubernetes' },
    { word: 'next', label: 'Next.js' },
    { word: 'graphql', label: 'GraphQL' },
    { word: 'python', label: 'Python' },
    { word: 'go', label: 'Go Lang' }
  ];

  const matchingKeywords = keywordsList
    .filter(k => lowerJD.includes(k.word))
    .map(k => k.label);

  const missingKeywords = missingList
    .filter(k => lowerJD.includes(k.word))
    .map(k => k.label);

  if (matchingKeywords.length === 0) {
    // Default fallback matching if JD is short or generic
    matchingKeywords.push('React.js', 'Node.js', 'TypeScript');
  }

  const baseMatch = 60;
  const matchPercentage = Math.min(98, baseMatch + (matchingKeywords.length * 5) - (missingKeywords.length * 3));

  const pitch = `Based on the job requirements, I have a strong match of ${matchPercentage}%! I specialize in full-stack systems using React.js and Node.js/Express backends, which aligns perfectly with your technology stack. For example, my KIIT PeerConnect project features a complete collaborative full-stack environment used by 450+ students. Furthermore, my Athena REST Gateway shows my backend proficiency, processing API payload validation under a 15ms latency profile. \n\nWhile I see that you mention ${missingKeywords.length > 0 ? missingKeywords.join(', ') : 'some advanced tools'} in your job post, I am a highly motivated student who is already learning AWS cloud infrastructures and will easily adapt to your engineering stack during onboarding.`;

  return {
    matchPercentage,
    pitch,
    matchingKeywords,
    missingKeywords
  };
}
