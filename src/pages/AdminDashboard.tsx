import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Eye, 
  Edit, 
  Filter,
  BarChart3,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  report_number: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location_text: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    phone_number: string;
  } | null;
}

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: ''
  });

  // Redirect if not admin
  if (!loading && (!user || !profile?.role || !['admin', 'department_head', 'field_officer'].includes(profile.role))) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user && profile?.role && ['admin', 'department_head', 'field_officer'].includes(profile.role)) {
      fetchReports();
    }
  }, [user, profile]);

  useEffect(() => {
    // Apply filters
    let filtered = reports;

    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(report => report.category === filters.category);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(report => report.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchLower) ||
        report.report_number.toLowerCase().includes(searchLower) ||
        report.location_text.toLowerCase().includes(searchLower)
      );
    }

    setFilteredReports(filtered);
  }, [reports, filters]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('civic_reports')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive",
        });
        return;
      }

      setReports((data as any) || []);
    } catch (error) {
      console.error('Error in fetchReports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('civic_reports')
        .update({ status: newStatus as any })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      // Add update to report_updates table
      await supabase
        .from('report_updates')
        .insert({
          report_id: reportId,
          status: newStatus as any,
          message: `Status updated to ${newStatus.replace('-', ' ')}`,
          updated_by: user!.id
        });

      // Refresh reports
      fetchReports();

      toast({
        title: "Success",
        description: "Report status updated successfully",
      });
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'acknowledged': return 'secondary';
      case 'in-progress': return 'secondary';
      case 'resolved': return 'civic';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pothole': return '🕳️';
      case 'streetlight': return '💡';
      case 'water': return '💧';
      case 'garbage': return '🗑️';
      case 'drainage': return '🌊';
      case 'traffic': return '🚦';
      case 'park': return '🌳';
      default: return '📍';
    }
  };

  // Calculate statistics
  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    urgent: reports.filter(r => r.priority === 'urgent').length,
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-saffron"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-government text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Municipality Dashboard</h1>
          <p className="text-white/90">
            Manage civic reports, track progress, and improve community services
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20">
              {profile?.department || 'Municipal Corporation'}
            </Badge>
            <Badge variant="outline" className="border-white text-white">
              {profile?.role?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-civic-saffron" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                <p className="text-2xl font-bold text-destructive">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-secondary">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-civic-green">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-civic-green" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold text-destructive">{stats.urgent}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              All Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Reports
                </CardTitle>
                <CardDescription>
                  Use filters to find specific reports and manage them efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search reports..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="acknowledged">Acknowledged</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
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
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Reports ({filteredReports.length})
                </h2>
              </div>

              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {report.report_number} • 
                              Reported by: {report.profiles?.full_name || 'Anonymous'} • 
                              {new Date(report.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={getStatusColor(report.status) as any}>
                            {report.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant={getPriorityColor(report.priority) as any} className="text-xs">
                            {report.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{report.location_text}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Category: {report.category} • 
                            Last updated: {new Date(report.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-foreground mb-4 line-clamp-2">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {report.status === 'open' && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => updateReportStatus(report.id, 'acknowledged')}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Acknowledge
                          </Button>
                        )}
                        
                        {report.status === 'acknowledged' && (
                          <Button 
                            variant="civic" 
                            size="sm"
                            onClick={() => updateReportStatus(report.id, 'in-progress')}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Start Work
                          </Button>
                        )}
                        
                        {report.status === 'in-progress' && (
                          <Button 
                            variant="civic" 
                            size="sm"
                            onClick={() => updateReportStatus(report.id, 'resolved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredReports.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                    <p className="text-muted-foreground">
                      {reports.length === 0 
                        ? "No civic reports have been submitted yet."
                        : "No reports match your current filters. Try adjusting your search criteria."
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Resolution Progress
                  </CardTitle>
                  <CardDescription>
                    Overall progress in resolving civic issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Open Issues</span>
                        <span className="text-sm text-muted-foreground">{stats.open}</span>
                      </div>
                      <Progress value={(stats.open / stats.total) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">In Progress</span>
                        <span className="text-sm text-muted-foreground">{stats.inProgress}</span>
                      </div>
                      <Progress value={(stats.inProgress / stats.total) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Resolved</span>
                        <span className="text-sm text-muted-foreground">{stats.resolved}</span>
                      </div>
                      <Progress value={(stats.resolved / stats.total) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of issues by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['pothole', 'streetlight', 'water', 'garbage', 'drainage'].map((category) => {
                      const count = reports.filter(r => r.category === category).length;
                      const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{getCategoryIcon(category)}</span>
                            <span className="text-sm capitalize">{category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-civic-saffron h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage user accounts and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">User Management</h3>
                  <p className="text-muted-foreground">
                    User management features will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;