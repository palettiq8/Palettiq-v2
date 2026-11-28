import { WebsiteCards } from "./WebsiteCards";
import { WebsiteCta } from "./WebsiteCta";
import { WebsiteFeatures } from "./WebsiteFeatures";
import { WebsiteFooter } from "./WebsiteFooter";
import { WebsiteHero } from "./WebsiteHero";
import { WebsiteNavbar } from "./WebsiteNavbar";

export function WebsiteTemplate() {
  return (
    <div className="flex flex-1 flex-col">
      <WebsiteNavbar />
      <WebsiteHero />
      <WebsiteFeatures />
      <WebsiteCards />
      <WebsiteCta />
      <WebsiteFooter />
    </div>
  );
}
