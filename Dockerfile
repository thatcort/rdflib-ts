# Docker container with java and nodejs environment

FROM openjdk:latest
MAINTAINER Vladimir Djurdjevic <vladimirdjurdjevic93@gmail.com>

# Install latest NodeJS

RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get install nodejs
RUN apt-get install net-tools

ENTRYPOINT export DOCKERHOST=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)

