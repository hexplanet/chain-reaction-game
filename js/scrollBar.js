/*
    Code for a html5 canvas slidebar object
*/

var SLIDER; // Function: Contains MVC for html5 canvas slidebar

SLIDER = function (command) {
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
			id: "", // String: ID of the slidebar
			object_attached: null, // Object: Object which is called with amount change
			x: 0, // Number: X postion of left edge of bar on screen
			y: 0, // Number: Y position of top edge of bar on screen
			min_amount: 0, // Number: Amount returned when scroll bar is at min
			max_amount: 100, // Number: Amount returned when scroll bar is at max
			inc_amount: 1, // Number: Returned amount is rounded by this amount
			tray_inc: 5, // Number: The amount that a click on the tray moves the knob by
			scroll_dir: "V", // String: Direction of the scroll bar (V/H)
			scroll_amount: 0, // Number: The amount to be returned to the attached object
			bar_width: 20, // Number: Width of scroll bar
			bar_height: 100, // Number: Height of the scroll bar
			min_button_width: 20, // Number: Width of the min button
			min_button_height: 20, // Number: Height of the min button
			min_button: [630, 400, 38, 38], // Array: Rect of min button source
			min_state: "disable", // String: Current state of the min button ("","hilite","disable")
			max_button_x: 0, // Number: The x offset of the max button
			max_button_y: 80, // Number: The y offset of the max button
			max_button_width: 20, // Number: Width of the max button
			max_button_height: 20, // Number: Height of the max button
			max_button: [630, 440, 38, 38], // Array: Rect of max button source
			max_state: "disable", // String: Current state of the max button ("","hilite","disable")
			knob_width: 20, // Number: Width of the drag knob
			knob_height: 20, // Number: Height of the drag knob
			knob_source: [630, 440, 38, 38], // Array: Rect of max button source
			knob_state: "disable", // String: Current state of the knob button ("","hilite","disable")
        	tray_width: 20, // Number: Width of the drag tray
			tray_height: 60, // Number: Height of the drag tray
        	tray_source: [630, 440, 38, 38], // Array: Rect of max button source
        	disable_source: [670, 440, 38, 38], // Array: Rect of disable overlay
        	hilite_source: [670, 400, 38, 38], // Array: Rect of hilite overlay
        	source_values: {}, // Object: Contains calculated source positions and lengths
        	tray_state: "disable", // String: Current state of the tray ("","hilite","disable")
        	knob_offset: 0, // Number: Amount the knob is offset from the min button
        	state: "ïnit", // String: Current state of the slidebar
        	tray_max: 39, // Number: Maximum offset of the knob on the tray
        	shown: false, // Boolean: Is the scrollbar shown,
        	cc: null, // Object: Pointer to the canvas content to draw to
        	source_image: null // Image: Pointer to image holder source images
        };
    }
    m = this.model;
    if (!this.view) {
        this.view = {
        	drawScrollBar: function (com) {
        		/*
                    Draws current state of the scrollbar
                */
                if (m.shown == true) {
                    
                }
        	}
        };
    }
    v = this.view;
    if(!this.controller) {
        this.controller = {
        	init: function (com) {
                /*
                    Creates a new atom instance for the data
                    given
                    
                    Arguments:
                    All non .com vars are stored in the scrollbar data model
                    
                    Returns:
                    Null if an error occurs, else the pointer to the scrollbar object
                */
                var var_name; // String: Var to move to table data model
                // Get incoming var from com and place then in the table data model
                for (var_name in com) {
                    if (com.hasOwnProperty(var_name)) {
                        if (var_name != "com") {
                            m[var_name] = com[var_name];
                        }
                    }
                }
                // Init nine box meausrements
                t.controller.calc9BoxData({
                    source: 'knob_source'
                });
                t.controller.calc9BoxData({
                    source: 'tray_source'
                });
                t.controller.calc9BoxData({
                    source: 'disable_source'
                });
                t.controller.calc9BoxData({
                    source: 'hilite_source'
                });
		// Init Draw Areas
		t.controller.calc9BoxData({});
		t.controller.calcTrayArea({});
		t.controller.calcKnobArea({});
		t.controller.calcMaxButtonOffset({});
                // Check for required values and return null if not met
                if (!m.cc) {
                	console.log("Scrollbar needs a canvas context (com.cc) to draw to");
                	return null;
                }
                if (!m.source_image) {
                	console.log("Scrollbar needs a source image (com.source_image) to draw with");
                	return null;
                }
                return t;
        	},
        	setParameters: function (com) {
        	    /*
        			Set any parameter of the scroll box that is in the model 
        			
        			Arguments
        			All non .com vars are stored in the scrollbar data model
        		*/
        		for (var_name in com) {
                    if (com.hasOwnProperty(var_name)) {
                        if (var_name != "com") {
                            m[var_name] = com[var_name];
                            if (var_name.indexOf("_source") > -1) {
                                t.controller.calc9BoxData({
                                    source: var_name
                                });
                            }
                        }
                    }
                }
			t.controller.calc9BoxData({});
			t.controller.calcTrayArea({});
			t.controller.calcKnobArea({});
			t.controller.calcMaxButtonOffset({});
        	},
        	setValueRange: function (com) {
        		/*
        			Sets the range and increment of the values
        			that thescrollbar returns 
        			
        			Arguments
        			com.min: The minimum value for the scrollbar
        			com.max: The maximum value for the scrollbar
        			com.inc: The stepped increment for the value of the scrollbar
        		*/
        		if (com.min) {
        			m.min_amount = com.min;
        		}
        		if (com.max) {
        			m.max_amount = com.max;
        		}
        		if (com.inc) {
					m.inc_amount = com.inc;
        		}
        	},
        	setBarValue: function (com) {
        		/*
        			Set the value of the scrollbar
        			
        			Argument
        			com.value: The new value of the scroll bar
        		*/
        		if (com.value) {
        			m.scroll_amount = com.value;
        		}
        	},
        	calc9BoxData: function (com) {
        	    /*
        			Set the thirds division of source graphics to be
        			used when drawing a nine box for area sources
        			
        			Argument
        			com.source: The source that needs to have thirds calculated
        		*/
        		var third_width; // Number: Value of 1/3 width
        		var remains_width; // Number: The remains of the width
        		var third_height; // Number: Value of 1/3 height
        		var remains_height; // Number: The remains of the height
        		var source_width; // Number: The width of the source
        		var source_height; // Number: The height of the source
        		var mid_width_position; // Number: The source x position of middle width
        		var right_width_position; // Number: The source x position of the right edge
        		var mid_height_position; // Number: The source y position of middle height
        		var bottom_height_position; // Number: The source y position of the bottom edge
        	    var source_name; // String: The name of the source to be calculated
        	    // Calculate values
        	    if (com.source) {
        	        // Calculate widths
        	        source_name = com.source.split("_source")[0];
        	        source_width = (m[com.source])[2];
        	        third_width = Math.round(source_width / 3);
        	        remains_width = source_width - (third_width * 2);
        	        mid_width_position = (m[com.source])[0] + third_width;
        	        right_width_position = mid_width_position + remains_width;
        	        // Calculate heights
        	        source_height = (m[com.source])[3];
        	        third_height = Math.round(source_height / 3);
        	        remains_height = source_height - (third_height * 2);
        	        mid_height_position = (m[com.source])[1] + third_height;
        	        bottom_height_position = mid_height_position
        	            + remains_height;
        	        // Save calculated values
        	        m.source_values[source_name + "_x"] = [(m[com.source])[0],
        	            mid_width_position, right_width_position];
        	        m.source_values[source_name + "_width"] = [third_width,
        	            remains_width, third_width];
        	        m.source_values[source_name + "_y"] = [(m[com.source])[1],
        	            mid_height_position, bottom_height_position];
        	        m.source_values[source_name + "_height"] = [third_height,
        	            remains_height, third_height];
        	    }
        	},
        	calcTrayArea: function (com) {
        	    /*
        	        Calculates and sets the area of the tray and
        	        drawing coordinates for the view
        	    */
        	    var left_draw; // Number: The pixels on the left to draw
        	    var mid_draw; // Number: The pixels in the middle to draw
        	    var right_draw; // Number: The pixels on the right to draw
        	    var top_draw; // Number: The pixels on the top to draw
        	    var bottom_draw; // Number: The pixels on the bottom to draw
        	    //Calculate total dimesions
        	    if (m.scroll_dir == 'V') {
        	        m.tray_width = m.bar_width;
			        m.tray_height = m.bar_height - m.min_button_height
			            - m.max_button_height;
        	    } else {
        	        m.tray_width = m.bar_width - m.min_button_width
        	            - m.max_button_width;
			        m.tray_height = m.bar_height;
        	    }
        	    // Calculate Tray Widths for view
        	    if (m.source_values.tray_width) {
			        left_draw = m.source_values.tray_width[0];
			        right_draw = m.source_values.tray_width[2];
			        if (left_draw + right_draw >= m.tray_width) {
			            left_draw = Math.round(m.tray_width / 2);
			            right_draw = m.tray_width - left_draw;
			            mid_draw = 0;
			        } else {
			            mid_draw = m.tray_width - left_draw - right_draw;
			        }
			        m.source_values.tray_draw_width = [left_draw, mid_draw,
			            right_draw];
			        if (m.scroll_dir == 'V') {
			            m.source_values.tray_draw_x = [m.x, m.x + left_draw,
			                m.x + left_draw + mid_draw];
			        } else {
			            m.source_values.tray_draw_x = [m.x + m.min_button_width,
			                m.x + m.min_button_width + left_draw,
			                m.x + m.min_button_width + left_draw + mid_draw];
			        }
			    }
			    // Calculate Tray Heights for view
			    if (m.source_values.tray_height) {
			        top_draw = m.source_values.tray_height[0];
			        bottom_draw = m.source_values.tray_height[2];
			        if (top_draw + bottom_draw >= m.tray_height) {
			            top_draw = Math.round(m.tray_height / 2);
			            bottom_draw = m.tray_height - top_draw;
			            mid_draw = 0;
			        } else {
			            mid_draw = m.tray_height - top_draw - bottom_draw;
			        }
			        m.source_values.tray_draw_height = [top_draw, mid_draw,
			            bottom_draw];
			        if (m.scroll_dir == 'H') {
			            m.source_values.tray_draw_y = [m.y, m.y + top_draw,
			                m.y + top_draw + mid_draw];
			        } else {
			            m.source_values.tray_draw_y =
			                [m.y + m.min_button_height,
			                m.y + m.min_button_height + top_draw,
			                m.y + m.min_button_height + top_draw + mid_draw];
			        }
			    }
        	},
        	calcKnobArea: function (com) {
        	    /*
        	        Calculates and sets the area of the drag knob and
        	        drawing coordinates for the view
        	    */
		        var left_draw; // Number: The pixels on the left to draw
        	    var mid_draw; // Number: The pixels in the middle to draw
        	    var right_draw; // Number: The pixels on the right to draw
        	    var top_draw; // Number: The pixels on the top to draw
        	    var bottom_draw; // Number: The pixels on the bottom to draw
        	    // Calculate total dimesions
        	    if (m.scroll_dir == 'V') {
        	        m.knob_width = m.bar_width;
        	    } else {
        	        m.knob_height = m.bar_height;
        	    }
        	    // Calculate widths and x-offsets for knob in view
        	    if (m.source_values.knob_width) {
        			left_draw = m.source_values.knob_width[0];
        			right_draw = m.source_values.knob_width[2];
        			if (left_draw + right_draw >= m.knob_width) {
        			    left_draw = Math.round(m.knob_width / 2);
        			    right_draw = m.knob_width - left_draw;
        			    mid_draw = 0;
        			} else {
        			    mid_draw = m.knob_width - left_draw - right_draw;
        			}
        			m.source_values.knob_draw_width = [left_draw, mid_draw,
        			    right_draw];
        			m.source_values.knob_draw_x = [0, left_draw, left_draw
        			    + mid_draw];
        	    }
        	    // Calculate heights and y-offsets for knob in view
                if (m.source_values.knob_height) {
        			top_draw = m.source_values.knob_height[0];
        			bottom_draw = m.source_values.knob_height[2];
        			if (top_draw + bottom_draw >= m.knob_height) {
        			    top_draw = Math.round(m.knob_height / 2);
        			    bottom_draw = m.knob_height - top_draw;
        			    mid_draw = 0;
        			} else {
        			    mid_draw = m.knob_height - top_draw - bottom_draw;
        			}
        			m.source_values.knob_draw_height = [top_draw, mid_draw,
        			    bottom_draw];
        			m.source_values.knob_draw_y = [0, top_draw, top_draw
        			    + mid_draw];
        	    }
        	},
        	calcMaxButtonOffset: function (com) {
        	    /*
        	        Calculates the offset for the max button
        	    */
        	    if (m.scroll_dir == 'V') {
        	        m.max_button_x = 0;
			        m.max_button_y = m.bar_height - m.max_button_height;
        	    } else {
        	        m.max_button_y = 0;
			        m.max_button_x = m.bar_width - m.max_button_width;
        	    }
        	}
        };
    }
    if (this.controller[command.com]) {
        // Execute controller function if present and return value
        return this.controller[command.com](command);
    }
    // Give warning when command is missing
    console.log("*** Warning *** (SLIDER) No Command: " + command.com);
    return this;
};