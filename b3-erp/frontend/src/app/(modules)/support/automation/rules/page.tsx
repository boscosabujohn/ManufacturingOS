'use client'
export default function AutomationRules() {
  const rules = [
    { id: '1', name: 'Auto-assign critical tickets', trigger: 'Ticket created with priority = Critical', action: 'Assign to on-call engineer', active: true },
    { id: '2', name: 'Escalate overdue tickets', trigger: 'Ticket SLA about to breach', action: 'Notify manager', active: true }
  ]
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Automation Rules</h1>
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">{rule.name}</h3>
              <span className={`px-2 py-1 rounded text-xs ${rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {rule.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Trigger:</strong> {rule.trigger}</div>
              <div><strong>Action:</strong> {rule.action}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
