import { BookingFormData, Mentor } from "@/types";
import { toast } from "@/hooks/use-toast";
import { PaymanClient } from "@paymanai/payman-ts";

// Payman credentials from environment variables
const PAYMAN_CLIENT_ID = import.meta.env.VITE_PAYMAN_CLIENT_ID;
const PAYMAN_CLIENT_SECRET = import.meta.env.VITE_PAYMAN_CLIENT_SECRET;

if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
  console.warn("Payman credentials are not set in environment variables. Payman features will be disabled.");
}

let paymanClient: ReturnType<typeof PaymanClient.withCredentials> | null = null;

// Initialize Payman client with user credentials
export function initializePaymanClient(clientId: string, clientSecret: string) {
  try {
    paymanClient = PaymanClient.withCredentials({
      clientId: clientId,
      clientSecret: clientSecret
    });
    console.log("Payman client initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Payman client", error);
    return false;
  }
}

// Logout and clear credentials
export function logoutPaymanClient() {
  paymanClient = null;
  console.log("Payman client logged out");
}

// Ensure client is initialized
async function ensureClientInitialized() {
  if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
    throw new Error("Payman credentials are missing. Cannot initialize Payman client.");
  }
  if (!paymanClient) {
    const initialized = initializePaymanClient(PAYMAN_CLIENT_ID, PAYMAN_CLIENT_SECRET);
    if (!initialized) {
      throw new Error("Failed to initialize Payman client");
    }
  }
  return paymanClient;
}

// Helper function to extract clean response text
function extractCleanResponse(response: any): string {
  if (!response) return "";
  
  if (typeof response === 'string') {
    return response.trim();
  }
  
  if (response.artifacts && Array.isArray(response.artifacts)) {
    const textArtifacts = response.artifacts
      .filter((artifact: any) => artifact.type === 'text' && artifact.content)
      .map((artifact: any) => artifact.content.trim());
    
    return textArtifacts.join('\n');
  }
  
  return "";
}

// Get list of mentors (payees)
export async function getMentors(): Promise<Mentor[]> {
  if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
    console.warn("Payman credentials are not set. Returning empty mentor list.");
    return [];
  }
  try {
    const client = await ensureClientInitialized();
    const response = await client.ask(
      "List all payees with their complete details including ID and name. Format each payee as:\nPayee X:\n- ID: ...\n- Name: ...\n"
    );
    console.log("[Payman getMentors RAW RESPONSE]", response);
    const responseText = extractCleanResponse(response);
    console.log("[Payman getMentors CLEANED RESPONSE]", responseText);

    // Match all payee blocks
    const payeeBlocks = responseText.split(/Payee \d+:/i).map(block => block.trim()).filter(Boolean);
    const mentors: Mentor[] = [];

    for (const block of payeeBlocks) {
      const idMatch = block.match(/- ID:\s*([^\n]+)/i);
      const nameMatch = block.match(/- Name:\s*([^\n]+)/i);
      const id = idMatch ? idMatch[1].trim() : `mentor-${Math.random().toString(36).substr(2, 9)}`;
      const name = nameMatch ? nameMatch[1].trim() : id;
        
        mentors.push({
        id,
        name,
        role: "Professional Mentor",
        expertise: ["General Mentoring"],
        experience: "Experienced professional in their field",
        bio: "No email/expertise info available.",
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        hourlyRate: 2,
          availability: {
          days: ["Monday", "Wednesday", "Friday"],
          timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
          }
        });
    }
    
    return mentors;
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
}

// Get wallet balance in TDS
export async function getWalletBalance(): Promise<string> {
  if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
    console.warn("Payman credentials are not set. Returning default wallet balance.");
    return "0 TDS";
  }
  try {
    const client = await ensureClientInitialized();
    const response = await client.ask(
      "What is my current TDS wallet balance? Please respond with just the amount in TDS format (e.g., 1000 TDS, 1000.00 TDS)."
    );
    console.log("[Payman getWalletBalance RAW RESPONSE]", response);
    const responseText = extractCleanResponse(response);
    console.log("[Payman getWalletBalance CLEANED RESPONSE]", responseText);

    // Match numbers with optional decimals, followed by TDS
    const matches = responseText.match(/([\d,]+(?:\.\d{2})?)\s*TDS/i);
    if (matches && matches.length > 0) {
      const amount = parseFloat(matches[1].replace(/,/g, ''));
      if (!isNaN(amount)) {
        return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TDS`;
      }
    }

    // Fallback: just numbers
    const fallbackMatch = responseText.match(/([\d,]+(?:\.\d{2})?)/);
    if (fallbackMatch) {
      const amount = parseFloat(fallbackMatch[1].replace(/,/g, ''));
      if (!isNaN(amount)) {
        return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TDS`;
      }
    }

    return "0 TDS";
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return "0 TDS";
  }
}

// Book a mentor session
export async function bookMentorSession(bookingData: BookingFormData): Promise<{ success: boolean; message: string }> {
  if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
    console.warn("Payman credentials are not set. Booking will not proceed.");
    return { success: false, message: "Payman credentials are not set." };
  }
  try {
    const client = await ensureClientInitialized();
    
    const response = await client.ask(`Book a session with payee ID ${bookingData.mentorId} for ${bookingData.sessionDate} at ${bookingData.sessionTime} for ${bookingData.sessionDuration} minutes. Topic: ${bookingData.topic}. Goals: ${bookingData.goals}.`, {
      onMessage: (message) => {
        console.log("Received booking update:", message);
      },
      metadata: {
        source: "mentor-booking",
        requestType: "book_session",
        mentorId: bookingData.mentorId,
        sessionDate: bookingData.sessionDate,
        sessionTime: bookingData.sessionTime,
        sessionDuration: bookingData.sessionDuration,
        topic: bookingData.topic,
        goals: bookingData.goals
      }
    });
    
    const responseText = extractCleanResponse(response);
    console.log("Booking response:", responseText);

    // Check if booking was successful
    if (responseText.toLowerCase().includes("success") || 
        responseText.toLowerCase().includes("booked") || 
        responseText.toLowerCase().includes("confirmed")) {
      return {
        success: true,
        message: "Session booked successfully"
      };
    }
    
    // Check for specific error cases
    if (responseText.toLowerCase().includes("unavailable") || 
        responseText.toLowerCase().includes("not available")) {
      return { 
        success: false, 
        message: "The selected time slot is no longer available. Please choose another time." 
      };
    }
    
    if (responseText.toLowerCase().includes("invalid") || 
        responseText.toLowerCase().includes("invalid time")) {
      return { 
        success: false, 
        message: "The selected time slot is invalid. Please choose another time." 
      };
    }
    
    return { 
      success: false, 
      message: "Failed to book session. Please try again or contact support." 
    };
  } catch (error) {
    console.error("Error booking session:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Error booking session" 
    };
  }
}

// Function to get transaction history
export async function getTransactionHistory() {
  if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
    console.warn("Payman credentials are not set. Cannot fetch transaction history.");
    return "";
  }
  try {
    const client = await ensureClientInitialized();
    console.log("Fetching transaction history from Payman...");
    
    let historyResponse: any;
    await client.ask("Show me my recent transaction history in the following format: Date: [date], Amount: [amount], Recipient: [name], Status: [status], Transaction ID: [id]", {
      onMessage: (response) => {
        console.log("Received transaction update");
        historyResponse = response;
      },
      metadata: {
        source: "mentor-booking",
        requestType: "get_transactions"
      }
    });
    
    const responseText = extractCleanResponse(historyResponse);
    
    if (responseText) {
      const lines = responseText.split('\n').filter(line => line.trim());
      return lines.map(line => {
        return line
          .replace(/([A-Za-z]+):/g, '$1: ')
          .replace(/\s+/g, ' ')
          .trim();
      }).join('\n');
    }
    
    return responseText;
  } catch (error) {
    console.error("Error fetching transaction history");
    throw new Error("Failed to fetch transaction history");
  }
}

// Function to create a payee (mentor) in Payman
export async function createMentorPayee(mentorData: { name: string; email: string }) {
  if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
    console.warn("Payman credentials are not set. Cannot create payee.");
    throw new Error("Payman credentials are not set.");
  }
  try {
    const client = await ensureClientInitialized();
    console.log("Creating mentor payee in Payman:", mentorData);
    
    let createResponse: any;
    await client.ask(`Create a new payee named ${mentorData.name} with email ${mentorData.email}`, {
      onMessage: (response) => {
        console.log("Received payee creation update");
        createResponse = response;
      },
      metadata: {
        source: "mentor-booking",
        requestType: "create_payee",
        mentorName: mentorData.name,
        mentorEmail: mentorData.email
      }
    });
    
    return extractCleanResponse(createResponse);
  } catch (error) {
    console.error("Error creating mentor payee");
    throw new Error("Failed to create mentor payee");
  }
}

// Function to make a payment from booking cart using TDS wallet
export async function makePaymentFromCart(bookingData: BookingFormData, mentorName: string): Promise<{ success: boolean; message: string }> {
  if (!PAYMAN_CLIENT_ID || !PAYMAN_CLIENT_SECRET) {
    console.warn("Payman credentials are not set. Payment will not proceed.");
    return { success: false, message: "Payman credentials are not set." };
  }
  try {
    const client = await ensureClientInitialized();
    
    // First check wallet balance
    const balanceResponse = await getWalletBalance();
    const balance = parseFloat(balanceResponse.replace(/[^0-9.]/g, ''));
    
    if (balance < bookingData.paymentAmount) {
      return {
        success: false,
        message: `Insufficient TDS balance. You have ${balance} TDS but need ${bookingData.paymentAmount} TDS.`
      };
    }

    // Make the payment
    const response = await client.ask(`Pay ${bookingData.paymentAmount} TDS from my TDS wallet to ${mentorName} for session on ${bookingData.sessionDate} at ${bookingData.sessionTime}`, {
      onMessage: (message) => {
        console.log("Received payment update:", message);
      },
      metadata: {
        source: "mentor-booking",
        requestType: "make_payment",
        mentorName: mentorName,
        amount: bookingData.paymentAmount,
        sessionDate: bookingData.sessionDate,
        sessionTime: bookingData.sessionTime,
        currency: "TDS"
      }
    });
    
    const responseText = extractCleanResponse(response);
    console.log("Payment response:", responseText);

    // Check if payment was successful - expanded success conditions
    if (responseText.toLowerCase().includes("success") || 
        responseText.toLowerCase().includes("paid") || 
        responseText.toLowerCase().includes("completed") ||
        responseText.toLowerCase().includes("payment processed") ||
        responseText.toLowerCase().includes("transaction successful") ||
        responseText.toLowerCase().includes("amount transferred") ||
        responseText.toLowerCase().includes("payment confirmed")) {
      return {
        success: true,
        message: `Successfully paid ${bookingData.paymentAmount} TDS to ${mentorName} for your session`
      };
    }
    
    // If we can't determine success/failure from the response, check if the amount was deducted
    const newBalance = await getWalletBalance();
    const newBalanceAmount = parseFloat(newBalance.replace(/[^0-9.]/g, ''));
    if (newBalanceAmount < balance) {
      // Amount was deducted, so payment was successful
      return {
        success: true,
        message: `Successfully paid ${bookingData.paymentAmount} TDS to ${mentorName} for your session`
      };
    }
    
    return { 
      success: false, 
      message: "Failed to process payment. Please try again or contact support." 
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Error processing payment" 
    };
  }
}
