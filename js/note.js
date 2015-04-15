/*
    Code for a Big Bang Game note display
*/

var NOTE; // Function: Contains MVC for notes

NOTE = function (command) {
    /*
        Contains MVC for notes object. Executes the 
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
        	move: 0, // Number: What move does the note show up on
   			duration: 0, // Number: How many turns does the note stay up for
   			x: 0, // Number: X position of note
    		y: 0, // Number: Y position of note
    		width: 0, // Number: The width of the note
			height: 0, // Number: The height of the note
			x_pointer: 0, // Number: The x position of the pointer
			y_pointer: 0, // Number: The y position of the pointer
			message: "", // String: The message being shown
			note_state: "init", // String: Current state of the note
			note_time: 0, // Number: Time at which open or close of notes started
			note_open: 1000, // Number: Milliseconds to open note
			note_close: 1000, // Number: Milliseconds to close note
			note_pointer: 1000, // Number: Milliseconds to close note
			auto_close: false, // Boolean: Close note as soon as it opens?
            mm: null, // Object: Pointer to the menu data model
            gm: null // Object: Pointer to the game data model
        };
    }
    m = this.model;
    if (!this.view) {
        this.view = {
            drawNote: function (com) {
                /*
                    Draws the note on the game grid
                    
                    Returns:
                    Boolean: Is the note to be deleted?
                */
                var ratio; // Number: Timer ratio
                var width_now; // Number: Current width of the note
                var height_now; // Number: Current height of the note
                var time_now = Date.now(); // Number: The current milliseconds
                var x_pos = 0;
                var y_pos = 0;
                var x_delta = 0;
                var y_delta = 0;
                var x_target = 0;
                var y_target = 0;
                var total_lines = 0;
                var message_lines = [];
                var i = 0;
                if (m.note_state == 'open') {
					ratio = (time_now - m.note_time) / m.note_open;
					if (ratio > 0) {
						if (ratio > 1) {
							ratio = 1;
						}
						width_now = m.width * (ratio * 2);
						if (width_now > m.width) {
							width_now = m.width;
						}
						height_now = 20;
						if (ratio > 0.5) {
							height_now = (ratio - 0.5) * m.height * 2;
							if (height_now < 20) {
								height_now = 20;
							}
						}
						BBM({
							com: 'draw',
							draw: 'nineBox',
							type: 'thin',
							x: m.x,
							y: m.y,
							width: width_now,
							height: height_now
						});
						if (ratio == 1) {
							m.note_state = 'shown';
							if (m.x != m.x_pointer || m.y != m.y_pointer) {
								m.note_state = "pointer";
								m.note_time = time_now;
							}
							m.note_time = time_now;
							if (m.auto_close == true) {
								// Automatically close menu as soon as it openings
								m.auto_close = false;
								m.note_state = 'close';
							}
						}
					}
				}
				// Show opened note
				if (m.note_state == 'shown' || m.note_state == 'pointer') {
					// Set the start point
					x_pos = m.x - Math.round(m.width / 2) + 30;
				    if (m.x_pointer > m.x) {
				        x_pos = m.x + Math.round(m.width / 2) - 30;
				    }
				    y_pos = m.y - Math.round(m.height / 2) + 30;
				    if (m.y_pointer > m.y) {
				        y_pos = m.y + Math.round(m.height / 2) - 30;
				    }
					if (m.note_state == 'pointer') {
						ratio = (time_now - m.note_time) / m.note_pointer;
						if (ratio > 1) {
							ratio = 1;
						}
						// Calculate partial location of pointer
						x_delta = m.x_pointer - x_pos;
						y_delta = m.y_pointer - y_pos;
						x_target = x_pos + (x_delta * ratio);
						y_target = y_pos + (y_delta * ratio);
						// Draw Pointer Line
					    m.mm.cc.beginPath();
					    m.mm.cc.strokeStyle = "#ffffff";
					    m.mm.cc.lineWidth = 3;
					    m.mm.cc.shadowBlur = 3;
                        m.mm.cc.shadowColor = "#000000";
					    m.mm.cc.moveTo(x_pos, y_pos);
					    m.mm.cc.lineTo(x_target, y_target);
					    m.mm.cc.stroke();
					    m.mm.cc.shadowBlur = 0;
						if (ratio == 1) {
							m.note_state = 'shown';
						}
					} else {
						if (m.x != m.x_pointer || m.y != m.y_pointer) { 
							// Draw Pointer Line
						    m.mm.cc.beginPath();
						    m.mm.cc.strokeStyle = "#ffffff";
						    m.mm.cc.lineWidth = 3;
						    m.mm.cc.shadowBlur = 3;
	                        m.mm.cc.shadowColor = "#000000";
						    m.mm.cc.moveTo(x_pos, y_pos);
						    m.mm.cc.lineTo(m.x_pointer, m.y_pointer);
						    m.mm.cc.stroke();
						    m.mm.cc.shadowBlur = 0;
						}
					}
					// Draw note background
					BBM({
						com: 'draw',
						draw: 'nineBox',
						type: 'thin',
						x: m.x,
						y: m.y,
						width: m.width,
						height: m.height
					});
					// Display the message
					x_pos = m.x - Math.round(m.width / 2) + 45;
					y_pos = m.y - Math.round(m.height / 2) + 45;
					// 
					message_lines = unescape(m.message).split("|");
					total_lines = message_lines.length;
					for (i = 0; i < total_lines; i++) {
						BBM({
							com: 'draw',
							draw: 'font',
							x: x_pos,
							y: y_pos,
							text: message_lines[i],
							font: 'white',
							align: 'left'
						});
						y_pos = y_pos + 20;
					}
				}
                // Operate closing of the menu
				if (m.note_state == 'close') {
					ratio = (time_now - m.note_time) / m.note_close;
					if (ratio > 1) {
						ratio = 1;
					}
					width_now = m.width;
					height_now = m.height * (1 - ratio);
					if (height_now > 0) {
						BBM({
							com: 'draw',
							draw: 'nineBox',
							type: 'thin',
							x: m.x,
							y: m.y,
							width: width_now,
							height: height_now
						});
					}
					if (ratio == 1) {
						m.note_state = 'closed';
						return true;
					}
				}
				return false;
            }
        };
    }
    v = this.view;
    if(!this.controller) {
        this.controller = {
            init: function (com) {
                /*
                    Init note
                    
                    Arguments
                    com.move = Turn on which the note appears
    				com.duration = Number of turns the notes stays for
    			    com.x = The x position of the note
    			    com.y = The y position of the note
    			    com.width = The width of the note
				    com.height = The height of the note
				    com.x_pointer = The end x postition of the pointer
				    com.y_pointer = The end y position of the pointer
				    com.message = The message displayed
                    com.menu_data = A pointer to the menu data model
                    com.game_data = A pointer to the game data model
                */
                // Set data model pointers
                m.move = com.move;
	   			m.duration = com.duration;
	   			m.x = com.x;
	    		m.y = com.y;
	    		m.width = com.width;
				m.height = com.height;
				m.x_pointer = com.x_pointer;
				m.y_pointer  = com.y_pointer;
				m.message = com.message;
                m.mm = com.menu_data;
                m.gm = com.game_data;
                m.note_time = Date.now();
                m.note_state = "open";
            },
            closeNote: function (com) {
            	/*
            		Starts the closing of the note
            	*/
            	if (m.note_state == "open" || m.note_state == "init") {
            		m.auto_close = true;
            	} else {
            		m.note_time = Date.now();
            		m.note_state = "close";
            	}
            }
        };
    } 
    if (this.controller[command.com]) {
        // Execute controller function if present and return value
        return this.controller[command.com](command);
    }
    // Give warning when command is missing
    console.log("*** Warning *** (NOTE) No Command: " + command.com);
    return this;
};