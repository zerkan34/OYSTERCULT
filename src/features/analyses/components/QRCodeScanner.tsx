import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRCodeScannerProps {
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export function QRCodeScanner({ onClose, onScanSuccess }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      result => {
        onScanSuccess(result.data);
        onClose();
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scannerRef.current = scanner;
    scanner.start().catch(err => {
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      console.error(err);
    });

    return () => {
      scanner.destroy();
    };
  }, [onScanSuccess, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-xl p-6 w-full max-w-md relative backdrop-blur-sm border border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">Scanner un QR Code</h2>

        <div className="relative">
          {error ? (
            <div className="p-4 bg-red-500/20 text-red-400 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full aspect-square rounded-lg bg-black"
              />
              <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-lg pointer-events-none">
                <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-lg animate-pulse" />
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-sm text-white/60 text-center">
          Placez le QR code dans le cadre pour le scanner automatiquement
        </p>
      </motion.div>
    </div>
  );
}
