<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    private $passwordEncoder;
    
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }
    
    public function load(ObjectManager $manager): void
    {
        // Créer un administrateur
        $admin = new User();
        $admin->setName('Administrateur');
        $admin->setEmail('admin@oystercult.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword(
            $this->passwordEncoder->encodePassword($admin, 'admin123')
        );
        $admin->setCreatedAt(new \DateTime());
        
        $manager->persist($admin);
        
        // Créer un utilisateur standard
        $user = new User();
        $user->setName('Utilisateur');
        $user->setEmail('user@oystercult.com');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword(
            $this->passwordEncoder->encodePassword($user, 'user123')
        );
        $user->setCreatedAt(new \DateTime());
        
        $manager->persist($user);
        
        // Créer un second utilisateur
        $user2 = new User();
        $user2->setName('Jean Ostréiculteur');
        $user2->setEmail('jean@oystercult.com');
        $user2->setRoles(['ROLE_USER']);
        $user2->setPassword(
            $this->passwordEncoder->encodePassword($user2, 'jean123')
        );
        $user2->setCreatedAt(new \DateTime());
        
        $manager->persist($user2);
        
        $manager->flush();
    }
}
