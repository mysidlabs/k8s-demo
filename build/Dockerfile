FROM bash

RUN apk add -U tzdata && \
  cp /usr/share/zoneinfo/America/New_York /etc/localtime && \
  echo "America/New_York" > /etc/timezone && \
  apk del tzdata

COPY run.sh /

ENTRYPOINT /run.sh

