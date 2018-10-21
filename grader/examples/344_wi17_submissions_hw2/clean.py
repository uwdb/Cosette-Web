from os import listdir, getcwd
from os.path import join, isdir
import re
import sqlparse

# Make sure that it isn't a .vs directory with dir[0]...
for dir in [dir for dir in listdir(".") if isdir(dir) and dir[0] != "."]:
    for f_name in [file for file in listdir(dir) if file.endswith(".sql")]:
        full_path = join(dir, f_name)
        f = open(full_path, "r")
        contents = f.read()

        if len(contents) == 0:
            continue

        contents = contents.replace("\n", " ")
        parsed = sqlparse.parse(contents)
        print(parsed)

        query = ''
        # Add select
        for part in parsed[0]:
            # Add case statement to deal with the way queries are passed across key words and stuff
            query = query + part.normalized
        
        contents = contents.replace(";", "")
        f = open(full_path, "w")
        f.write(contents)
            
        