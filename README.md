## Installation

```shell
npm install webp-jxr-middleware
```

## Usage

**Warning**: image-optimus should be used before a middleware that is serving files so that it serves changed format file.

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

It is  based off [connect-image-optimus](https://github.com/msemenistyi/connect-image-optimus) and [accept-webp](https://github.com/JoshuaWise/accept-webp). It maintains support for webp and jxr.
