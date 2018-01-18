/**
 * Created by Njand on 7/9/2017.
 */

function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
}

var num_results = 0;

function addStudentUIV2(studentName, questionName, result) {
    // Add UI only if we haven't reported on this question
    if (!$("#" + studentName + "-" + questionName + "-feedback").length) {
        var num = num_results + 1;
        num_results++;

        var row = $('<tr></tr>', {
            "id": studentName + "-" + questionName + "-feedback"
        });
        var num_col = $('<th scope="col">' + num + '</th>');
        var name_col = $('<td></td>', {
            "text": studentName
        });
        var question_col = $('<td></td>', {
            "text": questionName
        });

        var result_col = $('<td></td>').append('<a href="#" class="result-anchor">pass</a>');

        row.append(num_col);
        row.append(name_col);
        row.append(question_col);
        row.append(result_col);
        $('.feedback-table-body').append(row);
    }
}

function addStudentUI(studentName, questionName) {
	// Add UI only if we haven't reported on this question
	if (!$("#" + studentName + "-feedback").length) {
		// Add the wrapper UI if it hasn't been added already
		var outer = $('<div></div>', {
			"class": "col-md-3",
		});
		var panel = $('<div></div>', {
			"class": "panel panel-warning",
			"id": studentName + "-feedback"
		});
		var header = $('<div>', {
			"class": "panel-heading"
		});
		var headerText = $('<h3>', {
			"text": studentName,
			"class": "panel-title"
		});
		header.append(headerText);
		var body = $('<div>', {
			"class": "panel-body",
			"id": studentName + "-feedback-body"
		});
		panel.append(header);
		panel.append(body);
		outer.append(panel);
		$("#feedback").append(outer);
	}

	if (!$("#" + studentName + "-feedback-body-" + questionName).length) {
		// Report on the question
		var resultUI = $("<p>").text(questionName).attr("id", studentName + "-feedback-body-" + questionName);
		$("#" + studentName + "-feedback-body").append(resultUI);
	}

	if (!$("#" + studentName + "-feedback-body-" + questionName + "-loading").length) {
		var loadingSpinner = $('<div>', {
			"download": studentName + ".txt",
			"id": studentName + "-feedback-body-" + questionName + "-loading",
			"class": "fa fa-refresh fa-spin fa-fw",
		});
		$("#" + studentName + "-feedback-body-" + questionName).append(loadingSpinner);
	}
}



$(document).ready(function() {

    var API_KEY = "none";
    var SEPARATOR = "|*|";

    var TEMPLATE_INPUT = "";

    $("#submit-btn").click(readFilesAndSubmit);
    
    $('.conn-settings-btn').click(function() {
        $('#conn-modal').modal('show');
        return false;
    });

    $('.conn-save-btn').click(function() {
        $('#conn-modal').modal('hide');
        if ($('#dbConnInput').val() && $('#numSqlRetries').val()) {
            $('.conn-checkmark').show();
        } else {
            $('.conn-checkmark').hide();
        }
        return false;
    });


    $('.template-insert-btn').click(function() {
        return false;
        $('.template-input').val(TEMPLATE_INPUT);
        $('#template-modal').modal('show');
        return false;
    });

    $('.template-save-btn').click(function() {
        $('#template-modal').modal('hide');
        TEMPLATE_INPUT = $('.template-input').val();
        $('.template-checkmark').show();
        return false;
    });

    $('.select-schema-btn').click(function() {
        $('#schema-modal').modal('show');
        return false;
    });

    $('.schema-save-btn').click(function() {
        $('#schema-modal').modal('hide');
        $('.schema-checkmark').show();
        return false;
    });

    $('.schema-link').click(function() {
        $('.schema-dropdown').html($(this).text() + ' <span class="caret"></span>');
    });

    $('.clear-schema').click(function() {
        $('.schema-dropdown').html('Existing Schemas <span class="caret"></span>');
    });

    function addLoadingUI(studAnsPerStud) {
        for (var studentName in studAnsPerStud) {
            for (var questionName in studAnsPerStud[studentName].files) {
                addStudentUI(studentName, questionName);
            }
        }
    }

    function addToStudentUI(questionName, studentName, html, isDone) {
        if ($("#" + studentName + "-feedback-body-" + questionName + "-loading").length) {
            // There is loading UI that we want to clear as soon as we hear back from a question
            $("#" + studentName + "-feedback-body-loading").remove();
        }
        // Report on the question
        $("#" + studentName + "-feedback-body-" + questionName).html("<b>" + questionName + ":</b>" + html);

        if (isDone) {
            $("#" + studentName + "-feedback").removeClass("panel-warning").addClass("panel-primary");
        }
    }

    // File Uploading UI

    $(document).on('change', ':file', function() {
        var input = $(this).get(0);
        var originator = "#" + input.id.replace("Input", "Uploads");
        var files = input.files;
        var numFiles = files.length;
        var fileNames = {};

        for (var i = 0; i < files.length; i++) {
            fileNames[files[i].name] = files[i].webkitRelativePath;
        }

        $(this).trigger('fileselect', [originator, numFiles, fileNames]);
    });

    $(':file').on('fileselect', function(event, id, numFiles, label) {
        for (var i = 0; i < numFiles; i++) {
            $(id).append($('<li>').text(label[i]));
        }
        $(id + "CollapseButton").attr("disabled", false);
        $(id + "CollapseButton").removeClass("hidden");
        $(id + "CollapseButton").text(numFiles + " files uploaded");
        console.log(numFiles);
        console.log(label);
    });

    // Cosette
    function getFileContents(file) {
        return new Promise(function(resolve, reject) {
            var fr = new FileReader();
            // Evaluate function here to pass in inputName for later
            fr.onload = function() {
                resolve([file, this.result]);
            };
            fr.onerror = function() {
                reject(file);
            };
            console.log("Fetching file contents for file " + file.name);
            fr.readAsText(file);
        });
    }

    function getAllFiles(fileInput, inputName) {
        return new Promise(function(resolve, reject) {
            // Check input
            if (!fileInput) {
                reject("Couldn't find passed fileInput.");
            } else if (!fileInput.files) {
                reject("This browser doesn't seem to support the `files` property of file inputs.");
            } else if (!fileInput.files[0]) {
                reject("Please select a file before clicking 'Load'");
            } else {
                // Collect promises for files loading
                console.log("Fetching file contents for input " + inputName);
                var fileLoadPromises = [];
                for (var i = 0; i < fileInput.files.length; i++) {
                    var file = fileInput.files[i];
                    fileLoadPromises.push(getFileContents(file));
                }
                Promise.all(fileLoadPromises).then(function(loadResults) {
                    console.log("Success! Fetched file contents for input " + inputName);
                    resolve([inputName, loadResults]);
                }, function(loadResults) {
                    reject("Failed to load all files for input " + inputName);
                });
            }
        });
    }

    function readFilesAndSubmit() {
        if (typeof window.FileReader !== 'function') {
            console.log("The file API isn't supported on this browser yet.");
            return;
        }

        // File inputs 
        var inputs = {
            "schema": $("#schemaInput").get(0),
            "student": $("#studentInput").get(0),
            "instructor": $("#instructorInput").get(0),
        };

        var fileLoadPromises = [];
        for (var inputName in inputs) {
            fileLoadPromises.push(getAllFiles(inputs[inputName], inputName));
        }

        Promise.all(fileLoadPromises).then(function(loadPromiseResults) {
                console.log("Success! Fetched all file contents");
                // Record all the information needed to invoke Cosette (API key, file contents for each of schema, instructor, and student)
                var fileContents = { "apikey": API_KEY };
                for (var loadPromiseResultIndex in loadPromiseResults) {
                    var loadPromiseResult = loadPromiseResults[loadPromiseResultIndex];
                    var inputName = loadPromiseResult[0];
                    var loadResults = loadPromiseResult[1];
                    fileContents[inputName] = [];
                    for (var fileLoadedIndex in loadResults) {
                        var fileLoaded = loadResults[fileLoadedIndex];
                        fileContents[inputName].push({
                            file: fileLoaded[0],
                            contents: fileLoaded[1]
                        });
                    }
                }

                fileContents.dbConn = $("#dbConnInput").val();              
                GradeFiles(fileContents);
            },
            function(loadPromiseResults) {
                console.log(loadPromiseResults);
            });
    }

    function removeExtension(fileNameWithExtension) {
        return fileNameWithExtension.substring(0, fileNameWithExtension.indexOf("."));
    }

    function RunSql(questionName, studentName, studentQuery, referenceQuery, dbConn) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://attu2.cs.washington.edu:5000/comparequery',
                // Let's wait a long time!
                timeout: 1000*60*60*4,
                method: 'POST',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify({
                    "stud": studentQuery,
                    "instr": referenceQuery,
                    "conn": dbConn
                }),
                success: function(data) {
                    console.log("Received SQL response for student " + studentName + ", question " + questionName);
                    console.log("Response was: " + data)
                    resolve({
                        // Need to stringify because we unwrap it later
                        data: JSON.stringify(data),
                        questionName: questionName,
                        studentName: studentName
                    });
                },
                error: function(err) {
                    console.log("Request was rejected by the SQL backend. Error: " + err);                  
                    reject({
                        data: JSON.stringify({
                            "result": "ERROR",                                  // can be EQ, NEQ, UNKNOWN, or ERROR
                            "counterexamples": "Fatal error",                   // counterexample if result is NEQ
                            "error_msg": "Failed to run against SQL backend",   // error message if result = ERROR
                        }),
                        questionName: questionName,
                        studentName: studentName
                    });
                }
            });
        });
    }

    function WrapWithRetry(innerPromise, retryPromise) {
        return innerPromise.catch(
            function(failure) {
                console.log("Creating retry promise because a request failed!");
                return retryPromise;
            }
        );
    }
    
    function RunCosette(questionName, studentName, schemaContents, instrAns, studAns, apikey) {
        var instructor = "query q2 `" + instrAns.replace(";", "") + "\n`;";
        var student = "query q1 `" + studAns.replace(";", "") + "`\n;";
        var verify = "verify q1 q2;";
        var query = schemaContents + student + instructor + verify;
        query = query.replace(/\r/g, "");

        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://demo.cosette.cs.washington.edu/solve',
                method: 'POST',
                data: { "query": query, "api_key": apikey },
                success: function(data) {
                    console.log("Received response for student " + studentName + ", question " + questionName);

                    // Reject the promise if for whatever reason we could not decide
                    if ($.parseJSON(data).result == "UNKNOWN" || $.parseJSON(data).result == "ERROR") {
                        reject();
                    } else {
                        resolve({
                            data: data,
                            questionName: questionName,
                            studentName: studentName
                        });
                    }
                },
                error: function(err) {
                    console.log("Request was rejected by the Cosette backend. Error: " + err)                            
                    reject({
                        data: JSON.stringify({
                            "result": "ERROR",                  // can be EQ, NEQ, UNKNOWN, or ERROR
                            "counterexamples": "Fatal error",   // counterexample if result is NEQ
                            "error_msg": err,                   // error message if result = ERROR
                        }),
                        questionName: questionName,
                        studentName: studentName
                    });
                }
            });
        });
    }

    
    function getNotSubmittedPromise(questionName, studentName) {
        return new Promise(function(resolve, reject) {
            // Just resolve this
            resolve({
                data: JSON.stringify({
                    status: "NONE"
                }),
                questionName: questionName,
                studentName: studentName
            });
        });
    }

    function GradeFiles(fileContents) {
        // Collect instructor solutions for each question
        var instrAns = {};
        for (var i = 0; i < fileContents.instructor.length; i++) {
            var instrFileSubmitted = fileContents.instructor[i];
            instrAns[removeExtension(instrFileSubmitted.file.name)] = instrFileSubmitted.contents;
        }

        // Make question number to schema map
        var schemaMap = {};
        for (var i = 0; i < fileContents.schema.length; i++) {
            var schema = fileContents.schema[i];
            var schemaContents = schema.contents;
            var questionName = removeExtension(schema.file.name);
            schemaMap[questionName] = schemaContents;
        }

        // Make an object that records all of the questions submitted for each student
        var studAnsPerStud = {};
        for (var i = 0; i < fileContents.student.length; i++) {
            var fileSubmission = fileContents.student[i];
            var split = fileSubmission.file.webkitRelativePath.split("/");
            var fileName = removeExtension(split.pop());
            var studentName = split.pop();

            if (!(studentName in studAnsPerStud)) {
                studAnsPerStud[studentName] = {};
                studAnsPerStud[studentName].promises = [];
                studAnsPerStud[studentName].files = {};
            }

            if (!(fileName in studAnsPerStud[studentName].files)) {
                studAnsPerStud[studentName].files[fileName] = {};
            }
            studAnsPerStud[studentName].files[fileName].contents = fileSubmission.contents;
        }

        addLoadingUI(studAnsPerStud);

        // Add promises as we discover jobs, then wait for grading
        for (var questionName in schemaMap) {
            var schemaContents = schemaMap[questionName];
            for (var studentName in studAnsPerStud) {
                if (!(questionName in studAnsPerStud[studentName].files)) {
                    // The student didn't submit this question
                    studAnsPerStud[studentName].promises.push(
                        getNotSubmittedPromise(questionName, studentName)
                    );

                    // Fill in loading state
                    addStudentUI(studentName, questionName);
                } else {
                    var studAnsToGrade = studAnsPerStud[studentName].files[questionName].contents;
                    
                    console.log("Submitting Cosette request for student " + studentName + ", question " + questionName);
                    
                    var instrAnsSplit = instrAns[questionName].split(SEPARATOR);                                        
                    
                    var graderPromise = RunCosette(questionName, studentName, schemaContents, instrAnsSplit[0], studAnsToGrade, fileContents.apikey);
                    
                    // If we are grading with Cosette, let's wrap with retrying all the other options
					for (var instrAnsOption = 1; instrAnsOption < instrAnsSplit.length; instrAnsOption++) {
						graderPromise = WrapWithRetry(
							graderPromise.then(
								function(data) {
									return new Promise(function(resolve, reject) {
										if ($.parseJSON(data.data).result == "NEQ") {
											reject(data);
										} else {
											resolve(data);
										}
									});
								}
							),
							RunCosette(questionName, studentName, schemaContents, instrAnsSplit[instrAnsOption], studAnsToGrade, fileContents.apikey)
						);
					}

                    var numRetries = Math.min($("#numSqlRetries").val(), 1);
                    for (var retry = 0; retry < numRetries; retry++) {
                        graderPromise = WrapWithRetry(
                            graderPromise,
                            RunSql(questionName, studentName, studAnsPerStud[studentName].files[questionName].contents, instrAnsSplit[0], fileContents.dbConn)
                        );
                    }

                    graderPromise = graderPromise.catch(
                            function(err) {
                                return err;
                            }
                        );

                    // Prevent errors from bubbling up
                    // TODO: Just make the later code deal with the error cases itself.
                    studAnsPerStud[studentName].promises.push(graderPromise);
                }
            }
        }

        var allDownloadableResults = {};
        var allDownloadableResultsPromises = [];

        // Wait for each student's grading to be done, record results
        for (var studentName in studAnsPerStud) {

            // We want to wait for all students to be graded, so let's add up all the promises we are waiting for
            for (var promiseIndex in studAnsPerStud[studentName].promises) {
                allDownloadableResultsPromises.push(studAnsPerStud[studentName].promises[promiseIndex]);
            }

            // This student has successfully been graded
            Promise.all(studAnsPerStud[studentName].promises).then(
                getStudentResultsSuccessHandler(schemaMap, studentName, allDownloadableResults));
        }

        // Callbacks have now populated allDownloadableResults - add download all UI
        Promise.all(allDownloadableResultsPromises).then(function(results) {
            var outer = $('<div></div>', {
                "class": "col-md-12"
            });
            var panel = $('<div></div>', {
                "class": "panel",
                "id": "all-feedback"
            });
            var header = $('<div>', {
                "class": "panel-heading panel-primary"
            });
            var headerText = $('<h3>', {
                "text": "All student summaries",
                "class": "panel-title"
            });
            header.append(headerText);
            var body = $('<div>', {
                "class": "panel-body",
                "id": "all-feedback-body"
            });
            panel.append(header);
            panel.append(body);
            outer.append(panel);
            $("#feedback").prepend(outer);

            var downloadAllButton = $('<a>', {
                "download": "allStudents.txt",
                "href": 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(allDownloadableResults)),
                "class": "btn btn-default btn-sm",
                "text": "Download All Student Summaries"
            });
            $("#all-feedback-body").append(downloadAllButton);
        });
    }

    function getStudentResultsSuccessHandler(schemaMap, studentName, allDownloadableResults) {
        return function(results) {
            // Build up a map of responses from Cosette for each question that a student submitted
            var resultPerQuestion = {};
            for (var resultIndex in results) {
                var result = results[resultIndex];
                resultPerQuestion[result.questionName] = $.parseJSON(result.data);
            }
            var downloadableResultsPerQuestion = {};
            for (var questionName in schemaMap) {
                // Student submitted this question
                displayStudentResult(studentName, questionName, resultPerQuestion[questionName]);
            }

            // resultPerQuestion contains responses per question as well as missing questions
            allDownloadableResults[studentName] = AddAndGetDownloadableSummary(studentName, resultPerQuestion);

            // Change UI to signify this student has been graded
            $("#" + studentName + "-feedback").removeClass("panel-warning").addClass("panel-primary");
        };
    }

    // TODO: Remove. This should never happen. I'm using success for everything now for better integration
    // with all.
    function getStudentResultsFailureHandler(studentName) {
        return function(results) {
            // Change UI to signify this student could NOT be graded
            $("#" + studentName + "-feedback").removeClass("panel-warning").addClass("panel-danger");
        }
    }

    function AddAndGetDownloadableSummary(studentName, results) {
        // Format results
        var score = 0;
        var formatted = {
            questions: {}
        };
        var resultText = "";
        for (var questionName in results) {
            // Increment the score for correct solutions
            if (results[questionName].result === "EQ" || results[questionName].result === "EQ_ON_DATASET") {
                score++;
            }
            formatted.questions[questionName] = getDisplayTextFromResult(results[questionName]);
            resultText += questionName + ": " + getDisplayTextFromResult(results[questionName])+ "\n"
        }
        formatted.score = score;
        resultText += "Score: " + score + "\n";
        var downloadButton = $('<a>', {
            "download": studentName + ".txt",
            "href": 'data:text/plain;charset=utf-8,' + encodeURIComponent(resultText/*JSON.stringify(formatted)*/),
            "class": "btn btn-default btn-sm",
            "text": "Download Summary"
        });
        $("#" + studentName + "-feedback-body").append(downloadButton);
        return formatted;
    }

    function getDisplayTextFromResult(result) {
        var status = result.result;
        var text;
        if (status === "NEQ") {
            // text = gen_counterexamples_html(result.counterexamples);
            text = "Not equivalent";
        } else if (status === "EQ") {
            text = '<span class="eq-span">Equivalent</span>';
        } else if (status === "EQ_ON_DATASET") {
            text = "Equal on dataset";
        } else if (status === "NEQ_ON_DATASET") {
            text = "Not equal on dataset";
        } else if (status === "UNKNOWN") {
            text = "Two queries' equivalence is unknown. Solver runs out of time.";
        } else if (status === "NONE") {
            text = "No solution was submitted";
        } else { //error
            text = result.error_msg;
        }
        return text;
    }

    function displayStudentResult(studentName, questionName, result) {
        var text = getDisplayTextFromResult(result);
        if ($("#" + studentName + "-feedback-body-" + questionName + "-loading").length) {
            // There is loading UI that we want to clear as soon as we hear back from a question
            $("#" + studentName + "-feedback-body-loading").remove();
        }
        // Report on the question
        if (result.result === 'NEQ') {
            var counter_html = escapeHtml(gen_counterexamples_html(result.counterexamples));
            $("#" + studentName + "-feedback-body-" + questionName).html("<b>" + questionName + ':</b> <a href="#" data-counterex="' + counter_html + '" class="counterex-link">' + text + '</a>');
        } else {
            if (text === 'undefined' || !text) {
                text = "No submission";
            }
            $("#" + studentName + "-feedback-body-" + questionName).html("<b>" + questionName + ":</b> " + text);
        }
    }

	function unescapeHtml(input) {
        return $('<div />').html(input).text();
	}


	var entityMap = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;',
	  '/': '&#x2F;',
	  '`': '&#x60;',
	  '=': '&#x3D;'
	};

	function escapeHtml (string) {
	  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	  });
	}


    $(document).on('click', '.counterex-link', function() {
        $('.counterex-body').html($(this).data('counterex'));
        $('#counterex-modal').modal('show');
        return false;
    });

    // Counter Example Rendering

    // it takes a json object: counterexamples
    function gen_counterexamples_html(counterexamples) {
        // TODO: We want to skip out of this if we used SQL to determine equivalence
        if (counterexamples == "SQL queries were unequal on current dataset" || counterexamples == "Fatal error") {
            return counterexamples;
        }
        var html = "";
        html += "Two queries are not equivalent.";
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
                for (var k = 0; k < multiplicity; k++) {
                    table_html += gen_row_html(row);
                }
            }

            table_html += '</table> </p>';
            html += table_html;
            html += '<p> ?? is a synthetic attribute that represents any number of attributes. </p>';
        }
        return html;
    }

    var the_number = 42;

    // process each cell of the content of a table
    function process_cell(cell) {
        if (typeof cell === "string" || cell instanceof String) {
            if (cell.startsWith("sv")) {
                return the_number;
            }
        }
        return cell;
    }

    // generate a row of a table: row is an array
    function gen_row_html(row) {
        var makecell = (x) => '<td>' + process_cell(x) + '</td>';
        var concat = (x, y) => x + y;
        return row.map(makecell).reduce(concat, '') + '</tr>';
    }

    // processing header names
    function process_header_name(hn) {
        if (hn === "unknowns") {
            return "??";
        } else {
            return hn;
        }
    }

    //$('#login-modal').modal({backdrop: 'static', keyboard: false});

    $('.login-btn').click(function () {
        var email = $('#email-input').val();
        var pass = $('#pass-input').val();
        Cookies.set('token2', 'asdf')

        if (email != '' && pass != '') {
            $.ajax({
                url: '/login',
                method: 'POST',
                data: {
                    'email': email,
                    'password': pass
                },
                success: function (data) {
                    var res = $.parseJSON(data);
                    var stat = res['status'];
                    if (stat == 'success') {
                        Cookies.set('token', res['token'])
                        API_KEY = res['token'];
                        $('#login-modal').modal('hide');
                    } else {
                        $('.invalid-creds').show();
                    }
                }
            });
        }
    });

});
