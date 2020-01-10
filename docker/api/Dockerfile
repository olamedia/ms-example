FROM node:13-alpine

ENV NCONF_NAMESPACE=MS_EXAMPLE \
    NODE_ENV=$NODE_ENV

WORKDIR /app

COPY yarn.lock package.json ./

RUN \
  apk --update upgrade \
  && apk add --virtual .build-deps \
    g++ \
    make \
    python \
    linux-headers \
  && yarn --production --frozen-lockfile \
  && apk del .build-deps \
  && rm -rf \
    /tmp/* \
    /root/.node-gyp \
    /root/.npm \
    /etc/apk/cache/* \
    /var/cache/apk/*

COPY ./schemas /app/schemas
COPY ./src /app/src
COPY ./migrations /app/migrations

# RUN  chown -R node /app

USER node

EXPOSE 3000

CMD [ "yarn", "start" ]
