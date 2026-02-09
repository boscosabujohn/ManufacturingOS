'use client';

import { useState, useEffect } from 'react';
import {
    User,
    Clock,
    FileText,
    Calendar,
    Download,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    Shield,
    CreditCard,
    CheckCircle2,
    Clock3,
    XCircle,
    Loader2
} from 'lucide-react';
import { EmployeeService, Employee } from '@/services/employee.service';
import { AttendanceService, Attendance } from '@/services/attendance.service';
import { PayrollService, SalarySlip } from '@/services/payroll.service';

export default function SelfServicePortal() {
    const [activeTab, setActiveTab] = useState<'summary' | 'attendance' | 'salary' | 'leave'>('summary');
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [slips, setSlips] = useState<SalarySlip[]>([]);
    const [loading, setLoading] = useState(true);

    // Set current user as Rajesh Kumar for demo
    const CURRENT_USER_ID = 'emp-001';

    useEffect(() => {
        const loadPortalData = async () => {
            try {
                setLoading(true);
                const [empData, attData, slipData] = await Promise.all([
                    EmployeeService.getEmployeeById(CURRENT_USER_ID),
                    AttendanceService.getAttendance({ employeeId: CURRENT_USER_ID, limit: 10 }),
                    PayrollService.getEmployeeSalarySlips(CURRENT_USER_ID)
                ]);
                setEmployee(empData);
                setAttendance(attData);
                setSlips(slipData);
            } catch (err) {
                console.error('Error loading self-service data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadPortalData();
    }, []);

    if (loading || !employee) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
                        <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl border-4 border-white shadow-xl">
                            <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center">
                                <User size={48} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-6 px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{employee.firstName} {employee.lastName}</h1>
                            <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                <Shield size={16} /> {employee.designation} • {employee.departmentName}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit border border-gray-200">
                    {(['summary', 'attendance', 'salary', 'leave'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === tab
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tab.charAt(0) + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === 'summary' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <User size={20} className="text-blue-500" /> Personal Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                <Mail size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email Address</p>
                                                <p className="text-gray-700 font-medium">{employee.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phone Number</p>
                                                <p className="text-gray-700 font-medium">{employee.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Work Location</p>
                                                <p className="text-gray-700 font-medium">{employee.city}, {employee.country}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Employee ID</p>
                                                <p className="text-gray-700 font-medium">{employee.employeeCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock size={20} className="text-indigo-500" /> Recent Activity
                                    </h2>
                                    <div className="space-y-4">
                                        {attendance.slice(0, 3).map((record) => (
                                            <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${record.status === 'PRESENT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-700">{new Date(record.date).toLocaleDateString()}</p>
                                                        <p className="text-xs text-gray-400">Checked in at {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'attendance' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">Attendance Log</h2>
                                    <button className="text-blue-600 font-medium text-sm">View Full History</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">In</th>
                                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Out</th>
                                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {attendance.map((record) => (
                                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-gray-500">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                                    <td className="px-6 py-4 text-gray-500">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {record.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'salary' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900">Payslips</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {slips.map((slip) => (
                                        <div key={slip.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Salary Slip - {slip.month}/{slip.year}</p>
                                                    <p className="text-sm text-gray-500">Net Pay: ₹{slip.netSalary.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-2 font-medium">
                                                <Download size={18} /> <span className="hidden md:inline">Download</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'leave' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Leave Management</h2>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                        Apply for Leave
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                        <p className="text-blue-600 text-sm font-bold mb-1">Casual Leave</p>
                                        <p className="text-2xl font-black text-blue-900">8 / 12</p>
                                        <p className="text-xs text-blue-400 mt-1">Days Remaining</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <p className="text-emerald-600 text-sm font-bold mb-1">Sick Leave</p>
                                        <p className="text-2xl font-black text-emerald-900">5 / 7</p>
                                        <p className="text-xs text-emerald-400 mt-1">Days Remaining</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                                        <p className="text-purple-600 text-sm font-bold mb-1">Earned Leave</p>
                                        <p className="text-2xl font-black text-purple-900">12 / 20</p>
                                        <p className="text-xs text-purple-400 mt-1">Days Remaining</p>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-4">Upcoming Requests</h3>
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-400">No active leave requests</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Compliance Rate</p>
                                        <p className="text-lg font-bold text-gray-900">98%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <Clock3 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Avg Working Hours</p>
                                        <p className="text-lg font-bold text-gray-900">8.4h / day</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Next Holiday</p>
                                        <p className="text-lg font-bold text-gray-900">Feb 14, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-md p-6 text-white">
                            <h3 className="font-bold mb-2">Need Help?</h3>
                            <p className="text-indigo-100 text-sm mb-4">Contact HR if you face issues with biometric sync or payroll.</p>
                            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                Support Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
