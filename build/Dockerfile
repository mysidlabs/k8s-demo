FROM bash

RUN apk add -U tzdata && \
  cp /usr/share/zoneinfo/America/New_York /etc/localtime && \
  echo "America/New_York" > /etc/timezone && \
  apk del tzdata && \
  apk add socat stress-ng

COPY *.sh /

ENTRYPOINT /run.sh

