# Instruction
Frontend for [Proxy Frigate](https://github.com/NlightN22/frigate-proxy)
 - create file: `docker-compose.yml`
```yml
version: '3.1'

services:
  front:
    image: oncharterliz/multi-frigate:latest
    environment:
      REACT_APP_HOST: localhost
      REACT_APP_PORT: 5173
      REACT_APP_FRIGATE_PROXY: http://localhost:4000
      REACT_APP_OPENID_SERVER: https://server:port/realms/your-realm
      REACT_APP_CLIENT_ID: frontend-client
    ports:
      - 5173:80 # set your port here
```
- run: 
```bash
docker compose up -d
```
