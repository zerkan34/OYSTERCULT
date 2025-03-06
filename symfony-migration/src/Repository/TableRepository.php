<?php

namespace App\Repository;

use App\Entity\Table;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Table|null find($id, $lockMode = null, $lockVersion = null)
 * @method Table|null findOneBy(array $criteria, array $orderBy = null)
 * @method Table[]    findAll()
 * @method Table[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TableRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Table::class);
    }

    /**
     * Récupère toutes les tables avec leurs cellules associées
     *
     * @return Table[]
     */
    public function findAllWithCells()
    {
        return $this->createQueryBuilder('t')
            ->leftJoin('t.cells', 'c')
            ->addSelect('c')
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les tables par type (triploid/diploid)
     *
     * @param string $type
     * @return Table[]
     */
    public function findByType(string $type)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.type = :type')
            ->setParameter('type', $type)
            ->leftJoin('t.cells', 'c')
            ->addSelect('c')
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère une table spécifique avec ses cellules
     *
     * @param string $id
     * @return Table|null
     */
    public function findWithCells(string $id)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.id = :id')
            ->setParameter('id', $id)
            ->leftJoin('t.cells', 'c')
            ->addSelect('c')
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Compte le nombre de cellules remplies pour toutes les tables
     * 
     * @return int
     */
    public function countFilledCells(): int
    {
        return $this->createQueryBuilder('t')
            ->select('COUNT(c.id)')
            ->join('t.cells', 'c')
            ->where('c.status = :status')
            ->setParameter('status', 'filled')
            ->getQuery()
            ->getSingleScalarResult();
    }
    
    /**
     * Compte le nombre de tables par type
     * 
     * @param string $type Le type de table (Plates pour Triploïdes, Creuses pour Diploïdes)
     * @return int
     */
    public function countByType(string $type): int
    {
        return $this->createQueryBuilder('t')
            ->select('COUNT(t.id)')
            ->where('t.type = :type')
            ->setParameter('type', $type)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
