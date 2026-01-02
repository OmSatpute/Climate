import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { InteractiveMap } from "@/components/InteractiveMap";
import { RiskCard } from "@/components/RiskCard";
import { SummaryCard } from "@/components/SummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Globe,
  Search,
  Filter,
  TrendingUp,
  Users,
  MapPin,
  AlertTriangle,
  Info
} from "lucide-react";

interface RegionData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskScore: number;
  peopleAffected: number;
  primaryRisk: string;
  climateImpacts: string[];
  population: number;
  vulnerabilityIndex: number;
}

export default function Regions() {
  const [isAuthenticated] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  // Mock regional data
  const regions: RegionData[] = [
    {
      id: "1",
      name: "Bangladesh Delta",
      lat: 23.6850,
      lng: 90.3563,
      riskScore: 85,
      peopleAffected: 4200000,
      primaryRisk: "Coastal flooding and sea level rise",
      climateImpacts: ["Flooding", "Cyclones", "Saltwater intrusion"],
      population: 8500000,
      vulnerabilityIndex: 8.2
    },
    {
      id: "2",
      name: "Sahel Region",
      lat: 14.0000,
      lng: 2.0000,
      riskScore: 78,
      peopleAffected: 2100000,
      primaryRisk: "Drought and desertification",
      climateImpacts: ["Drought", "Desertification", "Food insecurity"],
      population: 5600000,
      vulnerabilityIndex: 7.8
    },
    {
      id: "3",
      name: "Pacific Small Islands",
      lat: -8.5000,
      lng: 179.0000,
      riskScore: 92,
      peopleAffected: 680000,
      primaryRisk: "Sea level rise and coral bleaching",
      climateImpacts: ["Sea level rise", "Coral bleaching", "Storm surge"],
      population: 890000,
      vulnerabilityIndex: 9.1
    },
    {
      id: "4",
      name: "Central America Highlands",
      lat: 14.6349,
      lng: -90.5069,
      riskScore: 73,
      peopleAffected: 1800000,
      primaryRisk: "Extreme weather and crop failure",
      climateImpacts: ["Hurricanes", "Drought", "Crop failure"],
      population: 3200000,
      vulnerabilityIndex: 7.3
    },
    {
      id: "5",
      name: "Arctic Communities",
      lat: 71.0000,
      lng: -8.0000,
      riskScore: 67,
      peopleAffected: 180000,
      primaryRisk: "Ice melt and infrastructure damage",
      climateImpacts: ["Ice melt", "Permafrost thaw", "Infrastructure damage"],
      population: 250000,
      vulnerabilityIndex: 6.8
    },
    {
      id: "6",
      name: "East African Highlands",
      lat: 1.0000,
      lng: 37.0000,
      riskScore: 71,
      peopleAffected: 3400000,
      primaryRisk: "Irregular rainfall and food insecurity",
      climateImpacts: ["Irregular rainfall", "Food insecurity", "Pastoral conflicts"],
      population: 6800000,
      vulnerabilityIndex: 7.1
    }
  ];

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.primaryRisk.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === "all" ||
                       (riskFilter === "high" && region.riskScore >= 80) ||
                       (riskFilter === "medium" && region.riskScore >= 60 && region.riskScore < 80) ||
                       (riskFilter === "low" && region.riskScore < 60);

    return matchesSearch && matchesRisk;
  });

  const handleRegionClick = (region: RegionData) => {
    setSelectedRegion(region);
  };

  const globalStats = {
    totalAffected: regions.reduce((sum, region) => sum + region.peopleAffected, 0),
    highRiskRegions: regions.filter(r => r.riskScore >= 80).length,
    averageRisk: Math.round(regions.reduce((sum, region) => sum + region.riskScore, 0) / regions.length)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Global Risk Regions</h1>
            <p className="text-muted-foreground">
              Explore vulnerable regions and their climate risk profiles
            </p>
          </div>
          <Badge variant="outline" className="text-warning border-warning">
            <Info className="h-3 w-3 mr-1" />
            Demo Data
          </Badge>
        </div>

        {/* Global Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <SummaryCard
            title="People at Risk"
            value={Math.round(globalStats.totalAffected / 1000000).toString()}
            unit="million"
            icon={<Users className="h-4 w-4 text-risk" />}
            variant="warning"
          />
          <SummaryCard
            title="High Risk Regions"
            value={globalStats.highRiskRegions.toString()}
            icon={<AlertTriangle className="h-4 w-4 text-warning" />}
            variant="warning"
          />
          <SummaryCard
            title="Average Risk Score"
            value={globalStats.averageRisk.toString()}
            unit="/100"
            icon={<TrendingUp className="h-4 w-4 text-risk" />}
            variant="danger"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-ocean" />
                  <span>Interactive Risk Map</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click on markers to view detailed region information
                </p>
              </CardHeader>
              <CardContent>
                <InteractiveMap
                  regions={filteredRegions}
                  onRegionClick={handleRegionClick}
                  className="h-96"
                />
              </CardContent>
            </Card>

            {/* Selected Region Details */}
            {selectedRegion && (
              <Card className="border-l-4 border-l-warning">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-warning" />
                    <span>{selectedRegion.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Primary Risk</h4>
                      <p className="text-sm">{selectedRegion.primaryRisk}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Population</h4>
                      <p className="text-sm">{selectedRegion.population.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">People Affected</h4>
                      <p className="text-sm">{selectedRegion.peopleAffected.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Vulnerability Index</h4>
                      <p className="text-sm">{selectedRegion.vulnerabilityIndex}/10</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Climate Impacts</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.climateImpacts.map((impact) => (
                        <Badge key={impact} variant="outline" className="text-xs">
                          {impact}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Regions</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or risk..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="high">High Risk (80+)</SelectItem>
                      <SelectItem value="medium">Medium Risk (60-79)</SelectItem>
                      <SelectItem value="low">Low Risk (&lt;60)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Region List */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Regions ({filteredRegions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {filteredRegions.map((region) => (
                  <div
                    key={region.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                      selectedRegion?.id === region.id ? "bg-muted border-primary" : ""
                    }`}
                    onClick={() => handleRegionClick(region)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{region.name}</h4>
                      <Badge
                        variant={region.riskScore >= 80 ? "destructive" : region.riskScore >= 60 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {region.riskScore}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {region.peopleAffected.toLocaleString()} people affected
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}