/*
    Code for a Big Bang Game piece (atom)
*/

var ATOM; // Function: Contains MVC for game piece

ATOM = function (command) {
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
            x: 0, // Number: X position of the left edge of the atom on the canvas
            y: 0, // Number: Y position of the top edge of the atom on the canvas
            id: '', // String: Unique table id
            neighbors: ['', '', '', '', '', ''], // Array: Neighboring hexes
            slide: ['', '', '', '', '', ''], // Array: atoms that can be slid
            type: 0, // Number: Type of atom
            color: -1, // Number: Color of atom
            move_counter: -1, // Number: Number of move until atom executes its action
            teleport: '', // String: atom_id of the down direction for teleporting
            bonds: ['', '', '', '', '', ''], // Array: atom_id of bond for a direction
            falls: ['', '', ''], // Array: Fall to atom_id (slash, vert, backslash)
            drops: ['', '', ''], // Array: Atom ids from where atom would fall in
            radiation: 0, // Number: Radiation level of the hex (0 to 2)
            nucleus_locked: false, // Boolean: Is locked to a nucleus
            nucleus_matched: false, // Boolean: Has atom been matched to a nucleus?
            locked: false, // Boolean: Is atom locked in place
            has_shield: false, // Boolean: Is the atom shielded?
            is_creator: false, // Boolean: Does this create an atom when empty?
            is_teleporter_target: false, // Boolean: Is a teleporter target?
            is_enter_point: false, // Boolean: Is entrance point?
            is_exit_point: false, // Boolean: Is exit point?
            is_moving: false, // Boolean: Is atom moving?
            is_teleporting: false, // Boolean: Is atom teleporting?
            is_exploding: false, // Boolean: Is atom exploding?
            is_crumbling: false, // Boolean: Is crystal crumbling?
            is_hinted: false, // Boolean: Is atom being hinted?
            is_spreading: false, // Boolean: Is crystal spreading to this atom?
            is_fogged: false, // Boolean: Is the hex fog covered?
            is_creating: false, // Boolean: Is Atom Generator Creating?
            create_start: -1, // Number: Time at which atom creation was started
            create_duration: 0, // Number: Length of milliseconds to run create animation for
            spread_start: -1, // Number: Time of the start of crystal spread (milliseconds)
            spread_time: -1, // Number: Duration of crystal spread (milliseconds)
            explode_start: -1, // Number: Time of the start of the explosion (milliseconds)
            explode_time: -1, // Number: Duration of the explosion (milliseconds)
            explode_ratio: 0, // Number: Percentage of explosion completion
            move_x_start: 0, // Number: X location where move started from
            move_y_start: 0, // Number: Y location where move started from
            move_x_delta: 0, // Number: X difference from start to current
            move_y_delta: 0, // Number: Y difference from start to current
            move_start: -1, // Number: Time that movement started (milliseconds)
            move_time: -1, // Number: Duration of move (milliseconds)
            move_ratio: -1, // Number: Percentage of move completion at last draw
            fizz_start: -1, // Number: Time that fizz started (milliseconds)
            fizz_time: -1, // Number: Duration of fizz (milliseconds)
            fizz_ratio: 0, // Number: Percentage of fizz completion
            fizz_state: 'none', // String: Current state of fizz
            animation_step: -1, // Number: Increment var for animating atoms
            max_step: 20, // Number: Flip number for animation_step
            frame_step: 5, // Number: Number of counts for a frame
            hint_arrow: -1, // Number: Hex direction of the hint arrow
            usage_mode: '', // String: How is the atom being used
            hint_x_dif: [], // Array: X-offset to neighboring hexes
            hint_y_dif: [], // Array: Y-offset to neighboring hexes
            hint_x_source: [1052, 1067, 1082, 1082, 1067, 1052],
                // Array: X-location of hint arrows on sprite sheet
            hint_y_source: [592, 601, 592, 573, 564 , 573],
                // Array: Y-location of hint arrows on sprite sheet
            im: null, // Object: Pointer to the image data model
            mm: null, // Object: Pointer to the menu data model
            gm: null // Object: Pointer to the main game data model
        };
    }
    m = this.model;
    if (!this.view) {
        this.view = {
            drawAtomBackground: function (com) {
                /*
                    Draws the background of the atom on the canvas
                */
                var x_source; // Number: The x-location on the sprite sheet of the atom to use
                var y_source; // Number: The y-location on the sprite sheet of the atom to use
                var sprite_frame; // Number: The frame of the atom animation
                var i; // Number: Increment Var
                m.animation_step = m.animation_step + 1;
                if (m.animation_step >= m.max_step) {
                    m.animation_step = 0;
                }
                sprite_frame = Math.floor(m.animation_step / m.frame_step);
                if (m.gm) {
                    if (m.id != "") {
                        // Draw radiation of the hex
                        if (m.radiation > 0) {
                            x_source = (3 + m.radiation) * m.gm.atom_width;
                            y_source = (8 + sprite_frame) * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image, x_source, y_source,
                                m.gm.atom_width, m.gm.atom_height, m.x, m.y,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                        // draw teleporter pad
                        y_source = 12 * m.gm.atom_height;
                        if (m.teleport != "") {
                            x_source = (sprite_frame + 14) * m.gm.atom_width;
                            m.gm.cc.drawImage(m.im.atom_image, x_source, y_source,
                                m.gm.atom_width, m.gm.atom_height, m.x, m.y,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                        // draw bonds
                        for (i = 0; i < 6; i++) {
                            if (m.bonds[i] != '') {
                                x_source = (i + 8) * m.gm.atom_width;
                                m.gm.cc.drawImage(m.im.atom_image, x_source,
                                    y_source, m.gm.atom_width, m.gm.atom_height,
                                    m.x, m.y, m.gm.atom_width, m.gm.atom_height);
                            }
                        }
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'drawAtom',
                        error: 'game data model not linked',
                        error_value: ''
                    });
                }     
            },
            drawAtom: function (com) {
                /*
                    Draws the atom body on the canvas
                    
                    Arguments
                    m.builder_data: The data model from builder
                */
                var x_source; // Number: The x-location on the sprite sheet of the atom to use
                var y_source; // Number: The y-location on the sprite sheet of the atom to use
                var sprite_frame; // Number: The frame of the atom animation
                var x_target; // Number: The x-location on the screen
                var y_target; // Number: The y-location of the screen
                var is_visible; // Boolean: Is atom visible?
                var hint_alpha; // Number: Alpha value of hinted atom
                if (m.gm) {
                    is_visible = true;
                    if (m.id == "") {
                        is_visible = false;
                    }
                    if (m.explode_ratio > .75
                            && (m.type < m.gm.atom_types.big_bang
                            || m.type > m.gm.atom_types.bang_full)) {
                        is_visible = false;
                    }
                    if (is_visible == true) {
                        // Set default screen location 
                        x_target = m.x;
                        y_target = m.y;
                        if (m.is_moving == true) {
                            if (m.move_start > -1) {
                                m.move_ratio = (new Date().getTime()
                                    - m.move_start) / m.move_time;
                                if (m.move_ratio > 1) {
                                    m.move_ratio = 1;
                                }
                                if (m.is_teleporting == false) {
                                    x_target = m.move_x_start + (m.move_ratio
                                        * m.move_x_delta);
                                    y_target = m.move_y_start + (m.move_ratio
                                        * m.move_y_delta);
                                }
                            }
                        }
                        // Set default non-draw value for x_source
                        sprite_frame = Math.floor(m.animation_step
                            / m.frame_step);
                        x_source = -1;
                        // Change opacity if atom is being hinted
                        if (m.is_hinted == true) {
                            hint_alpha = 0.25
                                + (m.animation_step / m.max_step);
                            if (hint_alpha > 1) {
                                hint_alpha = 1;
                            }
                            m.gm.cc.globalAlpha = hint_alpha;
                        }
                        // draw main atom body
                        switch (m.type) {
                            case m.gm.atom_types.unused:
                                if (m.usage_mode == 'editor') {
                                    x_source = 0;
                                    y_source = 13 * m.gm.atom_height;
                                }
                                break;
                            case m.gm.atom_types.atom:
                                x_source = m.color * m.gm.atom_width;
                                y_source = 0;
                                if (m.nucleus_matched == true) {
                                    y_source = sprite_frame * m.gm.atom_height;
                                }
                                break;
                            case m.gm.atom_types.radioactive:
                                x_source = (m.color + 9) * m.gm.atom_width;
                                y_source = sprite_frame * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.blackhole:
                                x_source = m.color * m.gm.atom_width;
                                y_source = ((m.animation_step % 4) + 4)
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.nucleus:
                                x_source = (m.color + 9) * m.gm.atom_width;
                                y_source = (sprite_frame + 4)
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.void:
                                x_source = (sprite_frame + 1)
                                    * m.gm.atom_width;
                                y_source = 12 * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bond_vert:
                                x_source = 5 * m.gm.atom_width;
                                y_source = 12 * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bond_slash:
                                x_source = 6 * m.gm.atom_width;
                                y_source = 12 * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bond_backslash:
                                x_source = 7 * m.gm.atom_width;
                                y_source = 12 * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.crystal:
                                x_source = 10 * m.gm.atom_width;
                                y_source = 9 * m.gm.atom_height;
                                if (m.is_crumbling == true) {
                                    x_source = -1;
                                }
                                break;
                            case m.gm.atom_types.antimatter:
                                x_source = 0;
                                y_source = (8 + sprite_frame)
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.big_bang:
                                x_source = 6 * m.gm.atom_width;
                                y_source = (8 + sprite_frame)
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bang_vert:
                                x_source = (m.color + 18) * m.gm.atom_width;
                                y_source = (sprite_frame % 2)
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bang_slash:
                                x_source = (m.color + 18) * m.gm.atom_width;
                                y_source = (2 + (sprite_frame % 2))
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bang_backslash:
                                x_source = (m.color + 18) * m.gm.atom_width;
                                y_source = (4 + (sprite_frame % 2))
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bang_full:
                                x_source = (m.color + 18) * m.gm.atom_width;
                                y_source = (6 + (sprite_frame % 2))
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.bang_plasma:
                                x_source = (m.color + 18) * m.gm.atom_width;
                                y_source = (8 + (sprite_frame % 2))
                                    * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.freeze:
                                x_source = (m.color + 18) * m.gm.atom_width;
                                y_source = 10 * m.gm.atom_height;
                                break;
                            case m.gm.atom_types.random_atom:
                                x_source = 0;
                                y_source = 12 * m.gm.atom_height;
                                break;
                            default:
                                if (m.type >= m.gm.atom_types.absorber
                                        && m.type
                                        <= m.gm.atom_types.absorber_x7) {
                                    x_source = (7 + (m.type
                                        - m.gm.atom_types.absorber))
                                        * m.gm.atom_width;
                                    y_source = 8 * m.gm.atom_height;
                                }
                        }
                        if (x_source > -1) {
                            m.gm.cc.drawImage(m.im.atom_image, x_source,
                                y_source, m.gm.atom_width, m.gm.atom_height,
                                x_target, y_target, m.gm.atom_width,
                                m.gm.atom_height);
                            // Draw Move Counter
                            if (m.move_counter > -1) {
                                x_source = (m.move_counter + 5)
                                    * m.gm.atom_width;
                                if (x_source > 20 * m.gm.atom_width) {
                                    x_source = 20 * m.gm.atom_width;
                                }
                                y_source = 13 * m.gm.atom_height;
                                m.gm.cc.drawImage(m.im.atom_image, x_source,
                                    y_source, m.gm.atom_width, m.gm.atom_height,
                                    x_target, y_target, m.gm.atom_width,
                                    m.gm.atom_height);
                            }
                        }
                        // Draw Small Bang Power-Up
                        if (m.type == m.gm.atom_types.bang_small) {
                            x_source = (m.color + 18) * m.gm.atom_width;
                            y_source = (6 + (sprite_frame % 2))
                                    * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image, x_source,
                                y_source, m.gm.atom_width, m.gm.atom_height,
                                x_target + (m.gm.atom_width * 0.25),
                                y_target + (m.gm.atom_width * 0.25) - 2,
                                m.gm.atom_width * 0.5,
                                m.gm.atom_height * 0.5);
                        }
                        // Draw Medium Bang Power-Up
                        if (m.type == m.gm.atom_types.bang_medium) {
                            x_source = (m.color + 18) * m.gm.atom_width;
                            y_source = (6 + (sprite_frame % 2))
                                    * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image, x_source,
                                y_source, m.gm.atom_width, m.gm.atom_height,
                                x_target + (m.gm.atom_width * 0.125),
                                y_target + (m.gm.atom_width * 0.125) - 1,
                                m.gm.atom_width * 0.75,
                                m.gm.atom_height * 0.75);
                        }
                        // Draw Atom Shield
                        if (m.has_shield == true) {
                            x_source = 3 * m.gm.atom_width;
                            y_source = (8 + sprite_frame) * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image, x_source,
                                y_source, m.gm.atom_width, m.gm.atom_height,
                                x_target, y_target, m.gm.atom_width,
                                m.gm.atom_height);
                        }
                        // Draw teleporter beam
                        if (m.is_teleporting == true) {
                            // Draw beam at target
                            x_source = (16 - Math.floor(m.move_ratio * 2.9999))
                                * m.gm.atom_width;
                            y_source = 9 * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image, x_source,
                                y_source, m.gm.atom_width, m.gm.atom_height,
                                x_target, y_target, m.gm.atom_width,
                                m.gm.atom_height);
                            // Draw beam at source
                            x_source = (14 + Math.floor(m.move_ratio * 2.9999))
                                * m.gm.atom_width;
                            y_source = 9 * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image, x_source,
                                y_source, m.gm.atom_width, m.gm.atom_height,
                                m.move_x_start, m.move_y_start,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                        // clear movement and teleporting if ratio is done (1)
                        if (m.move_ratio == 1) {
                            m.is_moving = false;
                            m.is_teleporting = false;
                        }
                        // Change opacity if atom is being hinted
                        if (m.is_hinted == true) {
                            m.gm.cc.globalAlpha = 1;
                        }
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'drawAtom',
                        error: 'game data model not linked',
                        error_value: ''
                    });
                }
            },
            drawAtomForeground: function (com) {
                /*
                    Draws the atom body on the canvas
                    
                    Arguments
                    m.builder_data: The data model from builder
                */
                var x_arrow; // Number: The x-location to display hint arrow
                var y_arrow; // Number: The y-location to display hint arrow
                var x_source; // Number: The x-location on the sprite sheet of the atom to use
                var y_source; // Number: The y-location on the sprite sheet of the atom to use
                var hint_ratio; // Number: Ratio of hint arrow movement
                var sprite_frame; // Number: The frame of the atom animation
                var spread_ratio; // Number: Ratio of spread animation completion
                if (m.gm) {
                    if (m.id != "") {
                        sprite_frame = Math.floor(m.animation_step
                            / m.frame_step);
                        // Draw atom explosion
                        if (m.is_exploding == true) {
                            m.explode_ratio = (new Date().getTime()
                                - m.explode_start) / m.explode_time;
                            if (m.explode_ratio > 1) {
                                m.explode_ratio = 1;
                            }
                            if (m.explode_ratio >= 0 && m.explode_ratio < 1) {
                                x_source = (7 + Math.floor(m.explode_ratio
                                    * 6.999)) * m.gm.atom_width;
                                y_source = 11 * m.gm.atom_height;
                                if (m.is_crumbling == true) {
                                    x_source = (11 + Math.floor(m.explode_ratio
                                        * 2.999)) * m.gm.atom_width;
                                    y_source = 9 * m.gm.atom_height;
                                }
                                m.gm.cc.drawImage(m.im.atom_image,
                                    x_source, y_source,
                                    m.gm.atom_width, m.gm.atom_height,
                                    m.x, m.y,
                                    m.gm.atom_width, m.gm.atom_height);
                            }
                        }
                        // Draw Crystal Spread Overlay
                        if (m.is_spreading == true) {
                            spread_ratio = (new Date().getTime()
                                - m.spread_start) / m.spread_time;
                            if (spread_ratio > 1) {
                                spread_ratio = 1;
                            }
                            x_source = (7 + Math.floor(spread_ratio * 3.999))
                                * m.gm.atom_width;
                            y_source = 9 * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image,
                                x_source, y_source,
                                m.gm.atom_width, m.gm.atom_height,
                                m.x, m.y,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                        // Draw fizz overlay
                        if (m.fizz_start > -1) {
                            if (m.fizz_state != 'none') {
                                y_source = 10 * m.gm.atom_height;
                                m.fizz_ratio = (new Date().getTime()
                                    - m.fizz_start)
                                    / m.fizz_time;
                                if (m.fizz_ratio >1) {
                                    m.fizz_ratio = 1;
                                }
                                switch (m.fizz_state) {
                                    case 'form':
                                        x_source = (7 + Math.floor(
                                            m.fizz_ratio * 2.999))
                                            * m.gm.atom_width;
                                        break;
                                    case 'cover':
                                        x_source = (10 + t.controller.rnd({
                                                max: 4
                                            })) * m.gm.atom_width;
                                        break;
                                    case 'clear':
                                        x_source = (9 - Math.floor(
                                            m.fizz_ratio * 2.999))
                                            * m.gm.atom_width;
                                        break;
                                }
                                m.gm.cc.drawImage(m.im.atom_image,
                                    x_source, y_source,
                                    m.gm.atom_width, m.gm.atom_height,
                                    m.x, m.y,
                                    m.gm.atom_width, m.gm.atom_height);
                            }
                        }
                        if (m.usage_mode == 'editor') {
                            // Draw atom creator
                            if (m.is_creator == true) {
                                x_source = (14 + Math.abs(sprite_frame - 1))
                                    * m.gm.atom_width;
                                y_source = 8 * m.gm.atom_height;
                                if (!m.gm.generators) {
                                	m.gm.generators = {};	
                                }
                                if (m.gm.generators[m.id]) {
                                    x_source = 17 * m.gm.atom_width;
                                    y_source = (8 + (sprite_frame % 2))
                                        * m.gm.atom_height;
                                }
                                m.gm.cc.drawImage(m.im.atom_image,
                                    x_source, y_source,
                                    m.gm.atom_width, m.gm.atom_height,
                                    m.x, m.y,
                                    m.gm.atom_width, m.gm.atom_height);
                            }
                        } else {
                            // Draw teleporter target
                            if (m.is_teleporter_target == true) {
                                x_source = (14 + sprite_frame) 
                                    * m.gm.atom_width;
                                y_source = 10 * m.gm.atom_height;
                                m.gm.cc.drawImage(m.im.atom_image,
                                    x_source, y_source,
                                    m.gm.atom_width, m.gm.atom_height,
                                    m.x, m.y,
                                    m.gm.atom_width, m.gm.atom_height);
                            }
                        }
                        // Draw entrance point
                        if (m.is_enter_point == true) {
                            x_source = m.gm.atom_width;
                            y_source = (8 + sprite_frame) * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image,
                                x_source, y_source,
                                m.gm.atom_width, m.gm.atom_height,
                                m.x, m.y,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                        // Draw exit point
                        if (m.is_exit_point == true) {
                            x_source = m.gm.atom_width + m.gm.atom_width;
                            y_source = (8 + sprite_frame) * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image,
                                x_source, y_source,
                                m.gm.atom_width, m.gm.atom_height,
                                m.x, m.y,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                        // Draw atom generator
                        if (m.type == m.gm.atom_types.generator) {
                            x_source = 15 * m.gm.atom_width;
                            y_source = 11 * m.gm.atom_height;
                            if (m.create_start > -1) {
                                if (new Date().getTime() - m.create_start
                                        > m.create_duration) {
                                    m.create_start = -1;
                                }
                                x_source = x_source + ((sprite_frame % 2)
                                    * m.gm.atom_width);
                            }
                            m.gm.cc.drawImage(m.im.atom_image,
                                x_source, y_source,
                                m.gm.atom_width, m.gm.atom_height,
                                m.x, m.y,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                        // Draw hint arrow
                        if (m.hint_arrow > -1) {
                            hint_ratio = m.animation_step / (m.max_step - 1);
                            x_arrow = m.x + (m.gm.atom_width / 2) + Math.floor(
                                m.hint_x_dif[m.hint_arrow] * hint_ratio) - 5;
                            y_arrow = m.y - m.gm.z_inc + Math.floor(
                                m.hint_y_dif[m.hint_arrow] * hint_ratio) - 5;
                            m.gm.cc.drawImage(m.im.atom_image,
                                m.hint_x_source[m.hint_arrow],
                                m.hint_y_source[m.hint_arrow],
                                11, 10,
                                x_arrow, y_arrow,
                                11, 10);
                        }
                        // Draw fog
                        if (m.is_fogged) {
                            x_source = 18 * m.gm.atom_width;
                            y_source = 12 * m.gm.atom_height;
                            m.gm.cc.drawImage(m.im.atom_image,
                                x_source, y_source,
                                m.gm.atom_width, m.gm.atom_height,
                                m.x, m.y,
                                m.gm.atom_width, m.gm.atom_height);
                        }
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'drawAtom',
                        error: 'game data model not linked',
                        error_value: ''
                    });
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
                    All non .com vars are stored in the atom data model
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
                // Set the image data model
                if (m.mm) {
                    m.im = m.mm;
                } else {
                    if (m.gm) {
                        m.im = m.gm;
                    } 
                }
                // Init neighboring hexes offsets
                m.hint_x_dif.push(-m.gm.x_inc);
                m.hint_y_dif.push(-m.gm.z_inc);
                m.hint_x_dif.push(0);
                m.hint_y_dif.push(m.gm.y_inc);
                m.hint_x_dif.push(m.gm.x_inc);
                m.hint_y_dif.push(-m.gm.z_inc);
                m.hint_x_dif.push(m.gm.x_inc);
                m.hint_y_dif.push(m.gm.z_inc);
                m.hint_x_dif.push(0);
                m.hint_y_dif.push(-m.gm.y_inc);
                m.hint_x_dif.push(-m.gm.x_inc);
                m.hint_y_dif.push(m.gm.z_inc);
                //
                return t;
            },
            clearAtom: function (com) {
                /*
                    Remove all existing data about the atom
                    and return it to pre user state
                */
                m.type = 0;
                m.color = -1;
                m.move_counter = -1;
                m.teleport = '';
                m.bonds = ['', '', '', '', '', ''];
                m.falls = ['', '', ''];
                m.radiation = 0;
                m.locked = false;
                m.has_shield = false;
                m.is_enter_point = false;
                m.is_exit_point = false;
                m.is_creator = false;
                m.is_teleporter_target = false;
                m.is_spreading = false;
                m.is_fogged = false;
            },
            copyAtom: function (com) {
                /*
                    Copy atom data to another atom
                    
                    Arguments
                    com.atom_id: The target copy to copy to
                */
                var i; // Number: Increment Var
                if (com.atom_id != '') {
                    m.gm.atoms[com.atom_id].controller.setType({
                        type: m.type
                    });
                    m.gm.atoms[com.atom_id].controller.setColor({
                        color: m.color
                    });
                    m.gm.atoms[com.atom_id].controller.setMoveCounter({
                        moves: m.move_counter
                    });
                    m.gm.atoms[com.atom_id].controller.setEntryPoint({
                        is_entry: m.is_enter_point
                    });
                    m.gm.atoms[com.atom_id].controller.setExitPoint({
                        is_exit: m.is_exit_point
                    });
                    m.gm.atoms[com.atom_id].controller.setRadiation({
                        level: m.radiation
                    });
                    m.gm.atoms[com.atom_id].controller.setShield({
                        is_shielded: m.has_shield
                    });
                     m.gm.atoms[com.atom_id].controller.setAtomCreator({
                        is_creator: m.is_creator
                    });
                    m.gm.atoms[com.atom_id].controller.setTeleporter({
                        atom_id: m.teleport
                    });
                    for (i = 0; i < 3; i++) {
                        m.gm.atoms[com.atom_id].controller.setFall({
                            direction: i,
                            atom_id: m.falls[i]
                        });
                    }
                    for (i = 0; i < 6; i++) {
                        m.gm.atoms[com.atom_id].controller.setBonding({
                            direction: i,
                            atom_id: m.bonds[i],
                            self_okay: true
                        });
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'copyAtom',
                        error: 'target atom_id is blank',
                        error_value: ''
                    });
                }
            },
            clearContents: function (com) {
                /*
                    Clears just the atom data, and not the
                    hex data
                */
                m.type = 0;
                m.color = -1;
                m.move_counter = -1;
                m.has_shield = false;
            },
            copyContents: function (com) {
                /*
                    Move just atom data, and not the hex
                    data, to another atom
                    
                    Arguments
                    com.atom_id: The target copy to copy to
                */
                if (com.atom_id != '') {
                    m.gm.atoms[com.atom_id].controller.setType({
                        type: m.type
                    });
                    m.gm.atoms[com.atom_id].controller.setColor({
                        color: m.color
                    });
                    m.gm.atoms[com.atom_id].controller.setMoveCounter({
                        moves: m.move_counter
                    });
                    m.gm.atoms[com.atom_id].controller.setShield({
                        is_shielded: m.has_shield
                    });
                } else {
                    t.controller.consoleError({
                        method_name: 'moveAtom',
                        error: 'target atom_id is blank',
                        error_value: ''
                    });
                }
            },
            insideHex: function (com) {
                /*
                    Check to see if a point is inside of the atom hex area
                    
                    Arguments
                    com.x: The x-loc of the point
                    com.y: The y-loc of the point
                    
                    Returns
                    A boolean that is true if the point is inside the hex.
                */
                var is_inside; // Boolean: Is the point inside the hex?
                var x_delta; // Number: com.x minus left edge
                var y_delta; // Number: com.y minus top edge
                var slope; // Number: Slope value of line at y-loc
                is_inside = false;
                if (m.gm) {
                    if (com.y >= m.y && com.y < m.y + m.gm.atom_height) {
                        if (com.x >= m.x && com.x < m.x + m.gm.atom_width) {
                            x_delta = com.x - m.x;
                            y_delta = com.y - m.y;
                            slope = Math.abs(y_delta - (m.gm.atom_height / 2))
                                * (m.gm.atom_wing / (m.gm.atom_height / 2));
                            if (x_delta < m.gm.atom_wing) {
                                // Check left wing of hex area
                                if (x_delta > slope) {
                                    is_inside = true;
                                }
                            } else {
                                if (x_delta > m.gm.atom_width - m.gm.atom_wing) {
                                    // Check right wing of hex area
                                    slope = m.gm.atom_wing - slope;
                                    if (x_delta - (m.gm.atom_width -
                                            m.gm.atom_wing) < slope) {
                                        is_inside = true;
                                    }
                                } else {
                                    // Inside hex rectangle
                                    is_inside = true;
                                }
                            }
                        }
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'insideHex',
                        error: 'game data model not linked',
                        error_value: ''
                    });
                }
                return is_inside;
            },
            getPosition: function (com) {
                /*
                    Returns the x and y of the this atom
                    
                    Returns
                    x and y in an object
                */
                var position; // Object: Holds x and y values
                position = {};
                position.x = m.x;
                position.y = m.y;
                return position;
            },
            getType: function (com) {
                /*
                    Getter for atom type
                    
                    Returns
                    ENUM for the atom type
                */
                return m.type;
            },
            setType: function (com) {
                /*
                    Setter for atom type
                    
                    Arguments
                    com.type = ENUM for the atom type
                */
                if (com.type >= m.gm.atom_types_min
                        && com.type <= m.gm.atom_types_max) {
                    m.type = com.type;
                } else {
                    t.controller.consoleError({
                        method_name: 'setType',
                        error: 'value out of range',
                        error_value: '(' + com.type + ')'
                    });  
                }
            },
            getColor: function (com) {
                /*
                    Getter for atom color
                    
                    Returns
                    ENUM for the atom color
                */
                return m.color;
            },
            setColor: function (com) {
                /*
                    Setter for atom color
                    
                    Arguments
                    com.color = ENUM for the atom color
                */
                if (com.color >= m.gm.atom_colors_min
                        && com.color <= m.gm.atom_colors_max) {
                    m.color = com.color;
                } else {
                    t.controller.consoleError({
                        method_name: 'setColor',
                        error: 'value out of range',
                        error_value: com.color
                    });
                }
            },
            getX: function (com) {
                /*
                    Getter for atom X
                    
                    Returns
                    X for the atom
                */
                return m.x;
            },
            setX: function (com) {
                /*
                    Setter for atom X
                    
                    Arguments
                    com.x: The x position
                */
                m.x = com.x;
            },
            getY: function (com) {
                /*
                    Getter for atom Y
                    
                    Returns
                    Y for the atom
                */
                return m.y;
            },
            setY: function (com) {
                /*
                    Setter for atom Y
                    
                    Arguments
                    com.y: The y position
                */
                m.y = com.y;
            },
            getMoveCounter: function (com) {
                /*
                    Returns the count value
                    
                    Returns
                    Number of moves until atom triggers its action
                */
                return m.move_counter;      
            },
            setMoveCounter: function (com) {
                /*
                    Sets the number of moves until the atom triggers
                    its action
                    
                    Arguments
                    com.moves: Number of move to store
                */
                if (com.moves < -1) {
                    t.controller.consoleError({
                        method_name: 'setMoveCount',
                        error: 'value out of range',
                        error_value: com.moves
                    });
                } else {
                    m.move_counter = com.moves;
                }
            },
            getAtomCreator: function (com) {
                /*
                    Returns whether this atom creates atoms
                    when empty
                    
                    Returns
                    Boolean for whether this atom creates
                    atoms when empty
                */
                return m.is_creator;
            },
            setAtomCreator: function (com) {
                /*
                    Set whether this atom creates atoms
                    when empty
                    
                    Arguments
                    com.is_creator: Boolean for whether this is a teleporter
                        target
                */
                m.is_creator = com.is_creator;
            },
            getTeleporterTarget: function (com) {
                /*
                    Returns whether this is a teleporter
                    target
                    
                    Returns
                    Boolean for whether this is a teleporter
                    target
                */
                return m.is_teleporter_target;
            },
            setTeleporterTarget: function (com) {
                /*
                    Set whether this is a teleporter
                    target
                    
                    Arguments
                    com.is_target: Boolean for whether this is a teleporter
                        target
                */
                m.is_teleporter_target = com.is_target;
            },
            getTeleporter: function (com) {
                /*
                    Returns the teleport value of the atom
                    
                    Returns
                    Teleport id value
                */
                return m.teleport;
            },
            setTeleporter: function (com) {
                /*
                    Sets the teleporter value for the atom
                    
                    Arguments
                    com.atom_id: The id of the atom that the teleport links to
                */
                m.teleport = com.atom_id;
            },
            getEntryPoint: function (com) {
                /* 
                    Get entry point value
                    
                    Returns:
                    A boolean value for entry point present
                */
                return m.is_enter_point;
            },
            setEntryPoint: function (com) {
                /*
                    Sets the teleporter value for the atom
                    
                    Arguments
                    com.is_entry: Boolean value for if the atom is an entry point
                */
                m.is_enter_point = com.is_entry;
            },
            getExitPoint: function (com) {
                /* 
                    Get exit point value
                    
                    Returns:
                    A boolean value for exit point present
                */
                return m.is_exit_point;
            },
            setExitPoint: function (com) {
                /*
                    Sets the teleporter value for the atom
                    
                    Arguments
                    com.is_exit: Boolean value for if the atom is an entry point
                */
                m.is_exit_point = com.is_exit;
            },
            getRadiation: function (com) {
                /* 
                    Get radiation value
                    
                    Returns:
                    A number with radiation level
                */
                return m.radiation;
            },
            setRadiation: function (com) {
                /*
                    Sets the teleporter value for the atom
                    
                    Arguments
                    com.level: Radiation level of the hex
                */
                m.radiation = com.level;
            },
            getShield: function (com) {
                /* 
                    Get shield value
                    
                    Returns:
                    A boolean value for shielding
                */
                return m.has_shield;
            },
            setShield: function (com) {
                /*
                    Sets the teleporter value for the atom
                    
                    Arguments
                    com.is_shielded: Boolean value for if the atom is shielded
                */
                m.has_shield = com.is_shielded;  
            },
            getDrop: function (com) {
                /*
                    Gets the drops value for 3 positions
                    
                    Returns
                    An array with the 3 drop directions (slash, vert, backslash)
                */
                return m.drops;  
            },
            setDrops: function (com) {
                /*
                    Sets all drop directions at once from
                    an array
                    
                    Arguments
                    com.drops: An array with the 3 drop directions
                */
                var d; // Number: Increment var for directions
                if (com.drops.length == 3) {
                    for (d = 0; d < 3; d++) {
                        m.drops[d] = com.drops[d];    
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'setDrops',
                        error: 'Argument array wrong length',
                        error_value: String(com.drops)
                    });
                }
            },
            setDrop: function (com) {
                /*
                    Sets the drop value for 3 positions
                    
                    Arguments
                    com.direction: Direction of the drop (0-2)
                    com.atom_id: atom_id of the linked atom
                */
                if (com.direction >= 0 && com.direction <= 2) {
                    m.drops[com.direction] = com.atom_id;
                } else {
                    t.controller.consoleError({
                        method_name: 'setDrop',
                        error: 'direction value out of range',
                        error_value: com.direction
                    });
                }
            },
            getFall: function (com) {
                /*
                    Gets the falling value for 3 positions
                    
                    Returns
                    An array with the 3 fall directions (slash, vert, backslash)
                */
                return m.falls;
            },
            setFalls: function (com) {
                /*
                    Sets all fall directions at once from
                    an array
                    
                    Arguments
                    com.falls: An array with the 3 fall directions
                */
                var d; // Number: Increment var for directions
                if (com.falls.length == 3) {
                    for (d = 0; d < 3; d++) {
                        m.falls[d] = com.falls[d];    
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'setFalls',
                        error: 'Argument array wrong length',
                        error_value: String(com.falls)
                    });
                }
            },
            setFall: function (com) {
                /*
                    Sets the falling value for 3 positions
                    
                    Arguments
                    com.direction: Direction of the link (0-2)
                    com.atom_id: atom_id of the linked atom
                */
                if (com.direction >= 0 && com.direction <= 2) {
                    m.falls[com.direction] = com.atom_id;
                } else {
                    t.controller.consoleError({
                        method_name: 'setFall',
                        error: 'direction value out of range',
                        error_value: com.direction
                    });
                }
            },
            setBonds: function (com) {
                /*
                    Sets all bonds at once with an array
                
                    Arguments
                    com.bonds: Array of all 6 directions of bonds
                */
                var d; // Number: Increment var for directions
                if (com.bonds.length == 6) {
                    for (d = 0; d < 6; d++) {
                        m.bonds[d] = com.bonds[d];    
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'setBonds',
                        error: 'Argument array wrong length',
                        error_value: String(com.bonds)
                    });
                }
            },
            getBonding: function (com) {
                /*
                    Gets the Bonds array for the atom
                    
                    Returns
                    An array with the 6 bond directions
                */
                return m.bonds;
            },
            hasBonding: function (com) {
                /*
                    Returns the current bonding state of the atom
                    
                    Returns
                    A boolean of whether the atom has bonds
                */
                var has_bonds; // Boolean: Does atom have bonding?
                var d; // Number: Increment Var for hex directions
                has_bonds = false;
                for (d = 0; d < 6; d++) {
                    if (m.bonds[d] != '') {
                        has_bonds = true;
                        break;
                    }
                }
                return has_bonds;
            },
            setBonding: function (com) {
                /*
                    Sets the linking value for the atom
                    
                    Arguments
                    com.direction: Direction of the link (0-5)
                    com.atom_id: atom_id of the linked atom
                    com.self_okay: Boolean, if true, it is okay to bond with self
                */
                if (m.gm) {
                    if (com.direction >= 0 && com.direction <= 5) {
                        if (com.atom_id != m.id || com.self_okay == true) {
                            // Set bond
                            m.bonds[com.direction] = com.atom_id;
                        } else {
                            t.controller.consoleError({
                                method_name: 'setBonding',
                                error: 'attempt to bond to self',
                                error_value: ''
                            });
                        }
                    } else {
                        t.controller.consoleError({
                            method_name: 'setBonding',
                            error: 'direction value out of range',
                            error_value: com.direction
                        });
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'setBonding',
                        error: 'game data model not linked',
                        error_value: ''
                    });
                }
            },
            getNucleusMatched: function (com) {
                /*
                    Returns if the atom matched to a nucleus
                    
                    Returns
                    A boolean for if the atom is locked in place
                */
                return m.nucleus_matched;
            },
            setNucleusMatched: function (com) {
                /*
                    Set if the atom is matched to a nucleus
                    
                    Arguments
                    com.is_matched: A boolean value is atom is matched to a nucleus
                */
                m.nucleus_matched = com.is_matched;
            },
            getNucleusLocked: function (com) {
                /*
                    Returns if the atom is locked in place
                    on the grid via a nucleus
                    
                    Returns
                    A boolean for if the atom is locked in place
                */
                return m.nucleus_locked;
            },
            setNucleusLocked: function (com) {
                /*
                    Set if the atom is locked in place on
                    the grid via bonding to a nucleus
                    
                    Arguments
                    com.is_locked: A boolean value is atom is locked via nucleus
                */
                m.nucleus_locked = com.is_locked;
                m.locked = com.is_locked;
            },
            getLocked: function (com) {
                /*
                    Returns if the atom is locked in place
                    on the grid via bonding to a nucleus
                    
                    Returns
                    A boolean for if the atom is locked in place via nucleus
                */
                return m.locked;
            },
            setLocked: function (com) {
                /*
                    Set if the atom is locked in place on
                    the grid
                    
                    Arguments
                    com.is_locked: A boolean value is atom is locked
                */
                m.locked = com.is_locked;
            },
            setCrystalSpread: function (com) {
                /*
                    Start the display of crystal spread
                    
                    Arguments
                    com.start_time: The milliseconds when the crystal spread starts
                    com.duration: How long the crystal spread takes
                */
                m.is_spreading = true;
                m.spread_start = com.start_time;
                m.spread_time = com.duration;
            },
            stopCrystalSpread: function (com) {
                /*
                    Stop the display of crystal spread
                */
                m.is_spreading = false;
            },
            getSlide: function (com) {
                /*
                    Get all legal slide neighbors
                    
                    Returns
                    Array of legal slide neighbors
                */  
                return m.slide;
            },
            setSlides: function (com) {
                /*
                    Sets list of six slide values at once
                    
                    Arguments
                    com.slides: The array holding the 6 slide ids
                */
                var i; // Number: Increment Var
                m.slide = [];
                for (i = 0; i < 6; i ++) {
                    m.slide.push(com.slides[i]);
                }
            },
            setSlide: function (com) {
                /*
                    Sets an atom id as a directional neighbor
                    that can be slid to
                    
                    Arguments
                    com.direction: Direction of the slide (0-5)
                    com.atom_id: atom_id of the slide atom
                */
                if (com.direction >= 0 && com.direction <= 5) {
                    if (com.atom_id != m.id) {
                        // Set bond
                        m.slide[com.direction] = com.atom_id;
                    } else {
                        t.controller.consoleError({
                            method_name: 'setSlide',
                            error: 'attempt to neighbor to self',
                            error_value: ''
                        });
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'setSlide',
                        error: 'direction value out of range',
                        error_value: com.direction
                    });
                }
            },
            getNeighbors: function (com) {
                /*
                    Returns all neighbor of this atom
                    
                    Returns
                    An array of atom ids in hex directional index order
                */
                return m.neighbors;
            },
            getNeighbor: function (com) {
                /*
                    Sets an atom id as a directional neighbor
                    
                    Arguments
                    com.direction: Direction of the neighbor (0-5)
                    
                    Returns
                    The atom id of the neighbor in the seleted direction
                */
                var neighbor; // String: The neighbor to be returned
                // Set default null return
                neighbor = '';
                if (com.direction >= 0 && com.direction <= 5) {
                    neighbor = m.neighbors[com.direction];
                } else {
                    t.controller.consoleError({
                        method_name: 'getNeighbor',
                        error: 'direction value out of range',
                        error_value: com.direction
                    });
                }
                return neighbor;
            },
            setNeighbor: function (com) {
                /*
                    Sets an atom id as a directional neighbor
                    
                    Arguments
                    com.direction: Direction of the neighbor (0-5)
                    com.atom_id: atom_id of the neighbor atom
                */
                if (com.direction >= 0 && com.direction <= 5) {
                    if (com.atom_id != m.id) {
                        // Set bond
                        m.neighbors[com.direction] = com.atom_id;
                    } else {
                        t.controller.consoleError({
                            method_name: 'setNeighbor',
                            error: 'attempt to neighbor to self',
                            error_value: ''
                        });
                    }
                } else {
                    t.controller.consoleError({
                        method_name: 'setNeighbor',
                        error: 'direction value out of range',
                        error_value: com.direction
                    });
                }
            },
            startMove: function (com) {
                /*
                    Sets the movement start location and 
                    sets the movement flag and teleporter
                    state
                    
                    Arguments
                    com.x_start: Starting x position of the moving atom
                    com.y_start: Starting y position of the moving atom
                    com.is_teleporting: Boolean, is move via teleporter?
                */
                if (t.controller.isAtomMoving() == false) {
                    m.is_moving = true;
                    m.is_teleporting = com.is_teleporting;
                    m.move_x_start = com.x_start;
                    m.move_y_start = com.y_start;
                    // Calculate the difference in movement
                    m.move_x_delta = m.x - com.x_start;
                    m.move_y_delta = m.y - com.y_start;
                }
            },
            startMoveTime: function (com) {
                /*
                    Start the start time of the atom movement
                    and the duration of movement
                    
                    Arguments
                    com.start_time: Start of the move
                    com.travel_time: Duration of the move
                */
                if (m.is_moving == false) {
                    t.controller.consoleError({
                        method_name: 'startMoveTime',
                        error: 'atom is not ready to move',
                        error_value: ''
                    });
                } else {
                    m.move_start = com.start_time;
                    m.move_time = com.travel_time;
                    m.move_ratio = 0;
                }
            },
            isAtomMoving: function (com) {
                /*
                    Returns whether the atom is moving
                    
                    Returns
                    Boolean for if atom is moving
                */
                return (m.is_moving || m.is_teleporting);
            },
            getAtomHinting: function (com) {
                /*
                    Return the hinting state of the atom
                    
                    Returns
                    Boolean that gives the hinting state of the atom
                */
                return m.is_hinted;
            },
            setAtomHinting: function (com) {
                /*
                    Set the hinting state of the atom display
                    
                    Arguments
                    com.is_hinted: Boolean state of hinting
                */
                m.is_hinted = com.is_hinted;
            },
            startExplosion: function (com) {
                /*
                    Start atom exploding
                    
                    Arguments
                    com.start_time: Start of the explosion
                    com.duration: Duration of the explosion
                */
                if (m.is_exploding == false) {
                    m.explode_start = com.start_time;
                    m.explode_time = com.duration;
                    m.is_exploding = true;
                    if (m.type == m.gm.atom_types.crystal) {
                        m.is_crumbling = true;
                    }
                }
            },
            stopExplosion: function (com) {
                /*
                    Stops the current explosion
                */
                if (m.is_exploding == true) {
                    m.is_exploding = false;
                    m.is_crumbling = false;
                    m.explode_start = -1;
                    m.explode_time = -1;
                    m.explode_ratio = 0;
                }
            },
            startCreation: function (com) {
                /*
                    Starts the create animation for an atom
                    generator
                    
                    Arguments
                    com.start_time: Start of the create animation
                    com.duration: Duration of the create animation
                */
                m.create_start = com.start_time;
                m.create_duration = com.duration;
            },
            getFogged: function (com) {
                /*
                    Returns the fogged state
                    
                    Returns
                    Boolean for if atom is fogged
                */
                return m.is_fogged;
            },
            setFogged: function (com) {
                /*
                    Sets the fogged state of an atom and the
                    locked state of the atom
                
                    Arguments
                    com.fog: A boolean with the fogged state of the atom
                */
                m.is_fogged = com.fog;
                if (com.fog == true) {
                    m.locked = true;
                } else {
                    if (m.has_shield == false) {
                        switch (m.type) {
                            case m.gm.atom_types.atom:
                            case m.gm.atom_types.radioactive:
                            case m.gm.atom_types.blackhole:
                            case m.gm.atom_types.void:
                            case m.gm.atom_types.antimatter:
                            case m.gm.atom_types.big_bang:
                            case m.gm.atom_types.bang_slash:
                            case m.gm.atom_types.bang_vert:
                            case m.gm.atom_types.bang_backslash:
                            case m.gm.atom_types.bang_plasma:
                            case m.gm.atom_types.bang_small:
                            case m.gm.atom_types.bang_medium:
                            case m.gm.atom_types.bang_full:
                            case m.gm.atom_types.freeze:
                                m.locked = false;
                                break;
                        }
                    }
                }
            },
            isAtomExploding: function (com) {
                /*
                    Returns whether the atom is exploding
                    
                    Returns
                    Boolean for if atom is moving
                */
                return m.is_exploding;
            },
            startFizz: function (com) {
                /*
                    Starts a state of fizzing
                    
                    Arguments
                    com.start_time: Time which fizzing started
                    com.duration: Duration of the fizzing
                    com.state: State of the fizzing which started
                */
                m.fizz_start = com.start_time;
                m.fizz_time = com.duration;
                m.fizz_ratio = 0;
                m.fizz_state = com.state;
            },
            setHintArrow: function (com) {
                /*
                    Sets the hint arrow value
                    
                    Arguments
                    com.direction: Hex direction of the hint arrow
                */
                m.hint_arrow = com.direction;
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
                    Construct and report atom error to the console
                    
                    Arguments
                    com.method_name: Function name of where the error occurred
                    com.error: Error message
                    com.error_value: The incorrect value to display
                */
                var error_message; // String: The construct for the error message
                error_message = 'ERROR: atom (' + m.id + ')';
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