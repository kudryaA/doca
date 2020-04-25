FROM python:3.8
WORKDIR /home
COPY requirements.txt /home
RUN pip3 install -r requirements.txt
COPY app.py /home
CMD python app.py