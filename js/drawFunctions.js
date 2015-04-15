/*
    Code for a Big Bang Game draw functions
*/

var DRAW; // Function: Contains MVC for draw functions

DRAW = function (command) {
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
            digit_place: [100000, 10000, 1000, 100, 10, 1],
                // Array: Number Places
            digit_places: 6, // Number: Number of digit places
            digit_max: 999999, // Number: Maximum number to be displayed
            menu_color: '#404040', // String: The rgb color of the popup menu screen
            mm: null, // Object: Pointer to the menu data model
            gm: null, // Object: Pointer to the main game data model
            cc: null  // Object: Pointer to canvas context to draw to
        };
    }
    m = this.model;
    if (!this.view) {
        this.view = {
            displayNumber: function (com) {
                /*
                    Display a number up to 999,999
                    
                    Arguments
                    com.x: The center x-axis of the level display
                    com.y: The center y-axis of the level display
                    com.value: The number to be displayed
                    com.size: The font size of the number = 'small', 'med', 'large'
                    com.align: The alignment of the number displayed = 'left', 'center', 'right'
                */
                var d; // Number: Increment Var for digit place
                var x_position; // Number: X position for the next draw
                var is_displaying; // Boolean: Has the number started displaying?
                var temp_score; // Number: The score to be decreased while being displayed
                var display_digit; // Number: Digit to be displayed
                var font_width; // Number: Digit width
                var font_height; // Number: Digit height
                var font_step; // Number: Stepping between digits in source
                var font_advance; // Number: Distance that is advance for next char
                var font_x_source; // Number: Base font location
                var font_y_source; // Number: Base font location
                var align_ratio; // Number: Percentage to change x start per char
                if (m.mm) {
                    // Init function values
                    is_displaying = false;
                    temp_score = com.value;
                    switch (com.size) {
                        case 'large':
                            font_width = 30;
                            font_height = 40;
                            font_x_source = 176;
                            font_y_source = 0;
                            font_step = 32;
                            font_advance = 30;
                            break;
                        case 'med':
                            font_width = 14;
                            font_height = 20;
                            font_x_source = 176;
                            font_y_source = 40;
                            font_step = 15;
                            font_advance = 13;
                            break;
                        default:
                            com.size = 'small';
                            font_width = 12;
                            font_height = 17;
                            font_x_source = 370;
                            font_y_source = 44;
                            font_step = 12;
                            font_advance = 10;
                    }
                    x_position = com.x - (font_advance / 2);
                    // Limit amount of score to be reported
                    if (temp_score > m.digit_max) {
                        temp_score = m.digit_max;
                    }
                    // Offset x position for size of the number by align
                    switch (com.align) {
                        case 'right':
                            align_ratio = 1;
                            break;
                        case 'left':
                            align_ratio = 0;
                            break;
                        default:
                            com.align = 'center';
                            align_ratio = .5;
                            break;
                    }  
                    if (temp_score  > 9) {
                        x_position = x_position - (font_advance * align_ratio);
                        if (temp_score  > 99) {
                            x_position = x_position - (font_advance
                                * align_ratio);
                            if (temp_score  > 999) {
                                x_position = x_position - (font_advance
                                    * align_ratio);
                                if (com.size != 'large') {
                                    // Comma Size reduction
                                    x_position = x_position - (8 * align_ratio);
                                }
                                if (temp_score  > 9999) {
                                    x_position = x_position - (font_advance
                                        * align_ratio);
                                    if (temp_score  > 99999) {
                                        x_position = x_position - (font_advance
                                            * align_ratio);
                                    }
                                }
                            }
                        }
                    }
                    x_position = Math.floor(x_position);
                    // Loop through each of the digit places
                    for (d = 0; d < m.digit_places; d++) {
                        if (temp_score >= m.digit_place[d]
                                || is_displaying == true
                                || d == m.digit_places - 1) {
                            is_displaying = true;
                            display_digit = Math.floor(temp_score
                                / m.digit_place[d]);
                            temp_score = temp_score % m.digit_place[d];
                            m.cc.drawImage(m.mm.menu_image, 
                                font_x_source + (display_digit * font_step),
                                font_y_source,
                                font_width, font_height,
                                x_position, com.y - Math.floor(font_height / 2), 
                                font_width, font_height);
                            x_position = x_position + font_advance;
                            if (d == 2 && com.size == 'med') {
                                // Add comma after 1000 place for medium font
                                x_position = x_position - 1;
                                m.cc.drawImage(m.mm.menu_image, 
                                    343, 40,
                                    11, 23,
                                    x_position, com.y - 10, 
                                    11, 23);
                                x_position = x_position + 9;
                            }
                            if (d == 2 && com.size == 'small') {
                                // Add comma after 1000 place for small font
                                m.cc.drawImage(m.mm.menu_image, 
                                    503, 44,
                                    12, 17,
                                    x_position, com.y - Math.floor(font_height / 2),
                                    12, 17);
                                x_position = x_position + 8;
                            }
                        }
                    }
                }
            },
            draw9box: function (com) {
                /*
                    Draws a nine box
                    
                    Arguments
                    com.type: A string with type id ('', 'lose', 'win')
                    com.x: Center of 9box on X Axis
                    com.y: Center of 9box on Y Axis
                    com.width: The width of the 9box
                    com.height: The height of the 9box
                */
                var i; // Number: Increment Var
                var x_source; // Number: Source X location on menu sprite sheet
                var y_source; // Number: Source Y location on menu sprite sheet
                var x_target; // Number: Target X location on canvas
                var y_target; // Number: Target Y location on canvas
                var source_width; // Number: Width of graphic source
                var source_height; // Number: Height of graphic source
                var target_width; // Number: Width of graphic source
                var target_height; // Number: Height of graphic source
                var offset_value; // Number: Amount to offset graphic by
                var box_type; // Number: Index of box type for y_source
                // Select box_type
                switch (com.type) {
                    case 'clear':
                        return;
                        break;
                    case 'win':
                        box_type = 0;
                        break;
                    case 'lose':
                        box_type = 1;
                        break;
                    case 'thin':
                        box_type = 3;
                        break;
                    default:
                        box_type = 2;
                }
                // Draw 9box segments
                for (i = 0; i < 9; i++) {
                    // Calculate X source and target
                    x_source = 1022;
                    if (box_type == 3) {
                        x_source = 708;
                    }
                    source_width = 45;
                    x_target = com.x - Math.floor(com.width / 2);
                    target_width = source_width;
                    if (com.width < target_width * 2) {
                        target_width = Math.round(com.width / 2);
                    }
                    if (i % 3 > 0) {
                        x_source = x_source + source_width;
                        x_target = x_target + target_width;
                        source_width = 30;
                        if (i % 3 == 2) {
                            offset_value = com.width - (target_width * 2);
                            offset_value = offset_value > 0 ? offset_value : 0;
                            x_target = x_target + offset_value;
                            x_source = x_source + source_width;
                            source_width = 45;
                        } else {
                            target_width = com.width - (target_width * 2);
                        }
                    }
                    // Calculate Y source and target
                    y_source = box_type * 122;
                    if (box_type == 3) {
                        y_source = 357;
                    }
                    source_height = 45;
                    y_target = com.y - Math.floor(com.height / 2);
                    target_height = source_height;
                    if (com.height < target_height * 2) {
                        target_height = Math.round(com.height / 2);
                    }
                    if (Math.floor(i / 3) > 0) {
                        y_source = y_source + source_height;
                        y_target = y_target + target_height;
                        source_height = 30;
                        if (Math.floor(i / 3) == 2) {
                            offset_value = com.height - (target_height * 2);
                            offset_value = offset_value > 0 ? offset_value : 0;
                            y_target = y_target + offset_value;
                            y_source = y_source + source_height;
                            source_height = 45;
                        } else {
                            target_height = com.height - (target_height * 2);
                        }
                    }
                    if (target_width > 0 && target_height > 0) {
                        if (i == 4) {
                            // Draw main body as a rect
                            m.cc.fillStyle = m.menu_color;
        		            m.cc.fillRect(x_target, y_target,
        		                target_width, target_height);
                        } else {
                            // Draw corner and side pieces from sprite sheet
                            // Note: +1 on height is to correct for rounding
                            m.cc.drawImage(m.mm.menu_image,
                                x_source, y_source,
        		                source_width, source_height + 1,
                                x_target, y_target,
        		                target_width, target_height + 1);
                        }
                    }
                }
            },
            displayFont: function (com) {
                /*
                    Display a string with a given mono-spaced
                    graphical font
                    
                    Arguments:
                    com.x: X position to draw string on screen
                    com.y: Y position to draw string on screen
                    com.text: The text string to be displayed
                    com.align: The alignment of the text
                    com.font: The graphical font used (green, white, hilite)
                    com.alpha: The opacity of the font display
                    com.scale: The scale of the font displayed (default = 1)
                    
                    Returns
                    A boolean with was the text drawn?
                */
                var char_code; // Number: ASC value of char to be drawn
                var a; // Number: Increment Var
                var c; // Number: Increment Var
                var char_inc; // Number: The X increment between characters
                var char_width; // Number: The width of the character
                var char_height; // Number: The height of the character
                var line_height; // Number: The height of the line
                var base_x; // Number: X position of font on sprite sheet for the base X
                var base_y; // Number: Y position of font on sprite sheet for the base X
                var source_x; // Number: X position of character to draw
                var source_y; // Number: Y position of character to draw
                var x_pos; // Number: X position on screen of character to draw
                var y_pos; // Number: Y position on screen of character to draw
                var x_starts; // Array: Positions to start text lines
                var lines; // Array: Text split by return to be drawn
                var total_lines; // Number: The number of lines
                var line_length; // Number: Length of the line in characters
                var line_align; // String: Type of line alignment
                var hold_alpha; // Number: The starting opacity level
                var text_scale; // Number: The scale of the font drawn
                // Return false if no text is past
                if (!com.text) {
                    return false;
                }
                if (com.text == '') {
                    return false;
                }
                // Init function values
                base_x = 617;
                base_y = 180;
                char_width = 12;
                char_inc = 11;
                char_height = 19;
                line_height = 20;
                if (com.font) {
                    switch (com.font) {
                        case 'white':
                            base_y = base_y + 60;
                            break;
                        case 'hilite':
                            base_y = base_y + 120;
                            break;
                    }
                }
                x_pos = 0;
                if (com.x) {
                    x_pos = com.x;
                }
                y_pos = 0;
                if (com.y) {
                    y_pos = com.y;
                }
                line_align = 'left';
                if (com.align) {
                    line_align = com.align;   
                }
                hold_alpha = -1;
                if (com.alpha) {
                	hold_alpha = m.cc.globalAlpha;
                	m.cc.globalAlpha = com.alpha;
                }
                text_scale = 1;
                if (com.scale) {
                	text_scale = com.scale;
                }
                // Gather line information
                lines = com.text.split(String.fromCharCode(13));
                total_lines = lines.length;
                x_starts = [];
                for (i = 0; i < total_lines; i++) {
                    line_length = lines[i].length;
                    switch (line_align) {
                        case 'center':
                            x_starts.push(x_pos - Math.round(text_scale
                            	* (Math.floor((line_length
                            	* char_inc) * 0.5))));
                            break;
                        case 'right':
                            x_starts.push(x_pos - Math.round(text_scale
                            	* ((line_length * char_inc))));
                            break;
                        default:
                            x_starts.push(x_pos);
                    }
                }
                // Draw Lines
                for (i = 0; i < total_lines; i++) {
                    line_length = lines[i].length;
                    x_pos = x_starts[i];
                    for (a = 0; a < line_length; a++) {
                        char_code = lines[i].charCodeAt(a);
                        if (char_code > 32 && char_code < 127 ) {
                            char_code = char_code - 33;
                            source_x = base_x + ((char_code % 32) * char_width);
                            source_y = base_y + (Math.floor(char_code / 32) 
                                * char_height);
                            m.cc.drawImage(m.mm.menu_image,
                                source_x, source_y,
        		                char_width, char_height,
                                x_pos, y_pos,
        		                Math.round(char_width * text_scale),
        		                Math.round(char_height * text_scale));
                        }
                        x_pos = x_pos + Math.round(char_inc * text_scale);
                    }
                    y_pos = y_pos + Math.round(line_height * text_scale);
                }
                // Reset the global alpha level
                if (hold_alpha > -1) {
                	m.cc.globalAlpha = hold_alpha;
                }
                // Return that string was drawn
                return true;
            }
        };
    }
    v = this.view;
    if(!this.controller) {
        this.controller = {
            init: function (com) {
                /*
                    Init Drawing Functions
                    
                    Arguments
                    com.menu_data = A pointer to the menu data model
                    
                    Returns
                    This object
                */
                // Set data model pointers
                m.mm = com.menu_data;
                // Set canvas context to display to
                if (!com.cc) {
                    m.cc = m.mm.cc;
                } else {
                    m.cc = com.cc;
                }
            },
            nineBox: function (com) {
                /*
                    Executes a 9box drawing
                */
                t.view.draw9box(com);
            },
            number: function (com) {
                /*
                    Executes a 9box drawing
                */
                t.view.displayNumber(com);
            },
            font: function (com) {
                /*
                    Executes a font string drawing
                */
                t.view.displayFont(com);
            }
        };
    }
    if (this.controller[command.com]) {
        // Execute controller function if present and return value
        return this.controller[command.com](command);
    }
    // Give warning when command is missing
    console.log("*** Warning *** (DRAW) No Command: " + command.com);
    return this;
};