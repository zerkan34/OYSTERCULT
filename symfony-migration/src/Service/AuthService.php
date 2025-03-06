<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthService
{
    private $entityManager;
    private $userRepository;
    private $passwordEncoder;
    private $jwtManager;
    
    public function __construct(
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserPasswordEncoderInterface $passwordEncoder,
        JWTTokenManagerInterface $jwtManager
    ) {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
        $this->jwtManager = $jwtManager;
    }
    
    /**
     * Inscrit un nouvel utilisateur
     * 
     * @param array $data
     * @return User
     * @throws \Exception
     */
    public function register(array $data): User
    {
        // Vérifier si l'email est déjà utilisé
        $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
        
        if ($existingUser) {
            throw new \Exception('Cet email est déjà utilisé');
        }
        
        $user = new User();
        $user->setName($data['name']);
        $user->setEmail($data['email']);
        
        // Encoder le mot de passe
        $encodedPassword = $this->passwordEncoder->encodePassword($user, $data['password']);
        $user->setPassword($encodedPassword);
        
        // Définir les rôles (par défaut ROLE_USER)
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->setRoles($data['roles']);
        }
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        return $user;
    }
    
    /**
     * Authentifie un utilisateur et génère un token JWT
     * 
     * @param array $credentials
     * @return array Données de l'utilisateur avec le token
     * @throws AuthenticationException
     */
    public function login(array $credentials): array
    {
        $user = $this->userRepository->findOneBy(['email' => $credentials['email']]);
        
        if (!$user) {
            throw new AuthenticationException('Email ou mot de passe incorrect');
        }
        
        if (!$this->passwordEncoder->isPasswordValid($user, $credentials['password'])) {
            throw new AuthenticationException('Email ou mot de passe incorrect');
        }
        
        // Mettre à jour la date de dernière connexion
        $user->setLastLoginAt(new \DateTime());
        $this->entityManager->flush();
        
        // Générer le token JWT
        $token = $this->jwtManager->create($user);
        
        return [
            'user' => $user,
            'token' => $token
        ];
    }
    
    /**
     * Récupère tous les utilisateurs
     * 
     * @return User[]
     */
    public function getAllUsers(): array
    {
        return $this->userRepository->findAllSorted();
    }
    
    /**
     * Récupère un utilisateur par ID
     * 
     * @param string $id
     * @return User
     * @throws NotFoundHttpException
     */
    public function getUserById(string $id): User
    {
        $user = $this->userRepository->find($id);
        
        if (!$user) {
            throw new NotFoundHttpException('Utilisateur non trouvé');
        }
        
        return $user;
    }
    
    /**
     * Met à jour un utilisateur existant
     * 
     * @param string $id
     * @param array $data
     * @return User
     * @throws NotFoundHttpException
     */
    public function updateUser(string $id, array $data): User
    {
        $user = $this->getUserById($id);
        
        if (isset($data['name'])) {
            $user->setName($data['name']);
        }
        
        if (isset($data['email'])) {
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            
            if ($existingUser && $existingUser->getId() !== $user->getId()) {
                throw new \Exception('Cet email est déjà utilisé');
            }
            
            $user->setEmail($data['email']);
        }
        
        if (isset($data['password']) && !empty($data['password'])) {
            $encodedPassword = $this->passwordEncoder->encodePassword($user, $data['password']);
            $user->setPassword($encodedPassword);
        }
        
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->setRoles($data['roles']);
        }
        
        $this->entityManager->flush();
        
        return $user;
    }
    
    /**
     * Supprime un utilisateur
     * 
     * @param string $id
     * @return void
     * @throws NotFoundHttpException
     */
    public function deleteUser(string $id): void
    {
        $user = $this->getUserById($id);
        
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }
    
    /**
     * Récupère le profil de l'utilisateur actuellement connecté
     * 
     * @param UserInterface $user
     * @return User
     */
    public function getProfile(UserInterface $user): User
    {
        // Assurez-vous que $user est une instance de notre entité User
        if (!$user instanceof User) {
            throw new \Exception('Utilisateur invalide');
        }
        
        return $user;
    }
    
    /**
     * Met à jour le profil de l'utilisateur actuellement connecté
     * 
     * @param UserInterface $user
     * @param array $data
     * @return User
     */
    public function updateProfile(UserInterface $user, array $data): User
    {
        // Assurez-vous que $user est une instance de notre entité User
        if (!$user instanceof User) {
            throw new \Exception('Utilisateur invalide');
        }
        
        if (isset($data['name'])) {
            $user->setName($data['name']);
        }
        
        if (isset($data['email'])) {
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            
            if ($existingUser && $existingUser->getId() !== $user->getId()) {
                throw new \Exception('Cet email est déjà utilisé');
            }
            
            $user->setEmail($data['email']);
        }
        
        if (isset($data['password']) && !empty($data['password'])) {
            $encodedPassword = $this->passwordEncoder->encodePassword($user, $data['password']);
            $user->setPassword($encodedPassword);
        }
        
        $this->entityManager->flush();
        
        return $user;
    }
    
    /**
     * Change le mot de passe de l'utilisateur actuellement connecté
     * 
     * @param UserInterface $user
     * @param string $currentPassword
     * @param string $newPassword
     * @return User
     * @throws \Exception
     */
    public function changePassword(UserInterface $user, string $currentPassword, string $newPassword): User
    {
        // Assurez-vous que $user est une instance de notre entité User
        if (!$user instanceof User) {
            throw new \Exception('Utilisateur invalide');
        }
        
        // Vérifier le mot de passe actuel
        if (!$this->passwordEncoder->isPasswordValid($user, $currentPassword)) {
            throw new \Exception('Le mot de passe actuel est incorrect');
        }
        
        // Encoder le nouveau mot de passe
        $encodedPassword = $this->passwordEncoder->encodePassword($user, $newPassword);
        $user->setPassword($encodedPassword);
        
        $this->entityManager->flush();
        
        return $user;
    }
}
