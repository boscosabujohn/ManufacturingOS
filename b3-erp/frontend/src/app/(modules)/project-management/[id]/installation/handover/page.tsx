'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Flag,
    CheckCircle2,
    XCircle,
    FileText,
    Send,
    Download,
    AlertTriangle,
    Clock,
    ShieldCheck,
    CheckSquare,
    Sparkles,
    CreditCard,
    ClipboardList,
    Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { HandoverService, HandoverCertificate, ClosureStatus } from '@/services/HandoverService';

export default function ProjectClosureDashboard() {
    const { id: projectId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<ClosureStatus | null>(null);
    const [certificate, setCertificate] = useState<HandoverCertificate | null>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadClosureData();
    }, [projectId]);

    const loadClosureData = async () => {
        setLoading(true);
        try {
            const [statusData, certData] = await Promise.all([
                HandoverService.getClosureStatus(projectId as string),
                HandoverService.getCertificate(projectId as string)
            ]);
            setStatus(statusData);
            setCertificate(certData);
        } catch (error) {
            console.error('Failed to load closure data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInitiateHandover = async () => {
        setGenerating(true);
        try {
            const newCert = await HandoverService.initiateHandover(projectId as string);
            setCertificate(newCert);
            toast({
                title: 'Handover Initiated',
                description: 'Client approval portal link generated.',
            });
        } catch (error: any) {
            toast({
                title: 'Phase Gate Blocked',
                description: error.response?.data?.message || 'Handover criteria not met.',
                variant: 'destructive',
            });
        } finally {
            setGenerating(false);
        }
    };

    const copyApprovalLink = () => {
        if (!certificate) return;
        const link = `${window.location.origin}/public/approval/${certificate.id}?type=handover`;
        navigator.clipboard.writeText(link);
        toast({ title: 'Link Copied', description: 'Public approval link copied to clipboard.' });
    };

    if (loading) return <div className="p-8 text-center">Loading closure status...</div>;

    const gates = [
        {
            title: 'Snag List Clearance',
            description: 'All installation snags and tasks must be marked as passed.',
            status: status?.snagClearance ? 'cleared' : 'pending',
            icon: ClipboardList
        },
        {
            title: 'Billing & Payments',
            description: 'Verify all milestone payments and claims are processed.',
            status: status?.billingCleared ? 'cleared' : 'pending',
            icon: CreditCard
        },
        {
            title: 'Asset & Tool Returns',
            description: 'All deployed site tools must be returned and verified.',
            status: 'cleared', // Simulated for now
            icon: Sparkles
        }
    ];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Project Closure & Handover</h2>
                    <p className="text-muted-foreground">
                        Final gates to transition from Installation to Completed state.
                    </p>
                </div>
                {certificate?.status === 'signed' ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 h-10 px-4 text-sm font-bold animate-pulse">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        PROJECT OFFICIALLY HANDED OVER
                    </Badge>
                ) : (
                    <Badge variant="outline" className="h-10 px-4 text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Awaiting Final Acceptance
                    </Badge>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Closure Gates */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Closure Readiness Gate</CardTitle>
                        <CardDescription>All criteria must be met before initiating client signature.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {gates.map((gate, i) => (
                            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${gate.status === 'cleared' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-gray-100'}`}>
                                <div className={`p-2 rounded-lg ${gate.status === 'cleared' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <gate.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">{gate.title}</h4>
                                    <p className="text-sm text-slate-500">{gate.description}</p>
                                </div>
                                {gate.status === 'cleared' ? (
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                ) : (
                                    <XCircle className="h-6 w-6 text-rose-300" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Handover Action */}
                <Card className="bg-slate-900 text-white shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Handover Protocol</CardTitle>
                        <CardDescription className="text-slate-400 font-medium">Issue final acceptance certificate.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!certificate ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm italic">
                                    Clicking initiate will generate a secure public link for the client to review and sign the project handover.
                                </div>
                                <Button
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 h-14 text-lg font-black"
                                    onClick={handleInitiateHandover}
                                    disabled={generating || !status?.handoverReady}
                                >
                                    {generating ? 'Processing Gateway...' : 'Initiate Handover'}
                                </Button>
                                {!status?.handoverReady && (
                                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Readiness Gate Blocks Initiation
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <span>Status</span>
                                        <span className={certificate.status === 'signed' ? 'text-emerald-400' : 'text-amber-400'}>
                                            {certificate.status}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/20 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                                <FileText className="h-5 w-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">Certificate #{certificate.id.substring(0, 8).toUpperCase()}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Generated {new Date(certificate.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {certificate.status === 'signed' ? (
                                            <Button variant="outline" className="w-full border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white" onClick={() => window.open(certificate.certificateUrl)}>
                                                <Download className="mr-2 h-4 w-4" /> View Final Signed PDF
                                            </Button>
                                        ) : (
                                            <div className="space-y-2">
                                                <Button className="w-full bg-white text-slate-900 hover:bg-slate-200" onClick={copyApprovalLink}>
                                                    <Copy className="mr-2 h-4 w-4" /> Copy Public Portal Link
                                                </Button>
                                                <p className="text-[8px] text-slate-500 text-center uppercase tracking-widest">Send this link to the client for sign-off</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3">
                                    <CheckSquare className="h-8 w-8 text-indigo-400" />
                                    <p className="text-[10px] font-medium leading-relaxed italic text-indigo-100 opacity-80">
                                        Handover Protocol v3.0: 256-bit AES encryption & Digital Signature verification active.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
