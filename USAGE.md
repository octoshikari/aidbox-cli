Aidbox CLI that provide useful command for interact with your box instance

Version: 0.3.0

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-v`: More output per occurrence

* `-q`: Less output per occurrence

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

### generator

Generate some useful things

Arguments:

* `--help`: Print help information

* `--config`: Config dir path

* `--instance`: Save box config under specific key. If key already exists then value will be overwritten

#### Subcommands

##### types

Work with types generation

Arguments:

* `--help`: Print help information

###### Subcommands

###### generate

Generate types from zen schema

Arguments:

* `--help`: Print help information

* `--include-profiles`: Include profiles

* `--output`: Output file

* `--fhir`: FHIR related type

##### sample

Create sample resource

Arguments:

* `--help`: Print help information

##### warm-up

Preload and parse resource definition from box. Please use this command before other commands

Arguments:

* `--help`: Print help information

* `--include-profiles`: Include profiles

##### cache

Cache commands

Arguments:

* `--help`: Print help information

###### Subcommands

###### stats

Show cache statistic

Arguments:

* `--help`: Print help information

###### rm

Remove specific or all cache item

Arguments:

* `--help`: Print help information

* `--all`: Remove all cache items

* `--key=<confirms,primitives,schema,valuesets,symbols,intermediate_types>`: Remove specific cache item

### docker-image

Aidbox docker image information

Arguments:

* `--help`: Print help information

* `--tag=<edge,latest,stable>`: Image tag

* `--image=<devbox,aidboxone,multibox>`: Image name

#### Subcommands

##### remote

Compare image version on dockerhub with local

Arguments:

* `--help`: Print help information

##### pull

Pull image from DockerHub

Arguments:

* `--help`: Print help information

### box

Interact with box instance

Arguments:

* `--help`: Print help information

* `--config`: Config dir path

* `--instance`: Save box config under specific key. If key already exists then value will be overwritten

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