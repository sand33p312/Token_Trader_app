"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Token } from "@/lib/types";
import { LightningIcon } from "@/components/icons";

// --- Formatters ---
const formatPrice = new Intl.NumberFormat("en-US", { 
  style: "currency", 
  currency: "USD", 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 6 
});

const formatCompact = new Intl.NumberFormat("en-US", { 
  style: "currency", 
  currency: "USD", 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2, 
  notation: "compact",
  compactDisplay: "short"
});

const formatPercent = new Intl.NumberFormat("en-US", { 
  style: "percent", 
  minimumFractionDigits: 1, 
  maximumFractionDigits: 1, 
  signDisplay: "exceptZero" 
});

const formatNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short"
});

const Z = "https://placehold.co/64x64/18181b/9ca3af?text=";

// --- TokenRow ---
type TokenRowProps = {
  token: Token;
  onTokenSelect: (token: Token) => void;
  onQuickBuy?: (token: Token) => void;
};

export const TokenRow = React.memo(({ token, onTokenSelect, onQuickBuy }: TokenRowProps) => {
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);
  const percentChange = token.priceChange24h / 100;
  const devHoldingPercent = token.devHoldings / 100;
  const prevPriceRef = useRef(token.price);
  const isInitialMount = useRef(true);

  // Detect price change and set flash
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPriceRef.current = token.price;
      return;
    }

    if (prevPriceRef.current !== token.price) {
      const direction = token.price > prevPriceRef.current ? "up" : "down";
      
      requestAnimationFrame(() => {
        setPriceFlash(direction);
      });
      
      prevPriceRef.current = token.price;
    }
  }, [token.price]);

  // Clear flash after animation
  useEffect(() => {
    if (priceFlash) {
      const timeout = setTimeout(() => setPriceFlash(null), 700);
      return () => clearTimeout(timeout);
    }
  }, [priceFlash]);

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickBuy?.(token);
  };

  return (
    <DialogTrigger asChild>
      <TableRow
        className="cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => onTokenSelect(token)}
      >
        {/* Token Name & Logo */}
        <TableCell className="sticky left-0 bg-zinc-900/95 backdrop-blur-sm">
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
              <span className="font-medium text-white text-sm">{token.name}</span>
              <span className="text-xs text-zinc-500">{token.slug.toUpperCase()}</span>
            </div>
          </div>
        </TableCell>

        {/* Price */}
        <TableCell className="text-right">
          <span
            className={cn(
              "text-white font-medium text-sm transition-all duration-500 px-2 py-1 rounded",
              priceFlash === "up" && "bg-green-500/20 text-green-400",
              priceFlash === "down" && "bg-red-500/20 text-red-400"
            )}
          >
            {formatPrice.format(token.price)}
          </span>
        </TableCell>

        {/* 24h % Change */}
        <TableCell className="text-right">
          <span
            className={cn(
              "font-medium text-sm",
              percentChange > 0 ? "text-green-400" : "text-red-400",
              percentChange === 0 && "text-zinc-500"
            )}
          >
            {percentChange === 0 ? "-" : formatPercent.format(percentChange)}
          </span>
        </TableCell>

        {/* Market Cap */}
        <TableCell className="text-right">
          <span className="text-white font-medium text-sm">
            {formatCompact.format(token.marketCap)}
          </span>
        </TableCell>

        {/* Age */}
        <TableCell className="text-right">
          <span className="text-zinc-400 text-sm">
            {token.age < 60 ? `${token.age}m` : `${Math.floor(token.age / 60)}h`}
          </span>
        </TableCell>

        {/* Holders */}
        <TableCell className="text-right">
          <span className="text-white text-sm">
            {formatNumber.format(token.holders)}
          </span>
        </TableCell>

        {/* Dev Holdings */}
        <TableCell className="text-right">
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "text-sm font-medium cursor-help",
                  devHoldingPercent > 0.1 ? "text-red-400" : "text-green-400"
                )}
              >
                {formatPercent.format(devHoldingPercent)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Developer holds {formatPercent.format(devHoldingPercent)} of supply
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* TVL */}
        <TableCell className="text-right">
          <span className="text-white font-medium text-sm">
            {formatCompact.format(token.tvl)}
          </span>
        </TableCell>

        {/* 24h Volume */}
        <TableCell className="text-right">
          <span className="text-white font-medium text-sm">
            {formatCompact.format(token.volume24h)}
          </span>
        </TableCell>

        {/* Quick Buy Button */}
        <TableCell className="text-right">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors"
            onClick={handleQuickBuy}
          >
            <LightningIcon className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    </DialogTrigger>
  );
});

TokenRow.displayName = "TokenRow";