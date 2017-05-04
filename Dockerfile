# Docker container with java and nodejs environment

FROM openjdk:latest
MAINTAINER Vladimir Djurdjevic <vladimirdjurdjevic93@gmail.com>

# Install latest NodeJS

RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash
RUN apt-get install nodejs

# Install npm packages

ADD package.json /opt/atlassian/pipelines/agent/build/package.json
RUN cd /opt/atlassian/pipelines/agent/build && npm install
RUN rm /opt/atlassian/pipelines/agent/build/package.json