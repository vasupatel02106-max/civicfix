import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  HelpCircle,
  MapPin,
  FileText,
  Phone,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  type?: "text" | "suggestion";
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content: "Hello! I'm your CivicFix AI Assistant. I'm here to help you with civic issues, provide information about city departments, and guide you through the reporting process. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    { text: "How to report a pothole?", icon: HelpCircle },
    { text: "Check water complaint status", icon: FileText },
    { text: "Find nearest civic office", icon: MapPin },
    { text: "Emergency contact numbers", icon: Phone },
  ];

  const departmentContacts = [
    { name: "Road Department", phone: "+91-731-2345678", timings: "9 AM - 6 PM" },
    { name: "Water Supply", phone: "+91-731-2345679", timings: "24/7" },
    { name: "Electricity Board", phone: "+91-731-2345680", timings: "9 AM - 5 PM" },
    { name: "Sanitation", phone: "+91-731-2345681", timings: "6 AM - 8 PM" },
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(content.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("pothole") || input.includes("road")) {
      return "To report a pothole:\n\n1. Go to the 'Report Issue' section\n2. Select 'Pothole' as the category\n3. Add the exact location with landmarks\n4. Upload clear photos showing the pothole\n5. Submit the report\n\nYou'll receive a reference number for tracking. The Road Department typically responds within 48 hours for pothole repairs.";
    }
    
    if (input.includes("water") || input.includes("leakage")) {
      return "For water-related issues:\n\n• Water leakage: Report immediately as it's treated as high priority\n• No water supply: Check if it's scheduled maintenance first\n• Water quality issues: Contact Water Supply Department directly\n\nWater Department works 24/7 for emergency repairs. You can call +91-731-2345679 for urgent water issues.";
    }
    
    if (input.includes("street light") || input.includes("electricity")) {
      return "For street light issues:\n\n1. Note the pole number if visible\n2. Report through CivicFix with exact location\n3. Mention if it's affecting traffic safety\n\nElectricity Board usually fixes street lights within 24-48 hours. For multiple non-working lights in an area, it might indicate a broader electrical issue.";
    }
    
    if (input.includes("garbage") || input.includes("trash")) {
      return "For garbage collection issues:\n\n• Missed collection: Report with your area details\n• Overflowing bins: Include photos for faster response\n• Irregular timing: Sanitation Dept. can provide schedule\n\nGarbage collection follows a fixed schedule. If missed for more than 2 days, it's considered a priority issue.";
    }
    
    if (input.includes("status") || input.includes("track")) {
      return "To track your issue:\n\n1. Go to 'Track Issues' section\n2. Enter your reference number (starts with 'CF')\n3. View real-time progress updates\n\nYou'll also receive SMS/notifications for status changes. If no update for 7+ days, you can escalate through the AI assistant.";
    }
    
    if (input.includes("emergency") || input.includes("urgent")) {
      return "For emergency civic issues:\n\n🚨 Emergency Contacts:\n• Fire: 101\n• Police: 100\n• Ambulance: 108\n• City Control Room: +91-731-1234567\n\nFor non-life threatening but urgent issues (major water leaks, electrical hazards), mark as 'High Priority' when reporting through CivicFix.";
    }

    if (input.includes("office") || input.includes("location") || input.includes("address")) {
      return "Main Civic Office Locations:\n\n🏢 Municipal Corporation\nAddress: AB Road, Indore\nTimings: 9 AM - 6 PM (Mon-Sat)\n\n🏢 Zonal Offices:\n• Zone 1: Vijay Nagar\n• Zone 2: Old City Area\n• Zone 3: New Palasia\n\nYou can visit any zonal office for in-person assistance with your civic issues.";
    }
    
    return "I understand you need help with civic issues. Here are some things I can assist you with:\n\n• Guide you through reporting different types of issues\n• Provide department contact information\n• Help track your existing reports\n• Share emergency contact numbers\n• Explain the resolution process\n\nCould you please specify what type of civic issue you're dealing with or what information you need?";
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-government text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Bot className="h-8 w-8" />
            AI Civic Assistant
          </h1>
          <p className="text-white/90">
            Get instant help with civic issues, department information, and reporting guidance
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat */}
          <div className="lg:col-span-3">
            <Card className="h-[70vh] lg:h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-civic-saffron" />
                  Chat with AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about civic issues, get department info, or learn how to report problems
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === "user" 
                              ? "bg-civic-saffron text-white" 
                              : "bg-civic-navy text-white"
                          }`}>
                            {message.sender === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-civic-saffron text-white"
                              : "bg-muted"
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-civic-navy text-white flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Quick Suggestions */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="text-xs justify-start h-auto py-2 px-3"
                      >
                        <suggestion.icon className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{suggestion.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your question about civic issues..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage(inputValue);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSendMessage(inputValue)}
                    variant="civic"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block space-y-6">
            {/* Department Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Contacts</CardTitle>
                <CardDescription>
                  Direct contact numbers for urgent issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentContacts.map((dept, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <h4 className="font-medium text-sm">{dept.name}</h4>
                    <a href={`tel:${dept.phone}`} className="text-sm text-civic-navy font-mono hover:underline">
                      {dept.phone}
                    </a>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{dept.timings}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => window.location.href = "/report"}>
                  <FileText className="h-4 w-4 mr-2" />
                  Report New Issue
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => window.location.href = "/map"}>
                  <MapPin className="h-4 w-4 mr-2" />
                  View Issue Map
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => window.location.href = "/track"}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Track My Reports
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips for Better Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be specific about your location</li>
                  <li>• Include photos when possible</li>
                  <li>• Mention if it's a safety hazard</li>
                  <li>• Keep your reference number handy</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Department Contacts */}
          <div className="lg:hidden">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {departmentContacts.slice(0, 4).map((dept, index) => (
                    <a 
                      key={index} 
                      href={`tel:${dept.phone}`}
                      className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <h4 className="font-medium text-sm">{dept.name}</h4>
                      <p className="text-sm text-civic-navy font-mono">{dept.phone}</p>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;