/*
 main.js - cosette web index
*/

var simple_1 = "/* schema s, has two attributes a and b */\nschema s(a:int, b:int);       \n\n/* table r has schema s */\ntable r(s); \n\n/* query q1 */\nquery q1\n`select x.a as a \n from r x`;\n\n/* query q2 */\nquery q2\n`select x.b as b\n from r x`;\n\n/* does q1 equal to q2? */\nverify q1 q2;";
var join_elim = "/* define schema s1, \n   here s1 can contain any number of attributes, \n   but it has to at least contain integer attributes \n   x and y */\nschema s1(x:int, ya:int, ??);\n\nschema s2(yb:int, ??);        -- define schema s2\n\ntable a(s1);            -- define table a using schema s1\ntable b(s2);            -- define table b using schema s1\n\nquery q1                -- define query q1 on tables a and b\n`select distinct x.x as ax \n from a x, b y\n where x.ya = y.yb`;\n\nquery q2                -- define query q2 likewise\n`select distinct x.x as ax \n from a x, a y, b z \n where x.x = y.x and x.ya = z.yb`;\n\nverify q1 q2;           -- does q1 equal to q2?";
var join_elim_wrong = "/* define schema s1, \n   here s1 can contain any number of attributes, \n   but it has to at least contain integer attributes \n   x and y */\nschema s1(x:int, ya:int, ??);\n\nschema s2(yb:int, ??);        -- define schema s2\n\ntable a(s1);            -- define table a using schema s1\ntable b(s2);            -- define table b using schema s1\n\nquery q1                -- define query q1 on tables a and b\n`select distinct x.x as ax \n from a x, b y\n where x.ya = y.yb`;\n\nquery q2                -- define query q2 likewise\n`select distinct x.x as ax \n from a x, a y, b z \n where x.x = y.x`;\n\nverify q1 q2;           -- does q1 equal to q2?";
var conjunct_select = "/* schema s, here ?? means s can contain \n   any number of attributes */\nschema s(??);       \n\n/* table r has schema s */\ntable r(s); \n\n/* symbolic predicate b1 on s. \n   This means that b1 is a predicate that takes \n   in a tuple with schema s */\npredicate b1(s);\n\n/* symbolic predicate b2 on s */\npredicate b2(s);    \n\n/* query q1 */\nquery q1\n`select * from r x where b1(x) and b2(x)`;\n\n/* query q2 */\nquery q2\n`select * from (select * from r x where b1(x)) y \n where b2(y)`;\n\n/* does q1 equal to q2? */\nverify q1 q2;";
var common_exp = "/* define schema s1,\n   here s1 can contain any number of attributes, \n   but it has to at least contain integer attributes \n   x and y */\nschema s1(x:int, y:int, ??);\n\ntable a(s1);                   -- table a of schema s1\n\nquery q1                       -- query 1\n`select (x.x + x.x) as ax\n from a x where x.x = x.y`;\n\nquery q2                       -- query 2\n`select (x.x + x.y) as ax\n from a x where x.x = x.y`;\n\nverify q1 q2;                  -- verify the equivalence";
var disjunct_select_wrong = "/* define schema s1, \n   here s1 can contain any number of attributes */\nschema s(??);\n\n/* define table r using schema s1 */\ntable r(s);\n\n/* symbolic predicate b1 on s. \n   This means that b1 is a predicate that takes \n   in a tuple with schema s */\npredicate b1(s);\npredicate b2(s);    -- symbolic predicate b2 on s\n\nquery q1\n`select * \n from r x \n where b1(x) or b2(x)`;\n\nquery q2\n`select *\n from ((select * from r x where b1(x)) \n       union all (select * from r y where b2(y))) x`;\n \nverify q1 q2;";
var disjunct_select_right = "/* define schema s1, \n   here s1 can contain any number of attributes */\nschema s(??);\n\n/* define table r using schema s1 */\ntable r(s);\n\n/* symbolic predicate b1 on s. \n   This means that b1 is a predicate that takes \n   in a tuple with schema s */\npredicate b1(s);\npredicate b2(s);    -- symbolic predicate b2 on s\n\nquery q1\n`select distinct * from r x where b1(x) or b2(x)`;\n\nquery q2\n`select distinct *\n from ((select * from r x where b1(x)) \n       union all (select * from r y where b2(y))) x`;\n \nverify q1 q2;";
var simple_1_r = {"rosette_log": "Rosette find an counterexample.", "coq_result": "UNKNOWN", "coq_log": "", "result": "NEQ", "counterexamples": [{"table-content": [["a", "b"], [[[1, 0], 1]]], "table-name": "r"}], "rosette_result": "NEQ"};
var join_elim_r = {"rosette_result": "UNSAT", "rosette_log": "", "coq_result": "EQ", "result": "EQ", "coq_log": ""};
var conjunct_select_r = {"rosette_result": "UNSAT", "rosette_log": "", "coq_result": "EQ", "result": "EQ", "coq_log": ""};
var common_exp_r = {"rosette_result": "UNSAT", "rosette_log": "", "coq_result": "EQ", "result": "EQ", "coq_log": ""};
var disjunct_select_wrong_r = {"rosette_log": "Rosette find an counterexample.", "coq_result": "UNKNOWN", "coq_log": "", "result": "NEQ", "counterexamples": [{"table-content": [["unknowns"], [[[3], 1]]], "table-name": "r"}], "rosette_result": "NEQ"};
var disjunct_select_right_r = {"rosette_result": "UNSAT", "rosette_log": "", "coq_result": "EQ", "result": "EQ", "coq_log": ""};
var join_elim_wrong_r = {"rosette_log": "Rosette find an counterexample.", "coq_result": "UNKNOWN", "coq_log": "", "result": "NEQ", "counterexamples": [{"table-content": [["yb", "unknowns"], [[[1, "sv$1"], 4]]], "table-name": "b"}, {"table-content": [["x", "ya", "unknowns"], [[["sv$2", 0, "sv$4"], 12]]], "table-name": "a"}], "rosette_result": "NEQ"};
// editor setting
$("#editor").text(join_elim);
var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.getSession().setMode("ace/mode/sql");
editor.setOptions({
    fontSize: "11pt"
});
editor.getSession().setUseWrapMode(true);

var the_number = 42;

// process each cell of the content of a table
function process_cell(cell){
    if(typeof cell === "string" || cell instanceof String){
        if(cell.startsWith("sv")){
            return the_number;
        }
    }
    return cell;
}

// generate a row of a table: row is an array
function gen_row_html(row){
    var makecell = (x) => '<td>' + process_cell(x) + '</td>';
    var concat = (x, y) => x + y;
    return row.map(makecell).reduce(concat, '') + '</tr>';
}

// processing header names
function process_header_name(hn){
    if(hn === "unknowns"){
        return "??";
    } else {
        return hn;
    }
}

// it takes a json object: counterexamples
function gen_counterexamples_html(counterexamples){
    var html = "";
    html += "Two queries are not equivalent."
    html += '<br><br><p><span style="font-weight: bold;">Counter Examples: </span>';
    html += '(i.e., input tables that, when fed into your input queries, will return different results)</p>';
    for (var i = 0; i < counterexamples.length; i++) {
        var table = counterexamples[i];
        var table_html = '<p>';
        table_html += 'Table <em> ' + table["table-name"] + '</em> <br>';
        table_html += '<table><tr>';

        // generate headers
        var header = table['table-content'][0];
        for (var j = 0; j < header.length; j++) {
            table_html += '<th>' + process_header_name(header[j]) + '</th>';
        }
        table_html += '</tr><tr>';

        // we don't generate multiplicity column here, instead generate concrete rows
        var content = table['table-content'][1];
        for (var j = 0; j < content.length; j++) {
            var row = content[j][0];
            var multiplicity = content[j][1];
            for(var k =0; k < multiplicity; k++){
                table_html += gen_row_html(row);
            }
        }

        table_html += '</table> </p>';
        html += table_html;
        html += '<p> ?? is a synthetic attribute that represents any number of attributes. </p>';
    }
    return html;
}

$(function () {
    
    var timeout_value = 7000; // 7 sec
    var initial_timeout = 10000; // 10 sec

    // TODO: generate a random permutation
    var queries = [[simple_1, false, simple_1_r], [join_elim_wrong, false, join_elim_wrong_r], 
                   [conjunct_select, true, conjunct_select_r], [disjunct_select_wrong, false, disjunct_select_wrong_r],
                   [common_exp, true, common_exp_r], [join_elim, true, join_elim_r], 
                   [disjunct_select_right, true, disjunct_select_right_r]];
    
    var challenger_name  = "";
    var current_problem = 0;
    var score = 0;  // number of correct answers

    var yes_audio = document.getElementById("yes-audio");
    var no_audio = document.getElementById("no-audio");
    var timeout_audio = document.getElementById("timeout-audio");
    var timeout_flags = Array(queries.length).fill(true);

    if(challenger_name == ""){
        $('#start-modal').modal('show');
    }

    $('#start-modal').on('hidden.bs.modal', function (e) {
        if ($('#challenger-name-input').val() == "") {
            $('#start-modal').modal('show');
        } else {
            challenger_name = $('#challenger-name-input').val();
            editor.setValue(queries[current_problem][0], -1);
            $("#feedback").text("");
            setTimeout(user_timeout.bind(null, current_problem), initial_timeout);
        }
    });

    function show_result(problem_num){
        var result = queries[problem_num][2];
        var answer = result["result"];
        if (answer === "NEQ") {
            var ros = result["counterexamples"];
            $("#feedback").html(gen_counterexamples_html(ros));
        } else if (answer === "EQ") {
            $("#feedback").text("Two queries are equivalent.");
        } else if (answer === "UNKNOWN") {
            $("#feedback").text("Two queries' equivalence is unknown. Solver runs out of time.");
        } else { //error
            $("#feedback").text(result["error_msg"]);
        }
    }

    function user_timeout(problem_num){
        if(timeout_flags[problem_num]){ // if the user don't do any thing
            $("#query-status").text("Timeout!");
            timeout_audio.play();
            show_result(problem_num);
        }
    }

    function result_msg(score){
        return "Your beat Cosette in " + score + " out of " + queries.length + " problems."
    }

    function score_text(score){
        return "Total Score: " + score; 
    }

    function next(){
        current_problem += 1;
        $("#problem-number").text("Problem "+ (current_problem+1));
        editor.setValue(queries[current_problem][0], -1);
        $("#feedback").text("");
        $("#query-status").text("");
        setTimeout(user_timeout.bind(null, current_problem), timeout_value);
    }

    function restart(){
        current_problem = 0;
        challenger_name = "";
        score = 0;
        $("#total-score").text(score_text(score));
        $("#problem-number").text("Problem "+ (current_problem+1));
        editor.setValue(queries[current_problem][0], -1);
        $("#feedback").text("");
    }

    $('#yes-btn').click(function(){
        timeout_flags[current_problem] = false; 
        show_result(current_problem);
        if(queries[current_problem][1]){ // the user gets it right 
            score += 1;
            if(current_problem == queries.length -1){ // finished
                $("#result-msg").text("Your answer is correct. " + result_msg(score));
                $("#result-modal").modal('show');
            }
            else { 
                $("#correct-modal").modal('show');
            }
            $("#total-score").text(score_text(score));
            yes_audio.play();
        }
        else { // the user gets it wrong
            if(current_problem == queries.length -1){ // finished
                $("#result-msg").text("Your last answer is Wrong. " + result_msg(score));
                $("#result-modal").modal('show');
            }
            else {
                $("#incorrect-modal").modal('show');             
            }
            no_audio.play();
        }
    });

    $('#no-btn').click(function(){  
        timeout_flags[current_problem] = false;
        show_result(current_problem);
        if(queries[current_problem][1]){ // the user gets it wrong 
            if(current_problem == queries.length -1){ // finished
                $("#result-msg").text("Your last answer is correct. " + result_msg(score));
                $("#result-modal").modal('show');
            }
            else { 
                $("#incorrect-modal").modal('show');
            }
            $("#total-score").text(score_text(score));
            no_audio.play();
        }
        else { // the user gets it right
            score += 1;
            if(current_problem == queries.length -1){ // finished
                $("#result-msg").text("Your last answer is Wrong. " + result_msg(score));
                $("#result-modal").modal('show');
            }
            else {
                $("#correct-modal").modal('show');
            }
            yes_audio.play();
        }
    });

    $('#next-btn').click(function(){  
        timeout_flags[current_problem] = false;  
        if (current_problem == queries.length - 1) { // finished
            $("#result-msg").text(result_msg(score));
            $("#result-modal").modal('show');
        }
        else {
            next();
        }
    });

    $('#correct-modal').on('hidden.bs.modal', function (e) {
        next();
    });

    $('#incorrect-next').click(next);

    $('#correct-next').click(next);

    $('#restart').click(restart);

    /*
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
                    $("#feedback").html(gen_counterexamples_html(ros));
                } else if (answer === "EQ") {
                    $("#feedback").text("Two queries are equivalent.");
                } else if (answer === "UNKNOWN") {
                    $("#feedback").text("Two queries' equivalence is unknown. Solver runs out of time.");
                } else { //error
                    $("#feedback").text(result["error_msg"]);
                }
            }
        });
    }); */

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
