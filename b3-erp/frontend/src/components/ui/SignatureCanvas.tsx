'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, PenTool, Check } from 'lucide-react';

interface SignatureCanvasProps {
    onSave: (signatureData: string) => void;
    onClear?: () => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSave, onClear }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set high resolution
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            // Check if it's blank? Or just set true
            setHasSignature(true);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        setHasSignature(false);
        if (onClear) onClear();
    };

    const save = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
    };

    return (
        <div className="space-y-4">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden shadow-inner cursor-crosshair h-48 sm:h-64">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full touch-none"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                />
                {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400">
                        <PenTool className="w-5 h-5 mr-2" />
                        Sign Here
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clear} className="flex-1">
                    <Eraser className="w-4 h-4 mr-2" />
                    Clear
                </Button>
                <Button size="sm" onClick={save} disabled={!hasSignature} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Signature
                </Button>
            </div>
        </div>
    );
};
