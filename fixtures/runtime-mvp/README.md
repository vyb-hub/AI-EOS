# Runtime MVP Fixture

This controlled local project exercises the AI-EOS Runtime without using Nexus or another live product repository.

## Greeting component

The dependency-free ES module `greeting.js` publicly exports `greet(name)`. It
returns `Hello, <name>.` for a non-empty string and throws a `TypeError` for an
empty string or non-string input. Supplied whitespace is preserved.

Run the focused automated tests with:

```sh
node --test greeting.test.js
```
