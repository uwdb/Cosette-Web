from subprocess import Popen, PIPE
import pipes
import tempfile
import time
import re

regex = r'[a-zA-z]+\.v\"'

ros_regex = r'[a-zA-z]+\.rkt'

def solve(query):
    with tempfile.NamedTemporaryFile() as temp:
        temp.write(query);
        temp.seek(0);
        cmd_coq = 'cd Cosette; ./solve.sh ' + temp.name
        cmd_ros = 'cd Cosette; ./rosette_solve.sh ' + temp.name
        running_procs = [(Popen(cmd_coq, shell=True, stdout=PIPE, stderr=PIPE), 0),
                         (Popen(cmd_ros, shell=True, stdout=PIPE, stderr=PIPE), 1)]
        results = ["", ""]
        while running_procs:
            for proc in running_procs:
                retcode = proc[0].poll()
                if retcode is not None:
                    running_procs.remove(proc)
                    results[proc[1]] = proc[0].stdout.read() + proc[0].stderr.read()
                else:
                    time.sleep(.1)
                    continue
        return parse_results(results)

def parse_results(results):
    output_cmp = results[0]
    output_lower = output_cmp.lower()
    matches = re.search(regex, output_cmp)
    ros_matches = re.search(ros_regex, results[1])
    coq_filename = None
    ros_filename = None
    print(results[1])
    if matches:
        coq_filename = matches.group()[:-1]
    if ros_matches:
        ros_filename = ros_matches.group()
    ret = ''
    if "error" in output_lower:
        if "attempt to save an incomplete proof" in output_lower:
            ret = "Query equivalence unknown."
        elif "syntax error" in output_lower:
            ret = "Syntax error in Cosette."
    else:
        ret = "Success. Queries are equivalent."
    output_filename = coq_filename[:-1] + "output"
    write_output_file(results[0], 'Cosette/.compiled/' + output_filename)

    ros_results = results[1].replace(ros_filename, '')

    ret += '<br><a href="/compiled/{}" target="_blank">Coq File</a>'.format(coq_filename)
    ret += '<br><a href="/compiled/{}" target="_blank">Output File</a>'.format(output_filename)
    ret += '<br><a href="/compiled/{}" target="_blank">Rosette File</a>'.format(ros_filename)
    ret += '<br>' + ros_results
    return ret

def write_output_file(data, filename):
    with open(filename, 'w') as file:
        file.write(data)
