<?php
if ($handle = opendir('../../img/backgrounds')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo "$entry<?*>";
        }
    }
    closedir($handle);
}
?>