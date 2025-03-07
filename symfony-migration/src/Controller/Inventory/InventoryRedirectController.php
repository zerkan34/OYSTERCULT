<?php

namespace App\Controller\Inventory;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/inventory-redirect", name="app_inventory_")
 */
class InventoryRedirectController extends AbstractController
{
    /**
     * @Route("/", name="redirect")
     */
    public function index(): Response
    {
        return $this->redirectToRoute('app_inventory_index');
    }
}
