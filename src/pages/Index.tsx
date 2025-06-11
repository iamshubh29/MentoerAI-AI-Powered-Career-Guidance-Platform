
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Discover Your Perfect
                  <span className="block bg-gradient-to-r from-career-primary to-career-secondary bg-clip-text text-transparent">
                    Career Path
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  Use the power of AI to find your ideal career path and connect with experienced mentors to guide your journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-career-primary hover:bg-career-primary/90" 
                    asChild
                  >
                    <Link to="/career-generator">Generate Career Path</Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-career-primary text-career-primary hover:bg-career-primary/10"
                    asChild
                  >
                    <Link to="/mentor-booking">Find a Mentor</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-career-primary/20 to-career-secondary/20 rounded-lg transform -rotate-6"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Career Planning" 
                    className="relative rounded-lg shadow-lg z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get personalized career guidance and connect with expert mentors in just a few simple steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="career-card p-6">
                <div className="w-12 h-12 bg-career-primary/10 text-career-primary rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Your Profile</h3>
                <p className="text-gray-600">
                  Tell us about your education, experience, skills and career goals.
                </p>
              </div>
              
              <div className="career-card p-6">
                <div className="w-12 h-12 bg-career-secondary/10 text-career-secondary rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Your Career Path</h3>
                <p className="text-gray-600">
                  Our AI analyzes your profile and generates a personalized career roadmap.
                </p>
              </div>
              
              <div className="career-card p-6">
                <div className="w-12 h-12 bg-career-accent/10 text-career-accent rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect with Mentors</h3>
                <p className="text-gray-600">
                  Book sessions with experienced professionals to guide your career journey.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-career-primary to-career-secondary rounded-xl p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Generate your personalized career path today and take the first step towards your dream career.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-career-primary hover:bg-white/90"
                asChild
              >
                <Link to="/career-generator">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <span className="career-gradient inline-block w-6 h-6 rounded-md"></span>
                <span className="text-xl font-bold">CareerPathAI</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-career-primary">Home</Link>
              <Link to="/career-generator" className="text-gray-600 hover:text-career-primary">Career Path</Link>
              <Link to="/mentor-booking" className="text-gray-600 hover:text-career-primary">Mentors</Link>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-500">© 2025 CareerPathAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
