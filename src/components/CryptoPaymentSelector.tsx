"use client";

import { useState, useEffect } from "react";
import { SUPPORTED_CHAINS, calculateCryptoAmount, type ChainId, type TokenId } from "@/lib/crypto-payment";

// Network logo SVGs
const ChainLogo = ({ chainId, className = "w-5 h-5" }: { chainId: string; className?: string }) => {
  switch (chainId) {
    case "ethereum":
      return (
        <svg className={className} viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="#343434"/>
          <path d="M127.962 0L0 212.32L127.962 287.958V154.158V0Z" fill="#8C8C8C"/>
          <path d="M127.961 312.187L126.386 314.107V412.306L127.961 416.905L255.999 236.587L127.961 312.187Z" fill="#3C3C3B"/>
          <path d="M127.962 416.905V312.187L0 236.587L127.962 416.905Z" fill="#8C8C8C"/>
          <path d="M127.961 287.958L255.921 212.32L127.961 154.159V287.958Z" fill="#141414"/>
          <path d="M0.001 212.32L127.962 287.958V154.159L0.001 212.32Z" fill="#393939"/>
        </svg>
      );
    case "bsc":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
          <path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z" fill="#fff"/>
        </svg>
      );
    case "base":
      return (
        <svg className={className} viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF"/>
          <path d="M55.3909 93.2C76.5865 93.2 93.7818 76.0047 93.7818 54.8091C93.7818 33.6135 76.5865 16.4182 55.3909 16.4182C35.3045 16.4182 18.8182 31.8427 17 51.4727H65.5636V58.1455H17C18.8182 77.7755 35.3045 93.2 55.3909 93.2Z" fill="white"/>
        </svg>
      );
    case "arbitrum":
      return (
        <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#2D374B"/>
          <path d="M20.7 27.5L25.2 19.7L27.5 23.5L22.1 32.5L20.7 27.5Z" fill="#28A0F0"/>
          <path d="M28.5 24.5L30.5 28L22.8 33L22.1 32.5L27.5 23.5L28.5 24.5Z" fill="#28A0F0"/>
          <path d="M10 28L14.8 19.7L19.3 27.5L17.9 32.5L9.5 28.5L10 28Z" fill="white"/>
          <path d="M17.9 32.5L17.2 33L9.5 28.5L10 28L14.8 19.7L12.5 23.5L17.9 32.5Z" fill="white"/>
          <path d="M20 8L12 20L14.8 19.7L20 10.5L25.2 19.7L28 20L20 8Z" fill="white"/>
        </svg>
      );
    case "solana":
      return (
        <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64.6 237.9C66.9 235.6 70 234.3 73.3 234.3H391.8C397.1 234.3 399.7 240.7 395.9 244.5L332.4 308C330.1 310.3 327 311.6 323.7 311.6H5.2C-0.1 311.6-2.7 305.2 1.1 301.4L64.6 237.9Z" fill="url(#solana_a)"/>
          <path d="M64.6 3.6C67 1.3 70.1 0 73.3 0H391.8C397.1 0 399.7 6.4 395.9 10.2L332.4 73.7C330.1 76 327 77.3 323.7 77.3H5.2C-0.1 77.3-2.7 70.9 1.1 67.1L64.6 3.6Z" fill="url(#solana_b)"/>
          <path d="M332.4 120.3C330.1 118 327 116.7 323.7 116.7H5.2C-0.1 116.7-2.7 123.1 1.1 126.9L64.6 190.4C66.9 192.7 70 194 73.3 194H391.8C397.1 194 399.7 187.6 395.9 183.8L332.4 120.3Z" fill="url(#solana_c)"/>
          <defs>
            <linearGradient id="solana_a" x1="360.9" y1="-37.5" x2="141.2" y2="383.6" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
            </linearGradient>
            <linearGradient id="solana_b" x1="264.8" y1="-87.6" x2="45.2" y2="333.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
            </linearGradient>
            <linearGradient id="solana_c" x1="312.5" y1="-62.7" x2="92.9" y2="358.4" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
            </linearGradient>
          </defs>
        </svg>
      );
    default:
      return <span className="text-xl">🪙</span>;
  }
};

interface CryptoPaymentSelectorProps {
  priceIdr: number;
  onSelect: (chain: ChainId, token: TokenId) => void;
  selected?: { chain: ChainId; token: TokenId } | null;
}

export default function CryptoPaymentSelector({
  priceIdr,
  onSelect,
  selected,
}: CryptoPaymentSelectorProps) {
  const [estimatedAmount, setEstimatedAmount] = useState<string>("");
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [usdtRate, setUsdtRate] = useState<number>(17800);

  // Fetch live USDT/IDR rate
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr")
      .then(r => r.json())
      .then(d => { if (d?.tether?.idr) setUsdtRate(d.tether.idr); })
      .catch(() => {}); // fallback 17800
  }, []);

  useEffect(() => {
    if (!priceIdr) {
      setEstimatedAmount("");
      return;
    }
    setLoadingEstimate(true);
    const amount = (priceIdr / usdtRate).toFixed(2);
    setEstimatedAmount(amount);
    setLoadingEstimate(false);
  }, [priceIdr, usdtRate]);

  return (
    <div className="space-y-4">
      {/* Estimated Amount */}
      {priceIdr > 0 && (
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 text-center">
          <p className="text-xs text-gray-400">Estimated amount</p>
          <p className="text-lg font-bold text-violet-400">
            {loadingEstimate ? "..." : `~${estimatedAmount} USDT/USDC`}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            1 USDT = Rp{usdtRate.toLocaleString("id-ID")}
          </p>
        </div>
      )}

      {/* Chain Selection */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-300">Select Network</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => {
                const defaultToken = chain.tokens[0].id;
                onSelect(chain.id, defaultToken);
              }}
              className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                selected?.chain === chain.id
                  ? "border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/10"
                  : "border-gray-600 bg-gray-700 hover:border-gray-500"
              }`}
            >
              <ChainLogo chainId={chain.id} className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium text-white">{chain.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Token Selection */}
      {selected && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-300">Select Token</p>
          <div className="flex gap-2">
            {SUPPORTED_CHAINS.find((c) => c.id === selected.chain)?.tokens.map((token) => (
              <button
                key={token.id}
                onClick={() => onSelect(selected.chain, token.id)}
                className={`flex-1 rounded-lg border px-4 py-3 text-center transition-all ${
                  selected.token === token.id
                    ? "border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/10"
                    : "border-gray-600 bg-gray-700 hover:border-gray-500"
                }`}
              >
                <div className="text-sm font-bold text-white">{token.symbol}</div>
                <div className="text-xs text-gray-400">{token.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Summary */}
      {selected && (
        <div className="rounded-lg border border-gray-600 bg-gray-700/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Payment via</span>
            <span className="font-medium text-white">
              {selected.token.toUpperCase()} on{" "}
              {SUPPORTED_CHAINS.find((c) => c.id === selected.chain)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
