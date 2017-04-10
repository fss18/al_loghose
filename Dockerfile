# al-loghose
#
# VERSION 0.1.0

FROM mhart/alpine-node:4
MAINTAINER Welly Siauw <fss18@yahoo.com>

WORKDIR /src
ADD . .

RUN npm install --production
ENTRYPOINT ["/src/al-loghose.js"]

CMD []
