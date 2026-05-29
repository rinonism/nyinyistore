import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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
