<?php
    include "../../../../hex_chain_info.php"; 
    
    $nav_test = 0;
    
    $level_index = $_POST["index"];
    $user_id = $_POST["user_id"];
    $test_file = $_POST["test_file"];
    $db_info = array("host"=>$host_name,
        "user"=>$db_user,
        "password"=>$db_password,
        "db"=>$db_name);
    $game_DB = mysqli_connect($db_info['host'], $db_info['user'], $db_info['password'], $db_info['db']);
    if (mysqli_connect_errno()) {
        echo "error: " . mysqli_connect_error();
    } else {
    	if ($test_file == '') {
            // Attempt to select the user from players TABLE
            $select_level = "SELECT level FROM players WHERE face_id='" . $user_id . "'";
            $result_level = mysqli_query($game_DB, $select_level);
            $level_result = mysqli_fetch_assoc($result_level);
            if (count($level_result) > 0) {
                // Check for level launch past max level and adjust if needed
                $max_level = $level_result["level"];
                if ($level_index > $max_level) {
                    $level_index = $max_level;
                }
                // Attempt to load the filename of the level
                if (!$nav_test) {
                    $select_filename = "SELECT filename FROM game_levels WHERE level_index=" . strval($level_index);
                    $result_filename = mysqli_query($game_DB, $select_filename);
                    $filename_result = mysqli_fetch_assoc($result_filename);
                }
                if (count($level_result) > 0 || $nav_test) {
                    if ($nav_test) {
                        $filename = 'easy_win_lose.txt';
                    } else {
    	        	    $filename = $filename_result["filename"];
    	            }
        	        $file = fopen('../levels/' . $filename, "r");
                    echo fread($file, filesize('../levels/' . $filename));
                    fclose($file);
                }
            }
        } else {
        	// Load the test level
        	$file = fopen('../levels/' . $test_file, "r");
            echo fread($file, filesize('../levels/' . $test_file));
            fclose($file);
        }
    }
?>