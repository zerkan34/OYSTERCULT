<?php

namespace App\Controller;

use App\Repository\TableRepository;
use App\Repository\InventoryItemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    private $tableRepository;
    private $inventoryRepository;

    public function __construct(
        TableRepository $tableRepository,
        InventoryItemRepository $inventoryRepository
    ) {
        $this->tableRepository = $tableRepository;
        $this->inventoryRepository = $inventoryRepository;
    }

    /**
     * @Route("/", name="home")
     */
    public function index(): Response
    {
        // Récupérer des statistiques pour le tableau de bord
        $tableCount = $this->tableRepository->count([]);
        $filledCellsCount = $this->tableRepository->countFilledCells();
        $tripoidCount = $this->tableRepository->countByType('Plates'); // Triploïdes
        $diploidCount = $this->tableRepository->countByType('Creuses'); // Diploïdes
        
        $inventoryStats = $this->inventoryRepository->getInventoryStatsForDashboard();
        
        return $this->render('home/index.html.twig', [
            'tableCount' => $tableCount,
            'filledCellsCount' => $filledCellsCount,
            'tripoidCount' => $tripoidCount,
            'diploidCount' => $diploidCount,
            'inventoryStats' => $inventoryStats
        ]);
    }

    /**
     * @Route("/dashboard", name="dashboard")
     */
    public function dashboard(): Response
    {
        // Redirection vers la page d'accueil qui contient déjà le tableau de bord
        return $this->redirectToRoute('home');
    }
}
