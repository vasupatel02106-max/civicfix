import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Camera,
  Calendar
} from "lucide-react";

const Map = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for issues
  const mockIssues = [
    {
      id: "CF001",
      title: "Pothole on MG Road",
      category: "pothole",
      status: "open",
      priority: "high",
      location: "MG Road, Near City Mall",
      reportedDate: "2024-01-15",
      description: "Large pothole causing traffic issues",
      images: 2,
      lat: 22.7196,
      lng: 75.8577
    },
    {
      id: "CF002", 
      title: "Street Light Not Working",
      category: "streetlight",
      status: "in-progress",
      priority: "medium",
      location: "Vijay Nagar, Sector 2",
      reportedDate: "2024-01-14",
      description: "Street light has been non-functional for 3 days",
      images: 1,
      lat: 22.7532,
      lng: 75.8937
    },
    {
      id: "CF003",
      title: "Water Leakage",
      category: "water",
      status: "resolved", 
      priority: "high",
      location: "AB Road, Near Metro Station",
      reportedDate: "2024-01-12",
      description: "Major water leakage from main pipeline",
      images: 3,
      lat: 22.6868,
      lng: 75.8333
    },
    {
      id: "CF004",
      title: "Garbage Not Collected",
      category: "garbage",
      status: "open",
      priority: "medium",
      location: "New Market Area",
      reportedDate: "2024-01-16",
      description: "Garbage has not been collected for 5 days",
      images: 2,
      lat: 22.7074,
      lng: 75.8639
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "in-progress": return "secondary";
      case "resolved": return "civic";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pothole": return "🕳️";
      case "streetlight": return "💡";
      case "water": return "💧";
      case "garbage": return "🗑️";
      case "drainage": return "🌊";
      case "traffic": return "🚦";
      case "park": return "🌳";
      default: return "📍";
    }
  };

  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const statusCounts = {
    open: mockIssues.filter(i => i.status === "open").length,
    inProgress: mockIssues.filter(i => i.status === "in-progress").length,
    resolved: mockIssues.filter(i => i.status === "resolved").length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-government text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Issue Map & Tracker</h1>
          <p className="text-white/90">
            View and track all reported civic issues in your area
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                <p className="text-2xl font-bold text-destructive">{statusCounts.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-secondary">{statusCounts.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-civic-green">{statusCounts.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-civic-green" />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Issues
            </CardTitle>
            <CardDescription>
              Find specific issues by location, category, or keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, title, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pothole">Potholes</SelectItem>
                  <SelectItem value="streetlight">Street Lights</SelectItem>
                  <SelectItem value="water">Water Issues</SelectItem>
                  <SelectItem value="garbage">Garbage</SelectItem>
                  <SelectItem value="drainage">Drainage</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="park">Parks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Placeholder */}
          <Card className="h-96 lg:h-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-civic-saffron" />
                Interactive Map
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 lg:h-80">
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-civic-saffron" />
                  <p className="font-medium mb-2">Interactive Map Coming Soon</p>
                  <p className="text-sm">View issue locations on an interactive city map</p>
                </div>
                
                {/* Mock map markers */}
                <div className="absolute inset-0 p-4">
                  <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-civic-green rounded-full"></div>
                  <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              Recent Issues ({filteredIssues.length})
            </h3>
            
            <div className="space-y-4 max-h-96 lg:max-h-full overflow-y-auto">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                        <div>
                          <h4 className="font-medium text-foreground">{issue.title}</h4>
                          <p className="text-sm text-muted-foreground">ID: {issue.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusColor(issue.status) as any}>
                          {issue.status.replace("-", " ").toUpperCase()}
                        </Badge>
                        <Badge variant={getPriorityColor(issue.priority) as any} className="text-xs">
                          {issue.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{issue.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Reported: {new Date(issue.reportedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span>{issue.images} photo(s)</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground mt-3">{issue.description}</p>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        Show on Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;