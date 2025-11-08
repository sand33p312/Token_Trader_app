// Updated Token type with additional fields for pixel-perfect match
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
  
  // New fields for Axiom-style table
  marketCap: number;
  age: number; // in minutes
  holders: number;
  devHoldings: number; // percentage
  liquidity: number;
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

export type FilterConfig = {
  minMarketCap?: number;
  maxMarketCap?: number;
  minAge?: number;
  maxAge?: number;
  minHolders?: number;
};