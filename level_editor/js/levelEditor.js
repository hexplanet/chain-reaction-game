/*
	Code for the Big Bang Game Editor
*/

var BBE; // Function: Contains MVC for Big Bang Game Editor

BBE = function(command) {
	/*
		Contains MVC for Big Bang Game Editor.
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
			canvas_generator: null, // Element: Canvas for generator menu   
			op_timer: null, // setInterval: 20 fps operation of timed events
			width: 0, // Number: Width of the canvas
			height: 0, // Number: Height of the canvas
			gen_width: 0, // Number: Width of the generator menu canvas
			gen_height: 0, // Number: Height of the generator menu canvas
			cc: null, // Context: 2D context for canvas element
			gcc: null, // Context: 2D context for generator canvas element
			atom_file: 'hex_pieces.png', // String: Filename for atom pieces
			atom_image: new Image(), // image: PNG of atom pieces
			atom_loaded: false, // Boolean: Is the atom pieces loaded?
			back_file: 'hex_background.png', // String: The default background image
			back_image: new Image(), // image: PNG hex overlay
			back_loaded: false, // Boolean: Is the hex overlay loaded?
			display_hex: true, // Boolean: Display the hex overlay?
			bg_file: '', // String: The background image for the level
			bg_image: new Image(), // image: JPG background image for level
			bg_loaded: false, // Boolean: Is the background image loaded?
			bg_color: '#000000', // String: Background color for level
			atom_width: 55, // Number: Width of the atom on the sprite sheet to draw
			atom_wing: 14, // Number: Width of a wing of the hex shape
			atom_height: 47, // Number: Height of the atom on the sprite sheet to draw
			atoms: {}, // Object: Container of level game pieces
			generators: {}, // Object: Contains atom generator data for atoms
			gen_clipboard: null, // Object: Atom Generator to paste
			gen_edit: null, // Object: Atom Generator values being edited
			atom_colors_min: -1, // Number: The minimum color value
			atom_colors_max: 8, // Number: Maximum color value
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
			atom_color_chars: 'rpbcovywt', // String: Atom color characters    
			atom_types_min: -1, // Number: Minimum type value
			atom_types_max: 28, // Number: Maximum type value
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
			requirement_tabs: ['colors',
				'types',
				'general',
				'goals',
				'matches',
				'combos',
				'compounds'], // Array: List of the requirement tabs
			types_prefixes: ['hole', 'anti', 'radio', 'void', 'freeze'],
				// Array: List of atom type input prefixes
			combo_postfixes: ['4C', '5', '5C', '6', '6C', '7'], // Array: List of matches input postfixes
			x_atoms: 13, // Number: Atoms across the game screen
			y_atoms: 12, // Number: Atoms down the game screen
			x_base: 195, // Number: X-position of first atom
			y_base: 48, // Number: Y-position of first atom
			x_inc: 40, // Number: X-position of first atom
			y_inc: 46, // Number: Y-position of first atom
			z_inc: -23, // Number: Y-offset of odd column of atoms
			previous_cursor: "", // String: ID of the cursor atom on last pass
			drop_id: -1, // Number: Index of the current drop list cursor is over
			max_drop_list: 50, // Number: Maximum number of atom on drop list
			menu_id: '', // String: ID of the atom for the atom generator menu
			cursor_id: '', // String: ID of the atom the cursor is over
			cursor_blink: -1, // Number: Counter the causes cursor blink
			bonding_positions: [0,0, 0,0, 0,0, 0,0, 0,0, 0,0], // Array: X,Y distances between neighboring atoms
			direction_mirror: [3, 4, 5, 0, 1, 2], // Array: Bonding side of neighboring atom base on side index
			teleporter_down: '', // String: atom_id when teleporter button is pressed down
			fall_down: ['', '', ''], // Array: atom_id when fall button is pressed
			fall_x_offset: [0, 0, 0, 0, 0, 0], // Array: X offset for displaying fall lines
			fall_y_offset: [0, 0, 0, 0, 0, 0], // Array: Y offset for displaying fall lines
			nudge_dir: [1, 1, 1, 1, 1, 1], // Array: Is a nudge direction valid
			nudge_down: -1, // Number: Direction index of nudge interface mousedown
			hex_down: '', // String: atom_id for atom switching
			total_atoms: 0, // Number: Total number of active atoms on grid
			fall_arrays: {}, // Object: Contains arrays of atoms in lines
			fall_ids: [], // Array: Fall array names in order of bottom to top
			shift_pressed: false, // Boolean: Is the shift key pressed?
			keymap: [], // Array: Tracking up/down keys
			popup_active_file: "", // String: Filename of User-Selected File.
			in_notes_mode: false, // Boolean: Is the editor in notes mode
			game_notes: [], // Array: List of note objects,
			note_action: {} // Object: Contains action information for notes mode
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
					m.cc.drawImage(m.bg_image, 0, 0);
				} else {
					// Fill background with color
					m.cc.fillStyle = m.bg_color;
					m.cc.fillRect(0, 0, m.width, m.height);
				}
			},
			updateCanvas: function() {
				/*
					Update of canvas that occurs every 1/30th of a second
				*/
				var atom_id; // String: The id of the atom in the atoms object
				var cursor_frame; // Number: Frame number of cursor shown
				var cursor_pos; // Object: Contains x and y location of cursor
				var teleporter_links; // Array: Lines to draw to show teleporter links
				var total_links; // Number: Total number of teleporter link lines
				var fall_links; // Array: The fall links atom ids for a given atom
				var teleport_to; // String: id of the atom that the teleport targets
				var fall_to; // Array: Falls for a given atom
				var i; // Number: Increment Var
				var x_source;
				var y_source;
				// Init values for function
				teleporter_links = [];
				fall_links = [];
				// Clear Canvas
				t.view.clearCanvas();
				// Applies keys to cursor atom if different
				if (m.cursor_id != m.previous_cursor) {
					BBE({
						com: 'executeKeys'
					});
				}
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
						if (m.atoms[atom_id].controller.getTeleporter() != "") {
							teleport_to = m.atoms[atom_id].controller
								.getTeleporter();
							teleporter_links.push(m.atoms[atom_id].controller
								.getX() + (m.atom_width / 2));
							teleporter_links.push(m.atoms[atom_id].controller
								.getY() + m.atom_height -8);
							teleporter_links.push(m.atoms[teleport_to]
								.controller.getX() + (m.atom_width / 2));
							teleporter_links.push(m.atoms[teleport_to]
								.controller.getY() + (m.atom_height / 2));
						}
						fall_to = m.atoms[atom_id].controller.getFall();
						for (i = 0; i < 3; i++) {
							if (fall_to[i] != '') {
								fall_links.push(m.atoms[atom_id].controller
									.getX() + m.fall_x_offset[i]);
								fall_links.push(m.atoms[atom_id].controller
									.getY() + m.fall_y_offset[i]);
								fall_links.push(m.atoms[fall_to[i]].controller
									.getX() + m.fall_x_offset[i + 3]);
								fall_links.push(m.atoms[fall_to[i]].controller
									.getY() + m.fall_y_offset[i + 3]);       
							}   
						}
					}    
				}
				// Draw each atom foreground
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						m.atoms[atom_id].view.drawAtomForeground({});
					}
				}
				// Display teleporter links
				total_links = teleporter_links.length;
				m.cc.globalAlpha = 0.5;
				for (i = 0; i < total_links; i = i + 4) {
					m.cc.beginPath();
					m.cc.moveTo(teleporter_links[i], teleporter_links[i + 1]);
					m.cc.lineTo(teleporter_links[i + 2],
						teleporter_links[i + 3]);
					m.cc.lineWidth = 5;
					m.cc.strokeStyle = "#1dd1cb";
					m.cc.stroke();
				}
				// Display fall links
				total_links = fall_links.length;
				for (i = 0; i < total_links; i = i + 4) {
					m.cc.beginPath();
					m.cc.moveTo(fall_links[i], fall_links[i + 1]);
					m.cc.lineTo(fall_links[i + 2], fall_links[i + 3]);
					m.cc.lineWidth = 5;
					m.cc.strokeStyle = "#cbd11d";
					m.cc.stroke();
				}
				m.cc.globalAlpha = 1;
				if (m.back_loaded) {
					// Draw hex overlay image
					if (m.display_hex == true) {
						m.cc.drawImage(m.back_image, 0, 0);
					}
					// Operate Atom Cursor
					m.cursor_blink = m.cursor_blink + 1;
					if (m.cursor_blink >19) {
						m.cursor_blink = 0;
					}
					if (m.cursor_id != "") {
						cursor_pos = m.atoms[m.cursor_id].controller
							.getPosition({});
						cursor_frame = Math.floor(m.cursor_blink / 5);
						m.cc.drawImage(m.atom_image, ((cursor_frame + 1) 
							* m.atom_width),
							611, m.atom_width, m.atom_height, cursor_pos.x,
							cursor_pos.y, m.atom_width, m.atom_height);
					}
				}
				// Display hex nudge interface
				x_source = 14 * m.atom_width;
				y_source = 11 * m.atom_height;
				m.cc.drawImage(m.atom_image, x_source, y_source,
					m.atom_width, m.atom_height, 700, 603,
					m.atom_width, m.atom_height);
				m.previous_cursor = m.cursor_id;
				for (i = 0; i < 6; i++) {
					if (m.nudge_dir[i] == 0) {
						x_source = (21 + i) * m.atom_width;
						y_source = 13 * m.atom_height;
						m.cc.drawImage(m.atom_image, x_source, y_source,
							m.atom_width, m.atom_height, 700, 603,
							m.atom_width, m.atom_height);
					}
				}
				// Display if notes mode is active
				if (m.in_notes_mode) {
    				m.cc.drawImage(m.back_image,
    				    0, 626,
    				    140, 24,
    					394, 0,
    					140, 24
    				);
    				t.view.displayNotes();
    			}
			},
			displayNotes: function () {
				var total_notes = m.game_notes.length;
				var i;
				var k;
				var game_note;
				var x_base;
				var x_pos;
				var y_pos;
				var total_characters;
				var draw_char;
				var char_code;
				var x_source;
				var y_source;
				for (i = 0; i < total_notes; i++) {
					game_note = m.game_notes[i];
					if (game_note.x_pointer != game_note.x || game_note.y_pointer != game_note.y) {
					    // Draw Pointer Line
					    x_pos = game_note.x - Math.round(game_note.width / 2) + 30;
					    if (game_note.x_pointer > game_note.x) {
					        x_pos = game_note.x + Math.round(game_note.width / 2) - 30;
					    }
					    y_pos = game_note.y - Math.round(game_note.height / 2) + 30;
					    if (game_note.y_pointer > game_note.y) {
					        y_pos = game_note.y + Math.round(game_note.height / 2) - 30;
					    }
					    m.cc.beginPath();
					    m.cc.strokeStyle = "#ffffff";
					    m.cc.lineWidth = 3;
					    m.cc.shadowBlur = 3;
                        m.cc.shadowColor = "#000000";
					    m.cc.moveTo(x_pos, y_pos);
					    m.cc.lineTo(game_note.x_pointer, game_note.y_pointer);
					    m.cc.stroke();
					    m.cc.shadowBlur = 0;
					}
					t.view.draw9box({
						x: game_note.x,
						y: game_note.y,
						width: game_note.width,
						height: game_note.height
					});
					// Draw hilight box if text field is active
					if (m.note_action.area) {
					    if (m.note_action.area == "text" && m.note_action.index == i) {
					        m.cc.beginPath();
					        m.cc.strokeStyle = "#ffff00";
					        m.cc.rect(
					            game_note.x - Math.round(game_note.width / 2) + 39,
					            game_note.y - Math.round(game_note.height / 2) + 39,
					            game_note.width - 78,
					            game_note.height - 78
					        );
                            m.cc.stroke(); 
					    }  
					}
					// Draw text message
					x_pos = game_note.x - Math.round(game_note.width / 2) + 45;
					x_base = x_pos;
					y_pos = game_note.y - Math.round(game_note.height / 2) + 45;
					total_characters = game_note.message.length;
					for (k = 0; k < total_characters; k++) {
					    draw_char = game_note.message.charAt(k);
					    if (draw_char == "|") {
					        x_pos = x_base;
					        y_pos = y_pos + 20;
					    } else {
					        char_code = game_note.message.charCodeAt(k);
					        if (char_code >= 33 && char_code <= 126) {
					            char_code = char_code - 33;
					            x_source = 60 + ((char_code % 8) * 12);
				                y_source = 119 + (Math.floor(char_code / 8) * 20);
					            m.cc.drawImage(m.back_image,
                				    x_source, y_source,
                				    12, 18,
                					x_pos, y_pos,
                					12, 18
                				);   
					        }
					        x_pos = x_pos + 12;
					    }
					}
				}
			},
			draw9box: function (com) {
                /*
                    Draws a nine box
                    
                    Arguments
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
                // Draw 9box segments
                for (i = 0; i < 9; i++) {
                    // Calculate X source and target
                    x_source = 55;
                    source_width = 40;
                    x_target = com.x - Math.floor(com.width / 2);
                    target_width = source_width;
                    if (com.width < target_width * 2) {
                        target_width = Math.round(com.width / 2);
                    }
                    if (i % 3 > 0) {
                        x_source = x_source + source_width;
                        x_target = x_target + target_width;
                        source_width = 40;
                        if (i % 3 == 2) {
                            offset_value = com.width - (target_width * 2);
                            offset_value = offset_value > 0 ? offset_value : 0;
                            x_target = x_target + offset_value;
                            x_source = x_source + source_width;
                            source_width = 40;
                        } else {
                            target_width = com.width - (target_width * 2);
                        }
                    }
                    // Calculate Y source and target
                    y_source = 0;
                    source_height = 40;
                    y_target = com.y - Math.floor(com.height / 2);
                    target_height = source_height;
                    if (com.height < target_height * 2) {
                        target_height = Math.round(com.height / 2);
                    }
                    if (Math.floor(i / 3) > 0) {
                        y_source = y_source + source_height;
                        y_target = y_target + target_height;
                        source_height = 40;
                        if (Math.floor(i / 3) == 2) {
                            offset_value = com.height - (target_height * 2);
                            offset_value = offset_value > 0 ? offset_value : 0;
                            y_target = y_target + offset_value;
                            y_source = y_source + source_height;
                            source_height = 40;
                        } else {
                            target_height = com.height - (target_height * 2);
                        }
                    }
                    if (target_width > 0 && target_height > 0) {
                        if (i == 4) {
                            // Draw main body as a rect
                            m.cc.fillStyle = '#404040';
        		            m.cc.fillRect(x_target, y_target, target_width, target_height);
                        } else {
                            // Draw corner and side pieces from sprite sheet
                            // Note: +1 on height is to correct for rounding
                            m.cc.drawImage(m.back_image,
                                x_source, y_source,
        		                source_width, source_height + 1,
                                x_target, y_target,
        		                target_width, target_height + 1);
                        }
                    }
                }
            },
			initGeneratorCanvas: function () {
				/*
					Set the generator canvas to its base
					state for canvas refresh
				*/
				var i; // Number: Increment Var
				var x_position; // Number: X position of piece slot to draw
				var y_position; // Number: Y position of piece slot to draw
				// Fill background with color
				m.gcc.fillStyle = m.bg_color;
				m.gcc.fillRect(0, 0, m.gen_width, m.gen_height);
				// Draw number place and hex template for each drop atom
				x_position = 0;
				y_position = 0;
				for (i = 0; i < m.max_drop_list; i ++) {
					x_position = Math.floor(i / 5) * 85;
					y_position = ((i % 5) *47);
					m.gcc.fillStyle = '#dddddd';
					if (i + 1 < 10) {
						m.gcc.fillText(String(i + 1),
							x_position + 12, y_position + 28);
					} else {
						m.gcc.fillText(String(i + 1),
							x_position + 5, y_position + 28);
					}
					m.gcc.drawImage(m.back_image,
						0, 0,
						110, 47,
						x_position + 30, y_position,
						110, 47);
				}
			},
			updateGeneratorCanvas: function() {
				/*
					Update of generator canvas that occurs
					every 1/30th of a second
				*/
				var i; // Number: Increment Var
				var i_source; // String: Image element which graphic is from
				var x_source; // Number: X position on hex pieces of source
				var y_source; // Number: Y position on hex pieces of source
				var x_position; // Number: X position of piece slot to draw
				var y_position; // Number: Y position of piece slot to draw
				var atom_list; // Array: List of drop atoms for this hex slot
				var total_list; // Number: The length of the atom_list
				var slot_type; // Number: ENUM atom type value for slot
				var slot_color; // Number: ENUM atom color value for slot
				var slot_counter; // Number: Move counter for slot
				if (m.menu_id != '') {
					if (m.gen_edit) {
						atom_list = m.gen_edit.atoms;
						total_list = atom_list.length;
						// Fill background with color
						for (i = 0; i < 5; i++) {
							m.gcc.fillStyle = m.bg_color;
							m.gcc.fillRect((85 * i) + 30, 0,
								55, m.gen_height);
						}
						// Draw each atom type/color
						for (i = 0; i < total_list; i = i + 3) {
							x_position = Math.floor(i / 15) * 85;
							y_position = ((Math.floor(i / 3) % 5) * 47);
							if (m.drop_id == Math.floor(i / 3 )) {
								m.gcc.drawImage(m.back_image,
									0, 47,
									55, 47,
									x_position + 30, y_position,
									55, 47);
							} else {
								m.gcc.drawImage(m.back_image,
									0, 0,
									55, 47,
									x_position + 30, y_position,
									55, 47);
							}
							x_source = -1;
							y_source = -1;
							i_source = 'atom_image';
							slot_type = atom_list[i];
							slot_color = atom_list[i + 1];
							slot_counter = atom_list[i + 2];
							switch (slot_type) {
								case m.atom_types.atom:
									x_source = 0;
									y_source = 12 * m.atom_height;
									if (slot_color > -1) {
										x_source = slot_color * m.atom_width;
										y_source = 0;   
									}
									break;
								case m.atom_types.radioactive:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 2 * m.atom_height;
									} else {
										x_source = (9 + slot_color)
											* m.atom_width;
										y_source = 0;
									}
									break;
								case m.atom_types.blackhole:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 3 * m.atom_height;
									} else {
										x_source = slot_color * m.atom_width;
										y_source = 4 * m.atom_height;
									}
									break;
								case m.atom_types.freeze:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 4 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 10 * m.atom_height;
									}
									break;    
								case m.atom_types.void:
									x_source = 1 * m.atom_width;
									y_source = 12 * m.atom_height;
									break;
								case m.atom_types.antimatter:
									x_source = 0;
									y_source = 8 * m.atom_height;
									break;
								case m.atom_types.bang_slash:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 5 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 2 * m.atom_height;
									}
									break;
								case m.atom_types.bang_vert:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 6 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 0;
									}
									break;
								case m.atom_types.bang_backslash:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 7 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 4 * m.atom_height;
									}
									break;
								case m.atom_types.bang_plasma:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 8 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 9 * m.atom_height;
									}
									break;
								case m.atom_types.bang_small:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 9 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 6 * m.atom_height;
									}
									break;
								case m.atom_types.bang_medium:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 10 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 6 * m.atom_height;
									}
									break;
								case m.atom_types.bang_full:
									if (slot_color < 0) {
										i_source = 'back_image';
										x_source = 0;
										y_source = 11 * m.atom_height;
									} else {
										x_source = (18 + slot_color)
											* m.atom_width;
										y_source = 6 * m.atom_height;
									}
									break;
								case m.atom_types.big_bang:
									x_source = 6 * m.atom_width;
									y_source = 11 * m.atom_height;
									break;
							}
							if (x_source > -1) {
								if (slot_type == m.atom_types.bang_small
										&& slot_color >= 0) {
									m.gcc.drawImage(m[i_source],
										x_source, y_source,
										55, 47,
										x_position + 42, y_position + 12,
										31, 23);            
								} else {
									if (slot_type == m.atom_types.bang_medium
											&& slot_color >= 0) {
										m.gcc.drawImage(m[i_source],
											x_source, y_source,
											55, 47,
											x_position + 36, y_position + 6,
											43, 35);
									} else {
										m.gcc.drawImage(m[i_source],
											x_source, y_source,
											55, 47,
											x_position + 30, y_position,
											55, 47);
									}
								}
							}
							// Draw slot Move Counter
							if (slot_counter > -1) {
								if (slot_counter > 15) {
									slot_counter = 15;
								}
								x_source = (5 + slot_counter) * m.atom_width;
								y_source = 13 * m.atom_height;
								m.gcc.drawImage(m.atom_image,
									x_source, y_source,
									55, 47,
									x_position + 30, y_position,
									55, 47);
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
				*/
				var i; // Number: Increment Var
				var a; // Number: Increment Var
				var for_length; // Number: Loop limit
				var misc_play_disable; // Array: List of field to display play button
				// Init Function Values
				misc_play_disable = ['score_needed_1', 'score_needed_2', 
					'score_needed_3', 'moves_allowed', 'time_limit',
					'break_bonds', 'fill_nucleus', 'rid_antimatter',
					'clear_radio', 'clear_crystal'];
				// Init keymap
				for (i = 0; i < 256; i++) {
					m.keymap.push(0);   
				}
				// Get width, height, and context of canvas
				m.canvas_element = document.getElementById("gameCanvas");
				m.width = m.canvas_element.width;
				m.height = m.canvas_element.height;
				m.cc = m.canvas_element.getContext("2d");
				// Get width, height, and context of generator menu canvas
				m.canvas_generator = document.getElementById("generatorCanvas");   
				m.gen_width = m.canvas_generator.width;
				m.gen_height = m.canvas_generator.height;
				m.gcc = m.canvas_generator.getContext("2d");
				// Set BBE Font
				m.cc.font = "16px Century Gothic";
				m.gcc.font = "16px Century Gothic";
				// Load hex overlay
				m.back_image.onload = function () {
					BBE({
						com: 'loadedBack'
					});
				};
				m.back_image.src = 'img/' + m.back_file;
				// Load atom pieces
				m.atom_image.onload = function () {
					BBE({
						com: 'loadedAtom'
					});
				};
				m.atom_image.src = '../img/' + m.atom_file;
				// Set fall line offsets
				m.fall_x_offset[0] = Math.floor(m.atom_width * .25);
				m.fall_y_offset[0] = m.atom_height - 15;
				m.fall_x_offset[1] = Math.floor(m.atom_width * .5);
				m.fall_y_offset[1] = m.atom_height - 5;
				m.fall_x_offset[2] = Math.floor(m.atom_width * .75);
				m.fall_y_offset[2] = m.atom_height - 15;
				m.fall_x_offset[3] = Math.floor(m.atom_width * .75);
				m.fall_y_offset[3] = 15;
				m.fall_x_offset[4] = Math.floor(m.atom_width * .5);
				m.fall_y_offset[4] = 5;
				m.fall_x_offset[5] = Math.floor(m.atom_width * .25);
				m.fall_y_offset[5] = 15;
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
				// Init listeners if 2D context is present
				if (m.cc) {
					// Init mouse event listeners for the canvas
					m.canvas_element.addEventListener('mousedown', function(e) {
						BBE({
							com: 'mouseDown',
							evt: e
						});
					}, false);
					m.canvas_element.addEventListener('mousemove', function(e) {
						BBE({
							com: 'mouseMove',
							evt: e
						});
					}, false);
					m.canvas_element.addEventListener('mouseup', function(e) {
						BBE({
							com: 'mouseUp',
							evt: e
						});
					}, false);
					// Init mouse event listener for the generator canvas
					m.canvas_generator.addEventListener('mousemove',
						function(e) {
							BBE({
								com: 'generatorMove',
								evt: e
							}
						);
					}, false);
					document.getElementById("block_mouse").addEventListener(
						'mousemove', function(e) {
							BBE({
								com: 'generatorOutside',
								evt: e
							}
						);
					}, false);
					// Clear canvas for usage
					v.clearCanvas();
					// Start the event timer for 30 fps
					m.op_timer = setInterval(function () {
						BBE({
						   com: 'timerEvent'
						});
					}, 33.333);
					BBE({
						com: 'clearInputs'
					});
					// Start keyboard handlers
					window.onkeydown = function (e) {
						BBE({
							com: 'keyDown',
							evt: e
						});
					};
					window.onkeyup = function (e) {
						BBE({
							com: 'keyUp',
							evt: e
						});
					};
					// Deactivate Play Button on Change
					$('#background_filename').change(function () {
						BBE({
							com: 'disablePlayButton'
						});
					});
					for_length = m.atom_color_chars.length;
					for (i = 0; i < for_length; i++) {
						$('#color_' + m.atom_color_chars[i])
							.change(function () {
								BBE({
									com: 'disablePlayButton'
								});
							}
						);
						$('#match_' + m.atom_color_chars[i])
							.change(function () {
								BBE({
									com: 'disablePlayButton'
								});
							}
						);
					}
					for_length = m.types_prefixes.length;
					for (i = 0; i < for_length; i++) {
						$('#use_' + m.types_prefixes[i]).change(function () {
							BBE({
								com: 'disablePlayButton'
							});
						});
						$('#' + m.types_prefixes[i] + '_counts')
							.change(function () {
								BBE({
									com: 'disablePlayButton'
								}
							);
						});
						$('#' + m.types_prefixes[i] + '_percent')
							.change(function () {
								BBE({
									com: 'disablePlayButton'
								}
							);
						});
					}
					for_length = misc_play_disable.length;
					for (i = 0; i < for_length; i++) {
						$('#' + misc_play_disable[i]).change(function () {
							BBE({
								com: 'disablePlayButton'
							});
						});
					}
					$('#match_X').change(function () {
						BBE({
							com: 'disablePlayButton'
						});
					});
					for_length = m.combo_postfixes.length;
					for (i = 0; i < for_length; i++) {
						$('#match_' + m.combo_postfixes[i]).change(function () {
							BBE({
								com: 'disablePlayButton'
							});
						});
					}
					for (i = 0; i < for_length; i++) {
						for (a = i; a < for_length; a++) {
							$('#combo_' + m.combo_postfixes[i]
								+ m.combo_postfixes[a])
								.change(function () {
									BBE({
										com: 'disablePlayButton'
									});
								}
							);
						}
					}
					for (i = 1; i < 6; i++) {
						$('#compounds_' + i).change(function () {
							BBE({
								com: 'disablePlayButton'
							});
						});
						$('#compound_' + i).change(function () {
							BBE({
								com: 'disablePlayButton'
							});
						});
					}
					// Start editor interface button listeners
					$('#load_level').click(function () {
						BBE({
							com: 'click_load_level'
						});
					});
					$('#save_level').click(function () {
						BBE({
							com: 'click_save_level'
						});
					});
					$('#load_background').click(function () {
						BBE({
							com: 'click_load_background'
						});
					});
					$('#clear_background').click(function () {
						BBE({
							com: 'unloadBackground'
						});
					});
					$('#grid_button').click(function () {
						BBE({
							com: 'toggleGrid' 
						}); 
					});
					$('#help_button').click(function () {
						BBE({
							com: 'toggleHelp' 
						}); 
					});
					$('#play_button').click(function () {
						BBE({
							com: 'testPlayLevel' 
						}); 
					});
					$('#copy_button').click(function () {
						BBE({
							com: 'copyGenerator' 
						}); 
					});
					$('#paste_button').click(function () {
						BBE({
							com: 'pasteGenerator' 
						}); 
					});
					$('#clear_button').click(function () {
						BBE({
							com: 'clearGenerator' 
						}); 
					});
					$('#done_button').click(function () {
						BBE({
							com: 'doneGenerator' 
						}); 
					});
					$('#cancel_button').click(function () {
						BBE({
							com: 'cancelGenerator' 
						}); 
					});
					return true;
				}
				return false;
			},
			toggleGrid: function (com) {
				/*
					Toggles the display of the placement grid
				*/
				if ($("#grid_button" ).hasClass("btn-inverse")) {
					$("#grid_button" ).removeClass("btn-inverse");
					$("#grid_button" ).addClass("btn-info");
					m.display_hex = false;
				} else {
					$("#grid_button" ).addClass("btn-inverse");
					$("#grid_button" ).removeClass("btn-info");
					m.display_hex = true;
				}
			},
			toggleHelp: function (com) {
				/*
					Toggles the display of user help
				*/
				if ($("#help_button").hasClass("btn-inverse")) {
					$("#help_button").removeClass("btn-inverse");
					$("#help_button").addClass("btn-info");
					$(".edit_pane").show();
					$(".help_pane").hide();
				} else {
					$("#help_button").addClass("btn-inverse");
					$("#help_button").removeClass("btn-info");
					$(".edit_pane").hide();
					$(".help_pane").show();
				}
			},
			testPlayLevel: function (com) {
				/*
					Saves cookie with level name for test
					playing 
				*/
				var exdate; // Date: Expiration date
				var c_value; // String: Name of the level to test play
				// Check to see if the button is active
				if ($('#play_button').hasClass('btn-success')) {
					exdate = new Date();
					exdate.setDate(exdate.getDate() + 1);
					c_value = escape($('#level_id').val()) + "; expires=" + exdate.toUTCString()+ "; domain=.hexplanet.com; path=/dev/big_bang/;";
					document.cookie = "bbe_level_name=" + c_value;
					window.open('../game.php', 'bigBangTest');
				}
			},
			clearInputs: function (com) {
				/*
					Clears all editor input fields and checkboxes
				*/
				var atom_colors; // String: Characters of atom colors
				var match_inputs; // Array: Characters of matches
				var combo_inputs; // Array: Characters of combos
				var total_compounds; // Number: Total number of compounds that can be set
				var for_length; // Number: Length of colors to be looped through
				var i; // Number: Increment Var
				// Init default function values
				atom_colors = 'rpbcovywt';
				match_inputs = ['r', 'p', 'b', 'c', 'o', 'v', 'y', 'w', 't',
					'4C', '5', '5C', '6', '6C', '7', 'X'];
				combo_inputs = ['4C4C', '4C5', '4C5C', '4C6', '4C6C', '4C7',
					'55', '55C', '56', '56C', '57', '5C5C', '5C6', '5C6C',
					'5C7', '66', '66C', '67', '6C6C', '6C7', '77'];
				total_compounds = 5;
				// Clear editor fields
				$("#level_id").val("");
				$("#background_filename").val("");
				$("#score_needed_1").val("");
				$("#score_needed_2").val("");
				$("#score_needed_3").val("");
				$("#time_limit").val("");
				$("#break_bonds").val("");
				$("#fill_nucleus").val("");
				$("#moves_allowed").val("");
				$("#hole_counts").val("");
				$("#anti_counts").val("");
				$("#radio_counts").val("");
				$("#void_counts").val("");
				$("#freeze_counts").val("");
				$("#hole_percent").val("");
				$("#anti_percent").val("");
				$("#radio_percent").val("");
				$("#void_percent").val("");
				$("#freeze_percent").val("");
				$("#rid_antimatter").val("");
				for_length = match_inputs.length;
				for (i = 0; i < for_length; i++) {
					$("#match_" + match_inputs[i]).val("");
				}
				for_length = combo_inputs.length;
				for (i = 0; i < for_length; i++) {
					$("#combo_" + combo_inputs[i]).val("");
				}
				for (i = 1; i <= total_compounds; i++) {
					$("#compounds_" + i).val("");
					$("#compound_" + i).val("");
				}
				// Clear editor checkboxes
				for_length = atom_colors.length;
				for (i = 0; i < for_length; i++) {
					$("#color_" + atom_colors[i]).attr("checked", false);
				}
				$("#use_hole").attr("checked", false);
				$("#use_anti").attr("checked", false);
				$("#use_radio").attr("checked", false);
				$("#use_void").attr("checked", false);
				$("#use_freeze").attr("checked", false);
				$("#clear_radio").attr("checked", false);
				$("#clear_crystal").attr("checked", false);
			},
			openTab: function (com) {
				/*
					Opens a requirements body
				*/
				var i; // Number: Increment Var
				var requirements; // Number: Total number of requirement bodies
				var tab_name; // String: The current tab being checked
				requirements = m.requirement_tabs.length;
				for (i = 0; i < requirements; i++) {
					tab_name = m.requirement_tabs[i];
					if (tab_name == com.tab
							&& !($('#' + tab_name + '_body').is(':visible'))) {
						$('#' + tab_name + '_body').show();
						$('#' + tab_name + '_tab span')
							.removeClass('icon-folder-close');
						$('#' + tab_name + '_tab span')
							.addClass('icon-folder-open');
					} else {
						$('#' + tab_name + '_body').hide();
						$('#' + tab_name + '_tab span')
							.removeClass('icon-folder-open');
						$('#' + tab_name + '_tab span')
							.addClass('icon-folder-close');
					}
				}
			},
			loadedBack: function (com) {
				/*
					Sets the loaded flag to true for hex overlay
				*/
				m.back_loaded = true;
				// Use loaded graphic to build the default Generator Canvas
				v.initGeneratorCanvas();
			},
			loadedAtom: function (com) {
				/*
					Sets the loaded flag to true for atom pieces
				*/
				m.atom_loaded = true;
				// Set default atoms
				t.controller.defaultAtoms({});
				// Show editor pane
				$(".edit_pane").show();
				// Show game board
				$(".canvasArea").show();
				// Show interface around grid
				$(".grid_toggle").show();
				$(".user_help").show();
				$("#play_button").removeClass('btn-success');
				$("#play_button").addClass('btn-inverse');
				$(".test_play").show();
			},
			loadBackground: function (com) {
				/*
					Starts the loading of the background or launches popup if input is empty
				*/
				m.bg_image.onload = function () {
					BBE({
						com: 'loadedBackground'
					});
				};
				m.bg_image.onerror = function () {
					BBE({
						com: 'errorBackground'
					});
				};
				m.bg_image.src = '../img/backgrounds/' + m.bg_file;
			},
			unloadBackground: function (com) {
				/*
					Clears the background vars
				*/
				m.bg_loaded = false;
				m.bg_file = '';
				m.bg_image = new Image();
				$("#background_filename").val('');
				$("#background_filename").addClass('normalText');
				$("#background_filename").removeClass('errorText');
			},
			loadedBackground: function (com) {
				/*
					Sets the loaded flag to true for background
				*/
				m.bg_loaded = true;
				$("#background_filename").removeClass('normalText');
				$("#background_filename").removeClass('errorText');
				$("#background_filename").addClass('successText');
			},
			errorBackground: function (com) {
				/*
					Sets the loaded flag to false for background
					and sets the text to the error class
				*/
				m.bg_loaded = false;
				m.bg_file = '';
				$("#background_filename").addClass('errorText');
				$("#background_filename").removeClass('normalText');
			},
			click_load_background: function (com) {
				/*
					Sets the loaded flag to true for background
				*/
				if ($("#background_filename").val() !== "") {
					if ($("#background_filename").val().toLowerCase().indexOf(".jpg") > -1) {
						m.bg_file = $("#background_filename").val();
						BBE({
							com: 'loadBackground'
						});
					} else {
						// filename isn't .jpg thus show error class
						$("#background_filename").addClass('errorText');
						$("#background_filename").removeClass('normalText');   
					}
				} else {
					t.controller.openBackgroundBrowseWindow();
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
						com.usage_mode = 'editor';
						com.gm = m;
						m.atoms['atom_' + atom_num] = new ATOM(com);
						atom_num = atom_num + 1;
					}
				}
				BBE({
					com: 'setNeighbors' 
				});
			},
			setNeighbors: function (com) {
				/*
					Set the neighboring hexes for a all hexes
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
			checkNudgeInterface: function (com) {
				/*
					Returns the direction index of the mouse posiiton
					on the nudge interface
					
					Arguments
					com.x: X mouse position
					com.y: Y mouse position
					
					Returns:
					hex direction index
				*/
				var direction_index; // Number: Hex direction index of interface
				var x_center; // Number: X center of the nudge interface
				var y_center; // Number: Y center of the nudge interface
				var x_delta; // Number: X difference between mouse and center
				var y_delta; // Number: Y difference between mouse and center
				var radius; // Number: Radius of the interface from the center
				var mouse_dist; // Number: Distance away from center of mouse
				var mouse_angle; // Number: Angle of mouse delta
				// Defaults to no direction (-1)
				direction_index = -1;
				// Set location of the nudge interface
				x_center = 728;
				y_center = 626;
				radius = 22;
				// Calculate distance and angle
				x_delta = com.x - x_center;
				y_delta = com.y - y_center;
				mouse_dist = Math.sqrt((x_delta * x_delta) + (y_delta * y_delta));
				// Proceed if distance less than radius
				if (mouse_dist < radius) {
					mouse_angle = BBE({
						com: 'getAngle',
						x1: x_center, 
						y1: y_center, 
						x2: com.x, 
						y2: com.y 
					});
					direction_index = 5 - Math.floor((mouse_angle + 180) / 60);
					direction_index = (direction_index + 6) % 6;
				}
				return direction_index;
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
			checkNudge: function (com) {
				/*
					Check if the grid can be nudged in all
					six directions. Execute the nudge if 
					the execute flag is set.
				*/
				var d; // Number: Increment var for hex direction
				var atom_id; // String: The id for a given atom
				var is_legal; // Number: Is the nudge legal? T/F = 1/0
				var neighbor; // String: Atom id of a given neighbor
				var has_content; // Boolean: Atom has content
				var teleporter_id; // String: Atom id pointed at by teleporter
				var fall_ids; // Array: 3 directions of possible atom fall
				var i; // Number: Increment var
				var distant_neighbor; // String: Atom id of a linked neighbor
				// Check six hex directions for global nudge
				for (d = 0; d < 6; d ++) {
					is_legal = 1;
					// Check each atom for neighbors
					for (atom_id in m.atoms) {
						if (m.atoms.hasOwnProperty(atom_id)) {
							neighbor = m.atoms[atom_id].controller.getNeighbor({
								direction: d
							});
							if (neighbor == "") {
								// No neighbor, check for content
								has_content = BBE({
									com: 'atomContent',
									atom_id: atom_id
								});
								if (has_content == true) {
									// atom has content, nudge isn't legal
									is_legal = 0;
									break;
								}
							} else {
								teleporter_id = m.atoms[atom_id].controller
									.getTeleporter();
								if (teleporter_id != '') {
									distant_neighbor = m.atoms[teleporter_id]
										.controller.getNeighbor({
											direction: d
										});
									if (distant_neighbor == '') {
										is_legal = 0;
										break;
									}
								}
								fall_ids = m.atoms[atom_id].controller
									.getFall();
								for (i = 0; i < 3; i++) {
									if (fall_ids[i] != '') {
										distant_neighbor =
											m.atoms[fall_ids[i]]
											.controller.getNeighbor({
												direction: d
											});
										if (distant_neighbor == '') {
											is_legal = 0;
											break;
										} 
									}   
								}
							}
						}
					}
					m.nudge_dir[d] = is_legal;
				}
			},
			executeNudge: function (com) {
				/*
					Executes the nudging of the whole grid
					in a given direction
					
					Arguments:
					com.direction: The hex direction index to nudge towards
				*/
				var atom_id; // String: The id for a given atom
				var next_ids; // Array: Next group of atom ids to be switched
				var switch_length; // Number: Length of the switch array
				var switch_ids; // Array: List of atom ids to be switched
				var mirror_dir; // Number: Hex direction index of mirrored dir
				var neighbor; // String: Atom id of a given neighbor
				var i; // Number: Increment Var
				// Init funciton values
				mirror_dir = m.direction_mirror[com.direction];
				switch_ids = [];
				next_ids = [];
				// Error check on direction
				if (com.direction >-1 && com.direction < 6) {
					// Continue if nudge is legal
					if (m.nudge_dir[com.direction] == 1) {
						// Gather all starting atoms
						for (atom_id in m.atoms) {
							if (m.atoms.hasOwnProperty(atom_id)) {
								neighbor = m.atoms[atom_id].controller
									.getNeighbor({
										direction: com.direction
									});
								if (neighbor == "") {
									next_ids.push(atom_id);
								}
							}
						}
						// Execute atom movement while hexes remain
						while (next_ids.length > 0) {
							switch_ids = [];
							switch_length = next_ids.length;
							for (i = 0; i < switch_length; i++) {
								switch_ids.push(next_ids[i]);
							}
							next_ids = [];
							for (i = 0; i < switch_length; i++) {
								neighbor = m.atoms[switch_ids[i]].controller
									.getNeighbor({
										direction: mirror_dir
									});
								if (neighbor == '') {
								   m.atoms[switch_ids[i]].controller.clearAtom();
								} else {
									next_ids.push(neighbor);
									BBE({
										com: 'pushAtom',
										from: neighbor,
										to: switch_ids[i],
										direction: com.direction
									});
								}
							}
						}
					}
					BBE({
						com: 'disablePlayButton'
					});
					BBE({
						com: 'checkNudge' 
					});
				} else {
					BBE({
						com: 'consoleError',
						method_name: 'executeNudge',
						error: 'direction out of range',
						error_value: com.direction
					});
				} 
			},
			pushAtom: function (com) {
				/*
					Push an atom on top of another while
					changing user set linking ids
					
					Arguments
					com.from: Source atom id
					com.to: Target atom id
					com.direction: Hex direction index of the push
				*/
				var args_okay; // Boolean: Are the arguments inside of bounds
				var neighbor; // String: Atom id of a given neighboring atom
				var new_neighbor; // String: Atom id of neighbor plus direction
				var bonds; // Array: Bonds of the pushed atom
				var falls; // Array: Falls of the pushed atom
				var i; // Number: Increment Var
				args_okay = true;
				// Tests on incoming values
				if (com.direction <0 || com.direction > 5) {
					args_okay = false;
					BBE({
						com: 'consoleError',
						method_name: 'pushAtom',
						error: 'direction out of range',
						error_value: com.direction
					}); 
				}
				if (com.from == '') {
					args_okay = false;
					BBE({
						com: 'consoleError',
						method_name: 'pushAtom',
						error: 'source atom is blank',
						error_value: ''
					}); 
				}
				if (com.to == '') {
					args_okay = false;
					BBE({
						com: 'consoleError',
						method_name: 'pushAtom',
						error: 'target atom is blank',
						error_value: ''
					});
				}
				// Push Atom
				if (args_okay == true) {
					// Copy data to target atom
					m.atoms[com.from].controller.copyAtom({
						atom_id: com.to
					});
					// Set new teleporter id
					neighbor = m.atoms[com.to].controller.getTeleporter();
					if (neighbor != '') {
						new_neighbor = m.atoms[neighbor].controller
							.getNeighbor({
								direction: com.direction 
							});
						m.atoms[com.to].controller.setTeleporter({
							atom_id: new_neighbor
						});
					}
					// Set new fall ids
					falls = m.atoms[com.to].controller.getFall();
					for (i = 0; i <3; i++) {
						neighbor = falls[i];
						if (neighbor != '') {
							new_neighbor = m.atoms[neighbor].controller
								.getNeighbor({
									direction: com.direction 
								});
							m.atoms[com.to].controller.setFall({
								direction: i,
								atom_id: new_neighbor
							});
						}
					}
					// Set new bond ids
					bonds = m.atoms[com.to].controller.getBonding();
					for (i = 0; i <6; i++) {
						neighbor = bonds[i];
						if (neighbor != '') {
							new_neighbor = m.atoms[neighbor].controller
								.getNeighbor({
									direction: com.direction 
								});
							m.atoms[com.to].controller.setBonding({
								direction: i,
								atom_id: new_neighbor
							});
						}
					}
				}
			},
			switchAtoms: function (com) {
				/*
					Switch just the atom in the hex between two
					positions
					
					Arguments
					com.first_atom: atom_id of the first atom
					com.second_atom: atom_id of the second atom
				*/
				var args_okay; // Boolean: Are the arguments inside of bounds
				var hold_type; // String: Store type until needed
				var hold_color; // String: Store type until needed
				var hold_moves; // Number: Store moves until needed
				var hold_shield; // Boolean: Store shield until needed
				args_okay = true;
				if (com.first_atom == '') {
					args_okay = false;
					BBE({
						com: 'consoleError',
						method_name: 'switchAtoms',
						error: 'first_atom is blank',
						error_value: ''
					});
				}
				if (com.second_atom == '') {
					args_okay = false;
					BBE({
						com: 'consoleError',
						method_name: 'switchAtoms',
						error: 'second_atom is blank',
						error_value: ''
					});
				}
				if (args_okay == true) {
					// Switch atoms: type, color, counter, and shield
					hold_type = m.atoms[com.first_atom].controller.getType();
					hold_color = m.atoms[com.first_atom].controller.getColor();
					hold_moves = m.atoms[com.first_atom].controller.getMoveCounter();
					hold_shield = m.atoms[com.first_atom].controller.getShield();
					m.atoms[com.first_atom].controller.setType({
						type: m.atoms[com.second_atom].controller.getType()
					});
					m.atoms[com.first_atom].controller.setColor({
						color: m.atoms[com.second_atom].controller.getColor()
					});
					m.atoms[com.first_atom].controller.setMoveCounter({
						moves: m.atoms[com.second_atom].controller.getMoveCounter()
					});
					m.atoms[com.first_atom].controller.setShield({
						is_shielded: m.atoms[com.second_atom].controller.getShield()
					});
					m.atoms[com.second_atom].controller.setType({
						type: hold_type
					});
					m.atoms[com.second_atom].controller.setColor({
						color: hold_color
					});
					m.atoms[com.second_atom].controller.setMoveCounter({
						moves: hold_moves
					});
					m.atoms[com.second_atom].controller.setShield({
						is_shielded: hold_shield
					});
				}
			},
			atomContent: function (com) {
				/*
					Find if an atom has any content
					
					Arguments
					com.atom_id: The string id of the atom to check
					
					Return
					A boolean for if the atom has content
				*/
				var atom_fall; // Array: Fall atom ids for 3 directions
				var atom_bonds; // Array: Bond atom ids for 6 directions
				var d; // Number: Increment var for directions
				if (com.atom_id != '') {
					if (m.atoms[com.atom_id].controller.getType()
							> m.atom_types.empty) {
						return true;
					}
					if (m.atoms[com.atom_id].controller.getMoveCounter()
							> -1) {
						return true;           
					}
					if (m.atoms[com.atom_id].controller.getTeleporter() != '') {
						return true;
					}
					if (m.atoms[com.atom_id].controller.getAtomCreator()
							== true) {
						return true;
					}
					if (m.atoms[com.atom_id].controller.getEntryPoint()
							== true) {
						return true;
					}
					if (m.atoms[com.atom_id].controller.getExitPoint()
							== true) {
						return true;
					}
					if (m.atoms[com.atom_id].controller.getRadiation() > 0) {
						return true;
					}
					if (m.atoms[com.atom_id].controller.getShield() == true) {
						return true;
					}
					atom_fall = m.atoms[com.atom_id].controller.getFall();
					for (d = 0; d < 3; d++) {
						if (atom_fall[d] != '') {
							return true;
						}
					}
					atom_bonds = m.atoms[com.atom_id].controller.getBonding();
					for (d = 0; d < 6; d++) {
						if (atom_bonds[d] != '') {
							return true;
						}
					}
				} else {
					BBE({
						com: 'consoleError',
						method_name: 'atomContent',
						error: 'empty atom_id given',
						error_value: ''
					});
				}
				return false;
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
			getXYmouse: function (com) {
				/*
					Calculates and returns work area x and y
					positions based on mouse event
					
					Arguments
					com.e: The mouse event
				*/
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
			executeKeys: function (com) {
				/*
					Applies all held keys to the currently
					selected atom
				*/
				var atom_color; // Number: ENUM value of the atom color
				var atom_type; // Number: ENUM value of the atom type
				var i; // Number: Increment Var
				var current_type; // Number: ENUM value of the current type of atom
				var current_counter; // Number: Number of moves until atom triggers action
				var x_delta; // Number: x change in atom position from last cursor atom
				var y_delta; // Number: y change in atom position from last cursor atom
				var drops_colors = 'rpbcovywt'; // String: The drop color characters
				var colors = ''; // String: Colors that can be used
				var for_length = 0; // Number: Length of drops_colors
				var total_colors = 0; // Number: The length of colors
				var random_color = 0; // Number: Index of the random color
				if (m.cursor_id != "") {
					// Set default values for 
					atom_color = -2;
					atom_type = -2;
					// Check if notes mode is being toggled
					if (m.keymap[192] == 1) {
						if (m.shift_pressed == 1) {
							m.in_notes_mode = true;
							t.controller.createNote({
								x: m.atoms[m.cursor_id].controller.getX() + Math.round(m.atom_width / 2),
								y: m.atoms[m.cursor_id].controller.getY() + Math.round(m.atom_height / 2)
							});
						} else {
					    	m.in_notes_mode = !m.in_notes_mode;
						}
					}
					if (m.in_notes_mode) {
					    return;   
					}
					// Use keys 1 to 9 to set colors
					for (i = 49; i < 58; i++) {
						if (m.keymap[i] == 1) {
							if (m.shift_pressed == 1) {
								atom_type = m.atom_types.absorber + (i - 49);
								atom_color = m.atom_colors.void;
							} else {
								atom_color = i - 49;
							} 
						}
					}
					// X key to set atom to unused
					if (m.keymap[88] == 1) {
						atom_type = m.atom_types.unused;
						atom_color = m.atom_colors.void;
					}
					// Space bar to set empty atom
					if (m.keymap[32] == 1) {
						atom_type = m.atom_types.empty;
						atom_color = m.atom_colors.void;
					}
					// A key to set atom
					if (m.keymap[65] == 1) {
						atom_type = m.atom_types.atom;
					}
					// Z key to set random atom
					if (m.keymap[90] == 1) {
						if (m.shift_pressed == 1) {
						    current_type = m.atoms[m.cursor_id].controller.getType();
						    if (current_type > 0 && current_type < 5) {
    							colors = '';
    							for_length = drops_colors.length;
    							for (i = 0; i < for_length; i++) {
    								if ($('#color_' + drops_colors.substr(i, 1)).is(':checked')) {
    									colors = colors + drops_colors.substr(i, 1);
    								}
    							}
    							total_colors = colors.length;
    							if (total_colors == 1) {
    							    atom_color = drops_colors.indexOf(colors);
    							    atom_type = current_type;
    							} else {
    							    if (total_colors > 1) {
    							        random_color = t.controller.rnd({
    							           min: 0,
    							           max: total_colors
    							        });
    							        atom_color = drops_colors.indexOf(colors.substr(random_color, 1));
    							        atom_type = current_type;
    							    }   
    							}
    						}
						} else {
							atom_type = m.atom_types.random_atom;
							atom_color = m.atom_colors.void;
						}
					}
					// O key to set an atom generator
					if (m.keymap[79] == 1) {
						atom_type = m.atom_types.generator;
						atom_color = m.atom_colors.void; 
					}
					// R key to set radioactive atom
					if (m.keymap[82] == 1) {
						atom_type = m.atom_types.radioactive;
					}
					// H key to set black hole
					if (m.keymap[72] == 1) {
						atom_type = m.atom_types.blackhole;
					}
					// N key to set nucleus
					if (m.keymap[78] == 1) {
						atom_type = m.atom_types.nucleus;
					}
					// V key to set void
					if (m.keymap[86] == 1) {
						atom_type = m.atom_types.void;
						atom_color = m.atom_colors.void;
					}
					// M key to set anti-matter
					if (m.keymap[77] == 1) {
						atom_type = m.atom_types.antimatter;
						atom_color = m.atom_colors.void;
					}
					// C key to set crystal
					if (m.keymap[67] == 1) {
						atom_type = m.atom_types.crystal;
						atom_color = m.atom_colors.void;
					}
					// F key to set freeze
					if (m.keymap[70] == 1) {
						atom_type = m.atom_types.freeze;
					}
					// B key to set bond
					if (m.keymap[66] == 1) {
						current_type = m.atoms[m.cursor_id].controller.getType();
						if (current_type >= m.atom_types.bond_vert && 
								current_type <= m.atom_types.bond_backslash) {
							current_type = current_type + 1;
							if (current_type > m.atom_types.bond_backslash) {
								current_type = m.atom_types.bond_vert;
							}
							atom_type = current_type;
						} else {
							atom_type = m.atom_types.bond_vert;
							atom_color = m.atom_colors.void;
						}
					}                    
					// \ key to set and toggle power-ups
					if (m.keymap[220] == 1) {
						current_type = m.atoms[m.cursor_id].controller.getType();
						if (current_type >= m.atom_types.bang_slash && 
								current_type <= m.atom_types.bang_full) {
							current_type = current_type + 1;
							if (current_type > m.atom_types.bang_full) {
								current_type = m.atom_types.bang_slash;
							}
							atom_type = current_type;
						} else {
							atom_type = m.atom_types.bang_slash;
						}
						if (m.atoms[m.cursor_id].controller.getColor() == m.atom_colors.void) {
							atom_color = m.atom_colors.red;
						}
					}
					// ENTER key to set big bang power-up
					if (m.keymap[13] == 1) {
						atom_type = m.atom_types.big_bang;
						atom_color = m.atom_colors.void;
					}
					// Q key clears a hex of entrance and exit points
					if (m.keymap[81] == 1) {
						m.atoms[m.cursor_id].controller.setEntryPoint({
							is_entry: false
						});
						m.atoms[m.cursor_id].controller.setExitPoint({
							is_exit: false
						});
					}                    
					// E key sets a hex as an entrance point
					if (m.keymap[69] == 1) {
						m.atoms[m.cursor_id].controller.setEntryPoint({
							is_entry: true
						});
					}
					// W key sets a hex as an exit point
					if (m.keymap[87] == 1) {
						m.atoms[m.cursor_id].controller.setExitPoint({
							is_exit: true
						});
					}
					// D key removes shielding from an atom
					if (m.keymap[68] == 1) {
						m.atoms[m.cursor_id].controller.setShield({
							is_shielded: false
						});
					}
					// S key adds shielding to an atom
					if (m.keymap[83] == 1) {
						m.atoms[m.cursor_id].controller.setShield({
							is_shielded: true
						});
					}
					// U key removes start fog
					if (m.keymap[85] == 1) {
						m.atoms[m.cursor_id].controller.setFogged({
							fog: false
						});
					}
					// I key adds start fog
					if (m.keymap[73] == 1) {
						m.atoms[m.cursor_id].controller.setFogged({
							fog: true
						});
					}
					// P key removes radiation from a hex
					if (m.keymap[80] == 1) {
						m.atoms[m.cursor_id].controller.setRadiation({
							level: 0
						});
					}
					// [ key gives a hex radiation
					if (m.keymap[219] == 1) {
						m.atoms[m.cursor_id].controller.setRadiation({
							level: 1
						});
					}
					// ] key makes a hex radioactive
					if (m.keymap[221] == 1) {
						m.atoms[m.cursor_id].controller.setRadiation({
							level: 2
						});
					}
					// Less than key to clear atom creator
					if (m.keymap[188] == 1) {
						if (m.shift_pressed == 1) {
							if (m.atoms[m.cursor_id].controller.getAtomCreator()
									== true) {
								if (m.generators[m.cursor_id]) {
									delete m.generators[m.cursor_id];
								}
							}
						} else {
							m.atoms[m.cursor_id].controller.setAtomCreator({
								is_creator: false
							});
						}
					}
					// Greater than key to set atom creator
					if (m.keymap[190] == 1) {
						if (m.shift_pressed == 1) {
							m.atoms[m.cursor_id].controller.setAtomCreator({
								is_creator: true
							});
							t.controller.initGeneratorMenu(m.cursor_id);
							return;
						} else {
							m.atoms[m.cursor_id].controller.setAtomCreator({
								is_creator: true
							});
						}
					}     
					// K + L key to remove/add linking
					if (m.keymap[76] == 1 || m.keymap[75] == 1) {
						if (m.cursor_id != "" && m.previous_cursor != "") {
							x_delta = m.atoms[m.cursor_id].controller.getX();
							x_delta = x_delta - m.atoms[m.previous_cursor]
								.controller.getX();
							y_delta = m.atoms[m.cursor_id].controller.getY();
							y_delta = y_delta - m.atoms[m.previous_cursor]
								.controller.getY();
							for (i = 0; i < 6; i++) {
								if (x_delta == m.bonding_positions[i + i] &&
										y_delta == m.bonding_positions[i + i + 1]) {
									if (m.keymap[75] == 1) {
										m.atoms[m.cursor_id].controller.setBonding({
												direction: m.direction_mirror[i],
												atom_id: ''
											}
										);
										m.atoms[m.previous_cursor].controller
											.setBonding({
												direction: i,
												atom_id: ''
											}
										);
									} else {
										m.atoms[m.cursor_id].controller
											.setBonding({
												direction: m.direction_mirror[i],
												atom_id: m.previous_cursor
											}
										);
										m.atoms[m.previous_cursor].controller
											.setBonding({
												direction: i,
												atom_id: m.cursor_id
											}
										);
									}
									break;    
								}
							}
						}
					}
					// - key to subtract a counter from an atom
					if (m.keymap[173] == 1 || m.keymap[189] == 1) {
						current_counter = m.atoms[m.previous_cursor]
							.controller.getMoveCounter();
						if (current_counter > -1) {
							current_counter = current_counter - 1;
							m.atoms[m.previous_cursor].controller
								.setMoveCounter({
									moves: current_counter
								});
						}
						// Clear keymap so - is only registered once
						m.keymap[173] = 0;
						m.keymap[189] = 0;
					}
					// + key to increment a counter from an atom
					if (m.keymap[61] == 1 || m.keymap[187] == 1) {
						current_counter = m.atoms[m.previous_cursor]
							.controller.getMoveCounter();
						current_counter = current_counter + 1;
						m.atoms[m.previous_cursor].controller.setMoveCounter({
							moves: current_counter
						});
						// Clear keymap so + is only registered once
						m.keymap[61] = 0;
						m.keymap[187] = 0;
					}
					// T key to set start point of teleporter
					if (m.keymap[84] == 1) {
						if (m.teleporter_down == '') {
							m.teleporter_down = m.cursor_id;
							// clear T key
							m.keymap[84] = 0;
						}
					}               
					// left arrow to set start point of teleporter
					if (m.keymap[37] == 1) {
						if (m.fall_down[0] == '') {
							m.fall_down[0] = m.cursor_id;
							// clear left arrow
							m.keymap[37] = 0;
						}
					}
					// down arrow to set start point of teleporter
					if (m.keymap[40] == 1) {
						if (m.fall_down[1] == '') {
							m.fall_down[1] = m.cursor_id;
							// clear down arrow
							m.keymap[40] = 0;
						}
					}
					// right arrow to set start point of teleporter
					if (m.keymap[39] == 1) {
						if (m.fall_down[2] == '') {
							m.fall_down[2] = m.cursor_id;
							// clear right arrow
							m.keymap[39] = 0;
						}
					}
					// Set color to red if no color set and no color present
					if (m.atoms[m.cursor_id].controller.getColor() == m.atom_colors.void) {
						switch (atom_type) {
							case m.atom_types.atom:
							case m.atom_types.radioactive:
							case m.atom_types.blackhole:
							case m.atom_types.nucleus:
							case m.atom_types.bang_slash:
							case m.atom_types.bang_vert:
							case m.atom_types.bang_backslash:
							case m.atom_types.bang_plasma:
							case m.atom_types.bang_small:
							case m.atom_types.bang_medium:
							case m.atom_types.bang_full:
							case m.atom_types.freeze:
								atom_color = m.atom_colors.red;
								break;
						}
					}
					// Set color and type of atom
					if (atom_color > -2) {
						m.atoms[m.cursor_id].controller.setColor({
							color: atom_color
						});
						if (m.atoms[m.cursor_id].controller.getType() < 1
								&& atom_type == -2) {
							atom_type = m.atom_types.atom;
						}
					}
					if (atom_type > -2) {
						m.atoms[m.cursor_id].controller.setType({
							type: atom_type
						});
						// Set the move counter for a new blackhole
						if (atom_type == m.atom_types.blackhole) {
							if (m.atoms[m.cursor_id].controller
									.getMoveCounter() == -1) {
								current_counter = Number($("#move_counts")
									.val());
								if (String(current_counter) == 'NaN' 
										|| current_counter < 1) {
									current_counter = 9; 
								} else {
									if (current_counter < -1) {
										current_counter = -1;
									}
									if (current_counter > 15) {
										current_counter = 15;
									}
								}
								m.atoms[m.cursor_id].controller.setMoveCounter({
									moves: current_counter
								});
							}
						}
						// Set the move counter for a new anti-matter
						if (atom_type == m.atom_types.antimatter) {
							if (m.atoms[m.cursor_id].controller
									.getMoveCounter() == -1) {
								if ($("#anti_counts").val() != '') {      
									current_counter = Number($("#anti_counts")
										.val());
									if (String(current_counter) != 'NaN')
									{
										if (current_counter < -1) {
											current_counter = -1;
										}
										if (current_counter > 15) {
											current_counter = 15;
										}
										m.atoms[m.cursor_id].controller
											.setMoveCounter({
												moves: current_counter
											});
									}
								}
							}
						}
						// Set the move counter for a new anti-matter
						if (atom_type == m.atom_types.radioactive) {
							if (m.atoms[m.cursor_id].controller
									.getMoveCounter() == -1) {
								if ($("#radio_counts").val() != '') {      
									current_counter = Number($("#radio_counts")
										.val());
									if (String(current_counter) != 'NaN')
									{
										if (current_counter < -1) {
											current_counter = -1;
										}
										if (current_counter > 15) {
											current_counter = 15;
										}
										m.atoms[m.cursor_id].controller
											.setMoveCounter({
												moves: current_counter
											});
									}
								}
							}
						}
					}
				}
			},
			enablePlayButton: function (com) {
				/*
					Enables the play button
				*/
				if ($("#play_button").hasClass('btn-inverse')) {
					$("#play_button").removeClass('btn-inverse');
					$("#play_button").addClass('btn-success');
				}
			},
			disablePlayButton: function (com) {
				/*
					Disables the play button and set the
					file text back to normal
				*/
				if ($("#play_button").hasClass('btn-success')) {
					$("#play_button").removeClass('btn-success');
					$("#play_button").addClass('btn-inverse');
					$("#level_id").removeClass('successText');
					$("#level_id").addClass('normalText');
				}
			},
			mouseDown: function (com) {
				/*
					Routes all mouse down events in the canvas element
					
					Arguments:
					com.evt: The mouse event
				*/
				var mouse_xy; // Object: Holds the work area position of the mouse click
				// Get Mouse Position on work area
				mouse_xy = BBE({
					com: "getXYmouse",
					e: com.evt
				});
				// Operate mouse down for notes mode
				if (m.in_notes_mode) {
					BBE({
						com: 'notesMouseDown',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
					return;	
				}
				if (m.menu_id == '') {
					// Game Grid
					// Read the nudge interface for mousedown inside of its hex
					m.nudge_down = BBE({
						com: 'checkNudgeInterface',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
					// Read the hex mouse downed on for atom switching
					m.hex_down = BBE({
						com: 'getAtom',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
				}
			},
			mouseMove: function (com) {
				/*
					Routes all mouse move events in the canvas element
					
					Arguments:
					com.evt: The mouse event
				*/
				var mouse_xy; // Object: Holds the work area position of the mouse click
				var atom_id; // String: Atom that cursor is over
				// Get Mouse Position on work area
				mouse_xy = BBE({
					com: "getXYmouse",
					e: com.evt
				});
				if (m.menu_id == '') {
					// Get current grid id
					m.cursor_id = BBE({
						com: 'getAtom',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
				}
				// Operate mouse move for notes mode
				if (m.in_notes_mode) {
					BBE({
						com: 'notesMouseMove',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
				}
			},
			mouseUp: function (com) {
				/*
					Routes all mouse up events in the canvas element
					
					Arguments:
					com.evt: The mouse event
				*/
				var mouse_xy; // Object: Holds the work area position of the mouse click
				var nudge_dir; // Number: Direction index of nudge interface
				var hex_up; // String: Atom id at the point of the mouse up
				// Get Mouse Position on work area
				mouse_xy = BBE({
					com: "getXYmouse",
					e: com.evt
				});
				// Operate mouse up for notes mode
				if (m.in_notes_mode) {
					BBE({
						com: 'notesMouseUp',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
					return;	
				}
				if (m.menu_id == '') {
					// Game Grid
					// Check for mouse up inside nudge interface
					nudge_dir = BBE({
						com: 'checkNudgeInterface',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
					// Execute nudge if mouse down and up match
					if (m.nudge_down == nudge_dir && nudge_dir != -1) {
						BBE({
							com: 'executeNudge',
							direction: nudge_dir 
						});   
					}
					// Execute switch atoms
					hex_up = BBE({
						com: 'getAtom',
						x: mouse_xy.x,
						y: mouse_xy.y
					});
					if (hex_up != '' && m.hex_down != '' && hex_up != m.hex_down) {
						BBE({
							com: 'switchAtoms',
							first_atom: hex_up,
							second_atom: m.hex_down
						});
						
					}
					// Reset atom switch mouse down
					m.hex_down = '';
					// Reset nudge interface mouse down
					m.nudge_down = -1;
				}
			},
			keyUp: function (com) {
				/*
					Executes a keyup event
					
					Arguments
					com.evt: The keyboard event
				*/
				var keycode; // Number: Key code from key event
				var note_text; // String: Value of the note_input input element
				keycode = com.evt.keyCode ? com.evt.keyCode : com.evt.which;
				if (keycode >=0 && keycode < 256) {
					m.keymap[keycode] = 0;
				} else {
					BBE({
						com: 'consoleError',
						method_name: 'keyUp',
						error: 'key code out of range',
						error_value: keycode
					});
				}
				// Feed note input if active
				if (m.note_action.area) {
				    if (m.note_action.area == "text") {
				        note_text = $(".note_input").val();
				        note_text = note_text.split(String.fromCharCode(13)).join("|");
				        m.game_notes[m.note_action.index].message = note_text;
				    }   
				}
				if (m.menu_id == '') {
					// Game Grid
					// Check for setting the exit atom for a teleporter
					if (keycode == 84 && m.teleporter_down != '') {
						if (m.cursor_id == '' || m.teleporter_down == m.cursor_id) {
							// clear teleporter
							m.atoms[m.teleporter_down].controller.setTeleporter({
								atom_id: ''
							});
						} else {
							// Set other end of teleporter
							m.atoms[m.teleporter_down].controller.setTeleporter({
								atom_id: m.cursor_id
							});
						}
					}
					// Check for setting the exit atom for left fall
					if (keycode == 37 && m.fall_down[0] != '') {
						if (m.cursor_id == '' || m.fall_down[0] == m.cursor_id) {
							// clear teleporter
							m.atoms[m.fall_down[0]].controller.setFall({
								direction: 0,
								atom_id: ''
							});
						} else {
							// Set other end of teleporter
							m.atoms[m.fall_down[0]].controller.setFall({
								direction: 0,
								atom_id: m.cursor_id
							});
						}
					}
					// Check for setting the exit atom for fall
					if (keycode == 40 && m.fall_down[1] != '') {
						if (m.cursor_id == '' || m.fall_down[1] == m.cursor_id) {
							// clear teleporter
							m.atoms[m.fall_down[1]].controller.setFall({
								direction: 1,
								atom_id: ''
							});
						} else {
							// Set other end of teleporter
							m.atoms[m.fall_down[1]].controller.setFall({
								direction: 1,
								atom_id: m.cursor_id
							});
						}
					}
					// Check for setting the exit atom for fall
					if (keycode == 39 && m.fall_down[2] != '') {
						if (m.cursor_id == '' || m.fall_down[2] == m.cursor_id) {
							// clear teleporter
							m.atoms[m.fall_down[2]].controller.setFall({
								direction: 2,
								atom_id: ''
							});
						} else {
							// Set other end of teleporter
							m.atoms[m.fall_down[2]].controller.setFall({
								direction: 2,
								atom_id: m.cursor_id
							});
						}
					}
					BBE({
						com: 'resetFileField'
					});
					BBE({
						com: 'resetBackgroundField'
					});
					m.fall_down = ['', '', ''];
					m.teleporter_down = '';
					BBE({
						com: 'checkNudge'
					});
				}
			},
			keyDown: function (com) {
				/*
					Executes a keydown event
					
					Arguments
					com.evt: The keyboard event
				*/
				var keycode; // Number: Key code from key event
				keycode = com.evt.keyCode ? com.evt.keyCode : com.evt.which;
				m.shift_pressed = com.evt.shiftKey;
				if (m.menu_id == '') {
					// Game Grid
					if (keycode >=0 && keycode < 256) {
						t.controller.disablePlayButton({});
						m.keymap[keycode] = 1;
						BBE({
							com: 'executeKeys'
						});
					} else {
						BBE({
							com: 'consoleError',
							method_name: 'keyDown',
							error: 'key code out of range',
							error_value: keycode
						});
					}
				} else {
					// Generator Menu
					if (keycode >=0 && keycode < 256) {
						t.controller.disablePlayButton({});
						m.keymap[keycode] = 1;
						BBE({
							com: 'generatorKey'
						});
					}
				}
			},
			timerEvent: function (com) {
				/*
					Operates timed events at 30 fps
				*/
				// Update Game Grid Canvas
				v.updateCanvas();
				if (m.menu_id != '') {
					// Update Generator Menu Canvas
					v.updateGeneratorCanvas();
				}
			},
			generatorKey: function (com) {
				/*
					Execute the paint keys for atom generator
				*/
				var drop_index; // Number: Index into the atoms list for drop_id
				var i; // Number: Increment Var
				var total_slots; // Number: Number of drop slots on list
				var current_counter; // Number: Current move counter value
				var current_type; // Number: ENUM atom type value
				var color_check; // Boolean: Should color be checked for -2 value?
				if (m.drop_id > -1) {
					total_slots = m.gen_edit.atoms.length / 3;
					if (m.drop_id < total_slots) {
						// Init function values
						color_check = false;
						drop_index = m.drop_id * 3;
						// Check for color keys
						for (i = 49; i < 58; i++) {
							if (m.keymap[i] == 1) {
								m.gen_edit.atoms[drop_index + 1] = i - 49;
								if (m.gen_edit.atoms[drop_index] == 0) {
									m.gen_edit.atoms[drop_index] 
										= m.atom_types.atom;
								}
							}
						}
						// Z key to set random color
						if (m.keymap[90] == 1) {
							m.gen_edit.atoms[drop_index + 1] = -1;
							if (m.gen_edit.atoms[drop_index] == 0) {
								m.gen_edit.atoms[drop_index] 
									= m.atom_types.atom;
							}
						}
						// - key to subtract from move counter
						if (m.keymap[173] == 1 || m.keymap[189] == 1) {
							current_counter = m.gen_edit.atoms[drop_index + 2];
							if (current_counter > -1) {
								current_counter = current_counter - 1;
								m.gen_edit.atoms[drop_index + 2]
									= current_counter;
							}
							// Clear keymap so - is only registered once
							m.keymap[173] = 0;
							m.keymap[189] = 0;
						}
						// + key to increment move counter
						if (m.keymap[61] == 1 || m.keymap[187] == 1) {
							current_counter = m.gen_edit.atoms[drop_index + 2];
							current_counter = current_counter + 1;
							m.gen_edit.atoms[drop_index + 2]
								= current_counter;
							// Clear keymap so + is only registered once
							m.keymap[61] = 0;
							m.keymap[187] = 0;
						}
						// A key to set atom
						if (m.keymap[65] == 1) {
							m.gen_edit.atoms[drop_index] = m.atom_types.atom;
							color_check = true;
						}
						// R key to set radioactive atom
						if (m.keymap[82] == 1) {
							m.gen_edit.atoms[drop_index]
								= m.atom_types.radioactive;
							color_check = true;
						}
						// H key to set black hole
						if (m.keymap[72] == 1) {
							m.gen_edit.atoms[drop_index]
								= m.atom_types.blackhole;
							color_check = true;
						}
						// F key to set freeze
						if (m.keymap[70] == 1) {
							m.gen_edit.atoms[drop_index] = m.atom_types.freeze;
							color_check = true;
						}
						// V key to set void
						if (m.keymap[86] == 1) {
							m.gen_edit.atoms[drop_index] = m.atom_types.void;
						}
						// M key to set anti-matter
						if (m.keymap[77] == 1) {
							m.gen_edit.atoms[drop_index]
								= m.atom_types.antimatter;
						}
						// \ key to set and toggle power-ups
						if (m.keymap[220] == 1) {
							current_type = m.gen_edit.atoms[drop_index];
							if (current_type >= m.atom_types.bang_slash && 
									current_type <= m.atom_types.bang_full) {
								current_type = current_type + 1;
								if (current_type > m.atom_types.bang_full) {
									current_type = m.atom_types.bang_slash;
								}
								m.gen_edit.atoms[drop_index] = current_type;
							} else {
								m.gen_edit.atoms[drop_index]
									= m.atom_types.bang_slash;
							}
							color_check = true;
						}
						// ENTER key to set big bang power-up
						if (m.keymap[13] == 1) {
							m.gen_edit.atoms[drop_index]
								= m.atom_types.big_bang;
						}
						// Set default random color if void color is present
						if (color_check == true) {
							if (m.gen_edit.atoms[drop_index + 1] == -2) {
								m.gen_edit.atoms[drop_index + 1] = -1;
							}
						}
						// Space bar to insert an atom
						if (m.keymap[32] == 1) {
							if (total_slots < m.max_drop_list) {
								// Insert Atom
								m.gen_edit.atoms.splice(drop_index, 0, 
									0, -2, -1);
							}
							// Clear keymap so space is only registered once
							m.keymap[32] = 0;
						}
						// X key to delete atom
						if (m.keymap[88] == 1) {
							if (m.drop_id != total_slots - 1) {
								m.gen_edit.atoms.splice(drop_index, 3);
							}
							// Clear keymap so X is only registered once
							m.keymap[88] = 0;
						} else {
							// Check for if append atom is needed
							if (total_slots < m.max_drop_list
									&& m.drop_id == total_slots - 1) {
								// Append Atom
								m.gen_edit.atoms.push(0);
								m.gen_edit.atoms.push(-2);
								m.gen_edit.atoms.push(-1);
							}
							switch (m.gen_edit.atoms[drop_index]) {
								case m.atom_types.big_bang:
									m.gen_edit.atoms[drop_index + 1] = -2;
									break;
							} 
						}
					}
				}
			},
			generatorMove: function (com) {
				/*
					Routes all mouse move events in the canvas element
					
					Arguments:
					com.evt: The mouse event
				*/
				var offset_object; // Object: Object to read the offset from
				var x_left; // Number: The left edge value of the canvas
				var y_top; // Number: The top edge value of the canvas         
				var x_position; // Number: X position of cursor on canvas
				var y_position; // Number: Y position of cursor on canvas
				offset_object = m.canvas_generator;
				y_top = 0;
				x_left = 0;
				while (offset_object && offset_object.tagName != 'body') {
					y_top = y_top + offset_object.offsetTop;
					x_left = x_left + offset_object.offsetLeft;
					offset_object = offset_object.offsetParent;
				}
				// Get x and y postion from the mouse event
				x_position = ((com.evt.clientX - x_left + window.pageXOffset)
					- 1) + $('.canvasContainer').scrollLeft();
				y_position = ((com.evt.clientY - y_top + window.pageYOffset)
					- 1) + $('.canvasContainer').scrollTop();
				m.drop_id = Math.floor(y_position / 47)
					+ (Math.floor(x_position / 85) * 5);
				
			},
			generatorOutside: function (com) {
				/*
					Mouse is outside the generator canvas,
					clear the index value
				*/
				var offset_object; // Object: Object to read the offset from
				var x_left; // Number: The left edge value of the canvas
				var y_top; // Number: The top edge value of the canvas         
				var x_position; // Number: X position of cursor on canvas
				var y_position; // Number: Y position of cursor on canvas
				offset_object = document.getElementById("block_mouse");
				y_top = 0;
				x_left = 0;
				while (offset_object && offset_object.tagName != 'body') {
					y_top = y_top + offset_object.offsetTop;
					x_left = x_left + offset_object.offsetLeft;
					offset_object = offset_object.offsetParent;
				}
				// Get x and y postion from the mouse event
				x_position = ((com.evt.clientX - x_left + window.pageXOffset)
					- 1);
				y_position = ((com.evt.clientY - y_top + window.pageYOffset)
					- 1);
				if (x_position < 10 || x_position >= 310 || y_position <40
						|| y_position >= 310) {
					m.drop_id = -1;
				}
			},
			initGeneratorMenu: function (com) {
				/*
					Start the display of the atom generator menu
				*/
				var for_length; // Number: Length of for loop
				var drops_colors; // String: Character codes for atom colors
				var colors; // String: Drop colors for the atom generator
				var drop_types; // Array: List of atoms types to drop
				var drop_value; // Number: Translated value from an input field
				var i; // Number: Increment Var
				var prop; // *: Property of the current atom generator
				// Init Function Values
				m.menu_id = m.cursor_id;
				m.cursor_id = '';
				drops_colors = 'rpbcovywt';
				drop_types = ['hole', 'anti', 'radio', 'void', 'freeze'];
				// Set Default Atom Generator Values
				if (!m.generators[m.menu_id]) {
					// Set generator values from general color and types
					m.gen_edit = {};
					// Set empty Drop List
					m.gen_edit.atoms = [0, -2, -1];
					// Set default colors to drop
					colors = '';
					for_length = drops_colors.length;
					for (i = 0; i < for_length; i++) {
						if ($('#color_' + drops_colors.substr(i, 1))
								.is(':checked')) {
							colors = colors + drops_colors.substr(i, 1);
						}
					}
					m.gen_edit.colors = colors;
					// Set default types to drop
					for_length = drop_types.length;
					for (i = 0; i < for_length; i++) {
						m.gen_edit[drop_types[i]] = {};
						if ($('#use_' + drop_types[i]).is(':checked')) {
							drop_value = Number($('#' + drop_types[i]
								+ '_percent').val());
							if (isNaN(drop_value)) {
								m.gen_edit[drop_types[i]].percent = 0;
								m.gen_edit[drop_types[i]].counter = -1;
							} else {
								m.gen_edit[drop_types[i]].percent
									= drop_value;
								drop_value = Number($('#' + drop_types[i]
									+ '_counts').val());
								if (isNaN(drop_value)) {
									m.gen_edit[drop_types[i]].counter = -1;
								} else {
									m.gen_edit[drop_types[i]]
										.counter = drop_value;
								}
							}
						} else {
							m.gen_edit[drop_types[i]].percent = 0;
							m.gen_edit[drop_types[i]].counter = -1;
						}
					}
				} else {
					m.gen_edit = {};
					// Copy each property to the edited atom generator
					for (prop in m.generators[m.menu_id]) {
						if (m.generators[m.menu_id].hasOwnProperty(prop)) {
							m.gen_edit[prop] = (m.generators[m.menu_id])[prop];
						}
					}
				}
				// Set Menu values from atom generator object
				t.controller.generatorInputs();
				$('.generator_menu').show();
				// Show help panel
				$(".edit_pane").hide();
				$(".help_pane").hide();
				$(".generator_pane").show();
			},
			generatorInputs: function (com) {
				/*
					Display the current atom generator edit
					values on the atom generator menu
				*/
				var for_length; // Number: Length of for loop
				var drops_colors; // String: Character codes for atom colors
				var colors; // String: Drop colors for the atom generator
				var drop_types; // Array: List of atoms types to drop
				var drop_value; // Number: Translated value from an input field
				var i; // Number: Increment Var
				var prop; // *: Property of the current atom generator
				drops_colors = 'rpbcovywt';
				drop_types = ['hole', 'anti', 'radio', 'void', 'freeze'];
				// Set the colors
				for_length = drops_colors.length;
				for (i = 0; i < for_length; i++) {
					$('#gen_color_' + drops_colors.substr(i, 1))
						.prop('checked', false);
				}
				for_length = m.gen_edit.colors.length;
				for (i = 0; i < for_length; i++) {
					$('#gen_color_' + m.gen_edit.colors.substr(i, 1))
						.prop('checked', true);
				}
				// Set the Types
				for_length = drop_types.length;
				for (i = 0; i < for_length; i++) {
					if (m.gen_edit[drop_types[i]].percent == 0 ) {
						$('#gen_use_' + drop_types[i]).prop('checked', false);
						$('#gen_' + drop_types[i] + '_counts').val('');
						$('#gen_' + drop_types[i] + '_percent').val('');
					} else {
						$('#gen_use_' + drop_types[i]).prop('checked', true);
						$('#gen_' + drop_types[i] + '_percent')
							.val(m.gen_edit[drop_types[i]].percent);
						if (m.gen_edit[drop_types[i]].counter > -1) {
							$('#gen_' + drop_types[i] + '_counts')
								.val(m.gen_edit[drop_types[i]].counter);
						} else {
							$('#gen_' + drop_types[i] + '_counts').val('');
						}    
					}
				}
			},
			copyGenerator: function(com) {
				/*
					Copies the current atom generator to a
					clipboard to be used in other hex slots
					and activates the paste button
				*/
				var prop; // *: Property of the current atom generate to be copied
				m.gen_clipboard = {};
				// Copy each property to the clipboard object
				for (prop in m.gen_edit) {
					if (m.gen_edit.hasOwnProperty(prop)) {
						m.gen_clipboard[prop] = m.gen_edit[prop];
					}
				}
				// Turn on paste button via class
				$('#paste_button').removeClass('btn-inverse');
				$('#paste_button').addClass('btn-info');
			},
			pasteGenerator: function(com) {
				/*
					Pastes the atom generator from the clipboard
					to the edited version
				*/
				if (m.gen_clipboard) {
					// Reset the edited version
					m.gen_edit = {};
					// Copy each property to the clipboard object
					for (prop in m.gen_clipboard) {
						if (m.gen_clipboard.hasOwnProperty(prop)) {
							m.gen_edit[prop] = m.gen_clipboard[prop];
						}
					}
					// Set Menu values from atom generator object
					t.controller.generatorInputs();
				}
			},
			clearGenerator: function(com) {
				/*
					Clears the currently edited atom generator
				*/
				// Clear drop colors
				m.gen_edit.colors = '';
				// Clear drop types
				m.gen_edit.hole.percent = 0;
				m.gen_edit.anti.percent = 0;
				m.gen_edit.radio.percent = 0;
				m.gen_edit.void.percent = 0;
				m.gen_edit.freeze.percent = 0;
				m.gen_edit.hole.counter = -1;
				m.gen_edit.anti.counter = -1;
				m.gen_edit.radio.counter = -1;
				m.gen_edit.void.counter = -1;
				m.gen_edit.freeze.counter = -1;
				// Set empty Drop List
				m.gen_edit.atoms = [0, -2, -1];
				// Set Menu values from atom generator object
				t.controller.generatorInputs();
			},
			doneGenerator: function(com) {
				/*
					Records all values in the current edited
					atom generator as the final values and
					disposes of the menu
				*/
				var color_codes; // String: Character codes for atom colors
				var drop_types; // Array: List of atoms types to drop
				var drop_value; // Number: Number value of an input field
				var for_length; // Number: Length of for loop
				var colors; // String: Drop color for atom generator
				var i; // Number: Increment Var
				// Init function values
				colors = '';
				color_codes = 'rpbcovywt';
				drop_types = ['hole', 'anti', 'radio', 'void', 'freeze'];
				// Set blank object to atom generator
				m.generators[m.menu_id] = {};
				// Assemble drop color string
				for_length = color_codes.length;
				for (i = 0; i < for_length; i++) {
					if ($('#gen_color_' + color_codes.substr(i, 1))
							.is(':checked')) {
						colors = colors + color_codes.substr(i, 1);
					}
				}
				m.generators[m.menu_id].colors = colors;
				// Set the atom types for Default Drop
				for_length = drop_types.length;
				for (i = 0; i < for_length; i++) {
					// Set default values to the drop type
					(m.generators[m.menu_id])[drop_types[i]] = {};
					(m.generators[m.menu_id])[drop_types[i]].percent = 0;
					(m.generators[m.menu_id])[drop_types[i]].counter = -1;
					if ($('#gen_use_' + drop_types[i]).is(':checked')) {
						drop_value = Number($('#gen_' + drop_types[i]
							+ '_percent').val());
						if (!isNaN(drop_value)) {
							if (drop_value > 0) {
								(m.generators[m.menu_id])
									[drop_types[i]].percent = drop_value;
								drop_value = Number($('#gen_' + drop_types[i]
									+ '_counts').val());
								if (!isNaN(drop_value)) {
									(m.generators[m.menu_id])
										[drop_types[i]].counter = drop_value;
								}
							}  
						}
					}
				}
				// Set the drop list
				m.generators[m.menu_id].atoms = m.gen_edit.atoms;
				// Close the Atom Generator Menu
				m.menu_id = '';
				$('.generator_menu').hide();
				$('.generator_pane').hide();
				// Reset help to original state
				t.controller.toggleHelp();
				t.controller.toggleHelp();
			},
			cancelGenerator: function(com) {
				/*
					Cancel and close the Atom Generator Menu
				*/
				m.menu_id = '';
				$('.generator_menu').hide();
				$('.generator_pane').hide();
				// Reset help to original state
				t.controller.toggleHelp();
				t.controller.toggleHelp();
			},
			createNote: function (com) {
				/*
					Create a new note object at a given location
					
					Arguments:
					com.x: The starting x-position of the new note
					com.y: The starting y-position of the new note
				*/
				var total_notes;
				var i;
				var note_obj;
				var new_note; 
				var note_left;
				var note_top;
				var note_width;
				var note_height;
				var note_inside = false;
				total_notes = m.game_notes.length;
				for (i = 0; i < total_notes; i++) {
					note_obj = m.game_notes[i];
					if (com.x + 20 >= note_obj.x && com.x < note_obj.x + note_obj.width) {
						if (com.y + 20 >= note_obj.y && com.y < note_obj.y + note_obj.height) {
							note_inside = true;
						}
					}
				}
				if (note_inside) {
					return;	
				}
				new_note = {};
				new_note.move = 0;
				new_note.duration = 1;
				new_note.x = com.x;
				new_note.y = com.y;
				if (new_note.y < 40) {
					new_note.y = 40;
				}
				new_note.width = 120;
				new_note.height = 120;
				new_note.x_pointer = new_note.x;
				new_note.y_pointer = new_note.y;
				new_note.message = "";
				m.game_notes.push(new_note);
			},
			notesMouseDown: function (com) {
				/*
					Operate mouse down for notes
					
					Arguments:
					com.x: The x position of the mousedown
					com.y: The y position of the mousedown
				*/
				var note_position = BBE({
					com: "findNotePostion",
					x: com.x,
					y: com.y
				});
				if (note_position.index == -1) {
					m.note_action = {};
					return;	
				}
				m.note_action.index = note_position.index;
				m.note_action.area = note_position.area;
				m.note_action.start_x = com.x;
				m.note_action.start_y = com.y;
				if (note_position.area == "resize") {
				    m.note_action.base_x = m.game_notes[m.note_action.index].x;
				    m.note_action.base_y = m.game_notes[m.note_action.index].y;
				    m.note_action.base_width = m.game_notes[m.note_action.index].width;
				    m.note_action.base_height = m.game_notes[m.note_action.index].height;
				}
			},
			notesMouseMove: function (com) {
				/*
					Operate mouse move for notes
					
					Arguments:
					com.x: The x position of the mousedown
					com.y: The y position of the mousedown
				*/
				var x_delta;
				var y_delta;
				var new_width;
				var new_height;
				if (String(m.note_action.index) == "undefined") {
					return;	
				}
				if (m.note_action.area == "pointer") {
				    m.game_notes[m.note_action.index].x_pointer = com.x;
					m.game_notes[m.note_action.index].y_pointer = com.y;
					return;
				}
				x_delta = com.x - m.note_action.start_x;
				y_delta = com.y - m.note_action.start_y;
				if (m.note_action.area == "move") {
					if (m.game_notes[m.note_action.index].x == m.game_notes[m.note_action.index].x_pointer) {
					    if (m.game_notes[m.note_action.index].y == m.game_notes[m.note_action.index].y_pointer) {
					        m.game_notes[m.note_action.index].x_pointer += x_delta;
					        m.game_notes[m.note_action.index].y_pointer += y_delta;
					    }  
					}
					m.game_notes[m.note_action.index].x += x_delta;
					m.game_notes[m.note_action.index].y += y_delta;
					m.note_action.start_x = com.x;
					m.note_action.start_y = com.y;
				}
				if (m.note_action.area == "resize") {
				    new_width = m.note_action.base_width + x_delta;
				    new_height = m.note_action.base_height + y_delta;
				    if (new_width < 80) {
				        x_delta = x_delta + (new_width - 80);
				        new_width = 80;
				    }
				    if (new_height < 80) {
				        y_delta = y_delta + (new_height - 80);
				        new_height = 80;
				    }
					if (m.game_notes[m.note_action.index].x == m.game_notes[m.note_action.index].x_pointer) {
					    if (m.game_notes[m.note_action.index].y == m.game_notes[m.note_action.index].y_pointer) {
					        m.game_notes[m.note_action.index].x_pointer = m.note_action.base_x + Math.round(x_delta / 2);
					        m.game_notes[m.note_action.index].y_pointer = m.note_action.base_y + Math.round(y_delta / 2);
					    }  
					}
					m.game_notes[m.note_action.index].x = m.note_action.base_x + Math.round(x_delta / 2);
					m.game_notes[m.note_action.index].y = m.note_action.base_y + Math.round(y_delta / 2);
					m.game_notes[m.note_action.index].width = new_width;
					m.game_notes[m.note_action.index].height = new_height;
				}
			},
			notesMouseUp: function (com) {
				/*
					Operate mouse down for notes
					
					Arguments:
					com.x: The x position of the mousedown
					com.y: The y position of the mousedown
				*/
				var note_position; // Object: Location of the mouse up
				var game_note;
	            var text_input_element;
	            var append_element;
				if (String(m.note_action.index) == "undefined") {
					return;	
				}
				if (m.note_action.area == "delete" || m.note_action.area == "text" || m.note_action.area == "pointer") {
					note_position = BBE({
						com: "findNotePostion",
						x: com.x,
						y: com.y
					});
					if (note_position.index > -1) {
						if (note_position.index == m.note_action.index) {
							if (m.note_action.area == note_position.area) {
							    if (m.note_action.area == "text") {
							        text_input_element = $(".note_input");
							        if (text_input_element.length > 0) {
							           $(".note_input").remove(); 
							        }
							        game_note = m.game_notes[m.note_action.index];
							        append_element = "<input class='note_input' style='width:100px;position:absolute;left:-99px;' value='" + game_note.message + "'/>";
							        $("body").append(append_element);
							        setTimeout(function () {
							            $(".note_input").focus();
							        }, 1);
							        return;
							    }
								if (m.note_action.area == "pointer") {
									game_note = m.game_notes[m.note_action.index];
									game_note.x_pointer = game_note.x;
									game_note.y_pointer = game_note.y;
								}
								if (m.note_action.area == "delete") {
									m.game_notes.splice(m.note_action.index, 1);
								}
							}
						}
					}
				}
				// Remove text input if present
				text_input_element = $(".note_input");
				if (text_input_element.length > 0) {
				    $(".note_input").remove();
                }
				// Clear note action for mouse up
				m.note_action = {};
			},
			findNotePostion: function (com) {
				/*
					Finds location on a note for a mousedown
					
					Arguments:
					com.x: The x position of the mousedown
					com.y: The y position of the mousedown
				
					Returns:
					An object with index and area of found note
				*/
				var found_position = {
					index: -1
				};
				var total_notes = m.game_notes.length;
				var game_note;
				var note_left;
				var note_top;
				var i;
				for (i = 0; i < total_notes; i++) {
					game_note = m.game_notes[i];
					note_left = game_note.x - Math.round(game_note.width / 2);
					note_top = game_note.y - Math.round(game_note.height / 2);
					if (com.x >= note_left + 40 && com.x < note_left + game_note.width - 40) {
						if (com.y >= note_top + 40 && com.y < note_top + game_note.height - 40) {
							found_position = {
								index: i,
								area: "text"
							};
							break;
						}
					}
					if (com.x >= note_left + 15 && com.x < note_left + 40) {
						if (com.y >= note_top + 15 && com.y < note_top + 40) {
							found_position = {
								index: i,
								area: "move"
							};
							break;
						}
						if (com.y >= note_top + game_note.height - 40 && com.y < note_top + game_note.height - 15) {
							found_position = {
								index: i,
								area: "pointer"
							};
							break;
						}
					}
					if (com.x >= note_left + game_note.width - 40 && com.x < note_left + game_note.width - 15) {
						if (com.y >= note_top + 15 && com.y < note_top + 40) {
							found_position = {
								index: i,
								area: "delete"
							};
							break;
						}
						if (com.y >= note_top + game_note.height - 40 && com.y < note_top + game_note.height - 15) {
							found_position = {
								index: i,
								area: "resize"
							};
							break;
						}
					}
				}
				return found_position;
			},
			click_load_level: function (com) {
				/*
					Execute Load of a saved Level
				*/
				var level_filename; // String: User selected filename
				var filename_length; // Number: The length of level_filename
				level_filename = $('#level_id').val();
				filename_length = level_filename.length;
				if (level_filename == '') {
					// Initiate file-browing popup
					t.controller.openLevelBrowseWindow();
				} else {
					// Add file extension if it is missing
					if (filename_length < 4) {
						level_filename = level_filename + '.txt';
						$('#level_id').val(level_filename);
					} else {
						if (level_filename.substr(filename_length - 4, 4)
								!= '.txt') {
							level_filename = level_filename + '.txt';
							$('#level_id').val(level_filename);    
						}
					}
					$.post("php/BBE_loadLevel.php", 
						{
							filename: level_filename
						},
						function (data, status) {
							if (status != 'success') {
								// Display filename field as error class
								$("#level_id").removeClass('normalText');
								$("#level_id").addClass('errorText');
							} else {
								// Set editor data from json and display level
								if (data == 'Illegal filename entered') {
									$("#level_id").removeClass('normalText');
									$("#level_id").addClass('errorText');
								} else {
									BBE({
										com: 'levelLoaded',
										json_data: data 
									});
								}
							}
						}
					);
				}
			},
			openLevelBrowseWindow: function (com) {
				/*
					Opens browser popup / loads files
				*/
				var popup_div = document.getElementById("browsePopup");
				var popup_html;
				$('#popupBlocker').css("display", "block");
				$('#browsePopup').css({"display": "block", "left": "200px", "top": "100px", "width": "355px", "height": "450px", "background-color": "#FFFFCC", "border-radius": "5px"});
				popup_html = "<div id='popupScrollable' style='position:relative;left:30px;top:30px;width:295px;height:350px;overflow-y:auto;background-color:#FFFFFF;border:1px solid #000000;'><p style='padding-left:118px;padding-top:10px;font-size:12px;font-family:verdana;'>Loading...</p></div>"
				popup_html = popup_html + "<button onclick='";
				popup_html = popup_html + "' id='browseSelectBtn' class='btn btn-inverse' style='position:relative;top:50px;left:92px;'>SELECT</button>";
				popup_html = popup_html + "<button onclick='BBE({com: ";
				popup_html = popup_html + '"closeBrowseWindow"})';
				popup_html = popup_html + "' class='btn btn-danger' style='position:relative;top:50px;left:102px;'>CLOSE</button>";
				popup_div.innerHTML = popup_html;
				$.ajax({
					url: "php/BBE_retrieveLevels.php",
					type: "GET",
					success:
						function (filenames) {
							var filenames_parsed;
							var table_data = "";
							var i;
							filenames_parsed = filenames.split("<?*>");
							filenames_parsed.pop();
							filenames_parsed = filenames_parsed.sort();
							for (i = 0; i < filenames_parsed.length; i++) {
								table_data = table_data + "<tr><td class='popupFilename' onclick='BBE ({com: ";
								table_data = table_data + '"selectLevelPopupFile", filename: "' + filenames_parsed[i] + '"})';
								table_data = table_data + "'>" + filenames_parsed[i] + "</td></tr>";
							}
							document.getElementById("popupScrollable").innerHTML = "<table style='width:100%'><tbody id='popupFilenameList'>" + table_data + "</tbody></table>";
						},
					error:
						function (error) {
							console.log("failure");
						}
				});
			},
			selectLevelPopupFile: function (com) {
				var popup_select_button;
				var popup_filename_table;
				var i;
				m.popup_active_file = com["filename"];
				popup_select_button = document.getElementById("browseSelectBtn");
				popup_select_button.setAttribute("class", "btn btn-success");
				popup_select_button.setAttribute("onclick", "BBE({com: 'loadLevelPopupFile'})");
				popup_filename_table = document.getElementById("popupFilenameList");
				for (i = 0; i < popup_filename_table.childNodes.length; i ++) {
					if (popup_filename_table.childNodes[i].childNodes[0].innerHTML == com["filename"]) {
						popup_filename_table.childNodes[i].childNodes[0].setAttribute("class", "popupFilenameSelected");
					} else {
						popup_filename_table.childNodes[i].childNodes[0].setAttribute("class", "popupFilename");
					}
				}
			},
			loadLevelPopupFile: function (com) {
				document.getElementById("level_id").value = m.popup_active_file;
				t.controller.displayElement({element: "clear_level_id", display_type: "block"});
				t.controller.click_load_level();
				t.controller.closeBrowseWindow();
			},
			openBackgroundBrowseWindow: function (com) {
				/*
					Opens browser popup / loads files
				*/
				var popup_div = document.getElementById("browsePopup");
				var popup_html;
				$('#popupBlocker').css("display", "block");
				$('#browsePopup').css({"display": "block", "left": "80px", "top": "100px", "width": "600px", "height": "450px", "background-color": "#FFFFCC", "border-radius": "5px"});
				popup_html = "<div id='popupScrollable' style='position:relative;left:30px;top:30px;width:540px;height:350px;overflow-y:auto;background-color:#FFFFFF;border:1px solid #000000;'><p style='padding-left:238px;padding-top:10px;font-size:12px;font-family:verdana;'>Loading...</p></div>"
				popup_html = popup_html + "<button onclick='";
				popup_html = popup_html + "' id='browseSelectBtn' class='btn btn-inverse' style='position:relative;top:50px;left:215px;'>SELECT</button>";
				popup_html = popup_html + "<button onclick='BBE({com: ";
				popup_html = popup_html + '"closeBrowseWindow"})';
				popup_html = popup_html + "' class='btn btn-danger' style='position:relative;top:50px;left:225px;'>CLOSE</button>";
				popup_div.innerHTML = popup_html;
				$.ajax({
					url: "php/BBE_retrieveBkgrndFnames.php",
					type: "GET",
					success:
						function (filenames) {
							var filenames_parsed;
							var table_data = "";
							var i;
							var new_row_counter = 0;
							filenames_parsed = filenames.split("<?*>");
							filenames_parsed.pop();
							filenames_parsed = filenames_parsed.sort();
							for (i = 0; i < filenames_parsed.length; i++) {
								new_row_counter ++;
								if (new_row_counter == 1) {
									table_data = table_data + "<tr>"
								}
								table_data = table_data + "<td id='bkimg_" + filenames_parsed[i] + "' class='popupFilename' onclick='BBE ({com: ";
								table_data = table_data + '"selectBackgroundPopupFile", filename: "' + filenames_parsed[i] + '"})' ;
								table_data = table_data + "'><img width='100px' height='75px' src='../img/backgrounds/" + filenames_parsed[i] + "' style='margin:13px 13px 13px 13px;border:1px solid #000000;'></td>";
								if (new_row_counter == 4) {
									table_data = table_data + "</tr>"
									new_row_counter = 0;
								}
							}
							document.getElementById("popupScrollable").innerHTML = "<table><tbody id='popupFilenameList'>" + table_data + "</tbody></table>";
						},
					error:
						function (error) {
							console.log("failure");
						}
				});
			},
			selectBackgroundPopupFile: function (com) {
				var popup_select_button;
				var popup_filename_table;
				var i;
				var k;
				m.popup_active_file = com["filename"];
				popup_select_button = document.getElementById("browseSelectBtn");
				popup_select_button.setAttribute("class", "btn btn-success");
				popup_select_button.setAttribute("onclick", "BBE({com: 'loadBackgroundPopupFile'})");
				popup_filename_table = document.getElementById("popupFilenameList");
				for (i = 0; i < popup_filename_table.childNodes.length; i ++) {
					for (k = 0; k < popup_filename_table.childNodes[i].childNodes.length; k ++)
					popup_filename_table.childNodes[i].childNodes[k].setAttribute("class", "popupFilename");
				}
				document.getElementById("bkimg_" + com["filename"]).setAttribute("class", "popupFilenameSelected");
			},
			loadBackgroundPopupFile: function (com) {
				document.getElementById("background_filename").value = m.popup_active_file;
				t.controller.displayElement({element: "clear_background_filename", display_type: "block"});
				t.controller.click_load_background();
				t.controller.closeBrowseWindow();
			},
			closeBrowseWindow: function (com) {
				/*
					Closes brower popup
				*/
				$('#popupBlocker').css("display", "none");
				$('#browsePopup').css("display", "none");
			},
			levelLoaded: function (com) {
				/*
					Intrepet saved level data and rebuild the
					level for further user editing
					
					Arguments
					com.json_data: The escaped stringified json data
				*/
				var atom_id; // String: The id for a given atom
				var all_atoms; // Array: List of all saved atoms
				var loop_atoms; // Number: Total number of saved atoms
				var raw_level; // String: Unescaped stingified json data
				var level_json; // Object: JSON object with the level data
				var drop_colors; // String: Drop colors to check
				var color_length; // Number: Length of drop_colors
				var match_inputs; // Array: Characters of matches
				var combo_inputs; // Array: Characters of combos
				var for_length; // Number: Length of inputs to convert
				var total_notes; // Number: The total number of notes to load
				var i; // Number: Increment Var
				// Init values for function
				match_inputs = ['r', 'p', 'b', 'c', 'o', 'v', 'y', 'w', 't',
					'4C', '5', '5C', '6', '6C', '7', 'X'];
				combo_inputs = ['4C4C', '4C5', '4C5C', '4C6', '4C6C', '4C7',
					'55', '55C', '56', '56C', '57', '5C5C', '5C6', '5C6C',
					'5C7', '66', '66C', '67', '6C6C', '6C7', '77'];
				// Clear the level before restore the save file
				BBE({
					com: 'clearLevel'
				});
				// Ready loaded data for level restoration
				raw_level = unescape(com.json_data);
				level_json = jQuery.parseJSON(raw_level);
				// Restore drop colors
				drop_colors = level_json.level.drop_colors;
				color_length = drop_colors.length;
				$("#color_r").prop('checked', false);
				$("#color_p").prop('checked', false);
				$("#color_b").prop('checked', false);
				$("#color_c").prop('checked', false);
				$("#color_o").prop('checked', false);
				$("#color_v").prop('checked', false);
				$("#color_y").prop('checked', false);
				$("#color_w").prop('checked', false);
				$("#color_t").prop('checked', false);
				for (i = 0; i < color_length; i++) {
					$("#color_" + drop_colors[i]).prop('checked', true);
				}
				// Restore drop types
				if (level_json.level.drop_blackholes == 'true') {
					$('#use_hole').prop('checked', true);
				} else {
					$('#use_hole').prop('checked', false);
				}
				$('#hole_counts').val(level_json.level.bh_counter);
				$('#hole_percent').val(level_json.level.bh_percent);
				if (level_json.level.drop_antimatter == 'true') {
					$('#use_anti').prop('checked', true);
				} else {
					$('#use_anti').prop('checked', false);
				}
				$('#anti_counts').val(level_json.level.am_counter);
				$('#anti_percent').val(level_json.level.am_percent);
				if (level_json.level.drop_radioactive == 'true') {
					$('#use_radio').prop('checked', true);
				} else {
					$('#use_radio').prop('checked', false);
				}
				$('#radio_counts').val(level_json.level.ra_counter);
				$('#radio_percent').val(level_json.level.ra_percent);
				if (level_json.level.drop_void == 'true') {
					$('#use_void').prop('checked', true);
				} else {
					$('#use_void').prop('checked', false);
				}
				$('#void_counts').val(level_json.level.vd_counter);
				$('#void_percent').val(level_json.level.vd_percent);
				if (level_json.level.drop_freeze == 'true') {
					$('#use_freeze').prop('checked', true);
				} else {
					$('#use_freeze').prop('checked', false);
				}
				$('#freeze_counts').val(level_json.level.fr_counter);
				$('#freeze_percent').val(level_json.level.fr_percent);
				// Restore requirements
				$('#moves_allowed').val(level_json.level.moves);
				$('#score_needed_1').val(level_json.level.score_1);
				$('#score_needed_2').val(level_json.level.score_2);
				$('#score_needed_3').val(level_json.level.score_3);
				$('#time_limit').val(level_json.level.time);
				$('#break_bonds').val(level_json.level.clear_bonds);
				$('#fill_nucleus').val(level_json.level.clear_nucleus);
				$('#rid_antimatter').val(level_json.level.clear_antimatter);
				if (level_json.level.clear_radioactive == 'true') {
					$('#clear_radio').prop('checked', true);
				} else {
					$('#clear_radio').prop('checked', false);
				}
				if (level_json.level.clear_crystal == 'true') {
					$('#clear_crystal').prop('checked', true);
				} else {
					$('#clear_crystal').prop('checked', false);
				}
				// Retrieve notes
				if (level_json.level.notes) {
				    total_notes = level_json.level.notes.length;
				    for (i =0; i < total_notes; i++) {
				        level_json.level.notes[i].message = unescape(level_json.level.notes[i].message);
				        m.game_notes.push(level_json.level.notes[i]);
				    }
				}
				// Retrieve matching amounts
				for_length = match_inputs.length;
				for (i = 0; i < for_length; i++) {
					if (level_json.level['match_' + match_inputs[i]]) {
					$('#match_' + match_inputs[i]).val(level_json.level['match_' + match_inputs[i]]);
					} 
				}
				// Retrieve combo amounts
				for_length = combo_inputs.length;
				for (i = 0; i < for_length; i++) {
					if (level_json.level['combo_' + combo_inputs[i]]) {
						$('#combo_' + combo_inputs[i])
							.val(level_json.level['combo_' + combo_inputs[i]]);
					}
				}
				// Restore required compounds
				for (i = 1; i < 6; i++) {
					$('#compounds_'+ i).val(level_json.level['compounds_'+ i]);
					$('#compound_'+ i).val(level_json.level['compound_'+ i]);
				}
				// Restore Atom Generators
				m.generators = level_json.level.generators;
				// Restore atoms
				all_atoms = level_json.level.atoms;
				loop_atoms = all_atoms.length;
				for (i = 0; i < loop_atoms; i++) {
					atom_id = all_atoms[i].id;
					m.atoms[atom_id].controller.setType({
						type: Number(all_atoms[i].type)
					});
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
					m.atoms[atom_id].controller.setRadiation({
						level: all_atoms[i].radiation
					});
					m.atoms[atom_id].controller.setAtomCreator({
						is_creator: (all_atoms[i].is_creator == 'true')
					});
					m.atoms[atom_id].controller.setShield({
						is_shielded: (all_atoms[i].has_shield == 'true')
					});
					m.atoms[atom_id].controller.setEntryPoint({
						is_entry: (all_atoms[i].is_enter_point == 'true')
					});
					m.atoms[atom_id].controller.setExitPoint({
						is_exit: (all_atoms[i].is_exit_point == 'true')
					});
					m.atoms[atom_id].controller.setFogged({
						fog: (all_atoms[i].is_fogged == 'true')
					});
				}
				BBE({
					com: 'checkNudge'
				});
				// Load or clear background based on saved data
				m.bg_file = level_json.level.background_jpg;
				$('#background_filename').val(m.bg_file);
				if (m.bg_file == '') {
					BBE({
						com: 'unloadBackground'
					});
				} else {
					BBE({
						com: 'click_load_background'
					});
				}
				// Set the play button active
				BBE({
					com: 'enablePlayButton'
				});
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
				// Clear all notes
				m.game_notes = [];
			},
			click_save_level: function (com) {
				/*
					Execute Save of the Level
				*/
				var level_filename; // String: User selected filename
				var filename_length; // Number: The length of level_filename
				var save_json; // Object: JSON formatted level save data
				level_filename = $('#level_id').val();
				filename_length = level_filename.length;
				if (level_filename == '') {
					// Display filename field as error class
					$("#level_id").removeClass('normalText');
					$("#level_id").addClass('errorText');
				} else {
					// Add file extension if it is missing
					if (filename_length < 4) {
						level_filename = level_filename + '.txt';
						$('#level_id').val(level_filename);
					} else {
						if (level_filename.substr(filename_length - 4, 4)
								!= '.txt') {
							level_filename = level_filename + '.txt';
							$('#level_id').val(level_filename);    
						}
					}
					// Final formatting of data for saving
					BBE({
						com: 'setGameData' 
					});
					save_json = BBE({
						com: 'createSaveJSON' 
					});
					// Save file and data via post
					$.post("php/BBE_saveLevel.php", 
						{
							filename: level_filename,
							level_data: escape(JSON.stringify(save_json))
						},
						function (data, status) {
							if (status != 'success') {
								// Display filename field as error class
								$("#level_id").removeClass('normalText');
								$("#level_id").addClass('errorText');
							} else {
								// Display filename field as error class
								$('#level_id').removeClass('normalText');
								$('#level_id').addClass('successText');
								// Set the play button active
								BBE({
									com: 'enablePlayButton'
								});
							}
						}
					);
				}
			},
			resetFileField: function (com) {
				/*
					Reset input tag to normal text class
				*/
				// Change filename font back to normal class
				$("#level_id").addClass('normalText');
				$("#level_id").removeClass('errorText');
				$("#level_id").removeClass('successText');
			},
			resetBackgroundField: function (com) {
				/*
					Reset input tag to normal text class
				*/
				// Change filename font back to normal class
				$("#background_filename").addClass('normalText');
				$("#background_filename").removeClass('errorText');
				$("#background_filename").removeClass('successText');
			},
			setGameData: function (com) {
				/*
					Set the legal slides and locked atoms
					before the saving of the level
				*/
				var atom_id; // String: The id for a given atom
				var atom_type; // Number: ENUM type value for a given atom
				var atom_bonds; // Array: List of bonds in six directions
				var d; // Number: Increment var for hex direction
				var neighbor; // String: Atom id of a given neighbor
				var is_locked; // Boolean: Is a given atom locked
				var slider; // String: Atom id of a given slidable neighbor
				// Init funciton values
				m.total_atoms = 0;
				// Set slides and locked for each atom
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						is_locked = false;
						atom_type = m.atoms[atom_id].controller.getType();
						atom_bonds = m.atoms[atom_id].controller.getBonding();
						// Lock atom for selected atom types
						switch (atom_type) {
							case m.atom_types.unused:
							case m.atom_types.nucleus:
							case m.atom_types.bond_vert:
							case m.atom_types.bond_slash:
							case m.atom_types.bond_backslash:
							case m.atom_types.crystal:
								is_locked = true;
								break;
							default:
								if (atom_type >= m.atom_types.absorber
										&& atom_type <=
										m.atom_types.absorber_x7) {
									is_locked = true;
								}
						}
						// Add to active atoms
						if (atom_type != m.atom_types.unused) {
							m.total_atoms = m.total_atoms + 1;
						}
						// Lock atom if any bonds exist
						for (d = 0; d < 6; d++) {
							if (atom_bonds[d] != '') {
								is_locked = true;
							}   
						}
						// Lock atom if it has a sheild
						if (m.atoms[atom_id].controller.getShield() == true) {
							is_locked = true; 
						}
						// Set the locked value of the atom
						m.atoms[atom_id].controller.setLocked({
							is_locked: is_locked
						});
						// Set slide atom ids
						for (d = 0; d < 6; d++) {
							slider = '';
							neighbor = m.atoms[atom_id].controller
								.getNeighbor({
									direction: d 
								});
							if (neighbor != '') {
								atom_type = m.atoms[neighbor].controller
									.getType();
								if (atom_type != m.atom_types.unused) {
									slider = neighbor;
								}
							}
							m.atoms[atom_id].controller.setSlide({
								direction: d,
								atom_id: slider
							});
						}
					}
				}
				// Set the order in which to check for falling atoms
				BBE({
					com: 'setFallOrder' 
				});
				// Set drop links for all atoms
				BBE({
					com: 'setDropAtoms' 
				});
			},
			setFallOrder: function (com) {
				/*
					Calculate and save the proper order to
					check for falling atoms in
				*/
				var atom_id; // String: Atom id for current checked atom
				var atoms_recorded; // Number: Total number of atoms in fall lists
				var y_atom; // Number: Y location of atom
				var y_max; // Number: Highest Y location recorded in this loop
				var atom_line; // Array: Atom id at highest recorded Y loc
				var atom_used; // String: All recorded ids inside of seps
				var atom_sep; // String: Atom separator
				var line_length; // Number: The length of the line of atom ids
				var i; // Number: Increment Var
				// Init Function Values
				m.fall_arrays = {};
				m.fall_ids = [];
				atoms_recorded = 0;
				atom_sep = ':';
				atom_used = atom_sep;
				// scan atoms while all atoms aren't accounted for
				while (atoms_recorded < m.total_atoms) {
					atom_line = [];
					y_max = -999999;
					for (atom_id in m.atoms) {
						if (m.atoms.hasOwnProperty(atom_id)) {
							// Only used atoms recorded
							if (m.atoms[atom_id].controller.getType()
									!= m.atom_types.unused) {
								// Only use atoms once
								if (atom_used.indexOf(atom_sep + atom_id
										+ atom_sep) == -1) {
									y_atom = m.atoms[atom_id].controller.getY();
									if (y_atom == y_max) {
										atom_line.push(atom_id);
									}
									if (y_atom > y_max) {
										y_max = y_atom;
										atom_line = [atom_id];
									}
								}
							}
						}
					}
					line_length = atom_line.length;
					// record all atoms in the line
					atoms_recorded = atoms_recorded + line_length;
					for (i = 0; i < line_length; i++) {
						atom_used = atom_used + atom_line[i] + atom_sep;
					}
					m.fall_arrays["fall_" + y_max] = atom_line;
					m.fall_ids.push(y_max);
				}
			},
			setDropAtoms: function (com) {
				/*
					Calculate and save the proper drop
					values for each live atom
				*/
				var atom_id; // String: Atom id for current checked atom
				var d; // Number: Increment Var for hex direction
				var fall_id; // String: Atom id of the atom to fall into spot
				var falls; // Array: List of atom ids for fall targets
				var teleporter; // String: Atom id of teleporter target
				// First pass: Setting local drops
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						m.atoms[atom_id].controller.setTeleporterTarget({
							is_target: false 
						});
						if (m.atoms[atom_id].controller.getType()
								!= m.atom_types.unused) {
							for (d = 0; d < 3; d++) {
								fall_id = m.atoms[atom_id].controller
									.getNeighbor({
										direction: d + 3
									});
								m.atoms[atom_id].controller.setDrop({
									direction: d,
									atom_id: fall_id
								});
							}
						}
					}
				}
				// Second pass: Overwritting drops for falls and teleporter
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						if (m.atoms[atom_id].controller.getType()
								!= m.atom_types.unused) {
							falls = m.atoms[atom_id].controller.getFall();
							teleporter = m.atoms[atom_id].controller
								.getTeleporter();
							if (teleporter != '') {
								m.atoms[teleporter].controller.setDrop({
									direction: 1,
									atom_id: atom_id
								});
								m.atoms[teleporter].controller
									.setTeleporterTarget({
										is_target: true 
									});
							}
							for (d = 0; d < 3; d++) {
								if (falls[d] != '') {
									m.atoms[falls[d]].controller.setDrop({
										direction: d,
										atom_id: atom_id
									});  
								}   
							}
						}
					}
				}
			},
			createSaveJSON: function (com) {
				/*
					Constructs a save JSON object from the editor
					data and returns it
					
					Returns
					An JSON object with current level data
				*/
				var save_data; // Object: JSON format level data for saving
				var save_level; // Object: Pointer to level in JSON object
				var save_atom; // Object: Temporary atom data to be stored
				var save_note; // Object: Temporary note data to be stored
				var atom_id; // String: The id for a given atom
				var drop_colors; // String: Selected drop colors
				var color_checks; // Array: Color characters to check
				var total_color_checks; // Number: Length of color_checks
				var match_inputs; // Array: Characters of matches
				var combo_inputs; // Array: Characters of combos
				var for_length; // Number: Length of inputs to convert
				var total_notes = m.game_notes.length; // Number: The total number of notes
				var i; // Number: Increment Var
				// Init values for function
				match_inputs = ['r', 'p', 'b', 'c', 'o', 'v', 'y', 'w', 't',
					'4C', '5', '5C', '6', '6C', '7', 'X'];
				combo_inputs = ['4C4C', '4C5', '4C5C', '4C6', '4C6C', '4C7',
					'55', '55C', '56', '56C', '57', '5C5C', '5C6', '5C6C',
					'5C7', '66', '66C', '67', '6C6C', '6C7', '77'];
				// Calculate drop colors
				drop_colors = '';
				color_checks = ['r', 'p', 'b', 'c', 'o', 'v', 'y', 'w', 't'];
				total_color_checks = color_checks.length;
				for (i = 0; i < total_color_checks; i ++) {
					if ($('#color_' + color_checks[i]).is(':checked')) {
						drop_colors = drop_colors + color_checks[i];    
					}
				}
				// Create base JSON object
				save_data = {};
				save_data["level"] = {};
				// Add background, drop, and requirements
				save_level = save_data["level"];
				save_level["background_jpg"] = m.bg_file;
				save_level["drop_colors"] = drop_colors;
				save_level["drop_blackholes"] = String($('#use_hole').is(':checked'));
				save_level["bh_counter"] = $('#hole_counts').val();
				save_level["bh_percent"] = $('#hole_percent').val();
				save_level["drop_antimatter"] = String($('#use_anti').is(':checked'));
				save_level["am_counter"] = $('#anti_counts').val();
				save_level["am_percent"] = $('#anti_percent').val();
				save_level["drop_radioactive"] = String($('#use_radio').is(':checked'));
				save_level["ra_counter"] = $('#radio_counts').val();
				save_level["ra_percent"] = $('#radio_percent').val();
				save_level["drop_void"] = String($('#use_void').is(':checked'));
				save_level["vd_counter"] = $('#void_counts').val();
				save_level["vd_percent"] = $('#void_percent').val();
				save_level["drop_freeze"] = String($('#use_freeze').is(':checked'));
				save_level["fr_counter"] = $('#freeze_counts').val();
				save_level["fr_percent"] = $('#freeze_percent').val();
				save_level["moves"] = $('#moves_allowed').val();
				save_level["score_1"] = $('#score_needed_1').val();
				save_level["score_2"] = $('#score_needed_2').val();
				save_level["score_3"] = $('#score_needed_3').val();
				save_level["time"] = $('#time_limit').val();
				save_level["clear_bonds"] = $('#break_bonds').val();
				save_level["clear_nucleus"] = $('#fill_nucleus').val();
				save_level["clear_antimatter"] = $('#rid_antimatter').val();
				save_level["clear_radioactive"] = String($('#clear_radio').is(':checked'));
				save_level["clear_crystal"] = String($('#clear_crystal').is(':checked'));
				// Add notes
				save_level["notes"] = [];
				for (i = 0; i < total_notes; i++) {
				    save_note = {};
				    save_note.move = m.game_notes[i].move;
				    save_note.duration = m.game_notes[i].duration;
				    save_note.x = m.game_notes[i].x;
				    save_note.y = m.game_notes[i].y;
				    save_note.width = m.game_notes[i].width;
				    save_note.height = m.game_notes[i].height;
				    save_note.x_pointer = m.game_notes[i].x_pointer;
				    save_note.y_pointer = m.game_notes[i].y_pointer;
				    save_note.message = escape(m.game_notes[i].message);
				    save_note.move = m.game_notes[i].move;
				    save_level["notes"].push(save_note);
				}
				// Add matches to requirements
				for_length = match_inputs.length;
				for (i = 0; i < for_length; i++) {
					save_level['match_' + match_inputs[i]] = $('#match_' + match_inputs[i]).val();
				}
				// Add combos to requirements
				for_length = combo_inputs.length;
				for (i = 0; i < for_length; i++) {
					save_level['combo_' + combo_inputs[i]] = $('#combo_' + combo_inputs[i]).val();
				}
				// Add required compounds
				for (i = 1; i < 6; i++) {
					save_level['compounds_'+ i] = $('#compounds_'+ i).val();
					save_level['compound_'+ i] = $('#compound_'+ i).val();
				}
				// Add Atom Generators
				save_level["generators"] = m.generators;
				// Save the fall order
				save_level["total_atoms"] = m.total_atoms;
				save_level["fall_arrays"] = m.fall_arrays;
				save_level["fall_ids"] = m.fall_ids;
				// Save atom data
				save_level["atoms"] = [];
				for (atom_id in m.atoms) {
					if (m.atoms.hasOwnProperty(atom_id)) {
						save_atom = {};
						save_atom["id"] = atom_id;
						save_atom["neighbors"] = m.atoms[atom_id].controller.getNeighbors();
						save_atom["slide"] = m.atoms[atom_id].controller.getSlide();
						save_atom["type"] = m.atoms[atom_id].controller.getType();
						save_atom["color"] = m.atoms[atom_id].controller.getColor();
						save_atom["move_counter"] = m.atoms[atom_id].controller.getMoveCounter();
						save_atom["teleport"] = m.atoms[atom_id].controller.getTeleporter();
						save_atom["bonds"] = m.atoms[atom_id].controller.getBonding();
						save_atom["falls"] = m.atoms[atom_id].controller.getFall();
						save_atom["drops"] = m.atoms[atom_id].controller.getDrop();
						save_atom["radiation"] = m.atoms[atom_id].controller.getRadiation();
						save_atom["is_locked"] = String(m.atoms[atom_id].controller.getLocked());
						save_atom["has_shield"] = String(m.atoms[atom_id].controller.getShield());
						save_atom["is_creator"] = String(m.atoms[atom_id].controller.getAtomCreator());
						save_atom["is_target"] = String(m.atoms[atom_id].controller.getTeleporterTarget());
						save_atom["is_enter_point"] = String(m.atoms[atom_id].controller.getEntryPoint());
						save_atom["is_exit_point"] = String(m.atoms[atom_id].controller.getExitPoint());
						save_atom["is_fogged"] = String(m.atoms[atom_id].controller.getFogged());
						save_level["atoms"].push(save_atom);
					}
				}
				return save_data;
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
			consoleError: function (com) {
				/*
					Construct and report editor error to the console
					
					Arguments
					com.method_name: Function name of where the error occurred
					com.error: Error message
					com.error_value: The incorrect value to display
				*/
				var error_message; // String: The construct for the error message
				error_message = 'ERROR: BBE ';
				if (com.method_name) {
					if (com.method_name != "") {
						error_message = error_message + ' @' + com.method_name;
					}   
				}
				if (com.error) {
					if (com.error != "") {
						error_message = error_message + ' :' + com.error;
					}   
				}
				if (com.error_value) {
					if (com.error_value != "") {
						error_message = error_message + ' = ' + com.error_value;
					}   
				}
				console.log(error_message);   
			},
			clearTextArea: function (com) {
				$("#" + com["text_area_id"]).val("");
				$("#" + com["self_id"]).css("display", "none");
			},
			displayElement: function (com) {
				$("#" + com["element"]).css("display", com["display_type"]);
			}
		};
	}
	if (this.controller[command.com]) {
		// Execute controller function if present and return value
		return this.controller[command.com](command);
	}
	// Give warning when command is missing
	console.log("*** Warning *** (BBE) No Command: " + command.com);
	return this;
};