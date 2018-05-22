# inquirer-prompt-suggest

[Inquirer.js](https://github.com/SBoudrias/Inquirer.js) prompt for your less
creative users.

![Preview](https://user-images.githubusercontent.com/5600126/40391192-d4f3d6d0-5ded-11e8-932f-4b75b642c09e.gif)

## Installation

```sh
npm install --save inquirer-prompt-suggest
```

## Usage

1.  Register the prompt:

```js
inquirer.registerPrompt('suggest', require('inquirer-prompt-suggest'));
```

2.  Use it:

```js
inquirer.prompt({
  type: 'suggest',
  name: 'kittenName',
  message: 'Enter a name for your kitten:',
  suggestions: ['Oliver', 'Luna', 'Charlie', 'Bella', 'Max', 'Lucy'],
});
```

## Options

Takes all [input properties](https://github.com/SBoudrias/Inquirer.js#input---type-input), plus:

* `suggestions` _(string[])_: A list of suggestions.

## License

MIT
