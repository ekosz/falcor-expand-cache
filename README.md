# Falcor-Expand-Cache

falcor-expand-cache is a utility for generating "plain JS like" objects that
represent the internal cache of a falcor model. These objects are lazy,
immutable, and only represent the cache from when it was created.

### Installation

To install:

```
npm install --save falcor-expand-cache
```

### Usage

```js
import expandCache from 'falcor-expand-cache';

const cache = expandedCache(falcor.getCache());

console.log(cache.users[0].company.name) // => Pied Piper
```

### Why?

This was built to help connect falcor to other applications / libraries that
require state to be immediately available rather than through a callback or
promise. Currently is it used in
[redux-falcor](https://github.com/ekosz/redux-falcor).

### Licence

MIT
