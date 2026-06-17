#!/usr/bin/env python3
"""
Sync prices from Digiflazz price list to games.ts
Fetches prepaid products, matches SKUs, applies markup, updates prices.
"""

import json
import hashlib
import urllib.request
import re
import os

# Digiflazz config
DIGIFLAZZ_USERNAME = os.environ.get("DIGIFLAZZ_USERNAME", "")
DIGIFLAZZ_API_KEY = os.environ.get("DIGIFLAZZ_API_KEY", "")
DIGIFLAZZ_URL = "https://api.digiflazz.com/v1/price-list"

# Markup tiers (based on diamond count / product type)
# 5-50 diamonds: +10%
# 86-453 diamonds: +5%
# 516-1672 diamonds: +4.5%
# Weekly Pass/bundles: +7.5%
# Twilight/Starlight Plus: +6%

GAMES_TS_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "games.ts")


def get_price_list():
    """Fetch prepaid price list from Digiflazz"""
    sign = hashlib.md5((DIGIFLAZZ_USERNAME + DIGIFLAZZ_API_KEY + "pricelist").encode()).hexdigest()
    
    payload = json.dumps({
        "cmd": "prepaid",
        "username": DIGIFLAZZ_USERNAME,
        "sign": sign,
    }).encode()
    
    req = urllib.request.Request(
        DIGIFLAZZ_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    
    result = data.get("data", [])
    if isinstance(result, dict):
        # Error response from Digiflazz
        return result
    return result


def apply_markup(base_price, sku, product_name):
    """Apply markup based on product type/tier"""
    name_lower = product_name.lower()
    
    # Weekly pass / bundles
    if any(x in name_lower for x in ["weekly", "pass", "bundle", "coupon"]):
        return int(base_price * 1.075)
    
    # Twilight / Starlight Plus
    if any(x in name_lower for x in ["twilight", "starlight member plus", "starlight plus"]):
        return int(base_price * 1.06)
    
    # Starlight Member (not plus)
    if "starlight member" in name_lower and "plus" not in name_lower:
        return int(base_price * 1.06)
    
    # Membership (FF)
    if "membership" in name_lower:
        return int(base_price * 1.075)
    
    # Royale Pass / Elite Pass
    if any(x in name_lower for x in ["royale pass", "elite pass"]):
        return int(base_price * 1.075)
    
    # Diamond/UC/VP amount-based tiers
    # Extract number from SKU or name
    num_match = re.search(r'(\d+)', sku)
    if num_match:
        amount = int(num_match.group(1))
        if amount <= 50:
            return int(base_price * 1.10)
        elif amount <= 453:
            return int(base_price * 1.05)
        elif amount <= 1672:
            return int(base_price * 1.045)
        else:
            return int(base_price * 1.04)
    
    # Default 5%
    return int(base_price * 1.05)


def round_price(price):
    """Round to nearest 100"""
    return round(price / 100) * 100


def update_games_ts(price_map):
    """Update prices in games.ts based on SKU matching"""
    with open(GAMES_TS_PATH, "r") as f:
        content = f.read()
    
    updated_count = 0
    skipped = []
    
    for sku, new_price in price_map.items():
        # Find the line with this SKU and update its price
        # Pattern: { amount: "...", price: XXXXX, label: "...", sku: "SKU" }
        pattern = rf'(price:\s*)\d+(\s*,\s*label:.*?sku:\s*"{re.escape(sku)}")'
        match = re.search(pattern, content)
        if match:
            old_price = int(re.search(r'price:\s*(\d+)', match.group(0)).group(1))
            if old_price != new_price:
                content = re.sub(pattern, rf'\g<1>{new_price}\2', content)
                updated_count += 1
                print(f"  {sku}: Rp{old_price:,} → Rp{new_price:,}")
        else:
            skipped.append(sku)
    
    if updated_count > 0:
        with open(GAMES_TS_PATH, "w") as f:
            f.write(content)
    
    return updated_count, skipped


def main():
    print("📦 Fetching Digiflazz price list...")
    products = get_price_list()
    print(f"   Got {len(products)} products total")
    
    # Check if rate limited (Digiflazz returns error dict instead of list)
    if not isinstance(products, list):
        print(f"❌ Digiflazz error: {products}")
        return
    if len(products) < 10:
        print(f"❌ Too few products ({len(products)}), likely rate limited. Skipping.")
        return
    
    # Filter game products and build SKU → price map
    # Digiflazz SKU codes match our sku field in games.ts
    game_brands = [
        "MOBILE LEGENDS", "FREE FIRE", "GENSHIN IMPACT", 
        "VALORANT", "PUBG MOBILE", "HONKAI STAR RAIL", "STUMBLE GUYS"
    ]
    
    game_products = [p for p in products if any(
        brand in p.get("brand", "").upper() for brand in game_brands
    )]
    print(f"   Filtered to {len(game_products)} game products")
    
    # Build price map: our_sku → marked_up_price
    price_map = {}
    
    for product in game_products:
        sku = product.get("buyer_sku_code", "")
        base_price = product.get("price", 0)
        name = product.get("product_name", "")
        
        if not sku or not base_price:
            continue
        
        # Skip inactive products
        if not product.get("buyer_product_status", False):
            continue
        
        marked_up = apply_markup(base_price, sku, name)
        rounded = round_price(marked_up)
        price_map[sku] = rounded
    
    print(f"\n💰 Applying markup to {len(price_map)} active products...")
    
    # Update games.ts
    updated, skipped = update_games_ts(price_map)
    
    print(f"\n✅ Updated {updated} prices in games.ts")
    if skipped:
        print(f"⚠️  {len(skipped)} SKUs not found in games.ts (new products?)")
        # Show first 10
        for s in skipped[:10]:
            print(f"   - {s}")
        if len(skipped) > 10:
            print(f"   ... and {len(skipped) - 10} more")


if __name__ == "__main__":
    main()
