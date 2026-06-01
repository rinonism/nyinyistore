/**
 * Mask a player nickname for public display on reviews.
 * Keeps a couple of leading chars + one trailing char, stars the middle.
 * Length of the star run is capped so it doesn't leak the real name length.
 *
 *   "Budi"      -> "Bu**"
 *   "RinoNism"  -> "Ri****m"
 *   "Ana"       -> "An*"
 *   ""/null     -> "Pelanggan"
 */
export function maskName(name?: string | null): string {
  const n = (name || "").trim();
  if (!n) return "Pelanggan";
  if (n.length <= 2) return n[0] + "*";
  if (n.length <= 4) return n.slice(0, 2) + "*".repeat(n.length - 2);
  return n.slice(0, 2) + "*".repeat(Math.min(n.length - 3, 4)) + n.slice(-1);
}
