import { CookieConsent } from "@/components/cookie-consent"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Our Website</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This is a demo page to showcase the GDPR-compliant cookie consent banner. The banner will appear at the
            bottom of the page if you haven't made a choice yet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600">We respect your privacy and give you full control over your data.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-600">Our cookie banner meets all GDPR requirements for user consent.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Customizable</h3>
              <p className="text-gray-600">Choose exactly which cookies you want to accept or refuse.</p>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="/cookie-settings"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Cookie Settings
            </a>
          </div>
        </div>
      </div>
      <CookieConsent />
    </div>
  )
}
