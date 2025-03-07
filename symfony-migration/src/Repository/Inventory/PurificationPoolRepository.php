<?php

namespace App\Repository\Inventory;

use App\Entity\Inventory\PurificationPool;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PurificationPool>
 */
class PurificationPoolRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PurificationPool::class);
    }

    /**
     * @return PurificationPool[]
     */
    public function findAllAvailable(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.status = :status')
            ->setParameter('status', 'available')
            ->orderBy('p.poolNumber', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return PurificationPool[]
     */
    public function findPoolsDueMaintenance(\DateTime $threshold): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.lastMaintenanceDate <= :threshold OR p.lastMaintenanceDate IS NULL')
            ->setParameter('threshold', $threshold)
            ->orderBy('p.lastMaintenanceDate', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return PurificationPool[]
     */
    public function findByUvLampHours(int $threshold): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.uvLampHours >= :threshold')
            ->setParameter('threshold', $threshold)
            ->orderBy('p.uvLampHours', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findOneWithHistory(string $id): ?PurificationPool
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.maintenanceHistory', 'h')
            ->addSelect('h')
            ->where('p.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function save(PurificationPool $pool, bool $flush = false): void
    {
        $this->getEntityManager()->persist($pool);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(PurificationPool $pool, bool $flush = false): void
    {
        $this->getEntityManager()->remove($pool);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
