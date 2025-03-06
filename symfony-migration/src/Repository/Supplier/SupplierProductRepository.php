<?php

namespace App\Repository\Supplier;

use App\Entity\Supplier\SupplierProduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SupplierProduct>
 */
class SupplierProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SupplierProduct::class);
    }

    /**
     * @return SupplierProduct[]
     */
    public function findBySupplierId(string $supplierId): array
    {
        return $this->createQueryBuilder('p')
            ->join('p.supplier', 's')
            ->where('s.id = :supplierId')
            ->setParameter('supplierId', $supplierId)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function save(SupplierProduct $product, bool $flush = false): void
    {
        $this->getEntityManager()->persist($product);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(SupplierProduct $product, bool $flush = false): void
    {
        $this->getEntityManager()->remove($product);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
