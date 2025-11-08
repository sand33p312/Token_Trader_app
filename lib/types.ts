// We need a central place for our data types.
// Create this new file in `lib/types.ts`

export type Token = {
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

export type SortConfig = {
  key: keyof Token;
  direction: "ascending" | "descending";
} | null;

export type Category = {
  id: "new" | "stretch" | "migrated";
  name: string;
  description: string;
};