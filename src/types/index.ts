
export interface CareerFormData {
  education: string;
  experience: string[];
  skills: string[];
  interests: string[];
  goals: string;
  preferredWorkStyle: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  steps: CareerStep[];
  skills: string[];
  potentialRoles: string[];
  estimatedTimeline: string;
}

export interface CareerStep {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  timeframe: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "course" | "book" | "website" | "other";
  link?: string;
  description: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  experience: string;
  bio: string;
  image: string;
  hourlyRate: number;
  availability: {
    days: string[];
    timeSlots: string[];
  };
}

export interface BookingFormData {
  mentorId: string;
  sessionDate: Date;
  sessionTime: string;
  sessionDuration: number;
  topic: string;
  goals: string;
  paymentAmount: number;
}

export interface PaymanCredentials {
  clientId: string;
  clientSecret: string;
}
