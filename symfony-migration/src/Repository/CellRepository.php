<?php

namespace App\Repository;

use App\Entity\Cell;
use App\Entity\Table;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Cell|null find($id, $lockMode = null, $lockVersion = null)
 * @method Cell|null findOneBy(array $criteria, array $orderBy = null)
 * @method Cell[]    findAll()
 * @method Cell[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CellRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cell::class);
    }

    /**
     * Récupère les cellules d'une table spécifique, triées par numéro de cellule
     * Respecte la règle de tri : gauche à droite, haut en bas
     *
     * @param Table $table
     * @return Cell[]
     */
    public function findByTableOrderedByPosition(Table $table)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.table = :table')
            ->setParameter('table', $table)
            ->orderBy('c.rowIndex', 'ASC')
            ->addOrderBy('c.columnIndex', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Récupère les cellules par statut pour une table donnée
     *
     * @param Table $table
     * @param string $status
     * @return Cell[]
     */
    public function findByTableAndStatus(Table $table, string $status)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.table = :table')
            ->andWhere('c.status = :status')
            ->setParameter('table', $table)
            ->setParameter('status', $status)
            ->orderBy('c.cellNumber', 'ASC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Trouve le numéro de cellule le plus élevé dans une table
     * Utilisé pour la numérotation séquentielle
     *
     * @param Table $table
     * @return int
     */
    public function findMaxCellNumber(Table $table)
    {
        $result = $this->createQueryBuilder('c')
            ->select('MAX(c.cellNumber)')
            ->andWhere('c.table = :table')
            ->setParameter('table', $table)
            ->getQuery()
            ->getSingleScalarResult();
            
        return $result ? (int)$result : 0;
    }
    
    /**
     * Compte le nombre de cellules remplies dans une table
     *
     * @param Table $table
     * @return int
     */
    public function countFilledCells(Table $table)
    {
        return $this->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->andWhere('c.table = :table')
            ->andWhere('c.status = :status')
            ->setParameter('table', $table)
            ->setParameter('status', 'filled')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
