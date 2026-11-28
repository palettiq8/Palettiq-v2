import { WebsiteCards } from "./WebsiteCards";
import { WebsiteCta } from "./WebsiteCta";
import { WebsiteFaq } from "./WebsiteFaq";
import { WebsiteFeatures } from "./WebsiteFeatures";
import { WebsiteFooter } from "./WebsiteFooter";
import { WebsiteHero } from "./WebsiteHero";
import { WebsiteLogos } from "./WebsiteLogos";
import { WebsiteNavbar } from "./WebsiteNavbar";
import { WebsitePricing } from "./WebsitePricing";
import { WebsiteStats } from "./WebsiteStats";
import { WebsiteTestimonials } from "./WebsiteTestimonials";

export function WebsiteTemplate() {
  return (
    <div className="flex flex-1 flex-col">
      <WebsiteNavbar />
      <WebsiteHero />
      <WebsiteLogos />
      <WebsiteFeatures />
      <WebsiteStats />
      <WebsiteCards />
      <WebsiteTestimonials />
      <WebsitePricing />
      <WebsiteFaq />
      <WebsiteCta />
      <WebsiteFooter />
    </div>
  );
}
