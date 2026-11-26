import { AccountFavoritePalettes } from "@/components/Account/AccountFavoritePalettes";

export default function FavoritePalettesPage() {
  return (
    <div className="w-full space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Favorite Palettes
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          All the color palettes you've marked as favorite.
        </p>
      </div>

      <AccountFavoritePalettes />
    </div>
  );
}