import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  generateOrderId,
  calculateCryptoAmount,
  getChainConfig,
  getTokenConfig,
  isTokenSupported,
  ORDER_EXPIRY_MINUTES,
  type Order,
  type ChainId,
  type TokenId,
} from "@/lib/crypto-payment";
import { games } from "@/lib/games";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { game_slug, denomination_id, user_id, server_id, payment_chain, payment_token } = body;

    // Validate required fields
    if (!game_slug || !denomination_id || !user_id || !payment_chain || !payment_token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate game and denomination
    const game = games.find((g) => g.slug === game_slug);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const denomination = game.denominations.find((d) => d.amount === denomination_id);
    if (!denomination) {
      return NextResponse.json({ error: "Denomination not found" }, { status: 404 });
    }

    // Validate chain and token
    const chainId = payment_chain as ChainId;
    const tokenId = payment_token as TokenId;

    if (!isTokenSupported(chainId, tokenId)) {
      return NextResponse.json(
        { error: "Token not supported on this chain" },
        { status: 400 }
      );
    }

    const chainConfig = getChainConfig(chainId)!;
    const tokenConfig = getTokenConfig(chainId, tokenId)!;

    // Calculate crypto amount
    const amountCrypto = await calculateCryptoAmount(denomination.price);

    // Generate order
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ORDER_EXPIRY_MINUTES * 60 * 1000);

    const order: Order = {
      id: generateOrderId(),
      game_slug,
      denomination_id: denomination.amount,
      denomination_label: denomination.label,
      user_id,
      server_id: server_id || undefined,
      payment_chain: chainId,
      payment_token: tokenId,
      payment_address: chainConfig.paymentAddress,
      amount_idr: denomination.price,
      amount_crypto: amountCrypto,
      token_symbol: tokenConfig.symbol,
      status: "pending",
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    };

    // Save order
    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    return NextResponse.json({
      order_id: order.id,
      payment_address: order.payment_address,
      amount: order.amount_crypto,
      chain: chainConfig.name,
      chain_id: chainId,
      token: tokenConfig.symbol,
      expires_at: order.expires_at,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
