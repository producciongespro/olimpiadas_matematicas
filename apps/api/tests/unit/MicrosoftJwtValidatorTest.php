<?php

use App\Services\MicrosoftJwtValidator;
use CodeIgniter\Test\CIUnitTestCase;
use Firebase\JWT\JWT;

final class MicrosoftJwtValidatorTest extends CIUnitTestCase
{
    public function testValidatesSignatureTenantScopeAudienceAndClient(): void
    {
        [$privateKey, $jwks] = $this->keys();
        $claims = $this->claims();
        $validated = $this->validator($jwks)->validate(JWT::encode($claims, $privateKey, 'RS256', 'test-key'));
        $this->assertSame('editor@mep.go.cr', $validated['preferred_username']);
    }

    public function testAcceptsOfficialV1IssuerAndEquivalentGuidAudience(): void
    {
        [$privateKey, $jwks] = $this->keys();
        $claims = $this->claims();
        $claims['iss'] = 'https://sts.windows.net/tenant-id/';
        $claims['aud'] = '4f7e0180-ae0b-4ecb-9a42-4c5a43e92f1a';
        $validated = $this->validator($jwks)->validate(JWT::encode($claims, $privateKey, 'RS256', 'test-key'));
        $this->assertSame('tenant-id', $validated['tid']);
    }

    /** @dataProvider invalidClaims */
    public function testRejectsInvalidSecurityClaims(string $field, string $value): void
    {
        [$privateKey, $jwks] = $this->keys();
        $claims = $this->claims();
        $claims[$field] = $value;
        $this->expectException(RuntimeException::class);
        $this->validator($jwks)->validate(JWT::encode($claims, $privateKey, 'RS256', 'test-key'));
    }

    public static function invalidClaims(): array
    {
        return [
            'tenant' => ['tid', 'otro-tenant'], 'issuer' => ['iss', 'https://example.test/issuer'],
            'audience' => ['aud', 'api://otra-api'], 'scope' => ['scp', 'otro_permiso'], 'client' => ['azp', 'cliente-no-autorizado'],
        ];
    }

    private function validator(array $jwks): MicrosoftJwtValidator
    {
        return new MicrosoftJwtValidator('tenant-id', 'api://4f7e0180-ae0b-4ecb-9a42-4c5a43e92f1a', 'access_as_user', $jwks, 300, ['admin-spa-id']);
    }

    private function claims(): array
    {
        $now = time();
        return ['tid' => 'tenant-id', 'iss' => 'https://login.microsoftonline.com/tenant-id/v2.0', 'aud' => 'api://4f7e0180-ae0b-4ecb-9a42-4c5a43e92f1a', 'scp' => 'access_as_user', 'azp' => 'admin-spa-id', 'oid' => 'oid-123', 'preferred_username' => 'editor@mep.go.cr', 'iat' => $now, 'nbf' => $now - 1, 'exp' => $now + 300];
    }

    private function keys(): array
    {
        $options = ['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA];
        $localConfig = dirname(PHP_BINARY) . '/extras/ssl/openssl.cnf';
        if (is_file($localConfig)) $options['config'] = $localConfig;
        $resource = openssl_pkey_new($options);
        if ($resource === false) $this->markTestSkipped('OpenSSL no puede generar llaves RSA.');
        openssl_pkey_export($resource, $privateKey, null, $options);
        $details = openssl_pkey_get_details($resource);
        $encode = static fn (string $value): string => rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
        return [$privateKey, ['keys' => [['kty' => 'RSA', 'use' => 'sig', 'kid' => 'test-key', 'alg' => 'RS256', 'n' => $encode($details['rsa']['n']), 'e' => $encode($details['rsa']['e'])]]]];
    }
}
