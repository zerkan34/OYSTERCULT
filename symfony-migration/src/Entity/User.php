<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="users")
 * @UniqueEntity(fields={"email"}, message="Cet email est déjà utilisé")
 */
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;
    
    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Assert\NotBlank(message="L'email est requis")
     * @Assert\Email(message="L'adresse email n'est pas valide")
     * @Groups({"user:read", "user:write"})
     */
    private $email;
    
    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom est requis")
     * @Groups({"user:read", "user:write"})
     */
    private $name;
    
    /**
     * @ORM\Column(type="json")
     * @Groups({"user:read"})
     */
    private $roles = [];
    
    /**
     * @var string Le mot de passe haché
     * @ORM\Column(type="string")
     */
    private $password;
    
    /**
     * @var string|null Le mot de passe en clair (non persisté)
     * @Groups({"user:write"})
     */
    private $plainPassword;
    
    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;
    
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;
    
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $lastLoginAt;
    
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->roles = ['ROLE_USER'];
    }
    
    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getEmail(): ?string
    {
        return $this->email;
    }
    
    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }
    
    public function getName(): ?string
    {
        return $this->name;
    }
    
    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }
    
    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }
    
    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }
    
    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';
        
        return array_unique($roles);
    }
    
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        
        return $this;
    }
    
    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }
    
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }
    
    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }
    
    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }
    
    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }
    
    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        $this->plainPassword = null;
    }
    
    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
    
    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }
    
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
    
    public function getLastLoginAt(): ?\DateTimeInterface
    {
        return $this->lastLoginAt;
    }
    
    public function setLastLoginAt(?\DateTimeInterface $lastLoginAt): self
    {
        $this->lastLoginAt = $lastLoginAt;
        return $this;
    }
    
    /**
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->updatedAt = new \DateTime();
    }
}
