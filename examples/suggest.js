const inquirer = require('inquirer');

inquirer.registerPrompt('suggest', require('../lib'));

const questions = [
  {
    type: 'suggest',
    name: 'kittenName',
    message: 'Enter a name for your kitten:',
    suggestions: ['Oliver', 'Luna', 'Charlie', 'Bella', 'Max', 'Lucy'],
  },
];

inquirer.prompt(questions).then(answers => {
  console.log(JSON.stringify(answers, null, '  '));
});
