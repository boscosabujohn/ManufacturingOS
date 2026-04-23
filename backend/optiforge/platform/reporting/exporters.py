"""
Export pipeline: the same report definition (view + params) renders to
PDF, Excel, CSV. The PDF + XLSX stubs emit self-describing binary blobs
that downstream consumers treat as opaque. Real formatters can swap in
without changing callers.
"""
import csv
import io
import json


SUPPORTED_FORMATS = ('csv', 'xlsx', 'pdf', 'json')


class UnsupportedFormatError(ValueError):
    pass


def to_csv(columns, rows):
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=columns, extrasaction='ignore')
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    return buf.getvalue().encode('utf-8')


def to_json(columns, rows):
    payload = [{col: row.get(col) for col in columns} for row in rows]
    return json.dumps(payload, default=str).encode('utf-8')


def to_xlsx(columns, rows):
    """
    Stub Excel exporter — emits a minimal binary blob with a XLSX magic
    prefix plus the JSON payload. Real deployments swap in openpyxl /
    xlsxwriter behind this function signature.
    """
    return b'XLSX\x00' + to_json(columns, rows)


def to_pdf(columns, rows):
    """
    Stub PDF exporter — emits a minimal binary blob with a %PDF- magic
    prefix plus the JSON payload. Real deployments swap in reportlab /
    weasyprint behind this function signature.
    """
    return b'%PDF-1.4\n' + to_json(columns, rows)


_EXPORTERS = {
    'csv': to_csv,
    'xlsx': to_xlsx,
    'pdf': to_pdf,
    'json': to_json,
}


def export(format, columns, rows):
    if format not in _EXPORTERS:
        raise UnsupportedFormatError(f"Unsupported format '{format}'. Supported: {SUPPORTED_FORMATS}")
    return _EXPORTERS[format](columns, rows)
