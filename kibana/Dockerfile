FROM amazon/opendistro-for-elasticsearch-kibana:1.6.0
COPY upload_file-0.0.0.zip /home/upload_file-0.0.0.zip
RUN /usr/share/kibana/bin/kibana-plugin install file:///home/upload_file-0.0.0.zip

