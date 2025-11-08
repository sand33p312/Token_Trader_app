// This is an "organism" component for the modal
import Image from 'next/image'; // Import next/image
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Token } from "@/lib/types"; 
import { cn } from "@/lib/utils";

// --- Formatters ---
const k = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Price
const F = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2, notation: "compact" }); // Compact
const X = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "exceptZero" }); // Percent
const Z = "https://placehold.co/64x64/18181b/9ca3af?text="; // Placeholder URL

export const TokenDetailModal = ({ token }: { token: Token | null }) => {
  if (!token) return null;
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <Image
            src={token.logo}
            alt={token.name}
            className="rounded-full"
            width={40}
            height={40}
            onError={(e) => (e.target as HTMLImageElement).src = `${Z}${token.name}`}
            unoptimized={true} // --- ADD THIS LINE ---
          />
          <div>
            <DialogTitle className="text-xl">{token.name}</DialogTitle>
            <DialogDescription>{token.slug.toUpperCase()}</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="text-zinc-400">Price</span>
          <span className="text-white text-right font-medium">{k.format(token.price)}</span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="text-zinc-400">24h Change</span>
          <span
            className={cn(
              "text-right font-medium",
              token.priceChange24h > 0 ? "text-green-400" : "text-red-400",
              token.priceChange24h === 0 && "text-zinc-400"
            )}
          >
            {X.format(token.priceChange24h / 100)}
          </span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="text-zinc-400">TVL</span>
          <span className="text-white text-right font-medium">{F.format(token.tvl)}</span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="text-zinc-400">24h Volume</span>
          <span className="text-white text-right font-medium">{F.format(token.volume24h)}</span>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={() => alert("Trading not implemented in this demo!")}>Trade</Button>
      </div>
    </DialogContent>
  );
};