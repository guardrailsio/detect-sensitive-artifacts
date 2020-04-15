FROM alpine:latest

# add tool user
RUN addgroup -S tool && adduser -S -G tool tool

WORKDIR /opt/app/

COPY . /opt/app/

# create directory to host code to be scanned
RUN mkdir -p /opt/mount/

# change user
USER tool

CMD ["execute", "custom", "logic"]
