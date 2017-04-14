FROM shumo/cosette-frontend

RUN apt-get install -yqq python-pip

#RUN curl -O https://mirror.racket-lang.org/installers/6.8/racket-6.8-x86_64-linux.sh
#RUN chmod +x racket-6.8-x86_64-linux.sh
#RUN printf '\n\n/usr/local\n' | ./racket-6.8-x86_64-linux.sh

#RUN raco pkg install rosette; exit 0

COPY requirements.txt /src/
RUN pip install -r /src/requirements.txt

COPY . /src/
WORKDIR /src/
EXPOSE 5000
ENV FLASK_APP main.py
CMD ["./run_server.sh"]
