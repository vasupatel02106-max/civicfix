import { useState, useEffect } from "react";
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
  Star,
  Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Track = () => {
  const [searchId, setSearchId] = useState("");
  const [userIssues, setUserIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to track issues.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    fetchUserReports();
  }, [user, navigate]);

  const fetchUserReports = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('civic_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserIssues(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error loading reports",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchIssue = async () => {
    if (!searchId.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('civic_reports')
        .select('*')
        .eq('report_number', searchId.trim())
        .single();

      if (error) {
        toast({
          title: "Issue not found",
          description: "No issue found with that reference number.",
          variant: "destructive",
        });
        return;
      }

      // If found and belongs to user, highlight it
      if (data.user_id === user?.id) {
        toast({
          title: "Issue found",
          description: `Found your issue: ${data.title}`,
        });
      } else {
        toast({
          title: "Issue found",
          description: `Issue found but you don't have permission to view details.`,
        });
      }
    } catch (error: any) {
      console.error('Error searching:', error);
      toast({
        title: "Search error",
        description: "Unable to search at this time.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "acknowledged": return "secondary";
      case "in_progress": return "secondary";
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

  const getProgress = (status: string) => {
    switch (status) {
      case "open": return 25;
      case "acknowledged": return 50;
      case "in_progress": return 75;
      case "resolved": return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-saffron mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your reports...</p>
        </div>
      </div>
    );
  }

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
                placeholder="Enter issue ID (e.g., CF240001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && searchIssue()}
              />
              <Button variant="civic" onClick={searchIssue}>
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
                  {userIssues.filter(i => i.status === "in_progress" || i.status === "acknowledged").length}
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
          
          {userIssues.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No reports yet</h3>
                <p className="text-muted-foreground mb-4">You haven't reported any issues yet.</p>
                <Button variant="civic" onClick={() => navigate("/report")}>
                  <Send className="h-4 w-4 mr-2" />
                  Report Your First Issue
                </Button>
              </CardContent>
            </Card>
          ) : (
            userIssues.map((issue) => (
              <Card key={issue.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <span>ID: {issue.report_number}</span>
                        <span>•</span>
                        <MapPin className="h-4 w-4" />
                        <span>{issue.location_text}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(issue.status) as any}>
                      {issue.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{getProgress(issue.status)}%</span>
                    </div>
                    <Progress value={getProgress(issue.status)} className="h-2" />
                  </div>

                  {/* Issue Details */}
                  <div className="mb-6 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Category:</span>
                      <span className="ml-2 capitalize">{issue.category}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Priority:</span>
                      <Badge variant={issue.priority === 'high' ? 'destructive' : 'secondary'} className="ml-2 text-xs">
                        {issue.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Reported:</span>
                      <span className="ml-2">{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                    {issue.description && (
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Description:</span>
                        <p className="mt-1 text-muted-foreground">{issue.description}</p>
                      </div>
                    )}
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
                    
                    {issue.status === "resolved" && !issue.citizen_rating && (
                      <Button variant="civic" size="sm">
                        <Star className="h-4 w-4 mr-2" />
                        Rate Resolution
                      </Button>
                    )}
                    
                    {issue.citizen_rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Your rating:</span>
                        {renderStars(issue.citizen_rating)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
                <Button variant="civic" size="sm" onClick={() => navigate("/chat")}>
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