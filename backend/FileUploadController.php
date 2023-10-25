<?php


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Tqdev\PhpCrudApi\Cache\Cache;
use Tqdev\PhpCrudApi\Column\ReflectionService;
use Tqdev\PhpCrudApi\Controller\Responder;
use Tqdev\PhpCrudApi\Database\GenericDB;
use Tqdev\PhpCrudApi\Middleware\Router\Router;

class FileUploadController
{

    private Responder $responder;

    public function __construct(Router $router, Responder $responder, GenericDB $db, ReflectionService $reflection, Cache $cache)
    {
        $router->register(method: 'POST', path: '/fileupload', handler: [$this, 'getUploadFile']);
        $this->responder = $responder;
    }

    public function getUploadFile(ServerRequestInterface $request): ResponseInterface
    {
        $path = "uploads/";
        $name_in_files = 'file';

        if (isset($_POST['filepath'])) {
            $path = $_POST['filepath'];
        }

        //    echo 'path: ' . $path;
        //    echo 'FILESfilepath: ' . $_FILES['filepath'];
        //    echo 'POSTfilepath: ' . $_POST['filepath'];
        //    echo 'POSTfile: ' . $_FILES[$name_in_files];
        //    echo 'FILES: ' . var_dump($_FILES);
        //    echo 'POST: ' . var_dump($_POST);

        if (!isset($_FILES[$name_in_files])) {
            return $this->responder->error(1003, $name_in_files, ['message' => "key should be 'file'"]);
        } elseif ($_FILES[$name_in_files]['error'] != 0) {
            return $this->responder->error(1008, $name_in_files, ['message' => "error saving file"]);
            // elseif (file_exists($path . $_FILES[$name_in_files]['name'])) {
            // return $this->responder->error(1009, '', ['message' => "filename duplicated : " . $_FILES[$name_in_files]['name']]);
        } else {
            if (!is_dir($path)) {
                clearstatcache();
                $root = $_SERVER["DOCUMENT_ROOT"];
                $oldumask = umask(0);
                if (!mkdir($path, 0777, true)) {
                    die('Failed to create directories: ' . $root . '/sgco' . $path);
                }
                umask($oldumask);
            }

            $name = $_FILES[$name_in_files]['name'];

            $success = move_uploaded_file($_FILES[$name_in_files]['tmp_name'], $path . $name);
            $valid_dir = file_exists($path);

            if ($success && $valid_dir) {
                return $this->responder->success(['message' => "file saved successfully", "name" => $name, 'path' => $path, "tmp" => $_FILES[$name_in_files]['tmp_name'],  "success" => true, "is_dir" => true,]);
            } else {
                return $this->responder->error(1008, '', ['message' => 'error saving file', "name" => $name, "tmp" => $_FILES[$name_in_files]['tmp_name'], 'path' => $path, "success" => $success, "is_dir" => $valid_dir]);
            }
        }
    }
}
