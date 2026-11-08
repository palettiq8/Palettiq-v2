import PalettesExploreHeader from "@/components/Palettes/PalettesExploreHeader";
import Header from "@/components/Home/Header";
import PalettesExplorer from "@/components/Palettes/PalettesExplorer";

export default function page() {
  return (
    <div className="w-full">
      <Header />
      <PalettesExploreHeader />
      <PalettesExplorer />
    </div>
  );
}
