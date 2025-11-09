// This is the simplified type for the 5-column pixel-perfect design.
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

export type Category = {
  id: "new" | "stretch" | "migrated";
  name: string;
  description: string;
};

export type SortConfig = {
  key: keyof Token;
  direction: "ascending" | "descending";
} | null;