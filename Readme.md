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





## Workflow

### Trunk-based dev

1. Make changes locally
2. Run tests with cargo test
3. Commit and push to master
4. CI tests and builds prereleases for each platform

### Pull-request flow

1. Make changes locally
2. Run tests with cargo test
3. Commit and push to branch or fork
4. Review CI results
5. Make pull request
6. Review CI results and merge

## Release process

1. Update version in toml files
2. Commit to master
3. Tag with v\* version
4. Push tags
5. CI tests and builds releases for each platform
6. CI creates a github release and attaches binaries
