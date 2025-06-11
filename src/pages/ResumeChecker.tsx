
import NavBar from "@/components/NavBar";
import ResumeChecker from "@/components/ResumeChecker";

const ResumeCheckerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Resume ATS Checker</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your resume and get an instant ATS (Applicant Tracking System) score with detailed feedback and improvement suggestions.
            </p>
          </div>

          <div className="flex justify-center">
            <ResumeChecker />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">
            © 2025 CareerPathAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ResumeCheckerPage;
