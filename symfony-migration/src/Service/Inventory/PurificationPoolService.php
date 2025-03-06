<?php

namespace App\Service\Inventory;

use App\Entity\Inventory\PurificationPool;
use App\Repository\Inventory\PurificationPoolRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PurificationPoolService
{
    private $entityManager;
    private $purificationPoolRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        PurificationPoolRepository $purificationPoolRepository
    ) {
        $this->entityManager = $entityManager;
        $this->purificationPoolRepository = $purificationPoolRepository;
    }

    public function createPool(array $data): PurificationPool
    {
        $pool = new PurificationPool();
        $pool->setPoolNumber($data['poolNumber']);
        $pool->setCapacity($data['capacity']);
        if (isset($data['status'])) {
            $pool->setStatus($data['status']);
        }
        if (isset($data['lastMaintenanceDate'])) {
            $pool->setLastMaintenanceDate(new \DateTime($data['lastMaintenanceDate']));
        }
        if (isset($data['waterParameters'])) {
            $pool->setWaterParameters($data['waterParameters']);
        }

        $this->entityManager->persist($pool);
        $this->entityManager->flush();

        return $pool;
    }

    public function updatePool(string $id, array $data): PurificationPool
    {
        $pool = $this->purificationPoolRepository->find($id);
        if (!$pool) {
            throw new NotFoundHttpException('Bassin non trouvé');
        }

        if (isset($data['poolNumber'])) {
            $pool->setPoolNumber($data['poolNumber']);
        }
        if (isset($data['status'])) {
            $pool->setStatus($data['status']);
        }
        if (isset($data['capacity'])) {
            $pool->setCapacity($data['capacity']);
        }
        if (isset($data['currentOccupancy'])) {
            $pool->setCurrentOccupancy($data['currentOccupancy']);
        }
        if (isset($data['waterParameters'])) {
            $pool->updateWaterParameters($data['waterParameters']);
        }

        $this->entityManager->flush();

        return $pool;
    }

    public function performMaintenance(string $poolId, array $maintenanceData): PurificationPool
    {
        $pool = $this->purificationPoolRepository->find($poolId);
        if (!$pool) {
            throw new NotFoundHttpException('Bassin non trouvé');
        }

        $pool->setLastMaintenanceDate(new \DateTime());
        $pool->addMaintenanceRecord($maintenanceData);

        if (isset($maintenanceData['uvLampReplaced']) && $maintenanceData['uvLampReplaced']) {
            $pool->setUvLampHours(0);
        }

        $this->entityManager->flush();

        return $pool;
    }

    public function updateWaterParameters(string $poolId, array $parameters): PurificationPool
    {
        $pool = $this->purificationPoolRepository->find($poolId);
        if (!$pool) {
            throw new NotFoundHttpException('Bassin non trouvé');
        }

        $pool->updateWaterParameters($parameters);
        $this->entityManager->flush();

        return $pool;
    }

    public function incrementUvLampHours(string $poolId, int $hours = 1): PurificationPool
    {
        $pool = $this->purificationPoolRepository->find($poolId);
        if (!$pool) {
            throw new NotFoundHttpException('Bassin non trouvé');
        }

        $pool->setUvLampHours($pool->getUvLampHours() + $hours);
        $this->entityManager->flush();

        return $pool;
    }

    public function getAvailablePools(): array
    {
        return $this->purificationPoolRepository->findAvailablePools();
    }

    public function getPoolsDueMaintenance(\DateTime $threshold): array
    {
        return $this->purificationPoolRepository->findNeedingMaintenance($threshold);
    }

    public function getPoolsByUvLampHours(int $hours): array
    {
        return $this->purificationPoolRepository->findByUvLampHours($hours);
    }

    public function searchPools(string $query): array
    {
        return $this->purificationPoolRepository->searchPools($query);
    }
}
