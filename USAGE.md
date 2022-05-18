Aidbox CLI that provide useful command for interact with your box instance

Version: 0.3.0

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-v`: More output per occurrence

* `-q`: Less output per occurrence

* `-c / --config`: Config dir path

## Subcommands

### doc

Arguments:

* `--help`: Print help information

### completion

Arguments:

* `--help`: Print help information

* `--generate=<bash,elvish,fish,powershell,zsh>`: Generate

### types

Work with types generation

Arguments:

* `--help`: Print help information

#### Subcommands

##### generate

Generate types from zen schema

Arguments:

* `--help`: Print help information

* `-b / --box`: Aidbox URL

* `-u / --user`: Aidbox basic auth user

* `-s / --secret`: Aidbox basic auth secret

* `--cache-folder`: Cache folder path

* `--cache`: Use cache

* `-i / --include-profiles`: Include profiles

* `-o / --output`: Output file

* `--fhir`: FHIR related type

##### cache

Work with cache items

Arguments:

* `--help`: Print help information

###### Subcommands

###### rm

Remove cache items

Arguments:

* `--help`: Print help information

* `-f / --folder`: Cache folder

* `--all`: Remove all cache items

* `-k / --key=<confirms,primitives,schema,valuesets,symbols>`: Remove specific key item

### devbox

Work with devbox installation

Arguments:

* `--help`: Print help information

#### Subcommands

##### check-latest-version

Check latest devbox version on dockerhub

Arguments:

* `--help`: Print help information

* `-t=<edge,latest,stable>`: Devbox image tag

##### update

Pull latest images from DockerHub

Arguments:

* `--help`: Print help information

* `-t=<edge,latest,stable>`: Devbox image tag

### box

Box instance

Arguments:

* `--help`: Print help information

#### Subcommands

##### configure

Initialize box config

Arguments:

* `--help`: Print help information

##### unset

Pull latest images from DockerHub

Arguments:

* `--help`: Print help information

* `-t`: Devbox image tag