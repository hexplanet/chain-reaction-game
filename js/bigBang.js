/*
    Code for the Big Bang Game Editor
*/

var BBM; // Function: Contains MVC for Big Bang Main Menu

BBM = function(command) {
    /*
        Contains MVC for Big Bang Main Menu.
        Executes the controller function command.com if it
        is present.
        
        Arguments
        command: An object that contains the com and other data
    */
    var m; // Object: shortcut to this.model
    var v; // Object: shortcur to this.view
    var t; // Object: this object
    t = this;
    if(!this.model) {
        this.model = {
            canvas_element: null, // Element: Canvas   
            op_timer: null, // setInterval: 20 fps operation of timed events
            width: 0, // Number: Width of the canvas
            height: 0, // Number: Height of the canvas
            cc: null, // Context: 2D context for canvas element
            draw: null, // Object: Instance of draw functions (DRAW)
            atom_file: 'hex_pieces.png', // String: Filename for atom pieces
            atom_image: new Image(), // image: PNG of atom pieces
            atom_loaded: false, // Boolean: Is the atom pieces loaded?
            menu_file: 'menu_pieces.png', // String: Filename for atom pieces
            menu_image: new Image(), // image: PNG of atom pieces
            menu_loaded: false, // Boolean: Is the atom pieces loaded?
            lab_image: new Image(), // image: JPG of lab background and thumbnails
            lab_image_load: new Image(), // image: JPG of lab background and thumbnails
            lab_loaded: false, // Boolean: Is the lab graphic loaded?
            xml_loaded: false, // Boolean: Is the xml file loaded?
            lab_color: '#FFFFFF', // String: Default color of are behind side menu
            menu_state: 'null', // String: Current state of the menu
            show_menu: false, // Boolean: Is the menu visible?
            game: null, // Object: Instance of the game play object (BBG)
            side: null, // Object: Instance of the Side display object
            update_side_panel: true, // Boolean: Constantly update side panel?
            cubits: 0, // Number: Amount of cubit the player owns (for display only)
            lives: 1, // Number: Amount of lives the player has (for display only)
            max_lives: 6, // Number: Maximum amount of lives the player can get (for display only)
            next_life: -1, // Number: Time when next life is awarded (for display only)
            live_fizz: false, // Boolean: Is the fizz over the lives number displayed?
            level_load: "", // Boolean: Was the level loaded?
            life_check: false, // Boolean: Is a life check currently under way?
            store_state: true, // Boolean: Is the store available?
            sound_state: true, // Boolean: Is the sound active?
            music_state: true, // Boolean: Is the music active?
            side_width: 175, // Number: Width of the side menu
            first_opened: true, // Boolean: Is this the first render of the lab menu?
            exit_state: false, // Boolean: Is the exit menu active?
            popup_blocker: false, // Boolean: Is the screen blocked?
            popup_menus: [], // Array: List of all displayed popup menus in depth order
            menu_com: '', // String: Saved Menu Command for routing after closing
            success_menu: '', // String: Which success menu to open
            button_hit_id: '', // String: ID of the button mouse downed on
            button_hit_menu: '', // String: ID of the menu mouse downed on
            button_down: '', // String: Button ID
            interface_buttons: {}, // Object: Contains interface buttons
            user_id: '', // String: The id of the current user on the friends object
            friends: {}, // Object: Contains all friends and user info
            invites: {}, // Object: Contains all friends to be invited to play
            level_overviews: {}, // Object: Container for level information for the user
            level_spots: {}, // Object: Contains lab buttons and hot areas
            spot_name: "", // String: Name of the member of the crowd that has the mouseover
            spot_name_x: 0, // Number: The x-location for the rollover name to be drawn
            spot_name_y: 0, // Number: The y-location for the rollover name to be drawn
            spot_mousedown: "", // String: The current level_spot that has the mousedown
            total_popups: 0, // Number: Total number of popup menus
            atomic_tools: [-1, -1, -1, -1, -1, -1, -1, -1], // Array: List of tools available to the user
            atomic_enhancements: [-1, -1, -1, -1, -1, -1, -1, -1, -1], // Array: List of enhancements available to the user
            enhancements_used: [false, false, false, false, false, false, false, false, false], // Array: List of enhancement usage on level
            lab_number: 0, // Number: Index of lab currently displayed
            max_lab: 2, // Number: Maximum labs available
            lab_reached: 0, // Number: Default lab to view
            level_number: 0, // Number: Level index
            max_level: 14, // Number: Maximum levels available
            total_levels: 90, // Number: The total number levels in the game
            level_reached: 3, // Number: Maximum levels reached
            advance_animation: {active: false}, // Object: Contains information for advancing player icon
            test_level: '' // String: Filename of the level to be tested
        };
    }
    m = this.model;
    if(!this.view) {
        this.view = {
            updateCanvas: function (com) {
                /*
                    Update of canvas that occurs every 1/30th of a second
                */
                var level_spot; // String: Level Hot Spots IDs
                var i; // Number: Increment Var
                if (m.show_menu == true) {
                    if (m.lab_loaded == true) {
                        // Draw Lab background
                        m.cc.drawImage(m.lab_image, 
                        	0, 0, 
                        	m.width, m.height,
                            0, 0, 
                            m.width, m.height
                        );
                        // Draw Level Hot Spots
                        for (level_spot in m.level_spots) {
                            if (m.level_spots.hasOwnProperty(level_spot)) {
                                m.level_spots[level_spot].view.displaySpot();
                            }
                        }
                        // Display the user advancing to the next 
                        if (m.advance_animation.active) {
                        	t.view.drawAdvanceAnimation();
                        }
                        // Display the friend name rollover if needed
                        if (m.spot_name != "") {
                            t.controller.draw({
                    			draw: 'font',
                    			x: m.spot_name_x,
                    			y: m.spot_name_y,
                    			text: m.spot_name,
                    			font: 'white',
                    			align: 'center',
                    			alpha: 1
                    		});
                        }
                    } else {
                        // Graphic isn't loaded yet, use fill color
                        m.cc.fillStyle = m.lab_color;
    		            m.cc.fillRect(
    		            	0, 0,
    		                m.width, m.height
    		           	);
                    }
                    // Draw Chain Reaction Title
                    m.cc.drawImage(m.menu_image,
                        513, (t.controller.rnd({max: 3}) * 60),
                        490,57,
                        196, 35,
                        490, 57
                    );
                }
                // Display Game Grid
                if (m.game) {
                    m.game.view.updateCanvas();
                }
                // Update side panel if needed
                if (m.update_side_panel == true) {
                    if (m.side) {
                        m.side.view.updateCanvas();
                    }
                }
                // Display All Pop-Up Menus
                for (i = 0; i < m.total_popups; i++) {
                    m.popup_menus[i].view.displayMenu();
                }
            },
            drawAdvanceAnimation: function () {
            	/*
                    Draw and operate the advance animation
                */
		    	var advance_ratio = (Date.now() - m.advance_animation.start_time) / m.advance_animation.duration;
		    	var x_position;
		    	var y_position;
		    	if (advance_ratio > 1) {
		    		advance_ratio = 1;
		    	}
		    	x_position = m.advance_animation.start_x + Math.floor((m.advance_animation.end_x - m.advance_animation.start_x) * advance_ratio);
		    	y_position = m.advance_animation.start_y + Math.floor((m.advance_animation.end_y - m.advance_animation.start_y) * advance_ratio);
            	if (m.friends["id_" + m.user_id].icon_image.width > 0) {
            		m.cc.drawImage(m.friends["id_" + m.user_id].icon_image,
	                    0, 0,
	                    m.friends["id_" + m.user_id].icon_image.width,
	                    m.friends["id_" + m.user_id].icon_image.height,
	                    x_position, y_position,
	                    38, 38
	                );
	            } else {
	                m.cc.drawImage(m.menu_image,
	                    1116, 364,
	                    38, 38,
	                    x_position, y_position,
	                    38, 38
	                );
	            }
            	if (advance_ratio == 1) {
            		// End advance animation
            		t.controller.endLevelAdvanceAnimation();
            	}
            }
        };
    }
    v = this.view;
    if(!this.controller) {
        this.controller = {
            init: function (com) {
                /*
                    Init Game Main Menu
                */
                // Get width, height, and context of canvas
                m.canvas_element = document.getElementById("menuCanvas");
                m.width = m.canvas_element.width;
                m.height = m.canvas_element.height;
                m.cc = m.canvas_element.getContext("2d");
                // Save user code and state if present
                m.user_code = com.userCode;
                m.user_state = com.userState;
                // Create instance of draw functions
                m.drawFunctions = new DRAW({
                    com: 'init',
                    menu_data: m
                });
                // Create instance of Side Menu
                m.side = new SIDE({
                    com: 'init',
                    menu_data: m
                });
                // Load menu graphics
                m.menu_state = 'loadMenu';
                m.menu_image.onload = function () {
                    BBM({
                        com: 'loadedMenu'
                 	});
                };
                m.menu_image.src = 'img/' + m.menu_file;
            },
            gameInstance: function (com) {
                /*
                   Start an instance of the game 
                */
                m.game = new BBG({
                    com: 'init',
                    menuDataModel: m
                }); 
            },
            loadedMenu: function (com) {
                /*
                    Menu graphic have loaded and now init the
                    display of the menu
                */
                // 
                m.menu_loaded = true;
                // Load atom pieces
                m.menu_state = 'loadAtom';
                m.atom_image.onload = function () {
                    BBM({
                        com: 'loadedAtom'
                 	});
                };
                m.atom_image.src = 'img/' + m.atom_file;
            },
            loadedAtom: function (com) {
                /*
                    Sets the loaded flag to true for atom pieces
                    and call the lab to be loaded
                */
                m.atom_loaded = true;
                // Read cookie to see if an editor level is being tested
                c_value = document.cookie;
                c_start = c_value.indexOf(" bbe_level_name=");
                if (c_start == -1) {
                    c_start = c_value.indexOf("bbe_level_name=");
                }
                if (c_start > -1) {
                    c_start = c_value.indexOf("=", c_start) + 1;
                    c_end = c_value.indexOf(";", c_start);
                    if (c_end == -1) {
                        c_end = c_value.length;
                    }
                    cookie_file = unescape(c_value.substring(c_start, c_end));
                    if (cookie_file != '') {
                    	m.test_level = cookie_file;
                        // Advance to next critical load function
                    	t.controller.initApp();
                    }
                } else {
                	// Start the loading of user data
	                $.ajax({
	                    url: "php/user_data.php",
	                    type: "GET",
	                    data: {
	                    	code: m.user_code,
	                    	state: m.user_state
	                    },
	                    success:
	                        function (result) {
	                            BBM({
	                                com: 'loadedUserData',
	                                data: result
	                            });
	                        },
	                    error:
	                        function (error) {
	                            // XML file load failed notice
	                            // NEED TO MAKE THIS FAIL GRACEFULLY
	                        }
	                });
            	}
            },
            loadedUserData: function (com) {
                /*
                    Parses loaded user data for display
                    
                    Arguments
                    com.data: The data returned from the 
                */
                var data_length; // Number: Total number of data entries
                var i; // Number: Increment Var
                var user_data_list; // Array: Raw data list from facebook and db
                var login_url; // String: URL to open to allow login to game
                // Init Function Values
                user_data_list = com.data.split("\n");
                data_length = user_data_list.length;
                login_url = "";
                // Check for login trigger
                for (i = 0; i < data_length; i++) {
	            	if (user_data_list[i].substr(0, 7) == 'login: ') {
	                	login_url = user_data_list[i].substring(7);
                	}
                }
                if (login_url != '') {
                	window.open(login_url, "_top");
                } else {
                    // Set in game vars from user data
                    t.controller.parseUserData({
                        data: com.data
                    });
                }
            },
            parseUserData: function (com) {
                /*
                    Goes through user data and parse out
                    data for game current user
                    
                    Arguments
                    com.data: The raw data returned by the AJAX call
                */
                var k; // Number: Increment Var
                var i; // Number: Increment Var
                var invite_hash; // Object: All number to id hashes for invite
                var friend_hash; // Object: All number to id hashes for friends
                var data_lines; // Number: Number of lines from data
                var user_data_list; // Array: Raw data list from facebook and db
                var split_index; // Number: Index to split the line at
                var line_key; // String: The line key
                var line_value; // String: The line value
                var key_parts; // Array: The line key delimited by _
                var value_parts; // Array: The line value delimited by ,
                var verified_id; // Number: Boolean value for verified id
                var tool_order; // Array: List of tools in order
                var total_tools; // Number: Tools on tool_order list
                var enhancement_order; // Array: List of enhancements in order
                var total_enchancements; // Number: Enhancements on enhancements list
                var short_name; // String: First name and first inital
                var name_splits; // Array: Name delimited by spaces
                var life_time_split; // Array: next life split on space
                var date_split; // Array: Year, month, and day
                var date_year; // Number: Year (####)
                var date_month; // Number Month (0-11)
                var date_day; // Number: Day (1-31)
                var time_split; // Array: Hours, minutes, and seconds
                var time_hour; // Number: Hour (0-23)
                var time_minutes; // Number: Minutes (0-59)
                var time_seconds; // Number: Seconds (0-59)
                // Init Function Values
                user_data_list = com.data.split("\n");
                data_lines = user_data_list.length;
                verified_id = 0;
                tool_order = ["eraser", "fizz", "boom", "dropper",
                    "moves", "counts", "teleport", "magnet"];
                total_tools = tool_order.length;
                enhancement_order = ["small", "med", "full",
                    "plasma", "line", "bang",
                    "counter", "twenty_five", "luck"];
                total_enchancements = enhancement_order.length;
                invite_hash = {};
                friend_hash = {};
                // Reset User Data
                m.user_id = "";
                m.friends = {};
                m.invites = {};
                m.lab_reached = 0;
                m.cubits = 0;
                m.lives = 0;
                m.next_life = -1;
                m.atomic_tools = [-1, -1, -1, -1, -1, -1, -1, -1];
                m.atomic_enhancements = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
                // Loop through each line of the data and convert it
                for (i = 0; i < data_lines; i++) {
                    split_index = user_data_list[i].indexOf(": ");
                    if (split_index > -1) {
                        line_key = user_data_list[i].substr(0, split_index);
                        line_value = user_data_list[i].substring(split_index
                            + 2);
                        key_parts = line_key.split('_');
                        switch(line_key) {
                            case 'id':
                                m.user_id = line_value;
                                m.friends["id_" + m.user_id] = {};
                                m.friends["id_" + m.user_id].id = m.user_id;
                                break;
                            case 'name':
                                m.friends["id_" + m.user_id].name = line_value;
                                break;
                            case 'icon':
                                m.friends["id_" + m.user_id].icon = line_value;
                                m.friends["id_" + m.user_id].icon_image = new Image();
                                m.friends["id_" + m.user_id].icon_image.src = line_value;
                                break;
                            case 'verified':
                                verified_id = Number(line_value);
                                break;
                            case 'level':
                                m.lab_reached = Math.floor(Number(line_value) / (m.max_level + 1));
                                m.level_reached = Number(line_value);
                                m.friends["id_" + m.user_id].level = Number(line_value);
                                break;
                            case 'cubits':
                                m.cubits = Number(line_value);
                                break;
                            case 'lives':
                                m.lives = Number(line_value);
                                break;
                            case 'life_time':
                                m.next_life = line_value;
                                break;
                            case 'max_lives':
                            	m.max_lives = Number(line_value);
                            	break;
                            case 'total_levels':
                            	m.total_levels = Number(line_value);
                            	break;
                        }
                        for (k = 0; k < total_tools; k++) {
                            if (tool_order[k] == line_key) {
                                m.atomic_tools[k] = Number(line_value);
                            }
                        }
                        for (k = 0; k < total_enchancements; k++) {
                            if (enhancement_order[k] == line_key) {
                                m.atomic_enhancements[k] = Number(line_value);
                            }
                        }
                        if (key_parts[0] == "highscore") {
                            value_parts = line_value.split(",");
                            m.level_overviews[String(key_parts[1])] = {
                                "level_meter": value_parts[0],
                                "level_type": value_parts[1]
                            };   
                        }   
                        if (key_parts[0] == "invite") {
                            if (key_parts[1] == "id") {
                                invite_hash["id_" + key_parts[2]] = 
                                    line_value;
                                m.invites[line_value] = {};
                                m.invites[line_value].id = line_value;
                            }
                            if (key_parts[1] == "name") {
                                name_splits = line_value.split(' ');
                                short_name = name_splits[0];
                                if (name_splits.length > 1) {
                                	if (name_splits[1].length > 0) {
                                		short_name = short_name + ' ' + name_splits[1].substr(0,1) + '.';
                                	}
                                }
                                m.invites[invite_hash["id_" + key_parts[2]]]
                                	.full_name = line_value;
                                m.invites[invite_hash["id_" + key_parts[2]]]
                                    .name = short_name;
                                m.invites[invite_hash["id_" + key_parts[2]]]
                                    .checkmark = true;
                            }
                            if (key_parts[1] == "icon") {
                                m.invites[invite_hash["id_" + key_parts[2]]]
                                    .icon = line_value;
                                m.invites[invite_hash["id_" + key_parts[2]]]
                                    .icon_image = new Image();
                                m.invites[invite_hash["id_" + key_parts[2]]]
                                    .icon_image.src = line_value;
                            }
                        }
                        if (key_parts[0] == "friend") {
                            if (key_parts[1] == "id") {
                                friend_hash["id_" + key_parts[2]] = "id_" + line_value;
                                m.friends["id_" + line_value] = {};
                                m.friends["id_" + line_value].id = line_value;
                            }
                            if (key_parts[1] == "name") {
                                m.friends[friend_hash["id_" + key_parts[2]]].name = line_value;
                            }
                            if (key_parts[1] == "icon") {
                                m.friends[friend_hash["id_" + key_parts[2]]].icon = line_value;
                                m.friends[friend_hash["id_" + key_parts[2]]].icon_image = new Image();
                                m.friends[friend_hash["id_" + key_parts[2]]].icon_image.src = line_value;
                            }
                            if (key_parts[1] == "level") {
                                if (m.friends[friend_hash["id_" + key_parts[2]]]) {
                                    m.friends[friend_hash["id_" + key_parts[2]]].level = line_value;
                                }
                            }
                        }
                    }
                }
                // Convert Time into milliseconds
                if (m.lives == m.max_lives) {
                	m.next_life = -1;
                } else {
                    life_time_split = m.next_life.split(" ");
                    date_split = life_time_split[0].split("-");
                    date_year = Number(date_split[0]);
                    date_month = Number(date_split[1]) - 1;
                    date_day = Number(date_split[2]);
                    time_split = life_time_split[1].split(":");
                    time_hour = Number(time_split[0]);
                    time_minutes = Number(time_split[1]);
                    time_seconds = Number(time_split[2]);
                    m.next_life = new Date(date_year, date_month, date_day, time_hour, time_minutes, time_seconds, 0);
                }
                // Init the app and start it
                t.controller.initApp();
            },
            loadLab: function (com) {
                /*
                    Start Loading the next lab
                */
                var i; // Number: Increment Var
                var disable_buttons; // Array: List of button to disable on scroll popup
                var scroll_index; // Number: PopUp index of scroll popup
                var level_spot; // String: ID of the current level spot
                // Init Function Values
                disable_buttons = ['up', 'current', 'down', 'story', 'future'];
                // Remove all levelSpots
                for (level_spot in m.level_spots) {
                    if (m.level_spots.hasOwnProperty(level_spot)) {
                        delete m.level_spots[level_spot];
                    }
                }
                // Disable scroll buttons
                scroll_index = t.controller.findMenuID({
                    menu_id: 'scroll'    
                });
                for (i = 0; i < 5; i++) {
                    m.popup_menus[scroll_index].controller.setButtonActive({
                        button_id: disable_buttons[i],
                        active: false
                    });
                }
                // Set menu state to loading a lab
                m.menu_state = 'loadLab';
                // Start the XML file load
                t.controller.loadLabXML({});
                // Start the lab graphic lab
                m.lab_image_load.onload = function () {
                    BBM({
                        com: 'loadedLab'
                 	});
                };
                m.lab_image_load.src = 'img/lab_' + m.lab_number + '.jpg';
            },
            loadLabXML: function (com) {
                /*
                    Loads an XML file with the lab positioning
                */
                var inside; // Object: Part of either success or error code
                // Set XML to unloaded
                m.xml_loaded = false;
                $.ajax({
                    url: "xml/lab_" + m.lab_number + ".xml",
                    dataType: "xml",
                    success:
                        function (result) {
                            BBM({
                                com: 'loadedLabXML',
                                xml: result
                            });
                        },
                    error:
                        function (error) {
                            // XML file load failed notice
                            // NEED TO MAKE THIS FAIL GRACEFULLY
                        }
                });
            },
            loadedLab: function (com) {
                /*
                    Sets the loaded flag to true for lab background
                    and call initApp
                */
                var scroll_index; // Number: PopUp index of scroll popup
                m.lab_loaded = true;
                // Copy loaded graphic to lab display image
                m.lab_image = m.lab_image_load;
                // Check if all data has been loaded to start the lab
                t.controller.checkLabReady();
            },
            loadedLabXML: function (com) {
                /*
                    Init level spots from loaded XML data
                    
                    Arguments
                    com.xml: The XML file to be parsed for level spot data
                */
                var spot_id; // Number: The id of the level spot
                var file_name; // String: File to be loaded to play the level
                // Create level hot spots from loaded XML data
                $(com.xml).find("level_spot").each(function () {
                    spot_id = Number($(this).find("id").text());
                    if (!isNaN(spot_id)) {
                        file_name = 'lab_' + m.lab_number + '_'
                            + (spot_id % 15) + '.txt';
                        m.level_spots['spot_' + spot_id] = new LEVEL_SPOT({
                            com: 'init',
                            menu_data: m,
                            id: spot_id,
                            file_name: file_name,
                            experiment_type: $(this).find("experiment type").text(),
                            roll_left: Number($(this).find("rollover left").text()),
                            roll_top: Number($(this).find("rollover top").text()),
                            roll_right: Number($(this).find("rollover right").text()),
                            roll_bottom: Number($(this).find("rollover bottom").text()),
                            thumb_x: Number($(this).find("thumb x").text()),
                            thumb_y: Number($(this).find("thumb y").text()),
                            meter_x: Number($(this).find("meter x").text()),
                            meter_y: Number($(this).find("meter y").text()),
                            number_x: Number($(this).find("level x").text()),
                            number_y: Number($(this).find("level y").text()),
                            experiment_x: Number($(this).find("experiment x").text()),
                            experiment_y: Number($(this).find("experiment y").text()),
                            icon_x: Number($(this).find("icon x").text()),
                            icon_y: Number($(this).find("icon y").text()),
                            icon_angle: Number($(this).find("icon angle").text()),
                            user_id: m.user_id
                        });
                        // Lock levels not yet reached
                        if (spot_id <= m.level_reached) {
                            m.level_spots['spot_' + spot_id].controller.setLocked({
                                locked: false 
                            });
                        }
                        // Display progress for levels completed
                        if (m.level_overviews[String(spot_id)]) {
                            m.level_spots['spot_' + spot_id].controller.setMeterLevel({
                                meter_level: m.level_overviews[String(spot_id)].level_meter
                            });
                            m.level_spots['spot_' + spot_id].controller.setLevelType({
                                level_type: m.level_overviews[String(spot_id)].level_type
                            });  
                        }
                        // Display players in the crowd
                        for (friend_id in m.friends) {
                            if (m.friends.hasOwnProperty(friend_id)) {
                                if (m.friends[friend_id].level == spot_id) {
                                    m.level_spots['spot_' + spot_id].controller.addToCrowd({
                                        friend: m.friends[friend_id].id,
                                        name: m.friends[friend_id].name.split(" ")[0],
                                        image: m.friends[friend_id].icon_image
                                    });
                                }
                            }
                        }
                    }
                });
                m.xml_loaded = true;
                // Check if all data has been loaded to start the lab
                t.controller.checkLabReady();
            },
            checkLabReady: function (com) {
                /*
                    Start the display of the lab if both the
                    XML and graphic files have been loaded
                */
                var c_value; // String: Cookie file
                var c_start; // Number: Index start of level name in cookie
                var c_end; // Number: Index end of level name in cookie
                var cookie_file; // String: File to be tested via cookie
                if (m.xml_loaded == true && m.lab_loaded == true) {
                    // Remove the svg loading element
                    $(".wait-svg").remove();
                    // Reset scroll popup
                    t.controller.closeMenu({
                        menu_id: 'scroll'
                    });
                    t.controller.openMenu({
                        menu_id: 'scroll',
                        x: 733,
                        y: 2     
                    });
                    // Disable current button if already in that lab
                    if (m.lab_number == m.lab_reached) {
                        scroll_index = t.controller.findMenuID({
                            menu_id: 'scroll'    
                        });
                        m.popup_menus[scroll_index].controller.setButtonActive({
                            button_id: 'current',
                            active: false
                        });
                    }
                    // Set menu display to active
                    m.menu_state = 'active';
                    m.show_menu = true;
                    // Display App Canvas
                    $('#menuCanvas').show();
                    // Display the side panel
                    if (m.side) {
                        m.side.view.updateCanvas();   
                    }
                    
                    /*
                    // Read cookie to see if an editor level is being tested
                    c_value = document.cookie;
                    c_start = c_value.indexOf(" bbe_level_name=");
                    if (c_start == -1) {
                        c_start = c_value.indexOf("bbe_level_name=");
                    }
                    if (c_start > -1) {
                        c_start = c_value.indexOf("=", c_start) + 1;
                        c_end = c_value.indexOf(";", c_start);
                        if (c_end == -1) {
                            c_end = c_value.length;
                        }
                        cookie_file = unescape(c_value.substring(c_start, c_end));
                        if (cookie_file != '') {
                            m.spot_mousedown = '';
                            t.controller.startLevel();
                        }
                    }
					*/
					
                    //****************************************************************************
                    //****************************************************************************
                    //************************* PLACE INTRO SCREEN INITS HERE ********************
                    //****************************************************************************
                    //****************************************************************************

                    if (m.first_opened) {
                        t.controller.openMenu({
                            menu_id: 'invites',
                            blocker: true,
                            x: Math.floor(m.width / 2)     
                        });
                        m.first_opened = false;
                        m.menu_state = 'invites_popup';
                    }
                }
            },
            initApp: function (com) {
                /* 
                    Init application display and input
                */
                // Init interface buttons
                t.controller.addButton({
                    button_id: 'store',
                    left: 16,
                    top: 13,
                    right: 49,
                    bottom: 36
                });
                t.controller.addButton({
                    button_id: 'volume',
                    left: 53,
                    top: 13,
                    right: 86,
                    bottom: 36
                });
                t.controller.addButton({
                    button_id: 'music',
                    left: 90,
                    top: 13,
                    right: 123,
                    bottom: 36
                });
                t.controller.addButton({
                    button_id: 'help',
                    left: 127,
                    top: 13,
                    right: 160,
                    bottom: 36
                });
                // Init mouse event listeners for the canvas
                m.canvas_element.addEventListener('mousedown', function(e) {
             	    BBM({
             	        com: 'canvasMouseEvent',
             	        evt: e,
             	        evt_type: 'down'
             	    });
            	}, false);
                m.canvas_element.addEventListener('mousemove', function(e) {
                    BBM({
             	        com: 'canvasMouseEvent',
             	        evt: e,
             	        evt_type: 'move'
             	    });
            	}, false);
                m.canvas_element.addEventListener('mouseup', function(e) {
            	    BBM({
             	        com: 'canvasMouseEvent',
             	        evt: e,
             	        evt_type: 'up'
             	    });
                }, false);
                // Start the event timer for 30 fps
                m.op_timer = setInterval(function () {
                    BBM({
                        com: 'timerEvent'
                    });
                }, 33.333);
                if (m.test_level == "") {
	                t.controller.openMenu({
	                    menu_id: 'scroll',
	                    x: 733,
	                    y: 2     
	                });
	                // Load the starting lab
	                m.lab_number = m.lab_reached;
	                t.controller.loadLab();
	            } else {
	            	// Start the test level
	            	m.atomic_tools = [90, 90, 90, 90, 90, 90, 90, 90];
	            	m.spot_mousedown = '';
	            	t.controller.startLevel();    	
	            }
            },
            loadedBackground: function (com) {
                /*
                    Pass that the background correctly loaded
                */
                m.game.controller.backgroundResult({
                    loaded: true 
                });
            },
            errorBackground: function (com) {
                /*
                    Pass that the background failed loading
                */
                m.game.controller.backgroundResult({
                    loaded: false
                });
            },
            startLevel: function (com) {
                /*
                    Start the Level
                */
                // Set level menu state to loading
                m.menu_state = 'loadLevel';
                if (m.spot_mousedown != '') {
                    // Reset the level spot rollover and mouse down
                    m.level_spots[m.spot_mousedown].controller.setMouseDowned({
                        mouse_down: false 
                    });
                    m.level_spots[m.spot_mousedown].controller.setMouseInside({
                        inside: false 
                    });
                }
                // Open loading message
                t.controller.openMenu({
                    menu_id: 'loading',
                    blocker: true,
                    x: Math.floor(m.width / 2)
                });
                // Get a fresh game instance
                t.controller.gameInstance({});
                // Start Game instance loading files
                m.game.controller.startLevel({
                    user_id: m.user_id,
                    index: m.level_number
                });
            },
            levelLoaded: function (com) {
                /*
                    Pass level data to game object
                    
                    Arguments
                    com.json_data: Escaped, stringified level data
                */
                m.level_load = com.json_data.substr(0, 100);
	            m.game.controller.levelLoaded({
	                    raw_level: com.json_data
	            });
            },
            levelFailed: function (com) {
                /*
                    Error while loading level data
                */
                m.level_load = "fail";
                console.log(m.level_files[m.level_number] + ' failed to load');
            },
            levelStarted: function (com) {
                /*
                    Level is playing, hide menu
                */
                // Signal the side menu to enter
                m.side.controller.openSideMenu();
                // Display Level Menu
                m.show_menu = false;
                // Set Level Menu to playingGame state
                m.menu_state = 'playingGame';
            },
            updateSideMenu: function (com) {
                /*
                    Update a given area of the side menu
                    
                    Arguments
                    com.area: ID of which area to update (see below)
                */
                if (com.area) {
                    switch (com.area) {
                        case 'requirements':
                            m.side.view.updateRequirements();
                            break;
                        case 'score':
                            m.side.view.updateScore();
                            break; 
                        case 'moves':
                            m.side.view.updateMoves();
                            break;
                        case 'buttons':
                            m.side.view.updateButtons();
                            break;
                    }   
                }
            },
            draw: function (com) {
                /*
                    Executes a draw function
                    
                    Arguments:
                    com.draw: Which function to execute
                    com.*: Data to pass
                */
                if (m.drawFunctions) {
                    if (m.drawFunctions.controller[com.draw]) {
                        m.drawFunctions.controller[com.draw](com);
                    } else {
                        console.log('No DRAW function: ' + com.draw);   
                    }
                }
            },
            canvasMouseEvent: function (com) {
                /*
                    Routes mouse events to proper handler
                    
                    Arguments
                    com.evt: The mouse event
                    com.evt_type: The mouse event type
                */
                var i; // Number: Increment Var
                var total_popups; // Number: Menus to check for blockers
                var has_blocker; // Boolean: Is there a blocker being used?
                var button_obj; // Object: Interface button to hit check on
                var mouse_xy; // Object: Holds converted mouse X and Y position
                mouse_xy = t.controller.getXYmouse({
                    e: com.evt
                });
                // Search for background blocker in popup menus
                has_blocker = false;
                total_popups = m.popup_menus.length;
                for (i = 0; i < total_popups; i++) {
                    if (m.popup_menus[i].controller.getBlocker() == true) {
                        has_blocker = true;
                        break;
                    }   
                }
                // Interface button hit check
                if (com.evt_type == 'down') {
                    // Check interface button mouse down
                    m.button_down = '';
                    for (button_obj in m.interface_buttons) {
                        if (m.interface_buttons.hasOwnProperty(button_obj)) {
                            if (t.controller.insideRect({
                                left: m.interface_buttons[button_obj].left,
                                right: m.interface_buttons[button_obj].right,
                                top: m.interface_buttons[button_obj].top,
                                bottom: m.interface_buttons[button_obj].bottom,
                                x_pos: mouse_xy.x,
                                y_pos: mouse_xy.y
                            })) {
                                if (has_blocker == false) {
                                    m.button_down = button_obj;
                                }
                            }
                        }
                    }
                }
                if (com.evt_type == 'up') {
                    // Handle interface button mouse up
                    if (m.button_down != '') {
                        for (button_obj in m.interface_buttons) {
                            if (m.interface_buttons.hasOwnProperty(button_obj)) {
                                if (t.controller.insideRect({
                                    left: 
                                        m.interface_buttons[button_obj].left,
                                    right: 
                                        m.interface_buttons[button_obj].right,
                                    top: 
                                        m.interface_buttons[button_obj].top,
                                    bottom: 
                                        m.interface_buttons[button_obj].bottom,
                                    x_pos: mouse_xy.x,
                                    y_pos: mouse_xy.y
                                })) {
                                    if (has_blocker == false) {
                                        if (button_obj == m.button_down) {
                                            t.controller.executeButton({
                                                type: m.button_down
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    m.button_down = '';
                }
                if (m.total_popups > 0) {
                    // Popup menu open, send it the mouse event
                    t.controller.menuMouseEvent({
                        evt: com.evt,
                        evt_type: com.evt_type
                    });
                    if (m.menu_state == 'active') {
                        // Use mouse data to check level hot spots
                        t.controller.checkLevelSpots({
                            mouse_x: mouse_xy.x,
                            mouse_y: mouse_xy.y,
                            event_type: com.evt_type
                        });
                    }
                } else {
                    if (m.game) {
                        // Game is open, send it the mouse event
                        m.game.controller.handleMouseEvent({
                            evt: com.evt,
                            evt_type: com.evt_type,
                            xy: mouse_xy
                        });
                    }
                }
            },
            timerEvent: function (com) {
                /*
                    Operates timed events at 30 fps
                */
                // Operate the Game Grid if it exists
                if (m.game) {
                    m.game.controller.timerEvent({});
                    if (m.game.model.side) {
                        m.game.model.side.controller.timerEvent({});
                    }
                }
                if (m.side) {
                    t.controller.passSideEvent();
                }
                // Update the canvas
                v.updateCanvas();
            },
            checkLevelSpots: function (com) {
                /*
                    Checks mouse location versus all level
                    hot spots
                    
                    Arguments
                    com.mouse_x: The x location of the mouse
                    com.mouse_y: The y location of the mouse
                    com.event_type: String value of mouse action (up/down/move) 
                */
                var inside_spot; // Boolean: Is the mouse inside the current spot?
                var level_spot; // String: Spot ID of the level spot being checked
                var shown_name; // String: The name of the crowd member rolled over
                var shown_split; // Array: shown_name split by |-+-| delimiter
                // clear hot spot mouse down for 'down' event_type
                if (com.event_type == 'down') {
                    if (m.spot_mousedown != '') {
                        if (m.level_spots[m.spot_mousedown]) {
                            m.level_spots[m.spot_mousedown].controller.setMouseDowned({
                                mouse_down: false
                            });
                        }
                        m.spot_mousedown = '';
                    }
                }
                m.spot_name = '';
                // Skip all checks if a blocker is up
                if (m.popup_blocker == false) {
                    // Loop through all level spots
                    for (level_spot in m.level_spots) {
                        if (m.level_spots.hasOwnProperty(level_spot)) {
                            if (m.level_spots[level_spot].controller.getActive() == true) {
                                shown_name = m.level_spots[level_spot].controller.checkInsideCrowd({
                                    x: com.mouse_x,
                                    y: com.mouse_y
                                });
                                if (shown_name != "") {
                                    shown_split = shown_name.split("|-+-|");
                                    m.spot_name = shown_split[0];
                                    m.spot_name_x = Number(shown_split[1]);
                                    m.spot_name_y = Number(shown_split[2]);
                                }
                                inside_spot = m.level_spots[level_spot].controller.checkMouseInside({
                                    x: com.mouse_x,
                                    y: com.mouse_y
                                });
                                if (inside_spot == true) {
                                    if (com.event_type == 'down') {
                                        m.spot_mousedown = level_spot;
                                        m.level_spots[level_spot].controller.setMouseDowned({
                                            mouse_down: true
                                        });
                                    }
                                    if (com.event_type == 'up') {
                                        if (m.spot_mousedown == level_spot) {
                                            if (m.level_spots[level_spot].controller.getLocked() == false) {
                                                m.spot_name = "";
                                                m.level_number = Number(m.level_spots[level_spot].controller.getID());
                                                t.controller.startLevel();
                                                break;
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                    }
                }
                if (com.event_type == 'up') {
                    // clear hot spot mouse down id
                    if (m.spot_mousedown != '') {
                        if (m.level_spots[m.spot_mousedown]) {
                            m.level_spots[m.spot_mousedown].controller.setMouseDowned({
                                mouse_down: false
                            });
                        }
                        m.spot_mousedown = '';
                    }
                }
            },
            insideRect: function (com) {
                /*
                    Returns true if a given point is inside
                    of a given rectangle
                    
                    Arguments:
                    com.left: Left edge of the rectangle
                    com.right: Right edge of the rectangle
                    com.top: Top edge of the rectangle
                    com.bottom: Bottom edge of the rectangle
                    com.x_pos: X position of the point being checked
                    com.y_pos: Y position of the point being checked
                */
                if (com.x_pos < com.left) {
                    return false;   
                }
                if (com.x_pos > com.right) {
                    return false;   
                }
                if (com.y_pos < com.top) {
                    return false;   
                }
                if (com.y_pos > com.bottom) {
                    return false;   
                }
                return true;
            },
            rnd: function (com) {
                /*
                    Returns a random number
                    
                    Arguments
                    com.min: Minimum int number in range (defaults to 0)
                    com.max: Maximum int number in range (defaults to 100)
                    
                    Returns
                    A number in the range
                */
                var random_number; // Number: Number to be returned
                var delta; // Number: Difference between min and max
                random_number = 0;
                if (!com.min) {
                    com.min = 0;
                }
                if (!com.max) {
                    com.max = 100;
                }
                delta = Math.floor(com.max) - Math.floor(com.min);
                if (delta < 1) {
                    random_number = Math.floor(com.min);
                } else {
                    random_number = Math.floor(Math.random()*(delta + 1));
                    if (random_number < 0) {
                        random_number = 0;
                    } 
                    if (random_number >= delta) { 
                        random_number = delta - 1;
                    }
                    random_number = random_number + Math.floor(com.min);
                }
                return random_number;
            },
            getXYmouse: function (com) {
                /*
                    Calculates and returns work area x and y
                    positions based on mouse event
                    
                    Arguments
                    com.e: The mouse event
                */
                var calculated_position; // Object: Returns the x and y position
                var position_object; // Object: Holds x and y of the mouse
                var offset_object; // Object: Object to read the offset from
                var x_left; // Number: The left edge value of the canvas
                var y_top; // Number: The top edge value of the canvas         
                offset_object = m.canvas_element;
		        y_top = 0;
		        x_left = 0;
		        while (offset_object && offset_object.tagName != 'body') {
		            y_top = y_top + offset_object.offsetTop;
		            x_left = x_left + offset_object.offsetLeft;
		            offset_object = offset_object.offsetParent;
		        }
                // Get x and y postion from the mouse event
                position_object = {};
                position_object.x = com.e.clientX - x_left + window.pageXOffset;
    		    position_object.y = com.e.clientY - y_top + window.pageYOffset;
    		    return position_object;
            },
            addButton: function (com) {
                /*
                    Adds a button to the interface
                
                    Arguments
                    com.button_id: The ID of the button to add
                    com.left: The left edge of the button
                    com.top: The top edge of the button
                    com.right: The right edge of the button
                    com.bottom: The bottom edge of the button
                */
                m.interface_buttons[com.button_id] = {};
                m.interface_buttons[com.button_id].id = com.button_id;
                m.interface_buttons[com.button_id].left = com.left;
                m.interface_buttons[com.button_id].top = com.top;
                m.interface_buttons[com.button_id].right = com.right;
                m.interface_buttons[com.button_id].bottom = com.bottom;
            },
            removeButton: function (com) {
                /*
                    Removes a button from the interface
                    
                    Arguments
                    com.button_id: The ID of the button to remove
                */
                if (m.interface_buttons[com.button_id]) {
                    delete m.interface_buttons[com.button_id];
                }
            },
            executeButton: function (com) {
                /*
                    Execute a user selected button via
                    AJAX call
                
                    Arguments:
                    com.type: The ID of button pressed
                */
                var store_okayed; // Boolean: Is it okay to open the store?
                if (com.type == 'store') {
                    t.controller.openMenu({
                        menu_id: 'store',
                        blocker: true,
                        x: Math.floor(m.width / 2)
                    });
                    if (m.game) {
                        // Freeze game timers
                        m.game.controller.freezeGame({
                            freeze: true
                        });
                    }
                }
                if (com.type == 'volume') {
                    // Toggle game volume
                    m.sound_state = !m.sound_state;
                    // Display change to button
                    t.controller.updateSideMenu({
                        area: 'buttons'
                    });
                }
                if (com.type == 'music') {
                    // Toggle game music
                    m.music_state = !m.music_state;
                    // Display change to button
                    t.controller.updateSideMenu({
                        area: 'buttons'
                    });
                }
                if (com.type == 'help') {
                    // Tell menu that it is in future mode
                    m.menu_state = 'help_popup';
                    // Launch help screen
                    t.controller.openMenu({
                        menu_id: 'help',
                        blocker: true,
                        x: Math.floor(m.width / 2)
                    });
                }
                if (m.game) {
                    if (com.type == 'exit' && m.popup_menus.length == 0 && m.game.controller.getGameState().indexOf('Animation') == -1) {
                        if (m.test_level != "") {
                        	window.close();
                        } else {
	                        // Launch Exit 'Are you sure' modal box
	                        t.controller.openMenu({
	                            menu_id: 'quit_sure' 
	                        });
	                        // Freeze game timers
	                        m.game.controller.freezeGame({
	                            freeze: true
	                        });
	                    }
	                }
                }
            },
            menuMouseEvent: function (com) {
                /*
                    Operates popup menu mouse events
                    
                    Arguments
                    com.evt: The mouse event
                    com.evt_type: The mouse event type
                */
                var menu_index; // Number: Index of the hit menu
                var button_obj; // Object: Pointer to menu buttons object
                var check_button; // Object: Current button being checked
                var i; // Number: Decrement Var
                var mouse_xy; // Object: Holds the x and y position of the mouse
                var is_blocked; // Boolean: Has a background blocker been used?
                // Init function values
                i = m.total_popups;
                mouse_xy = t.controller.getXYmouse({
                            e: com.evt
                        });
                is_blocked = false;
                // Loop through all menus to find button hits
                while (i > 0) {
                    i = i - 1;
                    if (m.popup_menus[i].controller.getState() == 'input') {
                        button_obj = m.popup_menus[i].controller.getButtons();
                        for (check_button in button_obj) {
                            if (button_obj.hasOwnProperty(check_button)) {
                                // Set mouse outside of the button
                                m.popup_menus[i].controller.
                                    setMouseInside({
                                        button_id: button_obj[check_button].id,
                                        mouse_inside: false
                                    });
                                // Check if mouse is inside of button and no blocker used
                                if (mouse_xy.x >= button_obj[check_button].x
                                        && mouse_xy.y
                                        >= button_obj[check_button].y
                                        && mouse_xy.x
                                        < button_obj[check_button].x
                                        + button_obj[check_button].width
                                        && mouse_xy.y
                                        < button_obj[check_button].y
                                        + button_obj[check_button].height
                                        && is_blocked == false) {
                                    m.popup_menus[i].controller.setMouseInside({
                                        button_id: button_obj[check_button].id,
                                        mouse_inside: true
                                    });
                                    if (com.evt_type == 'down') {
                                        if (m.button_hit_id != '') {
                                            menu_index = t.controller
                                                .findMenuID({
                                                    menu_id: m.button_hit_menu
                                                });
                                            m.popup_menus[menu_index]
                                                .controller.setMouseDowned({
                                                    button_id: m.button_hit_id,
                                                    mouse_down: false
                                                });
                                        }
                                        m.button_hit_id
                                            = button_obj[check_button].id;
                                        m.button_hit_menu = m.popup_menus[i]
                                            .controller.getID();
                                        m.popup_menus[i].controller
                                            .setMouseDowned({
                                                button_id: m.button_hit_id,
                                                mouse_down: true
                                        });
                                    }
                                    if (com.evt_type == 'up') {
                                        if (button_obj[check_button].id
                                                == m.button_hit_id) {
                                            if (m.popup_menus[i]
                                                    .controller.getID()
                                                    == m.button_hit_menu) {
                                                t.controller.menuButtonHit({
                                                    button_id: m.button_hit_id,
                                                    menu_id: m.button_hit_menu,
                                                    menu_instance: m.popup_menus[i]
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // Block all other button hits if blocker has been used
                    if (m.popup_menus[i].controller.getBlocker() == true) {
                        is_blocked = true;
                    }
                }
                // Clear previous button_hit on mouse up
                if (com.evt_type == 'up') {
                    if (m.button_hit_id != '') {
                        menu_index = t.controller.findMenuID({
                            menu_id: m.button_hit_menu
                        });
                        m.popup_menus[menu_index].controller.setMouseDowned({
                            button_id: m.button_hit_id,
                            mouse_down: false
                        });
                    }
                    m.button_hit_id = '';
                    m.button_hit_menu = '';
                }
            },
            reloadLevel: function (com) {
            	$.ajax({
                    url: "php/BB_playLevel.php",
                    type: "GET",
                    data: {
                    	user_id: m.user_id,
                    	index: m.level_number
                    },
                    success:
                        function (result) {
                            BBM({
                                com: 'loadedPlayLevel',
                                data: result
                            });
                        },
                    error:
                        function (my_error) {
                            BBM({
                                com: 'loadedPlayLevel',
                                data: 'error'
                            });
                        }
                });
            },
            loadedPlayLevel: function (com) {
            	// Hide loading message
	            t.controller.closeMenu({
	                menu_id: 'loading'
	            });
	            if (com.data.substr(0, 100) ==  m.level_load) {
            		// Start the game
            		m.game.controller.executeExperiment({});
                    // Remove help button and add exit button
                    t.controller.removeButton({
                    	button_id: 'help'
                    });
                    t.controller.addButton({
                    	button_id: 'exit',
                    	left: 127,
                    	top: 13,
                    	right: 160,
                    	bottom: 36
                	});
                	// Reset the lives and life time
                	t.controller.checkNextLife();
            	} else {
            		if (com.data.substr(0, 5) == "error") {
            			// Display error pop-up	
            			t.controller.openMenu({
                        	menu_id: 'level_error',
                        	blocker: true   
                    	});
            		} else {
            			if (com.data.substr(1, 8) == "no_lives") {
            				// Display no lives pop-up	
            				t.controller.openMenu({
                                menu_id: 'no_lives',
                                blocker: true   
                            });
            			} else {
            				console.log("unknown failure: ", com.data.substr(0, 100));
            			}
            		}
            	}
            },
            menuButtonHit: function (com) {
                /*
                    Executes all the button hits for all menus
                    
                    Arguments
                    com.button_id: The button that was clicked
                    com.menu_id: The menu that the button was clicked on
                */
                var enhance_index; // Number: Index of enhancement selected
                var menu_index; // Number: Index of menu_id
                var toggle_value; // Boolean: Toggle value to change
                if (com.menu_id == 'start_game') {
                    if (com.button_id == 'lab') {
                        m.menu_com = 'close';
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                        t.controller.closeMenu({
                            menu_id: 'high_scores'
                        });
                    }
                    if (com.button_id == 'start') {
                        // Close popup menus
                        t.controller.closeMenu({
                            menu_id: 'start_game'
                        });
                        t.controller.closeMenu({
                            menu_id: 'high_scores'
                        });
                        t.controller.closeMenu({
                            menu_id: 'scroll' 
                        });
                        if (m.game) {
                        	// Show the loading menu
                        	t.controller.openMenu({
			                    menu_id: 'loading',
			                    blocker: true,
			                    x: Math.floor(m.width / 2)
			                });
                        	// Reload the level to play
                        	t.controller.reloadLevel();
                        }
                    }
                    if (com.button_id.indexOf('enhance') > -1) {
                        enhance_index = Number(com.button_id.substr(7, 1));
                        if (m.atomic_enhancements[enhance_index] == 0) {
                            t.controller.openMenu({
                                menu_id: 'store',
                                blocker: true   
                            });
                        }
                        if (m.atomic_enhancements[enhance_index] > 0) {
                            m.enhancements_used[enhance_index] == !m.enhancements_used[enhance_index];
                            menu_index = t.controller.findMenuID({
                                menu_id: com.menu_id
                            });
                            if (menu_index > -1) {
                                toggle_value = !(m.popup_menus[menu_index]
                                    .controller.getButtonSelected({
                                        id: com.button_id
                                    }));
                                m.popup_menus[menu_index].controller.setButtonSelected({
                                        id: com.button_id,
                                        selected: toggle_value
                                    });
                            }
                        }
                    }
                }
                if (com.menu_id == 'fail_moves') {
                    if (com.button_id == 'end') {
                    	// Close window if in test mode
                    	if (m.level_test != "") {
                    		window.close();
                    	}
                    	m.menu_com = 'end';
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                    if (com.button_id == 'moves') {
                        t.controller.requestExpense({
                            code: 'game_5moves'       
                        });
                        menu_index = t.controller.findMenuID({
                            menu_id: com.menu_id
                        });
                        if (menu_index > -1) {
                            m.popup_menus[menu_index].controller
                                .setButtonActive({
                                    button_id: 'moves',
                                    active: false
                                });
                            m.popup_menus[menu_index].controller
                                .setButtonActive({
                                    button_id: 'end',
                                    active: false
                                });
                        }
                    }
                }
                if (com.menu_id == 'fail_implode') {
                    if (com.button_id == 'end') {
                    	if (m.level_test != "") {
                    		window.close();
                    	}
                        m.menu_com = 'end';
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                    if (com.button_id == 'five') {
                        t.controller.requestExpense({
                            code: 'game_5counts'       
                        });
                        menu_index = t.controller.findMenuID({
                            menu_id: com.menu_id
                        });
                        if (menu_index > -1) {
                            m.popup_menus[menu_index].controller
                                .setButtonActive({
                                    button_id: 'five',
                                    active: false
                                });
                            m.popup_menus[menu_index].controller
                                .setButtonActive({
                                    button_id: 'end',
                                    active: false
                                });
                        }
                    }
                }
                if (com.menu_id == 'fail_score' || com.menu_id == 'fail_legal' || com.menu_id == 'fail_criteria') {
                    if (com.button_id == 'lab') {
                        // Shorten the side menu
                        m.side.controller.closeSideMenu();
                        // Tell Level Menu to operate normally
                        m.menu_com = 'close';
                        // Close Fail PopUp
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                    if (com.button_id == 'try') {
                        // Shorten the side menu
                        m.side.controller.closeSideMenu();
                        // Tell Level Menu to try to relaunch the same level
                        m.menu_com = 'game';
                        // Close Fail PopUp
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                }
                if (com.menu_id == 'quit_sure') {
                    if (com.button_id == 'lab') {
                    	// Close window if in test mode
                    	if (m.level_test != "") {
                    		window.close();
                    	}
                        // Shorten the side menu
                        m.side.controller.closeSideMenu();
                        // Tell Level Menu to operate normally
                        m.menu_com = 'close';
                        // Close Fail PopUp
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                    if (com.button_id == 'resume') {
                        // Close Quit Safety PopUp
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                }
                if (com.menu_id == 'success' || com.menu_id == 'success_advance') {
                	// Close window if in test mode
                    if (m.level_test != "") {
                    	window.close();
                    }
                    if (com.button_id == 'lab') {
                    	// Shorten the side menu
                        m.side.controller.closeSideMenu();
                        // Tell Level Menu to operate normally
                        m.menu_com = 'close';
                        // Close Success and High Score PopUps
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                        t.controller.closeMenu({
                            menu_id: 'high_scores'
                        });
                    }
                    if (com.button_id == 'share') {
                        // Cause side panel to redraw
                        m.update_side_panel = true;
                        // Open the score sharing popup
                        t.controller.openMenu({
                            menu_id: 'share_score',
                            blocker: true
                        });
                    }
                    if (com.button_id == 'next') {
                        // Shorten the side menu
                        m.side.controller.closeSideMenu();
                        // Cause Level Menu to Advance
                        m.menu_com = 'advance';
                        // Close Success and High Score PopUps
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                        t.controller.closeMenu({
                            menu_id: 'high_scores'
                        });
                    }
                }
                if (com.menu_id == 'invites') {
                	// Invite facebook friends to game
                    if (com.button_id == 'nomark') {
                    	// Select all friends and change select all flag
                    	com.menu_instance.controller.inviteSelectAll(true);
                    	return;
                    }
                    if (com.button_id == 'checkmark') {
                    	// Deselect all friends and change select all flag
                    	com.menu_instance.controller.inviteSelectAll(false);
                    	return;
                    }
                    if (com.button_id == 'current') {
                    	// Search names by string input
                    	com.menu_instance.controller.inviteSearch();
                    }
                    if (com.button_id == 'invite') {
                    	// Close menu and send invites
                    	
                    	// Facebook invite
                    	
                    	t.controller.closeMenu({
                            menu_id: 'invites'
                        });
                    }
                    if (com.button_id == 'next') {
                    	// Close menu
                        t.controller.closeMenu({
                            menu_id: 'invites'
                        });
                    }
                }
                if (com.menu_id == 'scroll') {
                    if (com.button_id == 'story') {
                        // Tell menu that it is in story mode
                        m.menu_state = 'story_popup';
                        // Launch story screen
                        t.controller.openMenu({
                            menu_id: 'story',
                            blocker: true,
                            x: Math.floor(m.width / 2)
                        });
                    }
                    if (com.button_id == 'future') {
                        // Tell menu that it is in future mode
                        m.menu_state = 'future_popup';
                        // Launch story screen
                        t.controller.openMenu({
                            menu_id: 'future',
                            blocker: true,
                            x: Math.floor(m.width / 2)
                        });
                    }
                    if (com.button_id == 'up') {
                        // Move lab view up by one lab
                        m.lab_number = m.lab_number + 1;
                        t.controller.loadLab();
                    }
                    if (com.button_id == 'current') {
                        // Move lab view to current level container
                        if (m.lab_number != m.lab_reached) {
                            m.lab_number = m.lab_reached;
                            t.controller.loadLab();
                        }
                    }
                    if (com.button_id == 'down') {
                        // Move lab view up by one lab
                        m.lab_number = m.lab_number - 1;
                        t.controller.loadLab();
                    }
                }
                if (com.menu_id == 'story' || com.menu_id == 'future'
                        || com.menu_id == 'help') {
                    // Close current popup
                    t.controller.closeMenu({
                        menu_id: com.menu_id
                    });
                }
                if (com.menu_id == 'store') {
                    if (com.button_id == 'back') {
                        // Close store popup
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                }
                if (com.menu_id == 'share_score') {
                    if (com.button_id == 'back') {
                    	// Renable the menu screen
                    	
                        // Close share popup
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                }
                if (com.menu_id == 'no_lives') {
                    if (com.button_id == 'back') {
                    	// Renable the menu screen
                    	m.menu_com = 'close';
                        // Close share popup
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                }
                if (com.menu_id == 'level_error') {
                    if (com.button_id == 'back') {
                    	// Renable the menu screen
                    	m.menu_com = 'close';
                        // Close share popup
                        t.controller.closeMenu({
                            menu_id: com.menu_id
                        });
                    }
                }
            },
            findMenuID: function (com) {
                /*
                    Returns the index number of a menu id
                    
                    Arguments
                    com.menu_id: The ID of the menu to find
                */
                var i; // Number: Increment Var
                var menu_index;
                // Init function values
                menu_index = -1;
                for (i = 0; i < m.total_popups; i++) {
                    if (com.menu_id == m.popup_menus[i].controller.getID()) {
                        menu_index = i;
                        break;
                    }
                }
                return menu_index;                
            },
            passSideEvent: function (com) {
                /*
                    Passes timer event to side display
                */
                if (m.side) {
                    m.side.controller.timerEvent({});
                }
            },
            openMenu: function (com) {
                /*
                    Opens a popup menu
                    
                    Arguments
                    com.menu_id: ID of the popup menu to open
                    com.blocker: Add a background blocker?
                    com.x: The x position of the center of the menu
                    com.y: The y position of the center of the menu
                    com.delay: Milliseconds addition delay until opening
                    
                    Returns
                    A boolean for whether the menu was opened
                */
                var popup_delay; // Number: Delay until opening
                var game_data; // Object: Pointer game data model
                var i; // Number: Increment Var
                var is_opening; // Boolean: Is the menu opening?
                var has_blocker; // Boolean: Has background blocker
                // Init function values
                for (i = 0; i < m.total_popups; i++) {
                    if (m.popup_menus[i].controller.getID() == com.menu_id) {
                        console.log(m.popup_menu.controller.getID()
                            + ' menu was already open when ' + com.menu_id
                            + ' menu attempted to launch');   
                        return false;
                    }
                }
                // Set default x and y positions if not entered
                if (!com.x) {
                    // Center of the game area
                    if (m.game) {
                        com.x = m.side_width + Math.floor((m.width 
                            - m.side_width) /2);
                    } else {
                        com.x = Math.floor(m.width /2);
                    }
                }
                if (!com.y) {
                    // Center of the game area
                    com.y = Math.floor(m.height / 2);
                }
                // Set default delay if not entered
                popup_delay = 0;
                if (com.delay) {
                    popup_delay = com.delay;   
                }
                // Set game data model if it exists
                game_data = null;
                if (m.game) {
                    game_data = m.game.model;
                }
                // Set Blocker if one exists
                has_blocker = false;
                if (com.blocker) {
                    has_blocker = com.blocker;
                    m.popup_blocker = true;
                }
                m.popup_menus.push(
                    new POPUP_MENU({
                        com: 'init',
                        menu_data: m,
                        game_data: game_data,
                        menu_id: com.menu_id,
                        x: com.x,
                        y: com.y,
                        blocker: has_blocker
                    })
                );
                m.total_popups = m.total_popups + 1;
                // Open the popup menu if it exists
                is_opening = m.popup_menus[m.total_popups - 1].controller
                    .openMenu({
                        menu_id: com.menu_id, 
                        delay: popup_delay
                    });
                return is_opening;
            },
            closeMenu: function (com) {
                /*
                    Closes a popup menu
                    
                    Arguments
                    com.menu_id: ID of the popup menu to open
                    
                    Returns
                    A boolean for whether the menu was closed
                */
                var i; // Number: Increment Var
                var is_closing; // Boolean: Is the menu closing?
                // Init function values
                for (i = 0; i < m.total_popups; i++) {
                    if (m.popup_menus[i].controller.getID() == com.menu_id) {
                        is_closing = m.popup_menus[i].controller.closeMenu({
                            menu_id: com.menu_id
                        });
                        return is_closing;
                    }
                }
                return false;
            },
            menuClosed: function (com) {
                /*
                    Menu has closed, remove it from the
                    menu array
                    
                    Arguments
                    com.id: The id of the menu that was closed
                */
                var auto_advance = false;
                var i; // Number: Increment Var
                // reset the popup blocker
                m.popup_blocker = false;
                for (i = 0; i < m.total_popups; i++) {
                    if (m.popup_menus[i].controller.getID() == com.id) {
                        m.popup_menus.splice(i, 1);
                        m.total_popups = m.total_popups - 1;
                        i = i - 1;
                    } else {
                        if (m.popup_menus[i].controller.getBlocker() == true) {
                            m.popup_blocker = true;
                        }
                    }
                }
                if (com.id == 'start_game' || com.id == 'no_lives' || com.id == 'level_error') {
                    if (m.menu_com == 'close') {
                    	if (com.id != 'start_game') {
                    		// Restart Level
                        	t.controller.disposeGame({});
                    	}
                    	// Tell the menu that it is active
                        m.menu_state = 'active';
                        // Display Level Menu
                		m.show_menu = true;
                    }   
                }
                if (com.id == 'fail_moves' || com.id == 'fail_implode') {
                    if (m.menu_com == 'end') {
                        if (com.id == 'fail_moves') {
                            // Start Popper Animation
                            if (m.game) {
                                m.game.controller.setGameState({
                                     state: 'initPopperAnimation'
                                });
                            }
                        } else {
                            // Start Implode Animation
                            if (m.game) {
                                m.game.controller.setGameState({
                                     state: 'initImplodeAnimation'
                                });
                            }
                        }
                    } else {
                        // restart game play
                         
                    }
                }
                if (com.id == 'quit_sure') {
                    if (m.menu_com == 'close') {
                        // Restart Level
                        t.controller.disposeGame({});
                    } else {
                        // Resume game timers
                        m.game.controller.freezeGame({
                            freeze: false
                        });   
                    }
                }
                if (com.id == 'fail_score' || com.id == 'fail_legal' || com.id == 'fail_criteria') {
                    // Dispose Game Grid
                    t.controller.disposeGame({});
                    if (m.menu_com == 'game') {
                        // Restart Level
                        t.controller.startLevel();
                    }
                }
                if (com.id == 'success' || com.id == 'success_advance') {
                    // Dispose Game Grid
                    t.controller.disposeGame({});
                    // Start advance animation if needed
                    if (com.id == 'success_advance') {
                    	auto_advance = (m.menu_com == 'advance');
                    	t.controller.startLevelAdvanceAnimation(auto_advance);
                    }
                }
                if (com.id == 'story' || com.id == 'future' || com.id == 'help' || com.id == 'invites') {
                    // Tell the menu that it is active
                    m.menu_state = 'active';
                }
                if (com.id == 'store') {
                	if (m.game) {
                		// Resume game timers
                        m.game.controller.freezeGame({
                            freeze: false
                        });  
                	}	
                }
            },
            startLevelAdvanceAnimation: function (start_level) {
            	/*
                    Set up the start of the advance/end lab animation
                    
                    Arguments
                    start_level: Boolean, should the level start after the animation?
                */
            	var start_point = m.level_spots['spot_' + m.level_reached].controller.getUserPosition();
            	var end_point;
            	var dif_x;
            	var dif_y;
            	var travel_distance;
            	var travel_speed = 20;
            	var travel_duration;
            	var level_mod = m.level_reached % 15;
            	if (m.level_reached + 1 == m.total_levels) {
            		// Tell the menu that it is active
                	m.menu_state = 'active';
                	// Display Level Menu
                	m.show_menu = true;
                	return;
            	}
            	if (level_mod == 14) {
            		// Start lab end animation
            		m.menu_state = 'labEndAnimation';
            	} else {
            		// Set the menu state for animation
            		m.menu_state = 'advanceAnimation';
            		// Set the animation params
            		end_point = m.level_spots['spot_' + (m.level_reached + 1)].controller.getUserPosition();
            		// calculate travel distance
            		dif_x = end_point.x - start_point.x;
            		dif_y = end_point.y - start_point.y;
            		travel_distance = Math.sqrt((dif_x * dif_x) + (dif_y * dif_y));
            		travel_duration = travel_distance * travel_speed;
	            	m.advance_animation = {
	            		active: true,
	            		start_x: start_point.x,
	            		start_y: start_point.y,
	            		end_x: end_point.x,
	            		end_y: end_point.y,
	            		start_time: Date.now(),
	            		duration: travel_duration,
	            		auto_start: start_level
	            	};
            	}
            },
			endLevelAdvanceAnimation: function () {
	            /*
	            	End advancement animation and advance data
	            */
        		// End advance animation
        		m.advance_animation.active = false;
        		// Advance maximum level
        		m.level_spots['spot_' + m.level_reached].controller.removeFromCrowd({
        			friend: m.friends['id_' + m.user_id].id
        		});
        		m.level_reached = m.level_reached + 1;
        		m.level_spots['spot_' + m.level_reached].controller.addToCrowd({
                	friend: m.friends['id_' + m.user_id].id,
                    name: m.friends['id_' + m.user_id].name.split(' ')[0],
                    image: m.friends['id_' + m.user_id].icon_image
                });
                m.friends['id_' + m.user_id].level = m.level_reached;
        		// End Advance Animation and unlock menu. Execute autostart, if set
        		m.level_spots['spot_' + m.level_reached].controller.setLocked({
        			locked: false
        		});
        		if (m.advance_animation.auto_start) {
        			// Start Level
        			m.level_number = m.level_reached;
                    t.controller.startLevel();
        		} else {
        			// Tell the menu that it is active
                	m.menu_state = 'active';
                	// Display Level Menu
                	m.show_menu = true;
        		}
        	},
            disposeGame: function (com) {
                /*
                    Disposes of the game and resumes display
                    of the level menu
                */
                m.game = null;
                // Tell the menu that it is active
                m.menu_state = 'active';
                m.show_menu = true;
                // Open Scroll Menu
                t.controller.openMenu({
                    menu_id: 'scroll',
                    x: 733,
                    y: 2     
                });
                // Remove Exit and Add Help button
                t.controller.removeButton({
                    button_id: 'exit'
                });
                t.controller.addButton({
                    button_id: 'help',
                    left: 127,
                    top: 13,
                    right: 160,
                    bottom: 36
                });
            },
            requestExpense: function (com) {
                /*
                    Uses AJAX call to request an expense from
                    the user account
                    
                    Arguments
                    com.code: Purchase code to be calculated
                */
                
                console.log('Expense Request for ' + com.code);
            },
            completeLoaded: function (com) {
                /*
                    Executes fizz animation if non-error return
                    
                    Arguments
                    com.data: Data returned from the complete_level
                    com.meter_level: The value of the meter when the game was completed
                    com.type_game: What type of game was completed
                */
                var is_error = false;
                var trimmed_data = com.data.split(String.fromCharCode(10)).join("");
                if (trimmed_data.length > 4) {
                    if (trimmed_data.substr(0, 5).toLowerCase() == "error") {
                        is_error = true;
                    }    
                }
                if (is_error == false) {
                    // Start fizz animation
                    m.live_fizz = true;
                    // Reload lives
                    t.controller.checkNextLife({});
                }
                // Modify the level display on menu
				if (m.test_level == "") {
					if (!m.level_overviews[String(m.level_number)]) {
						m.level_overviews[String(m.level_number)] = {
							"level_meter": String(com.meter_level + 1),
	                        "level_type": com.type_game
						};
						m.level_spots['spot_' + m.level_number].controller.setMeterLevel({
			        		meter_level: String(com.meter_level + 1)
			        	});
			        	m.level_spots['spot_' + m.level_number].controller.setLevelType({
		        			level_type: com.type_game
		        		});
					} else {
						if (com.meter_level + 1 > Number(m.level_overviews[String(m.level_number)].level_meter)) {
							m.level_overviews[String(m.level_number)].level_meter = String(com.meter_level + 1);
							m.level_spots['spot_' + m.level_number].controller.setMeterLevel({
			        			meter_level: String(com.meter_level + 1)
			        		});
						}
					}
				}
				// Open success menus
                m.success_menu = "success";
                if (trimmed_data == "next") {
                    m.success_menu = "success_advance";
                }
                m.game.controller.completeLoad({});
            },
            highscoresLoaded: function (com) {
                /*
                    Pass through to game
                */
                m.game.controller.parseHighscores(com);   
            },
            checkNextLife: function (com) {
            	/**
            		Polls the database for if a new life should be
            		granted
            	*/
            	m.life_check = true;
                $.ajax({
                    url: "php/life_check.php",
                    type: "GET",
                    data: {
                    	user_id: m.user_id
                    },
                    success:
                        function (result) {
                            BBM({
                                com: 'loadedLifeCheck',
                                data: result
                            });
                        },
                    error:
                        function (my_error) {
                            BBM({
                                com: 'loadedLifeCheck',
                                error: my_error
                            });
                        }
                });
            },
            loadedLifeCheck: function (com) {
            	/*
            		Reply from life check
            		
            		Arguments
                    com.data: Reply from life check rest api
                    com.error: Error from life check rest api
            	*/
            	var user_data_list; // Array: com.data split by line
            	var lines; // Number: Total number of lines
            	var i; // Number: Increment var
            	var com_split; // Array: Line split by ": "   Key/value pair
            	var life_time_split; // Array: next life split on space
                var date_split; // Array: Year, month, and day
                var date_year; // Number: Year (####)
                var date_month; // Number Month (0-11)
                var date_day; // Number: Day (1-31)
                var time_split; // Array: Hours, minutes, and seconds
                var time_hour; // Number: Hour (0-23)
                var time_minutes; // Number: Minutes (0-59)
                var time_seconds; // Number: Seconds (0-59)
            	m.life_check = false;
            	if (com.error) {
            		console.log("Life check error: ", com.error);
            		return;
            	}
            	if (com.data) {
            		user_data_list = com.data.split("\n");
            		lines = user_data_list.length;
            		for (i = 0; i < lines; i++) {
            			com_split = user_data_list[i].split(": ");
            			if (com_split[0] == "lives") {
            				m.lives = Number(com_split[1]);
            				if (m.lives == m.max_lives) {
            					m.next_life = -1;
            				}
            			}
            			if (com_split[0] == "next_left") {
            				life_time_split = com_split[1].split(" ");
                    		date_split = life_time_split[0].split("-");
                    		date_year = Number(date_split[0]);
                    		date_month = Number(date_split[1]) - 1;
                    		date_day = Number(date_split[2]);
                    		time_split = life_time_split[1].split(":");
                    		time_hour = Number(time_split[0]);
                    		time_minutes = Number(time_split[1]);
                    		time_seconds = Number(time_split[2]);
                    		m.next_life = new Date(date_year, date_month, date_day, time_hour, time_minutes, time_seconds, 0);
            			}
            		}
            	}
            	// End fizz animation
                m.live_fizz = false;
            }
        };
    }
    if (this.controller[command.com]) {
        // Execute controller function if present and return value
        return this.controller[command.com](command);
    }
    // Give warning when command is missing
    console.log("*** Warning *** (BBG) No Command: " + command.com);
    return this;
};