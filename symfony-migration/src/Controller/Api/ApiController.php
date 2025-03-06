<?php

namespace App\Controller\Api;

use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Annotations as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    /**
     * Page de documentation de l'API
     * 
     * @Route("/api/doc", name="api_doc")
     */
    public function doc(): Response
    {
        return $this->render('api/doc.html.twig');
    }

    /**
     * Vérification de l'état de l'API
     * 
     * @Route("/api/health", name="api_health", methods={"GET"})
     * @OA\Response(
     *     response=200,
     *     description="Retourne l'état de l'API",
     *     @OA\JsonContent(
     *         type="object",
     *         @OA\Property(property="status", type="string"),
     *         @OA\Property(property="version", type="string"),
     *         @OA\Property(property="timestamp", type="string", format="datetime")
     *     )
     * )
     */
    public function health(): Response
    {
        return $this->json([
            'status' => 'healthy',
            'version' => '1.0.0',
            'timestamp' => new \DateTime()
        ]);
    }
}
