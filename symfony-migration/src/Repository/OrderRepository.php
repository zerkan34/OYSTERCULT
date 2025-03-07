<?php

namespace App\Repository;

use App\Entity\Order;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Order>
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function getMonthlyTotalSales(): float
    {
        $firstDayOfMonth = new \DateTime('first day of this month');
        $lastDayOfMonth = new \DateTime('last day of this month');

        $qb = $this->createQueryBuilder('o')
            ->select('SUM(o.totalAmount)')
            ->where('o.orderDate BETWEEN :start AND :end')
            ->andWhere('o.status = :status')
            ->setParameter('start', $firstDayOfMonth)
            ->setParameter('end', $lastDayOfMonth)
            ->setParameter('status', 'completed');

        $result = $qb->getQuery()->getSingleScalarResult();
        return $result ?? 0.0;
    }

    public function findRecentOrders(int $limit = 5): array
    {
        return $this->createQueryBuilder('o')
            ->orderBy('o.orderDate', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
