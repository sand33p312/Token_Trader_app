"use client"; 

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Token, SortConfig, Category } from "@/lib/types"; // Import from types file
import { InfoIcon } from "@/components/icons"; // Import from icons file
import { TokenTable } from "@/components/organisms/TokenTable";
import { TableSkeleton } from "@/components/organisms/TableSkeleton";
import { TokenDetailModal } from "@/components/organisms/TokenDetailModal";

// --- Mock Data ---
// This data will be moved to React Query
const Z = "https://placehold.co/64x64/18181b/9ca3af?text="; // Placeholder URL
const initialTokens: Token[] = [
  { id: "1", name: "WETH", slug: "weth", logo: `${Z}WETH`, price: 3789.45, priceChange24h: -1.2, tvl: 345000000, volume24h: 123000000, category: "new" },
  { id: "2", name: "USDC", slug: "usdc", logo: `${Z}USDC`, price: 1.00, priceChange24h: 0.0, tvl: 5000000000, volume24h: 789000000, category: "new" },
  { id: "3", name: "AXL", slug: "axl", logo: `${Z}AXL`, price: 0.98, priceChange24h: 5.3, tvl: 76000000, volume24h: 2300000, category: "new" },
  { id: "4", name: "RNDR", slug: "rndr", logo: `${Z}RNDR`, price: 10.15, priceChange24h: 8.1, tvl: 210000000, volume24h: 55000000, category: "stretch" },
  { id: "5", name: "TIA", slug: "tia", logo: `${Z}TIA`, price: 11.50, priceChange24h: -3.4, tvl: 180000000, volume24h: 34000000, category: "stretch" },
  { id: "6", name: "AERO", slug: "aero", logo: `${Z}AERO`, price: 1.23, priceChange24h: 12.5, tvl: 65000000, volume24h: 15000000, category: "migrated" },
  { id: "7", name: "SNX", slug: "snx", logo: `${Z}SNX`, price: 3.12, priceChange24h: 1.1, tvl: 95000000, volume24h: 8000000, category: "migrated" },
  { id: "8", name: "JUP", slug: "jup", logo: `${Z}JUP`, price: 1.05, priceChange24h: -2.2, tvl: 120000000, volume24h: 42000000, category: "new" },
  { id: "9", name: "ENA", slug: "ena", logo: `${Z}ENA`, price: 0.91, priceChange24h: 7.6, tvl: 88000000, volume24h: 21000000, category: "stretch" },
];

const categories: Category[] = [
  { id: "new", name: "New Pairs", description: "Tokens recently launched on the platform." },
  { id: "stretch", name: "Final Stretch", description: "Tokens in their final liquidity mining phase." },
  { id: "migrated", name: "Migrated", description: "Tokens migrated from a previous version." },
];

// --- Main App Component ---
export default function Home() {
  const [e, t] = useState<Token[]>(initialTokens); // [tokens, setTokens]
  const [o, r] = useState<Category['id']>("new"); // [activeCategory, setActiveCategory]
  const [n, s] = useState(true); // [isLoading, setIsLoading]
  const [a, l] = useState<Token | null>(null); // [selectedToken, setSelectedToken]
  const [i, m] = useState<SortConfig>({ key: "tvl", direction: "descending" }); // [sortConfig, setSortConfig]

  // Simulate initial data load
  useEffect(() => {
    const p = setTimeout(() => {
      t(initialTokens);
      s(false); // setIsLoading
    }, 1500);
    return () => clearTimeout(p);
  }, []);

  // --- MOCK WebSocket for real-time updates ---
  useEffect(() => {
    if (n) return; // Don't run if loading
    const p = setInterval(() => { // interval
      t((prevTokens) => { // setTokens
        const g = Math.floor(Math.random() * prevTokens.length); // randomIndex
        const f = [...prevTokens]; // newTokens
        const h = f[g]; // tokenToUpdate
        const v = h.price * (1 + (Math.random() - 0.495) * 0.05); // newPrice
        f[g] = {
          ...h,
          price: v,
          priceChange24h: h.priceChange24h + (Math.random() - 0.5) * 0.1,
          volume24h: h.volume24h + Math.random() * 10000,
        };
        return f;
      });
    }, 2000);
    return () => clearInterval(p);
  }, [n]); // Dependency on isLoading

  // --- Memoized Sorting and Filtering ---
  const p = useMemo(() => { // filteredAndSortedTokens
    let p = [...e]; // tokens
    
    // Filter
    if (o === "new") p = p.filter((g) => g.category === "new");
    else if (o === "stretch") p = p.filter((g) => g.category === "stretch");
    else if (o === "migrated") p = p.filter((g) => g.category === "migrated");

    // Sort
    if (i) { // sortConfig
      p.sort((g, f) => {
        let h = g[i.key]; // valA
        let v = f[i.key]; // valB
        if (i.key === "name") {
          h = (h as string).toLowerCase();
          v = (v as string).toLowerCase();
        }
        if (i.direction === "ascending") {
          return h > v ? 1 : h < v ? -1 : 0;
        } else {
          return h < v ? 1 : h > v ? -1 : 0;
        }
      });
    }
    return p;
  }, [e, o, i]); // [tokens, activeCategory, sortConfig]

  const g = (key: keyof Token) => { // handleSort
    m((prevConfig) => { // setSortConfig
      if (prevConfig && prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "descending" };
    });
  };

  return (
    <TooltipProvider>
      <Dialog onOpenChange={(open) => !open && l(null)}>
        <main className="min-h-screen bg-zinc-950 p-4 md:p-8 font-sans text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Token Discovery</h1>
            <p className="text-lg text-zinc-400 mb-8">Discover the latest and trending tokens on the platform.</p>

            {/* --- Category Tabs --- */}
            <div className="flex items-center gap-2 mb-4">
              {categories.map((f) => ( // category
                <Button
                  key={f.id}
                  variant={o === f.id ? "secondary" : "ghost"}
                  className={cn("gap-2", o === f.id ? "text-white" : "text-zinc-400")}
                  onClick={() => r(f.id)}
                >
                  {f.name}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">{f.description}</TooltipContent>
                  </Tooltip>
                </Button>
              ))}
            </div>

            {/* --- Table Section --- */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              {n ? TableSkeleton : (
                <TokenTable
                  tokens={p}
                  onSort={g}
                  sortConfig={i}
                  onTokenSelect={(f) => { l(f); }}
                />
              )}
            </div>
          </div>

          {/* --- Token Modal --- */}
          <TokenDetailModal token={a} />

          <footer className="text-center text-zinc-500 mt-8">
            This is a demo. All data is mock and for illustrative purposes only.
          </footer>
        </main>
      </Dialog>
    </TooltipProvider>
  );
}