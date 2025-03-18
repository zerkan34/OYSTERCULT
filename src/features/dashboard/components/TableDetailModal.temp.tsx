                {/* Informations supplémentaires */}
                <div className="flex items-center justify-between text-sm mt-4">
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Récolte</div>
                    <div className="text-white font-medium">
                      {table.harvest !== 'N/A' ? table.harvest : '-'}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Début</div>
                    <div className="text-white font-medium">
                      {table.startDate !== 'N/A' ? table.startDate : '-'}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Calibre cible</div>
                    <div className="text-white font-medium">{table.targetSize}</div>
                  </div>
                  <ChevronRight size={16} className="text-white/40" />
                  <div className="glass-effect rounded-lg px-3 py-2">
                    <div className="text-white/60">Calibre actuel</div>
                    <div className="text-white font-medium">{table.currentSize}</div>
                  </div>
                </div>
