<?php

namespace App\Security;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\PreAuthenticationJWTUserToken;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class JwtAuthenticator extends AbstractAuthenticator
{
    private $jwtManager;
    private $userRepository;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        UserRepository $userRepository
    ) {
        $this->jwtManager = $jwtManager;
        $this->userRepository = $userRepository;
    }

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization')
            && str_starts_with($request->headers->get('Authorization'), 'Bearer ');
    }

    public function authenticate(Request $request): Passport
    {
        $token = str_replace('Bearer ', '', $request->headers->get('Authorization'));

        if (empty($token)) {
            throw new CustomUserMessageAuthenticationException('Token JWT manquant');
        }

        try {
            $preAuthToken = new PreAuthenticationJWTUserToken($token);
            $jwtPayload = $this->jwtManager->decode($preAuthToken);

            if (!isset($jwtPayload['username'])) {
                throw new CustomUserMessageAuthenticationException('Token JWT invalide');
            }

            return new SelfValidatingPassport(
                new UserBadge($jwtPayload['username'], function ($userIdentifier) {
                    return $this->userRepository->findOneBy(['email' => $userIdentifier]);
                })
            );
        } catch (JWTDecodeFailureException $e) {
            throw new CustomUserMessageAuthenticationException('Token JWT invalide');
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Authentification réussie, on continue la requête
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'success' => false,
            'message' => $exception->getMessage()
        ], Response::HTTP_UNAUTHORIZED);
    }
}
