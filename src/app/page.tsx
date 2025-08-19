"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Star, Heart, Play, Clock, Grid3X3 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { mockTemplates } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatOptions, styleOptions } from "@/lib/mockData";
import TemplateDetailPanel from "@/components/TemplateDetailPanel";
import Link from "next/link";

export default function TemplateLibrary() {
  const router = useRouter();
  const {
    templates,
    setTemplates,
    filterState,
    updateFilterState,
    setSelectedTemplate,
    openTemplateDetail
  } = useAppStore();

  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setTemplates(mockTemplates);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setTemplates]);

  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
    openTemplateDetail();
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(filterState.searchQuery.toLowerCase());
    const matchesFormat = filterState.formats.length === 0 || filterState.formats.includes(template.format);
    const matchesStyle = filterState.styles.length === 0 || filterState.styles.includes(template.style);
    return matchesSearch && matchesFormat && matchesStyle;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (filterState.sortBy) {
      case "new":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case "mostUsed":
        return (b.usageCount || 0) - (a.usageCount || 0);
      case "favorites":
        return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      case "highestRated":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const FilterSidebar = () => (
    <div className="w-64 space-y-6">
      <div>
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Format</h3>
        <div className="space-y-2">
          {formatOptions.map((format) => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={format}
                checked={filterState.formats.includes(format)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilterState({ formats: [...filterState.formats, format] });
                  } else {
                    updateFilterState({ formats: filterState.formats.filter(f => f !== format) });
                  }
                }}
              />
              <label htmlFor={format} className="text-sm text-gray-600">{format}</label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Style</h3>
        <div className="space-y-2">
          {styleOptions.map((style) => (
            <div key={style} className="flex items-center space-x-2">
              <Checkbox
                id={style}
                checked={filterState.styles.includes(style)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilterState({ styles: [...filterState.styles, style] });
                  } else {
                    updateFilterState({ styles: filterState.styles.filter(s => s !== style) });
                  }
                }}
              />
              <label htmlFor={style} className="text-sm text-gray-600">{style}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MobileFilters = () => (
    <div className="md:hidden">
      <Button
        variant="outline"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="w-full mb-4"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </Button>
      
      {showMobileFilters && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <FilterSidebar />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">44 Frames</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-blue-600 font-medium">Templates</Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900">Resources</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={filterState.searchQuery}
                onChange={(e) => updateFilterState({ searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterState.sortBy === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilterState({ sortBy: "new" })}
              >
                New
              </Button>
              <Button
                variant={filterState.sortBy === "mostUsed" ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilterState({ sortBy: "mostUsed" })}
              >
                Most Used
              </Button>
              <Button
                variant={filterState.sortBy === "favorites" ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilterState({ sortBy: "favorites" })}
              >
                Favorites
              </Button>
              <Button
                variant={filterState.sortBy === "highestRated" ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilterState({ sortBy: "highestRated" })}
              >
                Highest Rated
              </Button>
            </div>
          </div>
          
          <MobileFilters />
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block">
            <FilterSidebar />
          </div>

          {/* Template Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleTemplateClick(template)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      {template.isNew && (
                        <Badge className="absolute top-2 left-2 bg-blue-500 text-xs">New</Badge>
                      )}
                      <div className="absolute top-2 right-2">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Heart className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{template.name}</h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {template.duration}s
                        </div>
                        <div className="flex items-center">
                          <Grid3X3 className="w-3 h-3 mr-1" />
                          {template.shots}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-xs">{template.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs px-2 py-1">{template.credits}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Template Detail Panel */}
      <TemplateDetailPanel />
    </div>
  );
}
