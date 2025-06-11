
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { logoutPaymanClient } from "@/services/paymanService";

interface PaymanCredentialsProps {
  onCredentialsSet: (clientId: string, clientSecret: string) => void;
  onLogout?: () => void;
  isConnected: boolean;
}

const PaymanCredentials = ({ onCredentialsSet, onLogout, isConnected }: PaymanCredentialsProps) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId.trim() || !clientSecret.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please provide both Client ID and Client Secret",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      onCredentialsSet(clientId.trim(), clientSecret.trim());
      toast({
        title: "Credentials set",
        description: "Payman credentials configured successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set Payman credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutPaymanClient();
    setClientId("");
    setClientSecret("");
    if (onLogout) {
      onLogout();
    }
    toast({
      title: "Logged out",
      description: "Payman credentials cleared. You can now login with new credentials.",
    });
  };

  if (isConnected) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center justify-between">
            ✓ Payman Connected
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Logout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700">
            Successfully connected to Payman API. You can now fetch mentors and make payments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Connect to Payman</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Payman Client ID</Label>
            <Input
              id="clientId"
              type="text"
              placeholder="pm-test-..."
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Payman Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="Enter your client secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Connecting..." : "Connect to Payman"}
          </Button>
        </form>
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Enter your Payman credentials to fetch mentors (payees) and enable payments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymanCredentials;
