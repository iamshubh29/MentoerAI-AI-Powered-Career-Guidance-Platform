
import { useState } from "react";
import NavBar from "@/components/NavBar";
import CareerForm from "@/components/CareerForm";
import CareerPath from "@/components/CareerPath";
import { CareerPath as CareerPathType } from "@/types";

const CareerGenerator = () => {
  const [careerPath, setCareerPath] = useState<CareerPathType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCareerPathGenerated = (generatedPath: CareerPathType) => {
    setCareerPath(generatedPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetCareerPath = () => {
    setCareerPath(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">AI Career Path Generator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {careerPath ? 
                "Here's your personalized career roadmap. Explore each step to discover resources and guidance." : 
                "Answer a few questions about your experience, skills, and career goals to receive a personalized career path."
              }
            </p>
          </div>

          {careerPath ? (
            <div>
              <CareerPath careerPath={careerPath} />
              <div className="text-center mt-8">
                <button
                  onClick={resetCareerPath}
                  className="text-career-primary hover:underline"
                >
                  Create another career path
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <CareerForm 
                onCareerPathGenerated={handleCareerPathGenerated}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">
            © 2025 CareerPathAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CareerGenerator;
