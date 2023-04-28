## Aidbox tool [UNOFFICIAL]

[![tauri](https://github.com/octoshikari/aidbox-tool/actions/workflows/build.yaml/badge.svg)](https://github.com/octoshikari/aidbox-tool/actions/workflows/build.yaml)


Docs available here https://octoshikari.github.io/aidbox-tool/


Our **MTTA** (Mean time to acknowledge) is around `one day`; 
<!---->
and our **TTR** (Time To Resolve) can vary from a `few days to a couple of weeks` depending on the number of issues.


## Install

Download a release directly from github: [github.com/octoshikari/aidbox-tool/releases](https://github.com/octoshikari/aidbox-tool/releases)


## Autocompletion

### ZSH

```shell
aidbox-tool completion --shell=zsh > /usr/local/share/zsh/site-functions/_aidbox-tool
compinit
```

### FISH

```shell
aidbox-tool completion --shell=fish > aidbox-tool.fish
. ./aidbox-tool.fish
```

### BASH

```shell
aidbox-tool completion --shell=bash > aidbox-tool.completion
source ./aidbox-tool.completion
```

### POWERSHELL

```shell
aidbox-tool.exe completion --shell=powershell > aidbox-tool.ps1
```

Add result file content into your profile `notepad $profile`

## License

`aidbox-tool` is licensed under either of

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Any kinds of contributions are welcome as a pull request.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in these tool by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
