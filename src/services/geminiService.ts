
import { CareerFormData, CareerPath } from "@/types";

const API_KEY = "AIzaSyAB2ctppqfousbe637pmW2mr0TTLq0wdn0";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function generateCareerPath(formData: CareerFormData): Promise<CareerPath> {
  try {
    const prompt = generatePrompt(formData);
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(data.error.message || "Failed to generate career path");
    }

    // Extract the text from the response - ensure we get a string
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiText || typeof aiText !== 'string') {
      console.error("Invalid response from Gemini API:", data);
      throw new Error("No valid text response from Gemini API");
    }

    console.log("Gemini API response text:", aiText);

    // Parse the AI response to create a career path
    return parseCareerPathFromResponse(aiText);
  } catch (error) {
    console.error("Error generating career path:", error);
    throw error;
  }
}

function generatePrompt(formData: CareerFormData): string {
  return `
    As a career advisor, create a detailed career path based on the following information:
    
    Education: ${formData.education}
    Experience: ${formData.experience.join(", ")}
    Skills: ${formData.skills.join(", ")}
    Interests: ${formData.interests.join(", ")}
    Career Goals: ${formData.goals}
    Preferred Work Style: ${formData.preferredWorkStyle}
    
    Please provide a comprehensive career path with the following structure in JSON format:
    
    {
      "title": "Career Path Title",
      "description": "Overview of the career path",
      "steps": [
        {
          "id": "step1",
          "title": "Step 1 Title",
          "description": "Detailed description of this career step",
          "resources": [
            {
              "id": "resource1",
              "title": "Resource Title",
              "type": "course/book/website/other",
              "link": "optional link",
              "description": "Brief description of this resource"
            }
          ],
          "timeframe": "Estimated time to complete this step"
        }
      ],
      "skills": ["Skill 1", "Skill 2"],
      "potentialRoles": ["Role 1", "Role 2"],
      "estimatedTimeline": "Overall estimated timeline"
    }
    
    Focus on providing realistic, actionable advice that aligns with the person's background and goals.
  `;
}

function parseCareerPathFromResponse(response: string): CareerPath {
  try {
    // Ensure response is a string
    if (typeof response !== 'string') {
      console.error("Response is not a string:", response);
      throw new Error("Invalid response format");
    }

    // Find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response");
    }
    
    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    // Ensure we have the required structure
    const careerPath: CareerPath = {
      id: `path-${Date.now()}`,
      title: parsed.title || "Custom Career Path",
      description: parsed.description || "A personalized career path based on your profile.",
      steps: (parsed.steps || []).map((step: any, index: number) => ({
        id: step.id || `step-${index + 1}`,
        title: step.title || `Step ${index + 1}`,
        description: step.description || "",
        resources: (step.resources || []).map((resource: any, rIndex: number) => ({
          id: resource.id || `resource-${index}-${rIndex}`,
          title: resource.title || "Resource",
          type: resource.type || "other",
          link: resource.link || "",
          description: resource.description || "",
        })),
        timeframe: step.timeframe || "Varies",
      })),
      skills: parsed.skills || [],
      potentialRoles: parsed.potentialRoles || [],
      estimatedTimeline: parsed.estimatedTimeline || "Varies based on dedication and prior experience",
    };
    
    return careerPath;
  } catch (error) {
    console.error("Error parsing career path from response:", error);
    
    // Return a fallback career path
    return {
      id: `path-${Date.now()}`,
      title: "Custom Career Path",
      description: "We encountered an issue creating your detailed career path. Here's a general outline to get you started.",
      steps: [
        {
          id: "step-1",
          title: "Assess Your Current Skills",
          description: "Take time to evaluate your current skillset and identify gaps relative to your career goals.",
          resources: [
            {
              id: "resource-1",
              title: "Skills Assessment Tools",
              type: "website",
              link: "https://www.myskillsfuture.gov.sg/content/portal/en/assessment/landing.html",
              description: "Free skills assessment tools to identify your strengths and areas for improvement.",
            }
          ],
          timeframe: "1-2 weeks"
        },
        {
          id: "step-2",
          title: "Develop Core Skills",
          description: "Focus on building the fundamental skills required for your target career path.",
          resources: [
            {
              id: "resource-2",
              title: "Online Learning Platforms",
              type: "website",
              link: "https://www.coursera.org/",
              description: "Coursera offers courses from top universities and companies.",
            }
          ],
          timeframe: "3-6 months"
        }
      ],
      skills: ["Critical Thinking", "Communication", "Technical Proficiency", "Problem Solving"],
      potentialRoles: ["Entry-level positions", "Mid-level roles with experience"],
      estimatedTimeline: "1-2 years depending on current experience and learning pace",
    };
  }
}