# Cosette-Web

Cosette-Web is for serving Cosette web interface. You can try [Cosette Demo](http://demo.cosette.cs.washington.edu/) or use the Web API [Cosette Web API](http://cosette.cs.washington.edu/) without the need of running the web server on your own. The following instructions are for the users who want to build and run Cosette web server on their own (It is not that hard too!).

### Install and Run Postgres (for user registration)

On Mac (assume you have installed [brew](https://brew.sh/)), 

  ``` brew install postgresql ```

Start postgres:

  ``` pg_ctl -D /usr/local/var/postgres start && brew services start postgresql ```

Check if the installation is successful:

  ``` postgres -V ```

You should see something like that:

  ``` postgres (PostgreSQL) 9.6.3 ```

Now change the `pg_hba.conf` file (the default location of this file is `/usr/local/var/postgres/`), to listen connection from docker container. Add the following line to `pg_hba.conf`

  ``` host    all             all             10.200.10.1/24          trust ```

And let postgres listen to all address by change the `listen_addresses` in `postgresql.conf` (the default location of this file is `/usr/local/var/postgres/`) to :

  ```listen_addresses = '*'```

Now restart postgres:

  ``` brew services restart postgresql ```

And make an alias of you host:

```  sudo ifconfig lo0 alias 10.200.10.1/24 ```

Now enter postgres shell using `psql postgres`, and create a user named `cosette`:

  ``` CREATE ROLE cosette WITH LOGIN PASSWORD 'cosetteisawesome'; ```

and create a database named `cosette`:

  ``` CREATE DATABASE cosette; ```


### Build Docker

Assume you have installed [docker](https://www.docker.com/community-edition#/download). Simply run:

``` docker run --name cosette --entrypoint /usr/bin/fish  -p 5000:5000 COS_DB_HOST=10.200.10.1 -e COS_DB_USERNAME=cosette -e COS_DB_DATABASE=cosette -e COS_DB_PASSWORD='cosetteisawesome' -ti shumo/cosette-frontend ```

This will pull a pre-build docker image from docker hub and enter the docker containers shell (fish in this case).

Note:
1. You can replace `/usr/bin/fish` with your favorite shell.

2. If you want to debug, assume you cloned this repo and under the root folder of this repo now.  Add ` -v $(pwd)/:/Cosette-Web-Dev` to mount current fold to `/Cosette-Web-Dev`.

### Run the server 

In the docker container's shell:

```
cd \Cosette-Web 
sh run_server.sh
```
(`cd \Cosette-Web-Dev` for debug setting)

you should see something like:

```
* Serving Flask app "main"
* Forcing debug mode on
* Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

### Now you can use Cosette Web interface

Now you can access cosette web interface from your browser on [http://0.0.0.0:5000/](http://0.0.0.0:5000/)
