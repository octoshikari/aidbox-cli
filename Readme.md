## Types generator

CLI tools for generation typescript types from Aidbox zen schemas

## Requirements

- Accessible Aidbox instance
- Aidbox credentials (client and secret)
- Node JS

## Installation

```
$ git clone git@github.com:octoshikari/aidbox-types-generator.git types-generator
$ cd types-generator
$ npm install
```

## Usage

```
npm run command:help
```

### Output

```
Usage: aidbox-types-generator <command> [options]

Commands:
aidbox-types-generator clear-cache  Clear cache
aidbox-types-generator generate     Generate type

Options:
--help     Show help                                                 [boolean]
--version  Show version number                                       [boolean]
```

```
npm run command:clear-cache
```

```
Clear cache

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -p, --path     Cache folder path                           [string] [required]
```

```
npm run command:generate
```

```
Generate type

Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -b, --box            Aidbox URL                            [string] [required]
  -c, --client         Aidbox client                         [string] [required]
  -s, --secret         Aidbox secret                         [string] [required]
      --cachePath      Cache path                                       [string]
      --cache          Use cache                      [boolean] [default: false]
      --fhirReference  Use fhir reference type                         [boolean]
  -o, --output         Output file with types
                                 [string] [default: "aidbox-generated-types.ts"]
```

## Example

```
npm run command:generate -- --box=http://localhost:8888 --client=root --secret=secret --cache=true
```

### Output

```
  generator:cli Create box client... +0ms
  generator:cli Create cache client... +32ms
  generator:cli Start... +1ms
  generator:reader Start load symbols... +0ms
  generator:reader Start process symbols... +16s


 ████████████████████████████████████████ 100% | ETA: 0s | 819/819


  generator:cache Save intermediate types into file +0ms
  generator:cache Start save cache... +9ms
  generator:cache Save in files +0ms
  generator:cache Save cache finished +21ms
  generator:cli Write type on disk... +3m
  generator:cli Finish... +1s

```