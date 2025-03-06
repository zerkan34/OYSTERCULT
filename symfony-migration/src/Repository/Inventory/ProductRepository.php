<?php

namespace App\Repository\Inventory;

use App\Entity\Inventory\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function findLowStock()
    {
        return $this->createQueryBuilder('p')
            ->where('p.quantity <= p.minimumStock')
            ->andWhere('p.status != :status')
            ->setParameter('status', 'out_of_stock')
            ->getQuery()
            ->getResult();
    }

    public function findByStorageLocation($locationId)
    {
        return $this->createQueryBuilder('p')
            ->where('p.storageLocation = :locationId')
            ->setParameter('locationId', $locationId)
            ->getQuery()
            ->getResult();
    }

    public function findExpiringProducts(\DateTime $before)
    {
        return $this->createQueryBuilder('p')
            ->where('p.expiryDate <= :date')
            ->andWhere('p.expiryDate IS NOT NULL')
            ->setParameter('date', $before)
            ->getQuery()
            ->getResult();
    }

    public function searchProducts(string $query)
    {
        return $this->createQueryBuilder('p')
            ->where('p.name LIKE :query')
            ->orWhere('p.sku LIKE :query')
            ->orWhere('p.category LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->getQuery()
            ->getResult();
    }
}
