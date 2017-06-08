# Cosette-Web

Cosette-Web is a web interface for the [Cosette](http://cosette.cs.washington.edu/) SQL Sovler.

#### Run the server 
Run command ```sh run_server.sh```.


#### Testing

Sample docker command for running docker for testing.
```docker run -ti -v /Users/dli/research/Cosette-Web/backend/main.py:/Cosette-Web/backend/main.py -v /Users/dli/research/Cosette-Web/frontend:/Cosette-Web/frontend -e COS_DB_HOST=10.200.10.1 -e COS_DB_USERNAME=dli -e COS_DB_DATABASE=postgres -e COS_DB_PASSWORD='' -p 5000:5000 2ce8d9a0093b /bin/bash```

You also need to change the postgres config to listen to all network connections.
