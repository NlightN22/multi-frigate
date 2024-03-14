# syntax=docker/dockerfile:1
# Build commands:
# - $VERSION=1.1
# - rm build -r -Force ; rm ./node_modules/.cache/babel-loader -r -Force ; yarn build
# - docker build --pull --rm -t oncharterliz/multi-frigate:latest -t oncharterliz/multi-frigate:$VERSION "."
# - docker image push --all-tags oncharterliz/multi-frigate

FROM nginx:alpine AS multi-frigate
WORKDIR /app
COPY ./build/ /usr/share/nginx/html/
# Nginx config
RUN rm -rf /etc/nginx/conf.d/*
COPY ./nginx/default.conf /etc/nginx/conf.d/

# Default port exposure
EXPOSE 80

# Copy enviornment script and vars
COPY  env.sh .env.docker ./
# Add bash
RUN apk add --no-cache bash
# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/app/env.sh && nginx -g \"daemon off;\""]