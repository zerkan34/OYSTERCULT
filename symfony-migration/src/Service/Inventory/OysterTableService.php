<?php

namespace App\Service\Inventory;

use App\Entity\Inventory\OysterTable;
use App\Repository\Inventory\OysterTableRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class OysterTableService
{
    private $entityManager;
    private $oysterTableRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        OysterTableRepository $oysterTableRepository
    ) {
        $this->entityManager = $entityManager;
        $this->oysterTableRepository = $oysterTableRepository;
    }

    public function createTable(array $data): OysterTable
    {
        $table = new OysterTable();
        $table->setTableNumber($data['tableNumber']);
        $table->setCapacity($data['capacity']);
        if (isset($data['status'])) {
            $table->setStatus($data['status']);
        }
        if (isset($data['lastMaintenanceDate'])) {
            $table->setLastMaintenanceDate(new \DateTime($data['lastMaintenanceDate']));
        }
        if (isset($data['metadata'])) {
            $table->setMetadata($data['metadata']);
        }

        $this->entityManager->persist($table);
        $this->entityManager->flush();

        return $table;
    }

    public function updateTable(string $id, array $data): OysterTable
    {
        $table = $this->oysterTableRepository->find($id);
        if (!$table) {
            throw new NotFoundHttpException('Table non trouvée');
        }

        if (isset($data['tableNumber'])) {
            $table->setTableNumber($data['tableNumber']);
        }
        if (isset($data['status'])) {
            $table->setStatus($data['status']);
        }
        if (isset($data['lastMaintenanceDate'])) {
            $table->setLastMaintenanceDate(new \DateTime($data['lastMaintenanceDate']));
        }
        if (isset($data['capacity'])) {
            $table->setCapacity($data['capacity']);
        }
        if (isset($data['metadata'])) {
            $table->setMetadata($data['metadata']);
        }

        $this->entityManager->flush();

        return $table;
    }

    public function updateCell(string $tableId, string $cellId, array $data): OysterTable
    {
        $table = $this->oysterTableRepository->find($tableId);
        if (!$table) {
            throw new NotFoundHttpException('Table non trouvée');
        }

        $table->updateCell($cellId, $data);
        $this->entityManager->flush();

        return $table;
    }

    public function removeCell(string $tableId, string $cellId): OysterTable
    {
        $table = $this->oysterTableRepository->find($tableId);
        if (!$table) {
            throw new NotFoundHttpException('Table non trouvée');
        }

        $table->removeCell($cellId);
        $this->entityManager->flush();

        return $table;
    }

    public function performMaintenance(string $tableId, array $maintenanceData): OysterTable
    {
        $table = $this->oysterTableRepository->find($tableId);
        if (!$table) {
            throw new NotFoundHttpException('Table non trouvée');
        }

        $table->setLastMaintenanceDate(new \DateTime());
        
        $metadata = $table->getMetadata() ?? [];
        $metadata['maintenanceHistory'] = $metadata['maintenanceHistory'] ?? [];
        $metadata['maintenanceHistory'][] = array_merge(
            $maintenanceData,
            ['date' => (new \DateTime())->format('Y-m-d H:i:s')]
        );
        $table->setMetadata($metadata);

        $this->entityManager->flush();

        return $table;
    }

    public function getAvailableTables(): array
    {
        return $this->oysterTableRepository->findAvailableTables();
    }

    public function getTablesDueMaintenance(\DateTime $threshold): array
    {
        return $this->oysterTableRepository->findNeedingMaintenance($threshold);
    }

    public function searchTables(string $query): array
    {
        return $this->oysterTableRepository->searchTables($query);
    }
}
