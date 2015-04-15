<?php
    include "../../../../hex_chain_info.php";
    $user_id = $_GET["user_id"];
    $level_index = $_GET["level"];
    $db_info = array("host"=>$host_name,
        "user"=>$db_user,
        "password"=>$db_password,
        "db"=>$db_name);
    $game_DB = mysqli_connect($db_info['host'], $db_info['user'],
        $db_info['password'], $db_info['db']);
    if (mysqli_connect_errno()) {
        echo "error: " . mysqli_connect_error();
    } else {
        // Get all known friend playing the game
        $known_friends = array();
        $highscore_search = "SELECT face_id,score FROM high_scores WHERE level=" . $level_index . " AND face_id IN ('" . $user_id . "'";
        $friends_search = "SELECT friend_id FROM friends WHERE face_id='" . $user_id . "' AND is_playing=1";
        $result = mysqli_query($game_DB, $friends_search);
        while ($obj = mysqli_fetch_object($result)) {
            $highscore_search = $highscore_search . ",'" . $obj->friend_id . "'";
        }
        // Clear previous result
        mysqli_free_result($result);
        $highscore_search = $highscore_search . ") ORDER BY score DESC;";
        // Get all highscores of know friends for the given level
        $result = mysqli_query($game_DB, $highscore_search);
        while ($obj = mysqli_fetch_object($result)) {
            echo "id_".$obj->face_id.": ".$obj->score."\n";
        }
        // Clear previous result
        mysqli_free_result($result);
    }
?>    
        
        