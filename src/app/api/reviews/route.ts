import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { maskName } from "@/lib/mask";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const game_slug = searchParams.get("game_slug");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);

    const supabase = getSupabase();
    let query = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (game_slug) {
      query = query.eq("game_slug", game_slug);
    }

    const { data: reviews, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    const list = reviews || [];

    // Resolve + mask player nicknames from orders (join by order_id) server-side.
    const orderIds = list.map((r) => r.order_id).filter(Boolean);
    const nameMap = new Map<string, string>();
    const itemMap = new Map<string, string>();
    if (orderIds.length > 0) {
      const { data: orders } = await supabase
        .from("orders")
        .select("order_id, nickname, item_name")
        .in("order_id", orderIds);
      for (const o of orders || []) {
        if (o.nickname) nameMap.set(o.order_id, o.nickname);
        if (o.item_name) itemMap.set(o.order_id, o.item_name);
      }
    }

    const masked = list.map((r) => ({
      ...r,
      name: maskName(nameMap.get(r.order_id)),
      item_name: itemMap.get(r.order_id) || "",
    }));

    return NextResponse.json({ reviews: masked });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { order_id, game_slug, rating, review } = await req.json();

    if (!order_id || !game_slug || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Check if review already exists for this order
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("order_id", order_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Review already submitted" }, { status: 409 });
    }

    // Insert review
    const { error } = await supabase.from("reviews").insert({
      order_id,
      game_slug,
      rating,
      review: review?.slice(0, 500) || "",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Review insert error:", error);
      return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Review API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
