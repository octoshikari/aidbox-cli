## Aidbox CLI tool [UNOFFICIAL]

[![CI](https://github.com/octoshikari/aidbox-cli/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/octoshikari/aidbox-cli/actions/workflows/ci.yaml)




Our **MTTA** (Mean time to acknowledge) is around `one day`; 
<!---->
and our **TTR** (Time To Resolve) can vary from a `few days to a couple of weeks` depending on the number of issues.


## Install

Available via npm

`yarn global add @octoshikari/aidbox-cli`

or

`npm install -g @octoshikari/aidbox-cli`

or

Install from a github release:

`curl -LSfs https://octoshikari.github.io/aidbox-cli/install.sh | sh -s -- --git octoshikari/aidbox-cli`

or

Download a release directly from github: [github.com/octoshikari/aidbox-cli/releases](https://github.com/octoshikari/aidbox-cli/releases)


## Autocompletion

### ZSH

```shell
aidbox-cli completion --shell=zsh > /usr/local/share/zsh/site-functions/_aidbox-cli
compinit
```

### FISH

```shell
aidbox-cli completion --shell=fish > aidbox-cli.fish
. ./aidbox-cli.fish
```

### BASH

```shell
aidbox-cli completion --shell=bash > aidbox-cli.completion
source ./aidbox-cli.completion
```

### POWERSHELL

```shell
aidbox-cli.exe completion --shell=powershell > aidbox-cli.ps1
```

Add result file content into your profile `notepad $profile`

## License

`aidbox-cli` is licensed under either of

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Any kinds of contributions are welcome as a pull request.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in these tool by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
