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
const SortIcon = ({ sortConfig, columnKey }: { sortConfig: SortConfig, columnKey: keyof Token }) => {
  if (!sortConfig || sortConfig.key !== columnKey) return null;
  return sortConfig.direction === "ascending" ? (
    <ArrowUpIcon className="h-3 w-3" />
  ) : (
    <ArrowDownIcon className="h-3 w-3" />
  );
};

// --- TokenTable Props ---
type TokenTableProps = {
  tokens: Token[];
  onSort: (key: keyof Token) => void;
  sortConfig: SortConfig;
  onTokenSelect: (token: Token) => void;
  onQuickBuy?: (token: Token) => void;
};

export const TokenTable = ({ 
  tokens, 
  onSort, 
  sortConfig, 
  onTokenSelect,
  onQuickBuy 
}: TokenTableProps) => {
  const handleSort = (key: keyof Token) => { 
    onSort(key); 
  };

  const headerClass = "text-xs text-zinc-500 font-normal hover:text-white transition-colors";
  const buttonClass = "flex items-center gap-1 hover:text-white transition-colors";

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-[200px] sticky left-0 bg-zinc-900 z-10">
              <button 
                className={buttonClass} 
                onClick={() => handleSort("name")}
              >
                <span className={headerClass}>Token</span>
                <SortIcon sortConfig={sortConfig} columnKey="name" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("price")}
              >
                <span className={headerClass}>Price</span>
                <SortIcon sortConfig={sortConfig} columnKey="price" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("priceChange24h")}
              >
                <span className={headerClass}>24h %</span>
                <SortIcon sortConfig={sortConfig} columnKey="priceChange24h" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("marketCap")}
              >
                <span className={headerClass}>Market Cap</span>
                <SortIcon sortConfig={sortConfig} columnKey="marketCap" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("age")}
              >
                <span className={headerClass}>Age</span>
                <SortIcon sortConfig={sortConfig} columnKey="age" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("holders")}
              >
                <span className={headerClass}>Holders</span>
                <SortIcon sortConfig={sortConfig} columnKey="holders" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("devHoldings")}
              >
                <span className={headerClass}>Dev %</span>
                <SortIcon sortConfig={sortConfig} columnKey="devHoldings" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("tvl")}
              >
                <span className={headerClass}>TVL</span>
                <SortIcon sortConfig={sortConfig} columnKey="tvl" />
              </button>
            </TableHead>

            <TableHead className="text-right">
              <button 
                className={`${buttonClass} justify-end w-full`} 
                onClick={() => handleSort("volume24h")}
              >
                <span className={headerClass}>24h Volume</span>
                <SortIcon sortConfig={sortConfig} columnKey="volume24h" />
              </button>
            </TableHead>

            <TableHead className="text-right w-[60px]">
              <span className={headerClass}>Buy</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tokens.map((token) => (
            <TokenRow 
              key={token.id} 
              token={token} 
              onTokenSelect={onTokenSelect}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};