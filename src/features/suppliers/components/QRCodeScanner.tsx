import React, { useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';

interface QRCodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (data: any) => void;
}

export function QRCodeScanner({ open, onClose, onScan }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = React.useState<string>('');

  useEffect(() => {
    if (!open || !videoRef.current) return;

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Impossible d\'accéder à la caméra');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [open]);

  const handleScan = async () => {
    if (!videoRef.current) return;

    try {
      // Créer un canvas pour capturer l'image
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) return;

      // Dessiner l'image de la vidéo sur le canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Envoyer l'image au serveur pour analyse (à implémenter)
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Simuler un scan réussi pour le moment
      onScan({
        type: 'delivery',
        data: {
          orderId: 'TEST-123',
          date: new Date().toISOString()
        }
      });
      onClose();
    } catch (err) {
      setError('Erreur lors du scan');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[rgb(var(--color-background)_/_0.8)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[rgb(var(--color-brand-surface))] p-6 rounded-xl border border-[rgb(var(--color-border)_/_var(--color-border-opacity))] w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            <h2 className="text-xl font-bold">Scanner QR Code</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgb(var(--color-brand-muted))] rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-2 border-[rgb(var(--color-brand-primary))] rounded-lg" />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleScan}
            className="w-full py-2 px-4 bg-[rgb(var(--color-brand-primary))] text-white rounded-lg hover:opacity-90"
          >
            Scanner
          </button>

          <div className="text-center text-sm text-[rgb(var(--color-text-secondary)_/_var(--color-text-opacity-secondary))]">
            Placez le QR code de livraison dans le cadre et cliquez sur Scanner
          </div>
        </div>
      </div>
    </div>
  );
}
