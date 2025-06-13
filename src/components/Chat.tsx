import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface ChatProps {
  sessionId: string;
  mentorId: string;
  studentId: string;
  mentorName: string;
  studentName: string;
}

const Chat = ({ sessionId, mentorId, studentId, mentorName, studentName }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        const storedMessages = localStorage.getItem(`chat_${sessionId}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      }
    };

    loadChatHistory();
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: studentId,
      senderName: studentName,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(updatedMessages));
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real application, you would upload the file to a server
    // and get back a URL. For now, we'll create a local URL
    const fileUrl = URL.createObjectURL(file);
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: studentId,
      senderName: studentName,
      content: "Shared a file",
      timestamp: new Date().toISOString(),
      attachments: [{
        name: file.name,
        url: fileUrl,
        type: file.type,
      }],
    };

    try {
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(updatedMessages));
    } catch (err) {
      console.error("Error uploading file:", err);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Chat with {mentorName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea ref={scrollRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === studentId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === studentId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.senderName}
                  </div>
                  <div>{message.content}</div>
                  {message.attachments?.map((attachment) => (
                    <div key={attachment.name} className="mt-2">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat; 