# Pre-requisities
- Physical or Virtual machine of Linux distribution.
- Install [Docker](https://github.com/docker).
- Install [docker-compose](https://docs.docker.com/get-started/).



# Docker Compose

![N|Solid](https://github.com/docker/compose/raw/master/logo.png?raw=true)

Compose is a tool for defining and running multi-container Docker applications.
With Compose, you use a Compose file to configure your application's services.
Then, using a single command, you create and start all the services
from your configuration. To learn more about all the features of Compose
see [the list of features](https://github.com/docker/docker.github.io/blob/master/compose/overview.md#features).

Compose is great for development, testing, and staging environments, as well as
CI workflows. You can learn more about each case in
[Common Use Cases](https://github.com/docker/docker.github.io/blob/master/compose/overview.md#common-use-cases).

Using Compose is basically a three-step process.

1. Define your app's environment with a `Dockerfile` so it can be
reproduced anywhere.
2. Define the services that make up your app in `docker-compose.yml` so
they can be run together in an isolated environment.
3. Lastly, run `docker-compose up` and Compose will start and run your entire app.

For more information about the Compose file, see the
[Compose file reference](https://github.com/docker/docker.github.io/blob/master/compose/compose-file/compose-versioning.md).

Compose has commands for managing the whole lifecycle of your application:

 * Start, stop and rebuild services
 * View the status of running services
 * Stream the log output of running services
 * Run a one-off command on a service

Installation and documentation
------------------------------

- Full documentation is available on [Docker's website](https://docs.docker.com/compose/).
- Code repository for Compose is on [GitHub](https://github.com/docker/compose).

# Zoom Web App Installation

Pre-requisities 
------------------------------

The requirements are mandatory to install & use the Zoom Web App:

1. A subscription at the Zoom pro plan is mandatory (https://zoom.us/pricing)
2. Create an API key and secret pair from https://marketplace.zoom.us/develop/create
3. Zoom Web App operates strictly over HTTPS, as a result a valid certificate is required. An easy way to obtain certificates are with [Let's Encrypt](https://letsencrypt.org/) service.

To install Zoom Web App follow the next steps:
1. Create a folder named zoom-web-app.
2. Copy the Zoom Web App [docker-compose.yml](https://github.com/SCiO-systems/zoom-web-app/blob/master/docker-compose.yml) to the zoom-web-app folder.
3. Copy the  [.env](https://github.com/SCiO-systems/zoom-web-app/blob/master/.env) to the zoom-web-app folder.
4. Copy the  [cert.crt](https://github.com/SCiO-systems/zoom-web-app/blob/master/cert.crt) to the zoom-web-app folder.
5. Copy the  [key.key](https://github.com/SCiO-systems/zoom-web-app/blob/master/key.key) to the zoom-web-app folder.
4. Execute the following command

```sh
$zoomUiSecurePort={zoom  ui port number} $zoomServerSecurePort={zoom server port number} docker-compose {docker-compose.yml path} up &&  docker  exec  zoom-web sh start.sh 
```

The Zoom Web App is served over https. So it is mandatory to replace the cert.crt and the key.key files that we downloaded previous with real ones.
Another requirement is to put the API key and secret pair that we have created earlier inside the .env file.

# [.env](https://github.com/SCiO-systems/zoom-web-app/blob/master/.env)
    API_KEY = <key>
    API_SECRET = <secret>
    POSTGRES_USER = <postgres user>
    POSTGRES_HOST = <postgres host>
    POSTGRES_DATABASE = <postgres database>
    POSTGRES_PASSWORD = <postgres password>
    POSTGRES_PORT = <postgres port>
    MAIL_SERVER_HOST = <mail server host>
    MAIL_SERVER_PORT = <mail server port>
    MAIL_USER = <mail user>
    MAIL_PASS = <mail password>
    ZOOM_WEB_APP = <location of zoom web app>
    ZOOM_HOST_EMAIL = <zoom host email>


 {zoom  ui port number}: The Port of the VM or physical machine that will host the Zoom Web App.
 {zoom server port number}: The Port of the VM or physical machine that will host the Zoom Web App

The source code of Zoom Web App is in [Github](https://github.com/SCiO-systems/zoom-web-app).

# [docker-compose.yml](https://github.com/SCiO-systems/zoom-web-app/blob/master/docker-compose.yml)

    version: '2.2'
    services:
      zoom:
        container_name: zoom-web
        image: scioquiver/zoomwebapp:latest
        ports:
          - ${zoomUiSecurePort}:443
          - ${zoomServerSecurePort}:4000
        volumes:
          - ./cert.crt:/zoom-web-app/localhost.crt
          - ./key.key:/zoom-web-app/localhost.key
          - ./cert.crt:/node-js-https-server-zoom/cert.pem
          - ./key.key:/node-js-https-server-zoom/key.pem
          - ./.env:/node-js-https-server-zoom/.env
    



List of Docker Images
------------------------------
| Component | Location |
| ------ | ------ |
| Zoom Web App | [ scioquiver/zoomwebapp:latest](https://hub.docker.com/repository/docker/scioquiver/zoomwebapp) |

