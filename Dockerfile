# Docker container with java and nodejs environment

FROM openjdk:latest
MAINTAINER Vladimir Djurdjevic <vladimirdjurdjevic93@gmail.com>

# Install latest NodeJS

RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get install nodejs

# Install npm packages

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/atlassian/pipelines/agent/build && cp -a /tmp/node_modules /opt/atlassian/pipelines/agent/build/
