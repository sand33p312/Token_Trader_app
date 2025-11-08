// This is a "molecule" component
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Import next/image
import { DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Token } from '@/lib/types'; 

// --- Formatters ---
const k = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Price
const F = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2, notation: "compact" }); // Compact
const X = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "exceptZero" }); // Percent
const Z = "https://placehold.co/64x64/18181b/9ca3af?text="; // Placeholder URL

// --- TokenRow ---
type TokenRowProps = {
  token: Token;
  onTokenSelect: (token: Token) => void;
};

export const TokenRow = React.memo(({ token, onTokenSelect }: TokenRowProps) => {
  const [o, r] = useState<"up" | "down" | null>(null); // [priceFlash, setPriceFlash]
  const n = token.priceChange24h / 100; // percentChange
  const prevPrice = useRef(token.price);

  useEffect(() => { // Price flash effect
    if (o) { // priceFlash
      const s = setTimeout(() => r(null), 700); // timeout
      return () => clearTimeout(s);
    }
  }, [o]);

  useEffect(() => { // Detect price change
    let timerId: NodeJS.Timeout;
    if (prevPrice.current !== token.price) {
      const direction = token.price > prevPrice.current ? "up" : "down";
      timerId = setTimeout(() => {
        r(direction);
      }, 0);
    }
    prevPrice.current = token.price;
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [token.price]);

  return (
    <DialogTrigger asChild>
      <TableRow className="cursor-pointer" onClick={() => onTokenSelect(token)}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Image
              src={token.logo}
              alt={token.name}
              className="rounded-full" // width/height props handle sizing
              width={32}  // h-8 is 32px
              height={32} // w-8 is 32px
              onError={(e) => (e.target as HTMLImageElement).src = `${Z}${token.name}`}
            />
            <div className="flex flex-col">
              <span className="font-medium text-white">{token.name}</span>
              <span className="text-sm text-zinc-400">{token.slug.toUpperCase()}</span>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <span
            className={cn(
              "text-white font-medium transition-colors duration-500",
              { "bg-green-500/30 text-green-400": o === "up" },
              { "bg-red-500/30 text-red-400": o === "down" }
            )}
          >
            {k.format(token.price)}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <span
            className={cn(
              "font-medium",
              n > 0 ? "text-green-400" : "text-red-400",
              n === 0 && "text-zinc-400"
            )}
          >
            {n === 0 ? "-" : X.format(n)}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <span className="text-white font-medium">{F.format(token.tvl)}</span>
        </TableCell>
        <TableCell className="text-right">
          <span className="text-white font-medium">{F.format(token.volume24h)}</span>
        </TableCell>
      </TableRow>
    </DialogTrigger>
  );
});
TokenRow.displayName = "TokenRow";