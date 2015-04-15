<?php
    $filename = $_POST["filename"];
    $level_data = $_POST["level_data"];
    if (strpos($filename, '/') === false) {
        $file = fopen('../../levels/' . $filename, "w");
        fwrite($file, $level_data);
        fclose($file);
    } else {
        echo 'Illegal filename entered';
    }
?>