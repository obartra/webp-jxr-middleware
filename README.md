[![CircleCI](https://circleci.com/gh/obartra/webp-jxr-middleware/tree/master.svg?style=svg)](https://circleci.com/gh/obartra/webp-jxr-middleware/tree/master)
[![API Doc](https://doclets.io/obartra/webp-jxr-middleware/master.svg)](https://doclets.io/obartra/webp-jxr-middleware/master)
[![Dependencies](https://david-dm.org/obartra/webp-jxr-middleware/status.svg)](https://david-dm.org/obartra/webp-jxr-middleware)
[![DevDependencies](https://david-dm.org/obartra/webp-jxr-middleware/dev-status.svg)](https://david-dm.org/obartra/webp-jxr-middleware?type=dev)
## Installation

```shell
npm install webp-jxr-middleware
```

## Usage

webp-jxr-middleware should be used before any middleware that is serving files (e.g. `express.static`) so that it serves changed format file.

```javascript
import * as rewriteImg from 'webp-jxr-middleware';
import * as express from 'express';
import { join } from 'path';

const app = express();
const serverPath = join(__dirname, 'public');

app.use(rewriteImg(serverPath));
app.use(express.static(serverPath));
```

## Overview

Middleware to serve JXR and WEBP images when the browser supports them. Works with [Connect](https://github.com/senchalabs/connect/) and [Express](https://github.com/expressjs/express).

It is  based off [connect-image-optimus](https://github.com/msemenistyi/connect-image-optimus) and [accept-webp](https://github.com/JoshuaWise/accept-webp). It maintains support for webp and jxr from the `connect-image-optimus` and avoids the UA parsing like `accept-webp`.

## Development Setup

1. Fork the repo
2. Run `npm install`
3. Run `./node_modules/.bin/precommit install`

## Contributing

1. Commit your changes following [conventional-changelog format](https://github.com/conventional-changelog/conventional-changelog)
2. Push to a new branch (e.g. `git push origin my-awesome-feature`)
3. Create a new Pull Request

## License

MIT
