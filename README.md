[![CircleCI](https://circleci.com/gh/obartra/webp-jxr-middleware/tree/master.svg?style=svg)](https://circleci.com/gh/obartra/webp-jxr-middleware/tree/master)
[![API Doc](https://doclets.io/obartra/webp-jxr-middleware/master.svg)](https://doclets.io/obartra/webp-jxr-middleware/master)
[![Coverage Status](https://coveralls.io/repos/github/obartra/webp-jxr-middleware/badge.svg?branch=master)](https://coveralls.io/github/obartra/webp-jxr-middleware?branch=master)
[![Dependencies](https://david-dm.org/obartra/webp-jxr-middleware/status.svg)](https://david-dm.org/obartra/webp-jxr-middleware)
[![DevDependencies](https://david-dm.org/obartra/webp-jxr-middleware/dev-status.svg)](https://david-dm.org/obartra/webp-jxr-middleware?type=dev)
## Installation

```shell
npm install webp-jxr-middleware
```

## Usage

webp-jxr-middleware should be used before any middleware that is serving files (e.g. `express.static`) so that it serves changed format file.

```javascript
import rewriteImg from 'webp-jxr-middleware';
import express from 'express';
import { join } from 'path';

const app = express();
const serverPath = join(__dirname, 'public');

app.use(rewriteImg(serverPath));
app.use(express.static(serverPath));
```

## ES5

An ES5 compatibility build is also included at `lib/es5.js`. To generate it from the source, run `npm run build`.

You can then require it like:

```javascript
var rewriteImg = require('webp-jxr-middleware/lib/es5').default;
```

## Generating Optimized Images (WebP and JXR)

If you want improve your site's performance by serving optimized images but don't know how to get started, check out this [guide](https://github.com/obartra/notes/blob/master/imageOptimization/README.md).

## Overview

Middleware to serve `jxr` and `WebP` images when the browser supports them. Works with [Connect](https://github.com/senchalabs/connect/) and [Express](https://github.com/expressjs/express).

It is  based off [connect-image-optimus](https://github.com/msemenistyi/connect-image-optimus) and [accept-webp](https://github.com/JoshuaWise/accept-webp). It maintains support for `webp` and `jxr` from the `connect-image-optimus` and avoids the UA parsing like `accept-webp`.

## Development Setup

1. Fork the repo
2. Run `npm install`
3. Run `./node_modules/.bin/precommit install`
4. Run `npm run dev` to initiate the development server

## Contributing

1. Commit your changes following [conventional-changelog format](https://github.com/conventional-changelog/conventional-changelog)
2. Push to a new branch (e.g. `git push origin my-awesome-feature`)
3. Create a new Pull Request

## License

MIT
