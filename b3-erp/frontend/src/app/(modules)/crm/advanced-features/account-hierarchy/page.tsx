'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageToolbar, ConfirmDialog } from '@/components/ui';
import { AccountHierarchyTree } from '@/components/crm';
import type { AccountNode } from '@/components/crm';
import { AccountLinkModal, type AccountLink } from '@/components/modals';
import { ArrowLeft } from 'lucide-react';

const mockAccountHierarchy: AccountNode = {
  id: '1',
  name: 'TechCorp Global Inc.',
  type: 'parent',
  industry: 'Technology',
  location: 'San Francisco, CA',
  contactPerson: 'John Smith',
  email: 'john.smith@techcorp.com',
  phone: '+1 (415) 555-0100',
  website: 'www.techcorp.com',
  employees: 25000,
  annualRevenue: 5000000000,
  accountValue: 12500000,
  activeContracts: 8,
  relationshipStart: '2020-01-15',
  status: 'active',
  children: [
    {
      id: '2',
      name: 'TechCorp Europe GmbH',
      type: 'subsidiary',
      industry: 'Technology',
      location: 'Berlin, Germany',
      contactPerson: 'Anna Schmidt',
      email: 'anna.schmidt@techcorp.de',
      phone: '+49 30 555-0200',
      employees: 5000,
      annualRevenue: 800000000,
      accountValue: 2800000,
      activeContracts: 3,
      relationshipStart: '2020-06-10',
      status: 'active',
      children: [
        {
          id: '3',
          name: 'TechCorp Berlin Office',
          type: 'branch',
          location: 'Berlin, Germany',
          contactPerson: 'Klaus Weber',
          email: 'klaus.weber@techcorp.de',
          phone: '+49 30 555-0201',
          employees: 1200,
          accountValue: 850000,
          activeContracts: 1,
          relationshipStart: '2021-03-15',
          status: 'active',
        },
      ],
    },
    {
      id: '4',
      name: 'TechCorp Asia Pacific Ltd.',
      type: 'subsidiary',
      location: 'Singapore',
      contactPerson: 'Wei Chen',
      email: 'wei.chen@techcorp.sg',
      phone: '+65 6555 0400',
      employees: 3500,
      annualRevenue: 600000000,
      accountValue: 1950000,
      activeContracts: 2,
      relationshipStart: '2021-02-20',
      status: 'active',
    },
  ],
};

export default function AccountHierarchyPage() {
  const router = useRouter();
  const [showAccountLinkModal, setShowAccountLinkModal] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState<string | undefined>();

  const handleAddChild = (id: string) => {
    console.log('Adding child to account:', id);
  };

  const handleEditAccount = (id: string) => {
    console.log('Editing account:', id);
  };

  const handleViewAccount = (id: string) => {
    console.log('Viewing account details:', id);
  };

  const handleLinkAccount = (id: string) => {
    setCurrentAccountId(id);
    setShowAccountLinkModal(true);
  };

  const handleSaveAccountLink = (link: AccountLink) => {
    console.log('Account linked:', link);
    setShowAccountLinkModal(false);
    setCurrentAccountId(undefined);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
        <button
          onClick={() => router.push('/crm/advanced-features')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced Features
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Account Hierarchy Visualization</h2>
          <p className="text-gray-600 mb-4">
            Visual representation of parent companies, subsidiaries, branches, and divisions with full
            contact and financial details.
          </p>
          <AccountHierarchyTree
            rootAccount={mockAccountHierarchy}
            onAddChild={handleAddChild}
            onEdit={handleEditAccount}
            onView={handleViewAccount}
            onLink={handleLinkAccount}
            showActions={true}
            expandAll={false}
          />
        </div>
      </div>

      <AccountLinkModal
        isOpen={showAccountLinkModal}
        onClose={() => {
          setShowAccountLinkModal(false);
          setCurrentAccountId(undefined);
        }}
        onSave={handleSaveAccountLink}
        currentAccountId={currentAccountId}
        mode="add"
      />
    </div>
  );
}
