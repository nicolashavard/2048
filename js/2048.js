window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var new_grid = function () {
    var grid = $("#gridSelect").val();
    $("div#grid > div").remove();
    $("#game").css({"width": grid*"100", "height": grid*"100"});
    var all_row = $("#grid");

    for(row = 0; row < grid; row++) {
        all_row.append("<div class='row'></div>");
    }

    row = 0;

    $.each(all_row.find(".row"), function () {
        for(col = 0; col < grid; col++) {
            $(this).css({"width": grid*"100"}).append(function () {
                $(this).append("<div class='cell' id='"+row+"-"+col+"'>")
            });
        }
        row++;
    });

    for(rand = 0; rand < grid - 2; rand++) {
        random();
    }
};

empty_cells = function() {
    var empty_cells = [];
    var all_cells = $("#grid").find(".cell");

    $.each(all_cells, function (index, item) {
        if(item.innerText === "") {
            empty_cells.push($(this).attr("id"));
        }
    });
    return empty_cells;
};

random = function(){
    var pop_cell = [2, 2, 2, 4];
    var random_pop = Math.floor((Math.random() * pop_cell.length));
    var new_pop = pop_cell[random_pop];
    var empty_cell = empty_cells();
    var random_cell = Math.floor((Math.random() * empty_cell.length));
    var new_cell = empty_cell[random_cell];
    $("#grid").find("#"+new_cell).append("<div class='box box-"+new_cell+" num-"+new_pop+"'>"+new_pop+"</div>")
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var grid = $("#gridSelect").val();
    var score = getCookie("best_score_"+grid);
    if (score !== "") {
        $(".best-container").text(score);
    } else {
        setCookie("best_score_"+grid, 0, 365);
    }
}

$(document).keyup(game = function(e) {
    array_cols = [];
    selColonne = {
        "ArrowUp" : ".row > div[id$='-?']",
        "ArrowDown" : ".row > div[id$='-?']",
        "ArrowLeft" : ".row > div[id^='?-']",
        "ArrowRight" : ".row > div[id^='?-']"
    };
    if(typeof e === "string") {
        move = e;
    }
    else {
        move = e.key;
    }

    var grid = $("#gridSelect").val();
    var do_move = true;

    recupCells(selColonne[move], move, grid, do_move);

    function recupCells(query, direction, grid, do_move) {

        if(query === ".row > div[id$='-?']" || query === ".row > div[id^='?-']") {
            for (index = 0; index < grid; index++) {
                var array_cells = [];

                q = query.replace('?', index);


                q2 = $(q).get();

                if (direction === "ArrowDown" || direction === "ArrowRight") {
                    q2 = q2.reverse();
                }

                $(q2).each(function (index, item) {
                    if (item.innerText === "") {
                        array_cells.push(0);
                    }
                    else {
                        array_cells.push(item.innerText);
                    }
                });
                array_cols.push(array_cells);
            }
            return verifMove(array_cols, direction, grid, do_move);
        }
    }

    function verifMove(tab, direction, grid, do_move) {
        var YouShouldPass = false;
        tab.forEach(function (element) {
            element.forEach(function(cell, index) {
                if(cell !== 0) {
                    var previous_cell = (index - 1 >= 0) ? element[index - 1] : null;
                    var next_cell = (index + 1 <= grid) ? element[index + 1] : null;

                    if(previous_cell !== null && previous_cell === 0 || next_cell !== null && next_cell === cell) {
                        YouShouldPass = true;
                        return true;
                    }
                }
            });
            if(YouShouldPass === true) {
                return true;
            }
        });

        if(do_move === false) {
            if(YouShouldPass === true) {
                return "ON";
            }
            else {
                return "OFF";
            }
        }
        else if(YouShouldPass === true && do_move === true) {
            verifAdd(tab, direction);
            return true;
        }
    }

    function verifAdd(tab, direction) {
        var score = 0;
        var victory = false;
        tab.forEach(function (value) {
            var i = 0;
            while(i < value.length) {
                if(value[i] === 0) {
                    value.splice(i, 1);
                    i--;
                }
                i++;
            }
        });

        tab.forEach(function (element) {
            var first_value = 0;
            var result_value = 0;
            var second_value = 0;

            for(var i = 0; i < element.length; i++) {
                if(element[i + 1] !== null && element[i] === element[i+1]) {
                    first_value = element[i];
                    second_value = element[i+1];
                    result_value = parseInt(first_value) + parseInt(second_value);

                    if(result_value === 2048) {
                        victory = true;
                    }
                    element[i] = result_value;
                    element.splice(i+1, 1);
                    score = score+result_value;
                }
            }
        });

        var last_score = $(".score-container").text();
        var new_score = parseInt(last_score) + parseInt(score);

        if($(".best-container").text() < new_score) {
            $(".best-container").text(new_score);
            setCookie("best_score_"+grid, new_score, 365);
        }

        $(".score-container").text(new_score);
        makeNewCells(tab, direction, new_score, victory);
    }

    function makeNewCells(tab, direction, new_score, victory) {
        var all_cells = $("#grid").find(".cell");

        $.each(all_cells, function (element, index) {
            if(index.firstElementChild !== null) {
                index.removeChild(index.firstElementChild);
            }
        });

        if( direction === "ArrowUp") {
            tab.forEach(function (value, col) {

                value.forEach(function (value2, row) {
                    $("#grid").find("#"+row+"-"+col).append("<div class='box box-"+row+"-"+col+" num-"+value2+"'>"+value2+"</div>")
                })
            });
        }
        else if( direction === "ArrowDown" ) {
            tab.forEach(function (value, col) {
                var row_div = grid - 1;

                value.forEach(function (value2) {
                    $("#grid").find("#"+row_div+"-"+col).append("<div class='box box-"+row_div+"-"+col+" num-"+value2+"'>"+value2+"</div>");
                    row_div--;
                })
            });
        }
        else if( direction === "ArrowLeft" ) {
            tab.forEach(function (value, col) {
                var col_div = 0;

                value.forEach(function (value2) {
                    $("#grid").find("#"+col+"-"+col_div).append("<div class='box box-"+col+"-"+col_div+" num-"+value2+"'>"+value2+"</div>");
                    col_div++;
                })
            });
        }
        else if( direction === "ArrowRight" ) {
            tab.forEach(function (value, col) {
                var col_div = grid -1;

                value.forEach(function (value2) {
                    $("#grid").find("#"+col+"-"+col_div).append("<div class='box box-"+col+"-"+col_div+" num-"+value2+"'>"+value2+"</div>");
                    col_div--;
                })
            });
        }

        if(victory === true) {
            alert("VICTORY\n"+"Your score is "+new_score);
            setCookie("best_score_"+grid, new_score, 365);

            new_grid();
            $(".score-container").text(0);
        }
        else {
            random();
            check_New_Moves(new_score);
        }
    }

    function check_New_Moves(new_score) {
        var no_move = false;
        var check_moves = [];
        var off = 0;
        check_moves.push(recupCells(".row > div[id$='-?']", "ArrowUp", grid, no_move));
        check_moves.push(recupCells(".row > div[id$='-?']", "ArrowDown", grid, no_move));
        check_moves.push(recupCells(".row > div[id^='?-']", "ArrowLeft", grid, no_move));
        check_moves.push(recupCells(".row > div[id^='?-']", "ArrowRight", grid, no_move));

        console.log(check_moves);

        check_moves.forEach(function (element) {
            if(element === "OFF") {
                off++;
            }
        });

        if(off === 4) {

            alert("VICTORY\n"+"Your score is "+new_score);

            setCookie("best_score_"+grid, new_score, 365);

            new_grid();
            $(".score-container").text(0);
        }
        else {
            return true;
        }
    }
});

$("#gridSelect").change(function () {
    new_grid();
    checkCookie();
    $(".score-container").text(0);
});

$("#button-new-game").click(function () {
    new_grid();
    $(".score-container").text(0);
});

$( document ).ready(
    new_grid(),
    checkCookie()
);