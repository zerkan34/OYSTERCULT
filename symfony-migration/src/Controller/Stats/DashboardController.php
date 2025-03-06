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
}
