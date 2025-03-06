<?php

namespace App\Service\Stats;

use App\Repository\Inventory\OysterTableRepository;
use App\Repository\Inventory\PurificationPoolRepository;
use App\Repository\Supplier\SupplierOrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\Response;

class DashboardService
{
    private $em;
    private $tableRepository;
    private $poolRepository;
    private $orderRepository;

    public function __construct(
        EntityManagerInterface $em,
        OysterTableRepository $tableRepository,
        PurificationPoolRepository $poolRepository,
        SupplierOrderRepository $orderRepository
    ) {
        $this->em = $em;
        $this->tableRepository = $tableRepository;
        $this->poolRepository = $poolRepository;
        $this->orderRepository = $orderRepository;
    }

    public function getDashboardStats(string $period): array
    {
        $endDate = new \DateTime();
        $startDate = $this->getStartDate($period);

        return [
            'tables' => [
                'total' => $this->tableRepository->count([]),
                'active' => $this->tableRepository->countByStatus('active'),
                'maintenance' => $this->tableRepository->countByStatus('maintenance')
            ],
            'pools' => [
                'total' => $this->poolRepository->count([]),
                'available' => $this->poolRepository->countAvailable(),
                'dueMaintenance' => $this->poolRepository->countDueMaintenance()
            ],
            'orders' => [
                'total' => $this->orderRepository->countByPeriod($startDate, $endDate),
                'pending' => $this->orderRepository->countByStatus('pending'),
                'completed' => $this->orderRepository->countByStatus('completed')
            ],
            'growth' => $this->calculateGrowthStats($startDate, $endDate),
            'revenue' => $this->calculateRevenueStats($startDate, $endDate)
        ];
    }

    public function getTablesOccupancy(): array
    {
        $tables = $this->tableRepository->findAll();
        $occupancyData = [];

        foreach ($tables as $table) {
            $occupancyData[] = [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'capacity' => $table->getCapacity(),
                'current' => $table->getCurrentOccupation(),
                'percentage' => ($table->getCurrentOccupation() / $table->getCapacity()) * 100
            ];
        }

        return $occupancyData;
    }

    public function getGrowthTrends(?string $startDate = null, ?string $endDate = null): array
    {
        $start = $startDate ? new \DateTime($startDate) : new \DateTime('-6 months');
        $end = $endDate ? new \DateTime($endDate) : new \DateTime();

        return $this->tableRepository->getGrowthTrends($start, $end);
    }

    public function getMaintenanceSchedule(): array
    {
        $tables = $this->tableRepository->findAllWithMaintenanceHistory();
        $pools = $this->poolRepository->findAllWithMaintenanceHistory();

        $schedule = [];
        foreach ($tables as $table) {
            $schedule[] = [
                'type' => 'table',
                'id' => $table->getId(),
                'name' => $table->getName(),
                'lastMaintenance' => $table->getLastMaintenance(),
                'nextMaintenance' => $this->calculateNextMaintenance($table->getLastMaintenance()),
                'status' => $this->getMaintenanceStatus($table->getLastMaintenance())
            ];
        }

        foreach ($pools as $pool) {
            $schedule[] = [
                'type' => 'pool',
                'id' => $pool->getId(),
                'name' => $pool->getName(),
                'lastMaintenance' => $pool->getLastMaintenance(),
                'nextMaintenance' => $this->calculateNextMaintenance($pool->getLastMaintenance()),
                'status' => $this->getMaintenanceStatus($pool->getLastMaintenance())
            ];
        }

        return $schedule;
    }

    public function exportStats(string $type, string $period, string $format): array
    {
        $data = match($type) {
            'dashboard' => $this->getDashboardStats($period),
            'occupancy' => $this->getTablesOccupancy(),
            'maintenance' => $this->getMaintenanceSchedule(),
            default => throw new \InvalidArgumentException('Type d\'export invalide')
        };

        return match($format) {
            'xlsx' => $this->exportToExcel($data, $type),
            'csv' => $this->exportToCsv($data, $type),
            default => throw new \InvalidArgumentException('Format d\'export invalide')
        };
    }

    private function getStartDate(string $period): \DateTime
    {
        return match($period) {
            'week' => new \DateTime('-1 week'),
            'month' => new \DateTime('-1 month'),
            'quarter' => new \DateTime('-3 months'),
            'year' => new \DateTime('-1 year'),
            default => throw new \InvalidArgumentException('Période invalide')
        };
    }

    private function calculateGrowthStats(\DateTime $startDate, \DateTime $endDate): array
    {
        $growthData = $this->tableRepository->getGrowthStats($startDate, $endDate);
        
        return [
            'averageGrowth' => $growthData['average'] ?? 0,
            'maxGrowth' => $growthData['max'] ?? 0,
            'minGrowth' => $growthData['min'] ?? 0,
            'trend' => $growthData['trend'] ?? []
        ];
    }

    private function calculateRevenueStats(\DateTime $startDate, \DateTime $endDate): array
    {
        $orders = $this->orderRepository->findByPeriod($startDate, $endDate);
        
        $total = 0;
        $byProduct = [];

        foreach ($orders as $order) {
            $total += $order->getTotal();
            foreach ($order->getItems() as $item) {
                $productId = $item->getProduct()->getId();
                $byProduct[$productId] = ($byProduct[$productId] ?? 0) + $item->getTotal();
            }
        }

        return [
            'total' => $total,
            'byProduct' => $byProduct
        ];
    }

    private function calculateNextMaintenance(?\DateTime $lastMaintenance): \DateTime
    {
        if (!$lastMaintenance) {
            return new \DateTime();
        }

        return (clone $lastMaintenance)->modify('+30 days');
    }

    private function getMaintenanceStatus(?\DateTime $lastMaintenance): string
    {
        if (!$lastMaintenance) {
            return 'overdue';
        }

        $nextMaintenance = $this->calculateNextMaintenance($lastMaintenance);
        $now = new \DateTime();

        if ($nextMaintenance < $now) {
            return 'overdue';
        }

        $diff = $nextMaintenance->diff($now)->days;
        return $diff <= 7 ? 'upcoming' : 'ok';
    }

    private function exportToExcel(array $data, string $type): array
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Configuration des en-têtes selon le type
        match($type) {
            'dashboard' => $this->configureDashboardExport($sheet, $data),
            'occupancy' => $this->configureOccupancyExport($sheet, $data),
            'maintenance' => $this->configureMaintenanceExport($sheet, $data),
            default => throw new \InvalidArgumentException('Type d\'export invalide')
        };

        $writer = new Xlsx($spreadsheet);
        $filename = sprintf('export_%s_%s.xlsx', $type, date('Y-m-d'));
        
        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();

        return [
            'content' => $content,
            'contentType' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'filename' => $filename
        ];
    }

    private function exportToCsv(array $data, string $type): array
    {
        $filename = sprintf('export_%s_%s.csv', $type, date('Y-m-d'));
        $handle = fopen('php://temp', 'r+');

        // Configuration des en-têtes selon le type
        match($type) {
            'dashboard' => $this->writeDashboardCsv($handle, $data),
            'occupancy' => $this->writeOccupancyCsv($handle, $data),
            'maintenance' => $this->writeMaintenanceCsv($handle, $data),
            default => throw new \InvalidArgumentException('Type d\'export invalide')
        };

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return [
            'content' => $content,
            'contentType' => 'text/csv',
            'filename' => $filename
        ];
    }

    private function configureDashboardExport($sheet, array $data): void
    {
        $sheet->setCellValue('A1', 'Statistiques du tableau de bord');
        // Configuration spécifique pour le dashboard...
    }

    private function configureOccupancyExport($sheet, array $data): void
    {
        $sheet->setCellValue('A1', 'Rapport d\'occupation des tables');
        // Configuration spécifique pour l'occupation...
    }

    private function configureMaintenanceExport($sheet, array $data): void
    {
        $sheet->setCellValue('A1', 'Planning de maintenance');
        // Configuration spécifique pour la maintenance...
    }

    private function writeDashboardCsv($handle, array $data): void
    {
        fputcsv($handle, ['Type', 'Valeur']);
        // Écriture spécifique pour le dashboard...
    }

    private function writeOccupancyCsv($handle, array $data): void
    {
        fputcsv($handle, ['Table', 'Capacité', 'Occupation', 'Pourcentage']);
        // Écriture spécifique pour l'occupation...
    }

    private function writeMaintenanceCsv($handle, array $data): void
    {
        fputcsv($handle, ['Type', 'Nom', 'Dernière maintenance', 'Prochaine maintenance', 'Statut']);
        // Écriture spécifique pour la maintenance...
    }
}
