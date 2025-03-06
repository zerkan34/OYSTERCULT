<?php

namespace App\Repository;

use App\Entity\Supplier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Supplier|null find($id, $lockMode = null, $lockVersion = null)
 * @method Supplier|null findOneBy(array $criteria, array $orderBy = null)
 * @method Supplier[]    findAll()
 * @method Supplier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SupplierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Supplier::class);
    }

    /**
     * Récupère tous les fournisseurs triés par ordre alphabétique
     *
     * @return Supplier[]
     */
    public function findAllSorted()
    {
        return $this->createQueryBuilder('s')
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Récupère les fournisseurs avec leurs produits
     *
     * @return Supplier[]
     */
    public function findAllWithProducts()
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.products', 'p')
            ->addSelect('p')
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Récupère un fournisseur avec ses produits
     *
     * @param string $id
     * @return Supplier|null
     */
    public function findWithProducts(string $id)
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.products', 'p')
            ->addSelect('p')
            ->andWhere('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
    
    /**
     * Recherche des fournisseurs par terme de recherche
     *
     * @param string $term
     * @return Supplier[]
     */
    public function searchByTerm(string $term)
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.products', 'p')
            ->addSelect('p')
            ->andWhere('s.name LIKE :term OR s.contact LIKE :term OR s.email LIKE :term')
            ->setParameter('term', '%' . $term . '%')
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
