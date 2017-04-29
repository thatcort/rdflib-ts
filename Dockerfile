# Docker container with nodejs environment and Apache Jena Fuseki server
# To build image run: docker build -t node-fuseki .
# To remove current instance run: docker rm node_fuseki_instance -f
# To Run container run: docker run -p 3030:3030 -p 3033:3033 --name node_fuseki_instance -t node-fuseki

FROM openjdk:latest
MAINTAINER Vladimir Djurdjevic <vladimirdjurdjevic93@gmail.com>

# Install latest NodeJS

RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash
RUN apt-get install nodejs

RUN node --version
RUN npm --version

# Install Fuseki

ENV FUSEKI_HOME /root/fuseki

ENV FUSEKI_VERSION 2.5.0
ENV FUSEKI_MIRROR http://www.eu.apache.org/dist/
ENV FUSEKI_ARCHIVE http://archive.apache.org/dist/


RUN     wget -O fuseki.tar.gz $FUSEKI_MIRROR/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz || \
        wget -O fuseki.tar.gz $FUSEKI_ARCHIVE/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz && \
        tar zxf fuseki.tar.gz && \
        mv apache-jena-fuseki* $FUSEKI_HOME && \
        rm fuseki.tar.gz* 

# Install supervisor and nginx
RUN apt-get update && apt-get install -y supervisor && apt-get install -y nano wget dialog net-tools && apt-get install -y nginx

# Config ngingx
RUN rm -v /etc/nginx/nginx.conf
ADD docker/nginx.conf /etc/nginx/
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Copy test datasets
COPY test/datasets /usr/share/nginx/html/test/datasets

# Copy supervisor config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
	
# Expose ports for server instances
EXPOSE 3030 3033
ENTRYPOINT ["/usr/bin/supervisord"]
