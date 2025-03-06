<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class ExceptionListener
{
    private $debug;

    public function __construct(bool $debug = false)
    {
        $this->debug = $debug;
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();

        // Ne traiter que les requêtes d'API
        if (strpos($request->getPathInfo(), '/api/') !== 0) {
            return;
        }

        $response = new JsonResponse();
        $response->headers->set('Content-Type', 'application/json');

        // Gérer les différents types d'exceptions
        if ($exception instanceof HttpException) {
            $statusCode = $exception->getStatusCode();
            $message = $exception->getMessage();
        } elseif ($exception instanceof AuthenticationException) {
            $statusCode = Response::HTTP_UNAUTHORIZED;
            $message = 'Non authentifié';
        } elseif ($exception instanceof AccessDeniedException) {
            $statusCode = Response::HTTP_FORBIDDEN;
            $message = 'Accès refusé';
        } else {
            $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
            $message = $this->debug ? $exception->getMessage() : 'Une erreur interne est survenue';
        }

        $data = [
            'success' => false,
            'message' => $message
        ];

        if ($this->debug) {
            $data['debug'] = [
                'class' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTrace()
            ];
        }

        $response->setStatusCode($statusCode);
        $response->setData($data);

        $event->setResponse($response);
    }
}
