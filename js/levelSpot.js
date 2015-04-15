/*
    Code for a Big Bang Game Level
*/

var LEVEL_SPOT; // Function: Contains MVC for draw functions

LEVEL_SPOT = function (command) {
    /*
        Contains MVC for atom object. Executes the 
        controller function command.com if it is present.
        
        Arguments
        command: An object that contains the com and other data
    */
    var m; // Object: shortcut to this.model
    var v; // Object: shortcut to this.view
    var t; // Object: shortcut to this object
    t = this;
    if (!this.model) {
        this.model = {
            id: -1, // Number: The index number of the level
            file_name: '', // String: The filename of the connected level
            experiment_type: '', // String: Icon to show for experiment type
            meter_level: -1, // Number: Level to show meter at
            best_score: 0, // Number: Player's best score
            roll_left: 0, // Number: Left edge of the rollover area
            roll_top: 0, // Number: Top edge of the rollover area
            roll_right: 0, // Number: Right edge of the rollover area
            roll_bottom: 0, // Number: Bottom edge of the rollover area
            thumb_x: 0, // Number: X position of the experiment thumbnail
            thumb_y: 0, // Number: Y position of the experiment thumbnail
            meter_x: 0, // Number: X position of the score meter
            meter_y: 0, // Number: Y position of the score meter
            number_x: 0, // Number: X position of the experiment number
            number_y: 0, // Number: Y position of the experiemnt number
            experiment_x: 0, // Number: X position of the experiment type icon
            experiment_y: 0, // Number: Y position of the experiment type icon
            icon_x: 0, // Number: X position of the player icon
            icon_y: 0, // Number: Y position of the player icon
            icon_angle: 0, // Number: Angle from player icon to thumbnail
            angle_offsets: [-70, 70, 0, 13, -13, 45, -45], // Array: List of angle offsets for friend placement
            crowd: {}, // Object: Group of friends located at this level 
            user_id: '', // String: ID of the user on in the crowd
            mouse_inside: false, // Boolean: Is the mouse inside the rollover area?
            mouse_downed: false, // Boolean: Has the mouse been clicked inside the rollover area?
            active: true, // Boolean: Is the level spot active?
            locked: true, // Boolean: Is the level locked and not playable?
            mm: null, // Object: Pointer to the menu data model
            cc: null  // Object: Pointer to canvas context to draw to
        };
    }
    m = this.model;
    if (!this.view) {
        this.view = {
            displaySpot: function (com) {
                /*
                    Draw the level spot overlay to the canvas
                */
                var x_source; // Number: X location on sprite sheet of source graphic
                var y_source; // Number: Y location on sprite sheet of source graphic
                if (m.mm) {
                    if (m.experiment_type != '') {
                        x_source = -1;
                        switch (m.experiment_type) {
                            case 'timed':
                                x_source = 0;
                                y_source = 0;
                                break;
                            case 'moves':
                                x_source = 0;
                                y_source = 0;
                                break;
                        }
                        if (x_source > -1) {
                            m.cc.drawImage(m.mm.menu_image,
                                x_source, y_source,
                                30, 30,
                                m.experiment_x, m.experiment_y,
                                30, 30);
                        }
                    }
                    // Draw score meter
                    if (m.meter_level > -1) {
                        x_source = 212 + (m.meter_level * 16);
                        m.cc.drawImage(m.mm.menu_image,
                            x_source, 558,
                            15, 62,
                            m.meter_x, m.meter_y,
                            15, 62);
                    }
                    // Draw thumbnail of level
                    if (m.mouse_inside == true) {
                        if (m.locked == true) {
                            m.cc.drawImage(m.mm.menu_image,
                                243, 626,
                                26, 26,
                                m.thumb_x + 13, m.thumb_y + 13,
                                26, 26);
                        } else {
                            x_source = 50 * (m.id % 15);
                            m.cc.drawImage(m.mm.lab_image,
                                x_source, 650,
                                50, 50,
                                m.thumb_x, m.thumb_y,
                                50, 50);
                        }
                    }
                    // Draw Experiment Number
                    if (m.id > -1) {
                        if (m.mouse_downed) {
                            BBM({
                    		    com: 'draw',
                    		    draw: 'number',
                    		    x: m.number_x,
                    		    y: m.number_y - 15,
                    		    value: m.id + 1,
                    		    size: 'large'
                    		});
                        } else {
                            BBM({
                    		    com: 'draw',
                    		    draw: 'number',
                    		    x: m.number_x,
                    		    y: m.number_y,
                    		    value: m.id + 1
                    		});
                    	}
                    }
                    // Display crowd around the experiment
                    t.view.displayCrowd();
                }
            },
            displayCrowd: function () {
                /*
                    Display the crowd around the experiment
                */
                var delta_x; // Number: cos of the icon angle
                var delta_y; // Number: sin of the icon angle
                var radians; // Number: Icon angle converted to radians
                var distance; // Number : Amount to move crowd by
                var friend_id; // String: Currently searched friend ID
                var friends_placed; // Number: Total number of friends placed
                var crowd_x; // Number: Base X location of crowd
                var crowd_y; // Number: Base Y location of crowd
                var friend_x; // Number: Location to draw friend at
                var friend_y; // Number: Location to draw friend at
                var friend_angle; // Number: Angle to friends location
                var has_image; // Boolean: Does the friend have an icon?
                // Init function values
                friends_placed = 0;
                distance = 0;
                crowd_x = m.icon_x + 19;
                crowd_y = m.icon_y + 19;
                radians = m.icon_angle * (Math.PI / 180);
                delta_x = Math.cos(radians);
                delta_y = Math.sin(radians);
                // Search for user in the crowd
                has_image = false;
                if (m.crowd[m.user_id]) {
                	if (m.mm.advance_animation.active == false) {
	                    if (m.crowd[m.user_id].image) {
	                        if (m.crowd[m.user_id].image.width > 0) {
	                            has_image = true;
	                        }
	                    }
	                    if (has_image) {
	                        m.cc.drawImage(m.crowd[m.user_id].image,
	                            0, 0,
	                            m.crowd[m.user_id].image.width,
	                            m.crowd[m.user_id].image.height,
	                            crowd_x - 19, crowd_y - 19,
	                            38, 38
	                        );
	                    } else {
	                        m.cc.drawImage(m.mm.menu_image,
	                            1116, 364,
	                            38, 38,
	                            crowd_x - 19, crowd_y - 19,
	                            38, 38
	                        );
	                    }
	                    // Set the current location for checking
	                    m.crowd[m.user_id].x = crowd_x - 19;
	                    m.crowd[m.user_id].y = crowd_y - 19;
	                    m.crowd[m.user_id].width = 38;
	                    m.crowd[m.user_id].height = 38;
	                }
                } else {
                    distance = 15;
                    radians = ((m.icon_angle + 180) % 360) * (Math.PI / 180);
                    delta_x = Math.cos(radians);
                    delta_y = Math.sin(radians);
                }
                // Change the crowd_x and crowd_y for rest of the crowd
                crowd_x = crowd_x + (delta_x * distance);
                crowd_y = crowd_y + (delta_y * distance);
                // Loop through all friends in the crowd
                for (friend_id in m.crowd) {
                    if (m.crowd.hasOwnProperty(friend_id)) {
                        if (friend_id != m.mm.user_id) {
                            // Adjust position of the friend in the crowd
                            distance = 55;
                            if (friends_placed < 3) {
                                distance = 30;
                            }
                            radians = ((m.icon_angle + m.angle_offsets[friends_placed] + 360) % 360) * (Math.PI / 180);
                            friend_x = crowd_x + (distance * Math.cos(radians));
                            friend_y = crowd_y + (distance * Math.sin(radians));
                            has_image = false;
                            if (m.crowd[friend_id].image) {
                                if (m.crowd[friend_id].image.width > 0) {
                                    has_image = true;
                                }
                            }
                            if (has_image) {
                                m.cc.drawImage(m.crowd[friend_id].image,
                                    0, 0,
                                    m.crowd[friend_id].image.width,
                                    m.crowd[friend_id].image.height,
                                    friend_x - 9, friend_y - 9,
                                    19, 19);
                            } else {
                                m.cc.drawImage(m.mm.menu_image,
                                    1116, 364,
                                    38, 38,
                                    friend_x - 9, friend_y - 9,
                                    19, 19);
                            }
                            // Set the current location for checking
                            m.crowd[friend_id].x = friend_x - 9;
                            m.crowd[friend_id].y = friend_y - 9;
                            m.crowd[friend_id].width = 19;
                            m.crowd[friend_id].height = 19;
                            friends_placed = friends_placed + 1;
                            if (friends_placed == 7) {
                                break;   
                            }
                        }
                    }
                }
            }
        };
    }
    v = this.view;
    if(!this.controller) {
        this.controller = {
            init: function (com) {
                /*
                    Creates a fresh level hot spot
                    
                    Arguments
                    com.menu_data: Pointer to the level data model 
                    com.id: The index number of the level
                    com.file_name: The filename of the connected level
                    com.experiment_type: '', // String: Icon to show for experiment type
                    com.roll_left: Left edge of the rollover area
                    com.roll_top: Top edge of the rollover area
                    com.roll_right: Right edge of the rollover area
                    com.roll_bottom: Bottom edge of the rollover area
                    com.thumb_x: X position of the experiment thumbnail
                    com.thumb_y: Y position of the experiment thumbnail
                    com.meter_x: X position of the score meter
                    com.meter_y: Y position of the score meter
                    com.number_x: X position of the experiment number
                    com.number_y: Y position of the experiemnt number
                    com.experiment_x: X position of the experiment type icon
                    com.experiment_y: Y position of the experiment type icon
                    com.icon_x: X position of the player icon
                    com.icon_y: Y position of the player icon
                    com.icon_angle: Angle from player icon to thumbnail
                    com.user_id: The string ID of the user in the crowd
                    
                    Returns
                    A pointer to this instance of LEVEL_SPOT
                */
                m.mm = com.menu_data;
                // Set the canvas context to draw to
                m.cc = m.mm.cc;
                m.id = com.id;
                m.file_name = com.file_name;
                m.experiment_type = com.experiment_type;
                m.roll_left = com.roll_left;
                m.roll_top = com.roll_top;
                m.roll_right = com.roll_right;
                m.roll_bottom = com.roll_bottom;
                m.thumb_x = com.thumb_x;
                m.thumb_y = com.thumb_y;
                m.meter_x = com.meter_x;
                m.meter_y = com.meter_y;
                m.number_x = com.number_x;
                m.number_y = com.number_y;
                m.experiment_x = com.experiment_x;
                m.experiment_y = com.experiment_y;
                m.icon_x = com.icon_x;
                m.icon_y = com.icon_y;
                m.icon_angle = com.icon_angle;
                m.user_id = com.user_id;
                // Return instance pointer
                return t;
            },
            setMouseInside: function (com) {
                /*
                    Set the mouse_inside flag
                    
                    Arguments
                    com.inside: Boolean for is the mouse inside the hot spot?
                */
                m.mouse_inside = com.inside;
            },
            checkMouseInside: function (com) {
                /*
                    Returns if the mouse is inside the 
                    rollover area
                    
                    Arguments
                    com.x: The X position of the mouse
                    com.y: The Y position of the mouse
                    
                    Returns
                    A boolean for if the mouse is inside the rollover area
                */
                m.mouse_inside = false;
                if (com.x >= m.roll_left && com.x <= m.roll_right) {
                    if (com.y >= m.roll_top && com.y <= m.roll_bottom) {
                        m.mouse_inside = true;
                    }
                }
                return m.mouse_inside;
            },
            checkInsideCrowd: function (com) {
                /*
                    Returns the member of the crowd that the mouse is over
                    
                    Arguments
                    com.x: The X position of the mouse
                    com.y: The Y position of the mouse
                    
                    Returns
                    A string with the name to be displayed
                */
                var shown_name = ""; // String: Name to be displayed from the crowd
                var friend_id; // String: The id of the friend being checked
                var x_shown; // Number: The x location where the name is shown
                var y_shown; // Number: The x location where the name is shown
                // Loop through all friends in the crowd
                for (friend_id in m.crowd) {
                    if (m.crowd.hasOwnProperty(friend_id)) {
                    	if (friend_id != m.user_id || m.mm.advance_animation.active == false) {
	                        if (com.x >= m.crowd[friend_id].x && com.x < m.crowd[friend_id].x + m.crowd[friend_id].width) {
	                            if (com.y >= m.crowd[friend_id].y && com.y <= m.crowd[friend_id].y + m.crowd[friend_id].height) {
	                                x_shown = m.crowd[friend_id].x + Math.round(m.crowd[friend_id].width / 2);
	                                y_shown = m.crowd[friend_id].y - 20;
	                                shown_name = m.crowd[friend_id].name + "|-+-|" + String(x_shown) + "|-+-|" + String(y_shown);
	                                break;
	                            }
	                        }
	                    }
                    }
                }
                return shown_name;     
            },
            addToCrowd: function (com) {
                /*
                    Add a friend to the crowd at the level
                    
                    Arguments
                    com.friend: The friend ID to be added
                    com.name: The name to be display on rollover
                    com.image: Pointer to the image to display
                */
                if (com.friend != '') {
                    m.crowd[com.friend] = {};
                    m.crowd[com.friend].id = com.friend;
                    m.crowd[com.friend].name = com.name;
                    m.crowd[com.friend].image = com.image;
                }
            },
            removeFromCrowd: function (com) {
                /*
                    Removes one friend from the crowd
                
                    Arguments
                    com.friend: The friend ID to be removed
                */
                if (m.crowd[com.friend]) {
                    delete m.crowd[com.friend];   
                }
            },
            removeCrowd: function (com) {
                /*
                    Removed all crowd objects
                */
                m.crowd = {};
            },
            getID: function (com) {
                /*
                    Returns the file name
                */
                return m.id;
            },
            getFileName: function (com) {
                /*
                    Returns the level file name
                */   
                return m.file_name;
            },
            getMouseInside: function (com) {
                /*
                    Returns a boolean with if the mouse
                    was inside the rollover area on last
                    check
                */
                return m.mouse_inside;
            },
            getMouseDowned: function (com) {
                /*
                    Returns if the last mouse down occurred
                    inside the rollover area
                */
                return m.mouse_downed;
            },
            setMouseDowned: function (com) {
                /*
                    Set the state of the mouse down of the
                    level spot
                    
                    Arguments
                    com.mouse_down: A boolean with whether the level spot was mouse downed
                */
                m.mouse_downed = com.mouse_down;
            },
            getActive: function (com) {
                /*
                    Return the current active state of the
                    level spot
                */
                return m.active; 
            },
            setActive: function (com) {
                /*
                    Set the active state of the level spot
                
                    Arguments
                    com.active: A boolean with whether or not the spot is active
                */
                m.active = com.active;
            },
            getLocked: function (com) {
                /*
                    Return if the level is locked
                */
                return m.locked;
            },
            setLocked: function (com) {
                /*
                    Set the locked state the level spot
                
                    Arguments
                    com.locked: Is the level locked?
                */
                m.locked = com.locked;
            },
            setMeterLevel: function (com) {
                /*
                    Set the meter level
                
                    Arguments
                    com.meter_level: Level the meter should be at (-1 to 2)
                */
                m.meter_level = com.meter_level;
            },
            setLevelType: function (com) {
                /*
                    Set the type of level
                
                    Arguments
                    com.level_type: Can be m for moves or t for timed
                */
                if (com.level_type == 't') {
                    m.experiment_type = 'timed';
                } else {
                    m.experiment_type = 'moves';
                }
            },
            getUserPosition: function (com) {
            	/*
                    Get the position that the user icon would be at
                
                    Reutrns:
                    An object containing the x and y position of the icon
                */
            	return {
            		x: m.icon_x,
                	y: m.icon_y
                };	
            }
        };
    }
    if (this.controller[command.com]) {
        // Execute controller function if present and return value
        return this.controller[command.com](command);
    }
    // Give warning when command is missing
    console.log("*** Warning *** (ATOM) No Command: " + command.com);
    return this;
};