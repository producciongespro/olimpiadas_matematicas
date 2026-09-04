<?php

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

/**
 * @internal
 */
final class HealthEndpointTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    public function testHealthEndpointIsAvailable(): void
    {
        $result = $this->get('/api/v1/health');

        $result->assertOK();
        $result->assertJSONExact([
            'data' => [
                'service' => 'olcomep-api',
                'status'  => 'ok',
            ],
        ]);
    }
}
