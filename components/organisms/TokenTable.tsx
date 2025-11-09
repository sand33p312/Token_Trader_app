"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Token, SortConfig } from "@/lib/types";
import { TokenRow } from "@/components/molecules/TokenRow";
import { ArrowUpIcon, ArrowDownIcon } from "@/components/icons";

// --- SortIcon ---
const SortIcon = ({ 
  sortConfig, 
  columnKey 
}: { 
  sortConfig: SortConfig; 
  columnKey: keyof Token;
}) => {
  if (!sortConfig || sortConfig.key !== columnKey) return null;
  return sortConfig.direction === "ascending" ? (
    <ArrowUpIcon className="h-4 w-4" />
  ) : (
    <ArrowDownIcon className="h-4 w-4" />
  );
};

// --- TokenTable Props ---
type TokenTableProps = {
  tokens: Token[];
  onSort: (key: keyof Token) => void;
  sortConfig: SortConfig;
  onTokenSelect: (token: Token) => void;
};

export const TokenTable = ({ 
  tokens, 
  onSort, 
  sortConfig, 
  onTokenSelect 
}: TokenTableProps) => {
  
  const handleSort = (key: keyof Token) => { 
    onSort(key); 
  };

  // --- Pixel-Perfect Styling for Headers (matches Axiom) ---
  const headerButtonClass = "flex items-center gap-1 text-zinc-400 hover:text-white transition-colors";
  const headerTextClass = "uppercase tracking-wider font-medium text-xs"; // Axiom uses uppercase, spaced, small text

  return (
    // --- THIS IS THE FIX ---
    // This div allows the table to scroll horizontally on small screens
    <div className="overflow-x-auto">
      {/* Set a min-width to force scrolling, 640px is a good default */}
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="border-b-zinc-800">
            {/* Token */}
            <TableHead className="w-[250px] text-zinc-400">
              <button className={headerButtonClass} onClick={() => handleSort("name")}>
                <span className={headerTextClass}>Token</span>
                <SortIcon sortConfig={sortConfig} columnKey="name" />
              </button>
            </TableHead>

            {/* Price */}
            <TableHead className="text-right text-zinc-400">
              <button className={`${headerButtonClass} justify-end w-full`} onClick={() => handleSort("price")}>
                <span className={headerTextClass}>Price</span>
                <SortIcon sortConfig={sortConfig} columnKey="price" />
              </button>
            </TableHead>

            {/* 24h % */}
            <TableHead className="text-right text-zinc-400">
              <button className={`${headerButtonClass} justify-end w-full`} onClick={() => handleSort("priceChange24h")}>
                <span className={headerTextClass}>24h %</span>
                <SortIcon sortConfig={sortConfig} columnKey="priceChange24h" />
              </button>
            </TableHead>

            {/* TVL */}
            <TableHead className="text-right text-zinc-400">
              <button className={`${headerButtonClass} justify-end w-full`} onClick={() => handleSort("tvl")}>
                <span className={headerTextClass}>TVL</span>
                <SortIcon sortConfig={sortConfig} columnKey="tvl" />
              </button>
            </TableHead>

            {/* 24h Volume */}
            <TableHead className="text-right text-zinc-400">
              <button className={`${headerButtonClass} justify-end w-full`} onClick={() => handleSort("volume24h")}>
                <span className={headerTextClass}>24h Volume</span>
                <SortIcon sortConfig={sortConfig} columnKey="volume24h" />
              </button>
            </TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TokenRow 
              key={token.id} 
              token={token} 
              onTokenSelect={onTokenSelect}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};