import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Star, 
  CheckCircle as CheckBadgeIcon, 
  ChevronRight 
} from 'lucide-react';

interface Producer {
  id: string;
  name: string;
  location: string;
  skills: string[];
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  rating: number;
  certifications: string[];
  isVerified: boolean;
  description: string;
}

const mockProducers: Producer[] = [
  {
    id: '1',
    name: 'Réparation Marine Pro',
    location: 'Bouzigues, France',
    skills: ['Réparateur de Bateau', 'Maintenance'],
    contact: {
      email: 'contact@rmp.fr',
      phone: '05 46 12 34 56',
      website: 'www.rmp.fr'
    },
    rating: 4.8,
    certifications: ['Certification Marine', 'Expert Agréé'],
    isVerified: true,
    description: 'Spécialiste de la réparation et maintenance de bateaux professionnels'
  },
  {
    id: '2',
    name: 'Transport Maritime Express',
    location: 'Marennes, France',
    skills: ['Transport', 'Logistique'],
    contact: {
      email: 'info@tme.fr',
      phone: '05 46 23 45 67'
    },
    rating: 4.5,
    certifications: ['Transport Maritime'],
    isVerified: false,
    description: 'Transport maritime professionnel'
  }
];

interface ProDirectoryProps {
  searchQuery: string;
  selectedSkill: string | null;
}

export function ProDirectory({ searchQuery, selectedSkill }: ProDirectoryProps) {
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);

  const filteredProducers = mockProducers
    .filter(producer =>
      producer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producer.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(producer => 
      !selectedSkill || producer.skills.includes(selectedSkill)
    )
    .sort((a, b) => {
      if (a.isVerified !== b.isVerified) return b.isVerified ? 1 : -1;
      return b.rating - a.rating;
    });

  return (
    <>
      <div className="space-y-2">
        {filteredProducers.map((producer) => (
          <div
            key={producer.id}
            onClick={() => setSelectedProducer(producer)}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-white">{producer.name}</h3>
                  {producer.isVerified && (
                    <span className="text-brand-primary">
                      <CheckBadgeIcon size={20} />
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-1 space-x-4 text-sm text-white/60">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {producer.location}
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="mr-1 text-brand-primary" />
                    {producer.rating}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {producer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight 
                size={20} 
                className="text-white/20 group-hover:text-white/60 transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedProducer && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProducer(null)}
          title={selectedProducer.name}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Informations</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-white/70">
                    <MapPin size={20} className="mr-3" />
                    {selectedProducer.location}
                  </div>
                  <div className="flex items-center text-white/70">
                    <Mail size={20} className="mr-3" />
                    {selectedProducer.contact.email}
                  </div>
                  <div className="flex items-center text-white/70">
                    <Phone size={20} className="mr-3" />
                    {selectedProducer.contact.phone}
                  </div>
                  {selectedProducer.contact.website && (
                    <div className="flex items-center text-white/70">
                      <Globe size={20} className="mr-3" />
                      {selectedProducer.contact.website}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Certifications</h3>
                <div className="space-y-2">
                  {selectedProducer.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-2 bg-brand-primary/20 text-brand-primary rounded-lg"
                    >
                      <CheckBadgeIcon size={16} className="mr-2" />
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">À propos</h3>
              <p className="text-white/70">{selectedProducer.description}</p>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                onClick={() => setSelectedProducer(null)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Fermer
              </button>
              <button
                className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
              >
                Contacter
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}