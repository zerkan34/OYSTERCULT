$file = "src\features\dashboard\components\TableOccupationModal.tsx"
$content = Get-Content -Path $file -Raw

# Nouveau contenu pour la section des boutons
$newButtonSection = @'
        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="flex justify-end space-x-3 p-6 border-t border-white/10"
        >
          {currentView === 'main' && (
            <>
              <button
                onClick={handleHistoryClick}
                className="px-6 py-2.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors flex items-center"
              >
                <Activity size={18} className="mr-2" />
                Historique
              </button>
              <button
                onClick={handleSamplingClick}
                className="px-6 py-2.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors flex items-center"
              >
                <FilePlus size={18} className="mr-2" />
                Échantillonnage
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
              >
                Fermer
              </button>
            </>
          )}
          {currentView !== 'main' && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
            >
              Fermer
            </button>
          )}
        </motion.div>
'@

# Définir un modèle pour la section des boutons à remplacer
$pattern = '(?s)\{/\* Actions \*/\}.*?<motion\.div.*?className="flex justify-end space-x-3 p-6 border-t border-white/10".*?</motion\.div>'

# Remplacer la section des boutons
$newContent = $content -replace $pattern, $newButtonSection

# Écrire dans le fichier
$newContent | Set-Content -Path $file -Force

Write-Output "Modification des boutons terminée"
