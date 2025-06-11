import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getWalletBalance, createMentorPayee } from "@/services/paymanService";

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

interface PaymanStatusProps {
  isConnected: boolean;
}

const PaymanStatus = ({ isConnected }: PaymanStatusProps) => {
  const [balance, setBalance] = useState<string>("0 TDS");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchBalance = async () => {
      if (isConnected) {
        setIsLoading(true);
        try {
          const newBalance = await getWalletBalance();
          setBalance(newBalance);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
          setBalance("0 TDS");
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchBalance();

    // Set up periodic refresh every 30 seconds
    if (isConnected) {
      intervalId = setInterval(fetchBalance, 30000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isConnected]);

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800">TDS Wallet Balance</h3>
            <p className="text-2xl font-bold text-blue-900">
              {isLoading ? "Loading..." : balance}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymanStatus;