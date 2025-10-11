import { ReactNode } from 'react';
import * as Icons from 'lucide-react';

interface PageLayoutProps {
  title: string;
  description: string;
  icon: string;
  children?: ReactNode;
}

export default function PageLayout({ title, description, icon, children }: PageLayoutProps) {
  const Icon = (Icons as any)[icon] || Icons.FileQuestion;

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[600px]">
        {children || (
          <div className="flex items-center justify-center h-full min-h-[500px]">
            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 max-w-md mx-auto">{description}</p>
              <p className="text-sm text-gray-500 mt-4">This page is under development.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
