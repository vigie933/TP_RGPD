"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Cookie, Shield, BarChart3, Target, Wrench, CheckCircle } from "lucide-react"

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const cookieCategories = [
  {
    id: "necessary" as keyof CookiePreferences,
    title: "Strictly Necessary",
    description: "These cookies are essential for the website to function and cannot be switched off.",
    icon: Shield,
    required: true,
    examples: ["Session cookies", "Security cookies", "Load balancing cookies"],
  },
  {
    id: "functional" as keyof CookiePreferences,
    title: "Functional",
    description: "These cookies enable enhanced functionality and personalization.",
    icon: Wrench,
    required: false,
    examples: ["Language preferences", "Region selection", "Accessibility settings"],
  },
  {
    id: "analytics" as keyof CookiePreferences,
    title: "Analytics",
    description: "These cookies help us understand how visitors interact with our website.",
    icon: BarChart3,
    required: false,
    examples: ["Google Analytics", "Page view tracking", "User behavior analysis"],
  },
  {
    id: "marketing" as keyof CookiePreferences,
    title: "Marketing",
    description: "These cookies are used to deliver personalized advertisements.",
    icon: Target,
    required: false,
    examples: ["Ad targeting", "Social media pixels", "Retargeting cookies"],
  },
]

export function CookieSettingsPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })
  const [consentDate, setConsentDate] = useState<string | null>(null)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const savedPreferences = localStorage.getItem("cookie-preferences")
    const savedConsentDate = localStorage.getItem("cookie-consent-date")

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
    if (savedConsentDate) {
      setConsentDate(savedConsentDate)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-preferences", JSON.stringify(prefs))
    localStorage.setItem("cookie-consent-given", "true")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setPreferences(prefs)
    setConsentDate(new Date().toISOString())
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 3000)

    // Here you would typically trigger your cookie management logic
    console.log("Cookie preferences updated:", prefs)
  }

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
  }

  const refuseAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    savePreferences(onlyNecessary)
  }

  const handleSave = () => {
    savePreferences(preferences)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Cookie className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Cookie Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your cookie preferences and control how we use cookies on our website.
          </p>
        </div>

        {showSaved && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your cookie preferences have been saved successfully.
            </AlertDescription>
          </Alert>
        )}

        {consentDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consent Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(consentDate).toLocaleDateString()} at{" "}
                {new Date(consentDate).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Cookie Categories</CardTitle>
            <CardDescription>
              Choose which types of cookies you want to allow. Changes will take effect immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {cookieCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`settings-${category.id}`} className="font-medium">
                            {category.title}
                          </Label>
                          {category.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      </div>
                    </div>
                    <Switch
                      id={`settings-${category.id}`}
                      checked={preferences[category.id]}
                      onCheckedChange={(checked) => updatePreference(category.id, checked)}
                      disabled={category.required}
                    />
                  </div>

                  <div className="ml-8 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.examples.map((example, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {category.id !== "marketing" && <Separator />}
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
          <Button onClick={acceptAll} variant="outline" className="flex-1">
            Accept All
          </Button>
          <Button onClick={refuseAll} variant="outline" className="flex-1">
            Refuse All
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us
              provide you with a better experience by remembering your preferences and understanding how you use our
              site.
            </p>
            <p>
              You can change your cookie preferences at any time by returning to this page. Please note that disabling
              certain cookies may affect the functionality of our website.
            </p>
            <p>
              For more information about how we use cookies and process your data, please read our{" "}
              <a href="/privacy" className="underline hover:no-underline text-primary">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/cookies" className="underline hover:no-underline text-primary">
                Cookie Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
