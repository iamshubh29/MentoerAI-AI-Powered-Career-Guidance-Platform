import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mentor } from "@/types";

interface MentorCardProps {
  mentor: Mentor;
  onBook: (mentor: Mentor) => void;
}

const MentorCard = ({ mentor, onBook }: MentorCardProps) => {
  const [showMore, setShowMore] = useState(false);
  
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={mentor.image} 
              alt={mentor.name} 
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <CardTitle>{mentor.name}</CardTitle>
            <CardDescription className="mt-1">{mentor.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.expertise.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                {skill}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-500">{mentor.experience}</p>
        </div>
        
        <div className="mt-4">
          <p className={`text-sm ${!showMore && "line-clamp-2"}`}>
            {mentor.bio}
          </p>
          {mentor.bio.length > 120 && (
            <button 
              onClick={() => setShowMore(!showMore)} 
              className="text-career-primary text-sm mt-1 hover:underline"
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Available on</p>
            <p className="text-sm">
              {mentor.availability.days.join(", ")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Rate</p>
            <p className="text-sm font-semibold">${mentor.hourlyRate}/hour</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onBook(mentor)} 
          className="w-full bg-career-primary hover:bg-career-primary/90"
        >
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
