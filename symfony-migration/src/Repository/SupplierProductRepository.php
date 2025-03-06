<?php

namespace App\Repository;

use App\Entity\SupplierProduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SupplierProduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method SupplierProduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method SupplierProduct[]    findAll()
 * @method SupplierProduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SupplierProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SupplierProduct::class);
    }

    /**
     * Récupère les produits par type (triploid/diploid)
     *
     * @param string $type
     * @return SupplierProduct[]
     */
    public function findByType(string $type)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.type = :type')
            ->setParameter('type', $type)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Récupère les produits disponibles
     *
     * @return SupplierProduct[]
     */
    public function findAvailable()
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.available = :available')
            ->setParameter('available', true)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Récupère les produits par fournisseur
     *
     * @param string $supplierId
     * @return SupplierProduct[]
     */
    public function findBySupplier(string $supplierId)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.supplier = :supplierId')
            ->setParameter('supplierId', $supplierId)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Recherche des produits par terme de recherche
     *
     * @param string $term
     * @return SupplierProduct[]
     */
    public function searchByTerm(string $term)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.supplier', 's')
            ->addSelect('s')
            ->andWhere('p.name LIKE :term OR p.description LIKE :term OR s.name LIKE :term')
            ->setParameter('term', '%' . $term . '%')
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
