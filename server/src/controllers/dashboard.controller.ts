import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  /**
   * Récupère toutes les tables d'huîtres
   */
  getAllTables = async (req: Request, res: Response): Promise<void> => {
    try {
      const tables = await this.dashboardService.getAllTables();
      res.status(200).json(tables);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tables', error });
    }
  };

  /**
   * Récupère les détails d'une table spécifique par son ID
   */
  getTableById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tableId } = req.params;
      const table = await this.dashboardService.getTableById(tableId);
      
      if (!table) {
        res.status(404).json({ message: 'Table non trouvée' });
        return;
      }

      res.status(200).json(table);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de la table', error });
    }
  };

  /**
   * Récupère les statistiques globales pour le dashboard
   */
  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error });
    }
  };
}
