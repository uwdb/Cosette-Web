/*
 main.js - cosette web index
*/

var join_elim = "/* define schema s1, \n   here s1 can contain any number of attributes, \n   but it has to at least contain integer attributes \n   x and y */\nschema s1(x:int, ya:int, ??);\n\nschema s2(yb:int, ??);        -- define schema s2\n\ntable a(s1);            -- define table a using schema s1\ntable b(s2);            -- define table b using schema s1\n\nquery q1                -- define query q1 on tables a and b\n`select distinct x.x as ax from a x, b y\n where x.ya = y.yb`;\n\nquery q2                -- define query q2 likewise\n`select distinct x.x as ax from a x, a y, b z \n where x.x = y.x and x.ya = z.yb`;\n\nverify q1 q2;           -- does q1 equal to q2?";
var conjunct_select = "/* schema s, here ?? means s can contain \n   any number of attributes */\nschema s(??);       \n\n/* table r has schema s */\ntable r(s); \n\n/* symbolic predicate b1 on s. \n   This means that b1 is a predicate that takes \n   in a tuple with schema s */\npredicate b1(s);\n\n/* symbolic predicate b2 on s */\npredicate b2(s);    \n\n/* query q1 */\nquery q1\n`select * from r x where b1(x) and b2(x)`;\n\n/* query q2 */\nquery q2\n`select * from (select * from r x where b1(x)) y \n where b2(y)`;\n\n/* does q1 equal to q2? */\nverify q1 q2;";
var common_exp = "/* define schema s1,\n   here s1 can contain any number of attributes, \n   but it has to at least contain integer attributes \n   x and y */\nschema s1(x:int, y:int, ??);\n\ntable a(s1);                   -- table a of schema s1\n\nquery q1                       -- query 1\n`select (x.x + x.x) as ax\n from a x where x.x = x.y`;\n\nquery q2                       -- query 2\n`select (x.x + x.y) as ax\n from a x where x.x = x.y`;\n\nverify q1 q2;                  -- verify the equivalence";
var disjunct_select_wrong = "/* define schema s1, \n   here s1 can contain any number of attributes */\nschema s(??);\n\n/* define table r using schema s1 */\ntable r(s);\n\n/* symbolic predicate b1 on s. \n   This means that b1 is a predicate that takes \n   in a tuple with schema s */\npredicate b1(s);\npredicate b2(s);    -- symbolic predicate b2 on s\n\nquery q1\n`select * from r x where b1(x) or b2(x)`;\n\nquery q2\n`select *\n from ((select * from r x where b1(x)) \n       union all (select * from r y where b2(y))) x`;\n \nverify q1 q2;";
var disjunct_select_right = "/* define schema s1, \n   here s1 can contain any number of attributes */\nschema s(??);\n\n/* define table r using schema s1 */\ntable r(s);\n\n/* symbolic predicate b1 on s. \n   This means that b1 is a predicate that takes \n   in a tuple with schema s */\npredicate b1(s);\npredicate b2(s);    -- symbolic predicate b2 on s\n\nquery q1\n`select distinct * from r x where b1(x) or b2(x)`;\n\nquery q2\n`select distinct *\n from ((select * from r x where b1(x)) \n       union all (select * from r y where b2(y))) x`;\n \nverify q1 q2;";

// editor setting
$("#editor").text(join_elim);
var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.getSession().setMode("ace/mode/sql");
editor.setOptions({
    fontSize: "11pt"
});
editor.getSession().setUseWrapMode(true);

$(function () {

    if (!Cookies.get('username')) {
        $('#myModal').modal('show');
    }

    $('#myModal').on('hidden.bs.modal', function (e) {
        if ($('#username-input').val() == "" || $('#institution-input').val() == "") {
            $('#myModal').modal('show');
        } else {
            Cookies.set('username', $('#username-input').val());
            Cookies.set('institution', $('#institution-input').val());
            if ($('#email-input').val() != "") {
                Cookies.set('email', $('#email-input').val());
            }
        }
    });

    $('.submit-btn').click(function () {
        var query = editor.getValue();
        $("#feedback").text("");
        $.ajax({
            url: '/solve',
            method: 'POST',
            data: { "query": query },
            success: function (data) {
                var result = $.parseJSON(data);
                var html = "";
                var answer = result["result"]
                console.log(result);
                if (answer === "NEQ") {
                    var ros = result["counterexamples"];
                    html += "Two queries are not equivalent."
                    html += '<br><br><p style="font-weight: bold;">Counter Examples:</p>';
                    for (var i = 0; i < ros.length; i++) {
                        var table = ros[i];
                        var table_html = '<p>';
                        table_html += 'Table <em> ' + table["table-name"] + '</em> <br>';
                        table_html += '<table><tr>';
                        for (var j = 0; j < table['table-content'][0].length; j++) {
                            table_html += '<th>' + table['table-content'][0][j] + '</th>';
                        }
                        table_html += '<th>Multiplicity</th></tr><tr>';
                        for (var j = 0; j < table['table-content'][0].length; j++) {
                            table_html += '<td>' + table['table-content'][1][0][0][j] + '</td>';
                        }
                        table_html += '<td>' + table['table-content'][1][0][1] + '</td></tr>';

                        table_html += '</table> </p>';
                        html += table_html;
                    }
                    $("#feedback").html(html);
                } else if (answer === "EQ") {
                    $("#feedback").text("Two queries are equivalent.");
                } else if (answer === "UNKNOWN") {
                    $("#feedback").text("Two queries' equivalence is unknown. Solver runs out of time.");
                } else { //error
                    $("#feedback").text(result["error_msg"]);
                }
            }
        });
    });

    var $solving = $('#solving').hide();
    $(document)
        .ajaxStart(function () { $solving.show(); })
        .ajaxStop(function () { $solving.hide(); });

    $('.sample1').click(function () {
        editor.setValue(join_elim, -1);
        $("#feedback").text("");
        $("#dropdownMenuButton").text($(this).text());
    });

    $('.sample2').click(function () {
        editor.setValue(disjunct_select_wrong, -1);
        $("#feedback").text("");
        $("#dropdownMenuButton").text($(this).text());
    });

    $('.sample3').click(function () {
        editor.setValue(disjunct_select_right, -1);
        $("#feedback").text("");
        $("#dropdownMenuButton").text($(this).text());
    });

    $('.sample4').click(function () {
        editor.setValue(conjunct_select, -1);
        $("#feedback").text("");
        $("#dropdownMenuButton").text($(this).text());
    });

    $('.sample5').click(function () {
        editor.setValue(common_exp, -1);
        $("#feedback").text("");
        $("#dropdownMenuButton").text($(this).text());
    });

});
