<?php
    require 'lib/facebook.php';
    include "../../../hex_chain_info.php";
    include "../../../hex_chain_auth.php";
   // Create our Application instance (replace this with your appId and secret).
    $facebook = new Facebook(array(
        'appId'  => $facebook_appId,
        'secret' => $facebook_secret,
        'status' => true, // check login status
        'cookie' => true, // enable cookies to allow the server to access the session
        'xfbml' => true, // parse XFBML
        'oauth' => true, // enable OAuth 2.0
    ));
    $user = $facebook->getUser();
    // Login or logout url will be needed depending on current user state.
    if ($user) {
    	$logoutUrl = $facebook->getLogoutUrl();
    	header("Location: https://www.hexplanet.com/dev/big_bang/game.php");
    } else {
    	$statusUrl = $facebook->getLoginStatusUrl();
        $params = array(
            'scope' => 'public_profile,publish_actions,user_friends',
            'redirect_uri' => 'https://www.hexplanet.com/dev/big_bang/game.php'
        );
        $loginUrl = $facebook->getLoginUrl($params);
        //header("Location: " . $loginUrl);
        $strUrlRedirect = '<!DOCTYPE html><html><head>';
        $strUrlRedirect = $strUrlRedirect . '<script type="text/javascript">function gotoLogin() { window.open("' . $loginUrl . '", "_top"); }</script>';
        $strUrlRedirect = $strUrlRedirect . '</head><body onLoad="gotoLogin()"></body></html>';
        echo $strUrlRedirect;
    }
?>