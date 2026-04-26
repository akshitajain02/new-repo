import { ContactSection } from "@/components/ContactSection";
import { PhishingWatermark } from "@/components/PhishingWatermark";
import ScammerScene from "@/components/ScammerScene";
import { HeroSection } from "@/components/HeroSection";
import { PhishingExamples } from "@/components/PhishingExamples";
import { PreventionTips } from "@/components/PreventionTips";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PhishingWatermark/>
      
      <HeroSection />
      <PhishingExamples />

      {/* 👇 YAHI CHANGE KIYA HAI (id add kiya) */}
      <div id="examples">
  <PhishingExamples />
</div>

<div id="prevention">
  <PreventionTips />
</div>
<ContactSection/>
<ScammerScene />
      <footer className="py-8 px-4 border-t border-border bg-card">
        <div className="container max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Phishing Defense Platform. Educational purposes only. Stay vigilant, stay safe.
          </p>
        </div>
      </footer>
      
    </div>
    
  );
};

export default Index;