"""
Locale metadata. Each supported locale declares language direction, decimal
separator, thousands separator, currency symbol, date format, and ordering
of currency + amount.
"""

LOCALES = {
    'en-US': {
        'lang': 'en',
        'country': 'US',
        'direction': 'ltr',
        'decimal': '.',
        'thousands': ',',
        'currency_symbol': '$',
        'currency_code': 'USD',
        'currency_before': True,
        'date_format': '%m/%d/%Y',
    },
    'en-GB': {
        'lang': 'en',
        'country': 'GB',
        'direction': 'ltr',
        'decimal': '.',
        'thousands': ',',
        'currency_symbol': '£',
        'currency_code': 'GBP',
        'currency_before': True,
        'date_format': '%d/%m/%Y',
    },
    'ar-AE': {
        'lang': 'ar',
        'country': 'AE',
        'direction': 'rtl',
        'decimal': '.',
        'thousands': ',',
        'currency_symbol': 'د.إ',
        'currency_code': 'AED',
        'currency_before': True,
        'date_format': '%d/%m/%Y',
    },
}


def get_locale(code):
    if code not in LOCALES:
        raise ValueError(f"Unknown locale '{code}'. Supported: {sorted(LOCALES)}")
    return LOCALES[code]


def direction(code):
    return get_locale(code)['direction']


def supported_locales():
    return sorted(LOCALES.keys())
