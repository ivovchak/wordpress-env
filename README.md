# wordpress-env

_"wordpress-env" is an environment for quickly, cleanly, and easily deploying a WordPress website with installed plugins and their corresponding data, all without the need for SQL dumps. Instead, it uses simple XML, CSV (in future will be add JSON and YAML) files for data management._


### The required software
  1. **docker** - install from [docker.com](https://www.docker.com/) to prepare your system


### How to setup and run

  1. `git clone git@github.com:ivovchak/wordpress-env.git` - _clone this repository using the command_
  2. `cd wordpress-env` - _navigate to the cloned repository using the command_
  3. `cp .env.development .env` - _create a **.env** file by running_
  4. `alias dc="docker compose"` - _create alias_
  5. `dc up` - _run_
  6. Wait for WordPress, plugins, and themes to be downloaded, unpacked, installed, and activated
  7. `open http://localhost:8000` - _Open [localhost:8000](http://localhost:8000/)_
