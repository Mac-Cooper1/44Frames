"use client";

import { BookOpen, Video, Lightbulb, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ResourcesPage() {
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
              <Link href="/" className="text-gray-600 hover:text-gray-900">Templates</Link>
              <Link href="/resources" className="text-blue-600 font-medium">Resources</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Creation Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of AI-powered video creation with our comprehensive guides, tutorials, and best practices
          </p>
        </div>

        {/* Resource Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Video Tutorials</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Step-by-step guides for creating stunning videos with our AI templates
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Beginner</Badge>
                  <span className="text-sm text-gray-600">Getting Started with 44 Frames</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Intermediate</Badge>
                  <span className="text-sm text-gray-600">Advanced Camera Movements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Advanced</Badge>
                  <span className="text-sm text-gray-600">Custom Template Creation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Best Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Industry insights and tips for creating professional-quality videos
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Composition</Badge>
                  <span className="text-sm text-gray-600">Rule of Thirds & Framing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Lighting</Badge>
                  <span className="text-sm text-gray-600">Natural vs Artificial Light</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Movement</Badge>
                  <span className="text-sm text-gray-600">Smooth Camera Transitions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Documentation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Comprehensive guides and reference materials for all features
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">API</Badge>
                  <span className="text-sm text-gray-600">Developer Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Workflow</Badge>
                  <span className="text-sm text-gray-600">Production Pipelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Export</Badge>
                  <span className="text-sm text-gray-600">Format & Quality Options</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Join Our Community</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Discord Server</h3>
                <p className="text-gray-600 mb-4">
                  Connect with fellow creators, share your work, and get feedback from the community
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Join Discord
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Weekly Challenges</h3>
                <p className="text-gray-600 mb-4">
                  Participate in themed video challenges and showcase your creativity
                </p>
                <Button variant="outline">
                  View Challenges
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Stay Updated</CardTitle>
            <p className="text-gray-600">Get the latest tips, tutorials, and feature updates</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="w-full">Subscribe to Newsletter</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
