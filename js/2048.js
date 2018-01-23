var pepito = function ()
{
    var grid = $("#gridSelect").val();
    console.log(grid);
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

occupied_cells = function()
{
    var occupied_cells = [];

    var all_cells = $("#grid").find(".cell");

    $.each(all_cells, function (index, item) {

        if(item.innerText !== "")
        {
            occupied_cells.push($(this).attr("id"));
        }
    });

    return occupied_cells;
};

random = function(){

    var empty_cell = empty_cells();

    var random_cell = Math.floor((Math.random() * empty_cell.length));

    var new_cell = empty_cell[random_cell];
    console.log(new_cell);

    $("#grid").find("#"+new_cell).append("<div class='box box-"+new_cell+" num-2'>2</div>")

};

var move = function()
{
    $(document).keyup(function (e) {

        if(e.key === "ArrowUp")
        {
            var boxes = $("#grid").find(".box");

            boxes.each(function () {

                var classList = $(this).attr('class').split(/\s+/);
                var value_old_box = $(this).html();

                console.log(value_old_box);

                $.each(classList, function(index, item) {

                    if (item.match("^box-")) {

                        var y = item.substr(4, 1);
                        var x = item.substr(6, 1);
                        var old_pos = item.substr(4);

                        if(y !== "0")
                        {
                            y--;

                            var new_pos = y+"-"+x;

                            $("#grid").find(".box-"+old_pos).remove();

                            var new_box_pos = $("#grid").find("#"+new_pos);

                            if(new_box_pos.children().length === 1)
                            {
                                var value_new_box = new_box_pos.text();

                                if(value_old_box === value_new_box)
                                {
                                    var final_value = parseInt(value_old_box)+parseInt(value_new_box);
                                    new_box_pos.children().remove();
                                    new_box_pos.append("<div class=\"box box-"+new_pos+" num-"+final_value+"\">"+final_value+"</div>");
                                }
                            }
                            else
                            {
                                new_box_pos.children().remove();
                                new_box_pos.append("<div class=\"box box-"+new_pos+" num-"+value_old_box+"\">"+value_old_box+"</div>");
                            }
                        }
                    }
                });
            });
            // random();
            console.log(occupied_cells());
        }

        if(e.key === "ArrowDown")
        {
            var classList = $("#grid").find(".box").attr('class').split(/\s+/);

            $.each(classList, function(index, item) {

                if (item.match("^box-")) {

                    var y = item.substr(4, 1);
                    var x = item.substr(6, 1);

                    console.log(y);

                    if(y !== "3")
                    {
                        y++;
                        var new_pos = "box-"+y+"-"+x;

                        $("#grid").find(".box").removeClass(item).addClass(new_pos);

                    }

                }

            });
            // random();
        }

        if(e.key === "ArrowLeft")
        {
            var classList = $("#grid").find(".box").attr('class').split(/\s+/);

            $.each(classList, function(index, item) {

                if (item.match("^box-")) {

                    var y = item.substr(4, 1);
                    var x = item.substr(6, 1);

                    console.log(y);

                    if(x !== "0")
                    {
                        x--;
                        var new_pos = "box-"+y+"-"+x;

                        $("#grid").find(".box").removeClass(item).addClass(new_pos);

                    }

                }

            });
            // random();
        }

        if(e.key === "ArrowRight")
        {
            var classList = $("#grid").find(".box").attr('class').split(/\s+/);

            $.each(classList, function(index, item) {

                if (item.match("^box-")) {

                    var y = item.substr(4, 1);
                    var x = item.substr(6, 1);

                    console.log(y);

                    if(x !== "3")
                    {
                        x++;
                        var new_pos = "box-"+y+"-"+x;

                        $("#grid").find(".box").removeClass(item).addClass(new_pos);

                    }

                }

            });
            // random();
        }
    });
};

$("#gridSelect").change(pepito);
$( document ).ready(
    pepito(), move()
);