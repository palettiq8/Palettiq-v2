import { useQuery } from "@tanstack/react-query";
import { fetchPalettes } from "@/lib/queries/palettes";

export function usePalettes() {
  return useQuery({
    queryKey: ["palettes"],
    queryFn: fetchPalettes,
  });
}
