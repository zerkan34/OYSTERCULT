<?php

namespace App\Repository\Supplier;

use App\Entity\Supplier\Supplier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Supplier>
 */
class SupplierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Supplier::class);
    }

    /**
     * @return Supplier[]
     */
    public function findAllOrdered(): array
    {
        return $this->createQueryBuilder('s')
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Supplier[]
     */
    public function findFriendSuppliers(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.isFriend = :isFriend')
            ->setParameter('isFriend', true)
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneWithProducts(string $id): ?Supplier
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.products', 'p')
            ->addSelect('p')
            ->where('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneWithOrders(string $id): ?Supplier
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.orders', 'o')
            ->addSelect('o')
            ->where('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function save(Supplier $supplier, bool $flush = false): void
    {
        $this->getEntityManager()->persist($supplier);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Supplier $supplier, bool $flush = false): void
    {
        $this->getEntityManager()->remove($supplier);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
