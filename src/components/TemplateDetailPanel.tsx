"use client";

import { useRouter } from "next/navigation";
import { X, Play, Clock, Grid3X3, Star, Heart, CreditCard } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTemplates } from "@/lib/mockData";

export default function TemplateDetailPanel() {
  const router = useRouter();
  const { 
    selectedTemplate, 
    isTemplateDetailOpen, 
    closeTemplateDetail,
    createProject 
  } = useAppStore();

  if (!selectedTemplate || !isTemplateDetailOpen) return null;

  const handleUseTemplate = () => {
    // Automatically create project with template name + timestamp
    const projectName = `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`;
    createProject(selectedTemplate.id, projectName);
    closeTemplateDetail();
    router.push("/generate");
  };

  const handleBuyCredits = () => {
    // Placeholder for credits purchase
    alert("Credits purchase functionality coming soon!");
  };

  // Get similar templates (excluding current one)
  const similarTemplates = mockTemplates
    .filter(t => t.id !== selectedTemplate.id && t.style === selectedTemplate.style)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeTemplateDetail}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeTemplateDetail}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Preview Image */}
          <div className="mb-6">
            <img
              src={selectedTemplate.thumbnail}
              alt={selectedTemplate.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Template Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Duration
              </div>
              <span className="font-medium">{selectedTemplate.duration}s</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Grid3X3 className="w-4 h-4 mr-2" />
                Shots
              </div>
              <span className="font-medium">{selectedTemplate.shots}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Play className="w-4 h-4 mr-2" />
                Format
              </div>
              <Badge variant="outline">{selectedTemplate.format}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Star className="w-4 h-4 mr-2" />
                Rating
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-medium">{selectedTemplate.rating}</span>
                <span className="text-sm text-gray-500 ml-1">({selectedTemplate.usageCount})</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <CreditCard className="w-4 h-4 mr-2" />
                Credits Required
              </div>
              <Badge variant="secondary">{selectedTemplate.credits} credits</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <Button 
              onClick={handleUseTemplate}
              className="w-full"
              size="lg"
            >
              Use This Template
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleBuyCredits}
              className="w-full"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
          </div>

          {/* Similar Templates */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Similar Templates</h3>
            <div className="grid grid-cols-2 gap-3">
              {similarTemplates.map((template) => (
                <div
                  key={template.id}
                  className="cursor-pointer group"
                  onClick={() => {
                    // In a real app, this would update the selected template
                    // For demo, just show an alert
                    alert(`Switching to ${template.name}`);
                  }}
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                  />
                  <p className="text-sm font-medium mt-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
