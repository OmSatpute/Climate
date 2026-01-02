import { useState, useCallback } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Download,
  Info
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: "transport" | "energy" | "food" | "shopping";
  status: "processing" | "completed" | "error";
  records?: number;
  co2Impact?: number;
}

export default function Import() {
  const [isAuthenticated] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    setProcessing(true);
    
    for (const file of files) {
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a CSV file`,
          variant: "destructive",
        });
        continue;
      }

      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        category: inferCategory(file.name),
        status: "processing"
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate processing
      setTimeout(() => {
        const records = Math.floor(Math.random() * 200) + 50;
        const co2Impact = Math.random() * 5 + 0.5;
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: "completed", records, co2Impact }
              : f
          )
        );

        toast({
          title: "File processed successfully",
          description: `${file.name} has been analyzed and added to your carbon footprint`,
        });
      }, 2000 + Math.random() * 2000);
    }

    setProcessing(false);
  };

  const inferCategory = (filename: string): UploadedFile["category"] => {
    const name = filename.toLowerCase();
    if (name.includes("transport") || name.includes("trip") || name.includes("car") || name.includes("uber")) {
      return "transport";
    } else if (name.includes("energy") || name.includes("electric") || name.includes("gas") || name.includes("utility")) {
      return "energy";
    } else if (name.includes("food") || name.includes("grocery") || name.includes("restaurant")) {
      return "food";
    } else if (name.includes("shopping") || name.includes("purchase") || name.includes("retail")) {
      return "shopping";
    }
    return "transport"; // default
  };

  const getCategoryIcon = (category: UploadedFile["category"]) => {
    switch (category) {
      case "transport":
        return <Car className="h-4 w-4" />;
      case "energy":
        return <Home className="h-4 w-4" />;
      case "food":
        return <Utensils className="h-4 w-4" />;
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: UploadedFile["category"]) => {
    switch (category) {
      case "transport":
        return "text-earth";
      case "energy":
        return "text-warning";
      case "food":
        return "text-forest";
      case "shopping":
        return "text-ocean";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const downloadTemplate = (category: string) => {
    const templates = {
      transport: "Date,Type,Distance,Fuel_Type,CO2_Emissions\n2024-01-15,Car,25.5,Gasoline,5.2\n2024-01-15,Flight,1200,Jet Fuel,180.5",
      energy: "Date,Type,Usage,Unit,CO2_Factor\n2024-01-01,Electricity,450,kWh,0.4\n2024-01-01,Natural Gas,120,m3,2.0",
      food: "Date,Item,Quantity,Type,CO2_Factor\n2024-01-15,Beef,1,kg,27.0\n2024-01-15,Vegetables,2,kg,0.4",
      shopping: "Date,Item,Category,Price,CO2_Estimate\n2024-01-15,Laptop,Electronics,800,150.0\n2024-01-15,Jeans,Clothing,60,8.5"
    };

    const content = templates[category as keyof typeof templates];
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${category}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalCO2Impact = uploadedFiles
    .filter(f => f.status === "completed" && f.co2Impact)
    .reduce((sum, f) => sum + (f.co2Impact || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Import Data</h1>
            <p className="text-muted-foreground">
              Upload your activity data to track carbon emissions
            </p>
          </div>
          <Badge variant="outline" className="text-info border-info">
            <Info className="h-3 w-3 mr-1" />
            CSV Format Only
          </Badge>
        </div>

        {/* Upload Summary */}
        {uploadedFiles.length > 0 && (
          <Card className="border-l-4 border-l-forest">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-forest">
                    {totalCO2Impact.toFixed(1)} tons CO₂
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total emissions from {uploadedFiles.filter(f => f.status === "completed").length} processed files
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-safe" />
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="templates">Download Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload CSV Files</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your CSV files or click to browse
                </p>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Drop your CSV files here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports transport, energy, food, and shopping data
                    </p>
                  </div>
                  <div className="mt-6">
                    <input
                      type="file"
                      multiple
                      accept=".csv"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-input"
                    />
                    <Button asChild>
                      <label htmlFor="file-input" className="cursor-pointer">
                        Browse Files
                      </label>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded ${getCategoryColor(file.category)}`}>
                        {getCategoryIcon(file.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium truncate">{file.name}</p>
                          <Badge variant="outline" className="capitalize">
                            {file.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                          {file.records && ` • ${file.records} records`}
                          {file.co2Impact && ` • ${file.co2Impact.toFixed(1)} tons CO₂`}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {file.status === "processing" && (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-xs text-muted-foreground">Processing...</span>
                          </>
                        )}
                        {file.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-safe" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-risk" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>CSV Templates</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Download template files to structure your data correctly
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { 
                      category: "transport", 
                      title: "Transport Data", 
                      description: "Car trips, flights, public transport",
                      icon: <Car className="h-5 w-5" />
                    },
                    { 
                      category: "energy", 
                      title: "Energy Usage", 
                      description: "Electricity, gas, heating consumption",
                      icon: <Home className="h-5 w-5" />
                    },
                    { 
                      category: "food", 
                      title: "Food Consumption", 
                      description: "Meals, groceries, dietary choices",
                      icon: <Utensils className="h-5 w-5" />
                    },
                    { 
                      category: "shopping", 
                      title: "Shopping Purchases", 
                      description: "Retail items, electronics, clothing",
                      icon: <ShoppingBag className="h-5 w-5" />
                    }
                  ].map((template) => (
                    <Card key={template.category} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="text-primary">
                            {template.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{template.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => downloadTemplate(template.category)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Format Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Data Format Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Required Fields</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Date (YYYY-MM-DD format)</li>
                      <li>• Activity type or description</li>
                      <li>• Quantity or amount</li>
                      <li>• Units of measurement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Optional Fields</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• CO₂ factor (if known)</li>
                      <li>• Location or region</li>
                      <li>• Additional notes</li>
                      <li>• Cost information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}