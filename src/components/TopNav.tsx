"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

const steps = [
  { path: "/", label: "Intake", description: "URL or Upload" },
  { path: "/gallery", label: "Gallery", description: "Select Photos" },
  { path: "/prompt", label: "Prompt", description: "Compose & Presets" },
  { path: "/generate", label: "Generate", description: "Queue & Process" },
  { path: "/review", label: "Review", description: "Approve & Revise" },
  { path: "/export", label: "Export", description: "Download & Share" },
];

export function TopNav() {
  const pathname = usePathname();
  const { resetDemo } = useAppStore();
  
  const currentStepIndex = steps.findIndex(step => step.path === pathname);
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-primary">44 Frames</h1>
            
            <div className="hidden md:flex items-center space-x-6">
              {steps.map((step, index) => {
                const isActive = pathname === step.path;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.path} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      <div className="hidden lg:block">
                        <div className="text-sm font-medium">{step.label}</div>
                        <div className="text-xs text-muted-foreground">{step.description}</div>
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-1 rounded ${
                        isCompleted ? "bg-green-200" : "bg-muted"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:inline-flex">
              Demo Mode
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={resetDemo}
              className="text-xs"
            >
              Reset Demo
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
