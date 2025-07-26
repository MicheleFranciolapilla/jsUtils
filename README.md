# 🧰 @mf-coolcode/jsutils

A modular collection of general-purpose JavaScript utilities written in TypeScript, designed to be precise, robust, and easy to integrate into any project.

---

## 📦 Repository & Branch Strategy

This library is available **exclusively on GitHub** and follows a clean structure with 3 main branches:

| Branch    | Description |
|-----------|-------------|
| `dev`     | Development branch. **Unstable**, not recommended for production. |
| `source`  | Contains **TypeScript source**, **JavaScript tests**, and **build/test scripts**. Tagged with `vX.Y.Z-src`. Recommended for **cloning**. |
| `release` | Includes only `package.json` and the compiled `dist/` folder (with **CJS**, **ESM**, and **type declarations**). Tagged with `vX.Y.Z`. Recommended for **installation**. |

- 🧬 Clone the `source` branch to access TypeScript code and tests
- 📥 Install from the `release` branch for production use

---

## 🧬 Cloning

```bash
git clone -b <tag> https://github.com/MicheleFranciolapilla/jsUtils.git
```

✅ Make sure to replace <tag> with the actual tag name, for example:
`v1.0.0-src` → `git clone -b v1.0.0-src https://...jsUtils.git`

---

## 📥 Installation

Install only from the `release` branch:

- ##### Using NPM:
```bash
npm install git+https://github.com/MicheleFranciolapilla/jsUtils.git#release
```

- ##### Using PNPM:
```bash
pnpm add git+https://github.com/MicheleFranciolapilla/jsUtils.git#release
```

- ##### Using YARN:
```bash
yarn add https://github.com/MicheleFranciolapilla/jsUtils.git#release
```

✅ Make sure to use a proper tag, e.g.:
`#v1.0.0` → `git+https://...jsUtils.git#v1.0.0`
<br>
> 🔍 Looking for what changed? Check the [Changelog](https://github.com/MicheleFranciolapilla/jsUtils/blob/dev/CHANGELOG.md).

---

## 📂 Build Contents
Each build (from either `source` or `release`) generates:

✅ `dist/index.cjs` – CommonJS

✅ `dist/index.mjs` – ES Module

✅ `dist/index.d.ts` – TypeScript definitions

---

## 🧠 Available Functions

- **isNotNull(value): boolean**<br>
  Checks if the provided *value* is not `null`.
  ```js
    isNotNull(null); // false
    isNotNull(0);    // true
  ```

- **isDefined(value, checkForNull = false): boolean**<br>
  Checks if a *value* is not `undefined`, and optionally also not `null`.
  ```js
    isDefined(undefined);        // false
    isDefined(null);             // true
    isDefined(null, true);       // false
    isDefined("hello", true);    // true
  ```

- **isAValidNumber(value, options?): boolean**<br>
  Validates that a *value* is a finite number, with optional constraints: `allowZero`, `allowNegatives`, `allowDecimals`.
  ```js
    isAValidNumber(5);                              // true
    isAValidNumber(-2, { allowNegatives: false });  // false
    isAValidNumber(0, { allowZero: true });         // true
    isAValidNumber(3.14, { allowDecimals: false }); // false
  ```

- **isAValidArray(arrayToCheck, options?): boolean**<br>
  Checks if the input is a valid array, optionally not empty.
  ```js
    isAValidArray([]);                         // true
    isAValidArray([], { allowEmpty: false });  // false
  ```

- **isAValidObjectKey(key, strict = false): boolean**<br>
  Checks if a value is a valid object *key*.
    If `strict: true`, it must start with a letter or underscore and contain only letters, digits, underscores, or hyphens.
  ```js
    isAValidObjectKey('myKey');           // true
    isAValidObjectKey('  ');              // false
    isAValidObjectKey('1invalid', true);  // false
    isAValidObjectKey('_validKey', true); // true
  ```

- **isAValidObject(obj, options?): boolean**<br>
  Validates an object by checking:

    - It is not an array or `null`
    - It has a minimum number of properties
    - It contains required properties
  ```js
    isAValidObject({ a: 1, b: 2 }, { minProperties: 2, requiredProperties: ['a'] });    // true
    isAValidObject({}, { minProperties: 1 });                                           // false
  ```

- **cloneObject(objToClone, isStringified = false): object | null**<br>
  Performs a deep clone of an object using `JSON.stringify` / `parse`.
  ```js
    const original = { a: 1, b: { c: 2 } };
    const cloned = cloneObject(original); // cloned.b !== original.b
  ```

- **deepFreeze(objToFreeze): unknown**<br>
  Recursively freezes an object or array, making it fully immutable.
  ```js
    const frozen = deepFreeze({ a: { b: [1, 2, 3] } });
    frozen.a.b.push(4); // Error in strict mode
  ```

---

## 📚 Available Types
Importable from `./types/validationOptions` (`source` branch only):

- **NumberValidationOptions**
```ts
{
  allowZero?: boolean;
  allowNegatives?: boolean;
  allowDecimals?: boolean;
}
```

- **ArrayValidationOptions**
```ts
{
  allowEmpty?: boolean;
}
```

- **ObjectValidationOptions**
```ts
{
  requiredProperties?: string[];
  minProperties?: number;
}
```

---

## 📌 Full Example

- ##### ESM syntax

```js
// Importing utilities using ESM syntax
import {
  isAValidObject,
  deepFreeze,
  cloneObject
} from '@mf-coolcode/jsutils';

const user = { id: 123, name: 'Aki' };

// Check if 'user' is a valid object
if (isAValidObject(user, { requiredProperties: ['id', 'name'] })) {
  // Make 'user' immutable
  const frozen = deepFreeze(user);

  // Clone the frozen user
  const clone = cloneObject(frozen);

  console.log(clone);
}
```

- ##### CJS syntax

```js
// Import utils using CommonJS syntax
const {
  isDefined,
  isAValidObjectKey,
  deepFreeze,
  cloneObject
} = require('@mf-coolcode/jsutils');

const config = {
  theme: 'dark',
  debug: true
};

// Check if 'debug' is a valid key
if (isAValidObjectKey('debug') && isDefined(config.debug)) {
  // Make the config immutable
  const frozen = deepFreeze(config);

  // Clone the frozen config
  const clone = cloneObject(frozen);

  console.log('Cloned config:', clone);
}
```

---

## 🧪 Scripts & Testing (source only)
The `source` branch includes:
- Test files: `/__tests__/*.test.js`
- Build and test scripts
```bash
pnpm test     # Run tests
pnpm build    # Build output into /dist (CJS, ESM, .d.ts)
```

---

## 🧑‍💻 Author
Michele Franciolapilla
GitHub: [@MicheleFranciolapilla](https://github.com/MicheleFranciolapilla)

---

## 🛡️ License
Distributed under the MIT License.

---

## 📄 Changelog

See [CHANGELOG.md](https://github.com/MicheleFranciolapilla/jsUtils/blob/dev/CHANGELOG.md) for a complete list of changes across versions.
