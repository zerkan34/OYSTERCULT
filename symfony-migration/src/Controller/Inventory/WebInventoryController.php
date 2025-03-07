<?php

namespace App\Controller\Inventory;

use App\Entity\Inventory\Product;
use App\Service\Inventory\InventoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/inventory", name="app_inventory_")
 */
class WebInventoryController extends AbstractController
{
    private $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * @Route("/", name="index")
     */
    public function index(): Response
    {
        $products = $this->inventoryService->getAllProducts();
        return $this->render('inventory/index.html.twig', [
            'products' => $products,
            'inventory_items' => $products,
            'current_page' => 1,
            'total_pages' => 1
        ]);
    }

    /**
     * @Route("/new", name="new")
     */
    public function new(Request $request): Response
    {
        $product = new Product();
        $form = $this->createForm(\App\Form\ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->inventoryService->saveProduct($product);
            $this->addFlash('success', 'Produit ajouté avec succès');
            return $this->redirectToRoute('app_inventory_index');
        }

        return $this->render('inventory/new.html.twig', [
            'form' => $form->createView(),
            'product' => $product
        ]);
    }
    
    /**
     * @Route("/{id}", name="show", requirements={"id"="\d+"})
     */
    public function show(int $id): Response
    {
        $product = $this->inventoryService->getProductById($id);
        
        return $this->render('inventory/show.html.twig', [
            'product' => $product
        ]);
    }
    
    /**
     * @Route("/{id}/edit", name="edit", requirements={"id"="\d+"})
     */
    public function edit(int $id, Request $request): Response
    {
        $product = $this->inventoryService->getProductById($id);
        $form = $this->createForm(\App\Form\ProductType::class, $product);
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $this->inventoryService->saveProduct($product);
            $this->addFlash('success', 'Produit modifié avec succès');
            return $this->redirectToRoute('app_inventory_show', ['id' => $product->getId()]);
        }
        
        return $this->render('inventory/edit.html.twig', [
            'form' => $form->createView(),
            'product' => $product
        ]);
    }
    
    /**
     * @Route("/export", name="export")
     */
    public function export(): Response
    {
        $products = $this->inventoryService->getAllProducts();
        
        // Logique d'export (CSV, Excel, etc.)
        // Pour l'instant, on redirige simplement vers la liste
        $this->addFlash('info', 'Fonctionnalité d\'export en cours de développement');
        return $this->redirectToRoute('app_inventory_index');
    }
    
    /**
     * @Route("/{id}/transfer", name="transfer", requirements={"id"="\d+"})
     */
    public function transfer(int $id, Request $request): Response
    {
        $product = $this->inventoryService->getProductById($id);
        
        // Logique de transfert vers une table
        // Pour l'instant, on redirige simplement vers la liste
        $this->addFlash('info', 'Fonctionnalité de transfert en cours de développement');
        return $this->redirectToRoute('app_inventory_index');
    }
    
    /**
     * @Route("/{id}", name="delete", methods={"POST"}, requirements={"id"="\d+"})
     */
    public function delete(int $id, Request $request): Response
    {
        $product = $this->inventoryService->getProductById($id);
        
        if ($this->isCsrfTokenValid('delete'.$id, $request->request->get('_token'))) {
            $this->inventoryService->removeProduct($id);
            $this->addFlash('success', 'Produit supprimé avec succès');
        }
        
        return $this->redirectToRoute('app_inventory_index');
    }
}
