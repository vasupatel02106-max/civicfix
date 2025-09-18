import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Calendar,
  MapPin,
  Star
} from "lucide-react";

const Track = () => {
  const [searchId, setSearchId] = useState("");

  // Mock data for user's reported issues
  const userIssues = [
    {
      id: "CF001",
      title: "Pothole on MG Road",
      status: "in-progress",
      progress: 75,
      category: "pothole",
      reportedDate: "2024-01-15",
      lastUpdate: "2024-01-18",
      location: "MG Road, Near City Mall",
      updates: [
        { date: "2024-01-15", status: "reported", message: "Issue reported and reference number generated" },
        { date: "2024-01-16", status: "acknowledged", message: "Issue acknowledged by Road Department" },
        { date: "2024-01-17", status: "in-progress", message: "Repair work started" },
        { date: "2024-01-18", status: "update", message: "50% work completed, expected completion by Jan 20" }
      ],
      rating: null
    },
    {
      id: "CF002", 
      title: "Street Light Not Working",
      status: "resolved",
      progress: 100,
      category: "streetlight", 
      reportedDate: "2024-01-12",
      lastUpdate: "2024-01-14",
      location: "Vijay Nagar, Sector 2",
      updates: [
        { date: "2024-01-12", status: "reported", message: "Issue reported successfully" },
        { date: "2024-01-13", status: "acknowledged", message: "Electrical Department assigned technician" },
        { date: "2024-01-14", status: "resolved", message: "Street light repaired and functioning" }
      ],
      rating: 4
    },
    {
      id: "CF003",
      title: "Garbage Collection Delayed",
      status: "open",
      progress: 25,
      category: "garbage",
      reportedDate: "2024-01-20",
      lastUpdate: "2024-01-20",
      location: "New Market Area", 
      updates: [
        { date: "2024-01-20", status: "reported", message: "Issue reported to Sanitation Department" }
      ],
      rating: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "acknowledged": return "secondary";
      case "in-progress": return "secondary";
      case "resolved": return "civic";
      default: return "outline";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-destructive";
    if (progress < 70) return "bg-secondary";
    return "bg-civic-green";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-civic text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Track Your Issues</h1>
          <p className="text-white/90">
            Monitor the progress of your reported civic issues
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Quick Search
            </CardTitle>
            <CardDescription>
              Enter your issue reference number to quickly find your report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter issue ID (e.g., CF001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
              />
              <Button variant="civic">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{userIssues.length}</p>
              </div>
              <FileText className="h-8 w-8 text-civic-saffron" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-secondary">
                  {userIssues.filter(i => i.status === "in-progress").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-civic-green">
                  {userIssues.filter(i => i.status === "resolved").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-civic-green" />
            </CardContent>
          </Card>
        </div>

        {/* Issues List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Your Reported Issues</h2>
          
          {userIssues.map((issue) => (
            <Card key={issue.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <span>ID: {issue.id}</span>
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{issue.location}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(issue.status) as any}>
                    {issue.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{issue.progress}%</span>
                  </div>
                  <Progress value={issue.progress} className="h-2" />
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Status Timeline
                  </h4>
                  <div className="space-y-3">
                    {issue.updates.map((update, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            update.status === "resolved" ? "bg-civic-green" :
                            update.status === "in-progress" ? "bg-secondary" :
                            update.status === "acknowledged" ? "bg-civic-saffron" :
                            "bg-muted-foreground"
                          }`} />
                          {index < issue.updates.length - 1 && (
                            <div className="w-0.5 h-8 bg-muted mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium capitalize">
                              {update.status.replace("-", " ")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(update.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                  
                  {issue.status === "resolved" && !issue.rating && (
                    <Button variant="civic" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Rate Resolution
                    </Button>
                  )}
                  
                  {issue.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Your rating:</span>
                      {renderStars(issue.rating)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-civic-saffron mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about your report status or need immediate assistance for urgent issues, 
                you can contact our support team or use the AI assistant.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="civic" size="sm">
                  Ask AI Assistant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Track;