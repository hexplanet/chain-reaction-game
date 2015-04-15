<?php
    include "../../../../hex_chain_info.php";
    // Set Time Zone to UTC
    date_default_timezone_set("UTC");
    $user_id = $_GET["user_id"];
    $level_hash = $_GET["lh"];
    $tube_meter = intval($_GET["meter"]) + 1;
    $final_score = $_GET["score"];
    $level_type = $_GET["level_type"];
    $remaining_resources = $_GET["remaining"];
    $db_info = array("host"=>$host_name,
        "user"=>$db_user,
        "password"=>$db_password,
        "db"=>$db_name);
    $game_DB = mysqli_connect($db_info['host'], $db_info['user'],
        $db_info['password'], $db_info['db']);
    if (mysqli_connect_errno()) {
        echo "error: " . mysqli_connect_error();
    } else {
        // Get the maximum number of levels in the game
        $select_settings = "SELECT max_levels FROM game_settings WHERE game_id=1";
        $result = mysqli_query($game_DB, $select_settings);
        $settings_result = mysqli_fetch_assoc($result);
        $max_levels = $settings_result["max_levels"];
        // Clear previous result
        mysqli_free_result($result);
        // Gather play information from the players db
        $select_user = "SELECT level,play_id,play_index FROM players WHERE face_id='" . $user_id . "'";
        $result = mysqli_query($game_DB, $select_user);
        $user_result = mysqli_fetch_assoc($result);
        if (count($user_result) == 0) {
            echo "error: no player found";
        } else {
            $db_level = $user_result["level"];
            $db_play_id = $user_result["play_id"];
            $db_play_index = $user_result["play_index"];
            // Clear previous result
            mysqli_free_result($result);
            // Attempt to load the filename of the level
            if ($db_play_id != $level_hash) {
                echo "error: bad hash detected";  
            } else {
                $info_update = "";
                // Load player info
                $select_player = "SELECT lives,max_lives FROM player_info WHERE face_id='" . $user_id . "'";
                $result = mysqli_query($game_DB, $select_player);
                $player_result = mysqli_fetch_assoc($result);
                if (count($player_result) > 0) {
                    $lives = $player_result["lives"];
                    $max_lives = $player_result["max_lives"];
                    if ($lives < $max_lives) {
                        $lives = $lives + 1;
                        // Store life increase
                        if ($info_update != "") {
                            $info_update = $info_update . ",";
                        }
                        $info_update = $info_update . "lives=" . strval($lives);
                    }
                }
                // Clear previous result
                mysqli_free_result($result);
                // Advance player max level if possible
                if ($db_play_index == $db_level) {
                    if ($db_level < $max_levels - 1) {
                        // Advance player max level
                        $db_level = $db_level + 1;
                        $update_players = "UPDATE players SET level=" . strval($db_level) . " WHERE face_id='" . $user_id . "'";
        	            mysqli_query($game_DB, $update_players);
                        // Update last_advance and reset plays
                        if ($info_update != "") {
                            $info_update = $info_update . ",";
                        }
                        $info_update = $info_update . "last_advance=NOW(),plays=0";
                        echo "next";  
                    }
                }
                // Store changes to player_info if needed	
                if ($info_update != "") {
                    $update_player_info = "UPDATE player_info SET " . $info_update . " WHERE face_id='" . $user_id . "'";
        	        mysqli_query($game_DB, $update_player_info);
        	    }
        	    // Clear play_id var
                $clear_playid = "UPDATE players SET play_id='NotAVaildPlayId' WHERE face_id='" . $user_id . "'";
        	    mysqli_query($game_DB, $clear_playid);
        	    // Compare high score against score
                $select_highscore = "SELECT score FROM high_scores WHERE face_id='" . $user_id . "' AND level=" . $db_play_index;
                $result = mysqli_query($game_DB, $select_highscore);
                $highscore_result = mysqli_fetch_assoc($result);
                if (count($highscore_result) == 0) {
                    // First time completing level
                    $insert_highscore = "INSERT INTO high_scores (face_id,level,score,meter,level_type,resources_left,when_set)"
                        . " VALUES ('" . $user_id . "'," . strval($db_play_index) . "," . strval($final_score)
                        . "," . strval($tube_meter) . ",'" . $level_type . "'," . strval($remaining_resources) . ",NOW())";
                    mysqli_query($game_DB, $insert_highscore);
                } else {
                    // Check against previous highscore
                    $previous_score = $highscore_result["score"];
                    if (strval($final_score) > $previous_score) {
                        // Set new high score
                        $update_highscore = "UPDATE high_scores SET score=" . strval($final_score) 
                            . ",meter=" . strval($tube_meter) . ",level_type='" . $level_type . "'"
                            . ",resources_left=" . strval($remaining_resources) . ",when_set=NOW() WHERE face_id='"
                            . $user_id . "' AND level=" . strval($db_play_index);
        	            mysqli_query($game_DB, $update_highscore);
                    }
                }
            }
        }
    }
?>