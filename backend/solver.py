import subprocess
import pipes
import tempfile

def solve(query):
    with tempfile.NamedTemporaryFile() as temp:
        temp.write(query);
        temp.seek(0);
        cmd = 'cd Cosette; ./solve.sh ' + temp.name
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT, universal_newlines=False)
        output_cmp = output.lower()
        if "error" in output_cmp:
            if "attempt to save an incomplete proof" in output_cmp:
                return "Queries are not equivalent."
            elif "syntax error" in output_cmp:
                return "Syntax error in Cosette."
        else:
            return "Success. Queries are equivalent."
