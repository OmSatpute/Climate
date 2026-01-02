import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Home, 
  Utensils, 
  ShoppingBag, 
  Plane, 
  Lightbulb,
  CheckCircle,
  TrendingDown,
  Leaf
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "transport" | "energy" | "food" | "shopping" | "travel";
  co2Savings: number; // tons per year
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
  implemented?: boolean;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
  onImplement?: (id: string) => void;
  onLearnMore?: (id: string) => void;
}

export function RecommendationsList({ 
  recommendations, 
  onImplement, 
  onLearnMore 
}: RecommendationsListProps) {
  const getCategoryIcon = (category: Recommendation["category"]) => {
    switch (category) {
      case "transport":
        return <Car className="h-4 w-4" />;
      case "energy":
        return <Home className="h-4 w-4" />;
      case "food":
        return <Utensils className="h-4 w-4" />;
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />;
      case "travel":
        return <Plane className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Recommendation["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-safe/20 text-safe border-safe/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      case "hard":
        return "bg-risk/20 text-risk border-risk/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getImpactColor = (impact: Recommendation["impact"]) => {
    switch (impact) {
      case "low":
        return "text-muted-foreground";
      case "medium":
        return "text-warning";
      case "high":
        return "text-forest";
      default:
        return "text-muted-foreground";
    }
  };

  const totalSavings = recommendations.reduce((sum, rec) => sum + rec.co2Savings, 0);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-earth text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5" />
            <span>Potential CO₂ Reduction</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {totalSavings.toFixed(1)} tons/year
          </div>
          <p className="text-sm opacity-90">
            By implementing all {recommendations.length} recommendations
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <Card 
            key={recommendation.id} 
            className={`transition-all hover:shadow-md ${
              recommendation.implemented ? "bg-safe/5 border-safe/30" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(recommendation.category)}
                      <h3 className="font-semibold">{recommendation.title}</h3>
                    </div>
                    {recommendation.implemented && (
                      <CheckCircle className="h-4 w-4 text-safe" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getDifficultyColor(recommendation.difficulty)}>
                      {recommendation.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-muted-foreground">Impact:</span>
                      <span className={`text-xs font-medium ${getImpactColor(recommendation.impact)}`}>
                        {recommendation.impact}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Leaf className="h-3 w-3 text-forest" />
                      <span className="text-xs font-medium">
                        {recommendation.co2Savings.toFixed(1)} tons/year
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  {!recommendation.implemented && onImplement && (
                    <Button 
                      size="sm" 
                      onClick={() => onImplement(recommendation.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Implement
                    </Button>
                  )}
                  {onLearnMore && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onLearnMore(recommendation.id)}
                    >
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Learn More
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}