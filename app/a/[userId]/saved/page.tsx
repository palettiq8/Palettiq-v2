import { AccountSavedPalettes } from "@/components/Account/AccountSavedPalettes";

export default function SavedPalettesPage() {
  return (
    <div className="w-full space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Saved Palettes</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          All the color palettes you've saved.
        </p>
      </div>

      <AccountSavedPalettes />
    </div>
  );
}
