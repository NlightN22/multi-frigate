# Instruction

 - download
 - go to download directory
 - run `yarn` to install packages
 - create file: `docker-compose.yml`
```yml
version: '3.0'

services:
  front:
    image: nginx:alpine
    volumes:
      - ./build/:/usr/share/nginx/html/
      - ./nginx/:/etc/nginx/conf.d/
    ports:
      - 8080:80 # set your port here
```
- create file: `.env.production.local`
```bash
REACT_APP_HOST=localhost
REACT_APP_PORT=4000
REACT_APP_OPENID_SERVER=https://server:port/realms/your-realm
REACT_APP_CLIENT_ID=your-client
```
- run: 
```bash
yarn build
docker compose up -d
```
