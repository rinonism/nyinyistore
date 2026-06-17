import * as crypto from "crypto";

// Types
export interface TripayChannel {
  group: string;
  code: string;
  name: string;
  type: string;
  fee_merchant: { flat: number; percent: number };
  fee_customer: { flat: number; percent: number };
  total_fee: { flat: number; percent: number };
  minimum_fee: number;
  maximum_fee: number;
  icon_url: string;
  active: boolean;
}

export interface TripayTransaction {
  reference: string;
  merchant_ref: string;
  payment_selection_type: string;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  callback_url: string;
  return_url: string;
  amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  pay_code: string;
  pay_url: string;
  checkout_url: string;
  status: string;
  expired_time: number;
  order_items: TripayOrderItem[];
  instructions: unknown[];
  qr_string?: string;
  qr_url?: string;
}

export interface TripayOrderItem {
  sku?: string;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
  product_url?: string;
  image_url?: string;
}

export interface TripayCallback {
  reference: string;
  merchant_ref: string;
  payment_method: string;
  payment_method_code: string;
  total_amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  is_closed_payment: number;
  status: "PAID" | "EXPIRED" | "FAILED" | "UNPAID" | "REFUND";
  paid_at?: string;
  note?: string;
}

export interface CreateTransactionParams {
  amount: number;
  method: string;
  merchantRef: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  orderItems: TripayOrderItem[];
  callbackUrl: string;
  returnUrl: string;
  expiredTime?: number;
}

// Config
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE || "";
const PROXY_BASE = process.env.TRIPAY_PROXY_URL || "http://43.153.204.244:3847";
const PROXY_SECRET = process.env.TRIPAY_PROXY_SECRET || "";

/**
 * Generate HMAC SHA256 signature for Tripay
 */
export function generateSignature(
  merchantRef: string,
  amount: number
): string {
  const data = TRIPAY_MERCHANT_CODE + merchantRef + amount;
  return crypto
    .createHmac("sha256", TRIPAY_PRIVATE_KEY)
    .update(data)
    .digest("hex");
}

/**
 * Verify callback signature from Tripay
 */
export function verifyCallbackSignature(jsonBody: string): string {
  return crypto
    .createHmac("sha256", TRIPAY_PRIVATE_KEY)
    .update(jsonBody)
    .digest("hex");
}

/**
 * Get available payment channels from Tripay (via proxy)
 */
export async function getPaymentChannels(): Promise<TripayChannel[]> {
  const response = await fetch(`${PROXY_BASE}/tripay/merchant/payment-channel`, {
    method: "GET",
    headers: {
      "X-Proxy-Secret": PROXY_SECRET,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to get payment channels");
  }

  return data.data as TripayChannel[];
}

/**
 * Create a closed payment transaction on Tripay (via proxy)
 */
export async function createTransaction(
  params: CreateTransactionParams
): Promise<TripayTransaction> {
  const signature = generateSignature(params.merchantRef, params.amount);

  // Default expiry: 24 hours from now
  const expiredTime =
    params.expiredTime || Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  const payload = {
    method: params.method,
    merchant_ref: params.merchantRef,
    amount: params.amount,
    customer_name: params.customerName,
    customer_email: params.customerEmail || "customer@nyinyistore.com",
    customer_phone: params.customerPhone || "08000000000",
    order_items: params.orderItems,
    callback_url: params.callbackUrl,
    return_url: params.returnUrl,
    expired_time: expiredTime,
    signature,
  };

  const response = await fetch(`${PROXY_BASE}/tripay/transaction/create`, {
    method: "POST",
    headers: {
      "X-Proxy-Secret": PROXY_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to create Tripay transaction");
  }

  return data.data as TripayTransaction;
}

/**
 * Get transaction detail by reference (via proxy)
 */
export async function getTransactionDetail(
  reference: string
): Promise<TripayTransaction> {
  const response = await fetch(
    `${PROXY_BASE}/tripay/transaction/detail?reference=${reference}`,
    {
      method: "GET",
      headers: {
        "X-Proxy-Secret": PROXY_SECRET,
      },
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to get transaction detail");
  }

  return data.data as TripayTransaction;
}
