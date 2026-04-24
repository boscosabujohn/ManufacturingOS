import React from "react";
import { getSlotContributions } from "./slots";

type SlotProps = {
  slotId: string;
  context?: Record<string, unknown>;
  emptyFallback?: React.ReactNode;
};

/**
 * Renders every pack contribution registered at `slotId`, in registration
 * order. If no pack has contributed, renders `emptyFallback` (or nothing).
 */
export function Slot({ slotId, context, emptyFallback = null }: SlotProps): React.ReactElement {
  const contributions = getSlotContributions(slotId);
  if (contributions.length === 0) {
    return <>{emptyFallback}</>;
  }
  return (
    <>
      {contributions.map((c) => {
        const Component = c.component;
        return <Component key={c.packId} {...(context ?? {})} />;
      })}
    </>
  );
}
