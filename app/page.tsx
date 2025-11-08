"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setActiveCategory, setSortConfig } from '@/lib/store/uiSlice';
import { Token, Category } from '@/lib/types';

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

import { InfoIcon, RefreshIcon } from '@/components/icons';
import { TokenTable } from '@/components/organisms/TokenTable';
import { TableSkeleton } from '@/components/organisms/TableSkeleton';
import { TokenDetailModal } from '@/components/organisms/TokenDetailModal';

// --- Mock Data with ALL fields ---
const Z = "https://placehold.co/64x64/18181b/9ca3af?text=";
const initialTokens: Token[] = [
  { 
    id: "1", name: "WETH", slug: "weth", logo: `${Z}WETH`, 
    price: 3789.45, priceChange24h: -1.2, tvl: 345000000, volume24h: 123000000, 
    category: "new", marketCap: 450000000, age: 45, holders: 12500, devHoldings: 3.5, liquidity: 89000000
  },
  { 
    id: "2", name: "USDC", slug: "usdc", logo: `${Z}USDC`, 
    price: 1.00, priceChange24h: 0.0, tvl: 5000000000, volume24h: 789000000, 
    category: "new", marketCap: 28000000000, age: 1200, holders: 850000, devHoldings: 0, liquidity: 4500000000
  },
  { 
    id: "3", name: "AXL", slug: "axl", logo: `${Z}AXL`, 
    price: 0.98, priceChange24h: 5.3, tvl: 76000000, volume24h: 2300000, 
    category: "new", marketCap: 145000000, age: 180, holders: 45000, devHoldings: 8.2, liquidity: 34000000
  },
  { 
    id: "4", name: "RNDR", slug: "rndr", logo: `${Z}RNDR`, 
    price: 10.15, priceChange24h: 8.1, tvl: 210000000, volume24h: 55000000, 
    category: "stretch", marketCap: 890000000, age: 540, holders: 125000, devHoldings: 5.1, liquidity: 98000000
  },
  { 
    id: "5", name: "TIA", slug: "tia", logo: `${Z}TIA`, 
    price: 11.50, priceChange24h: -3.4, tvl: 180000000, volume24h: 34000000, 
    category: "stretch", marketCap: 1200000000, age: 320, holders: 89000, devHoldings: 12.5, liquidity: 76000000
  },
  { 
    id: "6", name: "AERO", slug: "aero", logo: `${Z}AERO`, 
    price: 1.23, priceChange24h: 12.5, tvl: 65000000, volume24h: 15000000, 
    category: "migrated", marketCap: 234000000, age: 720, holders: 34000, devHoldings: 2.8, liquidity: 45000000
  },
  { 
    id: "7", name: "SNX", slug: "snx", logo: `${Z}SNX`, 
    price: 3.12, priceChange24h: 1.1, tvl: 95000000, volume24h: 8000000, 
    category: "migrated", marketCap: 678000000, age: 890, holders: 156000, devHoldings: 0.5, liquidity: 67000000
  },
  { 
    id: "8", name: "JUP", slug: "jup", logo: `${Z}JUP`, 
    price: 1.05, priceChange24h: -2.2, tvl: 120000000, volume24h: 42000000, 
    category: "new", marketCap: 456000000, age: 25, holders: 67000, devHoldings: 15.3, liquidity: 89000000
  },
  { 
    id: "9", name: "ENA", slug: "ena", logo: `${Z}ENA`, 
    price: 0.91, priceChange24h: 7.6, tvl: 88000000, volume24h: 21000000, 
    category: "stretch", marketCap: 289000000, age: 95, holders: 23000, devHoldings: 6.7, liquidity: 54000000
  },
];

const categories: Category[] = [
  { id: "new", name: "New Pairs", description: "Tokens recently launched on the platform." },
  { id: "stretch", name: "Final Stretch", description: "Tokens in their final liquidity mining phase." },
  { id: "migrated", name: "Migrated", description: "Tokens migrated from a previous version." },
];

// --- Mock API Fetch ---
const fetchTokens = async (): Promise<Token[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return initialTokens;
};

// --- Main App Component ---
export default function Home() {
  const queryClient = useQueryClient();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector((state) => state.ui.activeCategory);
  const sortConfig = useAppSelector((state) => state.ui.sortConfig);

  const { data: tokens, isLoading, refetch } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    staleTime: 1000 * 60,
  });

  // Mock WebSocket for real-time updates
  useEffect(() => {
    if (isLoading || !tokens) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * tokens.length);
      const tokenToUpdate = tokens[randomIndex];
      
      const newPrice = tokenToUpdate.price * (1 + (Math.random() - 0.495) * 0.05);
      
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
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading, tokens, queryClient]);

  // Memoized Sorting and Filtering
  const filteredAndSortedTokens = useMemo(() => {
    let processedTokens = [...(tokens || [])];
    
    processedTokens = processedTokens.filter(token => token.category === activeCategory);

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

  const handleSort = (key: keyof Token) => {
    const newSortConfig = {
      key,
      direction: (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') 
                   ? 'ascending' 
                   : 'descending'
    } as const;
    
    dispatch(setSortConfig(newSortConfig));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleQuickBuy = (token: Token) => {
    console.log("Quick buy:", token.name);
    // Implement quick buy logic
  };

  return (
    <TooltipProvider>
      <Dialog onOpenChange={(open) => !open && setSelectedToken(null)}>
        <main className="min-h-screen bg-zinc-950 p-4 md:p-6 lg:p-8 font-sans text-white">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Token Discovery</h1>
                <p className="text-base text-zinc-400">Discover the latest and trending tokens on the platform.</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshIcon className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 mb-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Button
                    variant={activeCategory === category.id ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-sm",
                      activeCategory !== category.id && "text-zinc-400"
                    )}
                    onClick={() => dispatch(setActiveCategory(category.id))}
                  >
                    {category.name}
                  </Button>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-help">
                        <InfoIcon className="h-4 w-4 text-zinc-500 hover:text-zinc-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      {category.description}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 mb-4 text-sm text-zinc-400">
              <div>
                <span className="text-zinc-500">Showing: </span>
                <span className="text-white font-medium">{filteredAndSortedTokens.length}</span>
                <span className="text-zinc-500"> tokens</span>
              </div>
              <div>
                <span className="text-zinc-500">Total Market Cap: </span>
                <span className="text-white font-medium">
                  ${(filteredAndSortedTokens.reduce((sum, t) => sum + t.marketCap, 0) / 1e9).toFixed(2)}B
                </span>
              </div>
              <div>
                <span className="text-zinc-500">24h Volume: </span>
                <span className="text-white font-medium">
                  ${(filteredAndSortedTokens.reduce((sum, t) => sum + t.volume24h, 0) / 1e9).toFixed(2)}B
                </span>
              </div>
            </div>

            {/* Table Section */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              {isLoading ? (
                <TableSkeleton />
              ) : filteredAndSortedTokens.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">
                  No tokens found in this category
                </div>
              ) : (
                <TokenTable
                  tokens={filteredAndSortedTokens}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onTokenSelect={(token) => setSelectedToken(token)}
                  onQuickBuy={handleQuickBuy}
                />
              )}
            </div>
          </div>

          <footer className="text-center text-zinc-500 mt-8 text-sm">
            This is a demo. All data is mock and for illustrative purposes only.
          </footer>
        </main>
        
        <TokenDetailModal token={selectedToken} />
      </Dialog>
    </TooltipProvider>
  );
}