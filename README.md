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
For https connections you can use reverse proxy
# Example
![Main Page](example/screens/MainPage_1.png)
![Main Page](example/screens/MainPage_2.png)
![Main Page](example/screens/RecordingsPage_1.png)
![Main Page](example/screens/RecordingsPage_2.png)
![Main Page](example/screens/RecordingsPage_3.png)
![Main Page](example/screens/RecordingsPage_4.png)
![Main Page](example/screens/RecordingsPage_5.png)
![Main Page](example/screens/LiveCameraPage.png)
![Main Page](example/screens/SettingsPage.png)
![Main Page](example/screens/VideoPlayerPage.png)
![Main Page](example/screens/FrigateConfigPage.png)
![Main Page](example/screens/FrigateServersPage_1.png)
![Main Page](example/screens/FrigateServersPage_2.png)
![Main Page](example/screens/FrigateStatsPage_1.png)
![Main Page](example/screens/FrigateStatsPage_2.png)
![Main Page](example/screens/FrigateStatsPage_3.png)
![Main Page](example/screens/AccessSettingsPage_1.png)