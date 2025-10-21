'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Save, Globe, Phone, Mail, MapPin, FileText, Upload, Calendar, Users } from 'lucide-react';

interface CompanySettings {
  name: string;
  legalName: string;
  industry: string;
  taxId: string;
  registrationNumber: string;
  website: string;
  email: string;
  phone: string;
  fax: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  financialYear: {
    startMonth: string;
    endMonth: string;
  };
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  fiscalYearStart: string;
  employees: string;
  founded: string;
  logoUrl: string;
}

export default function CompanySettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'B3 Manufacturing Solutions',
    legalName: 'B3 Manufacturing Solutions Private Limited',
    industry: 'Manufacturing & Industrial',
    taxId: 'GSTIN29ABCDE1234F1Z5',
    registrationNumber: 'CIN-U74999KA2020PTC123456',
    website: 'https://www.b3manufacturing.com',
    email: 'contact@b3manufacturing.com',
    phone: '+91 80 4567 8900',
    fax: '+91 80 4567 8901',
    address: {
      street: '123 Industrial Area, Phase II',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560100',
      country: 'India'
    },
    financialYear: {
      startMonth: 'April',
      endMonth: 'March'
    },
    currency: 'INR',
    timezone: 'Asia/Kolkata (UTC+05:30)',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24-hour',
    fiscalYearStart: 'April 1',
    employees: '250-500',
    founded: '2020',
    logoUrl: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => {
      const keys = field.split('.');
      if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof CompanySettings] as any),
            [keys[1]]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving company settings:', settings);
    setHasChanges(false);
  };

  const industries = [
    'Manufacturing & Industrial',
    'Automotive',
    'Electronics',
    'Pharmaceuticals',
    'Food & Beverage',
    'Textiles',
    'Chemicals',
    'Other'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your organization's profile and preferences</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Company Profile</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name *</label>
                  <input
                    type="text"
                    value={settings.legalName}
                    onChange={(e) => handleChange('legalName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <select
                    value={settings.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <select
                    value={settings.employees}
                    onChange={(e) => handleChange('employees', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID (GSTIN) *</label>
                  <input
                    type="text"
                    value={settings.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
                  <input
                    type="text"
                    value={settings.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                <input
                  type="text"
                  value={settings.founded}
                  onChange={(e) => handleChange('founded', e.target.value)}
                  placeholder="YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Fax
                  </label>
                  <input
                    type="tel"
                    value={settings.fax}
                    onChange={(e) => handleChange('fax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={settings.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Registered Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  value={settings.address.street}
                  onChange={(e) => handleChange('address.street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={settings.address.city}
                    onChange={(e) => handleChange('address.city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                  <input
                    type="text"
                    value={settings.address.state}
                    onChange={(e) => handleChange('address.state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                  <input
                    type="text"
                    value={settings.address.zipCode}
                    onChange={(e) => handleChange('address.zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    value={settings.address.country}
                    onChange={(e) => handleChange('address.country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Financial Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Company Logo</h2>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Company Logo" className="mx-auto mb-4 max-h-32" />
              ) : (
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Upload Logo
              </button>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">Financial Year</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                <select
                  value={settings.financialYear.startMonth}
                  onChange={(e) => handleChange('financialYear.startMonth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                <select
                  value={settings.financialYear.endMonth}
                  onChange={(e) => handleChange('financialYear.endMonth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  Current FY: {settings.financialYear.startMonth} - {settings.financialYear.endMonth}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Regional Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                  <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                  <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                  <option value="Asia/Dubai (UTC+04:00)">Asia/Dubai (UTC+04:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleChange('timeFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24-hour">24-hour (13:00)</option>
                  <option value="12-hour">12-hour (1:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-900">Quick Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">Total Users</span>
                <span className="text-sm font-bold text-blue-900">248</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">Active Since</span>
                <span className="text-sm font-bold text-blue-900">{settings.founded}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-700">Current FY</span>
                <span className="text-sm font-bold text-blue-900">2024-25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
