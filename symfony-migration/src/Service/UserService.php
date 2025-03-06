<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserService
{
    private $entityManager;
    private $passwordEncoder;
    
    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordEncoderInterface $passwordEncoder
    ) {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
    }
    
    /**
     * Met à jour le profil d'un utilisateur
     * 
     * @param User $user
     * @param array $data
     * @return User
     * @throws \Exception
     */
    public function updateProfile(User $user, array $data): User
    {
        if (isset($data['name'])) {
            $user->setName($data['name']);
        }
        
        if (isset($data['email'])) {
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            $existingUser = $this->entityManager->getRepository(User::class)
                ->findOneBy(['email' => $data['email']]);
            
            if ($existingUser && $existingUser->getId() !== $user->getId()) {
                throw new \Exception('Cet email est déjà utilisé');
            }
            
            $user->setEmail($data['email']);
        }
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        
        return $user;
    }
    
    /**
     * Met à jour le mot de passe d'un utilisateur
     * 
     * @param User $user
     * @param string $newPassword
     * @return void
     */
    public function updatePassword(User $user, string $newPassword): void
    {
        $encodedPassword = $this->passwordEncoder->encodePassword($user, $newPassword);
        $user->setPassword($encodedPassword);
        
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
