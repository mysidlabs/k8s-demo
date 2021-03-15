FROM debian:sid

RUN apt-get update && \
    apt-get install -y lighttpd procps stress-ng wget && \
    rm -rf /var/lib/appt/lists/* 

RUN rm /etc/init.d/lighttpd && \
    lighttpd-enable-mod cgi && \
    mkdir -p /tmp/log/lighttpd

COPY lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY stress.sh /usr/lib/cgi-bin

ENTRYPOINT ["/usr/sbin/lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
