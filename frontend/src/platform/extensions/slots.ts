/**
 * Frontend slot registry — mirror of the backend SCREEN_SLOT extension point.
 *
 * Packs call `registerSlot(slotId, { packId, component })` at load time; the
 * `<Slot>` component renders every registered contribution for a given
 * slotId. This is the UI-layer analogue of
 * `optiforge.platform.extensions.points.ExtensionPoint.SCREEN_SLOT`.
 */
import type { ComponentType } from "react";

export type SlotContribution = {
  packId: string;
  component: ComponentType<Record<string, unknown>>;
  order?: number;
};

type SlotRegistry = Map<string, SlotContribution[]>;

const registry: SlotRegistry = new Map();

export function registerSlot(slotId: string, contribution: SlotContribution): void {
  const list = registry.get(slotId) ?? [];
  if (list.some((c) => c.packId === contribution.packId)) {
    // Same-pack re-registration is idempotent; replace in place.
    const idx = list.findIndex((c) => c.packId === contribution.packId);
    list[idx] = contribution;
  } else {
    list.push(contribution);
  }
  list.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  registry.set(slotId, list);
}

export function getSlotContributions(slotId: string): SlotContribution[] {
  return registry.get(slotId) ?? [];
}

export function clearSlotRegistry(): void {
  registry.clear();
}

export function activePacks(slotId: string): string[] {
  return (registry.get(slotId) ?? []).map((c) => c.packId);
}
