/*
    Code for a Big Bang Game side display
*/

var SCORE; // Function: Contains MVC for game piece

SCORE = function (command) {
    /*
        Contains MVC for score pop-up object. Executes the 
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
            score: 0, // Number: Score to be displayed
            start: -1, // Number: The milliseconds when the display started
            duration: 1500, // Number: Duration of pop-up display
            travel: -50, // Number: Distance for the pop up to travel on the y axis
            start_x: 0, // Number: The x location where the display started
            x_offset: 0, // Number: Distance to offset drawn score
            start_y: 0, // Number: The y location where the display started
            end_y: 0, // Number: The y location where the display ends
            ratio: 0, // Number: Ratio that pop-up has traveled
            places: 0, // Number: Number of digits being displayed
            digit_place: [100000, 10000, 1000, 100, 10, 1], // Array: Digit values
            digit_places: 6, // Number: Length of digit_places
            mm: null, // Object: Pointer to the menu data model
            gm: null // Object: Pointer to the game data model
        };
    }
    m = this.model;
    if (!this.view) {
        this.view = {
            displayScore: function () {
                /*
                    Display pop-up score on the screen
                */
                var d; // Number: Increment Var for digit place
                var x_position; // Number: X position for the next draw
                var is_displaying; // Boolean: Has the number started displaying?
                var temp_score; // Number: The score to be decreased while being displayed
                var display_digit; // Number: Digit to be displayed
                var y_position; // Number: Current y position
                m.ratio = (new Date().getTime() - m.start) / m.duration;
                if (m.ratio > 1) {
                    m.ratio = 1;
                }
                y_position = m.start_y + Math.floor((m.end_y - m.start_y)
                    * m.ratio) - 20;
                // Init function values
                is_displaying = false;
                temp_score = m.score;
                x_position = m.start_x - m.x_offset;
                // Loop through each of the digit places
                for (d = 0; d < m.digit_places; d++) {
                    if (temp_score >= m.digit_place[d]
                            || is_displaying == true) {
                        is_displaying = true;
                        display_digit = Math.floor(temp_score
                            / m.digit_place[d]);
                        temp_score = temp_score % m.digit_place[d];
                        m.gm.cc.drawImage(m.mm.menu_image, 
                            176 + (display_digit * 32), 0,
                            30, 40,
                            x_position, y_position, 
                            30, 40);
                        x_position = x_position + 30;
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
                    Init score pop-up
                    
                    Arguments
                    com.menu_data = A pointer to the menu data model
                    com.game_data = A pointer to the game data model
                    com.score = The score to be displayed by this pop-up
                    com.x = X locaiton of the pop-up
                    com.y = Y location of the pop-up
                */
                var i; // Number: Increment Var
                var half_width; // Number: Half of the width of the number drawn
                var half_height; // Number: Half of the height of the number drawn
                // Set data model pointers
                m.mm = com.menu_data;
                m.gm = com.game_data;
                m.score = com.score;
                m.start_x = com.x;
                m.start_y = com.y;
                m.end_y = m.start_y + m.travel;
                // Calculate the number of places to show
                for (i = 0; i < m.digit_places; i++) {
                    if (m.score > m.digit_place[i]) {
                        m.places = m.digit_places - i;
                        break;
                    }
                }
                half_width = m.places * 15;
                m.x_offset = half_width;
                half_height = 20;
                if (m.end_y < half_height) {
                    m.end_y = m.end_y + (half_height - m.end_y);
                    m.start_y = m.start_y + (half_height - m.end_y);
                }
                if (m.start_x > m.gm.width - half_width) {
                    m.start_x = m.gm.width - half_width;
                }
                if (m.start_x < 175 + half_width) {
                    m.start_x = 175 + half_width;
                }
                m.start = new Date().getTime();
            },
            getRatio: function() {
                /*
                    Returns the current movement ratio value
                    
                    Returns:
                    Current ratio
                */
                return m.ratio;
            }
        };
    } 
    if (this.controller[command.com]) {
        // Execute controller function if present and return value
        return this.controller[command.com](command);
    }
    // Give warning when command is missing
    console.log("*** Warning *** (SCORE) No Command: " + command.com);
    return this;
};