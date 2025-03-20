import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle, SquarePen, X } from 'lucide-react';

interface TableDetailsPageProps {
  table?: {
    name: string;
    id: string;
  };
}

export function TableDetailsPage({ table }: TableDetailsPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 pt-24">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white/90"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Bouzigues</h2>
                <div className="flex items-center">
                  <p className="text-white/60">T-1234</p>
                  <button className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors" title="Modifier le numéro de table">
                    <SquarePen size={14} className="text-white/60" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center text-white/80 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thermometer mr-2 text-brand-burgundy">
                <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
              </svg>
              Température
            </div>
            <div className="text-2xl font-bold text-white">12.5°C</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center text-white/80 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplets mr-2 text-brand-primary">
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
              </svg>
              Salinité
            </div>
            <div className="text-2xl font-bold text-white">35g/L</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center text-white/80 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock mr-2 text-brand-tertiary">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Échantillonnage
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Dernier échantillonnage</span>
              <span className="text-white">19 févr. 2025</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Prochain échantillonnage</span>
              <span className="text-white">26 févr. 2025</span>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Taux de mortalité estimé</span>
                <span className="text-lg font-medium text-yellow-400">2.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center text-white/80 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shell mr-2 text-brand-burgundy">
              <path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44" />
            </svg>
            Lot en cours
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Calibre</span>
              <span className="text-white font-medium">N°3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Quantité</span>
              <span className="text-white font-medium">300 unités</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Récolte prévue</span>
              <span className="text-white font-medium">15 juin 2025</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 mt-6">
          <div className="flex items-center text-white/80 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-spreadsheet mr-2 text-brand-tertiary">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M8 13h2" />
              <path d="M14 13h2" />
              <path d="M8 17h2" />
              <path d="M14 17h2" />
            </svg>
            Importation de données
          </div>
          <div className="space-y-2">
            <p className="text-white/60 text-sm mb-4">
              Importez vos données existantes pour remplir rapidement les tables et suivre leur production.
            </p>
            <a href="#" className="text-brand-tertiary text-sm hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Télécharger un modèle de fichier
            </a>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-tertiary/80 rounded-lg text-white hover:bg-brand-tertiary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              Importer des données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
