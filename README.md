<h1 align="center">commitlint-config</h1>
<br>
<p align="center">
  <img src="https://commitlint.js.org/assets/icon.svg" width="150" alt=""/>
</p>

<p align="center">
  The shareable commitlint config we use at <a href="https://logical.work">Logical</a>.
</p>

<p align="center">
  <a href="https://logical.work">
    <img src="https://flat.badgen.net/badge/%F0%9F%96%96/Logical/purple" alt="Logical"/>
  </a>
  <img src="https://flat.badgen.net/npm/v/@logicalhq/commitlint-config" alt="Version"/>
  <a href="https://circleci.com/gh/logicalhq/commitlint-config">
    <img src="https://flat.badgen.net/github/status/logicalhq/commitlint-config/main/ci/circleci" alt="CircleCI Status"/>
  </a>
</p>

<hr>

## Table of Contents

- [Convention](#convention)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Extending the rules](#extending-the-rules)
- [License](#license)

## Convention

- A commit type is always **lowercased** and must be provided at all-time.
- We use [Gitmojis](https://github.com/carloscuesta/gitmoji) as commit types.
- The scope is optional but must be **lowercased** if used.
- Like a sentence: a commit subject must be **capitalized** and ends with a **period**.
- The message body and footer should start with a leading blank line.
- A line can't exceed 100 characters.

## Getting Started

Install the development dependency:

```bash
yarn add -D @logicalhq/commitlint-config
```

And simply add a `.commitlintrc.js` file at the project root:

```js
module.exports = {
  extends: ['@logicalhq/commitlint-config']
};
```

## Examples

```bash
git commit -m ":tada: Initial commit." # passes
git commit -m ":sparkles:(ci) Set-up GitHub actions." # passes
git commit -m "Initial commit." # fails: no commit type.
git commit -m ":tada: Initial commit" # fails: no full-stop.
git commit -m ":unkown: Initial commit." # fails: that gitmoji doesn't exists.
```

## Extending the rules

This convention can be extended to fit a project needs (i.e: specifying scopes):

```js
// .commitlintrc.js
module.exports = {
  extends: ['@logicalhq/commitlint-config'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'ci',
        'security',
        'auth',
        'billing'
        // ...
      ]
    ]
  }
};
```

## License

This project and Carlos Cuesta's Gitmojis are licensed under [MIT](https://spdx.org/licenses/MIT.html).
