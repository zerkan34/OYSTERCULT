<?php

namespace App\Entity\Inventory;

use App\Repository\Inventory\OysterTableRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=OysterTableRepository::class)
 * @ORM\Table(name="inventory_oyster_tables")
 */
class OysterTable
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank(message="Le numéro de table est requis")
     */
    private $tableNumber;

    /**
     * @ORM\Column(type="json")
     */
    private $cells = [];

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $status = 'active';

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $lastMaintenanceDate;

    /**
     * @ORM\Column(type="integer")
     */
    private $capacity;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $metadata = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTableNumber(): ?string
    {
        return $this->tableNumber;
    }

    public function setTableNumber(string $tableNumber): self
    {
        $this->tableNumber = $tableNumber;
        return $this;
    }

    public function getCells(): array
    {
        return $this->cells;
    }

    public function setCells(array $cells): self
    {
        $this->cells = $cells;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getLastMaintenanceDate(): ?\DateTimeInterface
    {
        return $this->lastMaintenanceDate;
    }

    public function setLastMaintenanceDate(?\DateTimeInterface $lastMaintenanceDate): self
    {
        $this->lastMaintenanceDate = $lastMaintenanceDate;
        return $this;
    }

    public function getCapacity(): ?int
    {
        return $this->capacity;
    }

    public function setCapacity(int $capacity): self
    {
        $this->capacity = $capacity;
        return $this;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): self
    {
        $this->metadata = $metadata;
        return $this;
    }

    public function updateCell(string $cellId, array $data): self
    {
        if (!isset($this->cells[$cellId])) {
            $this->cells[$cellId] = [];
        }
        
        $this->cells[$cellId] = array_merge($this->cells[$cellId], $data);
        return $this;
    }

    public function removeCell(string $cellId): self
    {
        if (isset($this->cells[$cellId])) {
            unset($this->cells[$cellId]);
        }
        return $this;
    }
}
