from subprocess import Popen, PIPE
import pipes
import tempfile
import time
import re
import json

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
    if matches:
        coq_filename = matches.group()[:-1]
    if ros_matches:
        ros_filename = ros_matches.group()
    coq_ret = ''
    ros_ret = ''
    if "error" in output_lower:
        if "attempt to save an incomplete proof" in output_lower:
            coq_ret = "Query equivalence unknown."
        elif "syntax error" in output_lower:
            coq_ret = "Syntax error in Cosette."
    else:
       coq_ret = "Success. Queries are equivalent."
    output_filename = coq_filename[:-1] + "output"
    write_output_file(results[0], 'Cosette/.compiled/' + output_filename)

    ros_results = results[1].replace(ros_filename, '')

    coq_ret += '<br><a href="/compiled/{}" target="_blank">Coq File</a>'.format(coq_filename)
    
    ros_ret += '<br><a href="/compiled/{}" target="_blank">Rosette File</a>'.format(ros_filename)
    print(ros_results)
    json_dict = {
            'coq_html': coq_ret,
            'rosette': {
                'html': ros_ret,
                'json': json.loads(ros_results)
                }
            }
    
    return json.dumps(json_dict)

def write_output_file(data, filename):
    with open(filename, 'w') as file:
        file.write(data)
