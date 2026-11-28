import { EcommerceCategories } from "./EcommerceCategories";
import { EcommerceFooter } from "./EcommerceFooter";
import { EcommerceHero } from "./EcommerceHero";
import { EcommerceNavbar } from "./EcommerceNavbar";
import { EcommerceNewsletter } from "./EcommerceNewsletter";
import { EcommerceProducts } from "./EcommerceProducts";
import { EcommercePromo } from "./EcommercePromo";
import { EcommerceTrust } from "./EcommerceTrust";

export function EcommerceTemplate() {
  return (
    <div
      className="flex flex-1 flex-col"
      style={{ backgroundColor: "var(--viz-background)" }}
    >
      <EcommerceNavbar />
      <EcommerceHero />
      <EcommerceCategories />
      <EcommerceProducts />
      <EcommercePromo />
      <EcommerceTrust />
      <EcommerceNewsletter />
      <EcommerceFooter />
    </div>
  );
}
