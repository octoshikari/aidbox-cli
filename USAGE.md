Aidbox CLI tool

Version: 0.3.7

Arguments:

* `--help`: Print help information

* `--version`: Print version information

* `-v`: More output per occurrence

* `-q`: Less output per occurrence

## Subcommands

### doc

Generate USAGE.md file

Arguments:

* `--help`: Print help information

### completion

Generate completion for provided shell

Arguments:

* `--help`: Print help information

* `--shell=<bash,elvish,fish,powershell,zsh>`: Shell type

### generator

Generator with helpers

Arguments:

* `--help`: Print help information

* `--config`: Config dir path

* `--instance`: Box key for save/use to/from config. Example(dev, stage,local,prod, etc.)

#### Subcommands

##### types

Types generating

Arguments:

* `--help`: Print help information

* `--include-profiles`: Include profiles

* `--output`: Output file

* `--target=<typescript>`: Target programming language

* `--fhir`: FHIR related type

##### sample

Generate sample resources based on loaded schemas

Arguments:

* `--help`: Print help information

* `--config`: Config dir path

* `--instance`: Box key for save/use to/from config. Example(dev, stage,local,prod, etc.)

* ``Resource name for generation

* `--include-profiles`: Include profiles

* `--type=<full,only-required>`: Generate partial or full resource

##### cache

Cache

Arguments:

* `--help`: Print help information

###### Subcommands

###### stats

Show cache statistic

Arguments:

* `--help`: Print help information

* `--all`: Show all instance stats

###### rm

Remove specific/all cache item(s)

Arguments:

* `--help`: Print help information

* `--all`: All items

* `--key=<confirms,primitives,schema,valuesets,symbols,intermediate_types>`: Specific item

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

* `--instance`: Box key for save/use to/from config. Example(dev, stage,local,prod, etc.)

#### Subcommands

##### configure

Initialize box config

Arguments:

* `--help`: Print help information

##### rm

Remove box instance config

Arguments:

* `--help`: Print help information

##### open

Open Aidbox UI

Arguments:

* `--help`: Print help information

##### list

Show all available instances

Arguments:

* `--help`: Print help information

* `--check`: Check if the configuration of each instance is correct

##### info

Show box info based on $version endpoint

Arguments:

* `--help`: Print help information

##### current-user

Show current user info based on provided credentials

Arguments:

* `--help`: Print help information

##### execute-sql

Send content of sql file to $psql endpoint and show result

Arguments:

* `--help`: Print help information

* ``Path to target .sql file