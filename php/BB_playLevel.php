<?php
	include "../../../../hex_chain_info.php";
    // Set Time Zone to UTC
    
    $nav_test = 0;
    
    date_default_timezone_set("UTC");
    $level_index = $_GET["index"];
    $user_id = $_GET["user_id"];
    $db_info = array("host"=>$host_name,
        "user"=>$db_user,
        "password"=>$db_password,
        "db"=>$db_name);
    $game_DB = mysqli_connect($db_info['host'], $db_info['user'],
        $db_info['password'], $db_info['db']);
    if (mysqli_connect_errno()) {
        echo "error: " . mysqli_connect_error();
    } else {
    	// Attempt to select the user from the player_info TABLE
        $select_user = "SELECT lives,life_time,max_lives,life_delay,plays,total_plays FROM player_info WHERE face_id='" . $user_id . "'";
        $result = mysqli_query($game_DB, $select_user);
        $user_result = mysqli_fetch_assoc($result);
        // Check if user has lives
        if (count($user_result) > 0) {
        	$lives = $user_result["lives"];
        	$life_time = $user_result["life_time"];
        	$max_lives = $user_result["max_lives"];
        	$life_delay = $user_result["life_delay"];
        	$plays = $user_result["plays"];
        	$total_plays = $user_result["total_plays"];
        	if ($lives == 0) {
        		echo "no_lives";	
        	} else {
        	    // Attempt to select the user from players TABLE
                $select_level = "SELECT level FROM players WHERE face_id='" . $user_id . "'";
                $result = mysqli_query($game_DB, $select_level);
                $level_result = mysqli_fetch_assoc($result);
                if (count($level_result) > 0) {
                    // Check for level launch past max level and adjust if needed
                    $max_level = $level_result["level"];
                    if ($level_index > $max_level) {
                        $level_index = $max_level;
                    }
                    // Attempt to load the filename of the level
                    if (!$nav_test) {
                        $select_filename = "SELECT filename FROM game_levels WHERE level_index=" . strval($level_index);
                        $result = mysqli_query($game_DB, $select_filename);
                        $filename_result = mysqli_fetch_assoc($result);
                    }
                    if (count($level_result) > 0 || $nav_test) {
                        // Load level and output
                        if ($nav_test) {
                            $filename = 'easy_win_lose.txt';
                        } else {
        	        	    $filename = $filename_result["filename"];
        	            }
    			        $file = fopen('../levels/' . $filename, "r");
    			        $raw_level = fread($file, filesize('../levels/' . $filename));
    			        echo $raw_level;
    			        fclose($file);
    			        // Update lives, plays, and life time
    			        if ($lives == $max_lives) {
            				$life_time = date('Y-m-d H:i:s', strtotime("+" . strval($life_delay) . " seconds"));
            			}
            			$lives = $lives - 1;
            			$plays = $plays + 1;
            			$total_plays = $total_plays + 1;
            			// Store lives and next life to db
    					$update_next_life = "UPDATE player_info SET lives=" . strval($lives) . ",life_time='" . $life_time . "',plays=" . strval($plays) . ",total_plays=" . strval($total_plays) . ",last_access=NOW() WHERE face_id='" . $user_id . "'";
    	        		mysqli_query($game_DB, $update_next_life);
    	        		// Generate the play_id as md5
    	        		$play_id = "";
    	        		$level_length = strlen($raw_level);
    	        		$seek_index = 0;
    	        		$seek_skip = 0;
    	        		$PI = "31415926535897";
    	        		$count_PI = strlen($PI);
    	        		while ($seek_index < $level_length) {
    	        		    $play_id = $play_id . substr($raw_level, $seek_index, 1);
    	        		    $seek_index = $seek_index + ((intval($PI[$seek_skip])) * 10);
    	        		    $seek_skip = $seek_skip + 1;
    	        		    if ($seek_skip >= $count_PI) {
    	        		       $seek_skip = 0;    
    	        		    }
    	        		}
    	        		$play_id = md5($play_id . "|-+-|" . $level_index . "|-+-|" . $user_id);
    	        		// Store play_index and play_id db
    					$update_play_id = "UPDATE players SET play_index=" . strval($level_index) . ",play_id='" . $play_id . "' WHERE face_id='" . $user_id . "'";
    	        		mysqli_query($game_DB, $update_play_id);
        			}
    			}
			}
        } else {
        	echo "error: User not found";
        }
	}
?>