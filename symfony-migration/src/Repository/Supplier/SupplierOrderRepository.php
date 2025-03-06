<?php

namespace App\Repository\Supplier;

use App\Entity\Supplier\SupplierOrder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SupplierOrder>
 */
class SupplierOrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SupplierOrder::class);
    }

    /**
     * @return SupplierOrder[]
     */
    public function findBySupplierId(string $supplierId): array
    {
        return $this->createQueryBuilder('o')
            ->join('o.supplier', 's')
            ->leftJoin('o.items', 'i')
            ->addSelect('i')
            ->where('s.id = :supplierId')
            ->setParameter('supplierId', $supplierId)
            ->orderBy('o.orderDate', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findOneWithItems(string $id): ?SupplierOrder
    {
        return $this->createQueryBuilder('o')
            ->leftJoin('o.items', 'i')
            ->addSelect('i')
            ->leftJoin('i.product', 'p')
            ->addSelect('p')
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function save(SupplierOrder $order, bool $flush = false): void
    {
        $this->getEntityManager()->persist($order);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(SupplierOrder $order, bool $flush = false): void
    {
        $this->getEntityManager()->remove($order);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
