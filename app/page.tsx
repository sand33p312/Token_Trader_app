"use client"; 

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Token, SortConfig, Category } from "@/lib/types";
import { InfoIcon } from "@/components/icons";
import { TokenTable } from "@/components/organisms/TokenTable";
import {TableSkeleton} from "@/components/organisms/TableSkeleton";
import { TokenDetailModal } from "@/components/organisms/TokenDetailModal";
import {
  setActiveCategory,
  setSortConfig,
  selectActiveCategory,
  selectSortConfig,
} from '@/lib/store/uiSlice'; // Import actions and selectors
import { RootState, AppDispatch } from '@/lib/store/store'; // Import types


// --- Mock Data ---
const Z = "https://placehold.co/64x64/18181b/9ca3af?text=";
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

// Mock API call
const fetchTokens = (): Promise<Token[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialTokens);
    }, 1500);
  });
};


export default function Home() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>(); // Get the dispatch function

  // --- Read UI state from Redux ---
  const activeCategory = useSelector(selectActiveCategory);
  const sortConfig = useSelector(selectSortConfig);
  
  // --- Local state for modal ---
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // --- Data Fetching with React Query ---
  const { data: tokens, isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    initialData: initialTokens,
    staleTime: 1000 * 60,
  });

  // MOCK WebSocket for real-time updates (This logic is unchanged)
  useEffect(() => {
    if (isLoading) return; 
    const priceUpdateInterval = setInterval(() => {
      queryClient.setQueryData(['tokens'], (prevTokens: Token[] | undefined) => {
        if (!prevTokens) return [];
        
        const randomIndex = Math.floor(Math.random() * prevTokens.length);
        const newTokens = [...prevTokens];
        const tokenToUpdate = newTokens[randomIndex];
        const newPrice = tokenToUpdate.price * (1 + (Math.random() - 0.495) * 0.05);
        
        newTokens[randomIndex] = {
          ...tokenToUpdate,
          price: newPrice,
          priceChange24h: tokenToUpdate.priceChange24h + (Math.random() - 0.5) * 0.1,
          volume24h: tokenToUpdate.volume24h + Math.random() * 10000,
        };
        return newTokens;
      });
    }, 2000);
    return () => clearInterval(priceUpdateInterval);
  }, [isLoading, queryClient]);

  // --- Memoized Sorting and Filtering (Uses Redux state) ---
  const filteredAndSortedTokens = useMemo(() => {
    let currentTokens = [...(tokens || [])];
    
    // Filter
    currentTokens = currentTokens.filter(token => token.category === activeCategory);

    // Sort
    if (sortConfig) {
      currentTokens.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (sortConfig.key === "name") {
          valA = (valA as string).toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (sortConfig.direction === "ascending") {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });
    }
    return currentTokens;
  }, [tokens, activeCategory, sortConfig]); // Now depends on Redux state

  // --- Event Handlers (Dispatch Redux Actions) ---
  const handleSort = (key: keyof Token) => {
    // Create new sort config
    let newSortConfig: SortConfig;
    if (sortConfig && sortConfig.key === key) {
      newSortConfig = {
        key,
        direction: sortConfig.direction === "ascending" ? "descending" : "ascending",
      };
    } else {
      newSortConfig = { key, direction: "descending" };
    }
    // Dispatch the action to Redux
    dispatch(setSortConfig(newSortConfig));
  };

  const handleCategoryChange = (categoryId: Category['id']) => {
    // Dispatch the action to Redux
    dispatch(setActiveCategory(categoryId));
  };

  return (
    <TooltipProvider>
      <Dialog onOpenChange={(open) => !open && setSelectedToken(null)}>
        <main className="min-h-screen bg-zinc-950 p-4 md:p-8 font-sans text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Token Discovery</h1>
            <p className="text-lg text-zinc-400 mb-8">Discover the latest and trending tokens on the platform.</p>

            {/* --- Category Tabs (dispatch action onClick) --- */}
            <div className="flex items-center gap-2 mb-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "secondary" : "ghost"}
                  className={cn("gap-2", activeCategory === category.id ? "text-white" : "text-zinc-400")}
                  onClick={() => handleCategoryChange(category.id)} // Use new handler
                >
                  {category.name}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">{category.description}</TooltipContent>
                  </Tooltip>
                </Button>
              ))}
            </div>

            {/* --- Table Section (reads from Redux) --- */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              {isLoading && filteredAndSortedTokens.length === 0 ? <TableSkeleton /> : ( 
                <TokenTable
                  tokens={filteredAndSortedTokens}
                  onSort={handleSort} // Uses new handler
                  sortConfig={sortConfig} // Reads from Redux
                  onTokenSelect={(token) => { setSelectedToken(token); }}
                />
              )}
            </div>
          </div>

          {/* --- Token Modal --- */}
          <TokenDetailModal token={selectedToken} />

          <footer className="text-center text-zinc-500 mt-8">
            This is a demo. All data is mock and for illustrative purposes only.
          </footer>
        </main>
      </Dialog>
    </TooltipProvider>
  );
}