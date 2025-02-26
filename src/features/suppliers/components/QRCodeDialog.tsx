import React from 'react';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Supplier } from '@/types/supplier';

interface QRCodeDialogProps {
  supplierId: string;
  onClose: () => void;
}

export function QRCodeDialog({ supplierId, onClose }: QRCodeDialogProps) {
  const { data: supplier } = useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single();

      if (error) throw error;
      return data as Supplier;
    }
  });

  if (!supplier) return null;

  const qrData = JSON.stringify({
    id: supplier.id,
    name: supplier.name,
    friend_code: supplier.friend_code
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">QR Code du fournisseur</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={qrData} size={200} level="H" />
          </div>
          <div className="text-center">
            <p className="font-medium">{supplier.name}</p>
            {supplier.friend_code && (
              <p className="text-sm text-blue-600">Code Ami: {supplier.friend_code}</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Scannez ce QR code pour importer les données du fournisseur
        </div>
      </div>
    </div>
  );
}
