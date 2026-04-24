/**
 * App boot — runs pack loaders once per client. Determines which industry
 * packs are active for the current tenant. In production this would be
 * driven by `TenantPackActivation` fetched from the backend; v1 statically
 * activates KitchenEquipment for the B3 MACBIS tenant.
 */
import { loadKitchenEquipmentPack } from "@/packs/kitchen-equipment/load";

let bootRan = false;

export function bootOnce(): void {
  if (bootRan) return;
  bootRan = true;
  // v1 single-tenant activation; will move to tenant-driven once
  // multi-tenant SaaS deployment arrives.
  loadKitchenEquipmentPack();
}

export function resetBootForTesting(): void {
  bootRan = false;
}
