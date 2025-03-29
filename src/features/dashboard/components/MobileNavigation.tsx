import React, { useState, useEffect, useRef } from 'react';
import { Home, Package, AlertTriangle, AlertOctagon, Droplet } from 'lucide-react';
import './MobileNavigation.css';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isLandscape?: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange,
  isLandscape = false
}) => {
  // État pour le padding du bas
  const [bottomPadding, setBottomPadding] = useState(0);

  // Référence pour la barre de navigation
  const navBarRef = useRef<HTMLDivElement>(null);

  // Fonction pour mettre à jour le padding en fonction de la barre de navigation du navigateur
  const updatePadding = () => {
    // Vérifier si visualViewport est disponible
    if (!window.visualViewport) {
      return;
    }

    // Obtenir les dimensions actuelles
    const viewportHeight = window.visualViewport.height;
    const fullHeight = window.innerHeight;
    const diff = Math.max(0, fullHeight - viewportHeight);

    // Ajouter une marge plus importante pour s'assurer que la barre reste visible
    // Si la barre de navigation du navigateur est présente, ajouter plus de padding
    const paddingValue = diff > 0 ? diff + 25 : 15;
    
    console.log(`Viewport: ${viewportHeight}, Full: ${fullHeight}, Diff: ${diff}, Padding: ${paddingValue}`);
    
    // Mettre à jour l'état seulement si la valeur a changé
    if (paddingValue !== bottomPadding) {
      setBottomPadding(paddingValue);
    }
  };

  // Effet pour gérer le padding en fonction de la barre de navigation du navigateur
  useEffect(() => {
    // Vérifier si visualViewport est disponible
    if (!window.visualViewport) {
      console.warn('VisualViewport API not available');
      return;
    }

    // Ajuster immédiatement au chargement
    updatePadding();

    // Ajouter les écouteurs d'événements
    window.visualViewport.addEventListener("resize", updatePadding);
    window.addEventListener("resize", updatePadding);
    window.addEventListener("scroll", updatePadding);

    // Mettre à jour après un court délai pour s'assurer de la bonne valeur
    const initialTimeouts = [100, 500].map(delay => 
      setTimeout(updatePadding, delay)
    );

    // Mettre à jour lors du changement d'orientation
    const handleOrientationChange = () => {
      setTimeout(updatePadding, 100);
    };
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      // Nettoyer les écouteurs d'événements
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updatePadding);
      }
      window.removeEventListener("resize", updatePadding);
      window.removeEventListener("scroll", updatePadding);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      // Nettoyer les timeouts
      initialTimeouts.forEach(clearTimeout);
    };
  }, []);

  // Classes CSS pour le menu
  const navClasses = [
    'mobile-bottom-nav',
    isLandscape ? 'landscape' : 'portrait'
  ].join(' ');

  // Style pour le padding
  const navStyle = {
    paddingBottom: bottomPadding ? `${bottomPadding}px` : undefined
  };

  return (
    <div 
      className={navClasses}
      ref={navBarRef}
      style={navStyle}
    >
      <button
        className={`mobile-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
        onClick={() => onSectionChange('overview')}
      >
        <Home size={isLandscape ? 18 : 22} />
        <span>Accueil</span>
      </button>
      <button
        className={`mobile-nav-item ${activeSection === 'tables' ? 'active' : ''}`}
        onClick={() => onSectionChange('tables')}
      >
        <Package size={isLandscape ? 18 : 22} />
        <span>Tables</span>
      </button>
      <button
        className={`mobile-nav-item ${activeSection === 'pools' ? 'active' : ''}`}
        onClick={() => onSectionChange('pools')}
      >
        <Droplet size={isLandscape ? 18 : 22} />
        <span>Bassins</span>
      </button>
      <button
        className={`mobile-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
        onClick={() => onSectionChange('notifications')}
      >
        <AlertTriangle size={isLandscape ? 18 : 22} />
        <span>Alertes</span>
      </button>
      <button
        className={`mobile-nav-item emergency ${activeSection === 'emergency' ? 'active' : ''}`}
        onClick={() => onSectionChange('emergency')}
      >
        <AlertOctagon size={isLandscape ? 18 : 22} />
        <span>Urgence</span>
      </button>
    </div>
  );
};
