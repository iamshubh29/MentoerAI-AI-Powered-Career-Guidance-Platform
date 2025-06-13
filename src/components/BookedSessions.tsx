import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Video, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookedSession {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  goals: string;
  amount: number;
  status: string;
  createdAt: string;
  meetLink?: string;
}

const BookedSessions = () => {
  const [sessions, setSessions] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateMeetLink = (sessionId: string) => {
    // Generate a valid Google Meet code (10-11 characters, letters and numbers only)
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allChars = chars + numbers;
    
    // Generate a random code of 10-11 characters
    const length = Math.random() < 0.5 ? 10 : 11;
    const meetingCode = Array.from(
      { length },
      () => allChars[Math.floor(Math.random() * allChars.length)]
    ).join('');
    
    return `https://meet.google.com/${meetingCode}`;
  };

  const loadSessions = () => {
    try {
      const storedSessions = localStorage.getItem("bookedSessions");
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        console.log("Loaded sessions:", parsedSessions);
        
        // Add the specific meet link
        const sessionsWithMeetLink = parsedSessions.map((session: BookedSession) => ({
          ...session,
          meetLink: "https://meet.google.com/hey-rxip-zau" // Specific meet link
        }));
        
        // Sort sessions by date and time
        sessionsWithMeetLink.sort((a: BookedSession, b: BookedSession) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        setSessions(sessionsWithMeetLink);
        
        // Update localStorage with the meet link
        localStorage.setItem("bookedSessions", JSON.stringify(sessionsWithMeetLink));
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
      setError("Failed to load booked sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // Refresh sessions every 5 minutes
    const interval = setInterval(loadSessions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinMeeting = (meetLink: string) => {
    if (!meetLink) {
      toast({
        title: "Error",
        description: "Meeting link is not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Ensure the URL is properly formatted
      let formattedLink = meetLink;
      if (!meetLink.startsWith('http')) {
        formattedLink = `https://meet.google.com/${meetLink}`;
      }
      
      // Open in new tab with proper Google Meet parameters
      const meetUrl = new URL(formattedLink);
      meetUrl.searchParams.set('authuser', '0');
      meetUrl.searchParams.set('hs', '179');
      
      window.open(meetUrl.toString(), '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Error opening meeting link:", err);
      toast({
        title: "Error",
        description: "Failed to open meeting link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelSession = (sessionId: string) => {
    try {
      // Get current sessions
      const storedSessions = localStorage.getItem("bookedSessions");
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        // Filter out the cancelled session
        const updatedSessions = parsedSessions.filter((session: BookedSession) => session.id !== sessionId);
        // Update localStorage
        localStorage.setItem("bookedSessions", JSON.stringify(updatedSessions));
        // Update state
        setSessions(updatedSessions);
        toast({
          title: "Session Cancelled",
          description: "Your session has been cancelled successfully.",
        });
      }
    } catch (err) {
      console.error("Error cancelling session:", err);
      toast({
        title: "Error",
        description: "Failed to cancel session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booked Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading sessions...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booked Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booked Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            No sessions booked yet. Book your first session with a mentor!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booked Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{session.mentorName}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(session.date), "MMMM d, yyyy")} at {session.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={session.status === "confirmed" ? "default" : "secondary"}
                  >
                    {session.status}
                  </Badge>
                  {session.status === "confirmed" && (
                    session.meetLink ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleJoinMeeting(session.meetLink!)}
                        className="flex items-center gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </Button>
                    ) : (
                      <Alert variant="warning" className="py-2 px-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Waiting for mentor to create meeting link
                        </AlertDescription>
                      </Alert>
                    )
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelSession(session.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Session Topic</h4>
                  <p className="text-gray-900">{session.topic}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Session Goals</h4>
                  <p className="text-gray-900">{session.goals}</p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <span>Duration: {session.duration} minutes</span>
                    <span>•</span>
                    <span>Amount: ${session.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookedSessions; 