# aidbox

Aidbox CLI

Version: 0.3.0

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-c/--config=<>`: Config dir path

## Subcommands

### doc

Arguments:

* `--help`: Print help information

* `--version`: Print version information

### types

Work with types generation

Arguments:

* `--help`: Print help information

* `--version`: Print version information

#### Subcommands

##### generate

Generate types from zen schema

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-b/--box=<URL>`: Aidbox URL

* `-u/--user=<USERNAME>`: Aidbox basic auth user

* `-s/--secret=<SECRET>`: Aidbox basic auth secret

* `--cache-folder=<>`: Cache folder path

* `--cache`: Use cache

* `-i/--include-profiles`: Include profiles

* `-o/--output=<>`: Output file

* `--fhir`: FHIR related type

##### cache

Work with cache items

Arguments:

* `--help`: Print help information

* `--version`: Print version information

###### Subcommands

###### rm

Remove cache items

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-f/--folder=<>`: Cache folder

* `--all`: Remove all cache items

* `-k/--key=<>`: Remove specific key item

### devbox

Work with devbox installation

Arguments:

* `--help`: Print help information

* `--version`: Print version information

#### Subcommands

##### check-latest-version

Check latest devbox version on dockerhub

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-t=<TARGET>`: Devbox image tag

##### update

Pull latest images from DockerHub

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-t=<TARGET>`: Devbox image tag

### box

Box instance

Arguments:

* `--help`: Print help information

* `--version`: Print version information

#### Subcommands

##### configure

Initialize box config

Arguments:

* `--help`: Print help information

* `--version`: Print version information

##### unset

Pull latest images from DockerHub

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-t=<TARGET>`: Devbox image tag