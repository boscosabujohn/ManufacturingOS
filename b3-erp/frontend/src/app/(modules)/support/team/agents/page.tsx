'use client'
export default function TeamAgents() {
  const agents = [
    { id: '1', name: 'Rajesh Kumar', role: 'Senior Support Engineer', activeTickets: 12, resolvedToday: 5, satisfaction: 4.8 },
    { id: '2', name: 'Priya Sharma', role: 'Support Specialist', activeTickets: 8, resolvedToday: 7, satisfaction: 4.9 }
  ]
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Team Agents</h1>
      <div className="grid gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{agent.name}</h3>
                <p className="text-sm text-gray-600">{agent.role}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{agent.activeTickets}</div>
                <div className="text-sm text-gray-600">Active Tickets</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
