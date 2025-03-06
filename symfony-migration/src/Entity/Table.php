<?php

namespace App\Entity;

use App\Repository\TableRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=TableRepository::class)
 * @ORM\Table(name="tables")
 */
class Table
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="string", length=36)
     * @Groups({"table:read", "table:write"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom est requis")
     * @Groups({"table:read", "table:write"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=20)
     * @Assert\Choice(choices={"triploid", "diploid"}, message="Le type doit être triploid ou diploid")
     * @Groups({"table:read", "table:write"})
     */
    private $type;
    
    /**
     * @ORM\Column(type="json")
     * @Groups({"table:read", "table:write"})
     */
    private $position = [];
    
    /**
     * @ORM\Column(type="integer")
     * @Assert\GreaterThan(value=0, message="Le nombre de lignes doit être un entier positif")
     * @Groups({"table:read", "table:write"})
     */
    private $rows;
    
    /**
     * @ORM\Column(type="integer")
     * @Assert\GreaterThan(value=0, message="Le nombre de colonnes doit être positif")
     * @Groups({"table:read", "table:write"})
     */
    private $columns;
    
    /**
     * @ORM\OneToMany(targetEntity=Cell::class, mappedBy="table", orphanRemoval=true, cascade={"persist"})
     * @Groups({"table:read"})
     */
    private $cells;
    
    /**
     * @ORM\Column(type="datetime")
     * @Groups({"table:read"})
     */
    private $createdAt;
    
    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"table:read"})
     */
    private $updatedAt;
    
    public function __construct()
    {
        $this->cells = new ArrayCollection();
        $this->createdAt = new \DateTime();
    }
    
    public function getId(): ?string
    {
        return $this->id;
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
    
    public function getType(): ?string
    {
        return $this->type;
    }
    
    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }
    
    public function getPosition(): ?array
    {
        return $this->position;
    }
    
    public function setPosition(array $position): self
    {
        $this->position = $position;
        return $this;
    }
    
    public function getRows(): ?int
    {
        return $this->rows;
    }
    
    public function setRows(int $rows): self
    {
        $this->rows = $rows;
        return $this;
    }
    
    public function getColumns(): ?int
    {
        return $this->columns;
    }
    
    public function setColumns(int $columns): self
    {
        $this->columns = $columns;
        return $this;
    }
    
    /**
     * @return Collection|Cell[]
     */
    public function getCells(): Collection
    {
        return $this->cells;
    }
    
    public function addCell(Cell $cell): self
    {
        if (!$this->cells->contains($cell)) {
            $this->cells[] = $cell;
            $cell->setTable($this);
        }
        
        return $this;
    }
    
    public function removeCell(Cell $cell): self
    {
        if ($this->cells->removeElement($cell)) {
            if ($cell->getTable() === $this) {
                $cell->setTable(null);
            }
        }
        
        return $this;
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
    
    /**
     * Retourne la couleur en fonction du type selon les standards définis
     * Triploïdes (Plates): bg-brand-burgundy
     * Diploïdes (Creuses): bg-blue-600
     */
    public function getColor(): string
    {
        return $this->type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';
    }
    
    /**
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->updatedAt = new \DateTime();
    }
}
