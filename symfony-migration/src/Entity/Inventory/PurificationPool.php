<?php

namespace App\Entity\Inventory;

use App\Repository\Inventory\PurificationPoolRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=PurificationPoolRepository::class)
 * @ORM\Table(name="inventory_purification_pools")
 */
class PurificationPool
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="string", length=36)
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank(message="Le numéro du bassin est requis")
     */
    private $poolNumber;

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
    private $uvLampHours = 0;

    /**
     * @ORM\Column(type="json")
     */
    private $waterParameters = [];

    /**
     * @ORM\Column(type="integer")
     * @Assert\Positive(message="La capacité doit être positive")
     */
    private $capacity;

    /**
     * @ORM\Column(type="integer")
     */
    private $currentOccupancy = 0;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $maintenanceHistory = [];

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getPoolNumber(): ?string
    {
        return $this->poolNumber;
    }

    public function setPoolNumber(string $poolNumber): self
    {
        $this->poolNumber = $poolNumber;
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

    public function getUvLampHours(): ?int
    {
        return $this->uvLampHours;
    }

    public function setUvLampHours(int $uvLampHours): self
    {
        $this->uvLampHours = $uvLampHours;
        return $this;
    }

    public function getWaterParameters(): array
    {
        return $this->waterParameters;
    }

    public function setWaterParameters(array $waterParameters): self
    {
        $this->waterParameters = $waterParameters;
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

    public function getCurrentOccupancy(): ?int
    {
        return $this->currentOccupancy;
    }

    public function setCurrentOccupancy(int $currentOccupancy): self
    {
        $this->currentOccupancy = $currentOccupancy;
        return $this;
    }

    public function getMaintenanceHistory(): ?array
    {
        return $this->maintenanceHistory;
    }

    public function setMaintenanceHistory(?array $maintenanceHistory): self
    {
        $this->maintenanceHistory = $maintenanceHistory;
        return $this;
    }

    public function addMaintenanceRecord(array $record): self
    {
        $this->maintenanceHistory[] = array_merge($record, ['date' => new \DateTime()]);
        return $this;
    }

    public function updateWaterParameters(array $parameters): self
    {
        $this->waterParameters = array_merge($this->waterParameters, $parameters);
        return $this;
    }
}
