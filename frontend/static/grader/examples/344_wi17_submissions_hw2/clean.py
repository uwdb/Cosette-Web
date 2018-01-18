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
        last_keyword = ''
        unique_int = 0
        # Add select
        for item in parsed[0]:
            # Add case statement to deal with the way queries are passed across key words and stuff
            # Look at: https://github.com/andialbrecht/sqlparse/blob/master/examples/extract_table_names.py
            if item.is_keyword:
                query = query + " " + item
                last_keyword = item
            elif isinstance(item, IdentifierList):
                if last_keyword == 'SELECT':
                    for ident in item.get_identifiers():
                        if isinstance(ident, Identifier):
                            print(ident)
                        else:
                            query = query + ident
                        
                elif last_keyword == 'FROM':
                    print(item)
                elif last_keyword == 'WHERE':
                    print(item)
            query = query + part.normalized
        
        contents = contents.replace(";", "")
        f = open(full_path, "w")
        f.write(contents)
            
        