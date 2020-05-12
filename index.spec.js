const lint = require('@commitlint/lint');

const { rules, parserPreset } = require('.');

expect.extend({
  toBeValid(received) {
    return {
      pass: received.valid === true,
      message: () => 'expected commitlint to be valid'
    };
  },
  toBeInvalid(received) {
    return {
      pass: received.valid === false,
      message: () => 'expected commitlint to be invalid'
    };
  },
  toRaise(received, code) {
    return {
      pass: received.level === 2 && received.name === code,
      message: () => `expected ${received} to be a commitlint error`
    };
  },
  toWarn(received, code) {
    return {
      pass: received.level === 1 && received.name === code,
      message: () => `expected ${received} to be a commitlint warning`
    };
  }
});

const warns = (code, message) => {
  return async () => {
    const result = await lint(message, rules, parserPreset);
    expect(result).toBeValid();

    const [warning] = result.warnings;
    expect(warning).toWarn(code);
  };
};

const raises = (code, message) => {
  return async () => {
    const result = await lint(message, rules, parserPreset);
    expect(result).toBeInvalid();

    const [error] = result.errors;
    expect(error).toRaise(code);
  };
};

describe('when providing some valid cases', () => {
  const messages = [
    ':sparkles: Initial commit.',
    ':wrench:(ci) Update CI build file.',
    ':lipstick: Reformat a service.',
    ':zap: Some message.\n\nWith a body'
  ];

  for (const message of messages) {
    it('succeeds to validate', async () => {
      const result = await lint(message, rules, parserPreset);
      expect(result).toBeValid();
    });
  }
});

describe('rules', () => {
  describe('body-leading-blank', () => {
    describe('when body has no leading blank', () => {
      const message = ':sparkles: A new feature.\nbody';
      it('warns the user', warns('body-leading-blank', message));
    });
  });

  describe('body-max-line-length', () => {
    describe('when body exceeds the max line length of 100 characters', () => {
      const message =
        ':sparkles: Some message.\n\nbody with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters';
      it('fails to validate', raises('body-max-line-length', message));
    });
  });

  describe('footer-leading-blank', () => {
    describe('when footer has no leading blank', () => {
      const message =
        ':zap: Some message.\n\nbody\nBREAKING CHANGE: It will be significant';
      it('warns the user', warns('footer-leading-blank', message));
    });
  });

  describe('footer-max-line-length', () => {
    describe('when footer line is a little bit over 100 characters', () => {
      const message =
        ':zap: Some message.\n\nbody\n\nBREAKING CHANGE: footer with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters';
      it('fails to validate', raises('footer-max-line-length', message));
    });
  });

  describe('header-max-length', () => {
    describe('when the header line exceed the max character limit', () => {
      const message =
        ':zap: Some message that is way too long and breaks the line max-length by several characters since the max is 100.';
      it('fails to validate', raises('header-max-length', message));
    });
  });

  describe('subject-case', () => {
    describe('when subject case is invalid', () => {
      const messages = [':zap: some message.'];

      messages.forEach(message => {
        it('fails to validate', raises('subject-case', message));
      });
    });
  });

  describe('subject-empty', () => {
    describe('when the subject is not present', () => {
      const message = ':zap: ';
      it('fails to validate', raises('subject-empty', message));
    });
  });

  describe('subject-full-stop', () => {
    describe('when no full stop is provided.', () => {
      const message = ':wrench: Some message';
      it('fails to validate', raises('subject-full-stop', message));
    });
  });

  describe('type-case', () => {
    describe('when the type is uppercased', () => {
      const message = ':WRENCH: Some message.';
      it('fails to validate', raises('type-case', message));
    });
  });

  describe('type-empty', () => {
    describe('when the type is empty', () => {
      const message = 'Some message.';
      it('fails to validate', raises('type-empty', message));
    });
  });

  describe('type-enum', () => {
    describe('when type is invalid', () => {
      const message = ':wrongtype: Take an arrow in the knee.';
      it('fails to validate', raises('type-enum', message));
    });

    describe('when type exists', () => {
      const message = ':tada: Initial commit.';
      it('succeeds to validate', async () => {
        const result = await lint(message, rules, parserPreset);
        expect(result).toBeValid();
      });
    });
  });

  describe('scope-case', () => {
    describe('when the scope is uppercased', () => {
      const message = ':zap:(SCOPE) Some message.';
      it('fails to validate', raises('scope-case', message));
    });
  });
});
