var execBtn = document.getElementById('execute');
var outputElm = document.getElementById('output');
var dbFileElm = document.getElementById('dbfile');

// start SQL
var sql = window.SQL;

// Open a database
var db = new SQL.Database();

var dbLoaded = false;

// Start the worker in which sql.js will run
/*var worker = new Worker("js/worker.sql.js");
worker.onerror = error;*/

// Open a database
/*worker.postMessage({action:'open'});

function error(e) {
	// console.log(e);
	outputElm.textContent = e.message;
}
*/
// Load db from file
dbFileElm.onchange = function() {
	var f = dbFileElm.files[0];
	var r = new FileReader();
	outputElm.innerHTML = "Loading database ...";
	var loadingSpinner = $('<div>', {
        "id": "database-loading",
        "class": "fa fa-refresh fa-spin fa-fw",
    });
    $("#output").append(loadingSpinner);
	r.onload = function() {
		var Uints = new Uint8Array(r.result);
		db = new SQL.Database(Uints);
		readDbFile("SELECT `name`\n  FROM `sqlite_master`\n  WHERE type='table';");
	}
	r.readAsArrayBuffer(f);
	/*var f = dbFileElm.files[0];
	var r = new FileReader();
	r.onload = function() {
		worker.onmessage = function () {
			// Show the schema of the loaded database
			execute("SELECT `name`\n  FROM `sqlite_master`\n  WHERE type='table';");
		};
		try {
			worker.postMessage({action:'open',buffer:r.result}, [r.result]);
		}
		catch(exception) {
			worker.postMessage({action:'open',buffer:r.result});
		}
	}
	r.readAsArrayBuffer(f);*/
	//dbLoaded = true;
}

/*function execute(commands) {
	worker.onmessage = function(event) {
		var results = event.data.results;

		printResults(results);
	}
	worker.postMessage({action:'exec', sql:commands});
	outputElm.textContent = "Fetching results...";
}*/

/*function execSQLComparison(qnNum, studentQuery) {
	var x = qnNum + " called execSQLComparison";
	// console.log(x);
	var commands = studentQuery + "\n;";
	commands += "SELECT count(*) from " + qnNum + ";";
	worker.onmessage = function(event) {		
		var results = event.data.results;
		var studOutput = results[0].values.length;
		var solOutput = results[1].values[0];
		if (studOutput == solOutput) {
			compareSQL(qnNum, studentQuery);
		} else {
			compareElm.innerHTML = "NEQ_ROW_CARD";
			execInfo.innerHTML = qnNum + " done";
		} 
	} 
	worker.postMessage({action:'exec', sql:commands});
	// console.log("return from execSQLComparison");
	return 'executed';
}*/


function execSQLComparison(qnNum, studentQuery) {
	try {
		var commands = studentQuery + "\n;";
		commands += "SELECT * from " + qnNum + ";";
		// console.log(commands);
		var results = db.exec(commands);
		if (results[0].columns.length != results[1].columns.length) {
			return "NEQ_COL_CARD";
		}
		var studOutput = results[0].values;
		var solOutput = results[1].values;
		if (studOutput.length != solOutput.length) {
			if (qnNum == 'q5' && studOutput.length == 3) {
				var alternativeSQL = "SELECT * FROM q5a;";
				var res = db.exec(alternativeSQL);
				var alternativeSolOutput = results[1].values;
				return compareOutput('q5a', studOutput, alternativeSolOutput);
			} else {
				return "NEQ_ROW_CARD";
			}
		} else {
			return compareOutput(qnNum, studOutput, solOutput);
		}
		// return (studOutput.length == solOutput.length) ? compareOutput(solOutput, studOutput) : "NEQ_ROW_CARD";
	} catch (e) {
		return "ERROR: " + e.message;
	}
}

/*function compareSQL(qnNum, studentQuery) {
	var x = qnNum + " called compareSQL";
	// console.log(x);
	var command = "SELECT count(*) from (select * from " + qnNum + " except \n" + studentQuery + "\n)";
	worker.onmessage = function(event) {
		var results = event.data.results;
		var count = results[0].values[0];
		var y = qnNum + " working on comparison";
		// console.log(y);
		compareElm.innerHTML = (count == 0) ? "EQ_ON_DATASET" : "NEQ_ON_DATASET";
		execInfo.innerHTML = qnNum + " done";
	} 
	worker.postMessage({action:'exec', sql:command});
	// console.log("postMessage compareSQL");
}*/

function compareOutput(qnNum, studOutput, solOutput) {
	try {
		// var command = "SELECT count(*) from (" + studentQuery + " except \n select * from " + qnNum + "\n)";
		//var command = "SELECT count(*) from (select * from " + qnNum + " except \n " + studentQuery + "\n)";
		//var results = db.exec(command);
		//var count = results[0].values[0];
		//return (count == 0) ? "EQ_ON_DATASET" : "NEQ_ON_DATASET";
		// var command = "select * from " + qnNum + ";";
		// var result = db.exec(command);
		// var ans = result[0].values;
		/*var i = ans.length;
		while (i--) {
			if (!arrayEqual(ans[i], studOutput[i])) {
				return "NEQ_ON_DATASET";
			}
		}*/
		if (arrayEqual(solOutput, studOutput)) return "EQ_ON_DATASET";
		studOutput.sort();
		solOutput.sort();
		if (arrayEqual(solOutput, studOutput)) {
			if (qnNum == 'q1' || qnNum == 'q3'){
				return "NEQ_ORDERING";
			} else {
				return "EQ_ON_DATASET";
			}
		} else {
			return "NEQ_ON_DATASET";
		}
		// return (arrayEqual(solOutput, studOutput)) ? "NEQ_ORDERING" : "NEQ_ON_DATASET";
	} catch (e) {
		return "ERROR: " + e.message;
	}
}

function arrayEqual(a1, a2) {
	var i = a1.length;
	while (i--) {
		var isEqual = true;
		if (Array.isArray(a1[i])) {
			isEqual = arrayEqual(a1[i], a2[i]);
		} else {
			isEqual = (a1[i] == a2[i]);
		}
		if (!isEqual) {
			return false;
		}
	}
	return true;
}

// Run a command in the database
function readDbFile(commands) {
	try {
		// console.log("Loading database");
		var results = db.exec(commands);
		printResults(results);
		dbLoaded = true;
	} catch (e) {
		outputElm.innerHTML = "<span style='color:red;'>ERROR: " + e.message + "</span>";
	}
}

// Printing results
function printResults(results) {
	outputElm.innerHTML = "<span style='color:green;'>DB Loaded: </span><br>";
	for (var i = 0; i < results.length; i++) {
		outputElm.innerHTML += "TABLES: " + results[i].values + "<br>";
	}
}