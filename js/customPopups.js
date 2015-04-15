/*
	Contains the code for the custom open / close action of the fail score popup
*/
var PopupMenu_Fail_Score = function (t, m) {
	this.drawFailScore = function () {
		/*
			Draw the failed score menu
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		var more_energy; // Number: Amount of energy still required
		// Init Function Values
		menu_top = -150;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
			22, 117,
			130, 18,
			m.menu_x - 65, m.menu_y + menu_top,
			130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		if (time_now > m.menu_time +  500) {
			// Display has failed message
			m.cc.drawImage(m.mm.menu_image,
				354, 125,
				130, 18,
				m.menu_x - 65, m.menu_y + menu_top + 75,
				130, 18);
		}
		if (time_now > m.menu_time +  1500) {
			// Display how much energy the player was short on
			more_energy = m.gm.tube_scores[0] - m.gm.score;
			BBM({
				com: 'draw',
				draw: 'number',
				x: m.menu_x,
				y: m.menu_y + menu_top + 130,
				value: more_energy,
				size: 'med'
			});
			m.cc.drawImage(m.mm.menu_image,
				354, 147,
				142, 61,
				m.menu_x - 71, m.menu_y + menu_top + 150,
				142, 61);
		}
		if (time_now > m.menu_time +  3000) {
			// Display Buttons
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 245,
				id: 'try'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 285,
				id: 'lab'
			});
		}
	};
};

/*
	Contains the code for the custom open / close action of the success popup
*/
var PopupMenu_Success = function (t, m) {
	this.drawSuccess = function () {
		/*
			Draw the success menu
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		var left_column; // Number: X offset to the left column
		var right_column; // Number: X offset to the right column
		var high_score; // Number: The player best score to display
		// Init Function Values
		menu_top = -120;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
			22, 117,
			130, 18,
			m.menu_x - 65, m.menu_y + menu_top,
			130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		if (time_now > m.menu_time +  500) {
			// Display has completed message
			m.cc.drawImage(m.mm.menu_image,
				354, 213,
				116, 18,
				m.menu_x - 58, m.menu_y + menu_top + 75,
				116, 18);
		}
		if (time_now > m.menu_time +  1000) {
			// Display my best high score
			m.cc.drawImage(m.mm.menu_image,
				354, 253,
				140, 14,
				m.menu_x - 70, m.menu_y + menu_top + 115,
				140, 14);
			high_score = m.gm.my_high_score;
			if (m.gm.score > high_score) {
				high_score = m.gm.score;
			}
			BBM({
				com: 'draw',
				draw: 'number',
				x: m.menu_x,
				y: m.menu_y + menu_top + 145,
				value: high_score,
				size: 'small'
			});
		}
		if (time_now > m.menu_time +  1500) {
			// Display Buttons
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 185,
				id: 'share'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 225,
				id: 'lab'
			});
		}
	};
};

/*
	Contains the code for the custom open / close action of the success popup
*/
var PopupMenu_SuccessAdvance = function (t, m) {
	this.drawSuccessAdvance = function () {
		/*
			Draw the success menu
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		var left_column; // Number: X offset to the left column
		var right_column; // Number: X offset to the right column
		var high_score; // Number: The player best score to display
		// Init Function Values
		menu_top = -140;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
			22, 117,
			130, 18,
			m.menu_x - 65, m.menu_y + menu_top,
			130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		if (time_now > m.menu_time +  500) {
			// Display has completed message
			m.cc.drawImage(m.mm.menu_image,
				354, 213,
				116, 18,
				m.menu_x - 58, m.menu_y + menu_top + 75,
				116, 18);
		}
		if (time_now > m.menu_time +  1000) {
			// Display my best high score
			m.cc.drawImage(m.mm.menu_image,
				354, 253,
				140, 14,
				m.menu_x - 70, m.menu_y + menu_top + 115,
				140, 14);
			high_score = m.gm.my_high_score;
			if (m.gm.score > high_score) {
				high_score = m.gm.score;
			}
			BBM({
				com: 'draw',
				draw: 'number',
				x: m.menu_x,
				y: m.menu_y + menu_top + 145,
				value: high_score,
				size: 'small'
			});
		}
		if (time_now > m.menu_time +  1500) {
			// Display Buttons
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 185,
				id: 'share'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 225,
				id: 'next'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 265,
				id: 'lab'
			});
		}
	};
};

/*
	Contains the code for the custom open / close action of the invites popup
*/
var PopupMenu_Fail_Implode = function (t, m) {
	this.drawFailImplode = function () {
		/*
			Draw the failed implode
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		// Init Function Values
		menu_top = -145;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
		22, 117,
		130, 18,
		m.menu_x - 65, m.menu_y + menu_top,
		130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		if (time_now > m.menu_time +  500) {
			// Display is incomplete
			m.cc.drawImage(m.mm.menu_image,
			354, 395,
			169, 18,
			m.menu_x - 85, m.menu_y + menu_top + 75,
			169, 18);
		}
		if (time_now > m.menu_time +  1500) {
			// Display implode message
			m.cc.drawImage(m.mm.menu_image,
			354, 354,
			208, 40,
			m.menu_x - 104, m.menu_y + menu_top + 120,
			208, 40);
		}
		if (time_now > m.menu_time +  3000) {
			// Display Buttons
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 205,
				id: 'five'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 265,
				id: 'end'
			});
		}
	};
};

/*
	Contains the code for the custom open / close action of the fail moves popup
*/
var PopupMenu_Fail_Moves = function (t, m) {
	this.drawFailMoves = function () {
		/*
			Draw the failed moves
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		// Init Function Values
		menu_top = -145;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
		22, 117,
		130, 18,
		m.menu_x - 65, m.menu_y + menu_top,
		130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		if (time_now > m.menu_time +  500) {
			// Display is incomplete
			m.cc.drawImage(m.mm.menu_image,
			354, 395,
			169, 18,
			m.menu_x - 85, m.menu_y + menu_top + 75,
			169, 18);
		}
		if (time_now > m.menu_time +  1500) {
			// Display out of moves message
			m.cc.drawImage(m.mm.menu_image,
			354, 269,
			156, 40,
			m.menu_x - 78, m.menu_y + menu_top + 120,
			156, 40);
		}
		if (time_now > m.menu_time +  3000) {
			// Display Buttons
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 205,
				id: 'moves'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 265,
				id: 'end'
			});
		}
	};
};

/*
	Contains the code for the custom open / close action of the fail legal popup
*/
var PopupMenu_Fail_Legal = function (t, m) {
	this.drawFailLegal = function () {
		/*
			Draw the failed legal moves menu
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		// Init Function Values
		menu_top = -120;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
			22, 117,
			130, 18,
			m.menu_x - 65, m.menu_y + menu_top,
			130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		if (time_now > m.menu_time +  500) {
			// Display has failed message
			m.cc.drawImage(m.mm.menu_image,
				354, 125,
				130, 18,
				m.menu_x - 65, m.menu_y + menu_top + 75,
				130, 18);
		}
		if (time_now > m.menu_time +  1500) {
			// Display no legal moves message
			m.cc.drawImage(m.mm.menu_image,
				354, 311,
				208, 40,
				m.menu_x - 104, m.menu_y + menu_top + 115,
				208, 40);
		}
		if (time_now > m.menu_time +  2500) {
			// Display Buttons
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 185,
				id: 'try'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 225,
				id: 'lab'
			});
		}
	};
};

/*
	Contains the code for the custom open / close action of the fail criteria popup
*/
var PopupMenu_Fail_Criteria = function (t, m) {
	this.drawFailCriteria = function () {
		/*
			Draw the failed criteria menu
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		// Init Function Values
		menu_top = -130;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
			22, 117,
			130, 18,
			m.menu_x - 65, m.menu_y + menu_top,
			130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		if (time_now > m.menu_time +  500) {
			// Display has failed message
			m.cc.drawImage(m.mm.menu_image,
				354, 125,
				130, 18,
				m.menu_x - 65, m.menu_y + menu_top + 75,
				130, 18);
		}
		if (time_now > m.menu_time +  1500) {
			// Display criteria message
			m.cc.drawImage(m.mm.menu_image,
				354, 417,
				168, 61,
				m.menu_x - 84, m.menu_y + menu_top + 115,
				168, 61);
		}
		if (time_now > m.menu_time +  2500) {
			// Display Buttons
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 205,
				id: 'try'
			});
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + menu_top + 245,
				id: 'lab'
			});
		}
	};
};


/*
	No lives beg screen 
*/
var PopupMenu_No_Lives = function (t, m) {
	this.drawNoLives = function (com) {
		/*
			Draw interface for sharing score with friends
		*/
		// Display Back Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'back'
		});
	};
};


/*
	Contains the code for the custom open / close action of the share score popup
*/
var PopupMenu_Level_Error = function (t, m) {
	this.drawLevelError = function (com) {
		/*
			Draw interface for sharing score with friends
		*/
		// Display Back Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'back'
		});
	};
};

/*
	Contains the code for the custom open / close action of the start game popup
*/
var PopupMenu_Start_Game = function (t, m) {
	this.drawStartGame = function () {
		/*
			Draw the success menu
		*/
		var time_now; // Number: The current time in milliseconds
		var menu_top; // Number: Offset to the top of the menu
		var require_column; // Number: X offset to the requirements column
		var left_column; // Number: X offset to the left column
		var right_column; // Number: X offset to the right column
		var x_source; // Number: X postion on sprite sheet
		var a; // Number: Increment var for requirements
		var i; // Number: Increment var for atoms
		var y_pos; // Number: Y position of the requirement being drawn
		var compound_atoms; // Number: Total number of atoms in compound
		var source_x; // Number: X position on source image
		var source_y; // Number: Y position on source image
		var source_width; // Number: Width on source image
		var source_height; // Number: Height on source image
		var for_length; // Number: Length of array to check
		var gr; // Number: Graphic display ratio for requirements
		var d; // Number: Increment Var for digit place
		var x_position; // Number: X position for the next draw
		var temp_time; // Number: The score to be decreased while being displayed
		var display_digit; // Number: Digit to be displayed
		// Init Function Values
		gr = 2/3;
		menu_top = -170;
		require_column = -211;
		left_column = -107;
		right_column = 93;
		time_now = new Date().getTime();
		// Draw Experiment Label and Number
		m.cc.drawImage(m.mm.menu_image,
			22, 117,
			130, 18,
			m.menu_x + left_column - 65, m.menu_y + menu_top,
			130, 18);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x + left_column,
			y: m.menu_y + menu_top + 45,
			value: m.mm.level_number + 1,
			size: 'large'
		});
		// Draw Required Energy message
		m.cc.drawImage(m.mm.menu_image,
			354, 482,
			132, 14,
			m.menu_x + left_column - 66, m.menu_y + menu_top + 79,
			132, 14);
		// Draw Test Tube with best achieved level
		x_source = 212;
		if (m.gm.my_high_score > m.gm.tube_scores[0]) {
			x_source = 228;
			if (m.gm.my_high_score > m.gm.tube_scores[1]) {
				x_source = 244;
				if (m.gm.my_high_score > m.gm.tube_scores[2]) {
					x_source = 260;
				}
			}
		}
		m.cc.drawImage(m.mm.menu_image,
			x_source, 558,
			15, 62,
			m.menu_x + left_column + 30, m.menu_y + menu_top + 99,
			15, 62);
		// Draw the levels of required energy
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x + left_column + 17,
			y: m.menu_y + menu_top + 110,
			value: m.gm.tube_scores[2],
			size: 'small',
			align: 'right'
		});
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x + left_column + 17,
			y: m.menu_y + menu_top + 130,
			value: m.gm.tube_scores[1],
			size: 'small',
			align: 'right'
		});
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x + left_column + 17,
			y: m.menu_y + menu_top + 150,
			value: m.gm.tube_scores[0],
			size: 'small',
			align: 'right'
		});
		// Display my best high score
		m.cc.drawImage(m.mm.menu_image,
			354, 253,
			140, 14,
			m.menu_x + left_column - 70, m.menu_y + menu_top + 175,
			140, 14);
		BBM({
			com: 'draw',
			draw: 'number',
			x: m.menu_x + left_column,
			y: m.menu_y + menu_top + 203,
			value: m.gm.my_high_score,
			size: 'small'
		});
		// Display Requirements
		if (m.gm.total_requirements > 0) {
			// Display requirments header
			m.cc.drawImage(m.mm.menu_image,
				354, 105,
				132, 15,
				m.menu_x + left_column - 66,
				m.menu_y + menu_top + 222,
				132, 15);
		}
		// loop through all requirements and display them
		y_pos = m.menu_y + menu_top + 242;
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
				m.cc.drawImage(m.mm.menu_image,
					source_x, source_y,
					source_width, source_height,
					m.menu_x + require_column + 75, y_pos,
					Math.floor(source_width * gr),
					Math.floor(source_height * gr));
			}
			if (m.gm.req_shown[i] == 'clear_bonds') {
				source_x = 176;
				source_y = 335;
				m.cc.drawImage(m.mm.menu_image,
					209, 377,
					9, 6,
					m.menu_x + require_column + 88, y_pos + 7,
					9, 6);
				m.cc.drawImage(m.mm.menu_image,
					179, 365,
					26, 30,
					m.menu_x + require_column + 76, y_pos + 2,
					13, 15);
				m.cc.drawImage(m.mm.menu_image,
					179, 365,
					26, 30,
					m.menu_x + require_column + 95, y_pos + 2,
					13, 15);
			}
			if (m.gm.req_shown[i].indexOf('_') == -1) {
				compound_atoms = m.gm.req_shown[i].length;
				for (a = 0; a < compound_atoms - 1; a++) {
					m.cc.drawImage(m.mm.menu_image,
						209, 377,
						9, 6,
						m.menu_x + require_column + 88 + (a * 17),
						y_pos + 7,
						9, 6);
				}
				for (a = 0; a < compound_atoms; a++) {
					source_y = 65 + (m.gm.atom_color_chars.indexOf(
						m.gm.req_shown[i].substr(a, 1)) * 30);
					m.cc.drawImage(m.mm.menu_image,
						179, source_y,
						26, 30,
						m.menu_x + require_column + 76 + (a * 17),
						y_pos + 2,
						13, 15);
				}
			}
			// Draw ALL message for special requirement types
			if (m.gm.req_shown[i] == 'clear_radioactive'
					|| m.gm.req_shown[i] == 'clear_crystal') {
				m.cc.drawImage(m.mm.menu_image,
					456, 65,
					28,14,
					m.menu_x + require_column + 42,
					y_pos + 2,
					28,14);
			} else {
				// Draw requirement amount
				BBM({
					com: 'draw',
					draw: 'number',
					x: m.menu_x + require_column + 63,
					y: y_pos + 10,
					value: m.gm.req_amount[i],
					size: 'small',
					align: 'right'
				});
			}
			y_pos = y_pos + 20;
		}
		if (m.gm.is_time_limited == true) {
			// Display level time
			m.cc.drawImage(m.mm.menu_image,
				354, 85,
				42, 15,
				m.menu_x + right_column - 83,
				m.menu_y + menu_top + 3,
				42, 15);
			temp_time = m.gm.level_duration;
			// Limit the amount of time to be displayed
			if (temp_time > 599999) {
				temp_time = 599999;
			}
			temp_time = Math.floor(temp_time / 10);
			if (temp_time < 0) {
				temp_time = 0;
			}
			// Init function values
			x_position = m.menu_x + right_column - 82;
			// Loop through each of the digit places
			for (d = 1; d < m.time_places; d++) {
				display_digit = Math.floor(temp_time
					/ m.time_place[d]);
				temp_time = temp_time % m.time_place[d];
				m.cc.drawImage(m.mm.menu_image,
					370 + (display_digit * 12), 44,
					10, 14,
					x_position, m.menu_y + menu_top + 20,
					10, 14);
				x_position = x_position + 10;
				if (d == 1) {
					// Add colon after minutes place
					m.cc.drawImage(m.mm.menu_image,
						493, 44,
						7, 14,
						x_position, m.menu_y + menu_top + 20,
						7, 14);
					x_position = x_position + 7;
				}
				if (d == 3) {
					// Add point after seconds place
					m.cc.drawImage(m.mm.menu_image,
						358, 44,
						7, 14,
						x_position, m.menu_y + menu_top + 20,
						7, 14);
					x_position = x_position + 8;
				}
			}
		} else {
			// Display level reactions
			m.cc.drawImage(m.mm.menu_image,
				354, 65,
				92, 15,
				m.menu_x + right_column - 83,
				m.menu_y + menu_top + 3,
				92, 15);
				BBM({
					com: 'draw',
					draw: 'number',
					x: m.menu_x + right_column - 79,
					y: m.menu_y + menu_top + 31,
					value: m.gm.moves - 1,
					size: 'small',
					align: 'left'
				});
		}
		// Draw enhancement message
		m.cc.drawImage(m.mm.menu_image,
			354, 498,
			166, 14,
			m.menu_x + right_column - 83,
			m.menu_y + menu_top + 45,
			166, 14);
		// Draw available enhancements
		for (i = 0; i < 9; i++) {
			x_position = ((i % 3) * 57) + m.menu_x + right_column - 85;
			y_pos = (Math.floor(i / 3) * 57) + m.menu_y + menu_top + 65;
			t.view.displayButton({
				x: x_position + 27,
				y: y_pos + 27,
				id: 'enhance' + i
			});
			if (m.mm.atomic_enhancements[i] == -1) {
				if (t.controller.getButtonActive({
							button_id: 'enhance' + i
						}) == true) {
					t.controller.setButtonActive({
						button_id: 'enhance' + i,
						active: false
					});
					t.view.displayButton({
						x: x_position + 27,
						y: y_pos + 27,
						id: 'enhance' + i
					});
				}
			}
			if (m.mm.atomic_enhancements[i] > -1) {
				if (m.mm.atomic_enhancements[i] == 0) {
					m.cc.drawImage(m.mm.menu_image,
						490, 65,
						11, 14,
						x_position + 7, y_pos + 5,
						11, 14);
				} else {
					BBM({
						com: 'draw',
						draw: 'number',
						x: x_position + 11,
						y: y_pos + 13,
						value: m.mm.atomic_enhancements[i],
						size: 'small'
					});
				}
			}
		}
		// Draw Start Button
		t.view.displayButton({
			x: m.menu_x + right_column,
			y: m.menu_y + menu_top + 272,
			id: 'start'
		});
		t.view.displayButton({
			x: m.menu_x + right_column,
			y: m.menu_y + menu_top + 322,
			id: 'lab'
		});
	};
};

/*
	Contains the code for the custom open / close action of the high scores popup
*/
var PopupMenu_High_Scores = function (t, m) {
	this.drawHighScores = function (com) {
		/*
			Draws the contains of the high score popup
		*/
		var menu_top; // Number: Offset to the top of the menu
		var menu_left; // Number: Offset to the left of the menu
		var y_position; // Number: Y position of current slot
		var total_scores; // Number: Total number of high scores
		var i; // Number: Increment Var
		var font_size; // String: Font to be used to draw with
		var placement; // Number: What place is being displayed
		var icon_width; // Number: The width of the icon
		var icon_height; // Number: The height of the icon
		var display_name; // String: Name to be displayed
		var name_split; // Array: display_name split by " " is order to display just last inital
		var display_font; // String: Font to use for display
		// Init function values
		total_scores = m.gm.high_scores.length;
		menu_top = m.menu_y - 230;
		if (m.gm.high_scores.length > 3) {
    		if (m.gm.high_scores[3].place != 4) {
    			menu_top = m.menu_y - 238;
    		}
    	}
		menu_left = m.menu_x - 116;
		y_position = menu_top;
		// Draw Header
		m.cc.drawImage(m.mm.menu_image,
				354, 233,
				182, 18,
				m.menu_x - 91, y_position,
				182, 18);
		y_position = y_position + 30;
		// Loop through each of the high scores
		for (i = 0; i < total_scores; i++) {
			if (m.gm.high_scores[i].place > 0) {
				placement = m.gm.high_scores[i].place;
				// Select Proper Font for Place
				font_size = 'med';
				if (placement > 9999) {
					font_size = 'small';
				}
				// Display Place as large font
				BBM({
					com: 'draw',
					draw: 'number',
					x: menu_left + 28,
					y: y_position + 10,
					value: placement,
					size: font_size
				});
				// Display player icon
				icon_width = m.gm.high_scores[i].icon.width;
				icon_height = m.gm.high_scores[i].icon.height;
				if (icon_width == 0) {
					m.cc.drawImage(m.mm.menu_image,
						1116, 365,
						38, 38,
						menu_left + 9, y_position + 20,
						38, 38);
				} else {
					m.cc.drawImage(m.gm.high_scores[i].icon,
						0, 0,
						icon_width, icon_height,
						menu_left + 9, y_position + 20,
						38, 38);
				}
				// Display Player Score
				BBM({
					com: 'draw',
					draw: 'number',
					x: m.menu_x,
					y: y_position + 10,
					value: m.gm.high_scores[i].score,
					size: 'med'
				});
				// Display Player Name
				display_name = m.gm.high_scores[i].name;
				name_split = display_name.split(" ");
				if (name_split.length > 1) {
				    display_name = name_split[0] + " " + name_split[1].substr(0, 1).toUpperCase() + ".";
				}
				if (display_name.length > 16) {
					display_name = display_name.substr(0, 16);
				}
				display_font = 'green';
				if (m.gm.high_scores[i].user == true) {
					display_font = 'hilite';
				}
				BBM({
					com: 'draw',
					draw: 'font',
					x: m.menu_x,
					y: y_position + 30,
					text: display_name,
					font: display_font,
					align: 'center'
				});
				// Display Offer Button
				if (m.gm.high_scores[i].button != '') {
					t.view.displayButton({
						x: menu_left + 195,
						y: y_position + 10,
						id: m.gm.high_scores[i].button + '_' + i
					});
				}
				y_position = y_position + 75;
				if (i == 2 && m.gm.high_scores[3].place != 4
						&& m.gm.high_scores[3].place != -1) {
					m.cc.fillStyle = '#000000';
					m.cc.fillRect(menu_left + 11, y_position -5, 202, 2);
					m.cc.fillStyle = '#FFFFFF';
					m.cc.fillRect(menu_left + 10, y_position -4, 202, 2);
					y_position = y_position + 16;
				}
			}
		}
	};
};

/*
	Contains the code for the custom open / close action of the quit sure popup
*/
var PopupMenu_Quit_Sure = function (t, m) {
	this.drawQuitSure = function (com) {
		/*
			Draws the safety box for quiting the game
		*/
		var menu_top; // Number: Offset to the top of the menu
		// Init function values
		menu_top = -85;
		// Draw Quit Message
		m.cc.drawImage(m.mm.menu_image,
			354, 514,
			208, 61,
			m.menu_x - 104, m.menu_y + menu_top,
			208, 61);
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + menu_top + 100,
			id: 'resume'
		});
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + menu_top + 150,
			id: 'lab'
		});
	};
};

/*
	Contains the code for the custom open / close action of the scroll popup
*/
var PopupMenu_Scroll = function (t, m) {
	this.drawLabScroll = function (com) {
		/*
			Draws the level menu corner scroll
		*/
		// Draw either future button or up button
		if (m.mm.lab_number == m.mm.max_lab) {
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + 19,
				id: 'future'
			});
		}  else {
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + 19,
				id: 'up'
			});
		}
		// Draw current lab button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 59,
			id: 'current'
		});
		// Draw either story or down button
		if (m.mm.lab_number == 0) {
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + 99,
				id: 'story'
			});
		}  else {
			t.view.displayButton({
				x: m.menu_x,
				y: m.menu_y + 99,
				id: 'down'
			});
		}
	};
};

/*
	Contains the code for the custom open / close action of the share score popup
*/
var PopupMenu_Share_Score = function (t, m) {
	this.drawShareScore = function (com) {
		/*
			Draw interface for sharing score with friends
		*/
		// Display Back Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'back'
		});
	};
};

/*
	Contains the code for the custom open / close action of the help popup
*/
var PopupMenu_Help = function (t, m) {
	this.drawHelp = function (com) {
		/*
			Display Help
		*/
		// Display Back Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'back'
		});
	};
};

/*
	Contains the code for the custom open / close action of the story popup
*/
var PopupMenu_Story = function (t, m) {
	this.drawStory = function (com) {
		/*
			Display the Story Line
		*/
		// Display Back Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'back'
		});
	};
};

/*
	Contains the code for the custom open / close action of the future popup
*/
var PopupMenu_Future = function (t, m) {
	this.drawFuture = function (com) {
		/*
			Display coming soon/future game
		*/
		// Display Back Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'back'
		});
	};
};

/*
	Contains the code for the custom open / close action of the store popup
*/
var PopupMenu_Store = function (t, m) {
	this.drawStore = function (com) {
		/*
			Display Store interface
		*/
		// Display Back Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'back'
		});
	};
};

/*
	Contains the code for the custom open / close action of the invites popup
*/
var PopupMenu_Invites = function (t, m) {
	this.drawInvites = function (com) {
		this.drawInvite = function (invite_data, scroll_top, index_location) {
			/*
				Draws a single invite onto the invite canvas
			*/
			var y_offset; // Number: The y offset of the start of the draw area
			var x_offset; // Number: The x offset of the start of the draw area
			var icon_width; // Number: The width of the user icon
			var icon_height; // Number: The height of the user icon
			x_offset = (index_location % 2) * 293;
			y_offset = (Math.floor(index_location / 2) * 60) + 10;
			if (y_offset + 40 < scroll_top) {
				return;
			}
			if (y_offset >= scroll_top + m.inner_canvas_height) {
				return;
			}
			if (m.inner_draw) {
				// Draw checkmark
				if (invite_data.checkmark) {
					m.inner_canvas.drawImage(m.mm.menu_image,
						570, 523, 38, 38,
						x_offset + 10, (y_offset - scroll_top) + 1,
						38, 38);
				} else {
					m.inner_canvas.drawImage(m.mm.menu_image,
						570, 483, 38, 38,
						x_offset + 10, (y_offset - scroll_top) + 1,
						38, 38);
				}
				// Draw icon
				icon_width = invite_data.icon_image.width;
				icon_height = invite_data.icon_image.height;
				if (icon_width == 0) {
					m.inner_canvas.drawImage(m.mm.menu_image,
						1116, 365,
						38, 38,
						x_offset + 60, (y_offset - scroll_top) + 1,
						38, 38);
				} else {
					m.inner_canvas.drawImage(invite_data.icon_image,
						0, 0,
						icon_width, icon_height,
						x_offset + 60, (y_offset - scroll_top) + 1,
						38, 38);
				}
				// Draw name
				m.inner_draw.controller.font({
					x: x_offset + 110,
					y: (y_offset - scroll_top) + 10,
					text: invite_data.name,
					font: 'green',
					scale: 1
				});
			}
		};
		/*
			Display coming soon/future game
		*/
		var i; // Number: Increment Var
		var invite_top; // Number: The scroll top of the invite div
		// Draw the heading line
		BBM({
			com: 'draw',
			draw: 'font',
			x: m.menu_x,
			y: m.menu_y - 200,
			align: 'center',
			text: 'INVITE FRIENDS TO PLAY',
			scale: 2,
			font: 'green'
		});
		// clear the inner canvas
		if (m.inner_canvas) {
			m.inner_canvas.clearRect(0, 0, m.inner_canvas_width, m.inner_canvas_height);
		}
		// draw possible invites
		invite_top = $(".invites-container").scrollTop();
		for (i = 0; i < m.search_matches; i++) {
			this.drawInvite(m.mm.invites[m.search_match_list[i]], invite_top, i);
		}
		// Display Select All Checkbox and Message
		if (m.select_all == false) {
        	// Display Select All Checkbox (empty)
            t.view.displayButton({
        	    x: m.menu_x - 266,
        	    y: m.menu_y + 189,
        	    id: 'nomark' 
            });
        } else {
        	// Display Select All Checkbox (mark)
            t.view.displayButton({
        	    x: m.menu_x - 266,
        	    y: m.menu_y + 189,
        	    id: 'checkmark' 
            });
        }
		BBM({
			com: 'draw',
			draw: 'font',
			x: m.menu_x - 241,
			y: m.menu_y + 181,
			text: 'SELECT ALL',
			font: 'green'
		});
		// Draw search button
		t.view.displayButton({
			x: m.menu_x + 155,
			y: m.menu_y - 130,
			id: 'current'
		});
		// Display Invite Button
		t.view.displayButton({
			x: m.menu_x,
			y: m.menu_y + 189,
			id: 'invite'
		});
		// Display Invite Button
		t.view.displayButton({
			x: m.menu_x + 193,
			y: m.menu_y + 189,
			id: 'next'
		});
	};
};

/*
	Contains the code for the custom open / close action of the loading popup
*/
var PopupMenu_Loading = function (t, m) {
	this.drawLoading = function () {
		/*
			Draw the level loading message
		*/
		BBM({
			com: 'draw',
			draw: 'font',
			x: m.menu_x,
			y: m.menu_y - 10,
			align: 'center',
			text: 'Setting up experiment...',
			font: 'green'
		});
	};
};