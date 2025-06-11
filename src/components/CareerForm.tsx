
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CareerFormData } from "@/types";
import { generateCareerPath } from "@/services/geminiService";
import { toast } from "@/hooks/use-toast";

interface CareerFormProps {
  onCareerPathGenerated: (careerPath: any) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const CareerForm = ({ onCareerPathGenerated, isLoading, setIsLoading }: CareerFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CareerFormData>({
    education: "",
    experience: [""],
    skills: [""],
    interests: [""],
    goals: "",
    preferredWorkStyle: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof CareerFormData) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CareerFormData, index: number) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = e.target.value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayItem = (field: keyof CareerFormData) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] as string[]), ""]
    });
  };

  const removeArrayItem = (field: keyof CareerFormData, index: number) => {
    const newArray = [...(formData[field] as string[])];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty entries
      const cleanedFormData = {
        ...formData,
        experience: formData.experience.filter(item => item.trim() !== ""),
        skills: formData.skills.filter(item => item.trim() !== ""),
        interests: formData.interests.filter(item => item.trim() !== "")
      };
      
      const careerPath = await generateCareerPath(cleanedFormData);
      onCareerPathGenerated(careerPath);
      toast({
        title: "Career path generated",
        description: "Your personalized career path has been generated successfully!",
      });
    } catch (error) {
      console.error("Error generating career path:", error);
      toast({
        title: "Error generating career path",
        description: "We encountered an issue while generating your career path. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto">
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Educational Background</h2>
            <Label htmlFor="education">Educational Background</Label>
            <Textarea
              id="education"
              placeholder="Describe your highest level of education, field of study, and any certifications."
              value={formData.education}
              onChange={(e) => handleInputChange(e, "education")}
              className="h-32"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="experience">Professional Experience</Label>
            {formData.experience.map((exp, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  id={`experience-${index}`}
                  placeholder="E.g., 2 years as Software Developer at XYZ Corp"
                  value={exp}
                  onChange={(e) => handleArrayInputChange(e, "experience", index)}
                  className="flex-1"
                />
                {index === formData.experience.length - 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addArrayItem("experience")}
                  >
                    +
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => removeArrayItem("experience", index)}
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button type="button" onClick={nextStep} className="bg-career-primary hover:bg-career-primary/90">
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Skills & Interests</h2>
            <Label htmlFor="skills">Skills</Label>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  id={`skill-${index}`}
                  placeholder="E.g., JavaScript programming"
                  value={skill}
                  onChange={(e) => handleArrayInputChange(e, "skills", index)}
                  className="flex-1"
                />
                {index === formData.skills.length - 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addArrayItem("skills")}
                  >
                    +
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => removeArrayItem("skills", index)}
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <Label htmlFor="interests">Interests</Label>
            {formData.interests.map((interest, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  id={`interest-${index}`}
                  placeholder="E.g., Machine Learning"
                  value={interest}
                  onChange={(e) => handleArrayInputChange(e, "interests", index)}
                  className="flex-1"
                />
                {index === formData.interests.length - 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addArrayItem("interests")}
                  >
                    +
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => removeArrayItem("interests", index)}
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
            >
              Back
            </Button>
            <Button 
              type="button" 
              onClick={nextStep}
              className="bg-career-primary hover:bg-career-primary/90"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Career Goals</h2>
            <Label htmlFor="goals">Career Goals</Label>
            <Textarea
              id="goals"
              placeholder="Describe your short-term and long-term career goals."
              value={formData.goals}
              onChange={(e) => handleInputChange(e, "goals")}
              className="h-32"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="preferredWorkStyle">Preferred Work Style</Label>
            <Textarea
              id="preferredWorkStyle"
              placeholder="Describe your preferred work environment (e.g., remote, office-based, hybrid) and work style."
              value={formData.preferredWorkStyle}
              onChange={(e) => handleInputChange(e, "preferredWorkStyle")}
              className="h-32"
              required
            />
          </div>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-career-primary hover:bg-career-primary/90"
            >
              {isLoading ? "Generating..." : "Generate Career Path"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default CareerForm;
