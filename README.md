# wordpress-env

_"wordpress-env" is an environment for quickly, cleanly, and easily deploying a WordPress website with installed plugins and their corresponding data, all without the need for SQL dumps. Instead, it uses simple XML, CSV (in future will be add JSON and YAML) files for data management._


### The required software
  1. **docker** - install from [docker.com](https://www.docker.com/) to prepare your system


### How to setup and run

  1. Clone this repository using the command `git clone git@github.com:ivovchak/wordpress-env.git`
  2. Navigate to the cloned repository using the command `cd wordpress-env`
  3. Create a **.env** file by running `cp .env.development .env`
  4. Create alias `alias dc="docker-compose"`
  5. Run `dc up`
  6. Wait for WordPress, plugins, and themes to be downloaded, unpacked, installed, and activated
  7. Open [localhost:8000](http://localhost:8000/)
