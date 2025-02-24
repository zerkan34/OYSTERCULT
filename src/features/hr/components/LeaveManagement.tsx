import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  notes?: string;
}

interface ValidationModalProps {
  request: LeaveRequest;
  onClose: () => void;
  onValidate: (id: string, approved: boolean, notes?: string) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (approved: boolean) => void;
  action: 'approve' | 'reject';
}

// Define mock data at the top level
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    type: 'Congés payés',
    startDate: '2025-03-15',
    endDate: '2025-03-22',
    status: 'approved',
    reason: 'Vacances'
  },
  {
    id: '2',
    type: 'Maladie',
    startDate: '2025-02-10',
    endDate: '2025-02-12',
    status: 'approved',
    reason: 'Grippe'
  },
  {
    id: '3',
    type: 'RTT',
    startDate: '2025-04-01',
    endDate: '2025-04-01',
    status: 'pending',
    reason: 'Personnel'
  }
];

function ConfirmationModal({ isOpen, onClose, onConfirm, action }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">
          {action === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le refus'}
        </h3>
        <p className="text-white/70 mb-6">
          {action === 'approve' 
            ? 'Êtes-vous sûr de vouloir approuver cette demande de congé ?'
            : 'Êtes-vous sûr de vouloir refuser cette demande de congé ?'
          }
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(action === 'approve')}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              action === 'approve'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {action === 'approve' ? 'Approuver' : 'Refuser'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ValidationModal({ request, onClose, onValidate }: ValidationModalProps) {
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState<'approve' | 'reject' | null>(null);

  const handleValidate = (approved: boolean) => {
    onValidate(request.id, approved, notes);
    setShowConfirm(null);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 p-6 rounded-lg w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Validation de congé</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/60">Type</div>
                  <div className="text-white font-medium">{request.type}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Période</div>
                  <div className="text-white font-medium">
                    {format(new Date(request.startDate), 'dd/MM/yyyy')} - {format(new Date(request.endDate), 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>
              {request.reason && (
                <div className="mt-4">
                  <div className="text-sm text-white/60">Motif</div>
                  <div className="text-white">{request.reason}</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Notes de validation
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Ajoutez des notes optionnelles..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowConfirm('reject')}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={() => setShowConfirm('approve')}
                className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                Approuver
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm !== null}
        onClose={() => setShowConfirm(null)}
        onConfirm={(approved) => handleValidate(approved)}
        action={showConfirm || 'approve'}
      />
    </>
  );
}

export function LeaveManagement() {
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [showValidationModal, setShowValidationModal] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleValidate = (id: string, approved: boolean, notes?: string) => {
    setRequests(requests.map(request => 
      request.id === id 
        ? { ...request, status: approved ? 'approved' : 'rejected', notes }
        : request
    ));
    setShowValidationModal(null);
  };

  const filteredRequests = requests.filter(request => {
    if (!dateRange.start && !dateRange.end) return true;
    const requestDate = new Date(request.startDate);
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;
    
    if (start && end) {
      return requestDate >= start && requestDate <= end;
    } else if (start) {
      return requestDate >= start;
    } else if (end) {
      return requestDate <= end;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Gestion des Congés</h2>
        <button className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors">
          <Plus size={20} className="mr-2" />
          Nouvelle demande
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-white/60 text-sm">Solde congés payés</div>
          <div className="text-2xl font-bold text-white">15 jours</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-white/60 text-sm">RTT restants</div>
          <div className="text-2xl font-bold text-white">5 jours</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-white/60 text-sm">Congés pris</div>
          <div className="text-2xl font-bold text-white">12 jours</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-white/60 text-sm">Congés à venir</div>
          <div className="text-2xl font-bold text-white">7 jours</div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>
        <button
          onClick={() => setDateRange({ start: '', end: '' })}
          className="px-4 py-2 text-white/60 hover:text-white transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Demandes de congés</h3>
        </div>
        <div className="divide-y divide-white/10">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Calendar size={20} className="text-white/60" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{request.type}</div>
                    <div className="text-sm text-white/60">
                      Du {format(new Date(request.startDate), 'dd/MM/yyyy', { locale: fr })} au{' '}
                      {format(new Date(request.endDate), 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      request.status === 'approved'
                        ? 'bg-green-500/20 text-green-300'
                        : request.status === 'rejected'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {request.status === 'approved'
                      ? 'Approuvé'
                      : request.status === 'rejected'
                      ? 'Refusé'
                      : 'En attente'}
                  </span>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => setShowValidationModal(request.id)}
                      className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                    >
                      Valider
                    </button>
                  )}
                </div>
              </div>
              {request.reason && (
                <div className="mt-2 text-sm text-white/60">
                  Motif : {request.reason}
                </div>
              )}
              {request.notes && (
                <div className="mt-2 text-sm text-white/60">
                  Notes : {request.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de validation */}
      {showValidationModal && (
        <ValidationModal
          request={requests.find(r => r.id === showValidationModal)!}
          onClose={() => setShowValidationModal(null)}
          onValidate={handleValidate}
        />
      )}
    </div>
  );
}