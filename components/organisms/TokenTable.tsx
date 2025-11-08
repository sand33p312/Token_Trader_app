// This is an "organism" component that builds the main table
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
// A small internal component to show the sort direction
const SortIcon = ({ sortConfig, columnKey }: { sortConfig: SortConfig, columnKey: keyof Token }) => {
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

export const TokenTable = ({ tokens, onSort, sortConfig, onTokenSelect }: TokenTableProps) => {
  const handleSort = (key: keyof Token) => { onSort(key); };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">
            <button className="flex items-center gap-1 text-zinc-400 hover:text-white" onClick={() => handleSort("name")}>
              Token <SortIcon sortConfig={sortConfig} columnKey="name" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full text-zinc-400 hover:text-white" onClick={() => handleSort("price")}>
              Price <SortIcon sortConfig={sortConfig} columnKey="price" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full text-zinc-400 hover:text-white" onClick={() => handleSort("priceChange24h")}>
              24h % <SortIcon sortConfig={sortConfig} columnKey="priceChange24h" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full text-zinc-400 hover:text-white" onClick={() => handleSort("tvl")}>
              TVL <SortIcon sortConfig={sortConfig} columnKey="tvl" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 justify-end w-full text-zinc-400 hover:text-white" onClick={() => handleSort("volume24h")}>
              24h Volume <SortIcon sortConfig={sortConfig} columnKey="volume24h" />
            </button>
          </TableHead>
          {/* --- END OF FIX --- */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TokenRow key={token.id} token={token} onTokenSelect={onTokenSelect} />
        ))}
      </TableBody>
    </Table>
  );
};