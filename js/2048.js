var pepito = function ()
{
    var grid = $("#gridSelect").val();
    $("div#grid > div").remove();
    $("#game").css({"width": grid*"100", "height": grid*"100"});
    var all_row = $("#grid");
    for(row = 0; row < grid; row++)
    {
        all_row.append("<div class='row'></div>");
    }
    row = 0;
    $.each(all_row.find(".row"), function () {

        for(col = 0; col < grid; col++)
        {
            $(this).css({"width": grid*"100"}).append(function ()
            {
                $(this).append("<div class='cell' id='"+row+"-"+col+"'>")
            });
        }
        row++;
    });

    for(rand = 0; rand < grid - 2; rand++)
    {
        random();
    }
};

empty_cells = function()
{
    var empty_cells = [];

    var all_cells = $("#grid").find(".cell");

    $.each(all_cells, function (index, item) {

        if(item.innerText === "")
        {
            empty_cells.push($(this).attr("id"));
        }
    });
    return empty_cells;
};

random = function(){

    var empty_cell = empty_cells();
    var random_cell = Math.floor((Math.random() * empty_cell.length));
    var new_cell = empty_cell[random_cell];

    $("#grid").find("#"+new_cell).append("<div class='box box-"+new_cell+" num-2'>2</div>")

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
    var best_score = getCookie("best_score_"+grid);
    if (best_score != "") {
        $(".best-container").text(best_score);
    } else {
        setCookie("best_score_"+grid, 0, 365);
    }
}

$(document).keyup(function(e)
{
    array_cols = [];
    selColonne = {
        "ArrowUp" : ".row > div[id$='-?']",
        "ArrowDown" : ".row > div[id$='-?']",
        "ArrowLeft" : ".row > div[id^='?-']",
        "ArrowRight" : ".row > div[id^='?-']"
    };

    var grid = $("#gridSelect").val();

    recupCells(selColonne[e.key], e.key, grid);

    function recupCells(query, direction, grid)
    {
        for(index = 0; index < grid; index++)
        {
            array_cells = [];

            q = query.replace('?',index);
            q2 = $(q).get();
            if(direction === "ArrowDown" || direction === "ArrowRight")
            {
                q2 = q2.reverse();
            }

            $(q2).each(function(index, item)
            {
                if(item.innerText === "")
                {
                    array_cells.push(0);
                }
                else
                {
                    array_cells.push(item.innerText);
                }
            });
            array_cols.push(array_cells);
        }
        verifMove(array_cols, e.key, grid);
    }

    function verifMove(tab, direction, grid)
    {
        var YouShouldPass = false;
        var YouShouldPassPlus = false;
        tab.forEach(function (element)
        {
            element.forEach(function(cell, index)
            {
                if(cell !== 0)
                {
                    var previous_cell = (index - 1 >= 0) ? element[index - 1] : null;
                    var next_cell = (index + 1 <= grid) ? element[index + 1] : null;

                    if(previous_cell !== null && previous_cell === 0 || next_cell !== null && next_cell === cell)
                    {
                        YouShouldPass = true;

                        if(next_cell !== null && next_cell === cell)
                        {
                            YouShouldPassPlus = true;
                        }
                        return true;
                    }
                }
            });
            if(YouShouldPass === true)
            {
                return true;
            }
        });
        if(YouShouldPass === true)
        {
            verifAdd(tab, direction, grid);
            return true;
        }
        else if(YouShouldPass === false)
        {
            var empty_cell = empty_cells();

            if(empty_cell.length === 0 && YouShouldPassPlus === false)
            {
                alert('GAME OVER');
                pepito();
            }
            console.log(empty_cell);
            return false;
        }
    }

    function verifAdd(tab, direction, grid)
    {
        var score = 0;
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
            var first_pass = false;
            var pass_by_succes = false;
            var first_value = 0;
            var result_value = 0;

            element.forEach(function (element2, index) {
                if(first_pass === false)
                {
                    first_value = element2;
                    first_pass = true;
                }
                else
                {
                    var second_value = element2;
                    if(first_value === second_value && pass_by_succes === false)
                    {
                        result_value = parseInt(first_value) + parseInt(second_value);
                        element[index-1] = result_value;
                        element.splice(index, 1);
                        pass_by_succes = true;
                    }
                    else
                    {
                        first_value = element2;
                    }
                }
            });
            score = score+result_value;
        });

        var last_score = $(".score-container").text();
        var new_score = parseInt(last_score) + parseInt(score);

        if($(".best-container").text() < new_score)
        {
            $(".best-container").text(new_score);
            setCookie("best_score_"+grid, new_score, 365);
        }

        $(".score-container").text(new_score);
        makeNewCells(tab, direction, grid);
    }

    function makeNewCells(tab, direction)
    {
        var all_cells = $("#grid").find(".cell");

        $.each(all_cells, function (element, index) {
            if(index.firstElementChild !== null)
            {
                index.removeChild(index.firstElementChild);
            }
        });

        if( direction === "ArrowUp")
        {
            tab.forEach(function (value, col) {

                value.forEach(function (value2, row) {

                    $("#grid").find("#"+row+"-"+col).append("<div class='box box-"+row+"-"+col+" num-"+value2+"'>"+value2+"</div>")
                })
            });
        }
        else if( direction === "ArrowDown" )
        {
            tab.forEach(function (value, col) {
                var row_div = grid - 1;

                value.forEach(function (value2) {

                    $("#grid").find("#"+row_div+"-"+col).append("<div class='box box-"+row_div+"-"+col+" num-"+value2+"'>"+value2+"</div>");
                    row_div--;
                })
            });
        }
        else if( direction === "ArrowLeft" )
        {
            tab.forEach(function (value, col) {
                var col_div = 0;

                value.forEach(function (value2) {

                    $("#grid").find("#"+col+"-"+col_div).append("<div class='box box-"+col+"-"+col_div+" num-"+value2+"'>"+value2+"</div>");
                    col_div++;
                })
            });
        }
        else if( direction === "ArrowRight" )
        {

            tab.forEach(function (value, col) {
                var col_div = grid -1;

                value.forEach(function (value2) {

                    $("#grid").find("#"+col+"-"+col_div).append("<div class='box box-"+col+"-"+col_div+" num-"+value2+"'>"+value2+"</div>");
                    col_div--;
                })
            });
        }
        random();
    }
});

$("#gridSelect").change(function () {
    pepito();
    checkCookie();
    $(".score-container").text(0);

});

$("#button-new-game").click(function () {
    pepito();
    $(".score-container").text(0);
});

$( document ).ready(
    pepito(), checkCookie()
);