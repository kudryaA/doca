FROM python:3.7
WORKDIR /home
COPY requirements.txt /home
RUN pip3 install -r requirements.txt
COPY test_image.py /home
COPY app.py /home
CMD python app.py