import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Video, AlertCircle, MessageSquare, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Chat from "./Chat";
import { sendCalendarInvite } from "@/services/calendarService";

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
  const [selectedSession, setSelectedSession] = useState<BookedSession | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      window.open(meetLink, '_blank', 'noopener,noreferrer');
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

  const handleOpenChat = (session: BookedSession) => {
    setSelectedSession(session);
    setIsChatOpen(true);
  };

  const handleSendCalendarInvite = async (session: BookedSession) => {
    try {
      // Show loading state
      toast({
        title: "Creating Calendar Invite",
        description: "Please wait...",
      });

      // Format date to YYYY-MM-DD if it's not already in that format
      const formattedDate = format(new Date(session.date), 'yyyy-MM-dd');
      
      // Ensure time is in HH:mm format
      const formattedTime = session.time.includes(':') 
        ? session.time 
        : `${session.time.slice(0, 2)}:${session.time.slice(2)}`;

      await sendCalendarInvite(
        "mentor@example.com", // Replace with actual mentor email
        "student@example.com", // Replace with actual student email
        {
          topic: session.topic,
          date: formattedDate,
          time: formattedTime,
          duration: session.duration
        }
      );

      // Show success message
      toast({
        title: "Success",
        description: "Calendar invite created successfully. Please check your browser for the popup.",
      });
    } catch (err) {
      console.error("Error sending calendar invite:", err);
      
      // Show specific error message based on the error
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to send calendar invite. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
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
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenChat(session)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendCalendarInvite(session)}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </Button>
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

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-4xl">
          {selectedSession && (
            <Chat
              sessionId={selectedSession.id}
              mentorId={selectedSession.mentorId}
              studentId="student123" // Replace with actual student ID
              mentorName={selectedSession.mentorName}
              studentName="Student" // Replace with actual student name
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BookedSessions; 