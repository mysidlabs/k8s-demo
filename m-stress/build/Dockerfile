FROM debian:sid

RUN apt-get update && \
    apt-get install -y lighttpd procps stress-ng wget && \
    rm -rf /var/lib/appt/lists/* && \
    wget https://github.com/sharkdp/bat/releases/download/v0.16.0/bat_0.16.0_amd64.deb && \
    dpkg -i bat_0.16.0_amd64.deb && \
    rm bat_0.16.0_amd64.deb 

RUN rm /etc/init.d/lighttpd && \
    lighttpd-enable-mod cgi && \
    mkdir -p /tmp/log/lighttpd

COPY stress.sh /usr/lib/cgi-bin
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf

ENTRYPOINT ["/usr/sbin/lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
