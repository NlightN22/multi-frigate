# syntax=docker/dockerfile:1
# Build commands:
# - rm dist -r -Force ; yarn build
# - $VERSION=0.1
# - docker build --pull --rm -t oncharterliz/frigate-proxy:latest -t oncharterliz/frigate-proxy:$VERSION "."
# - docker image push --all-tags oncharterliz/frigate-proxy

FROM node:18-alpine AS frigate-proxy
ENV NODE_ENV=production
WORKDIR /app

COPY  package.json yarn.lock ./

RUN yarn install --production

COPY ./dist ./dist

CMD yarn prod
EXPOSE 4000