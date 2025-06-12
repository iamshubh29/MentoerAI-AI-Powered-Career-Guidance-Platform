import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mentor } from "@/types";
import { getMentors, bookMentorSession } from "@/services/paymanService";
import MentorCard from "@/components/MentorCard";
import BookingForm from "@/components/BookingForm";
import { toast } from "@/hooks/use-toast";
import PaymanStatus from "@/components/PaymanStatus";
import BookedSessions from "@/components/BookedSessions";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import NavBar from "@/components/NavBar";

export default function MentorBooking() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const data = await getMentors();
      setMentors(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError("Failed to load mentors. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load mentors. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsBookingFormOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false);
    setSelectedMentor(null);
    toast({
      title: "Booking Successful",
      description: "Your session has been booked successfully!",
    });
    fetchMentors(); // Refresh the mentors list
  };

  const handleAddMentor = () => {
    navigate("/add-mentor");
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book a Mentor Session</h1>
            <p className="text-gray-600">
              Connect with experienced mentors to accelerate your career growth
            </p>
          </div>

          <div className="mb-8">
            <PaymanStatus isConnected={isConnected} />
          </div>

          <div className="mb-8">
            <BookedSessions />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold">Find Your Mentor</h1>
              <Button
                onClick={handleAddMentor}
                className="bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Mentor
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onBook={handleBookSession}
                />
              ))}
            </div>
          )}

          <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
            <DialogContent className="max-w-2xl">
              {selectedMentor && (
                <BookingForm
                  mentor={selectedMentor}
                  onClose={() => {
                    setSelectedMentor(null);
                    setIsBookingFormOpen(false);
                  }}
                  onSuccess={handleBookingSuccess}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}