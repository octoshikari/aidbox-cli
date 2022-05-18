## Aidbox CLI tool [UNOFFICIAL]

[![CI](https://github.com/octoshikari/aidbox-cli/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/octoshikari/aidbox-cli/actions/workflows/ci.yaml)
[![Code Formatting](https://github.com/octoshikari/aidbox-cli/actions/workflows/checks.yaml/badge.svg)](https://github.com/octoshikari/aidbox-cli/actions/workflows/checks.yaml)






## Autocompletion
### ZSH
```shell
aidbox completion --generate=zsh > /usr/local/share/zsh/site-functions/_value_hints
compinit
```

### FISH
```shell
aidbox completion --generate=fish > aidbox.fish
. ./aidbox.fish
```

### BASH
```shell
aidbox completion --generate=bash > aidbox.completion
source ./aidbox.completion
```

### POWERSHELL
```shell
aidbox completion --generate=powershell > aidbox.ps1
```
Add result file content into your profile ```notepad $profile```





## License

`aidbox-cli` is licensed under either of

* Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
* MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Any kinds of contributions are welcome as a pull request.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in these tool by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
