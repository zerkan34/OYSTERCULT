<?php

namespace App\Tests\Service\Stats;

use App\Entity\Inventory\OysterTable;
use App\Entity\Inventory\PurificationPool;
use App\Repository\Inventory\OysterTableRepository;
use App\Repository\Inventory\PurificationPoolRepository;
use App\Repository\Supplier\SupplierOrderRepository;
use App\Service\Stats\DashboardService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class DashboardServiceTest extends TestCase
{
    private $entityManager;
    private $tableRepository;
    private $poolRepository;
    private $orderRepository;
    private $dashboardService;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->tableRepository = $this->createMock(OysterTableRepository::class);
        $this->poolRepository = $this->createMock(PurificationPoolRepository::class);
        $this->orderRepository = $this->createMock(SupplierOrderRepository::class);

        $this->dashboardService = new DashboardService(
            $this->entityManager,
            $this->tableRepository,
            $this->poolRepository,
            $this->orderRepository
        );
    }

    public function testGetDashboardStats(): void
    {
        // Configuration des mocks
        $this->tableRepository->expects($this->once())
            ->method('count')
            ->willReturn(10);

        $this->tableRepository->expects($this->exactly(2))
            ->method('countByStatus')
            ->willReturnMap([
                ['active', 8],
                ['maintenance', 2]
            ]);

        $this->poolRepository->expects($this->once())
            ->method('count')
            ->willReturn(5);

        $this->poolRepository->expects($this->once())
            ->method('countAvailable')
            ->willReturn(4);

        $this->poolRepository->expects($this->once())
            ->method('countDueMaintenance')
            ->willReturn(1);

        // Exécution du test
        $stats = $this->dashboardService->getDashboardStats('month');

        // Vérifications
        $this->assertIsArray($stats);
        $this->assertArrayHasKey('tables', $stats);
        $this->assertArrayHasKey('pools', $stats);
        $this->assertArrayHasKey('orders', $stats);

        $this->assertEquals(10, $stats['tables']['total']);
        $this->assertEquals(8, $stats['tables']['active']);
        $this->assertEquals(2, $stats['tables']['maintenance']);

        $this->assertEquals(5, $stats['pools']['total']);
        $this->assertEquals(4, $stats['pools']['available']);
        $this->assertEquals(1, $stats['pools']['dueMaintenance']);
    }

    public function testGetTablesOccupancy(): void
    {
        // Création de données de test
        $table1 = new OysterTable();
        $table1->setName('Table 1');
        $table1->setCapacity(1000);
        $table1->setCurrentOccupation(800);

        $table2 = new OysterTable();
        $table2->setName('Table 2');
        $table2->setCapacity(500);
        $table2->setCurrentOccupation(250);

        $this->tableRepository->expects($this->once())
            ->method('findAll')
            ->willReturn([$table1, $table2]);

        // Exécution du test
        $occupancy = $this->dashboardService->getTablesOccupancy();

        // Vérifications
        $this->assertIsArray($occupancy);
        $this->assertCount(2, $occupancy);

        $this->assertEquals('Table 1', $occupancy[0]['name']);
        $this->assertEquals(80, $occupancy[0]['percentage']);

        $this->assertEquals('Table 2', $occupancy[1]['name']);
        $this->assertEquals(50, $occupancy[1]['percentage']);
    }

    public function testGetMaintenanceSchedule(): void
    {
        // Création de données de test
        $table = new OysterTable();
        $table->setName('Table Test');
        $table->setLastMaintenance(new \DateTime('-20 days'));

        $pool = new PurificationPool();
        $pool->setName('Bassin Test');
        $pool->setLastMaintenance(new \DateTime('-35 days'));

        $this->tableRepository->expects($this->once())
            ->method('findAllWithMaintenanceHistory')
            ->willReturn([$table]);

        $this->poolRepository->expects($this->once())
            ->method('findAllWithMaintenanceHistory')
            ->willReturn([$pool]);

        // Exécution du test
        $schedule = $this->dashboardService->getMaintenanceSchedule();

        // Vérifications
        $this->assertIsArray($schedule);
        $this->assertCount(2, $schedule);

        // Vérification de la table
        $this->assertEquals('table', $schedule[0]['type']);
        $this->assertEquals('Table Test', $schedule[0]['name']);
        $this->assertEquals('ok', $schedule[0]['status']);

        // Vérification du bassin
        $this->assertEquals('pool', $schedule[1]['type']);
        $this->assertEquals('Bassin Test', $schedule[1]['name']);
        $this->assertEquals('overdue', $schedule[1]['status']);
    }

    public function testExportStats(): void
    {
        // Test d'export au format Excel
        $exportXlsx = $this->dashboardService->exportStats('dashboard', 'month', 'xlsx');
        
        $this->assertIsArray($exportXlsx);
        $this->assertArrayHasKey('content', $exportXlsx);
        $this->assertArrayHasKey('contentType', $exportXlsx);
        $this->assertArrayHasKey('filename', $exportXlsx);
        $this->assertEquals(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            $exportXlsx['contentType']
        );

        // Test d'export au format CSV
        $exportCsv = $this->dashboardService->exportStats('dashboard', 'month', 'csv');
        
        $this->assertIsArray($exportCsv);
        $this->assertArrayHasKey('content', $exportCsv);
        $this->assertArrayHasKey('contentType', $exportCsv);
        $this->assertArrayHasKey('filename', $exportCsv);
        $this->assertEquals('text/csv', $exportCsv['contentType']);
    }

    public function testInvalidExportType(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->dashboardService->exportStats('invalid', 'month', 'xlsx');
    }

    public function testInvalidExportFormat(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->dashboardService->exportStats('dashboard', 'month', 'invalid');
    }
}
