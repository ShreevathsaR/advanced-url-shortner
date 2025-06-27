import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UAParser } from "ua-parser-js"
import { Zap, Lock, BarChart2, ArrowRight, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"
import { api } from "@/lib/baseUrl"

const features = [
  {
    title: "Ultra-Fast Redirects",
    description: "Experience lightning-fast link redirection powered by edge caching.",
    icon: Zap,
  },
  {
    title: "Zero Ads. Full Privacy.",
    description: "No trackers. No third-party scripts. Just clean, private shortening.",
    icon: Lock,
  },
  {
    title: "Instant Device Analytics",
    description: "See OS, device type, and user agent data with every click.",
    icon: BarChart2,
  },
]


const LandingPage = () => {
  const [analytics, setAnalytics] = useState({ os: "", device: "" })
  const [isVisible, setIsVisible] = useState(false)

  const [number, setNumber] = useState('')

  useEffect(()=>{
  const getNumbers = async () => {
    try {
      const response = await api.get('/landing/numbers')
      if(response.data.success){
        setNumber(response.data.number.toString())
      }
    } catch (error) {
      setNumber('20')
      console.log(error)
    }
  }
  getNumbers()
},)

const stats = [
  { value: number, label: "Links shortened" },
  { value: "99.9%", label: "Uptime" },
  { value: "100ms", label: "Avg. redirect time" },
]

  const navigate = useNavigate()

  useEffect(() => {
    const parser = new UAParser()
    const result = parser.getResult()
    const os = `${result.os.name} ${result.os.version}`
    const device = result.device.model || result.device.type || "Desktop"
    setAnalytics({ os, device })
    
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <main className="bg-[#0f0f1a] text-[#e2e2f5] font-['SF-Pro-Regular'] min-h-screen font-sans antialiased overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#a48fff]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#c4c2ff]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#a48fff]/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
      </div>

      {/* Container */}
      <div className="relative max-w-7xl mx-auto px-6 z-10">

        {/* Navigation */}
        <nav className={`flex justify-between items-center pt-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-2 group">
            <Sparkles className="text-[#a48fff] w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="font-bold text-lg">Advanced URL Shortner</span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/login')} className="bg-[#a48fff] text-[#0f0f1a] hover:bg-[#c4c2ff] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#a48fff]/25">
              Login
            </Button>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-full mb-6 border border-[#222244] transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} hover:border-[#a48fff]/50 hover:bg-[#1a1a2e]/80`}>
              <span className="text-sm font-medium text-[#a48fff]">Introducing Advanced URL Shortner</span>
              <ArrowRight className="w-4 h-4 text-[#a48fff] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#a48fff] to-[#c4c2ff] transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Shorten, Share, Succeed
            </h1>
            <p className={`mt-6 text-lg text-[#c4c2ff] max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              The premium URL shortener for professionals. Get lightning-fast links with detailed analytics—no compromises.
            </p>
            <div className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative w-full max-w-md mx-auto sm:mx-0 group">
              </div>
            </div>
            <div className={`mt-4 flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {stats.map((stat, idx) => (
                <div key={idx} className="px-4 py-2 bg-[#1a1a2e]/50 rounded-lg backdrop-blur-sm border border-[#222244] hover:border-[#a48fff]/30 transition-all duration-300 hover:scale-105 hover:bg-[#1a1a2e]/70">
                  <p className="font-bold text-[#a48fff] animate-pulse">{stat.value}</p>
                  <p className="text-xs text-[#a0a0c0]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#e2e2f5] mb-4">
              Enterprise-grade features, simple pricing
            </h2>
            <p className="text-lg text-[#c4c2ff] max-w-2xl mx-auto">
              Everything you need to optimize your links and track performance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className={`bg-[#1a1a2e]/50 backdrop-blur-sm p-8 border-[#222244] hover:border-[#a48fff]/30 transition-all duration-500 group hover:scale-105 hover:shadow-xl hover:shadow-[#a48fff]/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${1200 + idx * 200}ms` }}>
                  <div className="flex flex-col items-start gap-6">
                    <div className="p-3 bg-[#a48fff]/10 rounded-lg group-hover:bg-[#a48fff]/20 transition-all duration-300 group-hover:scale-110">
                      <Icon className="text-[#a48fff] w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#e2e2f5] mb-2 group-hover:text-[#c4c2ff] transition-colors duration-300">{feature.title}</h3>
                      <p className="text-sm text-[#a0a0c0] group-hover:text-[#c4c2ff] transition-colors duration-300">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Analytics Preview */}
        <section className="py-20">
          <div className={`bg-[#1a1a2e]/50 backdrop-blur-sm rounded-2xl border border-[#222244] p-8 md:p-12 transition-all duration-1000 hover:border-[#a48fff]/20 hover:shadow-2xl hover:shadow-[#a48fff]/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1800ms' }}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#e2e2f5] mb-4">
                  Real-time analytics
                </h2>
                <p className="text-[#c4c2ff] mb-6">
                  Track every click with detailed geographic, device, and browser data.
                </p>
                <div className="space-y-4">
                  <div className="group">
                    <Label className="text-[#a0a0c0] group-hover:text-[#c4c2ff] transition-colors duration-300">Your current device</Label>
                    <p className="text-[#e2e2f5] font-medium">{analytics.device}</p>
                  </div>
                  <div className="group">
                    <Label className="text-[#a0a0c0] group-hover:text-[#c4c2ff] transition-colors duration-300">Your operating system</Label>
                    <p className="text-[#e2e2f5] font-medium">{analytics.os}</p>
                  </div>
                </div>
                <Button className="mt-8 bg-[#a48fff] text-[#0f0f1a] hover:bg-[#c4c2ff] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#a48fff]/25">
                  View full analytics
                </Button>
              </div>
              <div className="md:w-1/2 bg-[#0f0f1a] rounded-lg border border-[#222244] p-4 hover:border-[#a48fff]/30 transition-all duration-300">
                <div className="bg-[#1a1a2e] rounded p-4 mb-4 hover:bg-[#1a1a2e]/80 transition-all duration-300">
                  <div className="flex justify-between text-sm text-[#a0a0c0] mb-2">
                    <span>Today</span>
                    <span className="animate-pulse">24 clicks</span>
                  </div>
                  <div className="h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#a48fff] to-[#c4c2ff] rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: '70%',
                        animation: 'progressBar 2s ease-out',
                        animationFillMode: 'both'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Top Country", value: "United States" },
                    { label: "Top Browser", value: "Chrome" },
                    { label: "Top Platform", value: "Mobile" },
                    { label: "Top Referrer", value: "Direct" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#1a1a2e] rounded p-4 hover:bg-[#1a1a2e]/80 transition-all duration-300 hover:scale-105">
                      <p className="text-sm text-[#a0a0c0]">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className={`max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '2000ms' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#e2e2f5] mb-6">
              Ready to optimize your links?
            </h2>
            <p className="text-lg text-[#c4c2ff] mb-8">
              Join thousands of professionals who trust Advanced URL Shortner for their link management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#a48fff] text-[#0f0f1a] hover:bg-[#c4c2ff] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#a48fff]/25">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-[#e2e2f5] border-[#a48fff] hover:bg-[#a48fff]/10 transition-all duration-300 hover:scale-105">
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-12 border-t border-[#222244] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '2200ms' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0 group">
              <Sparkles className="text-[#a48fff] w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="font-bold">Advanced URL Shortner</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-[#a0a0c0] hover:text-[#e2e2f5] transition-all duration-300 hover:scale-105">Privacy</a>
              <a href="#" className="text-sm text-[#a0a0c0] hover:text-[#e2e2f5] transition-all duration-300 hover:scale-105">Terms</a>
              <a href="#" className="text-sm text-[#a0a0c0] hover:text-[#e2e2f5] transition-all duration-300 hover:scale-105">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-[#a0a0c0]">
            You're visiting from <span className="text-[#e2e2f5] transition-colors duration-300">{analytics.device}</span> on <span className="text-[#e2e2f5] transition-colors duration-300">{analytics.os}</span>
          </div>
        </footer>
      </div>

      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 70%; }
          }
        `
      }} />
    </main>
  )
}

export default LandingPage