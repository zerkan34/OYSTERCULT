<?php

namespace App\Controller\Stats;

use App\Service\Stats\DashboardService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/stats')]
class DashboardController extends AbstractController
{
    private $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    #[Route('/dashboard', name: 'api_stats_dashboard', methods: ['GET'])]
    public function getDashboardStats(Request $request): JsonResponse
    {
        $period = $request->query->get('period', 'month');
        $stats = $this->dashboardService->getDashboardStats($period);

        return $this->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    #[Route('/tables/occupancy', name: 'api_stats_tables_occupancy', methods: ['GET'])]
    public function getTablesOccupancy(): JsonResponse
    {
        $occupancy = $this->dashboardService->getTablesOccupancy();

        return $this->json([
            'success' => true,
            'data' => $occupancy
        ]);
    }

    #[Route('/growth/trends', name: 'api_stats_growth_trends', methods: ['GET'])]
    public function getGrowthTrends(Request $request): JsonResponse
    {
        $startDate = $request->query->get('startDate');
        $endDate = $request->query->get('endDate');
        
        $trends = $this->dashboardService->getGrowthTrends($startDate, $endDate);

        return $this->json([
            'success' => true,
            'data' => $trends
        ]);
    }

    #[Route('/maintenance/schedule', name: 'api_stats_maintenance_schedule', methods: ['GET'])]
    public function getMaintenanceSchedule(): JsonResponse
    {
        $schedule = $this->dashboardService->getMaintenanceSchedule();

        return $this->json([
            'success' => true,
            'data' => $schedule
        ]);
    }

    #[Route('/export/{type}', name: 'api_stats_export', methods: ['GET'])]
    public function exportStats(string $type, Request $request): Response
    {
        $period = $request->query->get('period', 'month');
        $format = $request->query->get('format', 'xlsx');

        $exportData = $this->dashboardService->exportStats($type, $period, $format);

        $response = new Response($exportData['content']);
        $response->headers->set('Content-Type', $exportData['contentType']);
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $exportData['filename'] . '"');

        return $response;
    }

    #[Route('/', name: 'app_dashboard')]
    public function index(): Response
    {
        // Données pour l'occupation des tables
        $tableOccupancyData = [
            [
                'name' => 'Table A1',
                'value' => 85,
                'color' => '#22c55e',
                'type' => 'Plates N°3',
                'harvest' => '15/06/25',
                'mortality' => 2.1
            ],
            [
                'name' => 'Table A2',
                'value' => 75,
                'color' => '#eab308',
                'type' => 'Creuses N°2',
                'harvest' => '20/06/25',
                'mortality' => 2.8
            ],
            [
                'name' => 'Table B1',
                'value' => 90,
                'color' => '#22c55e',
                'type' => 'Plates N°4',
                'harvest' => '01/07/25',
                'mortality' => 1.9
            ],
            [
                'name' => 'Table B2',
                'value' => 65,
                'color' => '#ef4444',
                'type' => 'Creuses N°3',
                'harvest' => '05/07/25',
                'mortality' => 3.2
            ]
        ];

        // Données pour les bassins
        $poolData = [
            [
                'name' => 'Bassin A1',
                'value' => 80,
                'color' => '#22c55e',
                'type' => 'Purification',
                'capacity' => 1000,
                'currentLoad' => 800,
                'waterQuality' => [
                    'quality' => 98,
                    'oxygen' => 95,
                    'temperature' => 12.5
                ]
            ],
            [
                'name' => 'Bassin A2',
                'value' => 65,
                'color' => '#eab308',
                'type' => 'Purification',
                'capacity' => 1000,
                'currentLoad' => 650,
                'waterQuality' => [
                    'quality' => 92,
                    'oxygen' => 88,
                    'temperature' => 13.2
                ]
            ],
            [
                'name' => 'Bassin B1',
                'value' => 90,
                'color' => '#22c55e',
                'type' => 'Stockage',
                'capacity' => 1500,
                'currentLoad' => 1350,
                'waterQuality' => [
                    'quality' => 96,
                    'oxygen' => 92,
                    'temperature' => 12.8
                ]
            ]
        ];

        return $this->render('dashboard/index.html.twig', [
            'tableOccupancyData' => $tableOccupancyData,
            'poolData' => $poolData
        ]);
    }
}
