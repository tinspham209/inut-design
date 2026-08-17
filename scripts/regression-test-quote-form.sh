#!/bin/bash

# Inut Design - Quote Request Form Regression Test
# Exercises the phone validation, Zalo advisory hint, and Zalo confirmation dialog.
# Usage: ./scripts/regression-test-quote-form.sh [URL]
#
# NOTE: Each successful submit writes a real `form-nhan-bao-gia` Sanity doc and
# fires the Telegram notification (normal form run). Sanity/Telegram side effects
# beyond the UI cannot be asserted here; verify them manually when this passes.

URL=${1:-"http://localhost:3000"}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TEST_PASS=0
TEST_FAIL=0

echo -e "${BLUE}🚀 Starting Quote Form Regression Test...${NC}"
echo -e "${BLUE}Target URL: $URL${NC}"

# Ensure test-results directory exists
mkdir -p ./test-results

# Helper function to log results
log_result() {
    if [ $1 -eq 0 ]; then
        TEST_PASS=$((TEST_PASS + 1))
        echo -e "${GREEN}✅ $2${NC}"
    else
        TEST_FAIL=$((TEST_FAIL + 1))
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Helper function to take screenshot
take_screenshot() {
    local phase_name=$1
    local screenshot_path="./test-results/quote_form_${TIMESTAMP}_${phase_name}.png"
    agent-browser screenshot "$screenshot_path"
    echo -e "📸 Screenshot saved: ${screenshot_path}"
}

# Fill the required fields of the quote form.
# usagePurpose (MUI Autocomplete) is typed + Enter to select the highlighted option.
fill_form() {
    local name=$1
    local phone=$2
    local channel=$3
    agent-browser fill "input[name=customerName]" "$name"
    agent-browser fill "input[name=phone]" "$phone"
    agent-browser type "input[name=usagePurpose]" "Bật lửa custom"
    agent-browser press Enter
    agent-browser find role radio click --name "$channel"
    agent-browser find role radio click --name "Đã có, chỉ cần tư vấn in ấn"
}

echo -e "\n${BLUE}--- Phase 1: Open Quote Form ---${NC}"
agent-browser open "$URL/contact/form"
sleep 3
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Đăng ký nhận báo giá"* ]]; then
    log_result 0 "Quote form loaded."
else
    log_result 1 "Quote form did not load."
fi
take_screenshot "phase1_open"

echo -e "\n${BLUE}--- Phase 2: Invalid phone is blocked inline (AC1) ---${NC}"
fill_form "Test Khách Hàng" "08683612311" "phone"
agent-browser click "button[type=submit]"
sleep 3
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Số điện thoại không hợp lệ"* ]]; then
    log_result 0 "Invalid phone blocked with inline Vietnamese error."
else
    log_result 1 "Invalid phone was NOT blocked with inline error."
fi
if [[ "$SNAPSHOT" == *"Gửi yêu cầu báo giá thành công"* ]]; then
    log_result 1 "Invalid phone still showed success toast (submit happened)."
else
    log_result 0 "No success toast after invalid phone."
fi
take_screenshot "phase2_invalid_blocked"

echo -e "\n${BLUE}--- Phase 3: Valid phone (non-zalo) submits (AC2) ---${NC}"
agent-browser fill "input[name=phone]" "0912345678"
agent-browser click "button[type=submit]"
agent-browser wait --text "Gửi yêu cầu báo giá thành công" 2>/dev/null
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Gửi yêu cầu báo giá thành công"* ]] || [[ "$SNAPSHOT" == *"Cảm ơn bạn đã gửi yêu cầu báo giá"* ]]; then
    log_result 0 "Valid phone submitted with success toast."
else
    log_result 1 "Valid phone did NOT submit successfully."
fi
take_screenshot "phase3_valid_submit"

echo -e "\n${BLUE}--- Phase 4: Zalo channel shows confirmation dialog; Cancel aborts (AC6) ---${NC}"
agent-browser open "$URL/contact/form"
sleep 3
fill_form "Test Khách Hàng" "0912345678" "Zalo"
agent-browser click "button[type=submit]"
sleep 3
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Xác nhận gửi qua Zalo"* ]]; then
    log_result 0 "Zalo confirmation dialog appeared."
else
    log_result 1 "Zalo confirmation dialog did NOT appear."
fi
if [[ "$SNAPSHOT" == *"Số điện thoại của bạn"* ]]; then
    log_result 0 "Dialog restates the phone number."
else
    log_result 1 "Dialog does not restate the phone number."
fi
take_screenshot "phase4_dialog"

# Cancel should abort without submitting
agent-browser find role button click --name "Hủy"
sleep 2
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Gửi yêu cầu báo giá thành công"* ]] || [[ "$SNAPSHOT" == *"Cảm ơn bạn đã gửi yêu cầu báo giá"* ]]; then
    log_result 1 "Cancel still submitted the form."
else
    log_result 0 "Cancel aborted without submitting."
fi
take_screenshot "phase4_cancel"

echo -e "\n${BLUE}--- Phase 5: Zalo dialog Confirm submits (AC7) ---${NC}"
agent-browser click "button[type=submit]"
sleep 3
agent-browser find role button click --name "Xác nhận gửi"
agent-browser wait --text "Gửi yêu cầu báo giá thành công" 2>/dev/null
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Gửi yêu cầu báo giá thành công"* ]] || [[ "$SNAPSHOT" == *"Cảm ơn bạn đã gửi yêu cầu báo giá"* ]]; then
    log_result 0 "Confirm submitted the form successfully."
else
    log_result 1 "Confirm did NOT submit the form."
fi
take_screenshot "phase5_confirm"

echo -e "\n${BLUE}--- Phase 6: +84 formatted phone normalizes and submits (AC4) ---${NC}"
agent-browser open "$URL/contact/form"
sleep 3
fill_form "Test Khách Hàng" "+84 912 345 678" "phone"
agent-browser click "button[type=submit]"
agent-browser wait --text "Gửi yêu cầu báo giá thành công" 2>/dev/null
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Gửi yêu cầu báo giá thành công"* ]] || [[ "$SNAPSHOT" == *"Cảm ơn bạn đã gửi yêu cầu báo giá"* ]]; then
    log_result 0 "+84 formatted phone submitted successfully (normalized to 0)."
else
    log_result 1 "+84 formatted phone did NOT submit successfully."
fi
take_screenshot "phase6_normalize"

echo -e "\n${BLUE}--- Phase 7: No advisory Zalo hint when format invalid (AC5) ---${NC}"
agent-browser open "$URL/contact/form"
sleep 3
fill_form "Test Khách Hàng" "9999" "phone"
agent-browser click "button[type=submit]"
sleep 2
SNAPSHOT=$(agent-browser snapshot -i)
if [[ "$SNAPSHOT" == *"Số điện thoại không hợp lệ"* ]] && [[ "$SNAPSHOT" != *"chưa đăng ký Zalo"* ]]; then
    log_result 0 "Invalid phone shows format error only, no advisory hint."
else
    log_result 1 "Invalid phone hint precedence not verified."
fi
take_screenshot "phase7_no_hint"

echo -e "\n${BLUE}--- Quote Form Regression Summary ---${NC}"
echo -e "${GREEN}✅ Passed: $TEST_PASS${NC}  ${RED}❌ Failed: $TEST_FAIL${NC}"
agent-browser close
if [ $TEST_FAIL -gt 0 ]; then
    exit 1
fi
exit 0
