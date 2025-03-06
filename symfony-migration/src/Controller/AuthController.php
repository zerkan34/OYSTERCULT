<?php

namespace App\Controller;

use App\Service\AuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/api/auth", name="api_auth_")
 */
class AuthController extends AbstractController
{
    private $authService;
    private $security;
    
    public function __construct(AuthService $authService, Security $security)
    {
        $this->authService = $authService;
        $this->security = $security;
    }
    
    /**
     * @Route("/register", name="register", methods={"POST"})
     */
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            return $this->json([
                'success' => false,
                'message' => 'Nom, email et mot de passe sont requis'
            ], 400);
        }
        
        try {
            $user = $this->authService->register($data);
            
            return $this->json([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'data' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail()
                ]
            ], 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json([
                'success' => false,
                'message' => 'Email et mot de passe sont requis'
            ], 400);
        }
        
        try {
            $result = $this->authService->login($data);
            
            return $this->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'data' => [
                    'user' => [
                        'id' => $result['user']->getId(),
                        'name' => $result['user']->getName(),
                        'email' => $result['user']->getEmail(),
                        'roles' => $result['user']->getRoles()
                    ],
                    'token' => $result['token']
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }
    }
    
    /**
     * @Route("/profile", name="get_profile", methods={"GET"})
     */
    public function getProfile(): JsonResponse
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }
        
        try {
            $user = $this->authService->getProfile($user);
            
            return $this->json([
                'success' => true,
                'data' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles(),
                    'createdAt' => $user->getCreatedAt(),
                    'lastLoginAt' => $user->getLastLoginAt()
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
     * @Route("/profile", name="update_profile", methods={"PUT"})
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }
        
        $data = json_decode($request->getContent(), true);
        
        try {
            $user = $this->authService->updateProfile($user, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles()
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
     * @Route("/change-password", name="change_password", methods={"POST"})
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le mot de passe actuel et le nouveau mot de passe sont requis'
            ], 400);
        }
        
        try {
            $user = $this->authService->changePassword($user, $data['currentPassword'], $data['newPassword']);
            
            return $this->json([
                'success' => true,
                'message' => 'Mot de passe modifié avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/users", name="get_users", methods={"GET"})
     */
    public function getAllUsers(): JsonResponse
    {
        // Vérifier que l'utilisateur a les droits d'administration
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé'
            ], 403);
        }
        
        $users = $this->authService->getAllUsers();
        $formattedUsers = [];
        
        foreach ($users as $user) {
            $formattedUsers[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt(),
                'lastLoginAt' => $user->getLastLoginAt()
            ];
        }
        
        return $this->json([
            'success' => true,
            'data' => $formattedUsers
        ]);
    }
    
    /**
     * @Route("/users/{id}", name="get_user", methods={"GET"})
     */
    public function getUserById(string $id): JsonResponse
    {
        // Vérifier que l'utilisateur a les droits d'administration
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé'
            ], 403);
        }
        
        try {
            $user = $this->authService->getUserById($id);
            
            return $this->json([
                'success' => true,
                'data' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles(),
                    'createdAt' => $user->getCreatedAt(),
                    'lastLoginAt' => $user->getLastLoginAt()
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/users/{id}", name="update_user", methods={"PUT"})
     */
    public function updateUser(string $id, Request $request): JsonResponse
    {
        // Vérifier que l'utilisateur a les droits d'administration
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé'
            ], 403);
        }
        
        $data = json_decode($request->getContent(), true);
        
        try {
            $user = $this->authService->updateUser($id, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles()
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
     * @Route("/users/{id}", name="delete_user", methods={"DELETE"})
     */
    public function deleteUser(string $id): JsonResponse
    {
        // Vérifier que l'utilisateur a les droits d'administration
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé'
            ], 403);
        }
        
        try {
            $this->authService->deleteUser($id);
            
            return $this->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}
