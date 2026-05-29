import { getSupabase } from "./supabase";
import { createTransaction, checkTransaction } from "./digiflazz";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

/**
 * Format customer_no based on game requirements
 * Mobile Legends: "userid|serverid"
 * Free Fire: "userid" (no server)
 * Genshin Impact: "userid|serverid"
 * Valorant: "userid"
 * PUBG Mobile: "userid"
 * Stumble Guys: "email"
 */
function formatCustomerNo(
  gameSlug: string,
  userId: string,
  serverId?: string
): string {
  const gamesWithServer = [
    "mobile-legends",
    "mobile-legends-paket-irit",
    "mobile-legends-global",
    "magic-chess-go-go",
    "genshin-impact",
  ];

  if (gamesWithServer.includes(gameSlug) && serverId) {
    return `${userId}${serverId}`;
  }

  return userId;
}

/**
 * Auto-fulfill a single order by order_id
 * Called after payment is confirmed
 */
export async function autoFulfillOrder(orderId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = getSupabase();

  // Fetch order
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, error: "Order not found" };
  }

  if (order.status !== "paid") {
    return { success: false, error: `Order status is '${order.status}', expected 'paid'` };
  }

  // Get SKU from order (stored during order creation)
  const sku = order.item_sku;
  if (!sku) {
    await notifyTelegram(
      `⚠️ *Auto-Fulfill Gagal*\n\n📋 Order: \`${orderId}\`\n❌ SKU tidak ditemukan di order\n\nPerlu fulfill manual.`
    );
    return { success: false, error: "SKU not found in order" };
  }

  const customerNo = formatCustomerNo(
    order.game_slug,
    order.user_game_id,
    order.user_server_id
  );

  try {
    // Update status to processing
    await supabase
      .from("orders")
      .update({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    // Hit Digiflazz API
    const transaction = await createTransaction(sku, customerNo, orderId);

    // Update order with Digiflazz response
    const updateData: Record<string, unknown> = {
      digiflazz_ref_id: orderId,
      digiflazz_status: transaction.status,
      digiflazz_message: transaction.message,
      digiflazz_sn: transaction.sn || null,
      updated_at: new Date().toISOString(),
    };

    // If Digiflazz returns Sukses immediately
    if (transaction.status === "Sukses") {
      updateData.status = "completed";
      updateData.completed_at = new Date().toISOString();
    }

    await supabase
      .from("orders")
      .update(updateData)
      .eq("order_id", orderId);

    // Notify success
    const statusEmoji = transaction.status === "Sukses" ? "✅" : "⏳";
    await notifyTelegram(
      `${statusEmoji} *Auto-Fulfill ${transaction.status}*\n\n📋 Order: \`${orderId}\`\n🎮 ${order.game_name}\n💎 ${order.item_name}\n👤 ID: ${customerNo}\n📦 SKU: ${sku}\n💬 ${transaction.message}\n${transaction.sn ? `🔑 SN: ${transaction.sn}` : ""}`
    );

    return { success: true };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";

    // Update order with error
    await supabase
      .from("orders")
      .update({
        status: "paid", // Revert to paid so it can be retried
        digiflazz_message: `Auto-fulfill failed: ${errMsg}`,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    await notifyTelegram(
      `❌ *Auto-Fulfill Gagal*\n\n📋 Order: \`${orderId}\`\n🎮 ${order.game_name}\n💎 ${order.item_name}\n👤 ID: ${customerNo}\n📦 SKU: ${sku}\n❌ Error: ${errMsg}\n\nStatus reverted ke PAID — bisa retry manual.`
    );

    return { success: false, error: errMsg };
  }
}

/**
 * Send Telegram notification
 */
async function notifyTelegram(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch {}
}
