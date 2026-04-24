"""
Issue #35 — localisation readiness. English labels fully extracted
(catalogue has the base label keyset), RTL direction available for the
launch locale.
"""
import pytest

from optiforge.platform.localisation import catalogue
from optiforge.platform.localisation.locales import direction


@pytest.fixture(autouse=True)
def clean_catalogue():
    catalogue.clear()
    yield
    catalogue.clear()


BASELINE_LABELS = {
    'nav.home': 'Home',
    'nav.settings': 'Settings',
    'order.title': 'Order',
    'order.status': 'Status',
    'api.errors.not_found': 'Not found',
    'api.errors.rate_limited': 'Too many requests',
    'menu.signout': 'Sign out',
}


def test_english_baseline_labels_registerable():
    catalogue.register('en-US', BASELINE_LABELS)
    for key in BASELINE_LABELS:
        assert catalogue.translate('en-US', key) == BASELINE_LABELS[key]


def test_arabic_translate_falls_back_to_english_until_ar_ae_labels_authored():
    catalogue.register('en-US', BASELINE_LABELS)
    # Arabic catalogue is intentionally empty in v1 — the fallback to
    # en-US is the readiness gate.
    assert catalogue.translate('ar-AE', 'nav.home') == 'Home'


def test_rtl_locale_declares_rtl_direction():
    assert direction('ar-AE') == 'rtl'


def test_ltr_locales_declare_ltr_direction():
    assert direction('en-US') == 'ltr'
    assert direction('en-GB') == 'ltr'
