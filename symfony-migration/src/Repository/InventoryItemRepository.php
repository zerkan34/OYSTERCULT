<?php

namespace App\Repository;

use App\Entity\InventoryItem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method InventoryItem|null find($id, $lockMode = null, $lockVersion = null)
 * @method InventoryItem|null findOneBy(array $criteria, array $orderBy = null)
 * @method InventoryItem[]    findAll()
 * @method InventoryItem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InventoryItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InventoryItem::class);
    }

    /**
     * Récupère tous les éléments d'inventaire triés par date de création
     *
     * @return InventoryItem[]
     */
    public function findAllSorted()
    {
        return $this->createQueryBuilder('i')
            ->orderBy('i.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les éléments d'inventaire par type (triploid/diploid)
     *
     * @param string $type
     * @return InventoryItem[]
     */
    public function findByType(string $type)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.type = :type')
            ->setParameter('type', $type)
            ->orderBy('i.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Récupère les statistiques d'inventaire par type
     *
     * @return array
     */
    public function getInventoryStats()
    {
        $stats = [
            'total' => 0,
            'triploid' => 0,
            'diploid' => 0,
            'byLocation' => []
        ];
        
        $items = $this->findAll();
        
        foreach ($items as $item) {
            $stats['total'] += $item->getQuantity();
            
            if ($item->getType() === 'triploid') {
                $stats['triploid'] += $item->getQuantity();
            } else {
                $stats['diploid'] += $item->getQuantity();
            }
            
            $location = $item->getLocation() ?: 'Non défini';
            
            if (!isset($stats['byLocation'][$location])) {
                $stats['byLocation'][$location] = 0;
            }
            
            $stats['byLocation'][$location] += $item->getQuantity();
        }
        
        return $stats;
    }

    /**
     * Récupère les statistiques d'inventaire pour le tableau de bord
     * 
     * @return array
     */
    public function getInventoryStatsForDashboard(): array
    {
        // Total d'items par type
        $typeStats = $this->createQueryBuilder('i')
            ->select('i.type, SUM(i.quantity) as total')
            ->groupBy('i.type')
            ->getQuery()
            ->getResult();
        
        // Items les plus récents
        $recentItems = $this->createQueryBuilder('i')
            ->orderBy('i.harvestDate', 'DESC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();
        
        // Items à faible stock (moins de 10)
        $lowStockItems = $this->createQueryBuilder('i')
            ->where('i.quantity < :threshold')
            ->setParameter('threshold', 10)
            ->orderBy('i.quantity', 'ASC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();
        
        return [
            'byType' => $typeStats,
            'recentItems' => $recentItems,
            'lowStockItems' => $lowStockItems
        ];
    }
}
