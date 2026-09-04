<?php

namespace App\Repositories;

use CodeIgniter\Database\BaseConnection;

abstract class BaseRepository
{
    protected BaseConnection $db;

    public function __construct(?BaseConnection $db = null)
    {
        $this->db = $db ?? db_connect();
    }
}
