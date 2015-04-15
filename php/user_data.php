<?php
    require '../lib/facebook.php';
    include "../../../../hex_chain_info.php";
    // Set Time Zone to UTC
    date_default_timezone_set("UTC");
    
   // Create our Application instance (replace this with your appId and secret).
    $facebook = new Facebook(array(
        'appId'  => '112070989799',
        'secret' => 'fb28e719b84d3bd6c08025dd23688941',
        'status' => true, // check login status
        'cookie' => true, // enable cookies to allow the server to access the session
        'xfbml' => true, // parse XFBML
        'oauth' => true, // enable OAuth 2.0
    ));
    $user = $facebook->getUser();
    
    //error_log("$facebook user value: ".print_r($user, true));
    
    // We may or may not have this data based on whether the user is logged in.
    //
    // If we have a $user id here, it means we know the user is logged into
    // Facebook, but we don't know if the access token is valid. An access
    // token is invalid if the user logged out of Facebook.
    if ($user) {
        $user_profile = $facebook->api('/me');
        // Gather info from user for game and DB query
        echo "id: ".$user_profile['id']."\n";
        echo "name: ".$user_profile['first_name']."\n";
        $user_icon_array = $facebook->api('/'.$user_profile['id'] . '/picture?type=square&redirect=false');
        $user_icon_data = $user_icon_array['data'];
        $user_icon = $user_icon_data['url'];
        echo "icon: ".$user_icon."\n";
        echo "verified: ".$user_profile['verified']."\n";
        $friends_list = $facebook->api('/me/friends');
        $friend_names = array();
        $friend_ids = array();
        foreach ($friends_list as $key => $value) {
            if ($key == "data") {
                foreach ($value as $friend_key => $friend_value) {
                    foreach ($friend_value
                            as $friend_data_key => $friend_data) {
                        if ($friend_data_key == 'name') {
                        	array_push($friend_names, $friend_data);
                        }
                        if ($friend_data_key == 'id') {
                            array_push($friend_ids, $friend_data);
                        }
                    }
                }   
            }
        }
        unset($friend_data);
        unset($friend_value);
        unset($value);
    }
    // Login or logout url will be needed depending on current user state.
    if ($user) {
        $logoutUrl = $facebook->getLogoutUrl();
        $db_info = array("host"=>$host_name,
            "user"=>$db_user,
            "password"=>$db_password,
            "db"=>$db_name);
        $game_DB = mysqli_connect($db_info['host'], $db_info['user'],
            $db_info['password'], $db_info['db']);
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        } else {
    	    $user_info = array("id"=>$user_profile['id'],
    	        "name"=>$user_profile['first_name'],
    	        "icon"=>$user_icon);
    	    getUserDBinfo($game_DB, $user_info);
    	    processFriendInfo($game_DB, $facebook, $user_profile['id'],
    	        $friend_ids, $friend_names);
    	    mysqli_close($game_DB);
    	    echo "logout: ".$logoutUrl."\n";
    	}
    } else {
        $statusUrl = $facebook->getLoginStatusUrl();
        $params = array(
            'scope' => 'public_profile,publish_actions,user_friends',
            'redirect_uri' => 'https://www.hexplanet.com/dev/big_bang/'
        );
        $loginUrl = $facebook->getLoginUrl($params);
        echo('login: ' . $loginUrl);
    }
    
    function getUserDBinfo($db_con, $user_info) {
        // Init function values
        $toy_columns = array('small',
            'med',
            'full',
            'plasma',
            'line',
            'bang',
            'counter',
            'twenty_five',
            'luck',
            'eraser',
            'fizz',
            'boom',
            'dropper',
            'moves',
            'counts',
            'teleport',
            'magnet',
            'locked_out');
        $total_toys = count($toy_columns);
        // Get the maximum number of levels
        $select_settings = "SELECT max_levels FROM game_settings WHERE game_id=1";
        $result = mysqli_query($db_con, $select_settings);
        $setting_result = mysqli_fetch_assoc($result);
        $total_levels = $setting_result["max_levels"];
        echo "total_levels: " . $total_levels . "\n";
        // Clear previous result
        mysqli_free_result($result);
        // Attempt to select the user from the players DB
        $select_user = "SELECT level FROM players WHERE face_id='" . $user_info['id']."'";
        $result = mysqli_query($db_con, $select_user);
        $user_result = mysqli_fetch_assoc($result);
        if (count($user_result) > 0) {
            echo "level: ".$user_result['level']."\n";
            // Clear previous result
            mysqli_free_result($result);
            // Query user info
            $query_info = "SELECT cubits,lives,life_time,max_lives FROM player_info " . "WHERE face_id='".$user_info['id']."'";
            $result = mysqli_query($db_con, $query_info);
            $info_result = mysqli_fetch_assoc($result);
            echo "cubits: ".$info_result['cubits']."\n";
            echo "lives: ".$info_result['lives']."\n";
            echo "life_time: ".$info_result['life_time']."\n";
            echo "max_lives: ".$info_result['max_lives']."\n";
            // Clear previous result
            mysqli_free_result($result);
            // Query user info
            $query_toys = "SELECT * FROM toys WHERE face_id='" . $user_info['id'] . "'";
            $result = mysqli_query($db_con, $query_toys);
            $toys_result = mysqli_fetch_assoc($result);
            for ($i = 0; $i < $total_toys; $i += 1) {
                echo $toy_columns[$i].": ".$toys_result[$toy_columns[$i]]."\n";
            }
            // Clear previous result
            mysqli_free_result($result);
        } else {
            // Create new user entry if one didn't exist
            // Clear previous result
            mysqli_free_result($result);
            // Get new player values
            $select_settings = "SELECT max_lives,start_lives,start_cubits,start_life_delay FROM game_settings WHERE game_id=0";
            $result = mysqli_query($db_con, $select_settings);
            $settings_result = mysqli_fetch_assoc($result);
            $max_lives = $settings_result['max_lives'];
            $start_lives = $settings_result['start_lives'];
            $start_cubits = $settings_result['start_cubits'];
            $start_life_delay = $settings_result['start_life_delay'];
            $life_delay = $start_life_delay;
            // Clear previous result
            mysqli_free_result($result);
            // Create new user
            $insert_user = "INSERT INTO players (face_id,name,icon,email,level,play_id,play_index) VALUES ('"
                .$user_info['id']."','".$user_info['name']."','"
                .$user_info['icon']."','',0,'NotAVaildPlayId',0)";
            $result = mysqli_query($db_con, $insert_user);
            // Clear previous result
            mysqli_free_result($result);
            // Create new user info
            $insert_info = "INSERT INTO player_info (face_id,cubits,lives,"
                ."life_time,first_access,last_access,last_advance,plays,"
                ."total_plays,cubits_spent,shares,max_lives,life_delay) VALUES ('"
                .$user_info['id']."',".$start_cubits.",".$start_lives
                .",NOW(),NOW(),NOW(),NOW(),0,0,0,0," . $max_lives . "," . $life_delay . ")";
            $result = mysqli_query($db_con, $insert_info);
            // Clear previous result
            mysqli_free_result($result);
            // Create new toys
            $insert_toys = "INSERT INTO toys (face_id";
            for ($i = 0; $i < $total_toys; $i += 1) {
                $insert_toys = $insert_toys . "," . $toy_columns[$i];
            }
            $insert_toys = $insert_toys . ") VALUES ('".$user_info['id']."'";
            for ($i = 0; $i < $total_toys; $i += 1) {
                $insert_toys = $insert_toys . ",-1";
            }
            $insert_toys = $insert_toys . ")";
            $result = mysqli_query($db_con, $insert_toys);
            // Clear previous result
            mysqli_free_result($result);
            echo "level: 0\n";
            echo "cubits: " . $start_cubits . "\n";
            echo "lives: " . $start_lives . "\n";
            echo "life_time: " . date('Y-m-d H:i:s') . "\n";
            echo "max_lives: " . $max_lives . "\n";
        }
        // Get User Highscore information
        $select_highscores = "SELECT level,meter,level_type FROM high_scores WHERE face_id='" . $user_info['id']."'";
        $result = mysqli_query($db_con, $select_highscores);
        while ($obj = mysqli_fetch_object($result)) {
            echo "highscore_" . $obj->level . ": " . $obj->meter . "," . $obj->level_type . "\n";
        }
        // Clear previous result
        mysqli_free_result($result);
    }
    function processFriendInfo($game_DB, $facebook, $user_id, $friend_ids, $friend_names) {
		$select_friends = "SELECT * FROM friends WHERE face_id='".$user_id."'";
        $result = mysqli_query($game_DB, $select_friends);
        $known_friends = $result->num_rows;
        $gfriend_ids = array();
        while ($obj = mysqli_fetch_object($result)) {
            array_push($gfriend_ids,($obj->friend_id));
        }
    	// Clear previous result
        mysqli_free_result($result);
    	// Set autocommit false for mass batch of queries
    	$game_DB->autocommit(FALSE);
    	// Add all friends not yet recorded
    	$game_friends = count($gfriend_ids);
    	$face_friends = count($friend_ids);
    	$commit_data = FALSE;
        for ($i = 0; $i < $face_friends; $i += 1) {
    		$found_friend = FALSE;
    		for ($k = 0; $k < $game_friends; $k += 1) {
    			if ($friend_ids[$i] == $gfriend_ids[$k]) {
    				$found_friend = TRUE;
    				break;
    			}
    		}
    		if ($found_friend == FALSE) {
    			$friend_icon_array = $facebook->api('/'.$friend_ids[$i].'/picture?type=square&redirect=false');
               	$friend_icon_data = $friend_icon_array['data'];
              	$friend_icon = $friend_icon_data['url'];
    			$insert_friend = "INSERT INTO friends (face_id,friend_id,"
	                ."name,icon) VALUES ('".$user_id."','".$friend_ids[$i]
	                ."','".$friend_names[$i]."','".$friend_icon."')";
            	mysqli_query($game_DB, $insert_friend);
            	$commit_data = TRUE;
    		}
    	}
    	// Commit all new friend entries
    	if ($commit_data == TRUE) {        
        	$game_DB->commit();
        }
        // True autocommit back on after batch friend inserts
        $game_DB->autocommit(TRUE);
        // Get a fresh list of friends in game
        $result = mysqli_query($game_DB, $select_friends);
        $known_friends = $result->num_rows;
        $gfriend_ids = array();
        $gfriend_names = array();
        $gfriend_icons = array();
        $gfriend_playing = array();
    	while ($obj = mysqli_fetch_object($result)) {
            array_push($gfriend_ids,($obj->friend_id));
            array_push($gfriend_names,($obj->name));
            array_push($gfriend_icons,($obj->icon));
            array_push($gfriend_playing,($obj->is_playing));
        }
    	// Clear previous result
        mysqli_free_result($result);
        // Echo all friends playing and the invite list
    	$playing_index = 0;
    	$invite_index = 0;
    	for ($i = 0; $i < $known_friends; $i += 1) {
    	    $find_friend_player = "SELECT level FROM players WHERE face_id='"
    	        .$gfriend_ids[$i]."'";
    	    $result = mysqli_query($game_DB, $find_friend_player);
            $found_friend_player = $result->num_rows;
            if ($found_friend_player == 0) {
                echo "invite_id_".$invite_index.": ".$gfriend_ids[$i]."\n";
                echo "invite_name_".$invite_index.": ".$gfriend_names[$i]."\n";
                echo "invite_icon_".$invite_index.": ".$gfriend_icons[$i]."\n";
                $invite_index = $invite_index + 1;
            } else {
                echo "friend_id_".$playing_index.": ".$gfriend_ids[$i]."\n";
                echo "friend_name_".$playing_index.": ".$gfriend_names[$i]."\n";
                echo "friend_icon_".$playing_index.": ".$gfriend_icons[$i]."\n";
                $info_result = mysqli_fetch_assoc($result);
                echo "friend_level_".$playing_index.": ".$info_result['level']."\n";
                if ($gfriend_playing[$i] == 0) {
                    $update_friend_playing = "UPDATE friends SET is_playing=1"
                        ." WHERE friend_id='".$gfriend_ids[$i]."'";
                    mysqli_query($game_DB, $update_friend_playing);
                }
                $playing_index = $playing_index + 1;
            }
            // Clear previous result
            mysqli_free_result($result);
    	}
	}
?>