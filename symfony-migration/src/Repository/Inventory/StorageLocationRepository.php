<?php

namespace App\Repository\Inventory;

use App\Entity\Inventory\StorageLocation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StorageLocation>
 */
class StorageLocationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StorageLocation::class);
    }

    public function findByType(string $type)
    {
        return $this->createQueryBuilder('sl')
            ->where('sl.type = :type')
            ->setParameter('type', $type)
            ->getQuery()
            ->getResult();
    }

    public function findAvailableLocations()
    {
        return $this->createQueryBuilder('sl')
            ->leftJoin('sl.products', 'p')
            ->groupBy('sl.id')
            ->having('COUNT(p.id) < sl.capacity')
            ->getQuery()
            ->getResult();
    }

    public function searchLocations(string $query)
    {
        return $this->createQueryBuilder('sl')
            ->where('sl.name LIKE :query')
            ->orWhere('sl.type LIKE :query')
            ->orWhere('sl.description LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->getQuery()
            ->getResult();
    }
}
