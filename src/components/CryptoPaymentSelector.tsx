"use client";

import { useState, useEffect } from "react";
import { SUPPORTED_CHAINS, calculateCryptoAmount, type ChainId, type TokenId } from "@/lib/crypto-payment";

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

  useEffect(() => {
    if (!priceIdr) {
      setEstimatedAmount("");
      return;
    }
    setLoadingEstimate(true);
    // Calculate estimate client-side using fallback rate
    // In production this would call an API
    const rate = 16300; // Fallback IDR/USD rate
    const amount = (priceIdr / rate).toFixed(2);
    setEstimatedAmount(amount);
    setLoadingEstimate(false);
  }, [priceIdr]);

  return (
    <div className="space-y-4">
      {/* Estimated Amount */}
      {priceIdr > 0 && (
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 text-center">
          <p className="text-xs text-gray-400">Estimated amount</p>
          <p className="text-lg font-bold text-violet-400">
            {loadingEstimate ? "..." : `~${estimatedAmount} USDT/USDC`}
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
                // Auto-select first token when chain is selected
                const defaultToken = chain.tokens[0].id;
                onSelect(chain.id, defaultToken);
              }}
              className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                selected?.chain === chain.id
                  ? "border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/10"
                  : "border-gray-600 bg-gray-700 hover:border-gray-500"
              }`}
            >
              <span className="text-xl">{chain.icon}</span>
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
