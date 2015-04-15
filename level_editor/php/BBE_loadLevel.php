<?php
    $filename = $_POST["filename"];
    if (strpos($filename, '/') === false) {
        $file = fopen('../../levels/' . $filename, "r");
        echo fread($file, filesize('../../levels/' . $filename));
        fclose($file);
    } else {
        echo 'Illegal filename entered';
    }
?>