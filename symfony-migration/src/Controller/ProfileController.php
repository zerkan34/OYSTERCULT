<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @Route("/api/profile", name="api_profile_")
 */
class ProfileController extends AbstractController
{
    private $userService;
    private $security;
    private $passwordEncoder;
    
    public function __construct(
        UserService $userService,
        Security $security,
        UserPasswordEncoderInterface $passwordEncoder
    ) {
        $this->userService = $userService;
        $this->security = $security;
        $this->passwordEncoder = $passwordEncoder;
    }
    
    /**
     * @Route("", name="get", methods={"GET"})
     */
    public function getProfile(): JsonResponse
    {
        $user = $this->security->getUser();
        
        return $this->json([
            'success' => true,
            'data' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles()
            ]
        ]);
    }
    
    /**
     * @Route("", name="update", methods={"PUT"})
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->security->getUser();
        
        try {
            $updatedUser = $this->userService->updateProfile($user, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data' => [
                    'id' => $updatedUser->getId(),
                    'name' => $updatedUser->getName(),
                    'email' => $updatedUser->getEmail(),
                    'roles' => $updatedUser->getRoles()
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/password", name="change_password", methods={"PUT"})
     */
    public function changePassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->security->getUser();
        
        if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
            return $this->json([
                'success' => false,
                'message' => 'Les mots de passe actuels et nouveaux sont requis'
            ], 400);
        }
        
        try {
            if (!$this->passwordEncoder->isPasswordValid($user, $data['currentPassword'])) {
                throw new \Exception('Le mot de passe actuel est incorrect');
            }
            
            $this->userService->updatePassword($user, $data['newPassword']);
            
            return $this->json([
                'success' => true,
                'message' => 'Mot de passe mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
