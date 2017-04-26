FROM openjdk:latest
MAINTAINER Vladimir Djurdjevic <vladimirdjurdjevic93@gmail.com>

#Install latest NodeJS

RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash
RUN apt-get install nodejs

RUN node --version
RUN npm --version

#Install Fuseki

ENV FUSEKI_HOME /home/fuseki
ENV FUSEKI_VERSION 2.5.0
ENV FUSEKI_MIRROR http://www.eu.apache.org/dist/
ENV FUSEKI_ARCHIVE http://archive.apache.org/dist/

VOLUME /fuseki
RUN     wget -O fuseki.tar.gz $FUSEKI_MIRROR/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz || \
        wget -O fuseki.tar.gz $FUSEKI_ARCHIVE/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz && \
        tar zxf fuseki.tar.gz && \
        mv apache-jena-fuseki* $FUSEKI_HOME && \
        rm fuseki.tar.gz* && \
        cd $FUSEKI_HOME && rm -rf fuseki.war

		
#Expose port and set entry point
EXPOSE 3030
ENTRYPOINT ["/home/fuseki/fuseki-server"]

