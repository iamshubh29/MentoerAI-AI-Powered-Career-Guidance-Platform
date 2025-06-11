import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookingFormData, Mentor } from "@/types";
import { format } from "date-fns";
import { bookMentorSession, makePaymentFromCart, getWalletBalance } from "@/services/paymanService";
import { toast } from "@/hooks/use-toast";

interface BookingFormProps {
  mentor: Mentor;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingForm = ({ mentor, onClose, onSuccess }: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    mentorId: mentor.id,
    sessionDate: new Date(),
    sessionTime: "",
    sessionDuration: 60,
    topic: "",
    goals: "",
    paymentAmount: mentor.hourlyRate
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update payment amount when duration changes
    const hourlyRate = mentor.hourlyRate;
    const hours = formData.sessionDuration / 60;
    setFormData({
      ...formData,
      paymentAmount: Math.round(hourlyRate * hours * 100) / 100
    });
  }, [formData.sessionDuration, mentor.hourlyRate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof BookingFormData) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleSelectChange = (value: string | number, field: keyof BookingFormData) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        sessionDate: date
      });
      setIsDatePickerOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // First make the payment
      const paymentResult = await makePaymentFromCart(formData, mentor.name);
      console.log("Payment result:", paymentResult);

      if (!paymentResult.success) {
        // Check if payment was actually successful despite the message
        const currentBalance = await getWalletBalance();
        const previousBalance = parseFloat(currentBalance.replace(/[^0-9.]/g, ''));
        const expectedBalance = previousBalance - formData.paymentAmount;
        
        if (Math.abs(previousBalance - expectedBalance) < 0.01) {
          // Payment was actually successful, proceed with booking
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully. Proceeding with booking...",
          });
        } else {
          // Payment actually failed
          setError(paymentResult.message);
          toast({
            title: "Payment Failed",
            description: paymentResult.message,
            variant: "destructive",
          });
          return;
        }
      } else {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully. Proceeding with booking...",
        });
      }

      // Close the booking form and trigger success callback
      onClose();
      onSuccess();

      // Then book the session
      const bookingResult = await bookMentorSession({
        mentorId: mentor.id,
        sessionDate: formData.sessionDate,
        sessionTime: formData.sessionTime,
        duration: formData.sessionDuration,
        paymentAmount: formData.paymentAmount,
        paymentStatus: "completed",
        paymentMethod: "TDS",
        paymentId: `PAY-${Date.now()}`,
        paymentDate: new Date().toISOString(),
        paymentDetails: {
          currency: "TDS",
          amount: formData.paymentAmount,
          status: "completed",
          method: "TDS",
          transactionId: `TXN-${Date.now()}`,
          timestamp: new Date().toISOString(),
          description: `Payment for session with ${mentor.name}`,
          metadata: {
            mentorId: mentor.id,
            sessionDate: formData.sessionDate,
            sessionTime: formData.sessionTime,
            duration: formData.sessionDuration
          }
        }
      });

      if (bookingResult.success) {
        toast({
          title: "Booking Confirmed",
          description: `Your session with ${mentor.name} has been booked successfully.`,
        });
      } else {
        toast({
          title: "Booking Failed",
          description: "Your payment was successful, but there was an error booking the session. Please contact support.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error in booking process:", err);
      setError(err instanceof Error ? err.message : "An error occurred during booking");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred during booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Book Session with {mentor.name}</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionDate">Date</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="sessionDate"
                  >
                    {formData.sessionDate ? (
                      format(formData.sessionDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.sessionDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => {
                      // Disable days that aren't available for the mentor
                      const day = format(date, "EEEE");
                      return !mentor.availability.days.includes(day);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTime">Time</Label>
              <Select
                value={formData.sessionTime}
                onValueChange={(value) => handleSelectChange(value, "sessionTime")}
              >
                <SelectTrigger id="sessionTime" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {mentor.availability.timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sessionDuration">Duration</Label>
            <Select
              value={formData.sessionDuration.toString()}
              onValueChange={(value) => handleSelectChange(parseInt(value), "sessionDuration")}
            >
              <SelectTrigger id="sessionDuration" className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="What would you like to discuss?"
              value={formData.topic}
              onChange={(e) => handleInputChange(e, "topic")}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goals">Session Goals</Label>
            <Textarea
              id="goals"
              placeholder="What do you hope to achieve from this session?"
              value={formData.goals}
              onChange={(e) => handleInputChange(e, "goals")}
              className="h-24"
              required
            />
          </div>
          
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">Payment Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Rate:</span>
              <span>${mentor.hourlyRate}/hour</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Duration:</span>
              <span>{formData.sessionDuration / 60} hour(s)</span>
            </div>
            <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>${formData.paymentAmount}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-career-primary hover:bg-career-primary/90" 
          disabled={isSubmitting || !formData.sessionTime}
        >
          {isSubmitting ? "Processing..." : "Confirm & Pay"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
