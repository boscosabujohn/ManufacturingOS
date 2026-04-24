"use client";

import React from "react";

type KitchenSpec = {
  fasciaType?: string;
  claddingType?: string;
  applianceClass?: string;
  nsfCompliant?: boolean;
};

type Props = {
  parsedLines?: Array<{ line: number; description?: string } & KitchenSpec>;
};

/**
 * KitchenSpecTab — the pack-contributed tab on the BOQ upload page.
 * Reveals kitchen-specific metadata (fascia / cladding / appliance class)
 * pulled from the parsed BOQ lines. Appears only when the
 * KitchenEquipment pack is active.
 */
export default function KitchenSpecTab({ parsedLines = [] }: Props): React.ReactElement {
  const lines = parsedLines ?? [];
  return (
    <section aria-labelledby="kitchen-spec-heading" className="mt-4 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 id="kitchen-spec-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Kitchen Specifications
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Contributed by the <code>kitchen-equipment</code> pack. Reviews
        fascia and cladding for NSF-ANSI conformance.
      </p>
      {lines.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">No parsed lines yet. Upload a BOQ to populate this panel.</p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-1">#</th>
              <th className="py-1">Description</th>
              <th className="py-1">Fascia</th>
              <th className="py-1">Cladding</th>
              <th className="py-1">Appliance</th>
              <th className="py-1">NSF</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.line} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="py-1">{l.line}</td>
                <td className="py-1">{l.description ?? ""}</td>
                <td className="py-1">{l.fasciaType ?? "—"}</td>
                <td className="py-1">{l.claddingType ?? "—"}</td>
                <td className="py-1">{l.applianceClass ?? "—"}</td>
                <td className="py-1">{l.nsfCompliant === false ? "✗" : "✓"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
