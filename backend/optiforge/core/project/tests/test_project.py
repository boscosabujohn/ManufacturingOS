import pytest
from datetime import date

from optiforge.core.project.models import Milestone, Project, ResourceAllocation, WBSNode
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Proj Tenant', status='active')


@pytest.mark.django_db
def test_wbs_hierarchy(tenant):
    proj = Project.objects.create(tenant=tenant, code='PRJ-1', name='Kitchen Build')
    root = WBSNode.objects.create(tenant=tenant, project=proj, code='1', name='Design')
    leaf = WBSNode.objects.create(
        tenant=tenant, project=proj, code='1.1', name='CAD', parent=root,
    )
    assert leaf.parent_id == root.id
    assert root.children.count() == 1


@pytest.mark.django_db
def test_milestone_tracks_invoice_percentage(tenant):
    proj = Project.objects.create(tenant=tenant, code='PRJ-2', name='x')
    m = Milestone.objects.create(
        tenant=tenant, project=proj, name='Design Sign-off',
        target_date=date.today(), invoice_percentage=20,
    )
    assert m.invoice_percentage == 20


@pytest.mark.django_db
def test_resource_allocation_references_wbs(tenant):
    proj = Project.objects.create(tenant=tenant, code='PRJ-3', name='x')
    node = WBSNode.objects.create(tenant=tenant, project=proj, code='1', name='Do it')
    alloc = ResourceAllocation.objects.create(
        tenant=tenant, project=proj, wbs_node=node,
        resource_ref='employee:EMP-1', hours=40,
    )
    assert alloc.wbs_node_id == node.id
