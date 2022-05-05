## Aidbox CLI tool [UNOFFICIAL]

[![CI](https://github.com/octoshikari/aidbox-cli/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/octoshikari/aidbox-cli/actions/workflows/ci.yaml)

CLI tools for generation typescript types from Aidbox zen schemas

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
