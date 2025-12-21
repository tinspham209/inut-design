# Shipping Fee Feature (Checkout - Lighters)

## 1. Overview
Implements dynamic shipping fee detection on the Lighters checkout (`/checkout/lighters`). The system auto-detects if the delivery address is in Đà Nẵng and applies a specific `shippingFee` document (slug: `da-nang`). Users can manually override by selecting another shipping method. The selected shipping fee updates `finalAmount` and is stored with the order.

## 2. Sanity Schema
Document type: `shippingFee` (already created).
Fields:
- `name` (string, required)
- `slug` (slug, required; e.g. `da-nang`, `toan-quoc`)
- `fee` (number, >=0)
- `note` (text, optional)

Recommended initial entries:
| Name                  | Slug      | Fee   | Note                         |
| --------------------- | --------- | ----- | ---------------------------- |
| Nội thành Đà Nẵng     | da-nang   | 0     | Miễn phí giao hàng nội thành |
| Toàn quốc (Chuẩn)     | toan-quoc | 30000 | Phí tiêu chuẩn ngoài Đà Nẵng |
| Giao nhanh (Tuỳ chọn) | express   | 50000 | Giao nhanh toàn quốc         |

## 3. Data Flow
1. Client loads checkout page.
2. Fetch all shipping fees via GROQ.
3. User types delivery address → debounce + normalization → region detection.
4. Auto-select matching fee if user hasn't manually overridden.
5. Recalculate `finalAmount = totalAmount + shippingFee - discount`.
6. Submit order → store numeric `shippingFee` (and optionally slug/reference for analytics later).

## 4. API Client
File: `api-client/shippingFee.ts`
```ts
import client from './sanity-client';
import groq from 'groq';

const FEES_QUERY = groq`*[_type=="shippingFee"]{_id,name,fee,"slug":slug.current,note}`;
export async function getAllShippingFees() {
  return client.fetch(FEES_QUERY);
}
export async function getShippingFeeBySlug(slug: string) {
  return client.fetch(groq`*[_type=="shippingFee" && slug.current==$slug][0]{_id,name,fee,"slug":slug.current,note}`, { slug });
}
```

## 5. Types
File: `models/shippingFee.ts`
```ts
export interface ShippingFee {
  _id: string;
  name: string;
  slug: string;
  fee: number;
  note?: string;
}
```

## 6. Hooks
File: `hooks/useShippingFees.ts`
```ts
import useSWR from 'swr';
import { getAllShippingFees } from '@/api/shippingFee';
import { ShippingFee } from '@/models/shippingFee';

export function useShippingFees() {
  const { data, error, isValidating } = useSWR<ShippingFee[]>('/shipping-fees', getAllShippingFees);
  return { fees: data || [], error, loading: !data && !error, isValidating };
}
```

Detection helper: `utils/shippingDetection.ts`
```ts
import { ShippingFee } from '@/models/shippingFee';

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\u0300-\u036f/g, '') // remove diacritics
    .replace(/đ/g, 'd')
    .trim();
}

export function detectFee(address: string, fees: ShippingFee[]): ShippingFee | undefined {
  const norm = normalize(address);
  const isDaNang = /(\b|\s)da\s*nang(\b|\s)/.test(norm) || norm.includes('danang');
  if (isDaNang) return fees.find(f => f.slug === 'da-nang');
  // fallback order preference
  return fees.find(f => f.slug === 'toan-quoc') || fees[0];
}
```

## 7. Checkout Page Changes (`pages/checkout/lighters.tsx`)
Add logic near top:
```ts
const { fees, loading: feesLoading } = useShippingFees();
const [selectedFee, setSelectedFee] = useState<ShippingFee | null>(null);
const [autoFee, setAutoFee] = useState<ShippingFee | null>(null);
const [manualOverride, setManualOverride] = useState(false);
```
Watch deliveryAddress (using a `Controller` or `watch` from `react-hook-form`) with debounce:
```ts
const deliveryAddress = watch('deliveryAddress');
useEffect(() => {
  if (!fees.length || !deliveryAddress) return;
  const detected = detectFee(deliveryAddress, fees);
  setAutoFee(detected || null);
  if (!manualOverride && detected) setSelectedFee(detected);
}, [deliveryAddress, fees, manualOverride]);
```
Adjust final amount:
```ts
const shippingFeeValue = selectedFee?.fee || 0;
const finalAmount = totalAmount + shippingFeeValue - discount;
```
Add UI select (manual override):
```tsx
<FormControl fullWidth>
  <InputLabel>Phương thức giao hàng</InputLabel>
  <Select
    value={selectedFee?._id || ''}
    label="Phương thức giao hàng"
    onChange={(e) => {
      const feeObj = fees.find(f => f._id === e.target.value) || null;
      setSelectedFee(feeObj);
      setManualOverride(true);
    }}
  >
    {fees.map(f => (
      <MenuItem key={f._id} value={f._id}>{f.name} ({f.fee.toLocaleString()}₫)</MenuItem>
    ))}
  </Select>
  {autoFee && manualOverride && autoFee._id !== selectedFee?._id && (
    <Typography variant="caption" color="text.secondary">
      Tự động nhận diện khu vực: {autoFee.name}. <Button size="small" onClick={() => {setSelectedFee(autoFee); setManualOverride(false);}}>Áp dụng</Button>
    </Typography>
  )}
</FormControl>
```
Summary card: add line
```tsx
<Stack direction="row" justifyContent="space-between">
  <Typography variant="body2">Phí vận chuyển:</Typography>
  <Typography variant="body2" fontWeight="bold">{formatPrice(shippingFeeValue)}</Typography>
</Stack>
```

## 8. Order Submission Adjustment
In `onSubmit`:
```ts
const shippingFee = selectedFee?.fee || 0;
const discount = 0; // existing logic
const finalAmount = totalAmount + shippingFee - discount;

const orderInput: CreateOrderLighterInput = {
  // ...existing fields
  shippingFee,
  finalAmount,
};
```

## 9. Analytics
Ensure `trackPurchase` receives updated `finalAmount`. Optionally pass shipping fee as custom dimension/event field if supported.

## 10. Manual Test Cases
| Case             | Address Input                     | Expected Fee Slug    | Fee Value |
| ---------------- | --------------------------------- | -------------------- | --------- |
| Local diacritics | "123 Lê Duẩn, Đà Nẵng"            | da-nang              | 0         |
| No diacritics    | "da nang city"                    | da-nang              | 0         |
| Compact          | "danang"                          | da-nang              | 0         |
| Nation-wide      | "Hà Nội"                          | toan-quoc            | 30000     |
| Override         | Enter Đà Nẵng then choose Express | express              | 50000     |
| Clear field      | ""                                | toan-quoc (fallback) | 30000     |

Edge tests:
- Fees not loaded yet → shipping shown as "—"; prevent submit or assume 0.
- Unknown address → fallback slug `toan-quoc`.
- User selects manual option then edits address to Đà Nẵng → keep manual until user clicks apply.

## 11. Performance Considerations
- Debounce address detection (e.g. 300ms) to avoid excessive effects.
- Fees list is small; SWR caching is sufficient.
- Optional localStorage caching for offline resilience (future).

## 12. Future Enhancements
- Add `shippingFeeRef` reference in `ordersLighter` for analytics.
- Predefined province selector instead of free-form text.
- Promotional rules (e.g. free nationwide shipping over X amount).
- Internationalization for detection logic.

## 13. Implementation Checklist
- [ ] Sanity documents created.
- [ ] API client file added.
- [ ] Type definition created.
- [ ] Hook + detection util implemented.
- [ ] Checkout page updated with fee selection UI.
- [ ] Final amount recalculation integrated.
- [ ] Order creation includes fee.
- [ ] Analytics finalAmount updated.
- [ ] Manual test pass.

## 14. Rollout Plan
1. Add content in Sanity.
2. Deploy code changes (feature branch → staging → production).
3. Verify detection + manual override in production.
4. Monitor purchase events for correct final amounts.

---
Owner: Engineering / Frontend
Last Updated: <REPLACE_DATE>
