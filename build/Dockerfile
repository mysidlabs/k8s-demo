FROM debian:sid

ENV  DEBIAN_FRONTEND=noninteractice
RUN  apt-get update && \
     apt-get install -y lighttpd procps stress-ng tzdata wget && \
     rm -rf /var/lib/apt/lists/* 

RUN  unlink /etc/localtime && \
     ln -s /usr/share/zoneinfo/America/New_York /etc/localtime

RUN  rm /etc/init.d/lighttpd && \
     lighttpd-enable-mod cgi && \
     mkdir -p /tmp/log/lighttpd

COPY run.sh /
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY stress.sh /usr/lib/cgi-bin

ENTRYPOINT ["/run.sh"]
