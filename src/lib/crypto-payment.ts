// Crypto Payment Utility for NyinyiStore

export const PAYMENT_ADDRESSES = {
  EVM: "0x86b0BA2F0bA368e7db211dBa527788263f87d3C4",
  SOLANA: "Cubf1BTHCmBaHPJoVsHgJu33CRTzQac5FBndbsQyQAE1",
} as const;

export const ORDER_EXPIRY_MINUTES = 15;

export type ChainId = "ethereum" | "bsc" | "base" | "arbitrum" | "solana";
export type TokenId = "usdt" | "usdc";

export interface ChainConfig {
  id: ChainId;
  name: string;
  icon: string;
  tokens: TokenConfig[];
  paymentAddress: string;
}

export interface TokenConfig {
  id: TokenId;
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "⟠",
    paymentAddress: PAYMENT_ADDRESSES.EVM,
    tokens: [
      {
        id: "usdt",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 6,
        contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      {
        id: "usdc",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
    ],
  },
  {
    id: "bsc",
    name: "BSC",
    icon: "🟡",
    paymentAddress: PAYMENT_ADDRESSES.EVM,
    tokens: [
      {
        id: "usdt",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 18,
        contractAddress: "0x55d398326f99059fF775485246999027B3197955",
      },
      {
        id: "usdc",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 18,
        contractAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      },
    ],
  },
  {
    id: "base",
    name: "Base",
    icon: "🔵",
    paymentAddress: PAYMENT_ADDRESSES.EVM,
    tokens: [
      {
        id: "usdc",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
    ],
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "🔷",
    paymentAddress: PAYMENT_ADDRESSES.EVM,
    tokens: [
      {
        id: "usdc",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        contractAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
    ],
  },
  {
    id: "solana",
    name: "Solana",
    icon: "◎",
    paymentAddress: PAYMENT_ADDRESSES.SOLANA,
    tokens: [
      {
        id: "usdt",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 6,
        contractAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      },
      {
        id: "usdc",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        contractAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      },
    ],
  },
];

export interface Order {
  id: string;
  game_slug: string;
  denomination_id: string;
  denomination_label: string;
  user_id: string;
  server_id?: string;
  payment_chain: ChainId;
  payment_token: TokenId;
  payment_address: string;
  amount_idr: number;
  amount_crypto: string;
  token_symbol: string;
  status: "pending" | "paid" | "processing" | "completed" | "failed" | "expired";
  tx_hash?: string;
  created_at: string;
  expires_at: string;
  // Digiflazz fulfillment fields
  digiflazz_ref_id?: string;
  digiflazz_status?: string;
  digiflazz_sn?: string;
  digiflazz_message?: string;
  updated_at?: string;
}

/**
 * Generate a unique order ID
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `NS-${timestamp}-${random}`.toUpperCase();
}

/**
 * Fetch USDT/IDR rate from CoinGecko
 * Falls back to a reasonable estimate if API fails
 */
export async function getUsdtToIdrRate(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr",
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("CoinGecko API error");
    const data = await res.json();
    return data.tether.idr;
  } catch {
    // Fallback rate ~16,300 IDR per USDT (approximate)
    return 16300;
  }
}

/**
 * Calculate crypto amount from IDR price with unique suffix
 * Adds random cents (0.001-0.009) to make each order unique for auto-detection
 */
export async function calculateCryptoAmount(priceIdr: number): Promise<string> {
  const rate = await getUsdtToIdrRate();
  const amount = priceIdr / rate;
  // Add unique suffix (0.001 - 0.099) for payment matching
  const uniqueSuffix = (Math.floor(Math.random() * 99) + 1) / 1000;
  const finalAmount = amount + uniqueSuffix;
  // 3 decimal places for unique matching
  return finalAmount.toFixed(3);
}

/**
 * Get chain config by ID
 */
export function getChainConfig(chainId: ChainId): ChainConfig | undefined {
  return SUPPORTED_CHAINS.find((c) => c.id === chainId);
}

/**
 * Get token config for a specific chain
 */
export function getTokenConfig(
  chainId: ChainId,
  tokenId: TokenId
): TokenConfig | undefined {
  const chain = getChainConfig(chainId);
  return chain?.tokens.find((t) => t.id === tokenId);
}

/**
 * Check if a chain supports a specific token
 */
export function isTokenSupported(chainId: ChainId, tokenId: TokenId): boolean {
  return !!getTokenConfig(chainId, tokenId);
}

/**
 * Get payment address for a chain
 */
export function getPaymentAddress(chainId: ChainId): string {
  if (chainId === "solana") return PAYMENT_ADDRESSES.SOLANA;
  return PAYMENT_ADDRESSES.EVM;
}
