<?php
if ($handle = opendir('../../levels/')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo "$entry<?*>";
        }
    }
    closedir($handle);
}
?>