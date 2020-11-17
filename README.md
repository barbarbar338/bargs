# 🦄 Bargs
- A simple argument parsing system ✨

# 📥 Installation
Using yarn:
```
$ yarn add bargs
```
Using npm:
```
$ npm install bargs
```

# 🔧 Usage
```js
bargs(OptionDefinitions, argv?);
```
- `OptionDefinitions`: Where options are defined to be used when separating arguments. Structure:
```js
[
    { 
        name: "OptionName", 
        type: String, //OptionType (function)
        aliases?: [ "option", "aliases", "t" ],
        default?: false
    }
]
```
- `argv?`: Arguments to parse. Default is `process.argv.slice(2)`.

# 🛠️ Example
```js
/* es6 */
import { bargs } from "bargs";

/* commonJS */
const { bargs } = require("bargs");

const definitions = [
    { name: "help", type: Boolean, aliases: [ "h", "halp", "yardim", "y" ] },
    { name: "message", type: String, default: true },
    { name: "page", type: Number }
]

const argv = [ "This", "is", "message", "-h", "--page", "2", "--foo", "bar" ];

bargs(definitions, argv);
/*
 * {
 *     _unknown: {
 *         foo: "bar"
 *     },
 *     help: true,
 *     message: "This is message",
 *     page: 2
 * }
 */
```

# 🔗 Contributing / Issues / Ideas
Feel free to use GitHub's features ✨
