const Base = require('inquirer/lib/prompts/base');
const chalk = require('chalk');
const observe = require('inquirer/lib/utils/events');

class SuggestPrompt extends Base {
  constructor(questions, rl, answers) {
    super(questions, rl, answers);

    if (!this.opt.suggestions) {
      this.throwParamError('suggestions');
    }

    this.suggestionIndex = 0;

    this.firstRender = true;
  }

  /**
   * Starts the Inquiry session.
   *
   * @param {Function} cb Prompt done callback.
   *
   * @returns {SuggestPrompt} This.
   */
  _run(cb) {
    this.done = cb;

    const events = observe(this.rl);

    // User presses tab key.
    events.keypress
      .filter(({ key }) => key.name === 'tab')
      .share()
      .takeUntil(events.line)
      .forEach(this.onTabKey.bind(this));

    // User confirms (enter key).
    const submit = events.line.map(this.filterInput.bind(this));

    const validation = this.handleSubmitEvents(submit);
    validation.success.forEach(this.onEnd.bind(this));
    validation.error.forEach(this.onError.bind(this));

    // User presses any other key.
    events.keypress
      .takeUntil(validation.success)
      .forEach(this.onKeypress.bind(this));

    // Initialize.
    this.render();

    return this;
  }

  /**
   * Render the prompt to screen.
   */
  render(error) {
    let message = this.getQuestion();

    if (this.firstRender) {
      message += chalk.dim('(Use tab for suggestions) ');
    }

    const { transformer } = this.opt;

    if (this.status === 'answered') {
      message += chalk.cyan(this.answer);
    } else if (transformer) {
      message += transformer(this.rl.line, this.answers);
    } else {
      message += this.rl.line;
    }

    let bottomContent = '';
    if (error) {
      bottomContent = `${chalk.red('>> ')} ${error}`;
    }

    this.firstRender = false;

    this.screen.render(message, bottomContent);
  }

  /**
   * When user presses `enter` key.
   */

  filterInput(input) {
    if (!input) {
      return this.opt.default == null ? '' : this.opt.default;
    }
    return input;
  }

  onEnd(state) {
    this.answer = state.value;
    this.status = 'answered';

    // Re-render prompt.
    this.render();

    this.screen.done();
    this.done(state.value);
  }

  onError(state) {
    this.render(state.isValid);
  }

  /**
   * When user presses `tab` key.
   */

  onTabKey() {
    this.suggestionIndex =
      this.suggestionIndex < this.opt.suggestions.length - 1
        ? this.suggestionIndex + 1
        : 0;
    this.makeSuggestion();
    this.render();
  }

  /**
   * When user presses any other key.
   */

  onKeypress() {
    this.render();
  }

  /**
   * Suggestions.
   */

  makeSuggestion() {
    this.rl.clearLine();
    this.rl.write(this.opt.suggestions[this.suggestionIndex]);
  }
}

module.exports = SuggestPrompt;
