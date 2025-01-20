# IP Registry - Story CLI

A minimal CLI to register your intellectual property (IP) on [Story Protocol](https://www.story.foundation/).

## Installation

**Install:** Install the cli:
```bash
npm install -g ip-story-cli
```

Usage
```bash
npx ip-story-cli --help
```

**Initialize Config**
Prompts for private key, Pinata JWT, and RPC URL:

```bash
npx ip-story-cli init
```

***Create SPG Collection***
Deploy a new SPG NFT collection:

```bash
npx ip-story-cli create-collection
```

**Register IP**
Mint an NFT and register your IP in one step:

```bash
npx ip-story-cli register-ip
```

### License
MIT License