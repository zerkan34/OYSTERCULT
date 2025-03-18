import { Table, DashboardStats } from '../models/table.model';

export class DashboardService {
  // Données simulées pour les tables d'huîtres
  // Dans un environnement de production, ces données viendraient d'une base de données
  private tables: Table[] = [
    {
      id: 'A-01',
      name: 'Table A-01',
      location: 'Zone Nord',
      calibre: 'T30',
      occupation: 85,
      mortality: 3,
      harvest: '2026-01-15',
      growthRate: 2.3,
      waterQuality: 97,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2025-03-05')
    },
    {
      id: 'B-02',
      name: 'Table B-02',
      location: 'Zone Est',
      calibre: 'N°3',
      occupation: 92,
      mortality: 1.5,
      harvest: '2025-06-20',
      growthRate: 1.8,
      waterQuality: 95,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-03-01')
    },
    {
      id: 'C-03',
      name: 'Table C-03',
      location: 'Zone Sud',
      calibre: 'N°2',
      occupation: 78,
      mortality: 4.2,
      harvest: '2025-08-10',
      growthRate: 2.1,
      waterQuality: 92,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2025-02-28')
    },
    {
      id: 'D-04',
      name: 'Table D-04',
      location: 'Zone Ouest',
      calibre: 'N°1',
      occupation: 88,
      mortality: 2.8,
      harvest: '2025-04-30',
      growthRate: 2.5,
      waterQuality: 94,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2025-03-02')
    }
  ];

  /**
   * Récupère toutes les tables d'huîtres
   */
  async getAllTables(): Promise<Table[]> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.tables;
  }

  /**
   * Récupère une table spécifique par son ID
   */
  async getTableById(tableId: string): Promise<Table | undefined> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.tables.find(table => table.id === tableId);
  }

  /**
   * Calcule les statistiques globales pour le dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // Simulation d'un délai d'accès à la base de données
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const totalTables = this.tables.length;
    
    // Calcul des moyennes
    const occupationAverage = this.calculateAverage(this.tables.map(t => t.occupation));
    const mortalityAverage = this.calculateAverage(this.tables.map(t => t.mortality));
    const waterQualityAverage = this.calculateAverage(this.tables.map(t => t.waterQuality));
    
    // Calcul des tables prêtes pour la récolte (date de récolte passée)
    const currentDate = new Date();
    const tablesReadyForHarvest = this.tables.filter(
      table => new Date(table.harvest) <= currentDate
    ).length;

    return {
      totalTables,
      occupationAverage,
      mortalityAverage,
      tablesReadyForHarvest,
      waterQualityAverage
    };
  }

  /**
   * Utilitaire pour calculer la moyenne d'un tableau de nombres
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / values.length).toFixed(2));
  }
}
