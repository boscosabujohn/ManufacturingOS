'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Type, Hash, Calendar, ToggleLeft, List, FileText, Link2, CheckSquare } from 'lucide-react';

interface CustomField {
  id: string;
  name: string;
  label: string;
  module: string;
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'dropdown' | 'textarea' | 'url' | 'email';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: string;
  helpText?: string;
  createdAt: string;
  active: boolean;
}

export default function CustomFieldsPage() {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  const [customFields, setCustomFields] = useState<CustomField[]>([
    {
      id: '1',
      name: 'customer_industry',
      label: 'Industry Type',
      module: 'Customers',
      fieldType: 'dropdown',
      required: false,
      options: ['Manufacturing', 'Retail', 'Healthcare', 'Technology', 'Other'],
      helpText: 'Select the customer\'s primary industry',
      createdAt: '2024-01-10',
      active: true
    },
    {
      id: '2',
      name: 'customer_tax_exempt',
      label: 'Tax Exempt',
      module: 'Customers',
      fieldType: 'boolean',
      required: false,
      defaultValue: 'false',
      helpText: 'Is this customer exempt from sales tax?',
      createdAt: '2024-01-10',
      active: true
    },
    {
      id: '3',
      name: 'customer_credit_limit',
      label: 'Credit Limit',
      module: 'Customers',
      fieldType: 'number',
      required: false,
      validation: 'min:0,max:1000000',
      helpText: 'Maximum credit allowed for this customer',
      createdAt: '2024-01-12',
      active: true
    },
    {
      id: '4',
      name: 'order_special_instructions',
      label: 'Special Instructions',
      module: 'Sales Orders',
      fieldType: 'textarea',
      required: false,
      helpText: 'Additional instructions for order processing',
      createdAt: '2024-01-08',
      active: true
    },
    {
      id: '5',
      name: 'order_shipping_date',
      label: 'Preferred Shipping Date',
      module: 'Sales Orders',
      fieldType: 'date',
      required: false,
      helpText: 'Customer\'s preferred date for shipment',
      createdAt: '2024-01-15',
      active: true
    },
    {
      id: '6',
      name: 'product_warranty_period',
      label: 'Warranty Period (Months)',
      module: 'Products',
      fieldType: 'number',
      required: false,
      defaultValue: '12',
      validation: 'min:0,max:60',
      createdAt: '2024-01-05',
      active: true
    },
    {
      id: '7',
      name: 'product_eco_friendly',
      label: 'Eco-Friendly Product',
      module: 'Products',
      fieldType: 'boolean',
      required: false,
      defaultValue: 'false',
      helpText: 'Is this an environmentally friendly product?',
      createdAt: '2024-01-18',
      active: true
    },
    {
      id: '8',
      name: 'product_certifications',
      label: 'Product Certifications',
      module: 'Products',
      fieldType: 'dropdown',
      required: false,
      options: ['ISO 9001', 'CE Mark', 'FDA Approved', 'UL Listed', 'None'],
      createdAt: '2024-01-20',
      active: true
    },
    {
      id: '9',
      name: 'work_order_priority_notes',
      label: 'Priority Notes',
      module: 'Work Orders',
      fieldType: 'textarea',
      required: false,
      helpText: 'Notes explaining priority level',
      createdAt: '2024-01-14',
      active: true
    },
    {
      id: '10',
      name: 'work_order_machine_id',
      label: 'Assigned Machine ID',
      module: 'Work Orders',
      fieldType: 'text',
      required: false,
      validation: 'pattern:^[A-Z]{2}-[0-9]{4}$',
      helpText: 'Format: XX-9999',
      createdAt: '2024-01-16',
      active: true
    },
    {
      id: '11',
      name: 'supplier_website',
      label: 'Supplier Website',
      module: 'Suppliers',
      fieldType: 'url',
      required: false,
      validation: 'url',
      createdAt: '2024-01-11',
      active: true
    },
    {
      id: '12',
      name: 'supplier_payment_terms',
      label: 'Payment Terms',
      module: 'Suppliers',
      fieldType: 'dropdown',
      required: false,
      options: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'COD'],
      defaultValue: 'Net 30',
      createdAt: '2024-01-13',
      active: true
    },
    {
      id: '13',
      name: 'invoice_po_number',
      label: 'PO Number',
      module: 'Invoices',
      fieldType: 'text',
      required: false,
      helpText: 'Customer\'s purchase order number',
      createdAt: '2024-01-09',
      active: true
    },
    {
      id: '14',
      name: 'employee_emergency_contact',
      label: 'Emergency Contact Email',
      module: 'Employees',
      fieldType: 'email',
      required: true,
      validation: 'email',
      createdAt: '2024-01-07',
      active: true
    }
  ]);

  const modules = [
    'all',
    'Customers',
    'Sales Orders',
    'Products',
    'Work Orders',
    'Suppliers',
    'Invoices',
    'Employees'
  ];

  const fieldTypes = [
    { id: 'text', name: 'Text', icon: Type, description: 'Single line text input' },
    { id: 'textarea', name: 'Text Area', icon: FileText, description: 'Multi-line text input' },
    { id: 'number', name: 'Number', icon: Hash, description: 'Numeric input' },
    { id: 'date', name: 'Date', icon: Calendar, description: 'Date picker' },
    { id: 'boolean', name: 'Boolean', icon: ToggleLeft, description: 'Yes/No checkbox' },
    { id: 'dropdown', name: 'Dropdown', icon: List, description: 'Select from options' },
    { id: 'url', name: 'URL', icon: Link2, description: 'Website URL' },
    { id: 'email', name: 'Email', icon: Type, description: 'Email address' }
  ];

  const getFieldTypeIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      text: Type,
      textarea: FileText,
      number: Hash,
      date: Calendar,
      boolean: ToggleLeft,
      dropdown: List,
      url: Link2,
      email: Type
    };
    return iconMap[type] || Type;
  };

  const getFieldTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      text: 'bg-blue-50 text-blue-700 border-blue-200',
      textarea: 'bg-purple-50 text-purple-700 border-purple-200',
      number: 'bg-green-50 text-green-700 border-green-200',
      date: 'bg-orange-50 text-orange-700 border-orange-200',
      boolean: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dropdown: 'bg-pink-50 text-pink-700 border-pink-200',
      url: 'bg-teal-50 text-teal-700 border-teal-200',
      email: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    };
    return colors[type] || colors.text;
  };

  const filteredFields = selectedModule === 'all'
    ? customFields
    : customFields.filter(f => f.module === selectedModule);

  const handleDelete = (fieldId: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== fieldId));
  };

  const handleToggleActive = (fieldId: string) => {
    setCustomFields(prev =>
      prev.map(f =>
        f.id === fieldId ? { ...f, active: !f.active } : f
      )
    );
  };

  const stats = {
    totalFields: customFields.length,
    activeFields: customFields.filter(f => f.active).length,
    modules: new Set(customFields.map(f => f.module)).size,
    requiredFields: customFields.filter(f => f.required).length
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Custom Fields</h1>
          <p className="text-sm text-gray-500 mt-1">Add custom fields to extend module functionality</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fields</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFields}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <ToggleLeft className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeFields}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <List className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Modules</p>
              <p className="text-2xl font-bold text-purple-600">{stats.modules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <CheckSquare className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Required</p>
              <p className="text-2xl font-bold text-red-600">{stats.requiredFields}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Module</h2>

          <div className="space-y-2">
            {modules.map((module) => {
              const count = module === 'all'
                ? customFields.length
                : customFields.filter(f => f.module === module).length;

              return (
                <button
                  key={module}
                  onClick={() => setSelectedModule(module)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedModule === module
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm">
                      {module === 'all' ? 'All Modules' : module}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedModule === module
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-blue-900 mb-3">Field Types</h3>
            <div className="space-y-2">
              {fieldTypes.slice(0, 5).map((type) => {
                const IconComponent = type.icon;
                return (
                  <div key={type.id} className="flex items-center gap-2 text-xs">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{type.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Fields List */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedModule === 'all' ? 'All Custom Fields' : `${selectedModule} Fields`}
            </h2>
            <p className="text-sm text-gray-600">
              {filteredFields.length} field{filteredFields.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="space-y-4">
            {filteredFields.map((field) => {
              const IconComponent = getFieldTypeIcon(field.fieldType);

              return (
                <div key={field.id} className={`border-2 rounded-lg p-5 ${field.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${getFieldTypeColor(field.fieldType)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{field.label}</h3>
                          <p className="text-sm text-gray-600">{field.name}</p>
                        </div>
                        {field.required && (
                          <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
                            Required
                          </span>
                        )}
                        {!field.active && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Details:</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">Module:</span> <span className="font-medium text-gray-900">{field.module}</span></p>
                            <p><span className="text-gray-600">Type:</span> <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getFieldTypeColor(field.fieldType)}`}>{field.fieldType}</span></p>
                            <p><span className="text-gray-600">Created:</span> <span className="font-medium text-gray-900">{field.createdAt}</span></p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">Configuration:</p>
                          <div className="space-y-1 text-sm">
                            {field.defaultValue && (
                              <p><span className="text-gray-600">Default:</span> <span className="font-medium text-gray-900">{field.defaultValue}</span></p>
                            )}
                            {field.validation && (
                              <p><span className="text-gray-600">Validation:</span> <span className="font-medium text-gray-900">{field.validation}</span></p>
                            )}
                            {field.options && (
                              <div>
                                <p className="text-gray-600 mb-1">Options:</p>
                                <div className="flex flex-wrap gap-1">
                                  {field.options.slice(0, 3).map((option, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                                      {option}
                                    </span>
                                  ))}
                                  {field.options.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                      +{field.options.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {field.helpText && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2">
                          <p className="text-xs text-blue-700">
                            <strong>Help Text:</strong> {field.helpText}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(field.id)}
                        className={`p-2 rounded-lg ${field.active ? 'hover:bg-yellow-50 text-yellow-600' : 'hover:bg-green-50 text-green-600'}`}
                        title={field.active ? 'Deactivate' : 'Activate'}
                      >
                        <ToggleLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingField(field)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                       
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(field.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                       
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFields.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No custom fields found</p>
              <p className="text-sm text-gray-500">Add a new field to get started</p>
            </div>
          )}

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">Custom Field Guidelines:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Field names must be unique within each module</li>
              <li>• Use descriptive labels that users will understand</li>
              <li>• Required fields cannot be removed once in use</li>
              <li>• Changing field type may result in data loss</li>
              <li>• Inactive fields are hidden from forms but data is preserved</li>
              <li>• Test custom fields in staging before production deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
