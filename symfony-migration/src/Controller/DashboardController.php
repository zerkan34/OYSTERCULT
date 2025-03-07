<?php

namespace App\Controller;

use App\Repository\OrderRepository;
use App\Repository\Inventory\ProductRepository;
use App\Repository\Supplier\SupplierProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_dashboard_index')]
    public function index(
        OrderRepository $orderRepository,
        ProductRepository $productRepository,
        SupplierProductRepository $supplierProductRepository
    ): Response {
        // Statistiques globales
        $stats = [
            'totalProducts' => $productRepository->count([]),
            'monthlySales' => $orderRepository->getMonthlyTotalSales(),
            'lowStockAlerts' => $productRepository->countLowStockProducts(),
        ];

        // Dernières commandes
        $recentOrders = $orderRepository->findRecentOrders(5);

        // Produits en stock faible
        $lowStockProducts = $productRepository->findLowStockProducts(5);

        // Données simulées pour l'occupation des tables
        $tableOccupancyData = [
            [
                'id' => 'T1',
                'name' => 'Table A1',
                'type' => 'Plates N°3',
                'occupation' => 85,
                'value' => 85,
                'harvestDate' => '15/06/25',
                'harvest' => '15/06/25',
                'mortality' => 1.5,
                'color' => '#4CAF50' // vert
            ],
            [
                'id' => 'T2',
                'name' => 'Table A2',
                'type' => 'Creuses N°2',
                'occupation' => 75,
                'value' => 75,
                'harvestDate' => '20/06/25',
                'harvest' => '20/06/25',
                'mortality' => 2.2,
                'color' => '#2196F3' // bleu
            ],
            [
                'id' => 'T3',
                'name' => 'Table B1',
                'type' => 'Plates N°4',
                'occupation' => 90,
                'value' => 90,
                'harvestDate' => '01/07/25',
                'harvest' => '01/07/25',
                'mortality' => 3.1,
                'color' => '#F44336' // rouge
            ],
            [
                'id' => 'T4',
                'name' => 'Table B2',
                'type' => 'Creuses N°3',
                'occupation' => 65,
                'value' => 65,
                'harvestDate' => '05/07/25',
                'harvest' => '05/07/25',
                'mortality' => 1.8,
                'color' => '#FF9800' // orange
            ]
        ];

        // Données simulées pour les bassins
        $poolData = [
            [
                'id' => 'P1',
                'name' => 'Bassin A1',
                'type' => 'Purification',
                'capacity' => 1000,
                'currentLoad' => 800,
                'value' => 80,
                'health' => 'good',
                'lastMaintenance' => '01/03/25',
                'color' => '#4CAF50', // vert
                'waterQuality' => [
                    'quality' => 95,
                    'oxygen' => 92,
                    'temperature' => 12
                ]
            ],
            [
                'id' => 'P2',
                'name' => 'Bassin A2',
                'type' => 'Purification',
                'capacity' => 1000,
                'currentLoad' => 650,
                'value' => 65,
                'health' => 'good',
                'lastMaintenance' => '28/02/25',
                'color' => '#2196F3', // bleu
                'waterQuality' => [
                    'quality' => 90,
                    'oxygen' => 88,
                    'temperature' => 13
                ]
            ],
            [
                'id' => 'P3',
                'name' => 'Bassin B1',
                'type' => 'Stockage',
                'capacity' => 1500,
                'currentLoad' => 1350,
                'value' => 90,
                'health' => 'warning',
                'lastMaintenance' => '15/02/25',
                'color' => '#FF9800', // orange
                'waterQuality' => [
                    'quality' => 75,
                    'oxygen' => 70,
                    'temperature' => 15
                ]
            ]
        ];

        return $this->render('dashboard/index.html.twig', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
            'tableOccupancyData' => $tableOccupancyData,
            'poolData' => $poolData,
        ]);
    }
}
