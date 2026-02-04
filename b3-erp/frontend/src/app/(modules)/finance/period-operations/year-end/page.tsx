'use client'

import { useState } from 'react'
import { Calendar, CheckCircle, AlertCircle, FileText, Lock } from 'lucide-react'

export default function YearEndPage() {
  const [procedures] = useState([
    { category: 'Financial Statements', tasks: ['Prepare annual P&L', 'Prepare balance sheet', 'Prepare cash flow statement', 'Notes to accounts'], completed: 3, total: 4 },
    { category: 'Tax Compliance', tasks: ['Income tax computation', 'GST annual return', 'TDS certificates', 'Tax audit report'], completed: 2, total: 4 },
    { category: 'Statutory Audit', tasks: ['Fixed assets verification', 'Inventory count', 'Bank confirmations', 'Audit report'], completed: 1, total: 4 },
    { category: 'Regulatory Filings', tasks: ['ROC filing', 'Annual return', 'Director report', 'KYC compliance'], completed: 0, total: 4 }
  ])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-3 py-2">
      <div className="w-full space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Year-End Procedures</h1>
          <p className="text-gray-600 mt-1">Annual closing workflows and compliance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {procedures.map((proc, idx) => {
            const progress = (proc.completed / proc.total) * 100
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{proc.category}</h3>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{proc.completed}/{proc.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <ul className="space-y-2">
                  {proc.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex items-center gap-2 text-sm">
                      {tidx < proc.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={tidx < proc.completed ? 'text-gray-900' : 'text-gray-500'}>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
