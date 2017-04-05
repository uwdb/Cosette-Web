from subprocess import Popen, PIPE
import pipes
import tempfile
import time
import re

regex = r'[a-zA-z]+\.v\"'

def solve(query):
    with tempfile.NamedTemporaryFile() as temp:
        temp.write(query);
        temp.seek(0);
        cmd_coq = 'cd Cosette; ./solve.sh ' + temp.name
        cmd_ros = './rosette_FAKE.sh'
        running_procs = [(Popen(cmd_coq, shell=True, stdout=PIPE, stderr=PIPE), 0),
                         (Popen(cmd_ros, shell=True, stdout=PIPE, stderr=PIPE), 1)]
        results = ["", ""]
        while running_procs:
            for i, proc in enumerate(running_procs):
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
    coq_filename = None
    if matches:
        coq_filename = matches.group()[:-1]
    else:
        return results
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
    ret += '<br><a href="/compiled/{}" target="_blank">Coq File</a>'.format(coq_filename)
    ret += '<br><a href="/compiled/{}" target="_blank">Output File</a>'.format(output_filename)
    return ret

def write_output_file(data, filename):
    with open(filename, 'w') as file:
        file.write(data)
