FROM konne/cosette

RUN apt-get install -yqq python-pip

COPY requirements.txt /src/
RUN pip install -r /src/requirements.txt

COPY . /src/
WORKDIR /src/
EXPOSE 5000
ENV FLASK_APP main.py
CMD ["./run_server.sh"]
