import React from 'react';
import { Package, TrendingUp, History, Settings, Search, Filter, Download } from 'lucide-react';
import { PurchaseConfiguration } from '../components/PurchaseConfiguration';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export function PurchasesPage() {
  const stats = [
    {
      label: 'Commandes en cours',
      value: '3',
      change: '+2',
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Budget mensuel',
      value: '15 420€',
      change: '-8.1%',
      icon: TrendingUp,
      color: 'text-brand-burgundy',
      bgColor: 'bg-brand-burgundy/10'
    },
    {
      label: 'Commandes du mois',
      value: '24',
      change: '+12',
      icon: History,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6 space-y-8">
      <PageHeader
        title="Achats"
        description="Gérez vos commandes et suivez vos fournisseurs"
      />

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">{stat.label}</p>
                  <div className="flex items-baseline mt-2 space-x-3">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.color}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Contenu principal */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative p-6 space-y-6">
          {/* Barre d'outils */}
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex-1 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Rechercher une commande..."
                  className="pl-10 bg-white/5 border-white/10 focus:border-brand-burgundy"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>

          {/* Contenu des onglets */}
          <Tabs defaultValue="commandes" className="space-y-6">
            <TabsList className="bg-white/5 p-1 rounded-lg">
              <TabsTrigger value="commandes" className="text-sm">
                Commandes en cours
              </TabsTrigger>
              <TabsTrigger value="historique" className="text-sm">
                Historique
              </TabsTrigger>
              <TabsTrigger value="fournisseurs" className="text-sm">
                Fournisseurs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="commandes" className="space-y-4">
              {/* Liste des commandes en cours */}
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-brand-burgundy/20 rounded-lg">
                        <Package className="w-5 h-5 text-brand-burgundy" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-white">Moules de Méditerranée</h3>
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-500 rounded">
                            En attente
                          </span>
                        </div>
                        <p className="text-xs text-white/60 mt-1">CDB • Commande #2024-0123 • Livraison prévue le 28/02/2025</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">450€</p>
                      <p className="text-xs text-white/60">100kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historique" className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Package className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white">Palourdes de l'étang de Thau</h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-500 rounded">
                          Livré
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">CDB • Commande #2024-0122 • Livré le 24/02/2025</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">645€</p>
                    <p className="text-xs text-white/60">50kg</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fournisseurs">
              <PurchaseConfiguration />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
