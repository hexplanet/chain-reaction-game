/*
	Code for the Big Bang Game Editor
*/

var BBG; // Function: Contains MVC for Big Bang Game

BBG = function(command) {
	/*
		Contains MVC for Big Bang Game.
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
			side_width: 175, // Number: Width of the side menu
			atoms: {}, // Object: Container of level game pieces
			generators: {}, // Object: Contains Atom Generators for selected hex positions
			notes: [], // Array: List of note objects
			compounds_found: [], // Array: List of compounds found
			rings_found: 0, // Number: Rings found in match check pass
			new_specials: [], // Array: List of new specials created from matches
			matches: [], // Array: List of match arrays
			match_pos: [], // Array: List of points awarded for matches
			breakups: [], // Array: Individual broken atom ids
			specials: [], // Array: List of special atom explosions
			special_times: [], // Array: List of special atom explosion delays
			special_pos: [], // Array: List of points awarded for specials
			result_ids: [], // Array: List of atom ids where results are given
			explode_score: 0, // Number: Cumlative score from an explosion or special
			score_delimiter: 100, // Number: Minimum score at which to show score graphic
			popup_id: 0, // Number: Incremental Pop-Up ID
			score_popups: {}, // Object: Contains all score pop-ups
			crystal_start: -1, // Number: The time at which the crystal started its spread
			crystal_id: '', // String: Atom ID where crystal is spreading to
			crystal_delay: 750, // Number: Milliseconds that it takes to spread crystal
			crystal_broken: true, // Boolean: Was crystal broken in previous turn?
			drop_colors: [], // Array: ENUM index of drop colors
			drop_types: [], // Array: ENUM index of drop types
			drop_counters: {}, // Object: Stores start counter values for types
			drop_percent: {}, // Object: Stores percent chance of dropping an atom type
			hex_dirs: ['s', 'v', 'b'], // Array: Hex direction id chars
			match_s: [], // Array: List of match lists for slash hex direction
			match_v: [], // Array: List of match lists for vert hex direction
			match_b: [], // Array: List of match lists for backslash hex direction
			used_s: {}, // Object: Atoms used in slash direction as index
			used_v: {}, // Object: Atoms used in vert direction as index
			used_b: {}, // Object: Atoms used in backslash direction as index
			turn_start_time: -1, // Number: Milliseconds when turn started
			exchange_start: -1, // Number: When the exchange begins
			exchange_time: 250, // Number: Milliseconds that an exchange takes
			exchange_atoms: ['', ''], // Array: Exchanged atom ids
			exchange_dir: -1, // Number: Hex direction of the exchange
			combo_type: '', // String: Combo type made
			hint_shown: false, // Boolean: Is a move being hinted?
			hint_delay: 4000, // Number: Milliseconds until move hinting starts
			hint_move: {}, // Object: Contains atoms, id, and dir for hinted move
			total_drop_colors: 0, // Number: Length of drop_colors
			total_drop_types: 0, // Number: Length of drop_types
			antimatter_inplay: 0, // Number: Amount of antimatter used
			atom_colors_min: -1, // Number: The minimum color value
			atom_colors_max: 8, // Number: Maximum color value
			atom_color_chars: 'rpbcovywt', // String: Atom color characters
			atom_colors: {
				'void': -1,
				'red': 0,
				'pink': 1,
				'blue': 2,
				'cyan': 3,
				'orange': 4,
				'purple': 5,
				'yellow': 6,
				'brown': 7,
				'tan': 8}, // Object: ENUM values for atom colors
			atom_types_min: -1, // Number: Minimum type value
			atom_types_max: 340, // Number: Maximum type value
			atom_types: {
				'unused': -1,
				'empty': 0,
				'atom': 1,
				'radioactive': 2,
				'blackhole': 3,
				'nucleus': 4,
				'void': 5,
				'antimatter': 6,
				'bond_vert': 7,
				'bond_slash': 8,
				'bond_backslash': 9,
				'absorber': 10,
				'absorber_x2': 11,
				'absorber_x3': 12,
				'absorber_x4': 13,
				'absorber_x5': 14,
				'absorber_x6': 15,
				'absorber_x7': 16,
				'big_bang': 17,
				'bang_slash': 18,
				'bang_vert': 19,
				'bang_backslash': 20,
				'bang_plasma': 21,
				'bang_small': 22,
				'bang_medium': 23,
				'bang_full': 24,
				'random_atom': 25,
				'crystal': 26,
				'freeze': 27,
				'generator': 28}, // Object: ENUM values for atom types
			atom_scores: [0, 10, 15, 20, 500, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0,
				0, 0, 50, 25, 25, 25, 15, 15 ,20, 25, 0, 5, 10], // Object: Scores for atoms based on atom_types ENUM value
			drop_prefix: ['hole', 'anti', 'radio', 'void', 'freeze'], // Drop type values for atom generator
			atom_width: 55, // Number: Width of the atom on the sprite sheet to draw
			atom_wing: 14, // Number: Width of a wing of the hex shape
			atom_height: 47, // Number: Height of the atom on the sprite sheet to draw
			x_atoms: 13, // Number: Atoms across the game screen
			y_atoms: 12, // Number: Atoms down the game screen
			x_base: 195, // Number: X-position of first atom
			y_base: 48, // Number: Y-position of first atom
			x_inc: 40, // Number: X-position of first atom
			y_inc: 46, // Number: Y-position of first atom
			z_inc: -23, // Number: Y-offset of odd column of atoms
			cursor_blink: -1, // Number: Blink counter for mouse down cursor
			previous_cursor: '', // String: ID of the cursor atom on last pass
			cursor_id: '', // String: ID of the atom the cursor is over
			bonding_positions: [0,0, 0,0, 0,0, 0,0, 0,0, 0,0], // Array: X,Y distances between neighboring atoms
			direction_mirror: [3, 4, 5, 0, 1, 2], // Array: Bonding side of neighboring atom base on side index
			explode_time: -1, // Number: Time when explosions started
			explode_duration: 250, // Number: Milliseconds of explosion time
			explode_delay: 0, // Number: Milliseconds added to explosion by effects
			fizz_form: 200, // Number: Duration of the formation of the fizz
			fizz_duration: 600, // Number: Duration of full fizz
			fizz_clear: 200, // Number: Duration of the clearing of the fizz
			fizz_start: -1, // Number: When did the current fizz state start
			fizz_state: 'none', // String: Current fizz state
			fizz_atoms: [], // Array: List of all atoms that are fizzing
			fizz_total: 0, // Number: Total number of atoms fizzing
			shuffle_count: 0, // Number: Total attempts to shuffle the grid
			shuffle_max: 100, // Number: Maximum attempts to shuffle allowed
			shuffle_ratio: 2.5, // Number: Shuffle moves = atoms * shuffle_ratio
			falling_total: 0, // Number: Total number of falling atoms
			falling_atoms: [], // Array: List of all atoms that fell
			falling_time: -1, // Number: Starting milliseconds of group fall
			falling_duration: 100, // Number: Milliseconds that it take for an atom to travel a space
			fall_arrays: {}, // Object: Contains arrays of atoms in lines
			fall_ids: [], // Array: Fall array names in order of bottom to top
			fall_length: 0, // Number: Total fall ids in fall_ids
			total_atoms: 0, // Number: Total number of active atoms on grid
			hex_down: '', // String: atom_id for atom switching
			down_x_start: 0, // Number: X position of the hex mouse down
			down_y_start: 0, // Number: Y position of the hex mouse down
			requirements: {}, // Object: Level completion values
			total_requirements: 0, // Number: Total number of listed requirements
			req_shown: [], // Array: List of requirements for the level in order
			req_amount: [], // Array: List of requirement amounts for level
			req_match_order: ['r', 'p', 'b', 'c', 'o', 'v', 'y', 'w', 't',
				'4C', '5', '5C', '6', '6C', '7', 'X'],
				// Array: Order in which to display match requirements
			req_combo_order: ['4C4C', '4C5', '4C5C', '4C6', '4C6C', '4C7',
				'55', '55C', '56', '56C', '57', '5C5C', '5C6', '5C6C', '5C7',
				'66', '66C', '67', '6C6C', '6C7', '77'],
				// Array: Order in which to display combo requirements
			req_clear_order: ['bonds', 'nucleus', 'antimatter', 'radioactive',
				'crystal'], // Array: Order in which to display clear requirements
			requirement_checks: [], // Array: List of requirement ids, min, and max values for checking if cleared
			level_name: '', // String: Filename of current level
			tube_scores: [0, 0, 0], // Array: List of target scores for test tube
			high_scores: [], // Array: List of friends high scores
			my_high_score: 0, // Number: Current high score of player
			score: 0, // Number: Score of current level
			moves: -1, // Number: Remaining move on the level
			tool_inside: -1, // Number: The index of the tool the cursor is currently inside
			tool_downed: -1, // Number: The index of the tool that was mouse downed
			tool_carried: -1, // Number: The index of the tool that is active
			tool_delayed: -1, // Number: Time at which the next tool can be selected
			tool_state: "", // String: Current state of selected tool
			skip_lost_turn: false, // Boolean: Should turn loss be skipped this turn
			show_game: false, // Boolean: Is the menu visible?
			start_menu: true, // Boolean: Start menu displayed?
			start_time: -1, // Number: Starting milliseconds of a timed level
			level_duration: -1, // Number: Milliseconds of level play
			duration_bonus: 0, // Number: Milliseconds of level play that can be purchased
			is_time_limited: false, // Boolean: Is the level time limited
			bg_file: '', // String: The background image for the level
			bg_image: new Image(), // image: JPG background image for level
			bg_loaded: false, // Boolean: Is the background image loaded?
			bg_color: '#000000', // String: Background color for level
			game_state: '', // String: Current state of the game
			game_state_timer: -1, // Number: Milliseconds when game state began
			chain_reaction: false, // Boolean: Display CHAIN REACTION message?
			valid_bonus_ids: [], // Array: List of atom ids for bonus atoms
			skip_counters: true, // Boolean: Skip decreasing the counters
			bonus_timer: -1, // Number: Milliseconds for next bonus atom
			bonus_delay: 100, // Number: Milliseconds delay until next bonus atom
			imploding_atoms: [], // Array: Atoms that imploded
			implode_atom: '', // String: ID of the imploding atom
			implode_time: -1, // Number: Milliseconds start of the implosion
			implode_clear: false, // Boolean: Has implode cleared all atoms?
			first_move: true, // Boolean: Is this the first move?
			freeze_game: -1, // Number: Millisecods time when game was frozen
			has_ended: false, // Boolean: Game Play has ended
			completed_moves: 0, // Number: Number of moves left after game is complete
			completed_time: 0, // Number: Amount of time remaining when game is completed (milliseconds)
			popup_menu: null, // Object: Popup Menu Object
			game_playing: false, // Boolean: Is the game currently in play mode?
			cursor_info: [{xoff: -27, yoff: -24, ysrc: 396}, // erase cursor
				{xoff: 0, yoff: 0, ysrc: 0},
				{xoff: -30, yoff: -30, ysrc: 426}, // boom cursor
				{xoff: -16, yoff: -58, ysrc: 456}, // eye-dropper cursor
				{xoff: 0, yoff: 0, ysrc: 0},
				{xoff: 0, yoff: 0, ysrc: 0},
				{xoff: -30, yoff: -30, ysrc: 486}, // teleporter cursor
				{xoff: -38, yoff: -42, ysrc: 516}],
			mouse_xy: {x:0, y:0}, // Object: Contains x and y position of the mouse
			mm: null, // Object: Pointer to Menu data Model
			dl: "|-+-|",
			lh: ""
		};
	}
	m = this.model;
	if(!this.view) {
		this.view = {
			clearCanvas: function () {
				/*
					Set the canvas to its base state for canvas refresh
				*/
				if (m.bg_loaded) {
					// Draw background image
					m.cc.drawImage(m.bg_image,
						m.side_width, 0,
						m.width - m.side_width, m.height,
						m.side_width, 0,
						m.width - m.side_width, m.height);
				} else {
					// Fill background with color
					m.cc.fillStyle = m.bg_color;
					m.cc.fillRect(m.side_width, 0,
						m.width - m.side_width, m.height);
				}
			},
			updateCanvas: function (com) {
				/*
					Update of canvas that occurs every 1/30th of a second
				*/
				var message_ratio; // Number: Percentage of message completion
				var atom_id; // String: Atom id of the currently drawn atom
				var pop_id; // String: Pop-up id of the currently draw pop-up
				var cursor_pos; // Object: An object that contains x and y position values
				var cursor_frame; // Number: The index of the current cursor frame to display
				var x_position; // Number: X position of the screen for message
				var y_position; // Number: Y position of the screen for message
				var implode_ratio; // Number: Implode animation percentage complete 
				var x_width; // Number: Width of message
				var y_height; // Number: Height of message
				var implode_source; // Number: X location of implosion frame on sprite sheet
				var total_notes; // Number: Total number of notes
				var i;
				if (m.show_game == true) {
					if (m.mm) {
						if (m.start_menu == false) {
							// Clear Canvas
							t.view.clearCanvas();
							// Draw each atom background
							for (atom_id in m.atoms) {
								if (m.atoms.hasOwnProperty(atom_id)) {
									m.atoms[atom_id].view.drawAtomBackground({});
								}
							}
							// Draw each atom
							for (atom_id in m.atoms) {
								if (m.atoms.hasOwnProperty(atom_id)) {
									m.atoms[atom_id].view.drawAtom({});
								}
							}
							// Draw each atom foreground
							for (atom_id in m.atoms) {
								if (m.atoms.hasOwnProperty(atom_id)) {
									m.atoms[atom_id].view
										.drawAtomForeground({});
								}
							}
							// Operate Atom Cursor
							m.cursor_blink = m.cursor_blink + 1;
							if (m.cursor_blink > 19) {
								m.cursor_blink = 0;
							}
							if (m.cursor_id != "") {
								cursor_pos = m.atoms[m.cursor_id].controller
									.getPosition({});
								cursor_frame = Math.floor(m.cursor_blink / 5);
								m.cc.drawImage(m.mm.atom_image,
									((cursor_frame + 1) * m.atom_width), 611,
									m.atom_width, m.atom_height, cursor_pos.x,
									cursor_pos.y, m.atom_width, m.atom_height);
							}
							// Draw score pop-ups
							for (pop_id in m.score_popups) {
								if (m.score_popups.hasOwnProperty(pop_id)) {
									m.score_popups[pop_id].view.displayScore();
									if (m.score_popups[pop_id].controller
											.getRatio() == 1) {
										delete m.score_popups[pop_id];
									}
								}
							}
							// Draw Chain Reaction Message
							if (m.chain_reaction == true) {
								message_ratio = (new Date().getTime()
									- m.game_state_timer) / 1000;
								if (message_ratio > 3) {
									message_ratio = 3;
								}
								x_position = 220;
								y_position = -60 + (message_ratio * 360);
								x_width = 490;
								y_height = 57;
								if (y_position > 120) {
									y_position = 120;   
								}
								if (message_ratio > 2) {
									m.cc.globalAlpha = 3 - message_ratio;
									x_width = x_width + Math.floor((
										message_ratio - 2) * 90);
									y_height = y_height + Math.floor((
										message_ratio - 2) * 11);
									x_position = x_position - Math.floor((
										message_ratio - 2) * 45);
									y_position = y_position - Math.floor((
										message_ratio - 2) * 5.5);
								}
								m.cc.drawImage(m.mm.menu_image,
									510, (t.controller.rnd({
										max: 3    
									}) * 60),
									490,57,
									x_position, y_position,
									x_width, y_height);
								if (message_ratio > 2) {
									m.cc.globalAlpha = 1;
								}
							}
							// Draw implosion overlay
							if (m.implode_time > -1) {
								// Set implosion base location
								x_position = m.atoms[m.implode_atom].controller
									.getX() + Math.floor(m.atom_width / 2);
								y_position = m.atoms[m.implode_atom].controller
									.getY() + Math.floor(m.atom_height / 2);
								// Calculate implosion ratio
								implode_ratio = (new Date().getTime()
									- m.implode_time) / 250;
								if (implode_ratio > 1) {
									implode_ratio = 1;
								}
								// Set implosion width, height, and adjust location
								x_width = m.atom_width * (1 + (implode_ratio
									* 2));
								y_height = m.atom_height * (1 + (implode_ratio
									* 2));
								x_position = x_position - Math.floor(
									x_width / 2);
								y_position = y_position - Math.floor(
									y_height / 2);
								// Find implosion graphical source
								implode_source = Math.round(implode_ratio * 7);
								implode_source = 330 + (implode_source *
									m.atom_width);
								if (implode_ratio < 1) {
									// Draw implosion graphic
									m.cc.drawImage(m.mm.atom_image,
										implode_source, 517,
										m.atom_width, m.atom_height,
										x_position, y_position,
										x_width, y_height);
								}
							}
							// Draw all active notes
							total_notes = m.notes.length;
							for (i = 0; i < total_notes; i++) {
							    if (m.notes[i].view.drawNote({})) {
							    	delete m.notes[i];
							    	m.notes.splice(i, 1);
							    	i = i - 1;
							    	total_notes = total_notes - 1;
							    } 
							}
							// Draw tool cursor
							if (m.tool_carried > -1) {
								y_position = m.cursor_info[m.tool_carried].ysrc;
								m.cc.drawImage(m.mm.menu_image,
									275, y_position,
									30, 30,
									m.mouse_xy.x + m.cursor_info[m.tool_carried].xoff,
									m.mouse_xy.y + m.cursor_info[m.tool_carried].yoff,
									60, 60);
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
					Init application
					
					Arguments
					com.menuDataModel = A pointer to the menu data model
				*/
				m.game_state = 'initGame';
				// Set pointer to menu Data Model
				m.mm = com.menuDataModel;
				// Set model pointer to the side menu
				m.mm.side.controller.setGameData({
					game_data: m 
				});
				// Get width, height, and context of canvas
				m.canvas_element = m.mm.canvas_element;
				m.cc = m.mm.cc;
				m.width = m.mm.width;
				m.height = m.mm.height;
				// Set bonding postions
				m.bonding_positions[0] = -m.x_inc;
				m.bonding_positions[1] = -m.z_inc;
				m.bonding_positions[2] = 0;
				m.bonding_positions[3] = m.y_inc;
				m.bonding_positions[4] = m.x_inc;
				m.bonding_positions[5] = -m.z_inc;
				m.bonding_positions[6] = m.x_inc;
				m.bonding_positions[7] = m.z_inc;
				m.bonding_positions[8] = 0;
				m.bonding_positions[9] = -m.y_inc;
				m.bonding_positions[10] = -m.x_inc;
				m.bonding_positions[11] = m.z_inc;
				// Init hinting values
				m.hint_move.atoms = [];
				m.hint_move.id = '';
				m.hint_move.dir = -1;
				// Set requirement check values
				m.requirement_checks = [
					'match_4C',
					m.atom_types.bang_small, m.atom_types.bang_small,
					'match_5',
					m.atom_types.bang_plasma, m.atom_types.bang_plasma,
					'match_5C',
					m.atom_types.bang_medium, m.atom_types.bang_medium,
					'match_6',
					m.atom_types.bang_slash, m.atom_types.bang_backslash,
					'match_6C',
					m.atom_types.bang_full, m.atom_types.bang_full,
					'match_7',
					m.atom_types.big_bang, m.atom_types.big_bang,
					'combo_4C4C', 100, 109,
					'combo_4C5', 110, 119,
					'combo_4C5C', 120, 129,
					'combo_4C6', 130, 139,
					'combo_4C6C', 140, 149,
					'combo_4C7', 150, 159,
					'combo_55', 160, 169,
					'combo_55C', 170, 179,
					'combo_56', 180, 189,
					'combo_56C', 190, 199,
					'combo_57', 200, 209,
					'combo_5C5C', 210, 219,
					'combo_5C6', 220, 229,
					'combo_5C6C', 230, 239,
					'combo_5C7', 240, 249,
					'combo_66', 250, 259,
					'combo_66C', 260, 269,
					'combo_67', 270, 279,
					'combo_6C6C', 280, 289,
					'combo_6C7', 290, 299,
					'combo_77', 300, 309];
				// Set default atoms
				t.controller.defaultAtoms({});
				// Reset highscores
				m.high_scores = [];
				if (m.mm.test_level == '') {
					// Get highscores for the level
					$.ajax({
	                    url: "php/get_highscores.php",
	                    type: "GET",
	                    data: {
	                    	user_id: m.mm.user_id,
	                    	level: m.mm.level_number
	                    },
	                    success: function (result) {
	                        BBM({
	                            com: 'highscoresLoaded',
	                            data: result
	                        });
	                    },
	                    error: function (my_error) {
	                        console.log("***ERROR*** get_highscores: ", my_error);
	                    }
	                });
	            }
			},
			parseHighscores: function (com) {
			    /*
			        Parse the highscores and build object data
			    */
			    var highscores_list; // Array: Raw highscores return split by "\n"
                var data_lines; // Number: Total number of the scores returned
                var split_index; // Array: Data line split by ": "
                var split_prefix; // Array: Data prefix split by "_"
                var data_value; // String: The value of the data
                var player_id; // String: The id of the player on the list
                var place_position; // Number: Which place is the player in
                var data_type; // String: The type of data on the line
                var last_id; // String: The last id used
                var highscore_data; // Object: Temporary storage of player data
                var found_user; // Boolean: Was the user in the 
                var i; // Number: Increment var
                highscores_list = com.data.split("\n");
                data_lines = highscores_list.length;
                place_position = 1; 
                found_user = false;
			    for (i = 0; i < data_lines; i++) {
                    split_index = highscores_list[i].split(": ");
                    if (split_index.length == 2) {
                        split_prefix = split_index[0].split("_");
                        if (split_prefix.length == 2) {
                            data_type = split_prefix[0];
                            player_id = split_prefix[1];
                            data_value = split_index[1];
                            // Advance place if different from previous id
                            if (last_id != player_id) {
                                if (highscore_data) {
                                    m.high_scores.push(highscore_data);
                                    place_position = place_position + 1;
                                }
                                highscore_data = {};
                                highscore_data.button = '';
                                highscore_data.icon = new Image();
                                highscore_data.name = '';
                                highscore_data.place = place_position;
                                last_id = player_id;
                            }
                            // Store player id
                            if (data_type == "id") {
                                highscore_data.id = player_id;
                                if (player_id == m.mm.user_id) {
                                	m.my_high_score = Number(data_value);
                                    highscore_data.user = true;
                                    found_user = true;
                                } else {
                                    highscore_data.user = false;
                                }
                                highscore_data.score = Number(data_value);
                                highscore_data.name = m.mm.friends["id_" + player_id].name;
                                highscore_data.icon = m.mm.friends["id_" + player_id].icon_image;
                            }
                            // Add gift button
                            if (data_type == "gift") {
                                highscore_data.button = data_value;
                            }
                        }
                    }
                }
                // Add last player to the list
                if (highscore_data) {
                    m.high_scores.push(highscore_data);
                    place_position = place_position + 1;
                }
                // Add user to the list if not previously on list
                if (found_user == false) {
                    m.high_scores.push({
                        id: m.mm.user_id,
                        place: place_position,
                        icon: m.mm.friends["id_" + m.mm.user_id].icon_image,
                        name: m.mm.friends["id_" + m.mm.user_id].name,
                        score: 0,
                        button: '',
                        user: true
                    });
                }
			},
			defaultAtoms: function (com) {
				/*
					Sets up the default hex set for the editor
				*/
				var x; // Number: X-Axis increment var
				var y; // Number: Y-Axis increment var
				var x_pos; // Number: X location of an atom
				var y_pos; // Number: Y location an an atom
				var atom_height; // Number: Number of atoms in height
				var atom_num; // Number: ID number for atom object
				// Init funciton values
				com.com = 'init';
				atom_num = 0; 
				// Loop through each atom position and create atom there
				for (x = 0; x < m.x_atoms; x++) {
					atom_height = m.y_atoms + (x % 2);
					x_pos = m.x_base + (m.x_inc * x);
					for (y = 0; y < atom_height; y++) {
						y_pos = m.y_base + (m.y_inc * y) + ((x % 2) * m.z_inc);
						com.id = 'atom_' + atom_num;
						com.x = x_pos;
						com.y = y_pos;
						com.color = -1;
						com.gm = m;
						com.mm = m.mm;
						m.atoms['atom_' + atom_num] = new ATOM(com);
						atom_num = atom_num + 1;
					}
				}
				// Set the neighbor of the default atoms
				t.controller.setNeighbors({});
			},
			setNeighbors: function (com) {
				/*
					Set the neighboring hexes for a all hexes
					and record total number of active hexes
				*/
				var atom_id; // String: The id for a given atom
				var target_id; // String: The id for a given atom
				var x_pos; // Number: X location of an atom
				var y_pos; // Number: Y location an an atom
				var x_target; // Number: X location of an atom
				var y_target; // Number: Y location an an atom
				var d; // Number: Increment var for hex direction
				// Check each atom for neighbors
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						// Get source atom x and y
						x_pos = m.atoms[atom_id].controller.getX();
						y_pos = m.atoms[atom_id].controller.getY();
						for (d = 0; d < 6; d++) {
							for (target_id in m.atoms) {
								if (m.atoms.hasOwnProperty(target_id)) {
									// Get target atom x and y
									x_target = m.atoms[target_id]
										.controller.getX();
									y_target = m.atoms[target_id]
										.controller.getY();
									// Check target vs source + offset
									if (x_pos + m.bonding_positions[d + d]
											== x_target && y_pos 
											+ m.bonding_positions[d + d + 1]
											== y_target) {
										// Location matched, set neighbor
										m.atoms[atom_id].controller
											.setNeighbor({
												 direction: d,
												 atom_id: target_id
											});
										break;                                                                                     
									}
								}
							}
						}
					}
				}
			},
			loadBackground: function (com) {
				/*
					Starts the loading of the background
				*/
				m.game_state = 'loadBackground';
				m.bg_image.onload = function () {
					BBM({
						com: 'loadedBackground'
					});
				};
				m.bg_image.onerror = function () {
					BBM({
						com: 'errorBackground'
					});
				};
				m.bg_image.src = 'img/backgrounds/' + m.bg_file;
			},
			backgroundResult: function (com) {
				/*
					Sets the loaded flag for background and
					start displaying the level
					
					Arguments
					com.loaded: Boolean of whether background loaded correctly
				*/
				m.bg_loaded = com.loaded;
				t.controller.startGame({});
			},
			clearLevel: function (com) {
				/*
					Return the level to its starting state
				*/
				var atom_id; // String: The id for a given atom
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						m.atoms[atom_id].controller.clearAtom();
					}
				}
			},
			startLevel: function (com) {
				/*
					Start the loading of the level from either
					supplied level or from editor cookie
					
					Arguments
					com.index: Index of the file to be loaded
					com.user_id: The facebook id of the user
				*/
				var c_file = ''; // String: Level to be tested
				var c_value; // String: Cookie file
				var c_start; // Number: Index start of level name in cookie
				var c_end; // Number: Index end of level name in cookie
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
					c_file = unescape(c_value.substring(c_start, c_end));
					document.cookie = 'bbe_level_name=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.hexplanet.com; path=/dev/big_bang/;';
				}
				// Set game state for loading
				m.game_state = 'loadLevel';
				// Load level data
				$.post("php/BB_loadLevel.php", 
					{
						user_id: com.user_id,
						index: com.index,
						test_file: c_file
					},
					function (data, status) {
						if (status != 'success') {
							// Display filename field as error class
							BBM({
								com: 'levelFailed' 
							});
						} else {
							// Set editor data from json and display level
							if (data == 'Illegal filename entered') {
								BBM({
									com: 'levelFailed' 
								});
							} else {
								BBM({
									com: 'levelLoaded',
									json_data: data 
								});
							}
						}
					}
				);
			},
			levelLoaded: function (com) {
				/*
					Translates, intreprets, and builds the level
					from raw loaded data
					
					Arguments
					com.raw_level: Escaped, stringified level data
				*/
				var unescaped_level; // String: Unescaped stringified level data
				var data_label; // String: Label of data in the object
				var drop_color_order; // String: Possible drop colors in order
				var total_drop_order; // Number: Length of drop_color_order
				var drop_colors_length; // Number: Drop colors to add to list
				var order_index; // Number: Index number of color in order
				var counter_value; // String: Temporary holder of counter value
				var percent_value; // Number: Percent chance of atom type drop
				var i; // Number: Increment Var
				var all_atoms; // Array: List of atom objects to be intrepretted
				var loop_atoms; // Number: Total number of atoms to be set
				var is_number; // Boolean: Should value be coersed to Number
				var level_moves; // Number: Moves to complete level in
				var level_score; // Number: Score requirement for level
				var total_req; // Number: Total number of requirements to check
				var play_id = "";
				var level_length = 0;
				var seek_index = 0;
    	        var seek_skip = 0;
    	        var my_pi = "";
    	        var count_PI = 0;
    	        var total_notes;
				// Init function values
				drop_color_order = 'rpbcovywt';
				total_drop_order = drop_color_order.length;
				// Clear the level before restore the save file
				t.controller.clearLevel({});
				// Ready loaded data for level restoration
				unescaped_level = unescape(com.raw_level);
				level_json = jQuery.parseJSON(unescaped_level);
				// calc lh for later
				level_length = com.raw_level.length;
    	        seek_index = 1;
    	        seek_skip = 0;
    	        my_pi = String(Math.PI).split(".").join("");
    	        my_pi = my_pi.substr(0,my_pi.length - 2);
    	        count_PI = my_pi.length;
    	        while (seek_index < level_length) {
    	            play_id = play_id + com.raw_level.substr(seek_index, 1);
    	            seek_index = seek_index + Math.round((Number(my_pi[seek_skip])) * 10);
    	            seek_skip = seek_skip + 1;
    	            if (seek_skip >= count_PI) {
    	               seek_skip = 0;    
    	            }
    	        }
    	        m.lh = String(CryptoJS.MD5(play_id + m.dl + String(m.mm.level_number) + m.dl + m.mm.user_id));
    	        // Reset drop data
				m.drop_colors = [];
				m.drop_types = [];
				m.drop_counters = {};
				m.drop_percent = {};
				m.antimatter_inplay = 0;
				// Read each piece of level data and intrepret
				for (data_label in level_json.level) {
					if (level_json.level.hasOwnProperty(data_label)) {
						switch (data_label) {
							case "drop_colors":
								// Set which drop colors are active
								drop_colors_length = level_json.level
									.drop_colors.length;
								for (i = 0; i < drop_colors_length; i++) {
									order_index = drop_color_order
										.indexOf(level_json.level.drop_colors
										.substr(i, 1));
									if (order_index > -1) {
										m.drop_colors.push(order_index);
									}
								}
								m.total_drop_colors = m.drop_colors.length;
								break;
							case "drop_blackholes":
								// Set blackhole drop active
								if (level_json.level.drop_blackholes
										== 'true') {
									m.drop_types.push(m.atom_types.blackhole);
								}
								break;
							case "bh_counter":
								// Set drop blackhole counter value
								counter_value = '-1';
								if (level_json.level.bh_counter != '') {
									counter_value = level_json.level.bh_counter;
								}
								m.drop_counters['type_' + m.atom_types
									.blackhole] = Number(counter_value);
								break;
							case "bh_percent":
								// Set drop blackhole counter value
								percent_value = 0;
								if (level_json.level.bh_percent != '') {
									percent_value = level_json.level.bh_percent;
								}
								m.drop_percent['type_' + m.atom_types
									.blackhole] = Number(percent_value) * 10;
								break;
							case "drop_antimatter":
								// Set antimatter drop active
								if (level_json.level.drop_antimatter
										== 'true') {
									m.drop_types.push(m.atom_types.antimatter);
								}
								break;
							case "am_counter":
								// Set drop antimatter counter value
								counter_value = '-1';
								if (level_json.level.am_counter != '') {
									counter_value = level_json.level.am_counter;
								}
								m.drop_counters['type_' + m.atom_types
									.antimatter] = Number(counter_value);
								break;
							case "am_percent":
								// Set drop blackhole counter value
								percent_value = 0;
								if (level_json.level.am_percent != '') {
									percent_value = level_json.level.am_percent;
								}
								m.drop_percent['type_' + m.atom_types
									.antimatter] = Number(percent_value) * 10;
								break;
							case "drop_radioactive":
								// Set radioactive drop active
								if (level_json.level.drop_radioactive
										== 'true') {
									m.drop_types.push(m.atom_types.radioactive);
								}
								break;
							case "ra_counter":
								// Set drop radiation counter value
								counter_value = '-1';
								if (level_json.level.ra_counter != '') {
									counter_value = level_json.level.ra_counter;
								}
								m.drop_counters['type_' + m.atom_types
									.radioactive] = Number(counter_value);
								break;
							case "ra_percent":
								// Set drop radiation counter value
								percent_value = 0;
								if (level_json.level.ra_percent != '') {
									percent_value = level_json.level.ra_percent;
								}
								m.drop_percent['type_' + m.atom_types
									.radioactive] = Number(percent_value) * 10;
								break;
							case "drop_void":
								// Set void drop active
								if (level_json.level.drop_void
										== 'true') {
									m.drop_types.push(m.atom_types.void);
								}
								break;
							case "vd_counter":
								// Set drop void counter value
								counter_value = '-1';
								if (level_json.level.vd_counter != '') {
									counter_value = level_json.level.vd_counter;
								}
								m.drop_counters['type_' + m.atom_types
									.void] = Number(counter_value);
								break;
							case "vd_percent":
								// Set drop void counter value
								percent_value = 0;
								if (level_json.level.vd_percent != '') {
									percent_value = level_json.level.vd_percent;
								}
								m.drop_percent['type_' + m.atom_types.void]
									= Number(percent_value) * 10;
								break;
							case "drop_freeze":
								// Set freeze drop active
								if (level_json.level.drop_freeze
										== 'true') {
									m.drop_types.push(m.atom_types.freeze);
								}
								break;
							case "fr_counter":
								// Set drop freeze counter value
								counter_value = '-1';
								if (level_json.level.fr_counter != '') {
									counter_value = level_json.level.fr_counter;
								}
								m.drop_counters['type_' + m.atom_types
									.freeze] = Number(counter_value);
								break;
							case "fr_percent":
								// Set drop freeze counter value
								percent_value = 0;
								if (level_json.level.fr_percent != '') {
									percent_value = level_json.level.fr_percent;
								}
								m.drop_percent['type_' + m.atom_types.freeze]
									= Number(percent_value) * 10;
								break;
							case "total_atoms":
								m.total_atoms  = level_json.level.total_atoms; 
								break;
							case "fall_arrays":
								m.fall_arrays  = level_json.level.fall_arrays;
								break;
							case "fall_ids":
								m.fall_ids  = level_json.level.fall_ids;
								m.fall_length = m.fall_ids.length;
								break;
							case "generators":
								m.generators = level_json.level.generators;
								break;
							case "notes":
								total_notes = level_json.level.notes.length;
								for (i = 0; i < total_notes; i++) {
								    m.notes.push(new NOTE({
            							com: 'init',
            							menu_data: m.mm,
            							game_data: m,
            							move: level_json.level.notes[i].move,
    				                    duration: level_json.level.notes[i].duration,
    			                        x: level_json.level.notes[i].x,
    			                        y: level_json.level.notes[i].y,
    			                        width: level_json.level.notes[i].width,
				                        height: level_json.level.notes[i].height,
				                        x_pointer: level_json.level.notes[i].x_pointer,
				                        y_pointer: level_json.level.notes[i].y_pointer,
				                        message: level_json.level.notes[i].message
            						}));   
								}
								break;
							case "atoms":
								// Restore atoms and count active atoms
								all_atoms = level_json.level.atoms;
								loop_atoms = all_atoms.length;
								for (i = 0; i < loop_atoms; i++) {
									atom_id = all_atoms[i].id;
									m.atoms[atom_id].controller.setType({
										type: Number(all_atoms[i].type)
									});
									if (all_atoms[i].type
											== m.atom_types.antimatter) {
										m.antimatter_inplay
											= m.antimatter_inplay + 1;
									}
									m.atoms[atom_id].controller.setColor({
										color: Number(all_atoms[i].color)
									});
									m.atoms[atom_id].controller.setMoveCounter({
										moves: Number(all_atoms[i].move_counter)
									});
									m.atoms[atom_id].controller.setTeleporter({
										atom_id: all_atoms[i].teleport
									});
									m.atoms[atom_id].controller.setBonds({
										bonds: all_atoms[i].bonds
									});
									m.atoms[atom_id].controller.setFalls({
										falls: all_atoms[i].falls
									});
									m.atoms[atom_id].controller.setDrops({
										drops: all_atoms[i].drops
									});
									m.atoms[atom_id].controller.setRadiation({
										level: all_atoms[i].radiation
									});
									m.atoms[atom_id].controller.setAtomCreator({
										is_creator: (all_atoms[i].is_creator
											== 'true')
									});
									m.atoms[atom_id].controller.setLocked({
										is_locked: (all_atoms[i].is_locked
											== 'true')
									});
									m.atoms[atom_id].controller
										.setTeleporterTarget({
											is_target: (all_atoms[i].is_target
												== 'true')
										});
									m.atoms[atom_id].controller.setShield({
										is_shielded: (all_atoms[i].has_shield
											== 'true')
									});
									m.atoms[atom_id].controller.setEntryPoint({
										is_entry: (all_atoms[i].is_enter_point
											== 'true')
									});
									m.atoms[atom_id].controller.setExitPoint({
										is_exit: (all_atoms[i].is_exit_point
											== 'true')
									});
									m.atoms[atom_id].controller.setSlides({
										slides: all_atoms[i].slide
									});
									m.atoms[atom_id].controller.setFogged({
										fog: (all_atoms[i].is_fogged == 'true')
									});
								}
								break;
							default:
								if (data_label != 'background_jpg') {
									// Store requirement values
									m.requirements[data_label] = level_json
										.level[data_label];
									// Turn value into a number
									is_number = true;
									if (data_label.indexOf('compound_') > -1) {
										is_number = false;
									}
									if (data_label == 'clear_radioactive') {
										is_number = false;
									}
									if (data_label == 'clear_crystal') {
										is_number = false;
									}
									if (is_number == true) {
										m.requirements[data_label] = Number(m.
											requirements[data_label]);
										if (String(m.requirements[data_label])
												== 'NaN') {
											m.requirements[data_label] = 0;
										}
									}
								}
						}
					}
				}
				// Find if the level is time limited
				if (m.requirements.time) {
					if (!isNaN(Number(m.requirements.time))) {
						m.level_duration = Number(m.requirements.time) * 1000;
						if (m.level_duration > 0) {
							m.is_time_limited = true;
						}
					}
				}
				// Set required score levels
				for (i = 0; i < 3; i++) {
					// Set default score levels
					if (i == 0) {
						m.tube_scores[i] = 10000;
					} else {
						m.tube_scores[i] = Math.floor(m.tube_scores[i - 1]
							* 1.5);
					}
					if (m.requirements['score_' + (i + 1)]) {
						level_score = Number(m.requirements['score_'
							+ (i + 1)]);
						if (!isNaN(level_score)) {
							if (level_score > 0) {
								m.tube_scores[i] = level_score;
							}
						}
					}
				}
				// Set numbers of moves if not time limited
				if (m.is_time_limited == false) {
					// Set default moves to 50
					m.moves = 50;
					// Set moves from level data if it exists
					if (m.requirements.moves) {
						level_moves = Number(m.requirements.moves);
						if (!isNaN(level_moves)) {
							if (level_moves > 0) {
								m.moves = level_moves;
							}
						}
					}
					// Adjust moves for losing one when level begins
					m.moves = m.moves + 1;
				}
				// Set list of requirements for display
				m.req_shown = [];
				m.req_amount = [];
				// Add match type to requirement list
				total_req = m.req_match_order.length;
				for (i = 0; i < total_req; i++) {
					if (m.requirements['match_' + m.req_match_order[i]]) {
						req_amount = Number(m.requirements['match_'
							+ m.req_match_order[i]]);
						if (!isNaN(req_amount)) {
							if (req_amount > 0) {
								m.req_shown.push('match_'
									+ m.req_match_order[i]);
								m.req_amount.push(req_amount);
							}
						}
					}
				}
				// Add combo type to requirement list
				total_req = m.req_combo_order.length;
				for (i = 0; i < total_req; i++) {
					if (m.requirements['combo_' + m.req_combo_order[i]]) {
						req_amount = Number(m.requirements['combo_'
							+ m.req_combo_order[i]]);
						if (!isNaN(req_amount)) {
							if (req_amount > 0) {
								m.req_shown.push('combo_'
									+ m.req_combo_order[i]);
								m.req_amount.push(req_amount);
							}
						}
					}
				}
				// Add clear type to requirement list
				total_req = m.req_clear_order.length;
				for (i = 0; i < total_req; i++) {
					if (m.requirements['clear_' + m.req_clear_order[i]]) {
						if (i < 3) {
							req_amount = Number(m.requirements['clear_'
								+ m.req_clear_order[i]]);
							if (!isNaN(req_amount)) {
								if (req_amount > 0) {
									m.req_shown.push('clear_'
										+ m.req_clear_order[i]);
									m.req_amount.push(req_amount);
								}
							}
						} else {
						   if (m.requirements['clear_' + m.req_clear_order[i]]
								== 'true') {
								m.req_shown.push('clear_'
									+ m.req_clear_order[i]);
								m.req_amount.push(-1);
							}
						}
					}
				}
				// Add compounds to the requirement list
				for (i = 1; i < 6; i++) {
					if (m.requirements['compounds_' + i]) {
						req_amount = Number(m.requirements['compounds_' + i]);
						if (!isNaN(req_amount)) {
							if (req_amount > 0) {
								if (m.requirements['compound_' + i]) {
									if (m.requirements['compound_' + i] != '') {
										m.req_shown.push(m.requirements
											['compound_' + i]);
										m.req_amount.push(req_amount);
									}
								}
							}
						}
					}
				}
				// Set total listed requirements
				m.total_requirements = m.req_shown.length;
				if (m.total_requirements > 5) {
					console.log('*** WARNING ***');
					console.log('Too many requirements selected (5 max): '
						+ m.total_requirements);
				}
				// Set total drop types
				m.total_drop_types = m.drop_types.length;
				// Safety Check on drop colors
				if (m.drop_colors.length < 3) {
					console.log('*** WARNING ***');
					console.log('Not enough drop colors selected: '
						+ m.drop_colors);
					m.drop_colors = [m.atom_colors.red, m.atom_colors.orange,
						m.atom_colors.yellow];
				}
				// Replace random atoms
				t.controller.initLevelAtoms({});
				// Start Loading of the background
				m.bg_file = level_json.level.background_jpg;
				//$('#background_filename').val(m.bg_file);
				if (m.bg_file != '') {
					// Start background load if present
					m.game_state = 'loadBackground';
					t.controller.loadBackground({});
				} else {
					// Start game if no background is present
					t.controller.startGame({});
				}
			},
			initLevelAtoms: function (com) {
				/*
					Replace all random atoms with valid atoms
				*/
				var atom_id; // String: The id for a given atom
				var atom_type; // Number: ENUM value of atom type
				var atom_color; // Number: ENUM value of atom color
				var makes_match; // Boolean: Does this color cause a match?
				var test_loops; // Number: Counter for match checks
				var i; // Number:
				var d; // Number: Increment Var for hex direction
				var bonds; // Array: Bonds for checked atom
				var neighbor; // String: Atom ID of the bonded atom
				var neighbor_type; // Number:ENUM value of neighbor atom type
				var legal_moves; // Boolean: Does the random set-up yield a legal move
				var random_atoms; // Array: All atoms that have random atoms
				var total_randoms; // Number: Total number of random atoms
				var all_legal_moves; // Object: Contains all atom lists, move atoms, and move dirs
				var legal_move_counter; // Number: Attempts to find legal moves
				var has_empty_atoms; // Boolean: Does grid have empty atoms?
				// Init function values
				legal_moves = false;
				has_empty_atoms = false;
				random_atoms = [];
				legal_move_counter = 0;
				// Find all randomly assigned atoms
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						atom_type = m.atoms[atom_id].controller.getType();
						if (atom_type == m.atom_types.random_atom) {
							random_atoms.push(atom_id);
						}
						// Check for existance of empty atoms
						if (atom_type == m.atom_types.empty) {
							has_empty_atoms = true;
						}
					}
				}
				total_randoms = random_atoms.length;
				// Repeat while there are no legal moves created by the random atoms
				while (legal_moves == false && legal_move_counter < 1000) {
					// Replace all random atoms with randomly colored atoms
					for (i = 0; i < total_randoms; i++) {
						atom_id = random_atoms[i];
						atom_type = m.atoms[atom_id].controller.getType();
						// Init values for while loop
						makes_match = true;
						test_loops = 0;
						// Set type to atom
						m.atoms[atom_id].controller.setType({
							type: m.atom_types.atom
						});
						// Plug in random colors until a match isn't formed
						while (makes_match == true && test_loops < 1000) {
							// Select random color
							atom_color = t.controller.randomColor({
								atom_id: ''
							});
							// Set color to atom
							m.atoms[atom_id].controller.setColor({
								color: atom_color
							});
							// Check if that color causes a match
							t.controller.clearMatchData({});
							t.controller.checkMatch({
								atom_id: atom_id
							});
							// Stop loop if it didn't cause a match
							if (m.match_s.length + m.match_v.length
									+ m.match_b.length == 0) {
								makes_match = false;
							}
							test_loops = test_loops + 1;
						}
						if (test_loops >= 1000) {
							console.log('initLevelAtoms failed to place non-matching random atoms'); 
						}
					}
					if (has_empty_atoms == true) {
						legal_moves = true;
					} else {
						all_legal_moves = t.controller.checkLegalMoves({});
						if (all_legal_moves.atoms.length > 0) {
							legal_moves = true;
						} else {
							legal_move_counter = legal_move_counter + 1;
						}
					}
				}
				if (legal_move_counter >= 1000) {
					console.log('initLevelAtoms failed to place random atoms with a legal move'); 
				}
				// Set nucleus locking for atom in the grid
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						atom_type = m.atoms[atom_id].controller.getType();
						if (m.atoms[atom_id].controller.getShield() == true) {
							m.atoms[atom_id].controller.setLocked({
								is_locked: true
							});    
						}
						if (atom_type == m.atom_types.nucleus
								|| atom_type == m.atom_types.generator) {
							m.atoms[atom_id].controller.setNucleusLocked({
								is_locked: true
							});
						}
						bonds = m.atoms[atom_id].controller.getBonding();
						for (d = 0; d < 6; d++) {
							neighbor = bonds[d];
							if (neighbor != '') {
								neighbor_type = m.atoms[neighbor].controller
									.getType();
								if (neighbor_type == m.atom_types.nucleus) {
									if (m.atoms[atom_id].controller.getColor()
											== m.atoms[neighbor].controller
											.getColor()) {
										 // Color matched, set nucleus matched
										 m.atoms[atom_id].controller
											.setNucleusMatched({
												is_matched: true
											});
									}
									// Exchange bond lock for nucleus lock
									m.atoms[atom_id].controller
										.setNucleusLocked({
											is_locked: true
										});
									m.atoms[atom_id].controller
										.setLocked({
											is_locked: false
										});
								}
							}
						}
					}
				}
				// Reset rings found after init
				m.rings_found = 0;
			},
			clearMatchData: function (com) {
				/*
					Clears all matching data
				*/
				m.match_s = [];
				m.match_v = [];
				m.match_b = [];
				m.used_s = {};
				m.used_v = {};
				m.used_b = {};
			},
			checkMatch: function (com) {
				/*
					Check for a match on a given atom. Sets 
					the match arrays and the used objects.
					
					Arguments
					com.atom_id: Atom to be checked
				*/
				var list_index; // Number: The index to the match just made
				var used_list; // Object: Pointer to the used list for hex dir
				var spoke_id; // String: Spoke id character
				var atom_type; // Number: ENUM value of the starting atom type
				var atom_color; // Number: ENUM value of starting atom color
				var is_nucleus_matched; // Boolean: Is atom nucleus matched?
				var matching_atoms; // Array: A list match arrays
				var matching_length; // Number: Number of atoms in a spoke
				var base_atom; // String: Atom id of the current atom searched
				var base_color; // Number: ENUM atom color value of compound atom
				var sliders; // Array: List of atom ids that can be slid to
				var still_checking; // Boolean: Still checking direction?
				var return_atoms; // Array: Array included in the match
				var spoke_length; // Number: Length of a directional spoke
				var compounds; // Number: Total compounds to find
				var compound; // String: Compound formula using m.atom_color_chars
				var compound_length; // Number: Size of the compound formula
				var ring_match; // Array: List of atom in the ring match
				var d; // Number: Increment Var for hex directions
				var a; // Number: Increment Var for atoms in direction
				var c; // Number: Increment Var for compounds
				// Init Function Values
				atom_type = m.atoms[com.atom_id].controller.getType();
				atom_color = m.atoms[com.atom_id].controller.getColor();
				is_nucleus_matched = m.atoms[com.atom_id].controller
					.getNucleusMatched();
				if (atom_type == m.atom_types.nucleus
						|| atom_color == m.atom_colors.void
						|| is_nucleus_matched == true) {
					return;
				}
				// Get neighbors that can be slid
				sliders = m.atoms[com.atom_id].controller.getSlide();
				// Check for linking to a nucleus
				if (is_nucleus_matched == false) {
					for (d = 0; d < 6; d++) {
						spoke_id = m.hex_dirs[d % 3];
						if (sliders[d] != '') {
							if (!(m['used_' + spoke_id])[sliders[d]]) {
								if (m.atoms[sliders[d]].controller.getType()
										== m.atom_types.nucleus
										&& m.atoms[sliders[d]].controller
										.getColor() == atom_color) {
									// Set bonding and used values for nucleus match
									m['match_' + spoke_id]
										.push([com.atom_id, sliders[d]]);
									list_index = m['match_' + spoke_id].length
										- 1;
									used_list = m['used_' + spoke_id];
									used_list[com.atom_id] = list_index;
									return;
								}
							}
						}
					}
				}
				// Exit if atom is nucleus locked
				if (m.atoms[com.atom_id].controller.getNucleusLocked()
						== true) {
					return;
				}
				// Check for ring match
				ring_match = [];
				if (atom_color != m.atom_colors.void) {
					for (d = 0; d < 6; d++) {
						if (sliders[d] != '') {
							if (m.atoms[sliders[d]].controller.getColor()
									== atom_color 
									&& m.atoms[sliders[d]].controller
									.getNucleusLocked() == false) {
								ring_match.push(sliders[d]);
							}
						}
					}
				}
				if (ring_match.length == 6) {
					ring_match.unshift(com.atom_id);
					for (d = 0; d < 3; d++) {
						m['match_' + m.hex_dirs[d]].push(ring_match);
						list_index = m['match_' + m.hex_dirs[d]].length;
						for (a = 0; a < 6; a++) {
							(m['used_' + m.hex_dirs[d]])[ring_match[a]]
								= list_index;
						}
					}
					m.rings_found = m.rings_found + 1;
				}
				// Check for matches for compounds
				for (c = 1; c < 6; c++) {
					compounds = m.requirements['compounds_' + c];
					if (compounds > 0) {
						compound = m.requirements['compound_' + c];
						compound_length = compound.length;
						for (d = 0; d < 6; d++) {
							spoke_id = m.hex_dirs[d % 3];
							base_atom = com.atom_id;
							a = 0;
							return_atoms = [];
							while (a < compound_length && base_atom != '') {
								base_color = m.atoms[base_atom].controller
									.getColor();
								if (m.atom_color_chars.substr(base_color, 1)
										== compound[a] && 
										!(m['used_' + spoke_id])[base_atom]
										&& m.atoms[base_atom].controller
										.getNucleusLocked() == false) {
									return_atoms.push(base_atom);
									base_atom = m.atoms[base_atom].controller
										.getNeighbor({
											direction: d 
										});
									if (base_atom != '') {
										a = a + 1;
									}
								} else {
									base_atom = '';
								}
							}
							if (a == compound_length) {
								m['match_' + spoke_id].push(return_atoms);
								list_index = m['match_' + spoke_id].length;
								for (a = 0; a < compound_length; a++) {
									(m['used_' + spoke_id])[return_atoms[a]]
										= list_index;
								}
								// Add to list of compounds found
								m.compounds_found.push(compound);
							}
						}
					}
				}
				// Checking for matches on the spokes
				matching_atoms = [[], [], [], [], [], []];
				for (d = 0; d < 6; d++) {
					spoke_id = m.hex_dirs[d % 3];
					if (!(m['used_' + spoke_id])[com.atom_id]) {
						base_atom = com.atom_id;
						still_checking = true;
						while (still_checking == true) {
							sliders = m.atoms[base_atom].controller.getSlide();
							still_checking = false;
							if (sliders[d] != '') {
								slider_color = m.atoms[sliders[d]].controller
									.getColor();
								if (slider_color == atom_color && 
										!(m['used_' + spoke_id])
										[sliders[d]]
										&& m.atoms[sliders[d]].controller
										.getNucleusLocked() == false) {
									matching_atoms[d].push(sliders[d]);
									base_atom = sliders[d];
									still_checking = true;
								}
							} 
						}
					}
				}
				// Construct array of atoms to return
				for (d = 0; d < 3; d++) {
					return_atoms = [];
					matching_length = matching_atoms[d].length
						+ matching_atoms[d + 3].length;
					if (matching_length > 2) {
						spoke_id = m.hex_dirs[d];
						spoke_length = matching_atoms[d].length;
						for (a = 0; a < spoke_length; a++) {
							return_atoms.push((matching_atoms[d])[a]);
						}
						spoke_length = matching_atoms[d + 3].length;
						for (a = 0; a < spoke_length; a++) {
							return_atoms.push((matching_atoms[d + 3])[a]);
						}
						return_atoms.push(com.atom_id);
						spoke_length = return_atoms.length;
						m['match_' + spoke_id].push(return_atoms);
						list_index = m['match_' + spoke_id].length;
						used_list = m['used_' + spoke_id];
						for (a = 0; a < spoke_length; a++) {
							used_list[return_atoms[a]] = list_index;
						}
					}
				}
			},
			randomColor: function (com) {
				/*
					Returns a random drop color
					
					Arguments
					com.atom_id: The id of the atom that a random color is selected for
					
					Returns
					A ENUM color value
				*/
				var color_index; // Number: Random number inside of drop_colors
				var atom_color; // Number: ENUM value to color to be returned
				var global_color; // Boolean: Is the selection global?
				var gen_colors; // Number: Number of colors to select from for generator
				// Init Funciton Values
				global_color = true;
				if (com.atom_id != '') {
					if (m.generators[com.atom_id]) {
						if (m.generators[com.atom_id].colors != '') {
							global_color = false;
							gen_colors = m.generators[com.atom_id]
								.colors.length;
							color_index = t.controller.rnd({
								max: gen_colors
							});
							atom_color = m.atom_color_chars
								.indexOf(m.generators[com.atom_id].colors
								.substr(color_index,1));
						}   
					}
				}
				if (global_color == true) {
					color_index = t.controller.rnd({
						max: m.total_drop_colors
					});
					atom_color = m.drop_colors[color_index];
				}
				return atom_color;
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
			startGame: function (com) {
				/*
					Display Start Menu over level background
				*/
				m.show_game = true;
				// Close loading message
				BBM({
					com: 'closeMenu',
					menu_id: 'loading'
				});
				if (m.mm.test_level == '') {
					// Display Start Menu
					BBM({
						com: 'openMenu',
						menu_id: 'start_game',
						x: 234,
						blocker: true
					});
					// Display High Scores
					BBM({
						com: 'openMenu',
						menu_id: 'high_scores',
						x: 594,
						delay: 500
					});
				} else {
					// menuCanvas show
					$("#menuCanvas").css("display", "block");
					// Remove the svg loading element
                    $(".wait-svg").remove();
                    
					// Start Test Level
					t.controller.executeExperiment({});
				}
			},
			executeExperiment: function (com) {
				/*
					Game has started, trigger game display
				*/
				m.game_state = 'fallCheck';
				// Start the game
				BBM({
					com: 'levelStarted' 
				});
				// Set the start time for timed levels
				m.start_time = new Date().getTime();
				// Tell gameGrid to operate the game
				m.game_playing = true;
				// Flag the start menu off
				m.start_menu = false;
			},
			startFalling: function (com) {
				/*
					Check to see if any atom need to fall
					and init their falling
				*/
				var started_falling; // Boolean: Did any atom start to fall?
				var l; // Number: Increment Var for line
				var a; // Number: Increment Var for atoms in the line
				var atom_line; // Array: List of atom ids in current line
				var line_length; // Number: Total atoms in the current line
				var atom_id; // String: ID of the current atom in the line
				var atom_type; // Number: ENUM value of the atom type
				var drop_from; // String: The atom id that drops to fill this
				var reverse_direction; // Number: Reverse direction 0/1
				var is_teleported; // Boolean: Is the atom teleported
				// Init function values
				m.falling_atoms = [];
				started_falling = false;
				// Loops through each line of the grid
				for (l = 0; l < m.fall_length; l++) {
					atom_line = m.fall_arrays['fall_' + m.fall_ids[l]];
					line_length = atom_line.length;
					// Randomize reversing of the line check
					reverse_direction = t.controller.rnd({
						max: 2
					});
					// Loops through each atom of the line
					for (a = 0; a < line_length; a++) {
						// Get atom id to check
						if (reverse_direction == 0) {
							atom_id = atom_line[a];
						} else {
							atom_id = atom_line[(line_length - a) - 1];
						}
						// Get atom type
						atom_type = m.atoms[atom_id].controller.getType();
						// Check for antimatter leaving the grid
						if (atom_type == m.atom_types.antimatter) {
							if (m.atoms[atom_id].controller.getExitPoint()
									== true) {
								// Antimatter has left grid
								atom_type = m.atom_types.empty;
								m.atoms[atom_id].controller.setType({
									type: m.atom_types.empty
								});
								t.controller.decreaseRequirements({
									type: m.atom_types.antimatter,
									color: m.atom_colors.void 
								});
								// Update Requirements
								BBM({
									com: 'updateSideMenu',
									area: 'requirements'
								});
							}
						}
						// Check for emptied atom
						if (atom_type == m.atom_types.empty) {
							// Check for valid drop or creation
							if (m.atoms[atom_id].controller.getAtomCreator()
									== true) {
								// Create new atom
								t.controller.createAtom({
									atom_id: atom_id
								});
								m.falling_atoms.push(atom_id);
								started_falling = true;
							} else {
								// Find which atom to drop from
								drop_from = t.controller.findDropAtom({
									atom_id: atom_id
								});
								if (drop_from != '') {
									// Calculate if teleporter was used
									is_teleported = false;
									if (m.atoms[drop_from].controller
											.getTeleporter() == atom_id) {
										is_teleported = true;
									}
									// Start atom falling
									t.controller.startDropAtom({
										atom_from: drop_from,
										atom_to: atom_id,
										teleporter: is_teleported
									});
									m.falling_atoms.push(atom_id);
									started_falling = true;
								}
							}
						}
					}
				}
				// Get Start time for the falling of the group of atoms
				m.falling_time = new Date().getTime();
				// Set the start time of each atom moved in this group
				m.falling_total = m.falling_atoms.length;
				for (a = 0; a < m.falling_total; a++) {
					m.atoms[m.falling_atoms[a]].controller.startMoveTime({
						start_time: m.falling_time,
						travel_time: m.falling_duration
					});
				}
				return started_falling;
			},
			createAtom: function (com) {
				/*
					Create a new atom from off-screen and drop it into the
					empty atom creator hex
					
					Arguments
					com.atom_id: The id of the hex position for the new atom
				*/
				var atom_gen; // Object: Pointer to the atom generator
				var has_generator; // Boolean: Has the atom have an atom generator?
				var atom_type; // Number: ENUM value of the new atom
				var atom_color; // Number: ENUM value of the new atom
				var atom_counter; // Number: The counter value for the new atom
				var a; // Number: Increment Var for atom types
				var random_create; // Number: Random percentage for types
				var chance_value; // Number: Incremental chance for special type
				var add_chance; // Number: Amount to add to chance_value for type
				var y_offset; // Number: Distance of y drop when created
				var north_neighbor; // String: Atom ID of northern neighbor atom
				// Init function values
				has_generator = false;
				atom_counter = -1;
				atom_color = t.controller.randomColor({
					atom_id: com.atom_id   
				});
				atom_type = m.atom_types.atom;
				chance_value = 0;
				random_create = t.controller.rnd({
					max: 1000
				});
				if (m.generators[com.atom_id]) {
					atom_gen = m.generators[com.atom_id];
					has_generator = true;
					if (atom_gen.atoms.length > 0) {    
						atom_type = atom_gen.atoms.shift();
						if (atom_gen.atoms[0] == -2) {
							atom_color = m.atom_colors.void;
						}
						if (atom_gen.atoms[0] > -1) {
							atom_color = atom_gen.atoms[0];
						}
						atom_gen.atoms.shift();
						atom_counter = atom_gen.atoms.shift();
					} else {
						for (a = 0; a < 5; a++) {
							add_chance = atom_gen[m.drop_prefix[a]].precent
								* 10;
							if (m.drop_prefix[a] == 'anti') {
								if (m.antimatter_inplay 
										== m.requirements.clear_antimatter) {
									add_chance = 0;
								}
							}
							chance_value = chance_value + add_chance;
							if (random_create < chance_value) {
								switch (m.drop_prefix[a]) {
									case 'hole':
										atom_type = m.atom_types.blackhole;
										break;
									case 'anti':
										atom_type = m.atom_types.antimatter;
										break;
									case 'radio':
										atom_type = m.atom_types.radioactive;
										break;
									case 'void':
										atom_type = m.atom_types.void;
										break;
									case 'freeze':
										atom_type = m.atom_types.freeze;
										break;
								}
								if (atom_type == m.atom_types.antimatter) {
									m.antimatter_inplay = m.antimatter_inplay
										+ 1;
								}
								atom_counter = atom_gen[m.drop_prefix[a]]
									.counter;
								break;
							}
						}
					}
				}
				if (has_generator == false) {
					// Use the level default drop data
					// Check each type to see if it was randomly selected
					for (a = 0; a < m.total_drop_types; a++) {
						add_chance = m.drop_percent['type_' + m.drop_types[a]];
						if (m.drop_types[a] == m.atom_types.antimatter) {
							if (m.antimatter_inplay 
									== m.requirements.clear_antimatter) {
								add_chance = 0;
							}
						}
						chance_value = chance_value + add_chance;
						if (random_create < chance_value) {
							atom_type = m.drop_types[a];
							if (atom_type == m.atom_types.antimatter) {
								m.antimatter_inplay = m.antimatter_inplay + 1;
							}
							atom_counter = m.drop_counters['type_' + m
								.drop_types[a]];
							break;
						}
					}
				}
				// Clear color for special atoms
				if (atom_type == m.atom_types.void 
						|| atom_type == m.atom_types.antimatter
						|| atom_type == m.atom_types.big_bang) {
					atom_color = m.atom_colors.void;
				}
				// Set new atom values
				m.atoms[com.atom_id].controller.setType({
					type: atom_type
				});
				m.atoms[com.atom_id].controller.setColor({
					color: atom_color
				});
				m.atoms[com.atom_id].controller.setMoveCounter({
					moves: atom_counter
				});
				y_offset = m.y_inc;
				north_neighbor = m.atoms[com.atom_id].controller.getNeighbor({
					direction: 4
				});
				if (north_neighbor == '') {
					y_offset = m.y_inc * 2;
				} else {
					if (m.atoms[north_neighbor].controller.getType()
							== m.atom_types.generator) {
						m.atoms[north_neighbor].controller.startCreation({
							start_time: new Date().getTime(),
							duration: m.falling_duration * 3
						});
					}   
				}
				m.atoms[com.atom_id].controller.startMove({
					x_start: m.atoms[com.atom_id].controller.getX(),
					y_start: m.atoms[com.atom_id].controller.getY() - y_offset,
					is_teleporting: false
				});
			},
			findDropAtom: function (com) {
				/*
					Calculates and returns the atom the will
					drop to fill the current empty atom
					
					Arguments
					com.atom_id: The id of the atom that is empty
					
					Returns
					ID of the atom to drop from
				*/
				var drop_atom; // String: ID of the atom to drop from
				var side_drop; // Number: Which side to check first
				var atom_drops; // Array: Atom IDs for the three drop directions
				var drop_id; // String: ID of the atom being checked to drop
				var atom_type; // Number: ENUM value of falling atom
				var atom_locked; // Boolean: Is the falling atom locked?
				var nucleus_locked; // Boolean: Is the falling atom nucleus locked?
				var atom_moving; // Boolean: Is the atom moving?
				var drop_order; // Array: Order in which to check legal drops
				var d; // Number: Increment Var
				// Init function values
				drop_atom = '';
				atom_drops = m.atoms[com.atom_id].controller.getDrop();
				// Select random drop order
				side_drop = t.controller.rnd({
					max: 2
				});
				drop_order = [1, (side_drop * 2), (2 - (side_drop * 2))];
				// Check each drop direction to see if it is legal
				for (d = 0; d < 3; d++) {
					drop_id = atom_drops[drop_order[d]];
					if (drop_id != '') {
						atom_type = m.atoms[drop_id].controller.getType();
						atom_locked = m.atoms[drop_id].controller.getLocked();
						nucleus_locked = m.atoms[drop_id].controller
							.getNucleusLocked();
						atom_moving = m.atoms[drop_id].controller
							.isAtomMoving();
						if (atom_type > m.atom_types.empty) {
							if (atom_locked == false && atom_moving == false
									&& nucleus_locked == false) {
								// Legal drop
								drop_atom = drop_id;
								break;
							} 
						}
					}
				}
				return drop_atom;
			},
			startDropAtom: function (com) {
				/*
					Start an atom moving from one hex to another
					
					Arguments
					com.atom_from: Atom id that is dropping
					com.atom_to: Atom id where the drop to headed to
					com.teleporter: Boolean on whether the atom is teleported
				*/
				m.atoms[com.atom_from].controller.copyContents({
					atom_id: com.atom_to 
				});
				m.atoms[com.atom_from].controller.clearContents({});
				m.atoms[com.atom_to].controller.startMove({
					x_start: m.atoms[com.atom_from].controller.getX(),
					y_start: m.atoms[com.atom_from].controller.getY(),
					is_teleporting: com.teleporter
				});
			},
			timerEvent: function (com) {
				/*
					Operates timed events at 30 fps
				*/
				if (m.freeze_game == -1) {
					if (m.game_playing == true) {
						// Calls game state functions if the game is running
						t.controller['gs_' + m.game_state]();
					}
				}
			},
			gs_fallCheck: function() {
				/*
					Check to see if any atoms should be
					falling
				*/
				var are_atoms_falling; // Boolean: Are atoms falling?
				are_atoms_falling = t.controller.startFalling({});
				if (are_atoms_falling == true) {
					m.game_state = 'atomsFalling';
				} else {
					m.falling_time = -1;
					m.game_state = 'fallMatches';
				}
			},
			gs_atomsFalling: function (com) {
				/*
					Checks to see if the atom drop is 
				*/
				var a; // Number: Increment Var for atoms
				var fall_done; // Boolean: Is the fall group done?
				if (m.falling_time > -1) {
					fall_done = false;
					if (new Date().getTime() > m.falling_time 
							+ m.falling_duration) {
						// Check all atoms to see if they are done falling
						fall_done = true;
						for (a = 0; a < m.falling_total; a++) {
							if (m.atoms[m.falling_atoms[a]].controller.
									isAtomMoving() == true) {
								fall_done = false;
								break;
							}
						}
						// If done falling, see if further falling is needed
						if (fall_done == true) {
							t.controller.gs_fallCheck();
						}
					}
				}
			},
			gs_fallMatches: function (com) {
				/*
					Check for matches caused by atoms falling
					into place
				*/
				var atom_id; // String: The id for a given atom
				m.game_state = 'checkLegalMoves';
				// Check each atom for matches
				t.controller.clearMatchData({});
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						// Check for match on this 
						t.controller.checkMatch({
							atom_id: atom_id
						});
					}
				}
				t.controller.executeMatches({});
				t.controller.executeSpecials({});
				// Reset exchange ids and dir
				m.exchange_atoms = ['', ''];
				m.exchange_dir = -1;
			},
			executeMatches: function (com) {
				/*
					Execute any matches that were found
				*/
				var matches_found; // Boolean: Were matches found?
				var total_matches; // Number: Matches for the current direction
				var spoke_id; // String: Id character for hex direction
				var spoke_list; // Array: Pointer to the curent hex direction array
				var match_list; // Array: Pointer to atoms in the match
				var match_length; // Number: Number of atoms in the match
				var match_index; // Number: Index to the match being filled
				var explode_list; // Array: List of all exploding atom for match
				var explode_atom; // String: Id of the exploding atom
				var explode_dir; // Number: Hex direction of the exploding atom
				var explode_type; // Number: ENUM value of exploding atom type
				var other_list; // Array: Matches in other hex directions
				var other_length; // Number: Length of other_list
				var other_used_list; // Number: Index of a used atom in other direction
				var other_used; // Number: Index of a used atom in other direction
				var bonds; // Array: Bonds to the checked nucleus atom
				var slider; // Array: Legal slide atom from current atom
				var is_filled; // Boolean: Are all atoms in a nucleus filled?
				var disable_match; // Boolean: Should the match be disabled?
				var d; // Number: Increment Var for hex direction
				var a; // Number: Increment Var for atoms in match
				var l; // Number: Increment Var for match lists
				var s; // Number: Increment Var for other spokes
				// Init function values
				matches_found = false;
				m.specials = [];
				m.special_times = [];
				m.special_pos = [];
				m.matches = [];
				m.match_pos = [];
				m.result_ids = [];
				m.breakups = [];
				m.explode_time = new Date().getTime();
				// Check for matches in each hex direction
				for (d = 0; d < 3; d++) {
					spoke_id = m.hex_dirs[d];
					spoke_list = m['match_' + spoke_id];
					total_matches = spoke_list.length;
					for (l = 0; l < total_matches; l++) {
						match_list = spoke_list[l];
						match_length = match_list.length;
						if (match_length == 2) {
							// Needs to be moved to executeMatch
							m.atoms[match_list[0]].controller.setType({
								type: m.atom_types.atom
							});
							m.atoms[match_list[0]].controller.setMoveCounter({
								moves: -1
							});
							m.atoms[match_list[0]].controller
								.setNucleusMatched({
									is_matched: true
								});
							// Nucleus Match
							explode_atom = match_list[1];
							is_filled = true;
							// Find Nucleus
							bonds = m.atoms[explode_atom].controller
								.getBonding();
							for (s = 0; s <6; s++) {
								if (bonds[s] == '') {
									is_filled = false;
								} else {
									if (m.atoms[bonds[s]].controller
											.getColor() !=
											m.atoms[explode_atom].controller
											.getColor()) {
										is_filled = false;
									}      
								}
							}
							if (is_filled == true) {
								matches_found = true;
								// Add nucleus to special explosions
								m.specials.push(explode_atom);
								m.special_times.push(0);
								m.special_pos.push(explode_atom);
								// Clear all bonding on bonded atoms
								for (s = 0; s <6; s++) {
									m.atoms[bonds[s]].controller.setBonds({
										bonds: ['', '', '', '', '', '']
									});
									m.atoms[bonds[s]].controller
										.setNucleusLocked({
											is_locked: false
										});
									m.atoms[bonds[s]].controller
									.setNucleusMatched({
										is_matched: false
									});
								}
								// Clear all bonding on nucleus
								m.atoms[explode_atom].controller.setBonds({
									bonds: ['', '', '', '', '', '']
								});
								m.atoms[explode_atom].controller
									.setNucleusLocked({
										is_locked: false
									});
								// Reduce required nucleus
								t.controller.decreaseRequirements({
									type: m.atom_types.nucleus,
									color: -1
								});
							}
						} else {
							if (match_length > 0) {
								// Normal Match
								// Check for if contains nucleus locked
								disable_match = false;
								for (a = 0; a < match_length; a++) {
									if (match_list[a] != '') {
										if (m.atoms[match_list[a]].controller
												.getNucleusLocked() == true) {
											disable_match = true;
										}
									}
								}
								// Disable Match if continues nucleus locked
								if (disable_match == true) {
									continue;   
								}
								// Legal match, init loop values
								matches_found = true;
								match_index = m.matches.length;
								m.matches.push([]);
								m.result_ids.push('');
								m.match_pos.push(m.matches[0]);
								explode_list = [];
								for (a = 0; a < match_length; a++) {
									if (match_list[a] != '') {
										explode_list.push(match_list[a]);
										explode_list.push(d);
									}
								}
								if (match_length > 4) {
									t.controller.createSpecial({
										direction: d,
										match_index: l,
										previous_match: 0,
										match: match_index
									});
								}
								while (explode_list.length > 0) {
									explode_atom = explode_list.shift();
									explode_dir = explode_list.shift();
									if (explode_atom != '' && explode_atom
											!= '') {
										explode_type = m.atoms[explode_atom]
											.controller.getType();
										if (m.atoms[explode_atom].controller
												.isAtomExploding() == false) {
											m.matches[match_index]
												.push(explode_atom);
											m.atoms[explode_atom].controller
												.startExplosion({
													start_time: m.explode_time,
													duration: m.explode_duration
												});
										}
										t.controller.checkNeighbors({
											atom_id: explode_atom
										});
										if (explode_type 
												>= m.atom_types.big_bang
												&& explode_type
												<= m.atom_types.bang_full) {
											m.specials.push(explode_atom);
											m.special_times.push(0);
											m.special_pos.push(explode_atom);
										}
										for (s = d + 1; s < 3; s++) {
											other_used_list = m['used_' 
												+ m.hex_dirs[s]];
											// stored index is +1 to defeat
											//     the undefined issue with
											//     the used objects
											used_other 
												= other_used_list
												[explode_atom];
											if (used_other) {
												other_list = (m['match_'
													+ m.hex_dirs[s]])
													[used_other - 1];
												other_length = other_list
													.length;
												if (other_length > 3) {
													t.controller
														.createSpecial({
															direction: s,
															match_index:
																used_other - 1,
															previous_match:
																match_length,
															match: 
																match_index
													});  
												}
												for (a = 0; a < other_length;
														a++) {
													if (other_list[a] 
															!= explode_atom
															&& other_list[a] 
															!= '') {
														explode_list
															.push(
															other_list[a]);
														explode_list.push(s);
													}
													other_used_list
														[other_list[a]]
														= undefined;
													other_list[a] = '';
												}
											}
										}
									}
								}
							}
						}
					}
				}
				if (matches_found == true) {
					m.game_state = 'explodeWait';
				}
			},
			checkNeighbors: function (com) {
				/*
					Check all neighboring atoms and start
					destruction effect if it is a void or
					a crystal
					
					Arguments
					com.atom_id: 
				*/
				var atom_type; // Number: ENUM atom type value of checked atom
				var neighbor; // String: Atom ID of the neighboring atom checked
				var d; // Number: Increment Var for hex direction
				for (d = 0; d < 6; d++) {
					neighbor = m.atoms[com.atom_id].controller.getNeighbor({
						direction: d 
					});
					if (neighbor != '') {
						atom_type = m.atoms[neighbor].controller.getType();
						if (atom_type == m.atom_types.void ||
								atom_type == m.atom_types.crystal
								|| (atom_type >= m.atom_types.absorber
								&& atom_type <= m.atom_types.absorber_x7)) {
							if (m.atoms[neighbor].controller.isAtomExploding()
									== false
									&& m.atoms[neighbor].controller
									.getNucleusLocked() == false) {
								m.atoms[neighbor].controller.startExplosion({
									start_time: m.explode_time,
									duration: m.explode_duration
								});
								m.breakups.push(neighbor);
								if (m.atom_types.crystal == atom_type) {
									m.crystal_broken = true;   
								}
							}
						}
					}
				}
			},
			createSpecial: function (com) {
				/*
					Create a special atom based on a given
					match list
					
					Arguments:
					com.direction: Hex direction of the match
					com.match_index: Index position on directional matches
					com.previous_match: Size of the last match
					com.match: Index versus the main match list
				*/
				var current_type; // Number: ENUM atom type at current result_pos
				var current_color; // Number: Color of the result atom position
				var result_type; // Number: ENUM atom type valid being created
				var atom_id; // String: Id of the atom being checked
				var spoke_id; // String: Id character for hex direction
				var spoke_list; // Array: Pointer to the curent hex direction array
				var match_list; // Array: Atoms that form the match
				var match_length; // Number: Length of the match_list
				var pick_random; // Array: List of atom ids in match for random selection
				var random_index; // Number: Random index into pick_random
				var cross_length; // Number: Shortest length of crossed matches
				var total_specials; // Number: Total 
				var a; // Number: Increment Var for atoms in match
				// Init function values
				spoke_id = m.hex_dirs[com.direction];
				spoke_list = m['match_' + spoke_id];
				match_list = spoke_list[com.match_index];
				// Set location of power-up creation if it is missing
				if (m.result_ids[com.match] == '' && match_list) {
					match_length = match_list.length;
					for (a = 0; a < match_length; a++) {
						if (match_list[a] != '') {
							if (match_list[a] == m.exchange_atoms[0]) {
								m.result_ids[com.match] = match_list[a];
							} else {
								if (match_list[a] == m.exchange_atoms[1]) {
									m.result_ids[com.match]
										= match_list[a];
								}
							}
						}              
					}
					if (m.result_ids[com.match] == '') {
						// Set list of possible positions for the special atom
						pick_random = [];
						for (a = 0; a < match_length; a++) {
							if (match_list[a] != '') {
								if (m.atoms[match_list[a]].controller
										.getNucleusLocked() == false
										&& m.atoms[match_list[a]].controller
										.getColor() != m.atom_colors.void) {
									pick_random.push(match_list[a]);
								}
							}
						}
						// Abort special atom if no position can be selected
						if (pick_random.length == 0) {
							return;  
						}
						// Select random position from list
						while (pick_random.length > 0) {
							random_index = t.controller.rnd({
								max: pick_random.length
							});
							if (pick_random[random_index] != '') {
								m.result_ids[com.match]
									= pick_random[random_index];
								break;
							} else {
								pick_random.splice(random_index, 1);
							}
						}
					}
				}
				// Set default values for atom replacement
				current_type = m.atom_types.atom;
				total_specials = m.new_specials.length;
				for (a = 0; a < total_specials; a = a + 3) {
					if (m.new_specials[a] == m.result_ids[com.match]) {
						current_type = m.new_specials[a + 1];
					}
				}
				result_type = m.atom_types.atom;
				// Add special atom if match list is filled and has position
				if (m.result_ids[com.match] != '' && match_list.length > 0) {
					// Abort special atom creation if target atom has no color
					if (m.atoms[m.result_ids[com.match]].controller.getColor()
							== m.atom_colors.void) {
						console.log('Abort due to no color');
						return;
					}
					// Add plasma power-up
					if (match_list.length == 5) {
						if (current_type != m.atom_types.big_bang
								&& current_type != m.atom_types.bang_full
								&& current_type != m.atom_types.bang_medium
								&& current_type != m.atom_types.bang_backslash
								&& current_type != m.atom_types.bang_vert
								&& current_type != m.atom_types.bang_slash) {
							result_type = m.atom_types.bang_plasma;
						}
					}
					// Add line power-up
					if (match_list.length == 6) {
						if (current_type != m.atom_types.big_bang
								&& current_type != m.atom_types.bang_full) {
							if (m.exchange_dir == -1) {
								result_type = m.atom_types.bang_slash
									+ t.controller.rnd({
										max: 3  
									});
							} else {
								result_type = m.atom_types.bang_slash
									+ (m.exchange_dir % 3);
							}
						}
					}
					// Add big bang power-up
					if (match_list.length >= 7) {
						result_type = m.atom_types.big_bang;
					}
					// Check for crossing matches
					if (com.previous_match > 3 && match_list.length > 3) {
						cross_length = match_list.length + com.previous_match;
						if (cross_length >= match_list.length) {
							if (cross_length == 8) {
								if (current_type < m.atom_types.big_bang
										|| current_type
										> m.atom_types.bang_full) {
									result_type = m.atom_types.bang_small;
								}
							}
							if (cross_length >8 && cross_length < 11) {
								if (current_type != m.atom_types.big_bang) {
									result_type = m.atom_types.bang_medium;
								}
							}
							if (cross_length >10) {
								if (current_type != m.atom_types.big_bang) {
									result_type = m.atom_types.bang_full;
								}
							}
						}
					}
					if (result_type != m.atom_types.atom) {
						// Save new special on new_specails list
						m.new_specials.push(m.result_ids[com.match]);
						m.new_specials.push(result_type);
						current_color = m.atoms[m.result_ids[com.match]]
							.controller.getColor();
						if (result_type == m.atom_types.big_bang) {
							current_color = m.atom_colors.void;
						}
						m.new_specials.push(current_color);
					}
				}
			},
			executeSpecials: function (com) {
				/*
					Executes a special atoms that were
					exploded
				*/
				var d; // Number: Increment Var for 
				var s; // Number: Increment Var
				var i; // Number: Increment Var
				var a; // Number: Increment Var
				var wild_id; // String: ID of the atom being check for a wild combo
				var atom_id; // String: ID of the atom that exploded
				var atom_delay; // Number: Time delay in start of effect
				var atom_type; // Number: ENUM value of the exploding atom
				var atom_color; // Number: ENUM value of the exploding atom
				var spoke_atom; // String: ID of the next atom in a spoke
				var spoke_dir; // Number: Hex direction of the spoke
				var explode_atom; // String: ID of the atom contained in the effect
				var explode_dirs; // Array: Hex directions of the effect
				var dir_length; // Number: Elements in explode_dirs
				var explode_dir; // Number: Hex direction of current spoke
				var explode_range; // Number: Range of explosion
				var explode_steps; // Number: Hex distance effect have traveled
				var explode_ring; // Number: Radius of secondary explosions
				var explode_width; // Number: width of explosion line
				var radius_remove; // Number: Number of closest non-exploding atoms to remove
				var radius_explode; // Number: Atoms to remove around a radius_remove
				var radius_line; // Number: Atom wide to create line from radius_remove
				var delay_step; // Number: Delay between explode effects
				var explode_atoms; // Array: Atoms effected by the effect
				var explode_type; // Number: ENUM value of atom type in effect
				var create_bang; // Boolean: Create big bang atom when done
				var line_dirs; // Number: Line value to be decreased
				var x_dif; // Number: Difference in X positions
				var y_dif; // Number: Difference in Y positions
				var atom_distance; // Number: Distance to other atom
				var range_sort; // Array: Distance sorted list of colored atoms
				var range_type; // Number: ENUM value of ranged atom type
				var new_type; // Number: ENUM value of new atom created
				// Init function values
				m.explode_delay = 0;
				// Loop through each special and execute their effects
				for (s = 0; s < m.specials.length; s ++) {
					// Set default explosion values
					explode_atoms = [];
					radius_remove = -1;
					radius_explode = 0;
					radius_line = 0;
					explode_ring = -1;
					explode_width = 0;
					explode_range = 0;
					explode_dirs = [];
					create_bang = false;
					delay_step = 25;
					// Read source atom data
					atom_id = m.specials[s];
					atom_delay = m.special_times[s];
					atom_type = m.atoms[atom_id].controller.getType();
					atom_color = m.atoms[atom_id].controller.getColor();
					// Decrease requirements for this special
					t.controller.decreaseRequirements({
						type: atom_type,
						color: atom_color
					});
					// Clear special atom
					if (atom_color != m.atom_colors.void) {
						m.atoms[atom_id].controller.setType({
							type: m.atom_types.atom
						});
					} else {
						m.atoms[atom_id].controller.setType({
							type: m.atom_types.void
						});
					}
					// Set effect for basic atoms
					switch (atom_type) {
						case m.atom_types.nucleus:
							explode_dirs = [0, 1, 2, 3, 4, 5];
							explode_range = 99;
							break;
						case m.atom_types.big_bang:
							explode_ring = 3;
							break;
						case m.atom_types.bang_slash:
							explode_dirs = [0, 3];
							explode_range = 99;
							break;
						case m.atom_types.bang_vert:
							explode_dirs = [1, 4];
							explode_range = 99;
							break;
						case m.atom_types.bang_backslash:
							explode_dirs = [2, 5];
							explode_range = 99;
							break;
						case m.atom_types.bang_plasma:
							radius_remove = 5;
							break;
						case m.atom_types.bang_small:
							explode_ring = 0;
							break;
						case m.atom_types.bang_medium:
							explode_ring = 1;
							break;
						case m.atom_types.bang_full:
							explode_ring = 2;
							break;
					} 
					// Set effect for combo atoms
					if (atom_type > 99) {
						if (atom_type == 100) {
							// 4C4C combo
							explode_ring = 1;
						}
						if (atom_type >= 110 && atom_type < 120) {
							// 4C5 combo
							atom_color = atom_type - 110;
							radius_remove = 10;
						}
						if (atom_type == 120) {
							// 4C5C combo
							explode_ring = 2;
						}
						if (atom_type >= 130 && atom_type < 140) {
							// 4C6 combo
							explode_ring = 1;
							explode_range = 999;
							switch (atom_type) {
								case 130:
									explode_dirs = [0, 3];
									break;
								case 131:
									explode_dirs = [1, 4];
									break;
								case 132:
									explode_dirs = [2, 5];
									break;
							}
						}
						if (atom_type == 140) {
							// 4C6C combo
							explode_ring = 3;
						}
						if (atom_type >= 150 && atom_type < 160) {
							// 4C7 combo
							radius_remove = 9999;
							explode_ring = 2;
							atom_color = atom_type - 150;
						}
						if (atom_type >= 160 && atom_type < 170) {
							// 55 combo
							atom_color = atom_type - 160;
							radius_remove = 15;
						}
						if (atom_type >= 170 && atom_type < 180) {
							// 55C combo
							radius_explode = 1;
							atom_color = atom_type - 170;
							radius_remove = 5;
						}
						if (atom_type >= 180 && atom_type < 190) {
							// 56 combo
							radius_line = 1;
							atom_color = atom_type - 180;
							radius_remove = 5;
						}
						if (atom_type >= 190 && atom_type < 200) {
							// 56C combo
							radius_explode = 1;
							atom_color = atom_type - 190;
							radius_remove = 10;
						}
						if (atom_type >= 200 && atom_type < 210) {
							// 57 combo
							explode_ring = 2;
							radius_explode = 1;
							atom_color = atom_type - 200;
							radius_remove = 9999;
						}
						if (atom_type == 210) {
							// 5C5C combo
							explode_ring = 3;
						}
						if (atom_type >= 220 && atom_type < 230) {
							// 5C6 combo
							explode_dirs = [];
							explode_dirs.push(atom_type - 220);
							explode_dirs.push(atom_type - 217);
							explode_width = 1;
							explode_range = 99;
						}
						if (atom_type == 230) {
							// 5C6C combo
							explode_ring = 3;
							explode_dirs = [0, 1, 2, 3, 4, 5];
							explode_range = 99;
						}
						if (atom_type >= 240 && atom_type < 250) {
							// 5C7 combo
							radius_remove = 9999;
							atom_color = atom_type - 240;
							explode_ring = 3;
						}
						if (atom_type >= 250 && atom_type < 260) {
							// 66 combo
							line_dirs = atom_type -250;
							explode_dirs = [];
							if (line_dirs >= 4) {
								 line_dirs = line_dirs - 4;
								 explode_dirs.push(2);
								 explode_dirs.push(5); 
							}
							if (line_dirs >= 2) {
								 line_dirs = line_dirs - 2;
								 explode_dirs.push(1);
								 explode_dirs.push(4); 
							}
							if (line_dirs == 1) {
								 explode_dirs.push(0);
								 explode_dirs.push(3); 
							}
							explode_range = 99;
							explode_ring = 1;
						}
						if (atom_type >= 260 && atom_type < 270) {
							// 66C combo
							explode_ring = 2;
							explode_dirs = [0, 1, 2, 3, 4, 5];
							explode_range = 99;
							explode_width = 1;
						}
						if (atom_type >= 270 && atom_type < 280) {
							// 67 combo
							radius_line = 1;
							atom_color = atom_type - 270;
							radius_remove = 999;
						}
						if (atom_type == 280) {
							// 6C6C combo
							explode_ring = 3;
							explode_dirs = [0, 1, 2, 3, 4, 5];
							explode_range = 99;
							explode_width = 1;
						}
						if (atom_type >= 290 && atom_type < 300) {
							// 6C7 combo
							explode_ring = 3;
							radius_remove = 999;
							atom_color = atom_type - 290;
							radius_explode = 1;
							explode_dirs = [0, 1, 2, 3, 4, 5];
							explode_range = 99;
							explode_width = 1;
						}
						if (atom_type == 300) {
							// Damage all atoms
							radius_remove = 9999;
							atom_color = -1;
						}
						if (atom_type >= 310 && atom_type < 320) {
							radius_remove = 999;
							atom_color = atom_type - 310;
						}
					}
					if (atom_type >=100) {
						// Clear combo atom
						m.atoms[atom_id].controller.setType({
							type: m.atom_types.empty
						});
						m.atoms[atom_id].controller.setColor({
							color: m.atom_colors.void
						});
					}
					if (explode_range > 0) {
						m.atoms[atom_id].controller.setType({
							type: m.atom_types.atom 
						});
						if (m.atoms[atom_id].controller.isAtomExploding()
							   == false) {
						   explode_atoms.push(atom_id);
						   m.atoms[atom_id].controller.startExplosion({
							   start_time: m.explode_time + atom_delay,
							   duration: m.explode_duration
						   });
						}
						dir_length = explode_dirs.length;
						for (d = 0; d < dir_length; d++) {
							explode_dir = explode_dirs[d];
							explode_atom = atom_id;
							explode_steps = 0;
							while (explode_steps < explode_range) {
								explode_steps = explode_steps + 1;
								explode_atom = m.atoms[explode_atom].controller
									.getNeighbor({
										direction: explode_dir    
									});
								if (explode_atom == '') {
									break;    
								} else {
									if (m.atoms[explode_atom].controller
											.getNucleusLocked() == true) {
										break;
									} else {
										if (t.controller.notInList({
													list: explode_atoms,
													member: explode_atom
												}) == false && 
												m.atoms[explode_atom]
												.controller.isAtomExploding()
												== false
												&& m.atoms[explode_atom]
												.controller
												.getNucleusLocked()
												== false) {
											explode_atoms
												.push(explode_atom);
											m.atoms[explode_atom]
												.controller
												.startExplosion({
													start_time: 
														m.explode_time
														+ (explode_steps
														* delay_step)
														+ atom_delay,
													duration:
														m.explode_duration
												});
											if ((explode_steps * delay_step)
													+ atom_delay 
													> m.explode_delay) {
												m.explode_delay =
													(explode_steps
													* delay_step)
													+ atom_delay;
											}
											explode_type = m.atoms
												[explode_atom]
												.controller.getType();
											if (explode_type
													>= m.atom_types
													.big_bang
													&& explode_type
													<= m.atom_types
													.bang_full) {
												m.specials
													.push(explode_atom);
												m.special_times
													.push(atom_delay
													+ (explode_steps
													* delay_step));
												m.special_pos
													.push(explode_atom);
											}
											if (explode_width > 0) {
												for (i = 0; i < 6; i++) {
													if (t.controller.notInList({
															list: explode_dirs,
															member: i
															}) == false) {
														spoke_atom = explode_atom;
														a = 0;
														spoke_dir = i;
														while (a < explode_width) {
															if (spoke_atom != '') {
																spoke_atom = m.atoms
																	[spoke_atom]
																	.controller
																	.getNeighbor({
																		direction:
																			spoke_dir
																	});
																if (spoke_atom != '') {
																	if (t.controller.notInList({
																				list: explode_atoms,
																				member: spoke_atom
																			}) == false
																			&& m.atoms[spoke_atom].controller
																			.isAtomExploding() == false
																			&& m.atoms[spoke_atom]
																			.controller
																			.getNucleusLocked()
																			== false) {
																		explode_atoms
																			.push(
																			spoke_atom);
																		m.atoms[spoke_atom]
																			.controller
																			.startExplosion({
																				start_time: 
																					m.explode_time
																					+ (explode_steps
																					* delay_step)
																					+ atom_delay,
																			duration:
																				m.explode_duration
																		});
																		explode_type = m.atoms
																			[spoke_atom]
																			.controller
																			.getType();
																		if (explode_type
																				>= m.atom_types
																				.big_bang
																				&& explode_type
																				<= m.atom_types
																				.bang_full) {
																			m.specials
																				.push(
																				spoke_atom);
																			m.special_times
																				.push(atom_delay
																				+ (explode_steps
																				* delay_step));
																			m.special_pos
																				.push(
																				spoke_atom);
																		}
																	}
																}
															}
															a = a + 1;
														}
													}
												}
											}
											if (m.atoms[explode_atom]
													.controller
													.getShield() == true
													|| explode_type
													== m.atom_types.void) {
												break;            
											}
										}
									}
								}
							}
						}
					}
					if (explode_ring > -1) {
						m.atoms[atom_id].controller.setType({
							type: m.atom_types.atom 
						});
						for (i = 0; i <= explode_ring; i = i + explode_ring) {
							for (d = 0; d < 6; d++) {
								spoke_atom = atom_id;
								explode_atom = atom_id;
								explode_steps = 0;
								while (explode_steps < i) {
									spoke_atom = m.atoms[explode_atom]
										.controller.getNeighbor({
											direction: d    
										});
									if (spoke_atom == '') {
										// Off grid, stop loop
										break;   
									} else {
										explode_atom = spoke_atom;
									}
									explode_steps = explode_steps + 1;
								}
								if (explode_atom != '') {
									for (a = -1; a < 6; a++) {
										spoke_atom = explode_atom;
										if (a > -1) {
											spoke_atom = m.atoms[explode_atom]
											.controller.getNeighbor({
												direction: a    
											});
										}
										if (spoke_atom != '') {
											if (t.controller.notInList({
														list: explode_atoms,
														member: spoke_atom
													}) == false
													&& m.atoms[spoke_atom]
													.controller
													.isAtomExploding() == false
													&& m.atoms[spoke_atom]
													.controller
													.getNucleusLocked()
													== false) {
												explode_atoms.push(spoke_atom);
												m.atoms[spoke_atom].controller
													.startExplosion({
														start_time:
															m.explode_time
															+ (explode_steps
															* delay_step)
															+ atom_delay,
														duration:
															m.explode_duration
													});
												explode_type =
													m.atoms[spoke_atom]
													.controller.getType();
												if (explode_type
														>= m.atom_types.big_bang
														&& explode_type
														<= m.atom_types
														.bang_full) {
													m.specials.push(spoke_atom);
													m.special_times
														.push(atom_delay
														+ (explode_steps
														* delay_step));
													m.special_pos
														.push(spoke_atom);
												}
											}
										}
									}                         
								}
							}
							// Exit loop if no secondary explosion
							if (explode_ring == 0) {
								break;   
							}
						}
						if (explode_ring == 3) {
							// Fill in gaps in the type 3 ring explosion
							for (d = 0; d < 6; d++) {
								spoke_atom = atom_id;
								for (a = 0; a < 4; a++) {
									spoke_atom = m.atoms[spoke_atom]
										.controller.getNeighbor({
											direction: (d + (a % 2)) % 6
										});
									if (spoke_atom == '') {
										break;
									} else {
										if (a % 2 == 1) {
											if (t.controller.notInList({
														list: explode_atoms,
														member: spoke_atom
													}) == false
													&& m.atoms[spoke_atom]
													.controller
													.isAtomExploding() == false
													&& m.atoms[spoke_atom]
													.controller
													.getNucleusLocked()
													== false) {
												explode_atoms.push(spoke_atom);
												m.atoms[spoke_atom].controller
													.startExplosion({
														start_time:
															m.explode_time
															+ (explode_steps
															* delay_step)
															+ atom_delay,
														duration:
															m.explode_duration
													});
												explode_type =
													m.atoms[spoke_atom]
													.controller.getType();
												if (explode_type
														>= m.atom_types.big_bang
														&& explode_type
														<= m.atom_types
														.bang_full) {
													m.specials.push(spoke_atom);
													m.special_times
														.push(atom_delay
														+ (explode_steps
														* delay_step));
													m.special_pos
														.push(spoke_atom);
												}
											}
										}   
									}
								}
							}
						}
					}
					if (radius_remove > 0) {
						// Reset the combo atom to a normal atom
						m.atoms[atom_id].controller.setType({
							type: m.atom_types.atom
						});
						m.atoms[atom_id].controller.setColor({
							color: atom_color
						});
						// Remove # closest atoms of same color
						range_sort = [];
						for (wild_id in m.atoms) {
							if (m.atoms.hasOwnProperty(wild_id)) {
								if (m.atoms[wild_id].controller.getColor() 
										== atom_color || atom_color == -1) {
									if (m.atoms[wild_id].controller
											.isAtomExploding() == false
											&& m.atoms[wild_id].controller
											.getNucleusLocked() == false) {
										x_dif = m.atoms[wild_id].controller
											.getX()
											- m.atoms[atom_id].controller
											.getX();
										y_dif = m.atoms[wild_id].controller
											.getY()
											- m.atoms[atom_id].controller
											.getY();
										atom_distance = Math.sqrt((x_dif
											* x_dif) + (y_dif * y_dif));
										range_sort
											.push(t.controller.numberAsString({
												value: atom_distance
											}) + wild_id);
									}
								}
							}
						}
						// Add source atom to the top of the list
						range_sort.sort();
						range_sort.unshift('0000' + atom_id);
						for (a = 0; a <= radius_remove; a++) {
							if (a < range_sort.length) {
								explode_atom = range_sort[a].substring(4);
								range_type = m.atoms[explode_atom].controller
									.getType();
								if (range_type >= m.atom_types.bang_slash
										&& range_type
										<= m.atom_types.bang_full) {
									m.specials.push(explode_atom);
									m.special_times.push(atom_delay);
								} else { 
									explode_atoms.push(explode_atom);
									m.atoms[explode_atom].controller
										.startExplosion({
											start_time:
												m.explode_time
												+ atom_delay,
											duration:
												m.explode_duration
										});
									if (radius_explode == 1) {
										// Explode one atom around the selected atom
										m.atoms[explode_atom].controller
											.setType({
												type: m.atom_types.bang_small
											});
										m.specials.push(explode_atom);
										m.special_times.push(atom_delay);
									}
									if (radius_line == 1) {
										// Explode a line of atom from the selected atom
										new_type = t.controller.rnd({
											max: 3 
										}) + m.atom_types.bang_slash;
										m.atoms[explode_atom].controller
											.setType({
												type: new_type
											});
										m.specials.push(explode_atom);
										m.special_times.push(atom_delay);
									}
								}
							}
						}
					}
					m.specials[s] = explode_atoms;
				}
			},
			addSpecials: function (com) {
				/*
					Add specials to the game grid after explosions
				*/
				var special_id; // String: The atom id of where the atom is being added
				var special_type; // Number: ENUM value for atom type to add
				var special_color; // Number: ENUM value for atom color to add
				var a; // Number: Increment Var
				var total_specials; // Number: Total number of specials to add
				total_specials = m.new_specials.length;
				for (a = 0; a < total_specials; a = a + 3) {
					special_id = m.new_specials[a];
					special_type = m.new_specials[a + 1];
					special_color = m.new_specials[a + 2];
					m.atoms[special_id].controller.setType({
						type: special_type
					});
					m.atoms[special_id].controller.setColor({
						color: special_color
					});
				}
				m.new_specials = [];
			},
			numberAsString: function(com) {
				/*
					Returns number as 4 digit string
					
					Arguments
					com.value: The number to convert
					
					Returns
					A four character string version of the number
				*/
				var number_string; // String: Number stirng to be returned
				if (Math.floor(com.value) < 0) {
					number_string = String(Math.abs(Math.floor(com.value)));
					while (number_string.length < 3) {
						number_string = '0' + number_string;
					}
					number_string = '-' + number_string;
				} else {
					number_string = String(Math.floor(com.value));
					while (number_string.length < 4) {
						number_string = '0' + number_string;
					}
				}
				return number_string;
			},
			notInList: function (com) {
				/*
					Finds if an element is already in an array
					
					Arguments
					com.list: The array to be checked
					com.member: The element of the array to be searched for
					
					Returns
					A boolean with whether the element is in the array
				*/
				var i; // Number: Increment Var for array
				var array_length; // Number: Length of the array
				var is_in_list; // Boolean: Is the element in the array?
				// Init function values
				array_length = com.list.length;
				is_in_list = false;
				// Check array for member
				for (i = 0; i < array_length; i++) {
					if (com.list[i] == com.member) {
						is_in_list = true;
						break;
					}
				}
				// Return member presence
				return is_in_list;
			},
			gs_explodeWait: function (com) {
				/*
					Wait for explosions to stop
				*/
				var total_matches; // Number: Total matches to stop
				var atom_id; // String: ID of the atom being damaged
				var current_time; // Number: This current time in millisecods
				var explode_ids; // Array: List of atom ids in the explosion
				var explode_size; // Number: Length of explode_ids
				var l; // Number: Increment Var for matches
				var a; // Number: Increment Var for atoms
				current_time = new Date().getTime();
				if (current_time > m.explode_time + m.explode_duration
						+ m.explode_delay) {
					// Clear all explosions from specials
					total_matches = m.specials.length;
					for (l = 0; l < total_matches; l++) {
						m.explode_score = 0;
						explode_ids = m.specials[l];
						explode_size = explode_ids.length;
						// Damage and clear explosion from each matched atom
						for (a = 0; a < explode_size; a++) {
							atom_id = explode_ids[a];
							m.atoms[atom_id].controller.stopExplosion();
							t.controller.damageAtom({
								atom_id: atom_id
							});
						}
						// Add to the game score
						m.score = m.score + m.explode_score;
						// Create Score Pop-Up if is greater than set limit
						if (m.explode_score >= m.score_delimiter) {
							t.controller.createScorePop({
								pos: m.special_pos[l],
								score: m.explode_score
							});
						}
					}
					// Clear all explosions from matches
					total_matches = m.matches.length;
					for (l = 0; l < total_matches; l++) {
						m.explode_score = 0;
						explode_ids = m.matches[l];
						explode_size = explode_ids.length;
						// Damage and clear explosion from each matched atom
						for (a = 0; a < explode_size; a++) {
							atom_id = explode_ids[a];
							m.atoms[atom_id].controller.stopExplosion();
							t.controller.damageAtom({
								atom_id: atom_id
							});
						}
						// Add to the game score
						m.score = m.score + m.explode_score;
						// Create Score Pop-Up if is greater than set limit
						if (m.explode_score >= m.score_delimiter) {
							if (m.result_ids[l] != '') {
								// Reset score pos ID to the result ID
								m.match_pos[l] = m.result_ids[l];
							}
							t.controller.createScorePop({
								pos: m.match_pos[l],
								score: m.explode_score
							});
						}
					}
					// Clear all explosions from neighboring atom break-ups
					total_matches = m.breakups.length;
					for (l = 0; l < total_matches; l++) {
						atom_id = m.breakups[l];
						m.atoms[atom_id].controller.stopExplosion();
						t.controller.damageAtom({
							atom_id: atom_id
						});
					}
					// Add-In Add Specials
					t.controller.addSpecials({});
					// Reduce number of compounds if found
					total_matches = m.compounds_found.length;
					for (l = 0; l < total_matches; l++) {
						t.controller.reduceCompounds({
							found: m.compounds_found[l]
						});
					}
					// Reduce number of rings if found
					for (l = 0; l < m.rings_found; l++) {
						t.controller.decreaseRequirements({
							type: 99,
							color: -1
						});
					}
					// Clear found compounds
					m.compounds_found = [];
					m.rings_found = 0;
					// Update score display and requirements
					BBM({
						com: 'updateSideMenu',
						area: 'score'
					});
					BBM({
						com: 'updateSideMenu',
						area: 'requirements'
					});
					m.game_state = 'fallCheck';
				}
			},
			createScorePop: function (com) {
				/*
					Create score pop-up from atom pos id
					and score
					
					Arguments:
					com.pos: Atom ID where the pop-up is created
					com.score: Score amount to be displayed
				*/
				var x_target; // Number: Target x position for pop-up
				var y_target; // Number: Target y position for pop-up
				// TEMPORARY BUG CORRECTION (See why array is being past) KAL 1/4/2014                
				if (com.pos) {
					if($.isArray(com.pos)) {
						com.pos = com.pos[0];
					}
					try {
						x_target = m.atoms[com.pos].controller.getX()
							+ Math.floor(m.atom_width /2);
						y_target = m.atoms[com.pos].controller.getY()
							+ Math.floor(m.atom_height /2);
						m.score_popups[('p' + m.popup_id)] = new SCORE({
							com: 'init',
							menu_data: m.mm,
							game_data: m,
							score: com.score,
							x: x_target,
							y: y_target
						});
						m.popup_id = m.popup_id + 1;
					} catch (e) {
						console.log('createScorePop failed for: ' + com.pos); 
					}
				}
			},
			damageAtom: function (com) {
				/*
					Damages a given atom hex position
					
					Arguments
					com.atom_id: The id of the damaged atom
				*/
				var atom_type; // Number: ENUM value of the atom type
				var atom_color; // Number: ENUM value of the atom color
				var nucleus_locked; // Boolean: Is atom nucleus locked?
				var radiation; // Number: Radiation level of the atom
				var remain_locked; // Boolean: Should the atom remain locked?
				var start_type; // Number: ENUM value of atom type at start
				var start_color; // Number: ENUM value of atom color at start
				var start_counter; // Number: Move counter of atom at start
				var reduce_radation; // Boolean: Should radiation be reduced?
				// Init function values
				atom_type = m.atoms[com.atom_id].controller.getType();
				start_type = atom_type;
				atom_color = m.atoms[com.atom_id].controller.getColor();
				nucleus_locked = m.atoms[com.atom_id].controller
					.getNucleusLocked();
				start_color = atom_color;
				start_counter = m.atoms[com.atom_id].controller
					.getMoveCounter();
				remain_locked = false;
				reduce_radation = true;
				// Damage atom if it exists
				if (atom_type != m.atom_types.unused
						&& nucleus_locked == false) {
					if (m.atoms[com.atom_id].controller.getShield() == true) {
						// Absorb the hit on the shield
						m.atoms[com.atom_id].controller.setShield({
							has_shield: false 
						});
						if (m.atoms[com.atom_id].controller.hasBonding()
								== false) {
							m.atoms[com.atom_id].controller.setLocked({
								is_locked: false
							});           
						}    
					} else {
						if (m.atom_types.crystal == atom_type) {
							m.crystal_broken = true;   
						}
						switch(atom_type) {
							case m.atom_types.nucleus:
								remain_locked = true;
								break;
							case m.atom_types.antimatter:
								break;
							default:
								if (atom_type > m.atom_types.absorber
										&& atom_type <= m.atom_types
										.absorber_x7) {
									// Increase size of absorber
									atom_type = atom_type - 1;
									remain_locked = true;
									reduce_radation = false;
								} else {
									if (atom_type == m.atom_types.absorber) {
										reduce_radation = false;
									}
									// Remove atom
									atom_type = m.atom_types.empty;
									atom_color = m.atom_colors.void;
								}
						}
						if (m.atoms[com.atom_id].controller.getNucleusLocked()
								== true) {
							remain_locked = true;
						}
						if (remain_locked == false) {
							// Unlock atom so it can fall
							m.atoms[com.atom_id].controller.setLocked({
								is_locked: false
							});
							if (m.atoms[com.atom_id].controller.hasBonding()
									== true) {
								// Clear bonds if present
								t.controller.clearBonds({
									atom_id: com.atom_id
								});
							}
						}
						if (reduce_radation == true) {
							// Reduce radiation in the hex
							radiation = m.atoms[com.atom_id].controller
								.getRadiation();
							if (radiation > 0) {
								radiation = radiation - 1;
								m.atoms[com.atom_id].controller.setRadiation({
									level: radiation
								});
							}
						}
						// Set base atom to new atom
						m.atoms[com.atom_id].controller.setType({
							type: atom_type
						});
						m.atoms[com.atom_id].controller.setColor({
							color: atom_color
						});
						m.atoms[com.atom_id].controller.setMoveCounter({
							moves: -1
						});
						if (atom_type == m.atom_types.empty) {
							// Add timer bonus
							if (start_type == m.atom_types.freeze) {
								if (start_counter == -1) {
									m.level_duration = m.level_duration + 5000;
								} else {
									m.level_duration = m.level_duration
										+ (start_counter * 1000);
								}
							}
							// Decrease Level Requirements
							t.controller.decreaseRequirements({
								type: start_type,
								color: start_color
							});
							// Add to game score
							m.explode_score = m.explode_score
								+ m.atom_scores[start_type];
						}
					}
				}
			},
			clearBonds: function (com) {
				/*
					Remove bonds if not locked for nucleus
					or compound
					
					Arguments
					com.atom_id: Atom that has its bonds removed
				*/
				var d; // Number: Increment Var for hex directions
				var base_id; // String: Atom ID of the current checked atom
				var base_type; // Number: ENUM value of the checked atom type
				var bonds; // String: Bonds of current atom being checked
				var neighbor; // String: Atom ID of bonded neighbor
				var check_atom; // String: Atom ID of atom being checked
				if ( m.atoms[com.atom_id].controller.getNucleusLocked()
						== true) {
					return;
				}
				// Clear bonds in all six hex directions
				for (d = 0; d <6; d++) {
					base_id = com.atom_id;
					bonds = m.atoms[base_id].controller.getBonding();
					neighbor = bonds[d];
					while (neighbor != '') {
						m.atoms[base_id].controller.setBonding({
							direction: d,
							atom_id: '',
							self_okay: false
						});
						m.atoms[neighbor].controller.setBonding({
							direction: m.direction_mirror[d],
							atom_id: '',
							self_okay: false
						});
						if (m.atoms[base_id].controller.hasBonding() == false) {
							if (m.atoms[base_id].controller
									.getNucleusLocked() == false) {
								m.atoms[base_id].controller.setLocked({
									is_locked: false
								});
							}
						}
						if (m.atoms[neighbor].controller.hasBonding() == false) {
							if (m.atoms[neighbor].controller
									.getNucleusLocked() == false) {
								m.atoms[neighbor].controller.setLocked({
									is_locked: false
								});
							}
						}
						base_id = neighbor;
						base_type = m.atoms[base_id].controller.getType();
						neighbor = '';
						if (base_type >= m.atom_types.bond_vert
								&& base_type <= m.atom_types.bond_backslash) {
							m.atoms[base_id].controller.setType({
								type: m.atom_types.empty
							});
							m.atoms[base_id].controller.setColor({
								color: m.atom_colors.void
							});
							bonds = m.atoms[base_id].controller.getBonding();
							neighbor = bonds[d];
							// Remove a bond from requirements
							t.controller.decreaseRequirements({
								type: base_type,
								color: m.atom_colors.void
							});
						}
					}
				}
			},
			decreaseRequirements: function (com) {
				/*
					Check requirements for matching of the
					incoming type and color
					
					Arguments
					com.type: ENUM atom type to be decreased
					com.color: ENUM atom color to be decreased
				*/
				var check_length; // Number: The length of the requirement checks array
				var i; // Number: Increment Var
				var a; // Number: Increment Var
				// Init function values
				check_length = m.requirement_checks.length;
				// Check each requirement to see if it is reduced
				for (i = 0; i < m.total_requirements; i++) {
					if (m.req_amount[i] > 0) {
						// Decrease Bonds
						if (com.type >= m.atom_types.bond_vert
								&& com.type <= m.atom_types.bond_backslash
								&& m.req_shown[i] == 'clear_bonds') {
							m.req_amount[i] = m.req_amount[i] - 1;
						}
						// Decrease Nucleus
						if (com.type == m.atom_types.nucleus
								&& m.req_shown[i] == 'clear_nucleus') {
							m.req_amount[i] = m.req_amount[i] - 1;
						}
						// Decrease Antimatter
						if (com.type == m.atom_types.antimatter &&
								m.req_shown[i] == 'clear_antimatter') {
							m.req_amount[i] = m.req_amount[i] - 1;
						}
						// Radioactive and Crystal calculated on each pass
						// Decrease Atom Colors
						if (com.color != m.atom_colors.void) {
							if (m.req_shown[i] == 'match_'
									+ m.req_match_order[com.color]) {
								m.req_amount[i] = m.req_amount[i] - 1;
							}
						}
						// Check all requirement check for id match and value range
						for (a = 0; a < check_length; a = a + 3) {
							if (m.req_shown[i] == m.requirement_checks[a]) {
								if (com.type >= m.requirement_checks[a + 1]) {
									if (com.type 
											<= m.requirement_checks[a + 2]) {
										m.req_amount[i] = m.req_amount[i] - 1;
										break;
									}
								}
							}
						}
						// Compounds decreased in reduceCompounds from gs_explodeWait
					}
				}
			},
			reduceCompounds: function (com) {
				/*
					Reduce required compound when found
					
					Arguments
					com.found: Compound string that was found
				*/
				var i; // Number: Increment Var
				for (i = 0; i < m.total_requirements; i++) {
					if (m.req_amount[i] > 0) {
						if (com.found == m.req_shown[i]) {
							m.req_amount[i] = m.req_amount[i] - 1;
						}
					}
				}
			},
			gs_checkLegalMoves: function (com) {
				/*
					Check for possible moves before allowing
					user input. Triggers re-shuffle if no
					legal moves are found.
				*/
				// Cycle through to bonus execution if active
				if (m.bonus_timer > -1) {
					m.game_state = 'bonusExecution';
					return
				}
				// Change state to init user input
				m.game_state = 'preTurnUpkeep';
			},
			findHintAtoms: function (com) {
				/*
					Selects atoms to be hinted as a legal move
				*/
				var all_legal_moves; // Object: Contains all atom lists, move atoms, List of all legal moves
				var total_legal_moves; // Number: All legal moves
				var hint_index; // Number: Index of move to be hinted
				var hint_atoms; // Number: Total number of hint atoms
				var found_hint; // Boolean: Was the hint atom on the list?
				var a; // Number: Increment Var for hint atoms
				var neighbor; // String: Atom ID of neighboring atom
				// Find all legal moves
				all_legal_moves = t.controller.checkLegalMoves({});
				total_legal_moves = all_legal_moves.atoms.length;
				// If not matches found then start reshuffle of atoms
				if (total_legal_moves == 0) {
					m.game_state = 'shuffleAtoms';
					return
				}
				// Select a random legal move to hint during userInput state
				hint_index = t.controller.rnd({
					max: total_legal_moves
				});
				m.hint_move.atoms = all_legal_moves.atoms[hint_index];
				m.hint_move.id = all_legal_moves.ids[hint_index];
				m.hint_move.dir = all_legal_moves.dirs[hint_index];
				// Test for if hint atom is in atom list
				found_hint = t.controller.notInList({
					list: m.hint_move.atoms,
					member: m.hint_move.id
				});
				if (found_hint == false) {
					// If hint atom outside list find target atom and switch
					hint_atoms = m.hint_move.atoms.length;
					neighbor = m.atoms[m.hint_move.id].controller
							.getNeighbor({
								direction: m.hint_move.dir
							});
					for (a = 0; a < hint_atoms; a++) {
						if (m.hint_move.atoms[a] == neighbor) {
							m.hint_move.id = neighbor;
							m.hint_move.dir
									= m.direction_mirror[m.hint_move.dir];
							break;
						}
					}
				}  
			},
			checkLegalMoves: function (com) {
				/*
					Check the grid for legal moves and return
					an array of them
					
					Returns
					An array of arrays that contains all legal moves on the grid
				*/
				var atom_id; // String: The id for a given atom
				var atom_type; // Number: ENUM atom type value for a given atom
				var legal_moves; // Array: List of array containing legal moves
				var total_moves; // Number: Legal moves for one atom
				var all_legal_moves; // Object: Contains all atom lists, move atoms, and atom dir
				var slides; // Array: Valid slide atom ids
				var slide_type; // Number: ENUM atom type of slide atom
				var slide_locked; // Boolean: Is the slide locked?
				var i; // Number: Increment Var for adding legal moves
				// Init function values
				all_legal_moves = {};
				all_legal_moves.atoms = [];
				all_legal_moves.ids = [];
				all_legal_moves.dirs = [];
				// Check each atom for legal moves
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						atom_type = m.atoms[atom_id].controller.getType();
						if (atom_type == m.atom_types.big_bang) {
							slides = m.atoms[atom_id].controller.getSlide();
							for (i = 0; i < 6; i++) {
								if (slides[i] != '') {
									if (m.atoms[slides[i]].controller
											.getColor() != m.atom_colors.void
											|| m.atoms[slides[i]].controller
											.getType() == 
											m.atom_types.big_bang) {
										if (m.atoms[slides[i]].controller
												.getLocked() == false) {
											all_legal_moves.atoms
												.push([atom_id]);
											all_legal_moves.ids.push(atom_id);
											all_legal_moves.dirs.push(-1);
										}
									}
								}
							}
						} else {
							if (atom_type >= m.atom_types.bang_slash
									&& atom_type <= m.atom_types.bang_full) {
								slides = m.atoms[atom_id].controller.getSlide();
								for (i = 0; i < 6; i++) {
									if (slides[i] != '') {
										slide_type = m.atoms[slides[i]]
											.controller.getType();
										slide_locked = m.atoms[slides[i]]
											.controller.getLocked();
										if (slide_type >= m.atom_types
												.bang_slash
												&& slide_type <= m.atom_types
												.bang_full
												&& slide_locked == false) {
											all_legal_moves.atoms
												.push([atom_id, slides[i]]);
											all_legal_moves.ids.push(atom_id);
											all_legal_moves.dirs.push(i);
										}
									}
								}
							} else {
								// Normal check for possible moves
								legal_moves = t.controller.checkPossibleMoves({
									atom_id: atom_id
								});
								total_moves = legal_moves.atoms.length;
								for (i = 0; i < total_moves; i++) {
									all_legal_moves.atoms
										.push(legal_moves.atoms[i]);
									all_legal_moves.ids.push(atom_id);
									all_legal_moves.dirs
										.push(legal_moves.dirs[i]);
								}
							}
						}
					}
				}
				return all_legal_moves;
			},
			checkPossibleMoves: function (com) {
				/*
					Check for a match on a given atom and
					returns the type of match it makes
					
					Arguments
					com.atom_id: Atom to be checked
					
					Returns
					An object with an arrays with legal moves and dirs of those moves
				*/
				var slides; // Array: Atom IDs in slidable hex directions
				var neighbor; // String: Atom ID of the slidable atom
				var d; // Number: Increment Var for hex directions
				var i; // Number: Increment Var for matches in a list
				var match_length; // Number: Matches for a given direction
				var legal_moves; // Array: List of arrays with legal moves
				var legal_slide; // Boolean: Is target atom free to slide?
				var source_type; // Number: ENUM atom type value for source atom
				var source_color; // Number: ENUM atom type value for source atom
				var target_type; // Number: ENUM atom type value for target atom
				var target_color; // Number: ENUM atom type value for target atom
				// Init function values
				legal_moves = {};
				legal_moves.atoms = [];
				legal_moves.dirs = [];
				if (com.atom_id != '') {
					if (m.atoms[com.atom_id].controller.getLocked() == false
							&& m.atoms[com.atom_id].controller.getType()
							!= m.atom_types.empty
							&& m.atoms[com.atom_id].controller
							.getNucleusMatched() == false) {
						slides = m.atoms[com.atom_id].controller.getSlide();
						source_type = m.atoms[com.atom_id].controller.getType();
						source_color = m.atoms[com.atom_id].controller
							.getColor();
						// Check matches for a slide to all legal atoms
						for (d = 0; d < 6; d++) {
							neighbor = slides[d];
							legal_slide = false;
							if (neighbor != '') {
								legal_slide = true;
								if (m.atoms[neighbor].controller.getType()
										== m.atom_types.empty) {
									legal_slide = false;
								} else {
									if (m.atoms[neighbor].controller
											.getLocked() == true
											|| m.atoms[neighbor].controller
											.getNucleusMatched() == true) {
										legal_slide = false;
									}  
								}
							}
							if (legal_slide == true) {
								// Record target color and type
								target_type = m.atoms[neighbor].controller
									.getType();
								target_color = m.atoms[neighbor].controller
									.getColor();
								// Temp exchange of colors and types
								m.atoms[neighbor].controller.setType({
									type: source_type
								});
								m.atoms[neighbor].controller.setColor({
									color: source_color
								});
								m.atoms[com.atom_id].controller.setType({
									type: target_type
								});
								m.atoms[com.atom_id].controller.setColor({
									color: target_color
								});
								// Clear matches
								t.controller.clearMatchData();
								// Check for caused matches
								t.controller.checkMatch({
									atom_id: com.atom_id
								});
								match_length = m.match_s.length;
								for (i = 0; i < match_length; i++) {
									legal_moves.atoms.push(t.controller
										.swampAtoms({
											match: m.match_s[i],
											source: com.atom_id,
											target: neighbor
										}));
									legal_moves.dirs.push(d);
								}
								match_length = m.match_v.length;
								for (i = 0; i < match_length; i++) {
									legal_moves.atoms.push(t.controller
										.swampAtoms({
											match: m.match_v[i],
											source: com.atom_id,
											target: neighbor
										}));
									legal_moves.dirs.push(d);
								}
								match_length = m.match_b.length;
								for (i = 0; i < match_length; i++) {
									legal_moves.atoms.push(t.controller
										.swampAtoms({
											match: m.match_b[i],
											source: com.atom_id,
											target: neighbor
										}));
									legal_moves.dirs.push(d);
								}
								// Reset source and target colors and types
								m.atoms[com.atom_id].controller.setType({
									type: source_type
								});
								m.atoms[com.atom_id].controller.setColor({
									color: source_color
								});
								m.atoms[neighbor].controller.setType({
									type: target_type
								});
								m.atoms[neighbor].controller.setColor({
									color: target_color
								});
							}
						}
					}
				}
				// Returns all legal moves and dirs for this atom               
				return legal_moves;
			},
			swampAtoms: function (com) {
				/*
					Swaps atoms inside of an array
					
					Arguments
					com.match: Array of atoms ids
					com.source: Atom id
					com.target: Atom id
				*/
				var i; // Number: Increment Var
				var match_length; // Number: Length of the match array
				var match_array; // Array: The match array to be altered
				match_array = com.match;
				match_length = match_array.length;
				for (i = 0; i < match_length; i++) {
					if (match_array[i] == com.source) {
						match_array[i] = com.target;
					} else {
						if (match_array[i] == com.target) {
							match_array[i] = com.source;
						}
					}
				}
				return match_array;
			},
			gs_shuffleAtoms: function (com) {
				/*
					No possible matches, reshuffle the atoms
				*/
				var atom_id; // String: The id for a given atom
				var atom_type; // Number: ENUM atom type value for a given atom
				var atom_locked; // Boolean: Is the atom locked in place?
				var atom_nucleus; // Boolean: Is the atom nucleus locked?
				var i; // Number: Increment Var for atoms
				// Init function values
				m.fizz_atoms = [];
				// Build array of atoms that can be shuffled
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						atom_type = m.atoms[atom_id].controller.getType();
						atom_locked = m.atoms[atom_id].controller.getLocked();
						atom_nucleus = m.atoms[atom_id].controller
							.getNucleusLocked();
						if (atom_locked == false && atom_nucleus == false) {
							if (atom_type == m.atom_types.atom
									|| (atom_type >= m.atom_types.bang_slash
									&& atom_type <= m.atom_types.bang_full)) {
								m.fizz_atoms.push(atom_id);
							}
						}
					}
				}
				m.fizz_total = m.fizz_atoms.length;
				if (m.fizz_total < 2) {
					// No atoms to switch
					m.game_state = 'noMovesLeft';
					return;
				}
				m.fizz_start = new Date().getTime();
				for (i = 0; i < m.fizz_total; i++) {
					atom_id = m.fizz_atoms[i];
					m.atoms[atom_id].controller.startFizz({
						start_time: m.fizz_start,
						duration: m.fizz_form,
						state: 'form'
					});
				}
				m.shuffle_count = 0;
				m.game_state = 'fizzWait';
			},
			gs_fizzWait: function (com) {
				/*
					Wait for the forming of the fizz on the
					atoms and then start the full fizz of 
					the atoms
				*/
				var time_now; // Number: The current time in milliseconds
				var i; // Number: Increment Var for shuffle moves
				var atom_id; // String: Current atom being checked
				time_now = new Date().getTime();
				if (time_now > m.fizz_start + m.fizz_form) {
					m.fizz_start = new Date().getTime();
					for (i = 0; i < m.fizz_total; i++) {
						atom_id = m.fizz_atoms[i];
						m.atoms[atom_id].controller.startFizz({
							start_time: m.fizz_start,
							duration: m.fizz_duration,
							state: 'cover'
						});
					}
					m.game_state = 'fizzShuffle';
				}
			},
			gs_fizzShuffle: function (com) {
				/*
					Wait for the forming of the fizz on the
					atoms and then start the full fizz of 
					the atoms
				*/
				var atom_id; // String: Current atom being checked
				var atom_index1; // Number: Index into the m.fizz_atoms array
				var hold_type1; // Number: ENUM atom color value to be switched
				var hold_color1; // Number: ENUM atom color value to be switched
				var atom_index2; // Number: Index into the m.fizz_atoms array
				var hold_type2; // Number: ENUM atom color value to be switched
				var hold_color2; // Number: ENUM atom color value to be switched
				var shuffle_moves; // Number: Number of random moves in a shuffle
				var all_legal_moves; // Object: Contains atom lists, move atoms, and move dirs
				var i; // Number: Increment Var for shuffle moves
				var time_now; // Number: The current time in milliseconds
				time_now = new Date().getTime();
				if (time_now > m.fizz_start + (m.fizz_duration/2)) {
					shuffle_moves = Math.floor(m.shuffle_ratio * m.fizz_total);
					for (i = 0; i < shuffle_moves; i++) {
						atom_index1 = t.controller.rnd({
							max: m.fizz_total
						});
						atom_index2 = t.controller.rnd({
							max: m.fizz_total
						});
						if (atom_index1 != atom_index2) {
							hold_color1 = m.atoms[m.fizz_atoms[atom_index1]]
								.controller.getColor();
							hold_type1 = m.atoms[m.fizz_atoms[atom_index1]]
								.controller.getType();
							hold_color2 = m.atoms[m.fizz_atoms[atom_index2]]
								.controller.getColor();
							hold_type2 = m.atoms[m.fizz_atoms[atom_index2]]
								.controller.getType();
							m.atoms[m.fizz_atoms[atom_index1]].controller
								.setColor({
									color: hold_color2
								});
							m.atoms[m.fizz_atoms[atom_index1]].controller
								.setType({
									type: hold_type2
								});
							m.atoms[m.fizz_atoms[atom_index2]].controller
								.setColor({
									color: hold_color1
								});
							m.atoms[m.fizz_atoms[atom_index2]].controller
								.setType({
									type: hold_type1
								});
						}
					}
					// Check each atom for matches
					t.controller.clearMatchData({});
					for (atom_id in m.atoms) {
						if (m.atoms.hasOwnProperty(atom_id)) {
							// Check for match on this 
							t.controller.checkMatch({
								atom_id: atom_id
							});
						}
					}
					// Check for legal moves
					all_legal_moves = t.controller.checkLegalMoves({});
					// Stop loop if it didn't cause a match
					if (m.match_s.length + m.match_v.length + m.match_b.length
							> 0
							|| all_legal_moves.atoms.length > 0) {
						// Legal shuffle, continue fizz process
						m.game_state = 'fizzPostShuffle';
					} else {
						// Illegal shuffle, inc counter and prepare to try again
						m.shuffle_count = m.shuffle_count + 1;
						if (m.shuffle_count > m.shuffle_max) {
							m.fizz_start = new Date().getTime();
							for (i = 0; i < m.fizz_total; i++) {
								atom_id = m.fizz_atoms[i];
								m.atoms[atom_id].controller.startFizz({
									start_time: m.fizz_start,
									duration: m.fizz_clear,
									state: 'clear'
								});
							}
							m.game_state = 'noMoveFizz';
						}
					}
				}
			},
			gs_fizzPostShuffle: function (com) {
				/*
					Grid has been reshuffled, wait for end
					of fizz cycle
				*/
				var time_now; // Number: The current time in milliseconds
				var i; // Number: Increment Var for shuffle moves
				var atom_id; // String: Current atom being checked
				time_now = new Date().getTime();
				if (time_now > m.fizz_start + m.fizz_duration) {
					m.fizz_start = new Date().getTime();
					for (i = 0; i < m.fizz_total; i++) {
						atom_id = m.fizz_atoms[i];
						m.atoms[atom_id].controller.startFizz({
							start_time: m.fizz_start,
							duration: m.fizz_clear,
							state: 'clear'
						});
					}
					m.game_state = 'fizzClearing';
				}
			},
			gs_fizzClearing: function (com) {
				/*
					Wait for the clearing of the fizz and
					then start match checking cycle again
				*/
				var time_now; // Number: The current time in milliseconds
				var i; // Number: Increment Var for shuffle moves
				var atom_id; // String: Current atom being checked
				time_now = new Date().getTime();
				if (time_now > m.fizz_start + m.fizz_clear) {
					for (i = 0; i < m.fizz_total; i++) {
						atom_id = m.fizz_atoms[i];
						m.atoms[atom_id].controller.startFizz({
							start_time: -1,
							duration: -1,
							state: 'none'
						});
					}
					m.game_state = 'fallMatches';
				}
			},
			gs_noMoveFizz: function (com) {
				/*
					Wait for fizz to clear before executing
					the no moves left message
				*/
				var time_now; // Number: The current time in milliseconds
				var i; // Number: Increment Var for shuffle moves
				var atom_id; // String: Current atom being checked
				time_now = new Date().getTime();
				if (time_now > m.fizz_start + m.fizz_clear) {
					for (i = 0; i < m.fizz_total; i++) {
						atom_id = m.fizz_atoms[i];
						m.atoms[atom_id].controller.startFizz({
							start_time: -1,
							duration: -1,
							state: 'none'
						});
					}
					m.game_state = 'noMovesLeft';
				}
			},
			gs_preTurnUpkeep: function (com) {
				/*
					Operate crystal spread and decrease atom
					move counters before the players turn
				*/
				var atom_id; // String: Atom ID of the currently checked atom
				var atom_type; // Number: ENUM atom type value
				var atom_slide; // Array: List of atom ids that can be exchanged
				var atom_nucleus; // Boolean: Is the atom nucleus locked?
				var atom_bonds; // Boolean: Does the checked atom have bonding?
				var a; // Number: Increment var for atom id array
				var d; // Number: Increment var for hex directions
				var counters; // Array: List of atom with counters on screen
				var counter_moves; // Number: Moves left on the move counter
				var total_counters; // Number: Total number of counter atoms
				var crystals; // Array: List of crystals on screen
				var total_crystals; // Number: Total number of crystals on grid
				var legal_crystals; // Array: List of all legal spread atom ids
				var total_legals; // Number: Total number of lebal spreads
				var total_implodes; // Number: Total number of imploding atoms
				var radiation; // Number: Radiation Level on current hex
				var neighbor; // String: Atom ID of a neighboring hex
				var level_complete; // Boolean: Has the level been completed?
				// Check for completion of level
				level_complete = false;
				if (m.total_requirements > 0) {
					level_complete = true;
					for (a = 0; a < m.total_requirements; a++) {
						if (m.req_amount[a] > 0 || m.req_amount[a] == -1) {
							level_complete = false;
							break;
						}
					}
				}
				if (level_complete == true) {
				    if (m.is_time_limited == false) {
					    m.completed_moves = m.moves;
					} else {
					    m.completed_time = m.level_duration - (new Date().getTime() - m.start_time);
					    if (m.completed_time < 0) {
					        m.completed_time = 0;
					    }
					}
					m.game_state = 'levelComplete';
					return;
				}
				m.imploding_atoms = [];
				if (m.skip_counters == false) {
					// Advance atom movement counters and execute depention actions
					counters = [];
					for (atom_id in m.atoms) {
						if (m.atoms.hasOwnProperty(atom_id)) {
							counter_moves = m.atoms[atom_id].controller
								.getMoveCounter();
							atom_type = m.atoms[atom_id].controller.getType();
							if (counter_moves > 0) {
								counter_moves = counter_moves - 1;
								m.atoms[atom_id].controller.setMoveCounter({
									moves: counter_moves
								});
								if (counter_moves == 0) {
									// Counter expired, execute action
									switch (atom_type) {
										case m.atom_types.radioactive:
											// Increase Radiation in neighboring hexes
											radiation = m.atoms[atom_id]
												.controller.getRadiation();
											radiation = radiation + 1;
											if (radiation > 2) {
												radiation = 2;   
											}
											m.atoms[atom_id].controller
												.setRadiation({
													level: radiation
												});
											m.atoms[atom_id].controller
												.setType({
													type: m.atom_types.atom 
												});
											m.atoms[atom_id].controller
												.setMoveCounter({
													moves: -1
												});
											// Add radiation to neighboring atoms
											for (d = 0; d < 6; d++) {
												neighbor = m.atoms[atom_id]
													.controller.getNeighbor({
														direction: d
													});
												if (neighbor != '') {
													if (m.atoms[neighbor]
															.controller
															.getType() !=
															m.atom_types.unused) {
														radiation = m.atoms
															[neighbor]
															.controller
															.getRadiation();
														radiation = radiation
															+ 1;
														if (radiation > 2) {
															radiation = 2;   
														}
														m.atoms[neighbor]
															.controller
															.setRadiation({
																level: radiation
															});
													}
												}
											}
											break;
										case m.atom_types.blackhole:
											// End level due to blackhole
											m.imploding_atoms.push(atom_id);
											break;
										case m.atom_types.void:
											// Increase voids in neighboring hexes
											m.atoms[atom_id].controller
												.setMoveCounter({
													moves: -1
												});
											for (d = 0; d < 6; d++) {
												neighbor = m.atoms[atom_id]
													.controller.getNeighbor({
														direction: d
													});
												if (neighbor != '') {
													if (m.atoms[neighbor]
															.controller
															.getLocked() == false) {
														switch (m.atoms
																[neighbor]
																.controller
																.getType()) {
															case m.atom_types
																	.atom:
															case m.atom_types
																	.radioactive:
															case m.atom_types
																	.blackhole:
															case m.atom_types
																	.big_bang:
															case m.atom_types
																	.bang_slash:
															case m.atom_types
																	.bang_vert:
															case m.atom_types
																	.bang_backslash:
															case m.atom_types
																	.bang_full:                                               
																m.atoms[neighbor]
																	.controller
																	.setType({
																		type:
																			m.atom_types
																			.void 
																	});
																m.atoms[neighbor]
																	.controller
																	.setColor({
																		color:
																			m.atom_colors
																			.void 
																	});
																m.atoms[neighbor]
																	.controller
																	.setMoveCounter({
																		moves: -1 
																	});
																break;
														}
													}
												}
											}
											break;
										default:
											// Remove atom from the grid
											m.atoms[atom_id].controller
												.setType({
													type: m.atom_types.void
												});
											m.atoms[atom_id].controller
												.setColor({
													color: m.atom_colors.void 
												});
											m.atoms[atom_id].controller
												.setMoveCounter({
													moves: -1 
												});
											break;
									}
								}
							}
						}
					}
					// Check for spread of crystal
					if (m.crystal_broken == false) {
						// Init values for crystal check
						crystals = [];
						legal_crystals = [];
						// Search all atoms for crystal type and push to array
						for (atom_id in m.atoms) {
							if (m.atoms.hasOwnProperty(atom_id)) {
								atom_type = m.atoms[atom_id].controller
									.getType();
								if (atom_type == m.atom_types.crystal) {
									crystals.push(atom_id);
								}
							}
						}
						total_crystals = crystals.length;
						// Check each crystal atom for legal spread directions
						for (a = 0; a < total_crystals; a++) {
							atom_slide = m.atoms[crystals[a]].controller
								.getSlide();
							for (d = 0; d < 6; d++) {
								atom_id = atom_slide[d];
								if (atom_id != '') {
									atom_type = m.atoms[atom_id].controller
										.getType();
									atom_nucleus = m.atoms[atom_id].controller
										.getNucleusLocked();
									atom_bonds = m.atoms[atom_id].controller
										.hasBonding();
									if (atom_nucleus == false
											&& atom_bonds == false) {
										switch (atom_type) {
											case m.atom_types.atom:
											case m.atom_types.radioactive:
											case m.atom_types.blackhole:
											case m.atom_types.void:
											case m.atom_types.bang_slash:
											case m.atom_types.bang_vert:
											case m.atom_types.bang_backslash:
											case m.atom_types.bang_full:
												legal_crystals.push(atom_id);
												break;
										}
									}
								}
							}
						}
						total_legals = legal_crystals.length;
						// If there is a legal spread start it
						if (total_legals > 0) {
							m.crystal_id = legal_crystals[t.controller.rnd({
								max: total_legals
							})];
							m.crystal_start = new Date().getTime();
							m.atoms[m.crystal_id].controller.setCrystalSpread({
								start_time: m.crystal_start,
								duration: m.crystal_delay
							});
							m.game_state = 'crystalWait';
						}
					}
				} else {
					// Reset skip counters flag
					m.skip_counters = false;  
				}
				total_implodes = m.imploding_atoms.length;
				if (total_implodes > 0) {
					for (a = 0; a < total_implodes; a++) {
						if (m.atoms[m.imploding_atoms[a]].controller
								.getType() != m.atom_types.blackhole) {
							m.imploding_atoms.splice(a, 1);
							total_implodes = total_implodes - 1;
							a = a - 1;
						}
					}
					total_implodes = m.imploding_atoms.length;
					if (total_implodes > 0) {
						m.game_state = 'implodeGrid';
						return;
					}
				}
				if (m.game_state == 'crystalWait') {
					// Return before finding hint
					return;   
				}
				// Find the move to hint
				t.controller.findHintAtoms({});
				// If reshuffle wasn't called for subtract move
				if (m.game_state != 'shuffleAtoms') {
					m.game_state = 'subtractMove';
				} else {
					// Set counter decrease to be skipped
					m.skip_counters = true;   
				}
			},
			gs_crystalWait: function (com) {
				/*
					Wait for crystal to finish spreading
				*/
				var time_now; // Number: Current time in milliseconds
				// Init function values
				time_now = new Date().getTime();
				// Check to see if crystal spread time has expired
				if (time_now > m.crystal_start + m.crystal_delay) {
					// Change atom to crystal
					m.atoms[m.crystal_id].controller.setType({
						type: m.atom_types.crystal
					});
					m.atoms[m.crystal_id].controller.setColor({
						color: m.atom_colors.void
					});
					m.atoms[m.crystal_id].controller.setShield({
						is_shielded: false
					});
					m.atoms[m.crystal_id].controller.setMoveCounter({
						moves: -1
					});
					m.atoms[m.crystal_id].controller.setLocked({
						is_locked: true
					});
					// Stop spread animation
					m.atoms[m.crystal_id].controller.stopCrystalSpread();
					// Find the move to hint
					t.controller.findHintAtoms({});
					// If reshuffle wasn't called for subtract move
					if (m.game_state != 'shuffleAtoms') {
						m.game_state = 'subtractMove';
					} else {
						// Set counter decrease to be skipped
						m.skip_counters = true;   
					}
				}
			},
			gs_subtractMove: function (com) {
				/*
					Subtract a move from the total and update
					energy criteria
				*/
				// Update Requirements
				BBM({
					com: 'updateSideMenu',
					area: 'requirements'
				});
				// Reduce moves if level isn't timed
				if (m.is_time_limited == false) {
					if (m.skip_lost_turn) {
						m.skip_lost_turn = false;
					} else {
						m.moves = m.moves - 1;
					}
					// Update Remaining Moves
					BBM({
						com: 'updateSideMenu',
						area: 'moves'
					});
					// If no moves left either fail or complete based on existing requirements
					if (m.moves == 0) {
						if (m.total_requirements == 0) {
							m.game_state = 'levelComplete';
						} else {
							m.game_state = 'noMoves';
						}
						return;
					}
				}
				// Change state to init the user input
				m.game_state = 'userInput';
			},
			gs_userInput: function (com) {
				/*
					Init for user move
				*/
				// Set crystal broken this turn to false 
				m.crystal_broken = false;
				// Record starting time of turn
				m.turn_start_time = new Date().getTime();
				// Turn off move hinting
				m.hint_shown = false;
				// Change state to wait for user input as a move
				m.game_state = 'inputWait';
			},
			gs_inputWait: function (com) {
				/*
					Waits for user move and starts move
					hinting at the proper time and checks
					for the level being out of time
				*/
				var a; // Number: Increment Var
				var level_complete; // Boolean: Is the level requirements complete?
				var valid_popup; // Boolean: Was the popup properly launched
				var temp_time; // Number: Amount of time until end of level
				// Check to see if level time has elapsed
				if (m.is_time_limited == true) {
						if (m.start_time > -1) {
							temp_time = m.level_duration;
							temp_time = temp_time - (new Date().getTime() - m.start_time);
							if (temp_time < 0) {
								t.controller.operateHint({
									hint_state: false
								});
								m.cursor_id = '';
								m.hex_down = '';
								// Check if all requirements are met
								level_complete = true;
								if (m.total_requirements > 0) {
									for (a = 0; a < m.total_requirements; a++) {
										if (m.req_amount[a] > 0
												 || m.req_amount[a] == -1) {
											level_complete = false;
											break;
										}
									}
								}
								// Open failed criteria menu if not met
								if (level_complete == false) {
									valid_popup = BBM({
										com: 'openMenu',
										menu_id: 'fail_criteria'
									});
									if (valid_popup == true) {
										m.game_state = 'failWait';
									} else {
										// KAL add code to fail to the main menu
										console.log('*** Need to fail to the main menu ***');
									}
									return;
								}
								// Start Bonus Animation
								m.game_state = 'levelComplete';
								return;
							}
						}   
				}
				// Start move hinting if time has elapsed
				if (m.hint_shown == false) {
					if (new Date().getTime() >  m.turn_start_time
							+ m.hint_delay) {
						t.controller.operateHint({
							hint_state: true
						});
					}
				}
			},
			operateHint: function (com) {
				/*
					Turns hint on or off
					
					Arguments
					com.hint_state: A boolean for whether to show hint or not
				*/
				var hint_atoms; // Number: Atoms to hint
				var a; // Number: Increment Var for hinted atoms
				if (com.hint_state == true) {
					if (m.hint_shown == false) {
						m.hint_shown = true;
						hint_atoms = m.hint_move.atoms.length;
						for (a = 0; a < hint_atoms; a++) {
							m.atoms[m.hint_move.atoms[a]].controller
								.setAtomHinting({
									is_hinted: true
								});
						}
						if (m.hint_move.id != '' && m.hint_move.dir > -1) {
							m.atoms[m.hint_move.id].controller
								.setHintArrow({
									direction: m.hint_move.dir
								});
						}
					}
				} else {
					m.hint_shown = false;
					hint_atoms = m.hint_move.atoms.length;
					for (a = 0; a < hint_atoms; a++) {
						m.atoms[m.hint_move.atoms[a]].controller
							.setAtomHinting({
								is_hinted: false
							});
					}
					if (m.hint_move.id != '' && m.hint_move.dir > -1) {
						m.atoms[m.hint_move.id].controller
							.setHintArrow({
								direction: -1
							});
					}
				} 
			},
			handleMouseEvent: function (com) {
				/*
					Execute mouse events on the game grid
					
					Arguments
					com.evt: The mouse event
					com.evt_type: The type of mouse event
					com.xy: Object holding x and y position
				*/
				var hex_up; // String: Atom id at the point of the mouse up
				var x_delta; // Number: Change in x axis from mouse down to up
				var y_delta; // Number: Change in x axis from mouse down to up
				var mouse_direction; // Number: The hex direction that the mouse was moved
				var mouse_angle; // Number: Angle of mouse delta between down and up events
				var mouse_distance; // Number: Distance that the mouse was moved
				var i; // Number: Increment Var
				// Get Mouse Position on work area
				m.mouse_xy = com.xy;
				if (com.evt_type == 'down') {
					// Operate tools for mouse down
					t.controller.insideTool({
						evt_type: 'down',
						xy: m.mouse_xy
					});
					if (m.game_state == 'inputWait') {
						// Read the hex mouse downed on for atom switching
						m.hex_down = t.controller.getAtom({
							x: m.mouse_xy.x,
							y: m.mouse_xy.y
						});
						if (m.tool_carried == -1) {
    						if (m.hex_down != '') {
    							if (m.atoms[m.hex_down].controller.getLocked() == true
    									|| m.atoms[m.hex_down].controller.getNucleusMatched() == true) {
    								m.hex_down = '';
    							} else {
    								// Record starting mouse position
    								m.down_x_start = m.mouse_xy.x;
    								m.down_y_start = m.mouse_xy.y;
    								// Set mouse down cursor
    								m.cursor_id = m.hex_down;
    							}
    						}
    					} else {
    					       
    					}
					}
				}
				if (com.evt_type == 'move') {
					// Operate tools for mouse down
					t.controller.insideTool({
						evt_type: 'move',
						xy: m.mouse_xy
					});
				}
				if (com.evt_type == 'up') {
					// Operate tools for mouse down
					t.controller.insideTool({
						evt_type: 'up',
						xy: m.mouse_xy
					});
					// Handle in grid mouse up
					m.cursor_id = '';
					if (m.game_state == 'inputWait' && m.hex_down != '') {
						// Calculate the distance the mouse was moved
						x_delta = m.mouse_xy.x - m.down_x_start;
						y_delta = m.mouse_xy.y - m.down_y_start;
						mouse_distance = Math.sqrt((x_delta * x_delta) + (y_delta * y_delta));
						// If distance is greater than 3 calculate mouse angle
						if (mouse_distance > 3) {
							mouse_angle = t.controller.getAngle({
								x1: m.down_x_start,
								y1: m.down_y_start,
								x2: m.mouse_xy.x,
								y2: m.mouse_xy.y
							});
							// Select hex direction based on mouse angle
							mouse_direction = 5 - Math.floor((mouse_angle + 180)
								/ 60);
							mouse_direction = (mouse_direction + 6) % 6;
							// Get slide neighbor of 
							hex_up = (m.atoms[m.hex_down].controller.getSlide())
								[mouse_direction];
							// Execute switch atoms
							if (hex_up != '' && m.hex_down != ''
									&& hex_up != m.hex_down) {
								t.controller.startSwitch({
									first_atom: hex_up,
									second_atom: m.hex_down
								});
							}
						}
					}
					// Reset atom switch mouse down
					m.hex_down = '';
				}
			},
			insideTool: function (com) {
				/*
					Operates tool if mouse event is inside it
					
					Arguments:
					com.evt_type: The type of mouse event
					com.xy: An object containing the mouse x and y
				*/
				var valid_popup; // Boolean: Is the launch pop-up valid?
				var tool_inside; // Number: Which tool is the mouse inside
				var i;
				var x_pos;
				var y_pos;
				var time_now = Date.now();
				var atom_id;
				var valid_tool = false;
				var counter_value = 0;
				// Default tool found to -1 (no match)
				tool_inside = -1;
				for (i = 0; i < 8; i++) {
					if (m.mm.atomic_tools[i] > -1) {
						y_pos = 501 + ((i % 4) * 32);
						x_pos = 20 + ((i > 3) * 68);
						if (t.controller.insideRect({
							left: x_pos,
							top: y_pos,
							right: x_pos + 67,
							bottom: y_pos + 31,
							x_pos: com.xy.x,
							y_pos: com.xy.y
						})) {
							tool_inside = i;
						}
					}
				}
				m.tool_inside = tool_inside;
				if (com.evt_type == "down" && time_now > m.tool_delayed && m.game_state == 'inputWait') {
				    m.tool_downed = tool_inside;   
				}
				if (com.evt_type == "up") {
				    if (tool_inside > -1) {
				        if (m.tool_downed == tool_inside) {
				            if (m.tool_carried == m.tool_downed) {
    				            m.tool_carried = -1;   
    				        } else {
    				            m.tool_carried = m.tool_downed;
    				        }
				        } 
				    }
				    m.tool_downed = -1;
				    // end if turning off a tool
				    if (m.tool_carried == -1) {
				    	return;	
				    }
				    // Go to the store if out of the tool
				    if (m.mm.atomic_tools[m.tool_carried] == 0) {
				    	valid_popup = BBM({
							com: 'openMenu',
                        	menu_id: 'store',
                        	blocker: true,
                        	x: Math.floor(m.mm.width / 2)
                    	});
						if (valid_popup == true) {
							// Freeze game timers
	                        t.controller.freezeGame({
	                            freeze: true
	                        });
						}
						m.tool_carried = -1;
						m.tool_delayed = time_now + 2000;
						return;
				    }
				    // end if not an immediate tool
				    if (m.tool_carried != 1 && m.tool_carried != 4 && m.tool_carried != 5) {
				    	return;	
				    }
				    // Operate Reshuffle Tool
				    if (m.tool_carried == 1) {
				    	// Skip turn loss
				    	m.skip_lost_turn = true;
				    	// turn-off hinting
				    	t.controller.operateHint({
							hint_state: false
						});
				    	// Shuffle atoms
				    	m.game_state = 'shuffleAtoms';
				    }
				    // Operate +5 moves/+5% time tool 
				    if (m.tool_carried == 4) {
				    	if (m.is_time_limited == false) {
					    	m.moves = m.moves + 5;
					    } else {
					    	if (m.duration_bonus == 0) {
					    		m.duration_bonus = Math.floor(m.level_duration * .05);
					    	}
					    	m.level_duration = m.level_duration + m.duration_bonus;
					    }
				    }
				    // Operate counter +5 tool
				    if (m.tool_carried == 5) {
				        // Check each atom in order to boost move counter
				        for (atom_id in m.atoms) {
				            if (m.atoms.hasOwnProperty(atom_id)) {
				                counter_value = m.atoms[atom_id].controller.getMoveCounter({});
				                if (counter_value > 0) {
				                    valid_tool = true;
				                    m.atoms[atom_id].controller.setMoveCounter({
				                        moves: counter_value + 5
				                    });
				                }   
				            }
				        }
				        // Exit without spending a tool if no timers were updated
				        if (valid_tool == false) {
				            // Remove tool cursor
				            m.tool_carried = -1;
				            return;
				        }
				    }
				    // Remove a tool
				    m.mm.atomic_tools[m.tool_carried] = m.mm.atomic_tools[m.tool_carried] - 1;
				    // Set delay for next tool section to 2 seconds
				    m.tool_delayed = time_now + 2000;
				    // Remove tool cursor
				    m.tool_carried = -1;
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
			getAngle: function (com) {
				/*
					Returns the angle between the line defined
					by these two points and the horizontal axis
					
					Arguments
					com.x1 = The x position of the first point
					com.y1 = The y position of the first point
					com.x2 = The x position of the second point
					com.y2 = The y position of the second point
					
					Returns
					The angle between the line defined
					by these two points and the horizontal axis
				*/
				var angle; // Number: Resultant angle
				angle = Math.atan2(com.y2 - com.y1, com.x2 - com.x1)
					* 180 / Math.PI;
				return angle;
			},
			getAtom: function (com) {
				/*
					Find the atom that the cursor is currently over
					
					Arguments
					com.x: The screen x position
					com.y: The screen y position
					
					Return
					The id of the atom that the cursor is over.
					Returns "" is not over an atom.
				*/
				var atom_over; // String: The id of the atom that the cursor is over.
				var atom_id; // String: The id of the atom in the atoms object
				atom_over = "";
				// Check each atom
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						if (m.atoms[atom_id].controller.insideHex({
								x: com.x,
								y: com.y})) {
							atom_over = atom_id;
							break;
						} 
					}    
				}
				return atom_over;
			},
			startSwitch: function (com) {
				/*
					Start atom exchange if two legal atoms
					are selected
					
					Arguments
					com.first_atom: The first atom selected
					com.second_atom: The first atom selected
				*/
				var fog_atom; // String: Atom id of fogged atom
				var slides; // Array: The legal slides from the first atom
				var d; // Number: Increment Var for hex directions
				var bd; // Number: Increment Var for hex bond directions
				var legal_slide; // Boolean: Is the slide legal?
				var hint_atoms; // Number: Total number of atoms being hinted
				var a; // Number: Increment Var for atoms
				var bonds; // Array: Bonds for the target atom
				var i;
				var total_notes;
				// Safety check on input vars
				if (com.first_atom == '' || com.second_atom == '') {
					return;
				}
				// Check to see if the movement is legal
				legal_slide = false;
				m.exchange_dir = -1;
				slides = m.atoms[com.first_atom].controller.getSlide();
				for (d = 0; d < 6; d++) {
					if (slides[d] == com.second_atom) {
						if (m.atoms[com.first_atom].controller.getLocked()
								== false
								&& m.atoms[com.first_atom].controller
								.getNucleusMatched() == false) {
							if (m.atoms[com.first_atom].controller.getType()
									!= m.atom_types.empty) {
								legal_slide = true;
								m.exchange_dir = d;
								break;
							}
						} else {
							if (m.atoms[com.first_atom].controller
									.getNucleusLocked() == true 
									&& m.atoms[com.second_atom].controller
									.getNucleusLocked() == false
									&& m.atoms[com.second_atom].controller
									.getNucleusMatched() == false) {
								if (m.atoms[com.first_atom].controller
										.getType() == m.atom_types.void) {
									bonds = m.atoms[com.first_atom].controller
										.getBonding();
									for (bd = 0; bd < 6; bd++) {
										if (bonds[bd] != '') {
											if (m.atoms[bonds[bd]].controller
													.getColor()
													== m.atoms[com.second_atom]
													.controller.getColor()) {
												legal_slide = true;
												m.exchange_dir = d;
												break;
											}
										}
									}
									if (legal_slide == true) {
										break;
									}
								}
							}
						}
					}
				}
				if (legal_slide == false) {
					return;   
				}
				// Remove atom hinting
				t.controller.operateHint({
					hint_state: false
				});
				// Exchange the atoms
				t.controller.exchangeAtoms({
					first_atom: com.first_atom,
					second_atom: com.second_atom
				});
				// Adjust hinting after first turn
				if (m.first_move == true) {
					// Clear all fog
					m.first_move = false;
					for (fog_atom in m.atoms) {
						if (m.atoms.hasOwnProperty(atom_id)) {
							m.atoms[fog_atom].controller.setFogged({
								fog: false
							});
						}
					}
					// Remove all notes
					total_notes = m.notes.length;
					for (i = 0; i < total_notes; i++) {
						m.notes[i].controller.closeNote({});	
					}
				}
				// Set game state to wait for switch animation to complete
				m.game_state = 'switchWait';
			},
			exchangeAtoms: function (com) {
				/*
					Exchanges two atoms with movement
					
					Arguments
					com.first_atom: First atom to be exchanged
					com.second_atom: Second atom to be exchanged
				*/                var color1; // Number: Hold ENUM color value for atom 1
				var color2; // Number: Hold ENUM color value for atom 2
				var type1; // Number: Hold ENUM type value for atom 1
				var type2; // Number: Hold ENUM type value for atom 2
				var counter1; // Number: Move Counter for atom 1
				var counter2; // Number: Move Counter for atom 2
				// Record current values
				color1 = m.atoms[com.first_atom].controller.getColor();
				color2 = m.atoms[com.second_atom].controller.getColor();
				type1 = m.atoms[com.first_atom].controller.getType();
				type2 = m.atoms[com.second_atom].controller.getType();
				counter1 = m.atoms[com.first_atom].controller.getMoveCounter();
				counter2 = m.atoms[com.second_atom].controller.getMoveCounter();
				// Exchange values
				m.atoms[com.first_atom].controller.setColor({
					color: color2
				});
				m.atoms[com.second_atom].controller.setColor({
					color: color1
				});
				m.atoms[com.first_atom].controller.setType({
					type: type2
				});
				m.atoms[com.second_atom].controller.setType({
					type: type1
				});
				m.atoms[com.first_atom].controller.setMoveCounter({
					moves: counter2
				});
				m.atoms[com.second_atom].controller.setMoveCounter({
					moves: counter1
				});
				// Start Atom Movement                
				m.atoms[com.first_atom].controller.startMove({
					x_start: m.atoms[com.second_atom].controller.getX(),
					y_start: m.atoms[com.second_atom].controller.getY(),
					is_teleporting: false
				});
				m.atoms[com.second_atom].controller.startMove({
					x_start: m.atoms[com.first_atom].controller.getX(),
					y_start: m.atoms[com.first_atom].controller.getY(),
					is_teleporting: false
				});
				m.exchange_atoms = [com.first_atom, com.second_atom];
				m.exchange_start = new Date().getTime();
				m.atoms[com.first_atom].controller.startMoveTime({
					start_time: m.exchange_start,
					travel_time: m.exchange_time
				});
				m.atoms[com.second_atom].controller.startMoveTime({
					start_time: m.exchange_start,
					travel_time: m.exchange_time
				});
			},
			gs_switchWait: function (com) {
				/*
					Wait for the user started switch to complete
					and check for either combo or legal match
				*/
				var time_now; // Number: The current time in milliseconds
				var i; // Number: Increment Var for shuffle moves
				var atom_id; // String: Current atom being checked
				var first_atom; // String: ID of the first exchange atom
				var second_atom; // String: ID of the second exchange atom
				var has_combo; // Boolean: Was a combo made?
				// Check if exchange animation time has elapsed
				time_now = new Date().getTime();
				if (time_now > m.exchange_start + m.exchange_time) {
					// Init function values
					first_atom = m.exchange_atoms[0];
					second_atom = m.exchange_atoms[1];
					// Check each atom for basic matches
					t.controller.clearMatchData({});
					for (atom_id in m.atoms) {
						if (m.atoms.hasOwnProperty(atom_id)) {
							// Check for match on this 
							t.controller.checkMatch({
								atom_id: atom_id
							});
						}
					}
					// Check for combos
					has_combo = t.controller.checkCombo({
						first_atom: first_atom,
						second_atom: second_atom
					});
					// Check if legal combo is made
					if (has_combo == true) {
						m.explode_time = new Date().getTime();
						m.game_state = 'explodeWait';
						return;
					}
					// Check grid for matches if match found
					if (m.match_s.length + m.match_v.length + m.match_b.length
							> 0) {      
						m.compounds_found = [];
						m.rings_found = 0;
						// Legal move, progress to executing matches
						m.game_state = 'fallMatches';
						return;
					}
					// Move was illegal, reset the exchange
					t.controller.exchangeAtoms({
						first_atom: first_atom,
						second_atom: second_atom
					});
					// Reset exchange ids and dir
					m.exchange_atoms = ['', ''];
					m.exchange_dir = -1;
					// Game State to wait on completion of the reset animation
					m.game_state = 'resetWait';
				}
			},
			checkCombo: function (com) {
				/*
					Calculate combo type and feed and start
					the combo execution
					
					Arguments
					com.first_atom: First atom to be combined
					com.second_atom: First atom to be combined
					
					Returns
					A boolean for whether or not a combo was executed
				*/
				var first_type; // Number: ENUM atom type value for first atom
				var second_type; // Number: ENUM atom type value for second atom
				var first_color; // Number: ENUM atom color value for first atom
				var second_color; // Number: ENUM atom color value for second atom
				var combo_code; // Number: Atom type for combo effect
				var add_color; // Boolean: Add color to combo_code?
				// Init Function Values
				first_type = m.atoms[com.first_atom].controller.getType();
				second_type = m.atoms[com.second_atom].controller.getType();
				first_color = m.atoms[com.first_atom].controller.getColor();
				second_color = m.atoms[com.second_atom].controller.getColor();
				add_color = false;
				// Create combo code
				switch (first_type) {
					case m.atom_types.big_bang:
						m.combo_type = 'wild_';
						break;
					case m.atom_types.bang_plasma:
						m.combo_type = 'plasma_';
						break;
					case m.atom_types.bang_small:
						m.combo_type = 'small_';
						break;
					case m.atom_types.bang_medium:
						m.combo_type = 'medium_';
						break;
					case m.atom_types.bang_full:
						m.combo_type = 'full_';
						break;
					case m.atom_types.bang_slash:
					case m.atom_types.bang_vert:
					case m.atom_types.bang_backslash:
						m.combo_type = 'line_';
						break;
					default:
						if (m.atoms[com.first_atom].controller.getColor()
								!= m.atom_colors.void) {
							m.combo_type = 'atom_';
						} else {
							m.combo_type = 'void_';
						}
				}
				switch (second_type) {
					case m.atom_types.big_bang:
						m.combo_type = m.combo_type + 'wild';
						break;
					case m.atom_types.bang_full:
						m.combo_type = m.combo_type + 'full';
						break;
					case m.atom_types.bang_plasma:
						m.combo_type = m.combo_type + 'plasma_';
						break;
					case m.atom_types.bang_small:
						m.combo_type = m.combo_type +  'small_';
						break;
					case m.atom_types.bang_medium:
						m.combo_type = m.combo_type +  'medium_';
						break;
					case m.atom_types.bang_slash:
					case m.atom_types.bang_vert:
					case m.atom_types.bang_backslash:
						m.combo_type = m.combo_type + 'line';
						break;
					default:
						if (m.atoms[com.second_atom].controller.getColor()
								!= m.atom_colors.void) {
							m.combo_type = m.combo_type + 'atom';
						} else {
							m.combo_type = m.combo_type + 'void';
						}
				}
				// Return if combo is invalid
				if (m.combo_type.indexOf('void') > -1) {
					return false;
				}
				if (m.combo_type.indexOf('atom') > -1) {
					if (m.combo_type.indexOf('wild') == -1) {
						return false;
					}
				}
				// Valid combo, clear type of color from first atom
				m.atoms[com.second_atom].controller.setType({
					type: m.atom_types.empty
				});
				m.atoms[com.second_atom].controller.setColor({
					color: m.atom_colors.void
				});
				// Create combo code
				combo_code = 0;
				if (m.combo_type.indexOf('small') > -1) {
					combo_code = 100;
					if (m.combo_type.indexOf('plasma') > -1) {
						combo_code = 110;
						if (first_type == m.atom_types.bang_plasma) {
							combo_code = combo_code + first_color;
						} else {
							combo_code = combo_code + second_color;
						}
					}
					if (m.combo_type.indexOf('medium') > -1) {
						combo_code = 120;
					}
					if (m.combo_type.indexOf('line') > -1) {
						combo_code = 130;
						if (m.combo_type.substr(0, 4) == 'line') {
							combo_code = combo_code + (first_type -
								m.atom_types.bang_slash);
						} else {
							combo_code = combo_code + (second_type -
								m.atom_types.bang_slash);
						}
					}
					if (m.combo_type.indexOf('full') > -1) {
						combo_code = 140;
					}
					if (m.combo_type.indexOf('wild') > -1) {
						combo_code = 150;
						if (first_type == m.atom_types.big_bang) {
							combo_code = combo_code + second_color;
						} else {
							combo_code = combo_code + first_color;
						}
					}
				} else {
					if (m.combo_type.indexOf('plasma') > -1) {
						combo_code = 160 + second_color;
						if (m.combo_type.indexOf('medium') > -1) {
							combo_code = 170;
							if (first_type == m.atom_types.bang_plasma) {
								combo_code = combo_code + first_color;
							} else {
								combo_code = combo_code + second_color;
							}
						}
						if (m.combo_type.indexOf('line') > -1) {
							combo_code = 180;
							if (m.combo_type.substr(0, 4) == 'line') {
								combo_code = combo_code + second_color;
							} else {
								combo_code = combo_code + first_color;
							}
						}
						if (m.combo_type.indexOf('full') > -1) {
							combo_code = 190;
							if (first_type == m.atom_types.bang_plasma) {
								combo_code = combo_code + first_color;
							} else {
								combo_code = combo_code + second_color;
							}
						}
						if (m.combo_type.indexOf('wild') > -1) {
							combo_code = 200;
							if (first_type == m.atom_types.bang_plasma) {
								combo_code = combo_code + first_color;
							} else {
								combo_code = combo_code + second_color;
							}
						}
					} else {
						if (m.combo_type.indexOf('medium') > -1) {
							combo_code = 210;
							if (m.combo_type.indexOf('line') > -1) {
								combo_code = 220;
								if (m.combo_type.substr(0, 4) == 'line') {
									combo_code = combo_code + (first_type -
										m.atom_types.bang_slash);
								} else {
									combo_code = combo_code + (second_type -
										m.atom_types.bang_slash);
								}
							}
							if (m.combo_type.indexOf('full') > -1) {
								combo_code = 230;
							}
							if (m.combo_type.indexOf('wild') > -1) {
								combo_code = 240;
								if (m.combo_type.substr(0, 4) == 'wild') {
									combo_code = combo_code + second_color;
								} else {
									combo_code = combo_code + first_color;
								}
							}
						} else {
							if (m.combo_type.indexOf('line') > -1) {
								combo_code = 250;
								if (m.combo_type.indexOf('full') > -1) {
									combo_code = 260;
									if (m.combo_type.substr(0, 4) == 'line') {
										combo_code = combo_code + (first_type -
											m.atom_types.bang_slash);
									} else {
										combo_code = combo_code + (second_type -
											m.atom_types.bang_slash);
									}
								}
								if (m.combo_type.indexOf('wild') > -1) {
									combo_code = 270;
								}
								if (combo_code == 250) {
									switch (first_type) {
										case m.atom_types.bang_slash:
											combo_code = combo_code + 1;
											break;
										case m.atom_types.bang_vert:
											combo_code = combo_code + 2;
											break;
										case m.atom_types.bang_backslash:
											combo_code = combo_code + 4;
											break;
									}
									if (first_type != second_type) {
										switch (second_type) {
											case m.atom_types.bang_slash:
												combo_code = combo_code + 1;
												break;
											case m.atom_types.bang_vert:
												combo_code = combo_code + 2;
												break;
											case m.atom_types.bang_backslash:
												combo_code = combo_code + 4;
												break;
										}
									}
								}
							} else {
								if (m.combo_type.indexOf('full') > -1) {
									combo_code = 280;
									if (m.combo_type.indexOf('wild') > -1) {
										combo_code = 290;
										if (m.combo_type.substr(0, 4)
												== 'wild') {
											combo_code = combo_code
												+ second_color;
										} else {
											combo_code = combo_code
												+ first_color;
										}
									}
								} else {
									combo_code = 300;
									if (m.combo_type.indexOf('atom') > -1) {
										combo_code = 310;
										if (m.combo_type.substr(0, 4)
												== 'atom') {
											combo_code = combo_code
												+ first_color;
										} else {
											combo_code = combo_code
												+ second_color;
										}
									}
								}
							}
						}
					}
				}
				// Decrease requirements for the level for the two combined atoms
				t.controller.decreaseRequirements({
					type: first_type,
					color: first_color
				});
				t.controller.decreaseRequirements({
					type: second_type,
					color: second_color
				});
				// Change atom to combo code
				m.atoms[com.first_atom].controller.setType({
					type: combo_code
				});
				// Execute special atom
				m.explode_time = new Date().getTime();
				m.specials = [com.first_atom];
				m.special_times = [0];
				m.special_pos = [com.first_atom];
				t.controller.executeSpecials({});
				m.matches = [];
				return true;
			},
			gs_resetWait: function (com) {
				/*
					Wait for end of atom reset before returning
					control to the user
				*/
				var time_now; // Number: The current time in milliseconds
				// Check if exchange animation time has elapsed
				time_now = new Date().getTime();
				if (time_now > m.exchange_start + m.exchange_time) {
					m.game_state = 'userInput';
				}
			},
			gs_noMovesLeft: function (com) {
				/*
					No legal moves could be made on shuffle, end game
				*/
				var valid_popup; // Boolean: Was menu created?
				// Requirements not met before out of moves
				valid_popup = BBM({
					com: 'openMenu',
					menu_id: 'fail_legal'
				});
				if (valid_popup == true) {
					m.game_state = 'failWait';
				} else {
					// KAL add code to fail to the main menu
					console.log('*** Need to fail to the main menu ***');
				}
			},
			gs_noMoves: function (com) {
				/*
					Player has used all moves, end game
				*/
				var valid_popup; // Boolean: Was menu created?
				// Requirements not met before out of moves
				valid_popup = BBM({
					com: 'openMenu',
					menu_id: 'fail_moves'
				});
				if (valid_popup == true) {
					m.game_state = 'failWait';
				} else {
					// KAL add code to fail to the main menu
					console.log('*** Need to fail to the main menu ***');
				}
			},
			gs_implodeGrid: function (com) {
				/*
					Blackhole has been triggered, end game
				*/
				var valid_popup; // Boolean: Was menu created?
				// Required Score Failed, Give Failure Message
				valid_popup = BBM({
					com: 'openMenu',
					menu_id: 'fail_implode'
				});
				if (valid_popup == true) {
					m.game_state = 'failWait';
				} else {
					// KAL add code to fail to the main menu
					console.log('*** Need to fail to the main menu ***');
				}
			},
			gs_levelComplete: function (com) {
				/*
					All requirements successfully met, end game
				*/
				// Start Chain Reaction Message
				m.game_state = 'chainReaction';
				m.game_state_timer = new Date().getTime();
				m.chain_reaction = true;
			},
			gs_chainReaction: function (com) {
				/*
					Wait for the CHAIN REACTION message to be 
					stated
				*/
				var atom_id; // String: Atom ID of the atom being check to be legal
				if (new Date().getTime() > m.game_state_timer + 1000) {
					m.game_state = 'bonusPowerUps';
					// Calculate list of valid power-up ids
					m.valid_bonus_ids = [];
					for (atom_id in m.atoms) {
						if (m.atoms.hasOwnProperty(atom_id)) {
							if (m.atoms[atom_id].controller.hasBonding()
									== false) {
								switch (m.atoms[atom_id].controller.getType()) {
									case m.atom_types.atom:
									case m.atom_types.radioactive:
									case m.atom_types.blackhole:
									case m.atom_types.bang_plasma:
									case m.atom_types.bang_small:
									case m.atom_types.bang_medium:
									case m.atom_types.bang_full:
										m.valid_bonus_ids.push(atom_id);
								}
							}
						}
					}
					// Init Bonus Timer
					m.bonus_timer = new Date().getTime() + m.bonus_delay;
				}
			},
			gs_bonusPowerUps: function (com) {
				/*
					Assign Bonus Power-Ups to the board
				*/
				var atom_id; // String: Atom ID for the atom to be upgraded
				var new_atom; // Number: ENUM atom type for upgrade
				if (new Date().getTime() > m.game_state_timer + 3000) {
					m.chain_reaction = false;
				}
				if (m.moves > 0 && m.is_time_limited == false) {
					if (new Date().getTime() > m.bonus_timer) {
						// Change atom to higher power-up
						if (m.valid_bonus_ids.length > 0) {
							atom_id = m.valid_bonus_ids[t.controller.rnd({
								max: m.valid_bonus_ids.length
							})];
							new_atom = m.atoms[atom_id].controller.getType();
							switch (new_atom) {
								case m.atom_types.atom:
								case m.atom_types.radioactive:
								case m.atom_types.blackhole:
									new_atom = m.atom_types.bang_small;
									break;
								case m.atom_types.bang_plasma:
									new_atom = m.atom_types.bang_slash
										+ t.controller.rnd({
											max: 3
										});
									break;
								case m.atom_types.bang_small:
									new_atom = m.atom_types.bang_medium;
									break;
								case m.atom_types.bang_medium:
									new_atom = m.atom_types.bang_full;
									break;
								case m.atom_types.bang_full:
									new_atom = m.atom_types.big_bang;
									break;
							}
							m.atoms[atom_id].controller.setType({
								type: new_atom
							});
							if (new_atom == m.atom_types.big_bang) {
								m.atoms[atom_id].controller.setColor({
									type: m.atom_colors.void
								});
							}
						}
						// Reduce moves and display
						m.moves = m.moves - 1;
						BBM({
							com: 'updateSideMenu',
							area: 'moves'
						});
						// Reset Bonus Timer
						m.bonus_timer = new Date().getTime() + m.bonus_delay;
					}
				} else {
					if (m.chain_reaction == false) {
						// Start Triggering power-ups
						m.bonus_timer = new Date().getTime() + m.bonus_delay;
						m.game_state = 'bonusExecution';
					}
				}
			},
			gs_bonusExecution: function (com) {
				/*
					Assign Bonus Power-Ups to the board
				*/
				var atom_id; // String: Atom ID of checked atom
				var atom_type; // Number: ENUM atom type value
				var powerups; // Array: List of atom IDs for power-up atoms
				// Init Function Values
				powerups = [];
				// Check each atom for power-ups
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						atom_type = m.atoms[atom_id].controller.getType();
						switch (atom_type) {
							case m.atom_types.big_bang:
							case m.atom_types.bang_slash:
							case m.atom_types.bang_vert:
							case m.atom_types.bang_backslash:
							case m.atom_types.bang_plasma:
							case m.atom_types.bang_small:
							case m.atom_types.bang_medium:
							case m.atom_types.bang_full:
							   powerups.push(atom_id); 
						}
					}
				}
				if (powerups.length == 0) {
					m.game_state = 'checkValidScore';
				} else {
					t.controller.clearMatchData({});
					atom_id = powerups[t.controller.rnd({
						max: powerups.length
					})];
					m.explode_time = new Date().getTime();
					m.specials = [atom_id];
					m.special_times = [0];
					m.special_pos = [atom_id];
					t.controller.executeSpecials({});
					// Reset exchange ids and dir
					m.exchange_atoms = ['', ''];
					m.exchange_dir = -1;
					// Set game to eval special damage
					m.game_state = 'explodeWait';
				}
			},
			gs_checkValidScore: function (com) {
				/*
					Check if score has reached valid level
					and route to proper game state after
					displaying a message
				*/
				var valid_popup; // Boolean: Did the menu start correctly?
				var leveled;
				var tube_meter = 0;
				var resources_left = 0;
				var game_type = "m";
				if (m.score >= m.tube_scores[0]) {
				    if (m.score >= m.tube_scores[1]) {
				        tube_meter = 1;
				        if (m.score >= m.tube_scores[2]) {
    				        tube_meter = 2;
    				    }
				    }
				    resources_left = m.completed_moves;
				    if (m.is_time_limited == true) {
				        game_type = "t";
				        resources_left = m.completed_time;
				    }
				    m.game_state = 'successWait';
					// Sends message that level was beaten
                    $.ajax({
                        url: "php/complete_level.php",
                        type: "GET",
                        data: {
                        	user_id: m.mm.user_id,
                        	lh: m.lh,
                        	meter: tube_meter,
                        	score: m.score,
                        	level_type: game_type,
			                remaining: resources_left
                        },
                        success:
                            function (result) {
                                BBM({
                                    com: 'completeLoaded',
                                    data: result,
                                    meter_level: tube_meter,
                                    type_game: game_type
                                });
                            },
                        error:
                            function (my_error) {
                                
                                console.log("***ERROR*** gs_checkValidScore: ", my_error);
                                
                                BBM({
                                    com: 'completeLoaded',
                                    data: 'error'
                                });
                            }
                    });
				} else {
					// Required Score Failed, Give Failure Message
					valid_popup = BBM({
						com: 'openMenu',
						menu_id: 'fail_score'
					});
					if (valid_popup == true) {
						m.game_state = 'failWait';
					} else {
						// KAL add code to fail to the main menu
						console.log('*** Need to fail to the main menu ***');
					}
				}
			},
			gs_initPopperAnimation: function (com) {
				/*
					Sets up the popper animation for screen
					clearing
				*/
				var atom_id; // String: ID of the current checked atom
				var atom_type; // Number: ENUM value of the atom type
				// Init function values
				m.imploding_atoms = [];
				// Switch Game Play flag off
				m.has_ended = true;
				// Record all used atoms for clearing
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						if (atom_id != m.implode_atom) {
							atom_type = m.atoms[atom_id].controller.getType();
							if (atom_type != m.atom_types.unused) {
								m.imploding_atoms.push(atom_id);
							}
						}
					}
				}
				// Start Animation operation
				m.game_state_timer = -1;
				m.game_state = 'popperAnimation';
			},
			gs_popperAnimation: function (com) {
				/*
					Operates the popper animation
				*/
				var a; // Number: Increment Var
				var atom_index; // Number: Index into imploding atom to clear atom with
				var atom_id; // String: Current atom id being used
				var time_now; // Number: Current milliseconds
				var valid_popup; // Boolean: Was menu created?
				var total_atoms; // Number: Total number of atom to pop
				time_now = new Date().getTime();
				if (m.game_state_timer == -1) {
					for (a = 0; a < 3; a++) {
						total_atoms = m.imploding_atoms.length;
						if (total_atoms == 0) {
							m.game_state_timer = time_now;
						} else {
							atom_index = t.controller.rnd({
								max: total_atoms
							});
							atom_id = m.imploding_atoms[atom_index];
							t.controller.clearBonds({
								atom_id: atom_id
							});
							m.atoms[atom_id].controller.clearAtom();
							m.imploding_atoms.splice(atom_index, 1);
						}
					}
				} else {
					time_now = new Date().getTime();
					if (time_now > m.game_state_timer + 250) {
						if (m.score >= m.tube_scores[0]) {
							valid_popup = BBM({
								com: 'openMenu',
								menu_id: 'fail_criteria'
							});
						} else {
							valid_popup = BBM({
								com: 'openMenu',
								menu_id: 'fail_score'
							});
						}
						if (valid_popup == true) {
							m.game_state = 'failWait';
						} else {
							// KAL add code to fail to the main menu
							console.log('*** Need to fail to the main menu ***');
						}
					}
				}
			},
			gs_initImplodeAnimation: function (com) {
				/*
					Sets up the implode animation for
					screen clearing
				*/
				var a; // Number: Increment Var
				var implode_atoms; // Number: Total number of imploding atoms
				var effected_atoms; // Array: List of atoms getting moved
				var atom_id; // String: ID of the current checked atom
				var atom_type; // Number: ENUM value of the atom type
				var implode_x; // Number: X center of implosion
				var implode_y; // Number: Y center of implosion
				var atom_x; // Number: X location of atom
				var atom_y; // Number: Y location of atom
				var time_now; // Number: Current milliseconds
				// Init function values
				effected_atoms = [];
				// Switch Game Play flag off
				m.has_ended = true;
				// Select center point of implosion
				implode_atoms = m.imploding_atoms.length;
				m.implode_atom = m.imploding_atoms[t.controller.rnd({
					max: implode_atoms
				})];
				// Generate list of atoms to be moved
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						if (atom_id != m.implode_atom) {
							atom_type = m.atoms[atom_id].controller.getType();
							if (atom_type != m.atom_types.unused) {
								// Add to implosion animation list
								effected_atoms.push(atom_id);
								// Clear bonding
								m.atoms[atom_id].controller.setBonds({
									bonds: ['', '', '', '', '', '']
								});
								if (atom_type >= m.atom_types.bond_vert
										&& atom_type
										<= m.atom_types.bond_backslash) {
									m.atoms[atom_id].controller.setType({
										type: m.atom_types.empty 
									});
								}
							}
						}
					}
				}
				// Target atoms to the epicenter
				implode_atoms = effected_atoms.length;
				implode_x = m.atoms[m.implode_atom].controller.getX();
				implode_y = m.atoms[m.implode_atom].controller.getY();
				for (a = 0; a < implode_atoms; a++) {
					atom_x = m.atoms[effected_atoms[a]].controller.getX();
					atom_y = m.atoms[effected_atoms[a]].controller.getY();
					m.atoms[effected_atoms[a]].controller.setX({
						x: implode_x
					});
					m.atoms[effected_atoms[a]].controller.setY({
						y: implode_y
					});
					m.atoms[effected_atoms[a]].controller.startMove({
						 x_start: atom_x,
						 y_start: atom_y,
						 is_teleporting: false
					});
					
				}
				// Start all atoms moving towards the implode center
				time_now = new Date().getTime();
				for (a = 0; a < implode_atoms; a++) {
					m.atoms[effected_atoms[a]].controller.startMoveTime({
						start_time: time_now,
						travel_time: 1000
					});
				}
				// Start the animation operation
				m.game_state_timer = new Date().getTime();
				m.game_state = 'implodeAnimation';
			},
			gs_implodeAnimation: function (com) {
				/*
					Operates the implode animation
				*/
				var atom_id; // String: Current atom id being used
				var time_now; // Number: Current milliseconds
				var valid_popup; // Boolean: Was menu created?
				time_now = new Date().getTime();
				if (time_now > m.game_state_timer + 875) {
					if (m.implode_time == -1) {
						m.implode_time = time_now;
					} else {
						if (m.implode_clear == false) {
							if (time_now > m.implode_time + 125) {
								m.implode_clear = true;
								for (atom_id in m.atoms) {
									if (m.atoms.hasOwnProperty(atom_id)) {
										m.atoms[atom_id].controller
											.clearAtom();
									}
								}
							}
						}
					}
				}
				if (time_now > m.game_state_timer + 1500) {
					if (m.score >= m.tube_scores[0]) {
						valid_popup = BBM({
							com: 'openMenu',
							menu_id: 'fail_criteria'
						});
					} else {
						valid_popup = BBM({
							com: 'openMenu',
							menu_id: 'fail_score'
						});
					}
					if (valid_popup == true) {
						m.game_state = 'failWait';
					} else {
						// KAL add code to fail to the main menu
						console.log('*** Need to fail to the main menu ***');
					}
				}
			},
			gs_openSuccess: function (com) {
			    /*
					Wait for use input into the success menu
				*/
				// Required Score Met, Give Success Message
				valid_popup = BBM({
					com: 'openMenu',
					menu_id: m.mm.success_menu,
					x: 322
				});
				// Open High Scores Panel
				valid_popup = BBM({
					com: 'openMenu',
					menu_id: 'high_scores',
					x: 578,
					delay: 1000
				});
				m.game_state = 'successWait';
			},
			gs_successWait: function (com) {
				/*
					Wait for use input into the success menu 
				*/
			},
			gs_failWait: function (com) {
				/*
					Wait for use input into the success menu
				*/
			},
			completeLoad: function (com) {
			    /*
					Level complete loaded
				*/
				m.game_state = 'openSuccess';	
			},
			getGameState: function (com) {
				/*
					Returns the current game state
				*/
				return m.game_state;
			},
			setGameState: function (com) {
				/*
					Overrides the current game_state
					
					Arguments
					com.state: The new game state
				*/
				m.game_state = com.state;
				m.game_state_timer = new Date().getTime();
			},
			freezeGame: function (com) {
				/*
					Freeze or resume the game
					
					Arguments
					com.freeze: Boolean for to freeze the game
				*/
				var freeze_duration; // Number: Milliseconds the freeze was for
				if (com.freeze == true) {
					m.freeze_game = new Date().getTime();   
				} else {
					if (m.freeze_game > -1) {
						if (m.start_time > -1) {
							freeze_duration = new Date().getTime()
								- m.freeze_game;   
							m.start_time = m.start_time + freeze_duration;
						}
					}
					m.freeze_game = -1; 
				}
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