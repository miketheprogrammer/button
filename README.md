# button
A loyalty rewards transaction system.


Installing
======
```bash
npm install
```

Running the application
======
```bash
NODE_ENV=development node index.js
```

Testing the application
======
```bash
npm test
```


Architecture and Design
========


Restify - Why do I use restify, as opposed to express or others. It is simple, effective, and build specifically with REST in mind.
It includes all middleware bundled, instead of express which now makes you install most of the middleware. While I believe in Unix Philosophy,
Restify is simple, elegant, and a stable collection of useful modules, without causing you to model your code a certain way.

LevelDB - Why did I use this. Well, speed of prototyping is one reason, I wanted a quick embedded key value store.
Also, LevelDB is a Log Structure Merge Tree, which essentially means it is a unicode order database that uses the filesystem.
What does this mean? Read the whole database in 1 disk read. It also uses a compaction scheme which I love which is the idea of Levels.
Also the interface LevelUp supports multiple backends, for instance MemDown which I use for testing.

Config - Config is a very standard way of loading configuration via environments. It supports merging, default and {env}.

Mocha/Chai - I chose this combination primarily because I is what I am most familiar with. Generally I look at it this was
Mocha === backend
Jasmine === frontend
When you want full frameworks.
Tap === backend
Tape === frontend
When you want a simple TAP producing test harness. (Good for small modules)

Chai vs. Expect vs. Should. - Again its mostly preference, but the big difference is portability.
Should uses the Object prototype which is bad if you include it on a frontend page and may not work everywhere.
I find Chai is a good extension of Expect/Should that just gives you everything you need.

xtend - pretty standard way of merging to objects.

