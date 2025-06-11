
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CareerPath as CareerPathType } from "@/types";

interface CareerPathProps {
  careerPath: CareerPathType;
}

const CareerPath = ({ careerPath }: CareerPathProps) => {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const handleStepClick = (stepId: string) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Card className="border-t-4 border-career-primary shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{careerPath.title}</CardTitle>
          <CardDescription className="text-lg">{careerPath.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Skills</h3>
            <div className="flex flex-wrap gap-2">
              {careerPath.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-career-light text-career-dark">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Potential Roles</h3>
            <ul className="list-disc pl-5 space-y-1">
              {careerPath.potentialRoles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Estimated Timeline</h3>
            <p className="text-gray-700">{careerPath.estimatedTimeline}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Career Roadmap</h2>
        <div className="space-y-4">
          {careerPath.steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`border-l-4 ${activeStep === step.id ? 'border-career-secondary' : 'border-gray-200'} transition-all duration-300`}
            >
              <CardHeader className="cursor-pointer" onClick={() => handleStepClick(step.id)}>
                <CardTitle className="flex items-center">
                  <span className="bg-career-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  {step.title}
                </CardTitle>
                <CardDescription>{step.timeframe}</CardDescription>
              </CardHeader>
              
              {activeStep === step.id && (
                <CardContent className="animate-fade-in">
                  <p className="mb-4">{step.description}</p>
                  
                  {step.resources.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Recommended Resources</h4>
                      <Accordion type="single" collapsible className="w-full">
                        {step.resources.map((resource) => (
                          <AccordionItem key={resource.id} value={resource.id}>
                            <AccordionTrigger className="text-left">
                              <span className="flex items-center">
                                <Badge className="mr-2 bg-career-secondary">{resource.type}</Badge>
                                {resource.title}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 py-2">
                              <p className="mb-2">{resource.description}</p>
                              {resource.link && (
                                <a 
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-career-primary hover:underline"
                                >
                                  Access Resource
                                </a>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-8">
        <Button variant="outline" asChild>
          <Link to="/">Return Home</Link>
        </Button>
        <Button className="bg-career-primary hover:bg-career-primary/90" asChild>
          <Link to="/mentor-booking">Book a Mentor</Link>
        </Button>
      </div>
    </div>
  );
};

export default CareerPath;
