#!/bin/bash

# Inut Design - AI-Powered Regression Test Script
# This script uses agent-browser to verify business-critical flows.
# Usage: ./scripts/regression-test.sh [URL] [MODE]
# Modes: basic (default), full, cart

URL=${1:-"http://localhost:3000"}
MODE=${2:-"basic"}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}🚀 Starting Inut Design Regression Test...${NC}"
echo -e "${BLUE}Target URL: $URL${NC}"
echo -e "${BLUE}Mode: $MODE${NC}"

# Ensure test-results directory exists
mkdir -p ./test-results

# Helper function to log results
log_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Helper function to take screenshot
take_screenshot() {
    local phase_name=$1
    local screenshot_path="./test-results/regression_${MODE}_${TIMESTAMP}_${phase_name}.png"
    agent-browser screenshot "$screenshot_path"
    echo -e "📸 Screenshot saved: ${screenshot_path}"
}

# 1. Homepage & Navigation Check
echo -e "\n${BLUE}--- Phase 1: Navigation & SEO ---${NC}"
agent-browser open "$URL"
SNAPSHOT=$(agent-browser snapshot -i)

# Check for core branding and main sections (Case-insensitive)
if [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"inut design"* ]]; then
    log_result 0 "Homepage: Branding 'INUT Design' found."
else
    log_result 1 "Homepage: Branding 'INUT Design' NOT found."
fi

# Check for main menu items (Uppercase as seen in snapshot)
for route in "LAPTOP" "NÚT PHÍM" "BẬT LỬA" "TIN TỨC" "LIÊN HỆ"; do
    if [[ "$SNAPSHOT" == *"$route"* ]]; then
        log_result 0 "Menu: '$route' visible."
    else
        log_result 1 "Menu: '$route' NOT found."
    fi
done
take_screenshot "phase1_homepage"

# 2. Product Pages Check
echo -e "\n${BLUE}--- Phase 2: Product Categories ---${NC}"

# Lighters (Bật lửa)
agent-browser open "$URL/lighters"
SNAPSHOT=$(agent-browser snapshot -i)
if [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"bật lửa"* ]]; then
    log_result 0 "Lighters Page: Loaded correctly."
else
    log_result 1 "Lighters Page: Failed to load."
fi
take_screenshot "phase2_lighters"

# Laptop Skins
agent-browser open "$URL/products"
SNAPSHOT=$(agent-browser snapshot -i)
if [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"skin laptop"* ]] || [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"sản phẩm"* ]]; then
    log_result 0 "Laptop Skins Page: Loaded correctly."
else
    log_result 1 "Laptop Skins Page: Failed to load."
fi
take_screenshot "phase2_products"

# 3. Blog & Content Check
echo -e "\n${BLUE}--- Phase 3: Blog & Content ---${NC}"
agent-browser open "$URL/blog"
SNAPSHOT=$(agent-browser snapshot -i)
if [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"blog"* ]] || [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"tin tức"* ]]; then
    log_result 0 "Blog Page: Loaded correctly."
else
    log_result 1 "Blog Page: Failed to load."
fi
take_screenshot "phase3_blog"

# 4. Cart & Checkout Flow (Simplified)
if [[ "$MODE" == "full" ]] || [[ "$MODE" == "cart" ]]; then
    echo -e "\n${BLUE}--- Phase 4: Cart Flow (Lighters) ---${NC}"
    
    # Go to a specific lighter page
    agent-browser open "$URL/lighters"
    SNAPSHOT=$(agent-browser snapshot -i)
    
    # Try to find "THÊM VÀO GIỎ" or "XEM CHI TIẾT"
    # First, let's try to click a product to go to detail page
    PRODUCT_REF=$(echo "$SNAPSHOT" | grep -E "link.*Bật lửa|link.*Zippo" | head -n 1 | sed -E 's/.*\[ref=(@e[0-9]+)\].*/\1/')
    
    if [[ -n "$PRODUCT_REF" ]]; then
        echo "Found product link at $PRODUCT_REF. Clicking to detail..."
        agent-browser click "$PRODUCT_REF"
        sleep 3
        SNAPSHOT=$(agent-browser snapshot -i)
        take_screenshot "phase4_product_detail"
        
        ADD_BUTTON_REF=$(echo "$SNAPSHOT" | grep -i "Thêm vào giỏ" | head -n 1 | sed -E 's/.*\[ref=(@e[0-9]+)\].*/\1/')
        
        if [[ -n "$ADD_BUTTON_REF" ]]; then
            echo "Found Add to Cart button at $ADD_BUTTON_REF. Clicking..."
            agent-browser click "$ADD_BUTTON_REF"
            sleep 2
            log_result 0 "Cart Action: Clicked 'Add to Cart'."
            take_screenshot "phase4_after_add_to_cart"
            
            # Check if cart drawer opened or go to checkout
            echo "Navigating to checkout..."
            agent-browser open "$URL/checkout/lighters"
            SNAPSHOT=$(agent-browser snapshot -i)
            if [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"thanh toán"* ]] || [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"giỏ hàng"* ]]; then
                log_result 0 "Checkout Page: Reached successfully."
            else
                log_result 1 "Checkout Page: Failed to reach."
            fi
            take_screenshot "phase4_checkout"
        else
            log_result 1 "Cart Action: 'Add to Cart' button not found on detail page."
        fi
    else
        # Fallback: Maybe we are already on a page with "Thêm vào giỏ" (e.g. if the lighters page has quick add)
        ADD_BUTTON_REF=$(echo "$SNAPSHOT" | grep -i "Thêm vào giỏ" | head -n 1 | sed -E 's/.*\[ref=(@e[0-9]+)\].*/\1/')
        if [[ -n "$ADD_BUTTON_REF" ]]; then
             echo "Found Add to Cart button directly on lighters page at $ADD_BUTTON_REF. Clicking..."
             agent-browser click "$ADD_BUTTON_REF"
             sleep 2
             log_result 0 "Cart Action: Clicked 'Add to Cart' (Quick Add)."
             take_screenshot "phase4_quick_add"
             agent-browser open "$URL/checkout/lighters"
             SNAPSHOT=$(agent-browser snapshot -i)
             if [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"thanh toán"* ]] || [[ $(echo "$SNAPSHOT" | tr '[:upper:]' '[:lower:]') == *"giỏ hàng"* ]]; then
                 log_result 0 "Checkout Page: Reached successfully."
             else
                 log_result 1 "Checkout Page: Failed to reach."
             fi
             take_screenshot "phase4_checkout_quick"
        else
            log_result 1 "Cart Action: Could not find product link or Add to Cart button."
        fi
    fi
fi

# 5. Visual Proof
echo -e "\n${BLUE}--- Phase 5: Final Verification ---${NC}"
take_screenshot "final_state"
echo -e "🏁 Final state captured."

# Cleanup
agent-browser close
echo -e "\n${BLUE}🏁 Regression test finished.${NC}"
