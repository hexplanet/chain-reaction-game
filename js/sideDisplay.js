/*
    Code for a Big Bang Game side display
*/

var SIDE; // Function: Contains MVC for game piece

SIDE = function (command) {
    /*
        Contains MVC for side object. Executes the 
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
            op_timer: null, // setInterval: 20 fps operation of timed events
            side_state: 'init', // String: Current state of the side display
            move_start: -1, // Number: The millisecond when the move started
            move_delay: 750, // Number: Duration of the move to game height
            close_delay: 200, // Number: Duration of the move to level height
            side_width: 175, // Number: The width of the side panel
            side_height: 120, // Number: Height of display panel
            time_place: [60000, 6000, 1000, 100, 10, 1], // Array: Division Places
            time_places: 6, // Number: Number of digit places
            side_color: '#404040', // String: Value of the score background color
            is_bubbling: false, // Boolean: Is the score test tube bubbling?
            bubbles: [], // Array: Graphical bubble indexes
            max_bubbles: 10, // Number: Maximum bubbles on test tube
            bubble_speed: 4, // Number: Speed at which bubbles drop
            tube_height: 108, // Number: Height of the test tube fluid graphic
            mm: null, // Object: Pointer to the menu data model
            gm: null // Object: Pointer to the game data model
        };
    }
    m = this.model;
    if (!this.view) {
        this.view = {
            clearCanvas: function () {
                /*
                    Set the canvas to its base state for canvas refresh
                */
                if (m.side_state == 'level') {
                    if (m.mm.lab_loaded) {
                        // Draw background image
                        m.mm.cc.drawImage(m.mm.lab_image,
                            0, 0,
                            m.side_width, m.side_height,
                            0, 0,
                            m.side_width, m.side_height);
                    } else {
                        // Fill background with color
                        m.mm.cc.fillStyle = m.mm.lab_color;
        		        m.mm.cc.fillRect(0, 0, m.side_width, m.side_height);
        		    }
                } else {
                    if (m.gm) {
                        if (m.gm.bg_loaded) {
                            // Draw background image
                            m.gm.cc.drawImage(m.gm.bg_image,
                                0, 0,
                                m.side_width, m.gm.height,
                                0, 0,
                                m.side_width, m.gm.height);
                        } else {
                            // Fill background with color
                            m.gm.cc.fillStyle = m.gm.bg_color;
            		        m.gm.cc.fillRect(0, 0, m.side_width, m.gm.height);
            		    }
            		}
            	}
            },
            updateCanvas: function (com) {
                /*
                    Update of canvas that occurs every 1/30th of a second
                */
                var fill_y; // Number: Y location of panel fill
                var fill_height; // Number: Height of the fill area
                var bottom_height; // Number: Height of the bottom of the panel
                // Init function values
                fill_y = 0;
                fill_height = 0;
                bottom_height = m.side_height - 15;
                // Clear canvas area under the side panel
                t.view.clearCanvas();
                
                if (m.side_height == 650) {
                    // Draw Whole Side Panel
                    m.gm.cc.drawImage(m.mm.menu_image,
                        0, 0, 
                        m.side_width, m.gm.height,
                        0, 0, 
                        m.side_width, m.gm.height);
                    // Show Game Displays
                    t.view.updateHexCubits();
                    t.view.updateLives();
                    t.view.updateButtons();
                    t.view.displayLevel();
                    t.view.displayLimit();
                    t.view.updateScore();
                    t.view.displayRequirements();
                    t.view.displayTools();
                    t.view.updateButtons();
                    t.view.drawCursor();
                    
                } else {
                    // Set draw level for first panel on side
                    fill_y = 105;
                    fill_height = 0;
                    if (m.side_height > 120) {
                        if (m.side_height < 295) {
                            // Fill incomplete area
                            fill_height = bottom_height - fill_y;
                        } else {
                            // Set draw level for second panel on side
                            fill_y = 280;
                            if (m.side_height < 485) {
                                fill_height = bottom_height - fill_y;
                            } else {
                                fill_y = 470;
                                fill_height = bottom_height - fill_y;
                            }
                        }
                    }
                    // Draw Shown Area
                    m.mm.cc.drawImage(m.mm.menu_image,
                        0, 0, 
                        m.side_width, fill_y,
                        0, 0, 
                        m.side_width, fill_y);
                    // Draw Incomplete Area
                    if (fill_height > 0) {
                        m.mm.cc.drawImage(m.mm.menu_image,
                            0, 37, 
                            m.side_width, 8,
                            0, fill_y, 
                            m.side_width, fill_height);
                    }
                    // Draw Bottom Area
                    m.mm.cc.drawImage(m.mm.menu_image,
                        0, 635, 
                        m.side_width, 15,
                        0, bottom_height, 
                        m.side_width, 15);
                    // Draw Bottom Right Corner Area
                    m.mm.cc.drawImage(m.mm.menu_image,
                        160, 624, 
                        15, 26,
                        160, bottom_height - 11, 
                        15, 26);
                    // Display Butons, Cubits, Time, and Lives
                    t.view.updateHexCubits();
                    t.view.updateLives();
                    t.view.updateButtons();
                    if (m.side_height >= 295) {
                        // Display Level, Time/Moves, Score, and Score Meter
                        t.view.displayLevel();
                        t.view.displayLimit();
                        t.view.updateScore();
                    }
                    if (m.side_height >= 485) {
                        // Display Requirements
                        t.view.displayRequirements();
                    }
                }
            },
            displayLevel: function () {
                /*
                    Display the score of the game
                */
                var x_position; // Number: X position for the next draw
                var temp_level; // Number: The score to be decreased while being displayed
                if (m.gm) {
                    // Init function values
                    temp_level = m.mm.level_number + 1;
                    x_position = 37;
                    // Clear score area
                    m.gm.cc.fillStyle = m.side_color;
        		    m.gm.cc.fillRect(22, 138, 90, 40);
        		    // Display Level Number
        		    BBM({
        		        com: 'draw',
        		        draw: 'number',
            		    x: x_position,
            		    y: 158,
            		    value: temp_level,
            		    size: 'large',
            		    align: 'left'
            		});
                }                
            },
            displayLimit: function () {
                /*
                    Displays either moves left or time left
                    depending on the level limiter
                */
                if (m.gm) {
                    if (m.gm.is_time_limited == true) {
                        // Display time label
                        m.gm.cc.drawImage(m.mm.menu_image, 
                            354, 85,
                            42, 15,
                            22, 184, 
                            42, 15);
                        // Update time
                        t.view.updateTime();
                    } else {
                        // Display moves label
                        m.gm.cc.drawImage(m.mm.menu_image, 
                            354, 65,
                            92, 15,
                            22, 184, 
                            92, 15);
                        // Update move
                        t.view.updateMoves();
                    }
                }
            },
            updateTime: function () {
                /*
                    Display the remaining time on the level
                */
                var d; // Number: Increment Var for digit place
                var x_position; // Number: X position for the next draw
                var temp_time; // Number: The score to be decreased while being displayed
                var display_digit; // Number: Digit to be displayed
                // Init function values
                if (m.gm) {
                    if (m.gm.level_duration > -1) {
                        // Calculate remaining time
                        temp_time = m.gm.level_duration;
                        if (m.gm.start_time > -1) {
                            temp_time = temp_time - (new Date().getTime()
                                - m.gm.start_time);
                        }
                        // Calculate the time if the game is frozen
                        if (m.gm.freeze_game > -1) {
                            temp_time = m.gm.level_duration;
                            temp_time = temp_time - (m.gm.freeze_game
                                - m.gm.start_time);
                        }
                        // Limit the amount of time to be displayed
                        if (temp_time > 599999) {
                            temp_time = 599999;
                        }
                        temp_time = Math.floor(temp_time / 10);
                        if (temp_time < 0) {
                            temp_time = 0;   
                        }
                        // Init function values
                        x_position = 22;
                        // Clear time area
                        m.gm.cc.fillStyle = m.side_color;
                		m.gm.cc.fillRect(22, 202, 83, 23);
                        // Loop through each of the digit places
                        for (d = 1; d < m.time_places; d++) {
                            display_digit = Math.floor(temp_time
                                / m.time_place[d]);
                            temp_time = temp_time % m.time_place[d];
                            m.gm.cc.drawImage(m.mm.menu_image, 
                                176 + (display_digit * 15), 40,
                                14, 20,
                                x_position, 202, 
                                14, 20);
                            x_position = x_position + 13;
                            if (d == 1) {
                                // Add colon after minutes place
                                x_position = x_position - 1;
                                m.gm.cc.drawImage(m.mm.menu_image, 
                                    328, 40,
                                    11, 23,
                                    x_position, 202, 
                                    11, 23);
                                x_position = x_position + 9;
                            }
                            if (d == 3) {
                                // Add point after seconds place
                                m.gm.cc.drawImage(m.mm.menu_image, 
                                    358, 40,
                                    11, 23,
                                    x_position, 202, 
                                    11, 23);
                                x_position = x_position + 9;
                            }
                        }
                    }
                }
            },
            updateMoves: function () {
                /*
                    Display the remaining moves on the level
                */
                var x_position; // Number: X position for the next draw
                var temp_moves; // Number: The score to be decreased while being displayed
                if (m.gm) {
                    // Init function values
                    temp_moves = m.gm.moves;
                    x_position = 29;
                    // Clear score area
                    m.gm.cc.fillStyle = m.side_color;
        		    m.gm.cc.fillRect(22, 202, 45, 23);
        		    // Draw number of moves
        		    BBM({
        		        com: 'draw',
        		        draw: 'number',
            		    x: x_position,
            		    y: 212,
            		    value: temp_moves,
            		    size: 'med',
            		    align: 'left'
            		});
                }
            },
            updateScore: function () {
                /*
                    Display the score of the game
                */
                var x_position; // Number: X position for the next draw
                var temp_score; // Number: The score to be decreased while being displayed
                if (m.gm) {
                    // Init function values
                    temp_score = m.gm.score;
                    x_position = 29;
                    // Limit amount of score to be reported
                    if (temp_score > 999999) {
                        temp_score = 999999;
                    }
                    // Clear score area
                    m.gm.cc.fillStyle = m.side_color;
        		    m.gm.cc.fillRect(22, 251, 95, 23);
        		    // Draw number of moves
        		    BBM({
        		        com: 'draw',
        		        draw: 'number',
            		    x: x_position,
            		    y: 261,
            		    value: temp_score,
            		    size: 'med',
            		    align: 'left'
            		});
                    // Update the test tube score meter
                    t.view.displayTube();
                }
            },
            displayTube: function () {
                /*
                    Display scores test tube
                */
                var column_source; // Number: Source x location for column to draw
                var column_height; // Number: Height of column to draw
                var column_offset; // Number: Height of column to draw
                var score_ratio; // Number: Ratio of score to top of test tube
                var total_bubbles; // Number: Total number of bubbles on the test tube
                var hold_alpha; // Number: Starting alpha value
                var i; // Number: Increment Var for bubbles
                if (m.gm) {
                    // Clear test tube area
                    m.gm.cc.drawImage(m.mm.menu_image, 
                        113, 125,
                        54, 134,
                        113, 125, 
                        54, 134);
                    // Set the correct column source graphic by score
                    column_source = 194;
                    if (m.gm.score >= m.gm.tube_scores[0]) {
                        column_source = 176;
                    }
                    // Calculate Column Offset and Height
                    score_ratio = m.gm.score / m.gm.tube_scores[2];
                    if (score_ratio > 1) {
                        score_ratio = 1;
                    }
                    column_offset = Math.floor(m.tube_height 
                        - (score_ratio * m.tube_height));
                    column_height = m.tube_height - column_offset;
                    if (score_ratio > 0) {
                    // Draw fluid column
                        m.gm.cc.drawImage(m.mm.menu_image, 
                            column_source, 396,
                            16, column_height,
                            131, 151 + column_offset, 
                            16, column_height);
                    }
                    // Redraw base of tube
                    m.gm.cc.drawImage(m.mm.menu_image, 
                        197, 535,
                        16, 4,
                        131, 256, 
                        16, 4);
                    // Draw marks on test tube
                    score_ratio = m.gm.tube_scores[0] / m.gm.tube_scores[2];
                    column_offset = Math.floor(m.tube_height 
                        - (score_ratio * m.tube_height));
                    column_source = 176;
                    if (m.gm.score >= m.gm.tube_scores[0]) {
                        column_source = 196;
                    }     
                    m.gm.cc.drawImage(m.mm.menu_image, 
                        column_source, 511,
                        16, 8,
                        131, 151 + column_offset, 
                        16, 8);
                    score_ratio = m.gm.tube_scores[1] / m.gm.tube_scores[2];
                    column_offset = Math.floor(m.tube_height 
                        - (score_ratio * m.tube_height));
                    column_source = 176;
                    if (m.gm.score >= m.gm.tube_scores[1]) {
                        column_source = 196;
                    }     
                    m.gm.cc.drawImage(m.mm.menu_image, 
                        column_source, 511,
                        16, 8,
                        131, 151 + column_offset, 
                        16, 8);
                    // Set test tube to bubble if the score is over the top
                    if (m.gm.score >= m.gm.tube_scores[2]) {
                        m.is_bubbling = true;
                    }
                    // Operate fizz if test tube is bubbling
                    if (m.is_bubbling == true) {
                        total_bubbles = m.bubbles.length;
                        if (total_bubbles == m.max_bubbles) {
                            // Remove bubble
                            m.bubbles.pop();
                        }
                        // Add bubble
                        m.bubbles.unshift(t.controller.rnd({
                            max: 4
                        }));
                        // Draw Bubbles
                        hold_alpha = m.gm.cc.globalAlpha;
                        total_bubbles = m.bubbles.length;
                        for (i = 0; i < total_bubbles; i++) {
                            column_source = (m.bubbles[i] * 40) + 397;
                            column_offset = m.bubble_speed * i;
                            m.gm.cc.globalAlpha = 1 - (i * .1);
                            m.gm.cc.drawImage(m.mm.menu_image, 
                                222, column_source,
                                40, 40,
                                119, 136 + column_offset, 
                                40, 40);
                        }
                        m.gm.cc.globalAlpha = hold_alpha;
                    }
                    // Draw valid check marks
                    if (m.gm.score >= m.gm.tube_scores[0]) {
                        score_ratio = m.gm.tube_scores[0] / m.gm.tube_scores[2];
                        column_offset = Math.floor(m.tube_height 
                            - (score_ratio * m.tube_height));
                        m.gm.cc.drawImage(m.mm.menu_image,
                        176, 526,
                        16, 13,
                        113, 145 + column_offset, 
                        16, 13);
                    }
                    if (m.gm.score >= m.gm.tube_scores[1]) {
                        score_ratio = m.gm.tube_scores[1] / m.gm.tube_scores[2];
                        column_offset = Math.floor(m.tube_height 
                            - (score_ratio * m.tube_height));
                        m.gm.cc.drawImage(m.mm.menu_image, 
                        176, 526,
                        16, 13,
                        113, 145 + column_offset, 
                        16, 13);
                    }
                }
            },
            displayRequirements: function () {
                /*
                    Display the requirement header and list
                */
                var a; // Number: Increment var for requirements
                var i; // Number: Increment var for atoms
                var y_pos; // Number: Y position of the requirement being drawn
                var compound_atoms; // Number: Total number of atoms in compound
                var source_x; // Number: X position on source image
                var source_y; // Number: Y position on source image
                var source_width; // Number: Width on source image
                var source_height; // Number: Height on source image
                var for_length; // Number: Length of array to check
                if (m.gm) {
                    if (m.gm.total_requirements > 0) {
                        // Display requirments header
                        m.gm.cc.drawImage(m.mm.menu_image, 
                            354, 105,
                            132, 15,
                            21, 292, 
                            132, 15);
                    }
                    // loop through all requirements and display them
                    y_pos = 312;
                    for (i = 0; i <m.gm.total_requirements; i++) {
                        source_x = -1;
                        source_width = 34;
                        source_height = 30;
                        // Check for match to display
                        for_length = m.gm.req_match_order.length;
                        for (a = 0; a < for_length; a++) {
                            if (m.gm.req_shown[i] == 'match_'
                                    + m.gm.req_match_order[a]) {
                                source_x = 176;
                                source_y = 65 + (30 * a);
                                if (a > 8) {
                                    source_x = 210;
                                    source_y = source_y - 270;
                                }
                            }
                        }
                        // Check for combo to display
                        for_length = m.gm.req_combo_order.length;
                        for (a = 0; a < for_length; a++) {
                            if (m.gm.req_shown[i] == 'combo_'
                                    + m.gm.req_combo_order[a]) {
                                source_width = 54;
                                source_x = 244;
                                source_y = 65 + (30 * a);
                                if (a > 10) {
                                    source_x = 298;
                                    source_y = source_y - 330;
                                }
                            }
                        }
                        // Check for misc clear types
                        switch (m.gm.req_shown[i]) {
                            case 'clear_nucleus':
                                source_x = 210;
                                source_y = 275;
                                source_width = 34;
                                break;
                            case 'clear_antimatter':
                                source_x = 176;
                                source_y = 335;
                                source_width = 34;
                                break;
                            case 'clear_radioactive':
                                source_x = 209;
                                source_y = 305;
                                source_width = 34;
                                break;
                            case 'clear_crystal':
                                source_x = 209;
                                source_y = 335;
                                source_width = 34;
                                break;
                        }
                        if (source_x > -1) {
                            m.gm.cc.drawImage(m.mm.menu_image, 
                                source_x, source_y,
                                source_width, source_height,
                                69, y_pos, 
                                source_width, source_height);
                        }
                        if (m.gm.req_shown[i] == 'clear_bonds') {
                            source_x = 176;
                            source_y = 335;
                            m.gm.cc.drawImage(m.mm.menu_image, 
                                209, 377,
                                9, 6,
                                82, y_pos + 12, 
                                9, 6);
                            m.gm.cc.drawImage(m.mm.menu_image, 
                                179, 365,
                                26, 30,
                                70, y_pos + 7, 
                                13, 15);
                            m.gm.cc.drawImage(m.mm.menu_image, 
                                179, 365,
                                26, 30,
                                89, y_pos + 7, 
                                13, 15);
                        }
                        if (m.gm.req_shown[i].indexOf('_') == -1) {
                            compound_atoms = m.gm.req_shown[i].length;
                            for (a = 0; a < compound_atoms - 1; a++) {
                                m.gm.cc.drawImage(m.mm.menu_image, 
                                    209, 377,
                                    9, 6,
                                    82 + (a * 17), y_pos + 12, 
                                    9, 6);
                            }
                            for (a = 0; a < compound_atoms; a++) {
                                source_y = 65 + (m.gm.atom_color_chars.indexOf(
                                    m.gm.req_shown[i].substr(a, 1)) * 30);
                                m.gm.cc.drawImage(m.mm.menu_image, 
                                    179, source_y,
                                    26, 30,
                                    70 + (a * 17), y_pos + 7, 
                                    13, 15);
                            }
                        }
                        y_pos = y_pos + 30;
                    }
                }
                t.view.updateRequirements();
            },
            updateRequirements: function () {
                /*
                    Update the requirement amounts/completion
                */
                var atom_id; // String: ID of atom being checked
                var i; // Number: Increment var for atoms
                var y_position; // Number: Y position of the requirement amount
                var temp_amount; // Number: The score to be decreased while being displayed
                if (m.gm) {
                    y_position = 312;
                    // loop through all requirements and display them
                    for (i = 0; i <m.gm.total_requirements; i++) {
        		        // Draw Special requirements
                        if (m.gm.req_shown[i] == 'clear_radioactive') {
                            if (m.gm.has_ended == false) {
                                // Calculation remaining radiative atoms
                                temp_amount = 0;
                                for (atom_id in m.gm.atoms) {
                                    if (m.gm.atoms.hasOwnProperty(atom_id)) {
                                        if (m.gm.atoms[atom_id].controller
                                                .getRadiation() > 0) {
                                            temp_amount = temp_amount + 1;
                                        }
                                    }
                                }
                                m.gm.req_amount[i] = temp_amount;
                            }
                        }
                        if (m.gm.req_shown[i] == 'clear_crystal') {
                            if (m.gm.has_ended == false) {
                                // Calculation remaining radiative atoms
                                temp_amount = 0;
                                for (atom_id in m.gm.atoms) {
                                    if (m.gm.atoms.hasOwnProperty(atom_id)) {
                                        if (m.gm.atoms[atom_id].controller.getType()
                                                == m.gm.atom_types.crystal) {
                                            temp_amount = temp_amount + 1;
                                        }
                                    }
                                }
                                m.gm.req_amount[i] = temp_amount;
                            }
                        }
                        // Init function values
                        temp_amount = m.gm.req_amount[i];
                        // Clear amount area
                        m.gm.cc.fillStyle = m.side_color;
            		    m.gm.cc.fillRect(21, y_position, 46, 30);
            		    if (temp_amount == 0) {
            		        // Draw check mark for completed requirement
            		        m.gm.cc.drawImage(m.mm.menu_image, 
                                298, 365,
                                37, 30,
                                24, y_position,
                                37, 30);
            		    } else {
            		        // Draw requirement amount
                		    BBM({
                		        com: 'draw',
                		        draw: 'number',
                    		    x: 54,
                    		    y: y_position + 16,
                    		    value: temp_amount,
                    		    size: 'med',
                    		    align: 'right'
                    		});
                        }
                        y_position = y_position + 30;
                    }
                }
            },
            displayTools: function () {
                /*
                    Displays usable tools for player
                */
                var x_draw; // Number: X position to draw tool at
                var y_draw; // Number: Y position to draw tool at
                var i; // Number: Increment Var
                if (m.gm && m.mm) {
                    // Loop through all eight tools
                    for (i = 0; i < 8; i++) {
                        // Set X and Y draw position for tool icon
                        x_draw = 25;
                        if (i > 3) {
                            x_draw = 119;
                        }
                        y_draw = 500 + ((i % 4) * 32);
                        if (m.mm.atomic_tools[i] == -1) {
                            // No Tool, clear position
                            m.gm.cc.fillRect(x_draw, y_draw, 32, 32);
                        }
                    }
                    t.view.updateTools();
                }
            },
            updateTools: function() {
                /*
                    Displays the number of tools for the
                    user to implement
                */
                var i; // Number: Increment Var
                var x_position; // Number: X position for the next draw
                var y_position; // Number: X position for the next draw
                var temp_tool; // Number: The score to be decreased while being displayed
                var tool_colors; // Array: List of possible tool colors
                var random_color; // Number: Index to tool_colors for random color
                if (m.gm && m.mm) {
                	// Loop through all eight tools
                    for (i = 0; i < 8; i++) {
                        // Init function values
                        temp_tool = m.mm.atomic_tools[i];
                        if (temp_tool > 99) {
                            temp_tool = 99;   
                        }
                        // Draw Hilight area tool
                        y_position = 501 + ((i % 4) * 32);
						x_position = 20 + ((i > 3) * 68);
						m.gm.cc.strokeStyle = m.side_color;
						if (m.gm.tool_inside == i) {
                        	m.gm.cc.strokeStyle = "#FFFF00";	
                    	}
                    	if (m.gm.tool_active == i) {
                    		tool_colors = ["#ffffff", "#ff0000", "#ffff00"];
                    		random_color = BBM({
                    			com: "rnd",
                    			max: 3
                    		});
                    		m.gm.cc.strokeStyle = tool_colors[random_color];
                    	}
                    	m.gm.cc.lineWidth = 1;
                    	m.gm.cc.strokeRect(x_position, y_position, 67, 31);
                        // Draw Amount Area
                        x_position = 60 + ((i > 3) * 31);
                        y_position = 508 + ((i % 4) * 32);
                        // Clear amount area
                        m.gm.cc.fillStyle = m.side_color;
            		    m.gm.cc.fillRect(x_position, y_position, 25, 17);
            		    if (temp_tool > -1) {
            		        if (temp_tool == 0) {
            		            // Draw buy symbol next to tool
            		            if (i > 3) {
            		                m.gm.cc.drawImage(m.mm.menu_image, 
                                        490, 65,
                                        11, 14,
                                        102, y_position,
                                        11, 14
                                    );
            		            } else {
            		                m.gm.cc.drawImage(m.mm.menu_image, 
                                        490, 65,
                                        11, 14,
                                        60, y_position,
                                        11, 14
                                    );
            		            }
            		        } else {
            		            if (i > 3) {
                		            // Draw remaining tools in right column
                		            BBM({
                        		        com: 'draw',
                        		        draw: 'number',
                            		    x: 107,
                            		    y: y_position + 8,
                            		    value: temp_tool,
                            		    size: 'small',
                            		    align: 'right'
                            		});
                            	} else {
                            	    // Draw remaining tools in left column
                		            BBM({
                        		        com: 'draw',
                        		        draw: 'number',
                            		    x: 65,
                            		    y: y_position + 8,
                            		    value: temp_tool,
                            		    size: 'small',
                            		    align: 'left'
                            		});
                            	}
            		        }
                        }
                    }
                }
            },
            updateHexCubits: function() {
                /*
                    Displays the amount of hex cubits that
                    the user has amassed
                */
                var x_position; // Number: X position for the next draw
                var temp_cubits; // Number: The score to be decreased while being displayed
                if (m.mm) {
                    // Init function values
                    temp_cubits = m.mm.cubits;
                    x_position = 59;
                    // Clear score area
                    m.mm.cc.fillStyle = m.side_color;
        		    m.mm.cc.fillRect(54, 58, 75, 17);
        		    // Display Cubits
        		    BBM({
                        com: 'draw',
                        draw: 'number',
                        x: x_position,
                        y: 66,
                        value: temp_cubits,
                        size: 'small',
                        align: 'left'
                    });
                }
            },
            updateLives: function() {
                /*
                    Displays the amount of lives that
                    the user has amassed
                */
                var life_ratio; // Number: Percentage ratio of lives vs max lives
                var life_offset; // Number: Offset down the bottle for display
                var column_source; // Number: Y source of fizz animation
                var i;
                if (m.mm) {
                    // Clear bottle area
                    m.mm.cc.drawImage(m.mm.menu_image, 
                        134, 47,
                        20, 53,
                        134, 47, 
                        20, 53);
                    // Draw liquid in bottle
                    life_ratio = m.mm.lives / m.mm.max_lives;
                    if (life_ratio > 1) {
                        life_ratio = 1;
                    }
                    life_offset = 31 * (1 - life_ratio);
                    if (life_ratio > 0) {
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            213, 623 + life_offset,
                            20, 31 - life_offset,
                            134, 68 + life_offset, 
                            20, 31 - life_offset);
                    }
                    // Draw number of lives in bottle
        		    BBM({
                        com: 'draw',
                        draw: 'number',
                        x: 142,
                        y: 88,
                        value: m.mm.lives,
                        size: 'small'
                    });
                    if (m.mm.live_fizz == true) {
                        // Draw Random Fizz
                        for (i = 0; i < 4; i++) {
                            column_source = (t.controller.rnd({
                                max: 4    
                            }) * 40) + 397;
                            m.mm.cc.drawImage(m.mm.menu_image, 
                                222, column_source,
                                40, 40,
                                134, 77,  
                                20, 20);
                        }
                    }
                }
                t.view.updateLifeTimer();
            },
            updateLifeTimer: function () {
                /*
                    Displays the amount of time until
                    the user gets their next life or
                    display bubbling if maxxed out
                */
                var d; // Number: Increment Var for digit place
                var x_position; // Number: X position for the next draw
                var temp_time; // Number: The score to be decreased while being displayed
                var display_digit; // Number: Digit to be displayed
                var column_source; // Number: Y source of fizz animation
                var utc_year; // Number: Year
                var utc_month; // Number: Year
                var utc_day; // Number: Year
                var utc_hour; // Number: Year
                var utc_minute; // Number: Year
                var utc_second; // Number: Year                
                if (m.mm) {
                    if (m.mm.next_life == -1) {
                        // Clear top of bottle
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            134, 47,
                            20, 26,
                            134, 47, 
                            20, 26);
                        // Draw Random Fizz
                        column_source = (t.controller.rnd({
                                max: 4    
                            }) * 40) + 397;
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            222, column_source,
                            40, 40,
                            134, 53,  
                            20, 20);
                        // Draw Max on the timer location
                        BBM({
							com: 'draw',
							draw: 'font',
							x: 83,
							y: 79,
							align: 'left',
							text: 'MAX',
							scale: 1,
							font: 'green'
						});
                    } else {
                        // Clear top of bottle
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            134, 47,
                            20, 21,
                            134, 47, 
                            20, 21);
                        // Display Wait if the life check is under way
                        if (m.mm.life_check == true) {
                        	BBM({
								com: 'draw',
								draw: 'font',
								x: 79,
								y: 79,
								align: 'left',
								text: 'WAIT',
								scale: 1,
								font: 'green'
							});	
                        } else {
	                        // Get current time
	                        time_now = new Date();
	                        utc_year = time_now.getUTCFullYear();
                			utc_month = time_now.getUTCMonth();
                			utc_day = time_now.getUTCDate();
                			utc_hour = time_now.getUTCHours();
                			utc_minute = time_now.getUTCMinutes();
                			utc_second = time_now.getUTCSeconds()
                			temp_time = m.mm.next_life - new Date(utc_year, utc_month, utc_day, utc_hour, utc_minute, utc_second, 0);
	                        temp_time = Math.floor(temp_time / 10);
	                        // Check for time expired
	                        if (temp_time < 0) {
	                            temp_time = 0;
	                            if (m.mm.life_check == false) {
	                            	// Start life check
	                            	BBM({
		                                com: 'checkNextLife'
		                            });
	                            }   
	                        }
	                        x_position = 75;
	                        // Clear time area
	                        m.mm.cc.fillStyle = m.side_color;
	            		    m.mm.cc.fillRect(x_position, 80, 50, 17);
	                        // Loop through each of the digit places
	                        for (d = 0; d < m.time_places - 2; d++) {
	                            display_digit = Math.floor(temp_time
	                                / m.time_place[d]);
	                            temp_time = temp_time % m.time_place[d];
	                            if (d > 0 || display_digit > 0) {
	                                m.mm.cc.drawImage(m.mm.menu_image, 
	                                    370 + (display_digit * 12), 44,
	                                    12, 17,
	                                    x_position, 80, 
	                                    12, 17);
	                            }
	                            x_position = x_position + 10;
	                            if (d == 1) {
	                                // Add colon after minutes place
	                                m.mm.cc.drawImage(m.mm.menu_image, 
	                                    491, 44,
	                                    12, 17,
	                                    x_position, 79, 
	                                    12, 17);
	                                x_position = x_position + 8;
	                            }
	                        }
	                    }
                    }
                }
            },
            updateButtons: function () {
                /*
                    Displays the amount of time until
                    the user gets their next life or
                    display bubbling if maxxed out
                */
                if (m.mm) {
                    if (m.mm.sound_state == true) {
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            53, 13,
                            33, 23,
                            53, 13, 
                            33, 23);
                    } else {
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            176, 564,
                            33, 23,
                            53, 13, 
                            33, 23);
                    }
                    if (m.mm.music_state == true) {
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            90, 13,
                            33, 23,
                            90, 13, 
                            33, 23);
                    } else {
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            176, 588,
                            33, 23,
                            90, 13, 
                            33, 23);
                    }
                    if (m.side_state == 'level') {
                        m.mm.cc.drawImage(m.mm.menu_image, 
                            176, 540,
                            33, 23,
                            127, 13, 
                            33, 23);
                    }
                }
            },
            drawCursor: function () {
                /*
                    Displays the tools cursor
                    if that is active
                */  
            }
        };
    }
    v = this.view;
    if(!this.controller) {
        this.controller = {
            init: function (com) {
                /*
                    Init side display
                    
                    Arguments
                    com.menu_data = A pointer to the menu data model
                */
                // Set data model pointers
                m.mm = com.menu_data;
                m.side_state = 'level';
            },
            timerEvent: function (com) {
                /*
                    Operates a timer event for the side display
                    based on current side state
                */
                var move_ratio; // Number: Percent of move completion
                if (m.side_state == 'close') {
                    move_ratio = (new Date().getTime() - m.move_start)
                        / m.close_delay;
                    if (move_ratio > 1) {
                        move_ratio = 1;
                    }
                    m.side_height = 650 - Math.floor(move_ratio * 530);
                    v.updateCanvas();
                    if (move_ratio == 1) {
                        m.side_state = 'level';
                    }
                }
                if (m.side_state == 'operate') {
                    if (m.gm) {
                        if (m.gm.is_time_limited == true) {
                            // Update time
                            t.view.updateTime();
                        }
                        if (m.is_bubbling == true) {
                            // Operate bubbling score test tube
                            t.view.displayTube(); 
                        }
                    }
                }
                if (m.side_state == 'open') {
                    move_ratio = (new Date().getTime() - m.move_start)
                        / m.move_delay;
                    if (move_ratio > 1) {
                        move_ratio = 1;
                    }
                    m.side_height = 120 + Math.floor(move_ratio * 530);
                    v.updateCanvas();
                    if (move_ratio == 1) {
                        m.side_state = 'operate';
                    }
                }
                t.view.updateLifeTimer();
            },
            openSideMenu: function (com) {
                /*
                    Start the side menu entering the screen
                */
                if (m.side_state == 'level') {
                    m.side_state = 'open';
                    m.move_start = new Date().getTime();
                }
            },
            closeSideMenu: function (com) {
                /*
                    Start the side menu entering the screen
                */
                if (m.side_state == 'operate') {
                    m.side_state = 'close';
                    m.move_start = new Date().getTime();
                }
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
            setGameData: function (com) {
                /*
                    Set the pointer to the game data model and clears bubbling
                    
                    Arguments
                    com.game_data: Object pointer to game data model
                */
                m.gm = com.game_data;
                // Clear the bubbling
                m.is_bubbling = false;
            }
        };
    } 
    if (this.controller[command.com]) {
        // Execute controller function if present and return value
        return this.controller[command.com](command);
    }
    // Give warning when command is missing
    console.log("*** Warning *** (SIDE) No Command: " + command.com);
    return this;
};