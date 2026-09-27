def optimize_price(
    cost_price: float,
    current_price: float,
    competitor_price: float,
    current_stock: int,
    predicted_demand: int,
    min_margin_percent: float = 15.0,
    max_price_increase_percent: float = 20.0,
    max_price_decrease_percent: float = 20.0
) -> dict:
    """
    Transparent, constraint-based dynamic pricing optimization algorithm.
    Guarantees price never drops below minimum profit margin and respects maximum step adjustments.
    """
    floor_price = round(cost_price * (1.0 + (min_margin_percent / 100.0)), 2)
    max_price = round(current_price * (1.0 + (max_price_increase_percent / 100.0)), 2)
    min_allowed_price = max(floor_price, round(current_price * (1.0 - (max_price_decrease_percent / 100.0)), 2))

    reasons = []

    # Baseline adjustment driven by predicted demand vs stock balance
    stock_demand_ratio = current_stock / max(1, predicted_demand)

    if stock_demand_ratio < 0.5:
        # High demand / Shortage -> Surge price
        adjustment_factor = 1.08
        reasons.append(f"High demand predicted relative to inventory (stock/demand ratio = {stock_demand_ratio:.2f}).")
    elif stock_demand_ratio > 2.5:
        # Excess inventory -> Discount
        adjustment_factor = 0.93
        reasons.append(f"Surplus stock available (stock/demand ratio = {stock_demand_ratio:.2f}). Discount recommended to clear inventory.")
    else:
        adjustment_factor = 1.00
        reasons.append("Demand and inventory levels are balanced.")

    # Competitor Price Alignment
    if competitor_price > current_price * 1.05:
        adjustment_factor += 0.04
        reasons.append(f"Competitor price (₹{competitor_price}) is higher than current price (₹{current_price}). Room to increase margin.")
    elif competitor_price < current_price * 0.95:
        adjustment_factor -= 0.04
        reasons.append(f"Competitor price (₹{competitor_price}) is significantly lower. Recommendation adjusted to maintain competitiveness.")

    raw_recommended = current_price * adjustment_factor

    # Enforce Business Constraints
    final_price = raw_recommended

    if final_price < min_allowed_price:
        final_price = min_allowed_price
        if min_allowed_price == floor_price:
            reasons.append(f"Price capped at minimum floor price (₹{floor_price}) to protect mandatory {min_margin_percent}% profit margin.")
        else:
            reasons.append(f"Price decrease capped at maximum allowed limit ({max_price_decrease_percent}%).")

    if final_price > max_price:
        final_price = max_price
        reasons.append(f"Price increase capped at maximum allowed limit ({max_price_increase_percent}%).")

    final_price = round(final_price, 2)
    price_change_pct = round(((final_price - current_price) / current_price) * 100.0, 2)
    expected_revenue = round(final_price * predicted_demand, 2)

    return {
        'recommended_price': final_price,
        'price_change_percent': price_change_pct,
        'expected_revenue': expected_revenue,
        'explanation': " ".join(reasons)
    }

