import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Waves, 
  Thermometer, 
  Users, 
  Home, 
  Utensils,
  AlertTriangle,
  Shield,
  Activity
} from "lucide-react";

interface RiskCardProps {
  title: string;
  riskScore: number;
  peopleAffected: number;
  description: string;
  hazardType: "flood" | "drought" | "heat" | "displacement" | "food_insecurity" | "general";
  severity?: "low" | "medium" | "high" | "critical";
  region?: string;
}

export function RiskCard({
  title,
  riskScore,
  peopleAffected,
  description,
  hazardType,
  severity = "medium",
  region
}: RiskCardProps) {
  const getHazardIcon = () => {
    switch (hazardType) {
      case "flood":
        return <Waves className="h-5 w-5 text-ocean" />;
      case "drought":
        return <Thermometer className="h-5 w-5 text-warning" />;
      case "heat":
        return <Thermometer className="h-5 w-5 text-risk" />;
      case "displacement":
        return <Home className="h-5 w-5 text-earth" />;
      case "food_insecurity":
        return <Utensils className="h-5 w-5 text-warning" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case "low":
        return "text-safe";
      case "medium":
        return "text-warning";
      case "high":
        return "text-risk";
      case "critical":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getSeverityBadge = () => {
    const colors = {
      low: "bg-safe/20 text-safe border-safe/30",
      medium: "bg-warning/20 text-warning border-warning/30",
      high: "bg-risk/20 text-risk border-risk/30",
      critical: "bg-destructive/20 text-destructive border-destructive/30"
    };
    
    return (
      <Badge className={colors[severity]}>
        {severity === "critical" ? (
          <AlertTriangle className="h-3 w-3 mr-1" />
        ) : severity === "low" ? (
          <Shield className="h-3 w-3 mr-1" />
        ) : null}
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card className="transition-all hover:shadow-md border-l-4 border-l-warning">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getHazardIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {getSeverityBadge()}
        </div>
        {region && (
          <p className="text-sm text-muted-foreground">{region}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Score</span>
            <span className={`text-sm font-bold ${getSeverityColor()}`}>
              {riskScore}/100
            </span>
          </div>
          <Progress value={riskScore} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">People Affected</span>
          </div>
          <span className="text-sm font-bold">{formatNumber(peopleAffected)}</span>
        </div>
      </CardContent>
    </Card>
  );
}