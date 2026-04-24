/**
 * KitchenEquipment pack frontend loader. Mirrors the backend loader but
 * registers the SCREEN_SLOT contributions for the UI. Called once during
 * app boot (see `src/app/boot.ts` or called from layout.tsx).
 *
 * Contract: idempotent — same-pack re-registration replaces in place.
 */
import KitchenSpecTab from "./KitchenSpecTab";
import { registerSlot } from "@/platform/extensions/slots";

export const KITCHEN_EQUIPMENT_PACK_ID = "kitchen-equipment";

export function loadKitchenEquipmentPack(): void {
  registerSlot("sales.boq-upload.tab", {
    packId: KITCHEN_EQUIPMENT_PACK_ID,
    component: KitchenSpecTab as never,
    order: 10,
  });

  registerSlot("sales.quote.sidebar", {
    packId: KITCHEN_EQUIPMENT_PACK_ID,
    component: KitchenSpecTab as never,
    order: 10,
  });
}
