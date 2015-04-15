/*
	Code for a Big Bang Game pop-up menu
*/

var POPUP_MENU; // Function: Contains MVC for game piece

POPUP_MENU = function (command) {
	/*
		Contains MVC for pop-up menu object. Executes the
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
			menu_x: 460, // Number: Center point of the menu on the X-axis
			menu_y: 320, // Number: Center point of the menu on the Y-axis
			menu_state: '', // String: State of menu operation
			menu_time: -1, // Number: Menu start time
			menu_id: '', // String: Menu being displayed
			menu_back: '', // String: Type of background for menu
			menu_open: 500, // Number: Duration of menu open animation
			menu_close: 250, // Number: Duration of menu close animation
			auto_close: false, // Boolean: Close as soon as it opens?
			menu_width: 0, // Number: The full width of the menu
			menu_height: 0, // Number: The full height of the menu
			menu_blocker: false, // Boolean: Does menu have background blocker?
			menu_color: '#404040', // String: The rgb color of the popup menu screen
			search_string: '', // String: String to search for friends with
			search_list: [], // Array: List of friends for a search
			search_match_list: [], // Array: Friends that matched the search
			search_matches: 0, // Number: Total number of matches to the search
			search_total: 0, // Number: Total number of friends to search,
			inner_canvas_width: 586, // Number: Width of the inner scroll canvas
			inner_canvas_height: 280, // Number: Height of the inner scroll canvas
			inner_canvas: null, // Context: 2D context of the inner canvas
			inner_draw: null, // Object: Instance of drawFunctions Class pointing to the inner canvas
			menu_sizes: ['high_scores', 'thin', 322, 555,
				'success', 'win', 240, 340,
				'success_advance', 'win', 240, 380,
				'start_game', '', 456, 430,
				'fail_implode', '', 310, 390,
				'fail_moves', '', 310, 390,
				'fail_score', 'lose', 240, 400,
				'fail_legal', 'lose', 310, 340,
				'fail_criteria', 'lose', 280, 360,
				'no_lives', '', 700, 500,
				'level_error', '', 700, 500,
				'quit_sure', '', 308, 266,
				'share_score', '', 400, 400,
				'help', 'thin', 700, 500,
				'story', 'thin', 700, 500,
				'future', 'thin', 700, 500,
				'invites', 'thin', 700, 500,
				'store', 'thin', 700, 500,
				'scroll', 'clear', 0, 0,
				'loading', 'thin', 363, 118],
				// Array: List of menu id, type, and  x,y size
			time_place: [60000, 6000, 1000, 100, 10, 1],
				// Array: Division Places
			time_places: 6, // Number: Number of digit places
			button_source: ['try', 1000, 404, 152, 32, 'single',
				'share', 1000, 437, 152, 32, 'single',
				'next', 1000, 472, 152, 32, 'single',
				'lab', 1000, 507, 152, 32, 'single',
				'end', 1000, 542, 152, 54, 'double',
				'moves', 1000, 602, 152, 54, 'double',
				'five', 840, 602, 152, 54, 'double',
				'start', 840, 542, 152, 54, 'double',
				'resume', 450, 602, 152, 54, 'double',
				'up', 630, 400, 38, 38, 'mini',
				'down', 630, 440, 38, 38, 'mini',
				'current', 590, 360, 38, 38, 'mini',
				'future', 1116, 365, 38, 38, 'mini',
				'story', 630, 360, 38, 38, 'mini',
				'back', 290, 625,  152, 32, 'single',
				'invite', 290, 590,  152, 32, 'single',
				'enhance0', 831, 370, 55, 55, 'enhancement',
				'enhance1', 888, 370, 55, 55, 'enhancement',
				'enhance2', 945, 370, 55, 55, 'enhancement',
				'enhance3', 831, 427, 55, 55, 'enhancement',
				'enhance4', 888, 427, 55, 55, 'enhancement',
				'enhance5', 945, 427, 55, 55, 'enhancement',
				'enhance6', 831, 484, 55, 55, 'enhancement',
				'enhance7', 888, 484, 55, 55, 'enhancement',
				'enhance8', 945, 484, 55, 55, 'enhancement',
				'freeLife', 1002, 365, 38, 38, 'mini',
				'freeMoves', 1040, 365, 38, 38, 'mini',
				'freeLuck', 1078, 365, 38, 38, 'mini',
				'nomark', 570, 483, 38, 38, 'mini',
				'checkmark', 570, 523, 38, 38, 'mini'],
				// Button id and source x, y, width, height, and type
			used_buttons: {}, // Object: Contains the dimesions of the draw menu buttons
			future_active: [], // Array: Paired list of buttons to set active in future (button_id, active)
			custom_popup_menu: null, // Object: Instance of custom open / close instructions
			slider: null, // Object: An instance of a scroll bar SLIDER, if needed
			mm: null, // Object: Pointer to the menu data model
			gm: null, // Object: Pointer to the game data model
			cc: null  // Object: Pointer to canvas context to draw to
		};
	}
	m = this.model;
	if (!this.view) {
		this.view = {
			displayMenu: function () {
				/*
					Display the pop-up menu in its current
					state
				*/
				var ratio; // Number: Percentage animation complete
				var time_now; // Number: The current time in milliseconds
				var width_now; // Number: Width of the menu for animation
				var height_now; // Number: Width of the menu for animation
				var current_alpha; // Number: Current canvas globalAlpha
				// Init Function Values
				time_now = new Date().getTime();
				// Display Background Blocker if it exists
				if (m.menu_blocker == true) {
					current_alpha = m.cc.globalAlpha;
					m.cc.globalAlpha = 0.5;
					m.cc.fillStyle = '#000000';
					m.cc.fillRect(0, 0, m.mm.width, m.mm.height);
					m.cc.globalAlpha = current_alpha;
				}
				// Operate opening of the menu
				if (m.menu_state == 'open') {
					ratio = (time_now - m.menu_time) / m.menu_open;
					if (ratio > 0) {
						if (ratio > 1) {
							ratio = 1;
						}
						width_now = m.menu_width * (ratio * 2);
						if (width_now > m.menu_width) {
							width_now = m.menu_width;
						}
						height_now = 20;
						if (ratio > 0.5) {
							height_now = (ratio - 0.5) * m.menu_height * 2;
							if (height_now < 20) {
								height_now = 20;
							}
						}
						BBM({
							com: 'draw',
							draw: 'nineBox',
							type: m.menu_back,
							x: m.menu_x,
							y: m.menu_y,
							width: width_now,
							height: height_now
						});
						if (ratio == 1) {
							m.menu_state = 'input';
							m.menu_time = time_now;
							if (m.auto_close == true) {
								// Automatically close menu as soon as it openings
								m.auto_close = false;
								m.menu_state = 'close';
							} else {
								// Init any special items on the popup menu
								t.controller.initOnOpen({});
							}
						}
					}
				}
				// Operate input phase of menu
				if (m.menu_state == 'input') {
					BBM({
						com: 'draw',
						draw: 'nineBox',
						type: m.menu_back,
						x: m.menu_x,
						y: m.menu_y,
						width: m.menu_width,
						height: m.menu_height
					});
					switch (m.menu_id) {
						case 'fail_score':
							m.custom_popup_menu.drawFailScore();
							break;
						case 'success':
							m.custom_popup_menu.drawSuccess();
							break;
					    case 'success_advance':
							m.custom_popup_menu.drawSuccessAdvance();
							break;
						case 'fail_implode':
							m.custom_popup_menu.drawFailImplode();
							break;
						case 'fail_moves':
							m.custom_popup_menu.drawFailMoves();
							break;
						case 'fail_legal':
							m.custom_popup_menu.drawFailLegal();
							break;
						case 'fail_criteria':
							m.custom_popup_menu.drawFailCriteria();
							break;
						case 'no_lives':
							m.custom_popup_menu.drawNoLives();
							break;
						case 'level_error':
							m.custom_popup_menu.drawLevelError();
							break;
						case 'start_game':
							m.custom_popup_menu.drawStartGame();
							break;
						case 'high_scores':
							m.custom_popup_menu.drawHighScores();
							break;
						case 'quit_sure':
							m.custom_popup_menu.drawQuitSure();
							break;
						case 'scroll':
							m.custom_popup_menu.drawLabScroll();
							break;
						case 'share_score':
							m.custom_popup_menu.drawShareScore();
							break;
						case 'help':
							m.custom_popup_menu.drawHelp();
							break;
						case 'story':
							m.custom_popup_menu.drawStory();
							break;
						case 'future':
							m.custom_popup_menu.drawFuture();
							break;
						case 'invites':
							m.custom_popup_menu.drawInvites();
							break;
						case 'store':
							m.custom_popup_menu.drawStore();
							break;
						case 'loading':
							m.custom_popup_menu.drawLoading();
							break;
					}
				}
				// Operate closing of the menu
				if (m.menu_state == 'close') {
					ratio = (time_now - m.menu_time) / m.menu_close;
					if (ratio > 1) {
						ratio = 1;
					}
					width_now = m.menu_width;
					height_now = m.menu_height * (1 - ratio);
					if (height_now > 0) {
						BBM({
							com: 'draw',
							draw: 'nineBox',
							type: m.menu_back,
							x: m.menu_x,
							y: m.menu_y,
							width: width_now,
							height: height_now
						});
					}
					if (ratio == 1) {
						m.menu_state = 'closed';
						BBM({
							com: 'menuClosed',
							id: m.menu_id
						});
					}
				}
			},
			displayButton: function (com) {
				/*
					Display a menu button centered on a given
					point from an id list

					Arguments
					com.x: The center x-axis of the level display
					com.y: The center y-axis of the level display
					com.id: The button id to be displayed
				*/
				var i; // Number: Increment Var
				var source_length; // Number: Length of m.button_source
				var source_x; // Number: X location on sprite sheet
				var source_y; // Number: Y location on sprite sheet
				var current_alpha; // Number: Current globalAlpha of canvas
				var overlay_alpha; // Number: Alpha for button overlay
				var find_button; // String: Button to find on buttons array
				// Add button if it doesn't exist
				if (!m.used_buttons[com.id]) {
					// Set button to find by stripping after _
					find_button = (com.id.split('_'))[0];
					// Init Function Values
					source_length = m.button_source.length;
					// Find button id
					for (i = 0; i < source_length; i = i + 6) {
						if (m.button_source[i] == find_button) {
							t.controller.addButton({
								id: com.id,
								x_source: m.button_source[i + 1],
								y_source: m.button_source[i + 2],
								x: com.x - Math.floor(
									m.button_source[i + 3] / 2),
								y: com.y - Math.floor(
									m.button_source[i + 4] / 2),
								width: m.button_source[i + 3],
								height: m.button_source[i + 4],
								type: m.button_source[i + 5]
							});
							break;
						}
					}
				}
				if (m.used_buttons[com.id]) {
					m.cc.drawImage(m.mm.menu_image,
						m.used_buttons[com.id].x_source,
						m.used_buttons[com.id].y_source,
						m.used_buttons[com.id].width,
						m.used_buttons[com.id].height,
						m.used_buttons[com.id].x,
						m.used_buttons[com.id].y,
						m.used_buttons[com.id].width,
						m.used_buttons[com.id].height);
					if (m.used_buttons[com.id].active == true) {
						if (m.used_buttons[com.id].selected == true) {
							if (m.used_buttons[com.id].type != 'mini') {
								m.cc.drawImage(m.mm.menu_image,
									613, 483,
									55, 55,
									m.used_buttons[com.id].x,
									m.used_buttons[com.id].y,
									55, 55);
							} else {
								m.cc.drawImage(m.mm.menu_image,
									670, 359,
									38, 38,
									m.used_buttons[com.id].x,
									m.used_buttons[com.id].y,
									38, 38);
							}
						}
						source_x = -1;
						overlay_alpha = 1;
						if (m.used_buttons[com.id].mouse_inside == true) {
							if (m.used_buttons[com.id].mouse_downed == true) {
								overlay_alpha = 0.5;
								switch (m.used_buttons[com.id].type) {
									case 'single':
										source_x = 670;
										source_y = 515;
										break;
									case 'double':
										source_x = 670;
										source_y = 603;
										break;
									case 'mini':
										source_x = 670;
										source_y = 399;
										break;
									default:
										source_x = 613;
										source_y = 602;
								}
							} else {
								switch (m.used_buttons[com.id].type) {
									case 'single':
										source_x = 670;
										source_y = 482;
										break;
									case 'double':
										source_x = 670;
										source_y = 548;
										break;
									case 'mini':
										source_x = 670;
										source_y = 399;
										break;
									default:
										source_x = 613;
										source_y = 542;
								}
							}
						} else {
							if (m.used_buttons[com.id].mouse_downed == true) {
								overlay_alpha = 0.5;
								switch (m.used_buttons[com.id].type) {
									case 'single':
										source_x = 670;
										source_y = 482;
										break;
									case 'double':
										source_x = 670;
										source_y = 548;
										break;
									case 'mini':
										source_x = 670;
										source_y = 548;
										break;
									default:
										source_x = 613;
										source_y = 542;
								}
							}
						}
						if (source_x > -1) {
							current_alpha = m.cc.globalAlpha;
							m.cc.globalAlpha = overlay_alpha;
							m.cc.drawImage(m.mm.menu_image,
								source_x, source_y,
								m.used_buttons[com.id].width,
								m.used_buttons[com.id].height,
								m.used_buttons[com.id].x,
								m.used_buttons[com.id].y,
								m.used_buttons[com.id].width,
								m.used_buttons[com.id].height);
							m.cc.globalAlpha = current_alpha;
						}
					} else {
						// Set source for deactivated overlay
						source_x = -1;
						switch (m.used_buttons[com.id].type) {
							case 'single':
								source_x = 670;
								source_y = 515;
								break;
							case 'double':
								source_x = 670;
								source_y = 603;
								break;
							case 'mini':
								source_x = 670;
								source_y = 439;
								break;
							default:
								source_x = 613;
								source_y = 602;
						}
						if (source_x > -1) {
							// Draw deactivated overlay
							m.cc.drawImage(m.mm.menu_image,
								source_x, source_y,
								m.used_buttons[com.id].width,
								m.used_buttons[com.id].height,
								m.used_buttons[com.id].x,
								m.used_buttons[com.id].y,
								m.used_buttons[com.id].width,
								m.used_buttons[com.id].height);
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
					Init popup menu

					Arguments
					com.menu_data = A pointer to the menu data model
					com.game_data = A pointer to the game data model
					com.menu_id = The menu to init
					com.x = Where to center the menu on the X-axis
					com.y = Where to center the menu on the Y-axis
					com.blocker = Boolean for if there is a background blocker

					Returns
					This object
				*/
				var i; // Number: Increment Var
				var for_length; // Number: Length of loop
				// Set data model pointers
				m.mm = com.menu_data;
				m.gm = com.game_data;
				// Set canvas context to display to
				m.cc = m.mm.cc;
				// Set menu ID
				m.menu_id = com.menu_id;
				// Override screen location if provided
				if (com.x) {
					m.menu_x = com.x;
				}
				if (com.y) {
					m.menu_y = com.y;
				}
				if (com.blocker) {
					m.menu_blocker = true;
				}
				// Find menu type and init display values
				for_length = m.menu_sizes.length;
				for (i = 0; i < for_length; i = i + 4) {
					if (m.menu_sizes[i] == m.menu_id) {
						 m.menu_state = 'init';
						 m.menu_back = m.menu_sizes[i + 1];
						 m.menu_width = m.menu_sizes[i + 2];
						 m.menu_height = m.menu_sizes[i + 3];
					}
				}
				// Init custom open / close file
				switch (m.menu_id) {
					case 'fail_score':
						m.custom_popup_menu = new PopupMenu_Fail_Score(t, m);
						break;
					case 'success':
						m.custom_popup_menu = new PopupMenu_Success(t, m);
						break;
				    case 'success_advance':
						m.custom_popup_menu = new PopupMenu_SuccessAdvance(t, m);
						break;
					case 'fail_implode':
						m.custom_popup_menu = new PopupMenu_Fail_Implode(t, m);
						break;
					case 'fail_moves':
						m.custom_popup_menu = new PopupMenu_Fail_Moves(t, m);
						break;
					case 'fail_legal':
						m.custom_popup_menu = new PopupMenu_Fail_Legal(t, m);
						break;
					case 'fail_criteria':
						m.custom_popup_menu = new PopupMenu_Fail_Criteria(t, m);
						break;
					case 'no_lives':
						m.custom_popup_menu = new PopupMenu_No_Lives(t, m);
						break;
					case 'level_error':
						m.custom_popup_menu = new PopupMenu_Level_Error(t, m);
						break;
					case 'start_game':
						m.custom_popup_menu = new PopupMenu_Start_Game(t, m);
						break;
					case 'high_scores':
						m.custom_popup_menu = new PopupMenu_High_Scores(t, m);
						break;
					case 'quit_sure':
						m.custom_popup_menu = new PopupMenu_Quit_Sure(t, m);
						break;
					case 'scroll':
						m.custom_popup_menu = new PopupMenu_Scroll(t, m);
						break;
					case 'share_score':
						m.custom_popup_menu = new PopupMenu_Share_Score(t, m);
						break;
					case 'help':
						m.custom_popup_menu = new PopupMenu_Help(t, m);
						break;
					case 'story':
						m.custom_popup_menu = new PopupMenu_Story(t, m);
						break;
					case 'future':
						m.custom_popup_menu = new PopupMenu_Future(t, m);
						break;
					case 'invites':
						m.custom_popup_menu = new PopupMenu_Invites(t, m);
						break;
					case 'store':
						m.custom_popup_menu = new PopupMenu_Store(t, m);
						break;
					case 'loading':
						m.custom_popup_menu = new PopupMenu_Loading(t, m);
						break;
				}
				return t;
			},
			openMenu: function (com) {
				/*
					Start the opening of the menu

					Arguments
					com.menu_id = The menu to init
					com.delay = Milliseconds until menu starts to open

					Returns
					A boolean for if the menu started to open
				*/
				var is_opening; // Boolean: Was the menu started to close?
				is_opening = false;
				if (com.menu_id == m.menu_id) {
					if (m.menu_state == 'init') {
						// Immediate open for scroll popup
						if (com.menu_id == 'scroll') {
							m.menu_state = 'input';
							return true;
						}
						// Adjustment for High Scores Window
						if (com.menu_id == 'high_scores') {
						    if (m.gm.high_scores.length > 3) {
    							if (m.gm.high_scores[3].place != 4
    									&& m.gm.high_scores[3].place != -1) {
    								m.menu_height = 571;
    							}
    						}
						}
						// Trigger start of opening of menu
						m.menu_state = 'open';
						m.menu_time = new Date().getTime() + com.delay;
						is_opening = true;
					}
				}
				return is_opening;
			},
			initOnOpen: function (com) {
				/*
					Inits special objects on popup menus
				*/
				var invites_data;
				var invites_height = 0;
				switch (m.menu_id) {
					case "invites":
                        $("body").append("<canvas id='inviteCanvas' class='invites-canvas' width='586' height='245'></canvas><div class='invite-search-container'><input class='invite-search' type='text' placeholder='Find Friend' style='height:32px'/></div><div class='invites-container'><div class='invites-div'></div></div>");                      
                        m.search_list = [];
                        m.search_match_list = [];
                        m.search_total = 0;
                        m.search_matches = 0;
                        for (invites_data in m.mm.invites) {
                            if (m.mm.invites.hasOwnProperty(invites_data)) {
                                m.search_list.push(invites_data);
                                m.search_match_list.push(invites_data);
                                m.search_total++;
                                m.search_matches++;
                            }
                        }
                        if (m.search_matches > 0) {
                            invites_height = (Math.floor((m.search_matches - 1) / 2) * 60) + 60;
                        }
                        setTimeout(function () {
                            $(".invites-div").css("height", this.totalHeight + "px");
                            // Create instance of draw functions
                            this.model.inner_canvas = document.getElementById("inviteCanvas").getContext("2d");
                            this.model.inner_draw = new DRAW({
                                com: 'init',
                                menu_data: this.model.mm,
                                cc: this.model.inner_canvas
                            });
                            $("#inviteCanvas").bind("click", function (evt) {
                            	var invite_index = -1;
                            	var scroll_offset = $(".invites-container").scrollTop();
                            	var x_mouse = evt.clientX - $("#inviteCanvas").position().left;
                            	var y_mouse = (scroll_offset + evt.clientY) - $("#inviteCanvas").position().top;
                            	var y_mod = y_mouse % 60;
                            	var box_check;
                            	if (x_mouse >= 15 && x_mouse <= 45) {
                            		invite_index = 0;	
                            	}
                            	if (x_mouse >= 307 && x_mouse <= 337) {
                            		invite_index = 1;	
                            	}
                            	if (invite_index > -1) {
	                            	if (y_mod >= 15 && y_mod <= 45) {
	                            		invite_index = invite_index + (Math.floor(y_mouse/60) * 2);
	                            	} else {
	                            		invite_index = -1;
	                            	}
	                            }
	                            if (invite_index > -1 && invite_index 
	                            		< this.main_model.search_matches) {
	                            	box_check = this.main_model.mm
	                            		.invites[this.main_model
	                            		.search_match_list[invite_index]]
	                            		.checkmark;
	                            	this.main_model.mm
	                            		.invites[this.main_model
	                            		.search_match_list[invite_index]]
	                            		.checkmark = !box_check;
	                            }
			                }.bind({main_model: this.model}));
                        }.bind({totalHeight: invites_height, model: m}), 1);
                	break;
				}
			},
			closeMenu: function (com) {
				/*
					Start the closing of the menu

					Arguments
					com.menu_id = The menu to init

					Returns
					A boolean for if the menu started to close
				*/
				var dispose_buttons; // Array: List of button to dispose of
				var total_buttons; // Number: Total number of buttons
				var dispose_button; // String: Button ID to dispose of
				var is_closing; // Boolean: Was the menu started to close?
				var i; // Number: Increment Var
				is_closing = false;
				if (com.menu_id == m.menu_id) {
					// Clean up special cases
					switch (m.menu_id) {
						case "invites":
							$(".invites-canvas").remove();
							$(".invites-container").remove();
							$(".invite-search-container").remove();
							delete m.innerDraw;
							break;
					}
					if (m.menu_state == 'input') {
						// Immediate open for scroll popup
						if (com.menu_id == 'scroll') {
							m.menu_state = 'closed';
							BBM({
								com: 'menuClosed',
								id: m.menu_id
							});
							return true;
						}
						// Change state to close
						m.menu_state = 'close';
						// Disable all buttons
						m.used_buttons = {};
						// Set starting time for close
						m.menu_time = new Date().getTime();
						is_closing = true;
					} else {
						m.auto_close = true;
					}
				}
				return is_closing;
			},
			addButton: function (com) {
				/*
					Check and add button to menu if needed

					Arguments
					com.id: The button id to add
					com.x_source: The X position on the sprite sheet
					com.y_source: The Y position on the sprite sheet
					com.x: Left edge of the button location
					com.y: Top edge of the button location
					com.width: Width of the button
					com.height: Height of the button
					com.type: Button type (single, double, or enhancement)

					Returns
					Whether the button was added as a boolean
				*/
				var future_buttons; // Number: Total length of m.future_active
				var i; // Number: Increment Var
				if (!m.used_buttons[com.id]) {
					m.used_buttons[com.id] = {};
					m.used_buttons[com.id].id = com.id;
					m.used_buttons[com.id].x_source = com.x_source;
					m.used_buttons[com.id].y_source = com.y_source;
					m.used_buttons[com.id].x = com.x;
					m.used_buttons[com.id].y = com.y;
					m.used_buttons[com.id].width = com.width;
					m.used_buttons[com.id].height = com.height;
					m.used_buttons[com.id].type = com.type;
					m.used_buttons[com.id].mouse_downed = false;
					m.used_buttons[com.id].mouse_inside = false;
					m.used_buttons[com.id].selected = false;
					m.used_buttons[com.id].active = true;
					future_buttons = m.future_active.length;
					for (i = 0; i < future_buttons; i = i + 2) {
						if (m.future_active[i] == com.id) {
							m.used_buttons[com.id].active
								= m.future_active[i + 1];
							m.future_active.splice(i, 2);
							i = i - 2;
							future_buttons = future_buttons - 2;
						}
					}
					return true;
				}
				return false;
			},
			removeButton: function (com) {
				/*
					Remove a button from the menu if it exists

					Argument
					com.id: The button id to remove
				*/
				if (m.used_buttons[com.id]) {
					delete m.used_buttons[com.id];
				}
			},
			inviteSelectAll: function (select_all_state) {
            	/*
            		Sets the current select all state of the invites
            	*/
            	var i;
            	// Remove previous checkmark buttons
            	t.controller.removeButton({id: 'nomark'});
            	t.controller.removeButton({id: 'checkmark'});
            	m.select_all = select_all_state;
            	for (i = 0; i < m.search_total; i++) {
            		m.mm.invites[m.search_list[i]].checkmark = select_all_state;
            	}
            },
            inviteSearch: function () {
            	/*
            		Operate search of the invites for the search string
            	*/
            	var i;
            	var invites_height = 0;
            	var lower_name; // String: The user name converted to all lower case
            	var search_string = $(".invite-search").val();
            	if (m.search_string != search_string) {
            		m.search_match_list = [];
            		m.search_matches = 0;
            		m.search_string = search_string;
            		search_string = search_string.toLowerCase();
            		for (i = 0; i < m.search_total; i++) {
            			lower_name = m.mm.invites[m.search_list[i]].full_name.toLowerCase();
            			if (m.search_string == "" || lower_name.indexOf(search_string) > -1) {
            				m.search_matches = m.search_matches + 1;
            				m.search_match_list.push(m.mm.invites[m.search_list[i]].id);
            			}
            		}
            		if (m.search_matches > 0) {
                    	invites_height = (Math.floor((m.search_matches - 1) / 2) * 60) + 60;
                	}
                    $(".invites-div").css("height", invites_height + "px");
                    $(".invites-container").scrollTop(0);
            	}	
            },
			getState: function () {
				/*
					Returns the current state of the menu
				*/
				return m.menu_state;
			},
			getID: function () {
				/*
					Returns the current id of the menu
				*/
				return m.menu_id;
			},
			getBlocker: function () {
				/*
					Returns the blocker state
				*/
				return m.menu_blocker;
			},
			getButtons: function() {
				/*
					Returns used buttons object
				*/
				return m.used_buttons;
			},
			getButtonSelected: function (com) {
				/*
					Return the selected state of a button

					Arguments
					com.id: The ID of the button being checked
				*/
				if (m.used_buttons[com.id]) {
					return m.used_buttons[com.id].selected;
				}
				return false;
			},
			setButtonSelected: function (com) {
				/*
					Set the selected state of a button

					Arguments
					com.id: The ID of the button being checked
					com.selected: Boolean for the selected state of the button
				*/
				if (m.used_buttons[com.id]) {
					m.used_buttons[com.id].selected = com.selected;
				}
			},
			setMouseInside: function (com) {
				/*
					Sets the mouse inside state of a button

					Arguments
					com.button_id: The id of the button to set
					com.mouse_inside: Boolean for if mouse is inside
				*/
				if (m.used_buttons[com.button_id]) {
					m.used_buttons[com.button_id].mouse_inside
						= com.mouse_inside;
				}
			},
			setMouseDowned: function (com) {
				/*
					Sets the mouse inside state of a button

					Arguments
					com.button_id: The id of the button to set
					com.mouse_down: Boolean for if mouse is downed
				*/
				if (m.used_buttons[com.button_id]) {
					m.used_buttons[com.button_id].mouse_downed
						= com.mouse_down;
				}
			},
			getButtonActive: function (com) {
				/*
					Returns the active state of the button

					Arguments
					com.button_id: The id of the button to set
				*/
				if (m.used_buttons[com.button_id]) {
					return m.used_buttons[com.button_id].active;
				}
				return false;
			},
			setButtonActive: function (com) {
				/*
					Sets the active state of the button

					Arguments
					com.button_id: The id of the button to set
					com.active: Boolean for if the button is active
				*/
				if (m.used_buttons[com.button_id]) {
					m.used_buttons[com.button_id].active
						= com.active;
				} else {
					m.future_active.push(com.button_id);
					m.future_active.push(com.active);
				}
			},

		};
	}
	if (this.controller[command.com]) {
		// Execute controller function if present and return value
		return this.controller[command.com](command);
	}
	// Give warning when command is missing
	console.log("*** Warning *** (POPUP_MENU) No Command: " + command.com);
	return this;
};