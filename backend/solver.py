import subprocess
import pipes
import tempfile

def solve(query):
    with tempfile.NamedTemporaryFile() as temp:
        temp.write(query);
        temp.seek(0);
        cmd = 'cd Cosette; ./solve.sh ' + temp.name
        print cmd
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT, universal_newlines=False)
        return output
