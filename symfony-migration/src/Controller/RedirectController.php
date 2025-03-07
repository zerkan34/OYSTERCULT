<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Ce contrôleur gère les redirections pour les routes qui n'ont pas encore été implémentées
 * ou qui sont utilisées dans les templates mais n'existent pas encore.
 */
class RedirectController extends AbstractController
{
    /**
     * @Route("/suppliers", name="app_suppliers")
     */
    public function suppliers(): Response
    {
        // À remplacer par la vraie route une fois implémentée
        $this->addFlash('info', 'La section Fournisseurs est en cours de développement');
        return $this->redirectToRoute('app_dashboard');
    }

    /**
     * @Route("/sales", name="app_sales")
     */
    public function sales(): Response
    {
        // À remplacer par la vraie route une fois implémentée
        $this->addFlash('info', 'La section Ventes est en cours de développement');
        return $this->redirectToRoute('app_dashboard');
    }

    /**
     * @Route("/accounting", name="app_accounting")
     */
    public function accounting(): Response
    {
        // À remplacer par la vraie route une fois implémentée
        $this->addFlash('info', 'La section Comptabilité est en cours de développement');
        return $this->redirectToRoute('app_dashboard');
    }

    /**
     * @Route("/profile", name="app_profile")
     */
    public function profile(): Response
    {
        // À remplacer par la vraie route une fois implémentée
        $this->addFlash('info', 'La section Profil est en cours de développement');
        return $this->redirectToRoute('app_dashboard');
    }

    /**
     * @Route("/settings", name="app_settings")
     */
    public function settings(): Response
    {
        // À remplacer par la vraie route une fois implémentée
        $this->addFlash('info', 'La section Paramètres est en cours de développement');
        return $this->redirectToRoute('app_dashboard');
    }

    /**
     * @Route("/orders", name="app_orders")
     */
    public function orders(): Response
    {
        // À remplacer par la vraie route une fois implémentée
        $this->addFlash('info', 'La section Commandes est en cours de développement');
        return $this->redirectToRoute('app_dashboard');
    }
}
