# Jason Baker

Jason Baker is a tool for merging JSON files. Inspired by the [json-bake](https://github.com/MathiasPaumgarten/grunt-json-bake) plugin for grunt, but designed to be a standalone, flexible JSON merging tool.

## Features

- Handle the asynchronous process of merging JSON files, either using callbacks or using promises  
- Specify source JSON as an array of JSON objects, an array of files, a glob string, or an array of globs  
- Use the directory / filename structure of your JSON files to generate namesapces in your final JSON output
- Internal source code written entirely in baking puns

## Installation

```bash
  npm install --save jason-baker
```

## Usage

```javascript
  jasonBaker(src, options, callback);
  jasonBaker.promise(src, options).then(func).catch(func);

```

Arguments:

- ```src```: the source JSON to be merged
- ```options```: an optional options object of options
- ```callback```: (ignored when using jasonBaker.promise) - function to be executed when the baking is complete. Should use the usual (err, success) pattern.

Using callbacks:

```javascript

  var jasonBaker = require('jason-baker');

  jasonBaker('**/*.json', {}, function(poop, cake) {
    /* do something with your basked JSON */
  });
```

Using promises:

```javascript

  var jasonBaker = require('jason-baker');

  jasonBaker.promise('**/*.json')
    .then(function(cake) { /* party! */})
    .catch(function(poop) { /* flop :-( */ });

  });
```

## Options

The options object currently understands the following settings:

- ``fsToNs``: only used for globs; when set to true, any directories and filenames matched by your glob will be converted into JSON namespaces

## Examples

See the [test suite](./blob/master/test/spec.js) for a number of examples, but generally the following scenarios are supported.

Plain JSON objects:

```javascript
  let src = [
    { foo: 'bar' },
    { bake: 'cake' }
  ];

  jasonBaker(src, {}, function(err, cake) {
    /*
    {
      foo: 'bar',
      bake: 'cake'
    }
    */  
  })

```

JSON files:

```javascript
  let src = [
    'locales/en.json', /* { "greeting": "Hello" } */
    'locales/fr.json'  /* { "greeting": "Bonjour" } */
  ];

  jasonBaker(src, {}, function(err, cake) {
    /*
    {
      greeting: "Bonjour"
    }
    */
  });

  BUT!
  
  let src = [
    'locales/*.json'
  ];

  jasonBaker(src, {}, function(err, cake) {
    /*
    {
      en: {
        greeting: "Hello"
      },
      fr: {
        greeting: "Bonjour"
      }
    }
    */

  });

```

