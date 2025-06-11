import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AuthDialog from "./AuthDialog";
import { toast } from "@/hooks/use-toast";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Check for logged in user on component mount
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="career-gradient inline-block w-8 h-8 rounded-md"></span>
          <span className="text-2xl font-bold bg-gradient-to-r from-career-primary to-career-secondary bg-clip-text text-transparent">
            CareerPathAI
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-career-primary font-medium">
            Home
          </Link>
          <Link to="/career-generator" className="text-gray-700 hover:text-career-primary font-medium">
            AI Career Path
          </Link>
          <Link to="/mentor-booking" className="text-gray-700 hover:text-career-primary font-medium">
            Book a Mentor
          </Link>
          <Link to="/resume-checker" className="text-gray-700 hover:text-career-primary font-medium">
            Resume Checker
          </Link>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser.name}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-career-primary text-career-primary hover:bg-career-primary/10"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsAuthOpen(true)}
              className="bg-career-primary hover:bg-career-primary/90"
            >
              Sign In
            </Button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-6 bg-white border-t animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-career-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/career-generator" 
              className="text-gray-700 hover:text-career-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Career Path
            </Link>
            <Link 
              to="/mentor-booking" 
              className="text-gray-700 hover:text-career-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Mentor
            </Link>
            <Link 
              to="/resume-checker" 
              className="text-gray-700 hover:text-career-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Resume Checker
            </Link>
            {currentUser ? (
              <>
                <span className="text-gray-700 py-2">Welcome, {currentUser.name}</span>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-career-primary text-career-primary hover:bg-career-primary/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => {
                  setIsAuthOpen(true);
                  setIsMenuOpen(false);
                }}
                className="bg-career-primary hover:bg-career-primary/90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => {
          setIsAuthOpen(false);
          // Refresh current user after auth dialog closes
          const user = localStorage.getItem("currentUser");
          if (user) {
            setCurrentUser(JSON.parse(user));
          }
        }} 
      />
    </nav>
  );
};

export default NavBar;
