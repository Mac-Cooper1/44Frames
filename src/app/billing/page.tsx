"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Zap, Crown, Check } from "lucide-react";
import { TopNav } from "@/components/TopNav";

export default function BillingPage() {
  const router = useRouter();
  
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "month",
      description: "Perfect for individual agents",
      features: [
        "Up to 50 clips per month",
        "Basic presets",
        "Standard export formats",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "month",
      description: "Ideal for growing teams",
      features: [
        "Up to 200 clips per month",
        "Advanced presets",
        "Priority processing",
        "Priority support",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "month",
      description: "For large organizations",
      features: [
        "Unlimited clips",
        "Custom presets",
        "API access",
        "Dedicated support",
        "White-label options",
        "Advanced analytics"
      ],
      popular: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/export")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Export
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Billing & Subscription</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">Demo Mode</Badge>
                <span className="text-muted-foreground">
                  Manage your subscription and billing
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-yellow-600 font-medium">Professional Plan</span>
          </div>
        </div>
        
        {/* Current Plan */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800">Current Plan: Professional</CardTitle>
                <CardDescription className="text-green-700">
                  You're currently on the Professional plan with 200 clips per month
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">$79</div>
                <div className="text-sm text-green-700">per month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">200</div>
                <div className="text-sm text-green-700">clips per month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">Next billing</div>
                <div className="text-sm text-green-700">Dec 17, 2024</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Plan Comparison */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative transition-all hover:shadow-lg ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pt-6">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">per {plan.period}</div>
                  </div>
                  
                  <ul className="space-y-3 mb-6 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={plan.name === "Professional"}
                  >
                    {plan.name === "Professional" ? "Current Plan" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Billing Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Your payment method and billing details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/25</div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Update
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Billing Address</label>
                  <div className="text-sm text-muted-foreground mt-1">
                    123 Main Street<br />
                    Austin, TX 78701<br />
                    United States
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Billing Email</label>
                  <div className="text-sm text-muted-foreground mt-1">
                    user@example.com
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Usage Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your clip generation usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">47</div>
                <div className="text-sm text-muted-foreground">Clips Generated</div>
                <div className="text-xs text-blue-600 mt-1">23.5% of monthly limit</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">153</div>
                <div className="text-sm text-muted-foreground">Clips Remaining</div>
                <div className="text-xs text-green-600 mt-1">76.5% of monthly limit</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">12</div>
                <div className="text-sm text-muted-foreground">Days Left</div>
                <div className="text-xs text-purple-600 mt-1">Until next billing cycle</div>
              </div>
            </div>
            
            {/* Usage Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Usage</span>
                <span>47 / 200 clips</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(47 / 200) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/export")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Export
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" disabled>
              <CreditCard className="w-4 h-4 mr-2" />
              Update Payment Method
            </Button>
            
            <Button variant="outline" disabled>
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
            
            <Button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary/90"
            >
              Start New Project
            </Button>
          </div>
        </div>
        
        {/* Demo Notice */}
        <div className="mt-8 text-center">
          <Badge variant="outline" className="text-sm">
            Demo Mode • All billing features are simulated
          </Badge>
        </div>
      </div>
    </div>
  );
}
