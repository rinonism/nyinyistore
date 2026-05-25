// Promo code system
export interface PromoCode {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number; // percentage (0-100) or fixed amount in IDR
  min_purchase: number;
  max_discount: number; // max discount in IDR (for percentage type)
  valid_until: string;
  usage_limit: number;
  used_count: number;
  active: boolean;
  description: string;
}

// Mock promo codes - will be stored in database later
export const promoCodes: PromoCode[] = [
  {
    code: "NYINYI10",
    discount_type: "percentage",
    discount_value: 10,
    min_purchase: 50000,
    max_discount: 20000,
    valid_until: "2026-12-31",
    usage_limit: 100,
    used_count: 23,
    active: true,
    description: "Diskon 10% untuk semua game (maks Rp 20.000)",
  },
  {
    code: "MLBB5K",
    discount_type: "fixed",
    discount_value: 5000,
    min_purchase: 30000,
    max_discount: 5000,
    valid_until: "2026-06-30",
    usage_limit: 50,
    used_count: 12,
    active: true,
    description: "Potongan Rp 5.000 untuk Mobile Legends",
  },
  {
    code: "NEWUSER",
    discount_type: "percentage",
    discount_value: 15,
    min_purchase: 20000,
    max_discount: 30000,
    valid_until: "2026-12-31",
    usage_limit: 500,
    used_count: 89,
    active: true,
    description: "Diskon 15% untuk pengguna baru (maks Rp 30.000)",
  },
  {
    code: "CRYPTO20",
    discount_type: "percentage",
    discount_value: 20,
    min_purchase: 100000,
    max_discount: 50000,
    valid_until: "2026-07-31",
    usage_limit: 30,
    used_count: 5,
    active: true,
    description: "Diskon 20% untuk pembayaran crypto (maks Rp 50.000)",
  },
];

export function validatePromoCode(code: string, purchaseAmount: number): {
  valid: boolean;
  discount: number;
  message: string;
} {
  const promo = promoCodes.find(
    (p) => p.code.toUpperCase() === code.toUpperCase()
  );

  if (!promo) {
    return { valid: false, discount: 0, message: "Kode promo tidak ditemukan." };
  }

  if (!promo.active) {
    return { valid: false, discount: 0, message: "Kode promo sudah tidak aktif." };
  }

  if (new Date(promo.valid_until) < new Date()) {
    return { valid: false, discount: 0, message: "Kode promo sudah expired." };
  }

  if (promo.used_count >= promo.usage_limit) {
    return { valid: false, discount: 0, message: "Kode promo sudah habis digunakan." };
  }

  if (purchaseAmount < promo.min_purchase) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum pembelian Rp ${promo.min_purchase.toLocaleString("id-ID")} untuk kode ini.`,
    };
  }

  let discount = 0;
  if (promo.discount_type === "percentage") {
    discount = Math.min(
      (purchaseAmount * promo.discount_value) / 100,
      promo.max_discount
    );
  } else {
    discount = promo.discount_value;
  }

  return {
    valid: true,
    discount,
    message: `${promo.description} — Hemat Rp ${discount.toLocaleString("id-ID")}!`,
  };
}
