import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
}

const BookedSessions = () => {
  const [sessions, setSessions] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = () => {
      try {
        const storedSessions = localStorage.getItem("bookedSessions");
        if (storedSessions) {
          const parsedSessions = JSON.parse(storedSessions);
          // Sort sessions by date and time
          parsedSessions.sort((a: BookedSession, b: BookedSession) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          });
          setSessions(parsedSessions);
        }
      } catch (err) {
        console.error("Error loading sessions:", err);
        setError("Failed to load booked sessions");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
    // Refresh sessions every 5 minutes
    const interval = setInterval(loadSessions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
                <Badge
                  variant={session.status === "confirmed" ? "default" : "secondary"}
                >
                  {session.status}
                </Badge>
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