"use client"; // Required for React hooks (useState, useEffect)

// --- React Imports ---
import React, { useState, useMemo, useEffect, useRef, forwardRef, ReactNode } from 'react';

// --- shadcn/ui Component Imports ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"; // shadcn's class helper

// --- Helper Types ---
type Token = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  price: number;
  priceChange24h: number;
  tvl: number;
  volume24h: number;
  category: "new" | "stretch" | "migrated";
};

type SortConfig = {
  key: keyof Token;
  direction: "ascending" | "descending";
} | null;

type Category = {
  id: "new" | "stretch" | "migrated";
  name: string;
  description: string;
};

// --- Mock Data ---
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

// --- Formatters ---
const k = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Price
const F = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2, notation: "compact" }); // Compact
const X = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "exceptZero" }); // Percent

// --- Inline SVG Icons (Lucide) ---
const InfoIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4", className)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
);
const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m19 12-7 7-7-7" />
    <path d="M12 5v14" />
  </svg>
);

// --- Core Table Component ---
type TokenTableProps = {
  tokens: Token[];
  onSort: (key: keyof Token) => void;
  sortConfig: SortConfig;
  onTokenSelect: (token: Token) => void;
};

const TokenTable = ({ tokens, onSort, sortConfig, onTokenSelect }: TokenTableProps) => {
  const n = (key: keyof Token) => { onSort(key); }; // handleSort
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">
            <button className="flex items-center gap-1" onClick={() => n("name")}>
              Token <SortIcon sortConfig={sortConfig} columnKey="name" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full" onClick={() => n("price")}>
              Price <SortIcon sortConfig={sortConfig} columnKey="price" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full" onClick={() => n("priceChange24h")}>
              24h % <SortIcon sortConfig={sortConfig} columnKey="priceChange24h" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full" onClick={() => n("tvl")}>
              TVL <SortIcon sortConfig={sortConfig} columnKey="tvl" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full" onClick={() => n("volume24h")}>
              24h Volume <SortIcon sortConfig={sortConfig} columnKey="volume24h" />
            </button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((s) => (
          <TokenRow key={s.id} token={s} onTokenSelect={onTokenSelect} />
        ))}
      </TableBody>
    </Table>
  );
};

// --- TokenRow ---
type TokenRowProps = {
  token: Token;
  onTokenSelect: (token: Token) => void;
};

const TokenRow = React.memo(({ token, onTokenSelect }: TokenRowProps) => {
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
      // Capture the direction
      const direction = token.price > prevPrice.current ? "up" : "down";
      
      // Schedule the state update asynchronously
      timerId = setTimeout(() => {
        r(direction);
      }, 0);
    }
    
    // Always update the prevPrice ref synchronously
    prevPrice.current = token.price;

    // Cleanup the timer if the component re-renders or unmounts
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
            <img
              src={token.logo}
              alt={token.name}
              className="h-8 w-8 rounded-full"
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

// --- SortIcon ---
const SortIcon = ({ sortConfig, columnKey }: { sortConfig: SortConfig, columnKey: keyof Token }) => {
  if (!sortConfig || sortConfig.key !== columnKey) return null;
  return sortConfig.direction === "ascending" ? (
    <ArrowUpIcon className="h-4 w-4" />
  ) : (
    <ArrowDownIcon className="h-4 w-4" />
  );
};

// --- Loading Skeleton ---
const TableSkeleton = (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[250px]">Token</TableHead>
        <TableHead className="text-right">Price</TableHead>
        <TableHead className="text-right">24h %</TableHead>
        <TableHead className="text-right">TVL</TableHead>
        <TableHead className="text-right">24h Volume</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, t) => (
        <TableRow key={t}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// --- Token Detail Modal Content ---
const TokenDetailModal = ({ token }: { token: Token | null }) => {
  if (!token) return null;
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <img
            src={token.logo}
            alt={token.name}
            className="h-10 w-10 rounded-full"
            onError={(e) => (e.target as HTMLImageElement).src = `${Z}${token.name}`}
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
        {/* We can't use DialogClose as a button, so we control open state manually */}
        {/* <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button> */}
        <Button onClick={() => alert("Trading not implemented in this demo!")}>Trade</Button>
      </div>
    </DialogContent>
  );
};

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

