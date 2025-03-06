<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class ValidationExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();

        // Ne traiter que les requêtes d'API et les erreurs de validation
        if (strpos($request->getPathInfo(), '/api/') !== 0 || !$exception instanceof ValidationFailedException) {
            return;
        }

        $violations = $exception->getViolations();
        $errors = [];

        foreach ($violations as $violation) {
            $errors[] = [
                'property' => $violation->getPropertyPath(),
                'message' => $violation->getMessage(),
                'code' => $violation->getCode()
            ];
        }

        $response = new JsonResponse([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $errors
        ], Response::HTTP_BAD_REQUEST);

        $event->setResponse($response);
    }
}
