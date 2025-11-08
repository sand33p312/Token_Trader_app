// This is an "organism" component
"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TokenRow } from "@/components/molecules/TokenRow";
import { Token, SortConfig } from "@/lib/types"; // We will create this
import { ArrowUpIcon, ArrowDownIcon } from "@/components/icons";

// --- SortIcon ---
const SortIcon = ({ sortConfig, columnKey }: { sortConfig: SortConfig, columnKey: keyof Token }) => {
  if (!sortConfig || sortConfig.key !== columnKey) return null;
  return sortConfig.direction === "ascending" ? (
    <ArrowUpIcon className="h-4 w-4" />
  ) : (
    <ArrowDownIcon className="h-4 w-4" />
  );
};

// --- Core Table Component ---
type TokenTableProps = {
  tokens: Token[];
  onSort: (key: keyof Token) => void;
  sortConfig: SortConfig;
  onTokenSelect: (token: Token) => void;
};

export const TokenTable = ({ tokens, onSort, sortConfig, onTokenSelect }: TokenTableProps) => {
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