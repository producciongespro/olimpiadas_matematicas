<?php

namespace Tests\Unit;

use App\Services\AdminAuthContext;
use CodeIgniter\Test\CIUnitTestCase;

final class AdminAuthContextTest extends CIUnitTestCase
{
    public function testStoresAndResetsAuthenticatedRequestData(): void
    {
        $context = new AdminAuthContext();
        $context->authenticate(
            ['oid' => 'user-object-id', 'tid' => 'tenant-id'],
            ['id' => 1, 'email' => 'admin@example.invalid', 'role' => 'master'],
            'client-id',
        );

        $this->assertSame('user-object-id', $context->claims()['oid']);
        $this->assertSame(['master'], $context->roles());
        $this->assertTrue($context->isAdmin());
        $this->assertSame('client-id', $context->clientId());
        $this->assertSame('admin@example.invalid', $context->user()['email']);

        $context->reset();

        $this->assertSame([], $context->claims());
        $this->assertSame([], $context->roles());
        $this->assertFalse($context->isAdmin());
        $this->assertNull($context->clientId());
        $this->assertSame([], $context->user());
    }
}
