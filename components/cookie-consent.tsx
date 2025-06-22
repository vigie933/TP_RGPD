"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Cookie, Settings, Shield, BarChart3, Target, Wrench } from "lucide-react"

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

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const savedPreferences = localStorage.getItem("cookie-preferences")
    const consentGiven = localStorage.getItem("cookie-consent-given")

    if (!consentGiven) {
      setShowBanner(true)
    } else if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-preferences", JSON.stringify(prefs))
    localStorage.setItem("cookie-consent-given", "true")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setPreferences(prefs)
    setShowBanner(false)
    setShowCustomize(false)

    // Here you would typically trigger your cookie management logic
    console.log("Cookie preferences saved:", prefs)
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

  const handleCustomSave = () => {
    savePreferences(preferences)
  }

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">We value your privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze
                    our traffic. By clicking "Accept All", you consent to our use of cookies. You can customize your
                    preferences or refuse non-essential cookies.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={acceptAll} className="flex-1 sm:flex-none">
                    Accept All
                  </Button>
                  <Button onClick={refuseAll} variant="outline" className="flex-1 sm:flex-none">
                    Refuse All
                  </Button>
                  <Button onClick={() => setShowCustomize(true)} variant="outline" className="flex-1 sm:flex-none">
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  By continuing to use our site, you agree to our{" "}
                  <a href="/privacy" className="underline hover:no-underline">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/cookies" className="underline hover:no-underline">
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customization Dialog */}
      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Choose which cookies you want to accept. You can change these settings at any time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {cookieCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={category.id} className="font-medium">
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
                      id={category.id}
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
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleCustomSave} className="flex-1">
              Save Preferences
            </Button>
            <Button onClick={acceptAll} variant="outline" className="flex-1">
              Accept All
            </Button>
            <Button onClick={refuseAll} variant="outline" className="flex-1">
              Refuse All
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            You can withdraw your consent at any time by visiting our{" "}
            <a href="/privacy" className="underline hover:no-underline">
              Privacy Settings
            </a>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
