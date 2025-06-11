
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface ResumeScore {
  overall: number;
  sections: {
    contact: number;
    summary: number;
    experience: number;
    skills: number;
    education: number;
  };
  suggestions: string[];
}

const ResumeChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<ResumeScore | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setScore(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
      }
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate resume analysis (in real app, you'd send to backend)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis result
      const mockScore: ResumeScore = {
        overall: Math.floor(Math.random() * 30) + 70, // 70-100
        sections: {
          contact: Math.floor(Math.random() * 20) + 80,
          summary: Math.floor(Math.random() * 30) + 70,
          experience: Math.floor(Math.random() * 25) + 75,
          skills: Math.floor(Math.random() * 20) + 80,
          education: Math.floor(Math.random() * 15) + 85
        },
        suggestions: [
          "Add more quantifiable achievements in your experience section",
          "Include relevant keywords for your target industry",
          "Consider adding a professional summary at the top",
          "Ensure consistent formatting throughout the document",
          "Add specific technical skills relevant to your field"
        ]
      };
      
      setScore(mockScore);
      
      toast({
        title: "Analysis complete",
        description: `Your resume scored ${mockScore.overall}/100`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <AlertCircle className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Resume Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resume">Upload your resume (PDF only)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button 
              onClick={analyzeResume} 
              disabled={!file || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                "Analyzing..."
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {score && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Overall Score</h3>
              <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}/100
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(score.sections).map(([section, sectionScore]) => (
                <div key={section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getScoreIcon(sectionScore)}
                    <span className="capitalize font-medium">{section}</span>
                  </div>
                  <span className={`font-bold ${getScoreColor(sectionScore)}`}>
                    {sectionScore}/100
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Suggestions for Improvement:</h4>
              <ul className="space-y-2">
                {score.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Upload your resume in PDF format</li>
            <li>• Our AI analyzes content, structure, and formatting</li>
            <li>• Get detailed scores and actionable improvement suggestions</li>
            <li>• Track your progress with multiple uploads</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeChecker;
