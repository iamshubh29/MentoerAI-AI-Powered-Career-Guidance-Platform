import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CareerGenerator from "./pages/CareerGenerator";
import MentorBooking from "./pages/MentorBooking";
import ResumeChecker from "./pages/ResumeChecker";
import NotFound from "./pages/NotFound";
import AddMentor from "@/components/AddMentor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/career-generator" element={<CareerGenerator />} />
          <Route path="/mentor-booking" element={<MentorBooking />} />
          <Route path="/resume-checker" element={<ResumeChecker />} />
          <Route path="/add-mentor" element={<AddMentor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
