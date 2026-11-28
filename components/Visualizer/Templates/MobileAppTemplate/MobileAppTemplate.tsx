import { MobilePhoneFrame } from "./MobilePhoneFrame";
import { MobileScreenCards } from "./MobileScreenCards";
import { MobileScreenHome } from "./MobileScreenHome";
import { MobileScreenInsights } from "./MobileScreenInsights";
import { MobileScreenProfile } from "./MobileScreenProfile";

export function MobileAppTemplate() {
  return (
    <div
      className="p-4 @lg:p-6"
      style={{
        backgroundColor:
          "color-mix(in oklch, var(--viz-primary) 5%, var(--viz-background))",
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 @md:grid-cols-2 @xl:grid-cols-4">
        <MobilePhoneFrame active="home" caption="Home">
          <MobileScreenHome />
        </MobilePhoneFrame>

        <MobilePhoneFrame active="insights" caption="Insights">
          <MobileScreenInsights />
        </MobilePhoneFrame>

        <MobilePhoneFrame active="cards" caption="Cards">
          <MobileScreenCards />
        </MobilePhoneFrame>

        <MobilePhoneFrame active="profile" caption="Profile">
          <MobileScreenProfile />
        </MobilePhoneFrame>
      </div>
    </div>
  );
}
