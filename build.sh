
# Cleanup any previous builds
rm -rf lib

# Make a lib directory where to put the files to publish
mkdir -p lib

# Generate ES6 build
# Since the ES6 code is already on a single file we can just copy it over
cp src/index.js lib/index.js

# Generate ES5 build
./node_modules/.bin/babel src/index.js --out-file lib/es5.js
