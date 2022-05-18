Aidbox CLI that provide useful command for interact with your box instance

Version: 0.3.0

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-v`: More output per occurrence

* `-q`: Less output per occurrence

* `--config`: Config dir path

* `--instance`: Save box config under specific key. If key already exists then value will be overwritten

## Subcommands

### doc

Generate doc based on commands and save into USAGE.md file 

Arguments:

* `--help`: Print help information

### completion

Generate autocompletion for several shells

Arguments:

* `--help`: Print help information

* `--generate=<bash,elvish,fish,powershell,zsh>`: Generate autocompletion for provided shell

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

Interact with box instance

Arguments:

* `--help`: Print help information

#### Subcommands

##### configure

Initialize box config. With --instance arg, data will be stored under specific key

Arguments:

* `--help`: Print help information

##### rm

Remove box instance config. With --instance arg, specific config key will be removed

Arguments:

* `--help`: Print help information

##### info

Show box info based on $version endpoint. With --instance arg, specific config key will be used

Arguments:

* `--help`: Print help information

##### current-user

Show current user info based on provided credentials. With --instance arg, specific config key will be used

Arguments:

* `--help`: Print help information

##### execute-sql

Send content of sql file to $psql endpoint and show result. With --instance arg, specific config key will be removed

Arguments:

* `--help`: Print help information

* ``Path to target .sql file