from datetime import date
import os
import tempfile
import pytest

from optiforge.platform.localisation import catalogue, validators
from optiforge.platform.localisation.catalogue import (
    MissingLabelError, scan_source_for_labels, translate, register,
)
from optiforge.platform.localisation.formatters import (
    format_currency, format_date, format_number,
)
from optiforge.platform.localisation.locales import (
    direction, get_locale, supported_locales,
)


# --- Locales ---

def test_three_launch_locales_supported():
    assert set(supported_locales()) == {'en-US', 'en-GB', 'ar-AE'}


def test_unknown_locale_rejected():
    with pytest.raises(ValueError):
        get_locale('de-DE')


def test_rtl_direction_for_arabic():
    assert direction('ar-AE') == 'rtl'
    assert direction('en-US') == 'ltr'
    assert direction('en-GB') == 'ltr'


# --- Formatters ---

@pytest.mark.parametrize('locale,expected', [
    ('en-US', '1,234.56'),
    ('en-GB', '1,234.56'),
    ('ar-AE', '1,234.56'),
])
def test_format_number(locale, expected):
    assert format_number(1234.56, locale) == expected


def test_format_number_integer_mode():
    assert format_number(1234567, 'en-US', fraction_digits=0) == '1,234,567'


def test_format_currency_symbol_placement():
    assert format_currency(1234.5, 'en-US') == '$1,234.50'
    assert format_currency(1234.5, 'en-GB') == '£1,234.50'
    assert format_currency(1234.5, 'ar-AE').startswith('د.إ')


def test_format_currency_with_override_code():
    result = format_currency(100, 'en-US', currency_code='EUR')
    assert result == '€100.00'


def test_format_date_varies_by_locale():
    d = date(2026, 4, 23)
    assert format_date(d, 'en-US') == '04/23/2026'
    assert format_date(d, 'en-GB') == '23/04/2026'


def test_format_date_accepts_iso_string():
    assert format_date('2026-04-23', 'en-US') == '04/23/2026'


# --- Catalogue ---

@pytest.fixture(autouse=True)
def clean_catalogue():
    catalogue.clear()
    yield
    catalogue.clear()


def test_translate_with_locale_then_fallback():
    register('en-US', {'hello': 'Hello'})
    register('ar-AE', {'hello': 'مرحبا'})
    assert translate('en-US', 'hello') == 'Hello'
    assert translate('ar-AE', 'hello') == 'مرحبا'


def test_translate_falls_back_to_en_us():
    register('en-US', {'order.title': 'Order'})
    assert translate('ar-AE', 'order.title') == 'Order'


def test_translate_missing_label_raises():
    with pytest.raises(MissingLabelError):
        translate('en-US', 'unknown.key')


def test_scan_source_extracts_label_keys():
    with tempfile.TemporaryDirectory() as tmp:
        with open(os.path.join(tmp, 'sample.tsx'), 'w') as f:
            f.write("""
                const a = t('order.title');
                const b = tr("menu.home");
                const c = i18n.t('nav.settings');
            """)
        with open(os.path.join(tmp, 'view.py'), 'w') as f:
            f.write("msg = t('api.errors.not_found')")

        found = scan_source_for_labels(tmp)
    assert 'order.title' in found
    assert 'menu.home' in found
    assert 'nav.settings' in found
    assert 'api.errors.not_found' in found


# --- Country validator hook ---

@pytest.fixture(autouse=True)
def clean_validators():
    validators.clear()
    yield
    validators.clear()


def test_register_and_invoke_validator():
    def in_gst_validator(value, ctx):
        return [] if len(value) == 15 else ['GST ID must be 15 chars']

    validators.register_country_validator('IN', 'tax_id', in_gst_validator)
    assert validators.validate('IN', 'tax_id', '27AAACR5055K1Z5') == []
    errors = validators.validate('IN', 'tax_id', 'short')
    assert errors == ['GST ID must be 15 chars']


def test_unknown_validator_kind_raises():
    with pytest.raises(validators.ValidatorNotRegisteredError):
        validators.validate('IN', 'tax_id', 'x')
