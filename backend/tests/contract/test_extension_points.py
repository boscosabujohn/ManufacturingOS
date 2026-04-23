"""
Contract test for issue #39: TestIndustry exercises every one of the ten
extension points. Lives here (not under platform/) so platform code never
imports from the pack layer.
"""
import pytest

from optiforge.packs.test_industry.exerciser import PACK_ID, register_all_extension_points
from optiforge.platform.extensions.points import ExtensionPoint, extension_points


@pytest.fixture(autouse=True)
def clean_registry():
    extension_points.clear()
    yield
    extension_points.clear()


def test_test_industry_covers_every_extension_point():
    register_all_extension_points()
    covered = {reg.point for reg in extension_points.list_for_pack(PACK_ID)}
    missing = set(ExtensionPoint.ALL) - covered
    assert not missing, f"TestIndustry did not exercise: {missing}"


def test_catalogue_has_one_entry_per_point():
    register_all_extension_points()
    catalogue = extension_points.catalogue()
    for point in ExtensionPoint.ALL:
        assert len(catalogue[point]) >= 1, f"point '{point}' has no TestIndustry entry"
