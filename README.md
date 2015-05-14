# Compound Counter

A Node.js module to use a single 32-bit positive integer as a record of integers. Loosely inspired by C structures.

## Installation

```
npm install node-compound-counter --save
```

## Basic Usage

```javascript

// module deps
var
    CompoundCounter = require('node-compound-counter');

var
    counter = CompoundCounter.forge();

// field definition
counter
    .field('lo', 255)
    .field('hi', 31);

counter.lo.set(128);
counter.hi.set(16);

console.log(counter.get()); // 4224
```

## Advanced Usage

```javascript

// module deps
var
    CompoundCounter = require('node-compound-counter');

var
    counter = CompoundCounter.forge();

// field definition
counter
    .field('single', 255);

counter.single
    .on('error', function (error) {
        // your code here
    })
    .on('change', function (value) {
        // your code here
    });

counter
    .on('error', function (error) {
        // your code here
    })
    .on('change', function (value) {
        // your code here
    });
```
