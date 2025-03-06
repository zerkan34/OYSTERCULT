<?php

namespace App\Repository\Inventory;

use App\Entity\Inventory\OysterTable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OysterTable>
 */
class OysterTableRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OysterTable::class);
    }

    public function findByStatus(string $status)
    {
        return $this->createQueryBuilder('ot')
            ->where('ot.status = :status')
            ->setParameter('status', $status)
            ->getQuery()
            ->getResult();
    }

    public function findNeedingMaintenance(\DateTime $threshold)
    {
        return $this->createQueryBuilder('ot')
            ->where('ot.lastMaintenanceDate <= :threshold OR ot.lastMaintenanceDate IS NULL')
            ->setParameter('threshold', $threshold)
            ->getQuery()
            ->getResult();
    }

    public function findAvailableTables()
    {
        return $this->createQueryBuilder('ot')
            ->where('ot.status = :status')
            ->andWhere('JSON_LENGTH(ot.cells) < ot.capacity')
            ->setParameter('status', 'active')
            ->getQuery()
            ->getResult();
    }

    public function searchTables(string $query)
    {
        return $this->createQueryBuilder('ot')
            ->where('ot.tableNumber LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->getQuery()
            ->getResult();
    }
}
