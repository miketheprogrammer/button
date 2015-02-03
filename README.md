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
npm start
```

Testing the application
======
```bash
npm test
```

Hey its also on heroku
======
View some data here
https://mtp-button.herokuapp.com/user/michael.hernandez1988@gmail.com/transfers

try to crash it if you dare.


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


As far as Node Version. I used v 0.10.x more specifically 0.10.28 because it is the stable branch, and many native addons have not caught up to unstable branch yet. (like LevelDB).



Explanation of LevelDB and how I use it
===============

Everything is focused around the most efficient way to read the data. We can add more keys later in order to make it more flexible.

First of lets examine the users.
For a user with email michael.hernandez1988@gmail.com

we make a key
```bash

users!michael.hernandez1988@gmail.com

```

what is the '!'.
well it is the earliest human readble ascii unicode character, so this means we can query all users by saying
give me the range from users! ===> users~
where ~ is the last human readble ascii unicode character

I would not use this in production, I would another value, however this is perfect for a DEMO application.

Now lets examine how we do transfers
For any transfer that is posted, we generate a UUID Version 4
lets take a contrived example 
uuid = 'Akdnb2031923'

the key would be
```bash

users!michael.hernandez1988@gmail.com!transfers!Akdnb2031923

```

What does this mean in the broader scheme. We get insanely fast reads of a full user set of transactions.
this is how it would look in key order in the database

```bash

users!alex@gmail.com
users!alex@gmail.com!transactions!abcd1234
users!alex@gmail.com!transactions!bbcd1234
users!mhernandez@gmail.com
users!mhernandez@gmail.com!transactions!cbcd1234
users!mhernandez@gmail.com!transactions!dbcd1234

```






