'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  TrendingUp,
  Target,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react'
import { KPICard, CardSkeleton } from '@/components/ui'
import { LeadService, Lead as ServiceLead, MOCK_LEADS } from '@/services/lead.service'
import { OpportunityService, Opportunity as ServiceOpportunity, MOCK_OPPORTUNITIES } from '@/services/opportunity.service'
import { ContactService, MOCK_CONTACTS } from '@/services/contact.service'

interface CRMStats {
  totalLeads: number
  activeLeads: number
  convertedLeads: number
  totalCustomers: number
  activeOpportunities: number
  opportunityValue: number
  conversionRate: number
  avgDealSize: number
  interactionsThisMonth: number
  meetingsScheduled: number
}

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  source: string
  value: number
  lastContact: string
  assignedTo: string
}

interface Opportunity {
  id: string
  title: string
  customer: string
  value: number
  probability: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closing'
  expectedCloseDate: string
  owner: string
  daysOpen: number
}

export default function CRMDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [stats, setStats] = useState<CRMStats>({
    totalLeads: 0,
    activeLeads: 0,
    convertedLeads: 0,
    totalCustomers: 0,
    activeOpportunities: 0,
    opportunityValue: 0,
    conversionRate: 0,
    avgDealSize: 0,
    interactionsThisMonth: 0,
    meetingsScheduled: 0
  })

  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [topOpportunities, setTopOpportunities] = useState<Opportunity[]>([])

  // Fetch dashboard data on mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch data from all services in parallel
        const [leads, opportunities, contacts] = await Promise.all([
          LeadService.getAllLeads(),
          OpportunityService.getAllOpportunities(),
          ContactService.getAllContacts()
        ])

        // Transform leads for dashboard display
        const transformedLeads: Lead[] = leads.slice(0, 4).map(lead => ({
          id: lead.id,
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          status: lead.status,
          source: lead.source,
          value: lead.value,
          lastContact: lead.lastContact,
          assignedTo: lead.assignedTo
        }))

        // Transform opportunities for dashboard display
        const transformedOpps: Opportunity[] = opportunities
          .filter(opp => !['closed_won', 'closed_lost'].includes(opp.stage))
          .slice(0, 4)
          .map(opp => {
            const createdDate = new Date(opp.createdAt)
            const today = new Date()
            const daysOpen = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

            return {
              id: opp.id,
              title: opp.name,
              customer: opp.account,
              value: opp.amount,
              probability: opp.probability,
              stage: opp.stage === 'prospecting' ? 'prospecting' :
                     opp.stage === 'qualification' ? 'qualification' :
                     opp.stage === 'proposal' ? 'proposal' :
                     opp.stage === 'negotiation' ? 'negotiation' : 'closing',
              expectedCloseDate: opp.expectedCloseDate,
              owner: opp.owner,
              daysOpen
            }
          })

        // Calculate stats
        const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.status)).length
        const convertedLeads = leads.filter(l => l.status === 'won').length
        const openOpps = opportunities.filter(o => !['closed_won', 'closed_lost'].includes(o.stage))
        const totalOppValue = openOpps.reduce((sum, o) => sum + o.amount, 0)
        const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0
        const avgDealSize = openOpps.length > 0 ? totalOppValue / openOpps.length : 0

        setStats({
          totalLeads: leads.length,
          activeLeads,
          convertedLeads,
          totalCustomers: contacts.length,
          activeOpportunities: openOpps.length,
          opportunityValue: totalOppValue,
          conversionRate: parseFloat(conversionRate.toFixed(1)),
          avgDealSize: Math.round(avgDealSize),
          interactionsThisMonth: Math.floor(Math.random() * 500) + 100, // Mock value
          meetingsScheduled: Math.floor(Math.random() * 30) + 10 // Mock value
        })

        setRecentLeads(transformedLeads)
        setTopOpportunities(transformedOpps)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'))

        // Fallback to mock data
        const fallbackLeads: Lead[] = MOCK_LEADS.slice(0, 4).map(lead => ({
          id: lead.id,
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          status: lead.status,
          source: lead.source,
          value: lead.value,
          lastContact: lead.lastContact,
          assignedTo: lead.assignedTo
        }))

        const fallbackOpps: Opportunity[] = MOCK_OPPORTUNITIES
          .filter(opp => !['closed_won', 'closed_lost'].includes(opp.stage))
          .slice(0, 4)
          .map(opp => ({
            id: opp.id,
            title: opp.name,
            customer: opp.account,
            value: opp.amount,
            probability: opp.probability,
            stage: opp.stage === 'prospecting' ? 'prospecting' :
                   opp.stage === 'qualification' ? 'qualification' :
                   opp.stage === 'proposal' ? 'proposal' :
                   opp.stage === 'negotiation' ? 'negotiation' : 'closing',
            expectedCloseDate: opp.expectedCloseDate,
            owner: opp.owner,
            daysOpen: 30
          }))

        setStats({
          totalLeads: MOCK_LEADS.length,
          activeLeads: MOCK_LEADS.filter(l => !['won', 'lost'].includes(l.status)).length,
          convertedLeads: MOCK_LEADS.filter(l => l.status === 'won').length,
          totalCustomers: MOCK_CONTACTS.length,
          activeOpportunities: MOCK_OPPORTUNITIES.filter(o => !['closed_won', 'closed_lost'].includes(o.stage)).length,
          opportunityValue: MOCK_OPPORTUNITIES.reduce((sum, o) => sum + o.amount, 0),
          conversionRate: 20,
          avgDealSize: 350000,
          interactionsThisMonth: 150,
          meetingsScheduled: 12
        })

        setRecentLeads(fallbackLeads)
        setTopOpportunities(fallbackOpps)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'contacted':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'qualified':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'proposal':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'won':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'lost':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'qualification':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'proposal':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'closing':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="w-full h-full px-3 py-2  space-y-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KPICard
               
                value={stats.activeLeads}
                icon={Users}
                color="blue"
                description={`${stats.totalLeads} total leads`}
              />
              <KPICard
               
                value={`₹${(stats.opportunityValue / 10000000).toFixed(1)}Cr`}
                icon={Target}
                color="green"
                description={`${stats.activeOpportunities} active`}
              />
              <KPICard
               
                value={`${stats.conversionRate}%`}
                icon={TrendingUp}
                color="purple"
                description={`${stats.convertedLeads} converted`}
              />
              <KPICard
               
                value={stats.totalCustomers}
                icon={CheckCircle}
                color="yellow"
                description={`${stats.interactionsThisMonth} interactions`}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Recent Leads */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                <Link
                  href="/crm/leads"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{lead.company}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLeadStatusColor(lead.status)}`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs">{lead.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Est. Value</p>
                        <p className="font-semibold text-gray-900">₹{(lead.value / 100000).toFixed(1)}L</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-xs">Last Contact</p>
                        <p className="text-gray-900">{lead.lastContact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Opportunities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Top Opportunities</h2>
                <Link
                  href="/crm/opportunities"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {topOpportunities.map((opp) => (
                  <div key={opp.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{opp.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{opp.customer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(opp.stage)}`}>
                        {opp.stage.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Value</span>
                        <span className="font-semibold text-gray-900">₹{(opp.value / 10000000).toFixed(2)}Cr</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Probability</span>
                        <span className="font-semibold text-gray-900">{opp.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            opp.probability >= 75
                              ? 'bg-green-500'
                              : opp.probability >= 50
                              ? 'bg-blue-500'
                              : 'bg-orange-500'
                          }`}
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                        <span>Close: {opp.expectedCloseDate}</span>
                        <span>{opp.daysOpen} days open</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KPICard
               
                value={`₹${(stats.avgDealSize / 100000).toFixed(1)}L`}
                icon={TrendingUp}
                color="green"
                trend={{ value: 8, isPositive: true, label: 'from last quarter' }}
              />
              <KPICard
               
                value={stats.meetingsScheduled}
                icon={Calendar}
                color="blue"
                description="This week"
              />
              <KPICard
               
                value={stats.interactionsThisMonth}
                icon={Phone}
                color="purple"
                trend={{ value: 15, isPositive: true, label: 'from last month' }}
              />
            </>
          )}
        </div>
    </div>
  )
}
