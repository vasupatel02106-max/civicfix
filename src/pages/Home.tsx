import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  MapPin, 
  BarChart3, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/civic-hero.jpg";

const Home = () => {
  // Mock data for dashboard stats
  const stats = [
    {
      title: "Active Issues",
      value: "47",
      description: "Issues being resolved",
      icon: AlertTriangle,
      trend: "+12%",
      variant: "destructive" as const
    },
    {
      title: "Resolved This Month",
      value: "234",
      description: "Issues completed",
      icon: CheckCircle,
      trend: "+23%",
      variant: "civic" as const
    },
    {
      title: "Average Response Time",
      value: "2.3 days",
      description: "Government response",
      icon: Clock,
      trend: "-15%",
      variant: "default" as const
    },
    {
      title: "Community Rating",
      value: "4.2/5",
      description: "Citizen satisfaction",
      icon: TrendingUp,
      trend: "+8%",
      variant: "secondary" as const
    }
  ];

  const quickActions = [
    {
      title: "Report New Issue",
      description: "Submit a civic problem with photos and location",
      icon: FileText,
      href: "/report",
      variant: "civic" as const
    },
    {
      title: "View Issue Map", 
      description: "See all reported issues in your area on map",
      icon: MapPin,
      href: "/map",
      variant: "government" as const
    },
    {
      title: "Track My Reports",
      description: "Monitor progress of your submitted issues",
      icon: BarChart3,
      href: "/track",
      variant: "outline" as const
    },
    {
      title: "AI Assistant",
      description: "Get help with reporting and city information",
      icon: MessageSquare,
      href: "/chat",
      variant: "secondary" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-government">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Clean city with civic infrastructure" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-government opacity-80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Building Better
              <span className="block text-civic-saffron">Communities Together</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Report civic issues, track progress, and make your city better. Your voice matters in shaping our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button variant="civic" size="lg" className="text-lg px-8 py-4">
                  <FileText className="mr-2 h-5 w-5" />
                  Report Issue Now
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <Badge variant={stat.variant} className="mt-2">
                    {stat.trend}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Take Action for Your Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            "The best way to find yourself is to lose yourself in the service of others." - Mahatma Gandhi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Card className="h-full hover:shadow-civic transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-civic flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant={action.variant} className="w-full">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Inspirational Quote Footer */}
      <div className="bg-muted py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <blockquote className="text-2xl font-medium text-foreground italic mb-4">
            "Be the change that you wish to see in the world"
          </blockquote>
          <cite className="text-muted-foreground">- Mahatma Gandhi</cite>
        </div>
      </div>
    </div>
  );
};

export default Home;