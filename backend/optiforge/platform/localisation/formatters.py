"""
Locale-aware number / currency / date formatters. Pure Python — no `babel`
dependency — so the gateway and reporting layers can format deterministically.
"""
from datetime import date, datetime

from .locales import get_locale


def format_number(value, locale_code, fraction_digits=2):
    loc = get_locale(locale_code)
    sign = '-' if value < 0 else ''
    n = abs(float(value))
    integer_part = int(n)
    decimals = abs(n - integer_part)
    int_str = f"{integer_part:,}"
    int_str = int_str.replace(',', loc['thousands'])
    if fraction_digits > 0:
        frac_str = f"{decimals:.{fraction_digits}f}"[2:]
        return f"{sign}{int_str}{loc['decimal']}{frac_str}"
    return f"{sign}{int_str}"


def format_currency(value, locale_code, currency_code=None, fraction_digits=2):
    loc = get_locale(locale_code)
    symbol = _symbol_for_code(currency_code) if currency_code else loc['currency_symbol']
    amount = format_number(value, locale_code, fraction_digits=fraction_digits)
    return f"{symbol}{amount}" if loc['currency_before'] else f"{amount} {symbol}"


def format_date(d, locale_code):
    loc = get_locale(locale_code)
    if isinstance(d, str):
        d = datetime.fromisoformat(d).date()
    if isinstance(d, datetime):
        d = d.date()
    if not isinstance(d, date):
        raise TypeError(f"Unsupported type for format_date: {type(d)}")
    return d.strftime(loc['date_format'])


_SYMBOLS = {
    'USD': '$',
    'GBP': '£',
    'AED': 'د.إ',
    'EUR': '€',
    'INR': '₹',
}


def _symbol_for_code(code):
    return _SYMBOLS.get(code, code + ' ')
