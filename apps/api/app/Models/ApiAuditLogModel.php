<?php

namespace App\Models;

use CodeIgniter\Model;

class ApiAuditLogModel extends Model
{
    protected $table = 'api_audit_log';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = false;
    protected $allowedFields = [
        'created_at', 'request_id', 'oid', 'tid', 'azp', 'roles',
        'http_method', 'endpoint', 'status_code', 'resource_type', 'resource_id', 'ip_hash',
    ];
}
