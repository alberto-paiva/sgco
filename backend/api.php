<?php
// <!-- Copyright 2023 Alberto Paiva. -->
// <!-- SPDX-License-Identifier: MIT -->


require 'vendor/autoload.php';

//include_once 'FileUploadController.php';

use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config\Config;
use Tqdev\PhpCrudApi\RequestFactory;
use Tqdev\PhpCrudApi\RequestUtils;
use Tqdev\PhpCrudApi\ResponseUtils;

include "FileUploadController.php";
include "MyHelloController.php";


try {

    function testlog($message): bool
    {
        $error = false;
        $message = date('Y-m-d H:i:s') . "[T]: " . $message . "\n";
        $handle = fopen("php-crud-api-logs.txt", 'a') or $error = true;
        if ($error) {
            echo("cannot write logs: " . $message);
            return (false);
        }
        fwrite($handle, $message);
        fclose($handle);
        return true;
    }

    function getUserFromSession()
    {
        if (array_key_exists('user', $_SESSION) && array_key_exists('id', $_SESSION['user'])) {
            return $_SESSION['user'];
        } else {
            return null;
        }
    }

    function getUserIDFromSession()
    {
        return getUserFromSession()['id'] ?? null;
    }

    function getUserIsActiveFromSession()
    {
        return getUserFromSession()['ativo'] ?? null;
    }

    function getUserRoleFromSession()
    {
        return getUserFromSession()['tipo'] ?? null;
    }

    function getUserIsAdminRoleFromSession(): bool
    {
        return strtoupper(getUserRoleFromSession()) == "A";
    }

    function getUserIsSindicoRoleFromSession(): bool
    {
        return strtoupper(getUserRoleFromSession()) == "S";
    }

    $sessionToReset = false;

    $dbConfig = new Config(values: [
        'driver' => 'mysql',
        'address' => '127.0.0.1',
        // 'address' => 'localhost',
        'port' => '3306',
        'username' => 'master',
        'password' => 'master@7',
        'database' => 'sgcodb',
        'customControllers' => 'MyHelloController,FileUploadController',
        'middlewares' => 'sanitation,dbAuth,authorization,validation',
        'sanitation.tables' => 'all',
        'sanitation.handler' => function ($operation, $tableName, $column, $value) {
            return is_string($value) ? strip_tags($value) : $value;
        },
        'dbAuth.usersTable' => 'usuario',
        'dbAuth.loginTable' => 'usuario',
        'dbAuth.passwordLength' => '8',
        //'dbAuth.returnedColumns' => 'id,nomeusuario,senha,tipo,ativo,idPessoa',
        'dbAuth.usernameColumn' => 'nomeusuario',
        'dbAuth.passwordColumn' => 'senha',
        'dbAuth.registerUser' => '1',
        'dbAuth.loginAfterRegistration' => '1',
        /*authorization.tableHandler*/
//        'authorization.tableHandler' => function ($operation, $tableName) {
//            // GET    /records/{table}      - list      - lists records
//            // POST   /records/{table}      - create    - creates records
//            // GET    /records/{table}/{id} - read      - reads a record by primary key
//            // PUT    /records/{table}/{id} - update    - updates columns of a record by primary key
//            // DELETE /records/{table}/{id} - delete    - deletes a record by primary key
//            // PATCH  /records/{table}/{id} - increment - increments columns of a record by primary key
//
//            $tablesPermissions = array(
//                // tables
//                "aviso" => "lcrudi",
//                "condominio" => "lcrudi",
//                "condomino" => "lcrudi",
//                "endereco" => "lcrudi",
//                "login" => "lcrudi",
//                "ocorrencia" => "lcrudi",
//                "pagamento" => "lcrudi",
//                "profissional" => "lcrudi",
//                "sindico" => "lcrudi",
//                "unidade" => "lcrudi",
//                "usuario" => "lcrudi",
//                // views
//                "apartamentos" => "lcrudi",
//                "condominiocompleto" => "lcrudi",
//                "condominocompleto" => "lcrudi",
//                "condominoimage" => "lcrudi",
//                "enderecoformatado" => "lcrudi",
//                "sindicoscompleto" => "lcrudi",
//                "unidadeblocosdistinct" => "lcrudi",
//                "unidadescompletas" => "lcrudi",
//                "usuarioscondominos" => "lcrudi",
//                "usuariossindicos" => "lcrudi",
//            );
//
//            if (!array_key_exists($tableName, $tablesPermissions)) {
//                return (false);
//            }
//
//            $op = $operation[0];
//
//            $ret = str_contains($tablesPermissions[$tableName], $op);
//
//            if (!$ret) testlog("authorization.tableHandler | failed permission for operation: " . $operation . " table: " . $tableName);
//
//            testlog("authorization.tableHandler: " . $operation . " | " . $op . " | " . $tableName . " | ret:" . $ret);
//
//            return ($ret);
//
////            return $tableName;// != 'usuario';
//        },
        /*authorization.columnHandler*/
//        'authorization.columnHandler' => function ($operation, $tableName, $columnName): bool {
//            global $sessionToReset;
//            $colsPermissions = [
//                "usuario" => [
//                    "id" => "lcru",
//                    "nomeusuario" => "lcru",
//                    "senha" => "cu",
//                    "ativo" => (getUserIsActiveFromSession() && getUserIsAdminRoleFromSession() && getUserIsSindicoRoleFromSession()) ? "lcru" : "lcr",
//                    "tipo" => (getUserIsActiveFromSession() && getUserIsAdminRoleFromSession()) && getUserIsSindicoRoleFromSession() ? "lcru" : "lcr",
//                    "lastIP" => "lcru",
//                    "lastLogin" => "lcru",
//                    "idPessoa" => "lcu",
//                ],
//                // views
//                "apartamentos" => ["all" => "lr"],
//                "condominiocompleto" => ["all" => "lr"],
//                "condominocompleto" => ["all" => "lr"],
//                "condominoimage" => ["all" => "lr"],
//                "enderecoformatado" => ["all" => "lr"],
//                "sindicoscompleto" => ["all" => "lr"],
//                "unidadeblocosdistinct" => ["all" => "lr"],
//                "unidadescompletas" => ["all" => "lr"],
//                "usuarioscondominos" => ["all" => "lr"],
//                "usuariossindicos" => ["all" => "lr"],
//            ];
//
//            if (!array_key_exists($tableName, $colsPermissions)) {
//                testlog("authorization.columnHandler | !array_key_exists(tableName, colsPermissions): " . "operation: " . $operation . " | table: " . $tableName . " | column: " . $columnName);
//                return (false);
//            }
//
//
//            if (!array_key_exists($columnName, $colsPermissions[$tableName]) && !$colsPermissions[$tableName]["all"]) {
//                testlog("authorization.columnHandler | !array_key_exists(columnName, colsPermissions[tableName]): " . "operation: " . $operation . " | table: " . $tableName . " | column: " . $columnName);
//                return (false);
//            }
//
//            $op = $operation[0];
//
//
//            if (array_key_exists("all", $colsPermissions[$tableName])) {
//                $ret = str_contains($colsPermissions[$tableName]["all"], $op);
//            } else {
//                $ret = str_contains($colsPermissions[$tableName][$columnName], $op);
//            }
//
//
////            if (!$colsPermissions[$tableName]["all"]) {
////                $ret = str_contains($colsPermissions[$tableName][$columnName], $op);
////            } else {
////                $ret = str_contains($colsPermissions[$tableName]["all"], $op);
////                testlog("teste: " . $colsPermissions[$tableName]["all"] . $op);
////
////            }
//
//            if (!$ret) testlog("authorization.columnHandler | failed permission for operation: " . $operation . " table: " . $tableName . " column: " . $columnName);
//            if ($ret && $tableName == "usuario" && $operation == "update" && ($columnName == "username" || $columnName == "password")) {
//                $sessionToReset = true;
//            }
//            testlog("authorization.columnHandler: " . "operation: " . $operation . " | table: " . $tableName . " | column: " . $columnName);
//            return ($ret);
//        },
        /*authorization.recordHandler*/
//        'authorization.recordHandler' => function ($operation, $tableName) {
//            if (array_key_exists('user', $_SESSION) && array_key_exists('id', $_SESSION['user'])) {
//                $userid = $_SESSION['user']['id'];
//            } else {
//                $userid = null;
//                testlog("anonymous");
//            }
//            if ($tableName == 'usuario') {
//                if (is_null($userid) && $operation != 'create') {
//                    testlog("authorization.recordHandler | anonymous user can only create in the users table");
//                    return ('filter=id,eq,-1');
//                }
//                switch ($operation) {
//                    case 'create':
//                        return ('');
//                    case 'read':
//                    case 'update':
//                    case 'delete':
//                    case 'list':
//                        return (getUserIsActiveFromSession() && getUserIsAdminRoleFromSession()) ? ('') : ('filter=id,eq,' . $userid);
//                    default:
//                        testlog("authorization.recordHandler | unexpected operation requested on " . $tableName . ", operation: " . $operation . ", user id:" . $userid);
//                        return (getUserIsActiveFromSession() && getUserIsAdminRoleFromSession()) ? ('') : ('filter=id,eq,-1');
//                }
//            }
//            if ($tableName == 'usuariossindicos') {
//                if (is_null($userid) && $operation != 'create') {
//                    testlog("authorization.recordHandler | anonymous user can only create in the users table");
//                    return ('filter=id,eq,-1');
//                }
//                switch ($operation) {
//                    case 'list':
//                    case 'delete':
//                    case 'update':
//                    case 'read':
//                    case 'create':
//                        return ('');
//                    default:
//                        testlog("authorization.recordHandler | unexpected operation requested on " . $tableName . ", operation: " . $operation . ", user id:" . $userid);
//                        return (getUserIsActiveFromSession() && getUserIsAdminRoleFromSession()) ? '' : ('filter=id,eq,-1');
//                }
//            }
//            testlog("authorization.recordHandler | unexpected table in authorization.recordHandler: " . $tableName . ", operation: " . $operation . ", user id:" . $userid);
//            return ('');
//        },
        /*validation.handler*/
//      'validation.handler' => function ($operation, $tableName, $column, $value, $context) {
//            switch ($column['type']) {
//                case 'bigint':
//                case 'integer':
//                    if (!is_numeric($value))
//                        return ('must be numeric');
//                    if (strlen($value) > 20)
//                        return ('exceeds range');
//                    break;
//                case 'varchar':
//                    if (strlen($value) > $column['length'])
//                        return ('too long');
//                    if (!mb_check_encoding($value))
//                        return ('wrong encoding');
//                    break;
//                case 'double':
//                case 'float':
//                case 'decimal':
//                    if (!is_float($value) && !is_numeric($value))
//                        return ('not a float');
//                    break;
//                case 'boolean':
//                    if ($value != 0 && $value != 1)
//                        return ('not a valid boolean');
//                    break;
//                case 'date':
//                    $date_array = explode('-', $value);
//                    if (count($date_array) != 3)
//                        return ('invalid date format use yyyy-mm-dd');
//                    if (!checkdate($date_array[1], $date_array[2], $date_array[0]))
//                        return ('not a valid date');
//                    break;
//                case 'time':
//                    $time_array = explode(':', $value);
//                    if (count($time_array) != 3)
//                        return ('invalid time format use hh:mm:ss');
//                    foreach ($time_array as $t)
//                        if (!is_numeric($t))
//                            return ('non-numeric time value');
//                    if ($time_array[1] < 0 || $time_array[2] < 0 || $time_array[0] < -838 || $time_array[1] > 59 || $time_array[2] > 59 || $time_array[0] > 838)
//                        return ('not a valid time');
//                    break;
//                case 'timestamp':
//                    $split_timestamp = explode(' ', $value);
//                    if (count($split_timestamp) != 2)
//                        return ('invalid timestamp format user yyyy-mm-dd hh:mm:ss');
//                    $date_array = explode('-', $split_timestamp[0]);
//                    if (count($date_array) != 3)
//                        return ('invalid date format use yyyy-mm-dd');
//                    if (!checkdate($date_array[1], $date_array[2], $date_array[0]))
//                        return ('not a valid date');
//                    $time_array = explode(':', $split_timestamp[1]);
//                    if (count($time_array) != 3)
//                        return ('invalid time format use hh:mm:ss');
//                    foreach ($time_array as $t)
//                        if (!is_numeric($t))
//                            return ('non-numeric time value');
//                    if ($time_array[1] < 0 || $time_array[2] < 0 || $time_array[0] < 0 || $time_array[1] > 59 || $time_array[2] > 59 || $time_array[0] > 23)
//                        return ('not a valid time');
//                    break;
//                case 'blob':
//                case 'geometry':
//                case 'clob':
//                    if (!mb_check_encoding($value))
//                        return ('wrong encoding');
//                    break;
//                case 'varbinary':
//                    if (((strlen($value) * 3 / 4) - substr_count(substr($value, -2), '=')) > $column['length'])
//                        return ('too long');
//                    if (!mb_check_encoding($value))
//                        return ('wrong encoding');
//                    break;
//                default:
//                    testlog("unknown type: " . $column['type']);
//                    break;
//            }
//            return (true);
//        },
        'debug' => true,
    ]);
    $request = RequestFactory::fromGlobals();

    // Initialize the CRUD API instance
    $api = new Api($dbConfig);

    $response = $api->handle($request);
    ResponseUtils::output($response);

    file_put_contents('request.log', RequestUtils::toString($request) . "===\n", FILE_APPEND);
    file_put_contents('request.log', ResponseUtils::toString($response) . "===\n", FILE_APPEND);

} catch (Exception $e) {
    echo $e;
}

