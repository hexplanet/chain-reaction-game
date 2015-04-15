<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8" />
        <title>Big Bang Game</title>
        <link rel="stylesheet" href="css/style.css">
        <link rel="stylesheet" href="css/menu_style.css">
        <link rel="stylesheet" href="css/game_style.css">
        <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" ></script>
        <script src="//crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/md5.js"></script>
        <script type="text/javascript" src="js/bigBang.js"></script>
        <script type="text/javascript" src="js/gameGrid.js"></script>
        <script type="text/javascript" src="js/drawFunctions.js"></script>
        <script type="text/javascript" src="js/atom.js"> </script>
        <script type="text/javascript" src="js/sideDisplay.js"> </script>
        <script type="text/javascript" src="js/levelSpot.js"> </script>
        <script type="text/javascript" src="js/scorePopUp.js"> </script>
        <script type="text/javascript" src="js/popupMenus.js"> </script>
        <script type="text/javascript" src="js/customPopups.js"> </script>
        <script type="text/javascript" src="js/note.js"> </script>
    </head>
    <body onLoad="BBM({com: 'init'})">
        <canvas id="menuCanvas"
                width="755"
                height="650"
                class="canvasArea"
                oncontextmenu="return false;" 
                onselectstart="return false;">
            Your browser does not appear to support HTML5.  Try upgrading your browser to the latest version.
            <a href="http://www.whatbrowser.org">What is a browser?</a>
            <br/><br/>
            <a href="http://www.microsoft.com/windows/internet-explorer/default.aspx">Microsoft Internet Explorer</a><br/>
            <a href="http://www.mozilla.com/firefox/">Mozilla Firefox</a><br/>
            <a href="http://www.google.com/chrome/">Google Chrome</a><br/>
            <a href="http://www.apple.com/safari/download/">Apple Safari</a><br/>
            <a href="http://www.google.com/chromeframe">Google Chrome Frame for Internet Explorer</a><br/>
        </canvas>
        <div class="wait-svg" style="width:362px;height:410px;margin:120px auto;">
	        <svg id="atom_load_animation" xmlns="http://www.w3.org/2000/svg" version="1.1" width="362px" height="402px">
				<circle cx="181" cy="181" r="30" fill="#000000"/>
				<g id="electron_paths">
					<g>
						<ellipse cx="181" cy="181" rx="50" ry="150" stroke-width="3"
							stroke="#000000" fill="#FFFFFF" fill-opacity="0"/>
						<circle cx="181" cy="31" r="7" fill="#000000">
							<animateMotion  dur="2s"
								path="M 0, 0 a 50, 150, 0, 1, 1, 0, 300 a -50, -150, 0, 1, 1, 0, -300" 
								repeatCount="indefinite"/>
						</circle>
						<animateTransform attributeName="transform" type="rotate"
							dur="8.5s" from="0 181 181" to="360 181 181"
							repeatCount="indefinite"/>
					</g>
				</g>
				<polygon points="84, 25 278, 25 357, 181 278, 337 84, 337 5, 181" fill="transparent" stroke="#000000" stroke-width="3px"/>
				<use xlink:href="#electron_paths" transform="rotate(120 181 181)"/>
				<use xlink:href="#electron_paths" transform="rotate(240 181 181)"/>
				<text x="110" y="370" font-family="helvetica" font-size="36px">Loading...</text>
			</svg>
		</div>
    </body>
</html>