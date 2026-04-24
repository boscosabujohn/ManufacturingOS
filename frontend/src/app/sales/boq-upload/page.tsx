"use client";

import React, { useEffect, useMemo, useState } from "react";
import { bootOnce } from "@/app/boot";
import { Slot } from "@/platform/extensions/Slot";

type ParsedLine = {
  line: number;
  description?: string;
  fasciaType?: string;
  claddingType?: string;
  applianceClass?: string;
  nsfCompliant?: boolean;
  quantity?: number;
};

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "parsed"; lines: ParsedLine[]; requirementId: string }
  | { status: "error"; message: string };

// Placeholder client — in production this POSTs to the backend's
// customer-requirement endpoint which invokes the BOQ parser via
// `extension_registry.invoke_parser('boq_import', ...)`.
async function submitBoq(file: File): Promise<{ requirementId: string; lines: ParsedLine[] }> {
  const body = new FormData();
  body.append("source_type", "boq_import");
  body.append("file", file);

  const res = await fetch("/api/v1/sales/customer-requirements/", {
    method: "POST",
    body,
  });
  if (!res.ok) {
    throw new Error(`Upload failed: HTTP ${res.status}`);
  }
  const json = (await res.json()) as { id: string; parsed_lines?: ParsedLine[] };
  return { requirementId: json.id, lines: json.parsed_lines ?? [] };
}

export default function BoqUploadPage(): React.ReactElement {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [activeTab, setActiveTab] = useState<"summary" | "kitchen-specs">("summary");

  useEffect(() => {
    bootOnce();
  }, []);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setState({ status: "uploading" });
    try {
      const { requirementId, lines } = await submitBoq(file);
      setState({ status: "parsed", requirementId, lines });
      setActiveTab("kitchen-specs");
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "unknown" });
    }
  };

  const parsedLines = state.status === "parsed" ? state.lines : [];

  const tabs: Array<{ id: "summary" | "kitchen-specs"; label: string }> = useMemo(() => {
    // The pack-contributed tab key mirrors the backend slot id; presence
    // of a registered pack toggles the tab's visibility.
    return [
      { id: "summary", label: "Summary" },
      { id: "kitchen-specs", label: "Kitchen Specs" },
    ];
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Upload BOQ
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Drop a Bill of Quantities PDF or spreadsheet. The active industry
        packs parse it into line items and surface their domain-specific
        review panels.
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <input
          type="file"
          accept=".pdf,.xls,.xlsx,.csv"
          onChange={onChange}
          aria-label="BOQ file"
        />
        {state.status === "uploading" && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Parsing…</span>
        )}
        {state.status === "error" && (
          <span className="text-sm text-red-600">{state.message}</span>
        )}
        {state.status === "parsed" && (
          <span className="text-sm text-green-700">
            Parsed {parsedLines.length} line item(s) · CR {state.requirementId}
          </span>
        )}
      </div>

      <nav className="mt-8 flex gap-2 border-b border-zinc-200 dark:border-zinc-800" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === t.id
                ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {activeTab === "summary" && (
        <section className="mt-4 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Line-item summary</h2>
          {parsedLines.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No BOQ parsed yet.</p>
          ) : (
            <ul className="mt-2 text-sm">
              {parsedLines.map((l) => (
                <li key={l.line} className="border-t border-zinc-100 py-1 dark:border-zinc-800">
                  #{l.line}: {l.description ?? "—"} × {l.quantity ?? 1}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {activeTab === "kitchen-specs" && (
        <Slot
          slotId="sales.boq-upload.tab"
          context={{ parsedLines }}
          emptyFallback={
            <section className="mt-4 rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              No industry pack has contributed a panel here yet.
            </section>
          }
        />
      )}
    </main>
  );
}
