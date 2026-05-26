import { NextRequest, NextResponse } from "next/server";
import {
  generateOrderId,
  calculateCryptoAmount,
  getChainConfig,
  getTokenConfig,
  getPaymentAddress,
  ORDER_EXPIRY_MINUTES,
} from "@/lib/crypto-payment";
import type { ChainId, TokenId, Order } from "@/lib/crypto-payment";
import { games } from "@/lib/games";

// Use Vercel KV or simple in-memory + file for orders
// For now, use a global variable (works on serverless with short TTL)
const ordersMap = new Map<string, Order>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      return handleCreate(body);
    } else if (action === "get") {
      return handleGet(body);
    } else if (action === "check") {
      return handleCheck(body);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleCreate(body: any) {
  const { game_slug, denomination_id, user_id, server_id, payment_chain, payment_token } = body;

  if (!game_slug || !denomination_id || !user_id || !payment_chain || !payment_token) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const game = games.find((g) => g.slug === game_slug);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const denom = game.denominations.find((d) => d.amount === denomination_id);
  if (!denom) {
    return NextResponse.json({ error: "Denomination not found" }, { status: 404 });
  }

  if (denom.comingSoon) {
    return NextResponse.json({ error: "Product coming soon" }, { status: 400 });
  }

  const chainConfig = getChainConfig(payment_chain as ChainId);
  if (!chainConfig) {
    return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
  }

  const tokenConfig = getTokenConfig(payment_chain as ChainId, payment_token as TokenId);
  if (!tokenConfig) {
    return NextResponse.json({ error: "Unsupported token" }, { status: 400 });
  }

  const cryptoAmount = await calculateCryptoAmount(denom.price);
  const paymentAddress = getPaymentAddress(payment_chain as ChainId);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + ORDER_EXPIRY_MINUTES * 60 * 1000);

  const order: Order = {
    id: generateOrderId(),
    game_slug,
    denomination_id: denom.amount,
    denomination_label: denom.label,
    user_id,
    server_id: server_id || undefined,
    payment_chain: payment_chain as ChainId,
    payment_token: payment_token as TokenId,
    payment_address: paymentAddress,
    amount_idr: denom.price,
    amount_crypto: cryptoAmount,
    token_symbol: tokenConfig.symbol,
    status: "pending",
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  ordersMap.set(order.id, order);

  // Also save to proxy server for persistence
  try {
    await fetch("http://43.153.204.244:7890/save-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Proxy-Secret": "nyinyi-digi-proxy-2026" },
      body: JSON.stringify(order),
    });
  } catch {}

  return NextResponse.json({
    order_id: order.id,
    payment_address: order.payment_address,
    amount_crypto: order.amount_crypto,
    token_symbol: order.token_symbol,
    chain: chainConfig.name,
    expires_at: order.expires_at,
  });
}

async function handleGet(body: any) {
  const { order_id } = body;
  if (!order_id) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  // Try local first
  let order = ordersMap.get(order_id);

  // Try proxy server if not in memory
  if (!order) {
    try {
      const res = await fetch("http://43.153.204.244:7890/get-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Proxy-Secret": "nyinyi-digi-proxy-2026" },
        body: JSON.stringify({ order_id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          order = data.order;
          ordersMap.set(order_id, order!);
        }
      }
    } catch {}
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Check expiry
  if (order.status === "pending" && new Date(order.expires_at) < new Date()) {
    order.status = "expired";
    ordersMap.set(order_id, order);
  }

  return NextResponse.json(order);
}

async function handleCheck(body: any) {
  const { order_id } = body;
  if (!order_id) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  // Ask proxy server to check on-chain
  try {
    const res = await fetch("http://43.153.204.244:7890/check-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Proxy-Secret": "nyinyi-digi-proxy-2026" },
      body: JSON.stringify({ order_id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status) {
        const order = ordersMap.get(order_id);
        if (order && data.status !== order.status) {
          order.status = data.status;
          order.updated_at = new Date().toISOString();
          if (data.tx_hash) order.tx_hash = data.tx_hash;
          ordersMap.set(order_id, order);
        }
        return NextResponse.json({ status: data.status, tx_hash: data.tx_hash });
      }
    }
  } catch {}

  return NextResponse.json({ status: "pending" });
}
