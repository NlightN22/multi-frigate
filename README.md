# Instruction
Frontend for [Proxy Frigate](https://github.com/NlightN22/frigate-proxy)
 - create file: `docker-compose.yml`
```yml
version: '3.1'

services:
  front:
    image: oncharterliz/multi-frigate:latest
    environment:
      FRIGATE_PROXY: http://localhost:4000
      OPENID_SERVER: https://server:port/realms/your-realm
      CLIENT_ID: frontend-client
    ports:
      - 80:80 # set your port here
```
- run: 
```bash
docker compose up -d
```
