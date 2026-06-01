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
      digiflazz_ref: orderId,
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
 * Manually (re)fulfill an order from the admin panel.
 *
 * Safe against double-charging: first checks whether any prior Digiflazz ref for
 * this order already succeeded/pending (Digiflazz is idempotent per ref_id). Only
 * submits a NEW transaction if no successful/pending tx exists, and uses a fresh
 * ref (-R1, -R2, ...) so a previously-burned (Gagal) ref can't block the retry.
 * Unlike the crypto path, no max_price is sent — admin is consciously overriding.
 */
export async function manualFulfillOrder(orderId: string): Promise<{
  success: boolean;
  status?: string;
  message?: string;
  sn?: string;
  charged?: boolean;
  error?: string;
}> {
  const supabase = getSupabase();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (fetchError || !order) return { success: false, error: "Order tidak ditemukan" };

  if (order.status === "completed") {
    return { success: false, error: "Order sudah completed" };
  }
  if (!["paid", "processing", "failed"].includes(order.status)) {
    return { success: false, error: `Status '${order.status}' tidak bisa di-fulfill (harus paid/processing/failed)` };
  }

  const sku = order.item_sku;
  if (!sku) return { success: false, error: "SKU tidak ada di order" };

  const customerNo = formatCustomerNo(
    order.game_slug,
    order.user_game_id,
    order.user_server_id
  );

  // Collect refs that may already have been submitted to Digiflazz
  const refsToCheck: string[] = [orderId];
  if (order.digiflazz_ref && order.digiflazz_ref !== orderId) {
    refsToCheck.push(order.digiflazz_ref);
  }

  // 1) Idempotency guard: if any prior ref is already Sukses/Pending, do NOT re-charge
  let highestRetry = 0;
  let baseBurned = false;
  for (const ref of refsToCheck) {
    const m = ref.match(/-R(\d+)$/);
    if (m) highestRetry = Math.max(highestRetry, parseInt(m[1], 10));
    try {
      const tx = await checkTransaction(ref);
      if (tx?.status === "Sukses") {
        await supabase
          .from("orders")
          .update({
            status: "completed",
            digiflazz_ref: ref,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("order_id", orderId);
        return { success: true, status: "Sukses", message: "Sudah sukses sebelumnya (tidak di-charge ulang)", sn: tx.sn, charged: false };
      }
      if (tx?.status === "Pending") {
        await supabase
          .from("orders")
          .update({ status: "processing", digiflazz_ref: ref, updated_at: new Date().toISOString() })
          .eq("order_id", orderId);
        return { success: true, status: "Pending", message: "Transaksi masih diproses Digiflazz", charged: false };
      }
      if (tx?.status === "Gagal" && ref === orderId) baseBurned = true;
    } catch {
      // status check failed / ref never used — treat as no successful tx
    }
  }

  // 2) No successful/pending tx exists — safe to submit a fresh transaction
  let newRef: string;
  if (highestRetry > 0) newRef = `${orderId}-R${highestRetry + 1}`;
  else if (baseBurned || order.digiflazz_ref) newRef = `${orderId}-R1`;
  else newRef = orderId;

  await supabase
    .from("orders")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("order_id", orderId);

  try {
    const tx = await createTransaction(sku, customerNo, newRef);
    const finalStatus = tx.status === "Sukses" ? "completed" : "processing";
    const upd: Record<string, unknown> = {
      status: finalStatus,
      digiflazz_ref: newRef,
      updated_at: new Date().toISOString(),
    };
    if (finalStatus === "completed") upd.completed_at = new Date().toISOString();

    await supabase.from("orders").update(upd).eq("order_id", orderId);

    const emoji = tx.status === "Sukses" ? "✅" : "⏳";
    await notifyTelegram(
      `${emoji} *Manual Fulfill ${tx.status}*\n\n📋 Order: \`${orderId}\`\n🎮 ${order.game_name}\n💎 ${order.item_name}\n👤 ID: ${customerNo}\n📦 SKU: ${sku}\n🔖 Ref: ${newRef}\n💬 ${tx.message}\n${tx.sn ? `🔑 SN: ${tx.sn}` : ""}`
    );

    return { success: true, status: tx.status, message: tx.message, sn: tx.sn, charged: true };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    // Revert so it can be retried
    await supabase
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("order_id", orderId);

    await notifyTelegram(
      `❌ *Manual Fulfill Gagal*\n\n📋 Order: \`${orderId}\`\n🎮 ${order.game_name}\n💎 ${order.item_name}\n👤 ID: ${customerNo}\n📦 SKU: ${sku}\n🔖 Ref: ${newRef}\n❌ ${errMsg}\n\nStatus dikembalikan ke PAID.`
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
