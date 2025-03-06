<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RequestValidationSubscriber implements EventSubscriberInterface
{
    private $validator;

    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 28] // Priorité plus haute que le ParamConverter
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // Ne valider que les requêtes d'API avec contenu JSON
        if (!str_starts_with($request->getPathInfo(), '/api/') 
            || !in_array($request->getMethod(), ['POST', 'PUT', 'PATCH'])
            || !$request->getContent()
        ) {
            return;
        }

        $content = json_decode($request->getContent(), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $event->setResponse(new JsonResponse([
                'success' => false,
                'message' => 'JSON invalide',
                'error' => json_last_error_msg()
            ], Response::HTTP_BAD_REQUEST));
            return;
        }

        // Récupérer la classe de validation correspondante à la route
        $route = $request->attributes->get('_route');
        $validationClass = $this->getValidationClass($route);
        
        if ($validationClass) {
            $validationObject = new $validationClass($content);
            $violations = $this->validator->validate($validationObject);

            if (count($violations) > 0) {
                $errors = [];
                foreach ($violations as $violation) {
                    $errors[] = [
                        'property' => $violation->getPropertyPath(),
                        'message' => $violation->getMessage()
                    ];
                }

                $event->setResponse(new JsonResponse([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $errors
                ], Response::HTTP_BAD_REQUEST));
            }
        }
    }

    private function getValidationClass(string $route): ?string
    {
        // Mapper les routes aux classes de validation
        $validationMap = [
            'api_auth_register' => 'App\Validator\Registration',
            'api_auth_login' => 'App\Validator\Login',
            'api_suppliers_create' => 'App\Validator\Supplier\SupplierCreate',
            'api_suppliers_update' => 'App\Validator\Supplier\SupplierUpdate',
            'api_supplier_products_create' => 'App\Validator\Supplier\ProductCreate',
            'api_supplier_products_update' => 'App\Validator\Supplier\ProductUpdate',
            'api_supplier_orders_create' => 'App\Validator\Supplier\OrderCreate',
            'api_supplier_orders_update' => 'App\Validator\Supplier\OrderUpdate',
            'api_inventory_tables_create' => 'App\Validator\Inventory\TableCreate',
            'api_inventory_tables_update' => 'App\Validator\Inventory\TableUpdate',
            'api_inventory_pools_create' => 'App\Validator\Inventory\PoolCreate',
            'api_inventory_pools_update' => 'App\Validator\Inventory\PoolUpdate',
        ];

        return $validationMap[$route] ?? null;
    }
}
