<?php

namespace App\Tests\Controller\Inventory;

use App\Entity\Inventory\OysterTable;
use App\Repository\Inventory\OysterTableRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class OysterTableControllerTest extends WebTestCase
{
    private $client;
    private $tableRepository;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->tableRepository = static::getContainer()->get(OysterTableRepository::class);
    }

    public function testGetTables(): void
    {
        $this->client->request('GET', '/api/inventory/tables');
        
        $this->assertResponseIsSuccessful();
        $response = json_decode($this->client->getResponse()->getContent(), true);
        
        $this->assertArrayHasKey('success', $response);
        $this->assertArrayHasKey('data', $response);
        $this->assertTrue($response['success']);
    }

    public function testCreateTable(): void
    {
        $tableData = [
            'name' => 'Table Test',
            'location' => 'Zone A',
            'capacity' => 1000,
            'depth' => 2.5,
            'status' => 'active'
        ];

        $this->client->request(
            'POST',
            '/api/inventory/tables',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($tableData)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        
        $this->assertTrue($response['success']);
        $this->assertArrayHasKey('id', $response['data']);
        
        // Vérifier que la table a bien été créée
        $table = $this->tableRepository->find($response['data']['id']);
        $this->assertNotNull($table);
        $this->assertEquals($tableData['name'], $table->getName());
    }

    public function testUpdateTable(): void
    {
        // Créer une table pour le test
        $table = new OysterTable();
        $table->setName('Table à modifier');
        $table->setLocation('Zone B');
        $table->setCapacity(500);
        $table->setDepth(1.5);
        $table->setStatus('active');
        
        $this->tableRepository->save($table, true);

        $updateData = [
            'name' => 'Table Modifiée',
            'capacity' => 600
        ];

        $this->client->request(
            'PATCH',
            '/api/inventory/tables/' . $table->getId(),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($updateData)
        );

        $this->assertResponseIsSuccessful();
        
        // Vérifier les modifications
        $updatedTable = $this->tableRepository->find($table->getId());
        $this->assertEquals('Table Modifiée', $updatedTable->getName());
        $this->assertEquals(600, $updatedTable->getCapacity());
    }

    public function testDeleteTable(): void
    {
        // Créer une table pour le test
        $table = new OysterTable();
        $table->setName('Table à supprimer');
        $table->setLocation('Zone C');
        $table->setCapacity(300);
        $table->setDepth(1.0);
        $table->setStatus('active');
        
        $this->tableRepository->save($table, true);
        $tableId = $table->getId();

        $this->client->request('DELETE', '/api/inventory/tables/' . $tableId);

        $this->assertResponseIsSuccessful();
        
        // Vérifier que la table a bien été supprimée
        $deletedTable = $this->tableRepository->find($tableId);
        $this->assertNull($deletedTable);
    }

    public function testGetTableDetails(): void
    {
        // Créer une table pour le test
        $table = new OysterTable();
        $table->setName('Table détaillée');
        $table->setLocation('Zone D');
        $table->setCapacity(800);
        $table->setDepth(2.0);
        $table->setStatus('active');
        
        $this->tableRepository->save($table, true);

        $this->client->request('GET', '/api/inventory/tables/' . $table->getId());

        $this->assertResponseIsSuccessful();
        $response = json_decode($this->client->getResponse()->getContent(), true);
        
        $this->assertTrue($response['success']);
        $this->assertArrayHasKey('data', $response);
        $this->assertEquals('Table détaillée', $response['data']['name']);
    }

    public function testInvalidTableCreation(): void
    {
        $invalidData = [
            'name' => '', // Nom vide
            'capacity' => -100 // Capacité négative
        ];

        $this->client->request(
            'POST',
            '/api/inventory/tables',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($invalidData)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        
        $this->assertFalse($response['success']);
        $this->assertArrayHasKey('errors', $response);
    }
}
