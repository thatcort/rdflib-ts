# DOCKER CONTAINER WITH APACHE JENA FUSEKI 2.5.0 SERVER
FROM openjdk:latest
MAINTAINER Vladimir Djurdjevic <vladimirdjurdjevic93@gmail.com>

# SET FUSEKI VARIABLES BASED ON CURRENT VERSION
ENV FUSEKI_HOME /root/fuseki

ENV FUSEKI_VERSION 2.5.0
ENV FUSEKI_MIRROR http://www.eu.apache.org/dist/
ENV FUSEKI_ARCHIVE http://archive.apache.org/dist/


# INSTALL FUSEKI
RUN     wget -O fuseki.tar.gz $FUSEKI_MIRROR/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz || \
        wget -O fuseki.tar.gz $FUSEKI_ARCHIVE/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz && \
        tar zxf fuseki.tar.gz && \
        mv apache-jena-fuseki* $FUSEKI_HOME && \
        rm fuseki.tar.gz* 

# EXPOSE PORT AND SET ENTRY POINT
EXPOSE 3030
ENTRYPOINT ["/bin/bash" ,"/root/fuseki/fuseki-server", "--mem", "/TestDataset"]
