"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Link, Home, Camera } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getListingById } from "@/lib/mockData";
import { toast } from "sonner";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const router = useRouter();
  const { setListing, addUploads } = useAppStore();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScraping(true);
    toast.info("Scraping started...");

    // Simulate scraping delay
    setTimeout(() => {
      const listing = getListingById("listing-001");
      if (listing) {
        setListing(listing);
        toast.success("Scraping completed! Found 8 photos.");
        router.push("/gallery");
      } else {
        toast.error("No listing found for this URL.");
      }
      setIsScraping(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const photos = Array.from(files).map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        src: URL.createObjectURL(file),
        orientation: "H" as const,
        tag: "Interior" as const,
      }));
      
      addUploads(photos);
      toast.success(`Uploaded ${photos.length} photos`);
      router.push("/gallery");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            44 Frames
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform real estate photos into stunning motion clips with AI-powered cinematic effects
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Home className="w-4 h-4 mr-2" />
              Real Estate
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Camera className="w-4 h-4 mr-2" />
              Motion AI
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* URL Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Paste Zillow/Redfin URL
              </CardTitle>
              <CardDescription>
                Enter a listing URL to automatically scrape photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <Input
                  type="url"
                  placeholder="https://www.zillow.com/homedetails/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-lg"
                />
                <Button 
                  type="submit" 
                  disabled={isScraping || !url.trim()}
                  className="w-full"
                >
                  {isScraping ? "Scraping..." : "Start Scraping"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Divider */}
          <div className="text-center">
            <span className="bg-white px-4 py-2 text-gray-500">or</span>
          </div>

          {/* File Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Photos
              </CardTitle>
              <CardDescription>
                Drag and drop or select photos from your computer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    Click to select photos
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, GIF up to 10MB each
                  </p>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
