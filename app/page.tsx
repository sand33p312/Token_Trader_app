"use client";

// --- React/Next Imports ---
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setActiveCategory, setSortConfig } from '@/lib/store/uiSlice';
import { Token, Category } from '@/lib/types'; // Uses the 5-column type

// --- shadcn/ui Component Imports ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --- Custom Component Imports ---
import { InfoIcon } from '@/components/icons'; // Only imports the 3 icons we need
import { TokenTable } from '@/components/organisms/TokenTable';
import { TableSkeleton } from '@/components/organisms/TableSkeleton';
import { TokenDetailModal } from '@/components/organisms/TokenDetailModal';


// --- Mock Data (5-column version) ---
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

// --- Mock API Fetch ---
const fetchTokens = async (): Promise<Token[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return initialTokens;
};

// --- Main App Component ---
export default function Home() {
  const queryClient = useQueryClient();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // --- Redux State ---
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector((state) => state.ui.activeCategory);
  const sortConfig = useAppSelector((state) => state.ui.sortConfig);

  // --- Data Fetching with React Query ---
  const { data: tokens, isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    staleTime: 1000 * 60, // 1 minute
  });

  // --- MOCK WebSocket for real-time updates ---
  useEffect(() => {
    if (isLoading) return; // Wait for initial load

    const interval = setInterval(() => {
      
      // 1. Get FRESH data directly from the query cache
      const currentTokens = queryClient.getQueryData<Token[]>(['tokens']);
      if (!currentTokens || currentTokens.length === 0) return;

      // 2. Pick a random token from the FRESH data
      const randomIndex = Math.floor(Math.random() * currentTokens.length);
      const tokenToUpdate = currentTokens[randomIndex];
      
      // 3. Calculate a new price
      const newPrice = tokenToUpdate.price * (1 + (Math.random() - 0.5) * 0.05); // +/- 2.5%
      
      // 4. Update the React Query cache
      queryClient.setQueryData(['tokens'], (oldData: Token[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(token =>
          token.id === tokenToUpdate.id
            ? {
                ...token,
                price: newPrice,
                priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 0.1,
                volume24h: token.volume24h + Math.random() * 10000,
              }
            : token
        );
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLoading, queryClient]); // Removed 'tokens' to prevent stale state

  // --- Memoized Sorting and Filtering ---
  const filteredAndSortedTokens = useMemo(() => {
    let processedTokens = [...(tokens || [])];
    
    // Filter
    processedTokens = processedTokens.filter(token => token.category === activeCategory);

    // Sort
    if (sortConfig) {
      processedTokens.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (sortConfig.direction === "ascending") {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });
    }
    return processedTokens;
  }, [tokens, activeCategory, sortConfig]);

  // --- Event Handlers ---
  const handleSort = (key: keyof Token) => {
    // Create the new sort config based on previous state
    const newSortConfig = {
      key,
      direction: (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') 
                   ? 'ascending' 
                   : 'descending'
    } as const;
    
    dispatch(setSortConfig(newSortConfig));
  };


  // We wrap the *entire* page in TooltipProvider FIRST,
  // and THEN wrap the main content in Dialog.
  return (
    <TooltipProvider>
      <Dialog onOpenChange={(open) => !open && setSelectedToken(null)}>
        <main className="min-h-screen bg-zinc-950 p-4 md:p-8 font-sans text-white">
          <div className="max-w-7xl mx-auto">
            {/* Pixel-perfect title styling */}
            <h1 className="text-2xl font-semibold text-white mb-2">Token Discovery</h1>
            <p className="text-base text-zinc-400 mb-6">Discover the latest and trending tokens on the platform.</p>

            {/* --- Category Tabs --- */}
            <div className="flex items-center gap-2 mb-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Button
                    variant={activeCategory === category.id ? "secondary" : "ghost"}
                    className={cn(
                      activeCategory !== category.id && "text-zinc-400"
                    )}
                    onClick={() => dispatch(setActiveCategory(category.id))}
                  >
                    {category.name}
                  </Button>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label={`Info about ${category.name}`}
                      >
                        <InfoIcon className="h-4 w-4 text-zinc-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      {category.description}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>

            {/* --- Table Section --- */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              {isLoading || filteredAndSortedTokens.length === 0 ? (
                <TableSkeleton />
              ) : (
                <TokenTable
                  tokens={filteredAndSortedTokens}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onTokenSelect={(token) => setSelectedToken(token)}
                  // onQuickBuy prop is removed
                />
              )}
            </div>
          </div>

          <footer className="text-center text-zinc-500 mt-8">
            This is a demo. All data is mock and for illustrative purposes only.
          </footer>
        </main>
        
        {/* --- Token Modal --- */}
        <TokenDetailModal token={selectedToken} />
        
      </Dialog>
    </TooltipProvider>
  );
}