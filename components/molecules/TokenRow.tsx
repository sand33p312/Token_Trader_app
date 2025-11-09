"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Token } from "@/lib/types";

// --- Formatters ---
const k = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Price
const F = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2, notation: "compact" }); // Compact
const X = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "exceptZero" }); // Percent
const Z = "https://placehold.co/64x64/18181b/9ca3af?text="; // Placeholder

// --- TokenRow ---
type TokenRowProps = {
  token: Token;
  onTokenSelect: (token: Token) => void;
};

export const TokenRow = React.memo(({ token, onTokenSelect }: TokenRowProps) => {
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);
  
  const percentChange = token.priceChange24h / 100;
  
  // --- THIS IS THE FIX ---
  // We use refs to track the previous price AND the initial mount.
  const prevPriceRef = useRef(token.price);
  const isInitialMount = useRef(true);

  // Price flash effect (to clear the flash)
  useEffect(() => {
    if (priceFlash) {
      const timeout = setTimeout(() => setPriceFlash(null), 700);
      return () => clearTimeout(timeout);
    }
  }, [priceFlash]);

  // Detect price change
  useEffect(() => {
    // 1. Skip the very first render (so nothing flashes on load)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPriceRef.current = token.price; // Set the initial price
      return;
    }

    // 2. Check if the price has actually changed
    if (prevPriceRef.current !== token.price) {
      // 3. Determine the direction
      const direction = token.price > prevPriceRef.current ? "up" : "down";
      
      // 4. Use requestAnimationFrame to avoid the "sync setState" warning
      requestAnimationFrame(() => {
        setPriceFlash(direction);
      });
      
      // 5. Update the ref with the new price for the next comparison
      prevPriceRef.current = token.price;
    }
  }, [token.price]); // This effect only runs when token.price changes

  return (
    <DialogTrigger asChild>
      <TableRow
        className="cursor-pointer hover:bg-zinc-800"
        onClick={() => onTokenSelect(token)}
      >
        {/* Token Name & Logo */}
        <TableCell>
          <div className="flex items-center gap-3">
            <Image
              src={token.logo}
              alt={token.name}
              className="rounded-full"
              width={32}
              height={32}
              unoptimized={true}
              onError={(e) => (e.target as HTMLImageElement).src = `${Z}${token.name}`}
            />
            <div className="flex flex-col">
              <span className="font-medium text-white">{token.name}</span>
              <span className="text-sm text-zinc-400">{token.slug.toUpperCase()}</span>
            </div>
          </div>
        </TableCell>

        {/* Price */}
        <TableCell className="text-right">
          <span
            className={cn(
              "text-white font-medium transition-colors duration-500 p-1 rounded-sm",
              { "bg-green-500/30 text-green-400": priceFlash === "up" },
              { "bg-red-500/30 text-red-400": priceFlash === "down" }
            )}
          >
            {k.format(token.price)}
          </span>
        </TableCell>

        {/* 24h % Change */}
        <TableCell className="text-right">
          <span
            className={cn(
              "font-medium",
              percentChange > 0 ? "text-green-400" : "text-red-400",
              percentChange === 0 && "text-zinc-400"
            )}
          >
            {percentChange === 0 ? "-" : X.format(percentChange)}
          </span>
        </TableCell>

        {/* TVL */}
        <TableCell className="text-right">
          <span className="text-white font-medium">{F.format(token.tvl)}</span>
        </TableCell>

        {/* 24h Volume */}
        <TableCell className="text-right">
          <span className="text-white font-medium">{F.format(token.volume24h)}</span>
        </TableCell>
      </TableRow>
    </DialogTrigger>
  );
});
TokenRow.displayName = "TokenRow";