'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Building2,
  CreditCard,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  MultiStepForm,
  useMultiStepForm,
  FormProgressIndicator,
  useAutoSaveDraft,
  AutoSaveIndicator,
  DraftRecoveryBanner,
  useUnsavedChangesWarning,
  FieldHelp,
  HelpIcon,
  useSmartDefaults,
} from '@/components/ui';

// Step content components
function ContactInfoStep() {
  const { formData, setFormData } = useMultiStepForm();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please provide your basic contact details.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name
            <HelpIcon content="Enter your legal first name as it appears on official documents." />
          </label>
          <input
            type="text"
            value={(formData.firstName as string) || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="John"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name
            <HelpIcon content="Enter your legal last name / family name." />
          </label>
          <input
            type="text"
            value={(formData.lastName as string) || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <FieldHelp
          content="We'll use this email for order confirmations and important account updates."
          title="Email Address"
          variant="popover"
          trigger="click"
          position="right"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-help">
            <Mail className="h-4 w-4" />
            Email Address
          </label>
        </FieldHelp>
        <input
          type="email"
          value={(formData.email as string) || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="john.doe@example.com"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <Phone className="h-4 w-4" />
          Phone Number
          <HelpIcon content="Include country code for international numbers. Format: +1 (555) 123-4567" />
        </label>
        <input
          type="tel"
          value={(formData.phone as string) || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  );
}

function CompanyInfoStep() {
  const { formData, setFormData } = useMultiStepForm();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Company Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Tell us about your company for B2B services.
        </p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <Building2 className="h-4 w-4" />
          Company Name
          <HelpIcon content="Enter the legal registered name of your company." />
        </label>
        <input
          type="text"
          value={(formData.companyName as string) || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Acme Corporation"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Industry
        </label>
        <select
          value={(formData.industry as string) || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select industry...</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="retail">Retail</option>
          <option value="finance">Finance</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Company Size
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['1-50', '51-200', '201-500', '501-1000', '1000+'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, companySize: size }))}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                formData.companySize === size
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {size} employees
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <MapPin className="h-4 w-4" />
          Business Address
        </label>
        <textarea
          value={(formData.address as string) || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="123 Business St, Suite 100&#10;City, State 12345"
        />
      </div>
    </div>
  );
}

function BillingInfoStep() {
  const { formData, setFormData } = useMultiStepForm();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Billing Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Set up your billing preferences. This step is optional.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Billing Contact Email
        </label>
        <input
          type="email"
          value={(formData.billingEmail as string) || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, billingEmail: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="billing@company.com"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Payment Terms
        </label>
        <select
          value={(formData.paymentTerms as string) || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select payment terms...</option>
          <option value="net15">Net 15</option>
          <option value="net30">Net 30</option>
          <option value="net45">Net 45</option>
          <option value="net60">Net 60</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={(formData.sameAsBusiness as boolean) || false}
            onChange={(e) => setFormData(prev => ({ ...prev, sameAsBusiness: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Billing address same as business address
          </span>
        </label>
      </div>
    </div>
  );
}

function ReviewStep() {
  const { formData } = useMultiStepForm();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Review & Submit
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please review your information before submitting.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Contact Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <span className="text-gray-900 dark:text-white">{String(formData.firstName)} {String(formData.lastName)}</span>
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="text-gray-900 dark:text-white">{String(formData.email || '') || '-'}</span>
            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="text-gray-900 dark:text-white">{String(formData.phone || '') || '-'}</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Company Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Company:</span>
            <span className="text-gray-900 dark:text-white">{String(formData.companyName || '') || '-'}</span>
            <span className="text-gray-600 dark:text-gray-400">Industry:</span>
            <span className="text-gray-900 dark:text-white">{String(formData.industry || '') || '-'}</span>
            <span className="text-gray-600 dark:text-gray-400">Size:</span>
            <span className="text-gray-900 dark:text-white">{String(formData.companySize || '') || '-'}</span>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Ready to submit
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Click &quot;Complete&quot; to create your account. You can update this information later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main demo page component
export default function FormUXDemoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Auto-save draft
  const { lastSaved, isSaving, hasDraft, clearDraft, restoreDraft } = useAutoSaveDraft(
    formData,
    {
      key: 'vendor-onboarding-demo',
      debounceMs: 1500,
      onSave: (data) => console.log('Draft saved:', data),
    }
  );

  // Unsaved changes warning
  const hasUnsavedChanges = Object.keys(formData).length > 0;
  useUnsavedChangesWarning(hasUnsavedChanges);

  // Smart defaults
  const smartDefaults = useSmartDefaults(
    [
      { field: 'industry', source: 'localStorage', key: 'lastSelectedIndustry', fallback: 'manufacturing' },
      { field: 'paymentTerms', source: 'context', key: 'defaultPaymentTerms', fallback: 'net30' },
    ],
    { defaultPaymentTerms: 'net30' }
  );

  // Apply smart defaults on mount
  useEffect(() => {
    if (Object.keys(smartDefaults).length > 0) {
      setFormData(prev => ({ ...smartDefaults, ...prev }));
    }
  }, [smartDefaults]);

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft) {
      setShowDraftBanner(true);
    }
  }, [hasDraft]);

  const handleRestoreDraft = () => {
    const draft = restoreDraft();
    if (draft) {
      setFormData(draft);
    }
    setShowDraftBanner(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
  };

  const wizardSteps = [
    {
      id: 'contact',
      label: 'Contact Info',
      description: 'Basic contact details',
      icon: User,
      fields: ['firstName', 'lastName', 'email', 'phone'],
    },
    {
      id: 'company',
      label: 'Company',
      description: 'Company information',
      icon: Building2,
      fields: ['companyName', 'industry', 'companySize', 'address'],
    },
    {
      id: 'billing',
      label: 'Billing',
      description: 'Payment setup',
      icon: CreditCard,
      isOptional: true,
      fields: ['billingEmail', 'paymentTerms'],
    },
    {
      id: 'review',
      label: 'Review',
      description: 'Confirm details',
      icon: FileText,
    },
  ];

  const formFields = [
    { name: 'firstName', required: true },
    { name: 'lastName', required: true },
    { name: 'email', required: true, validate: (v: unknown) => typeof v === 'string' && v.includes('@') },
    { name: 'phone', required: false },
    { name: 'companyName', required: true },
    { name: 'industry', required: true },
    { name: 'companySize', required: false },
    { name: 'address', required: false },
    { name: 'billingEmail', required: false },
    { name: 'paymentTerms', required: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form UX Components Demo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Multi-step wizard, auto-save, progress tracking, and field help
              </p>
            </div>
          </div>
          <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
        </div>
      </div>

      {/* Content */}
      <div className="w-full p-6 space-y-6">
        {/* Draft Recovery Banner */}
        <DraftRecoveryBanner
          hasDraft={showDraftBanner}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
        />

        {/* Form Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Form Completion Progress
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <FormProgressIndicator
              fields={formFields}
              values={formData}
              variant="bar"
              showPercentage
              showFieldCount
            />
            <FormProgressIndicator
              fields={formFields}
              values={formData}
              variant="circular"
              size="md"
            />
            <FormProgressIndicator
              fields={formFields}
              values={formData}
              variant="segments"
              showPercentage
              showFieldCount
            />
          </div>
        </div>

        {/* Multi-Step Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <MultiStepForm
            steps={wizardSteps}
            onComplete={(data) => {
              console.log('Form completed:', data);
              clearDraft();
              alert('Form submitted successfully!');
            }}
            onStepChange={(step, direction) => {
              console.log(`Moving ${direction} to step ${step}`);
            }}
            allowSkipOptional
            showProgressBar
            showStepList
            variant="horizontal"
          >
            {/* Step 1: Contact Info */}
            <ContactInfoStep />

            {/* Step 2: Company Info */}
            <CompanyInfoStep />

            {/* Step 3: Billing Info */}
            <BillingInfoStep />

            {/* Step 4: Review */}
            <ReviewStep />
          </MultiStepForm>
        </div>

        {/* Feature Documentation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Form UX Features Demonstrated
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Multi-Step Wizard</p>
              <p className="text-gray-600 dark:text-gray-400">Step-by-step form with validation and navigation</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Progress Indicator</p>
              <p className="text-gray-600 dark:text-gray-400">Bar, circular, and segment variants</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Auto-Save Draft</p>
              <p className="text-gray-600 dark:text-gray-400">Automatic saving with debounce to localStorage</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Draft Recovery</p>
              <p className="text-gray-600 dark:text-gray-400">Restore previous form progress on page load</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Unsaved Changes Warning</p>
              <p className="text-gray-600 dark:text-gray-400">Browser prompt before navigating away</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Field-Level Help</p>
              <p className="text-gray-600 dark:text-gray-400">Tooltips and popovers with contextual help</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Smart Defaults</p>
              <p className="text-gray-600 dark:text-gray-400">Pre-fill from history, context, or computed values</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Optional Steps</p>
              <p className="text-gray-600 dark:text-gray-400">Allow skipping non-required steps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
