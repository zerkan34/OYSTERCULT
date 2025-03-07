<?php

namespace App\Controller;

use App\Entity\Supplier;
use App\Entity\SupplierProduct;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_dashboard')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $suppliers = $entityManager->getRepository(Supplier::class)->findAll();
        $products = $entityManager->getRepository(SupplierProduct::class)->findAll();

        return $this->render('dashboard/index.html.twig', [
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }
}
