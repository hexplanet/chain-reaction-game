<?php
    include "../../../../hex_chain_info.php";
    // Set Time Zone to UTC
    date_default_timezone_set("UTC");
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
	    // Attempt to select the user from the players DB
        $select_user = "SELECT lives,life_time,max_lives,life_delay FROM player_info WHERE face_id='" . $user_id . "'";
        $result = mysqli_query($game_DB, $select_user);
        $user_result = mysqli_fetch_assoc($result);
        if (count($user_result) > 0) {
        	$tilNextLife = $user_result["life_delay"];
        	$maxLives = $user_result["max_lives"];
			$lives = $user_result["lives"];
			$nextTime = $user_result["life_time"];
			$dateNext = strtotime($nextTime);
			$date = time();
			if ($dateNext > $date) {
				// echo back lives and next life
				echo "next_left: " . $nextTime . "\n";
	    		echo "lives: " . strval($lives) . "\n";
			} else {
				$timeDif = $date - $dateNext;
				$addLives = 1 + floor($timeDif / $tilNextLife);
				$remainingTime = $timeDif % $tilNextLife;
				if ($lives + $addLives >= $maxLives) {
					$lives = $maxLives;
					$nextTime = date('Y-m-d H:i:s', strtotime("+" . strval($tilNextLife) . " seconds"));
				} else {
					$lives = $lives + $addLives;
					$nextTime = date('Y-m-d H:i:s', strtotime("+" . strval($tilNextLife - $remainingTime). " seconds"));
				}
	            // echo back lives and next life
				echo "next_left: " . $nextTime . "\n";
	    		echo "lives: " . strval($lives) . "\n";
	        }
	        // Store lives and next life to db
			$update_next_life = "UPDATE player_info SET lives=" . strval($lives) . ",life_time='" . $nextTime . "' WHERE face_id='" . $user_id . "'";
	        mysqli_query($game_DB, $update_next_life);
			
		} else {
			echo "error: user account not found";
		}
	    mysqli_close($game_DB);
	}
?>