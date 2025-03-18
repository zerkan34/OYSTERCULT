// Composant de jauge pour afficher la progression du calibre
const CalibreGauge = ({ currentSize, targetSize, progress }: { currentSize: string, targetSize: string, progress: number }) => {
  // Déterminer les différentes étapes du calibre (on s'assure de commencer par T15)
  const calibreSteps = ['T15', 'N°5', 'N°4', 'N°3', 'N°2', 'N°1'];
  const currentIndex = calibreSteps.indexOf(currentSize);
  const targetIndex = calibreSteps.indexOf(targetSize);
  
  // Calculer le pourcentage de progression
  const calibreProgress = (currentIndex !== -1 && targetIndex !== -1) 
    ? Math.round((currentIndex / targetIndex) * 100)
    : 0;
  
  // Couleur basée sur la progression temporelle
  const getColor = () => {
    if (progress > 100) return "#ef4444"; // Rouge si dépassé
    if (progress >= 90) return "#eab308"; // Jaune si proche
    return "#22c55e"; // Vert sinon
  };
  
  // On s'assure que l'affichage commence par T15
  const calibreDisplaySteps = calibreSteps.slice(0, targetIndex + 1);
  
  return (
    <div className="mt-4 mb-6">
      <div className="flex justify-between mb-2">
        <div className="text-white font-medium">T15</div>
        <div className="text-white font-medium">{targetSize}</div>
      </div>
      
      <div className="relative bg-white/10 h-10 w-full rounded-lg overflow-hidden">
        {/* Divisions pour chaque niveau de calibre */}
        <div className="absolute inset-0 flex">
          {calibreDisplaySteps.map((step, index) => (
            <div 
              key={index} 
              className="flex-1 border-r border-white/20 last:border-r-0 relative"
              style={{ 
                backgroundColor: index <= currentIndex ? getColor() : 'transparent'
              }}
            >
              <div className="absolute bottom-0 w-full text-center text-xs text-white/60 pb-1">
                {step}
              </div>
            </div>
          ))}
        </div>
        
        {/* Barre de progression du calibre */}
        <motion.div 
          initial={{ transform: "scaleX(0)" }}
          animate={{ transform: `scaleX(${calibreProgress / 100})` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full origin-left"
          style={{ backgroundColor: getColor() }}
        />
      </div>
      
      {/* Progression temporelle */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white/60">Progression temporelle</span>
          <span className={progress > 100 ? 'text-red-400' : 'text-white'}>
            {progress}%
          </span>
        </div>
        <div className="relative">
          <ProgressBar 
            value={progress} 
            color={getColor()}
          />
          {/* Indicateur de position actuelle */}
          <motion.div 
            initial={{ left: "0%" }}
            animate={{ left: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 h-4 w-2 bg-white z-10"
            style={{ transform: "translateX(-50%)" }}
          />
        </div>
      </div>
    </div>
  );
};
