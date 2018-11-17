# Change Log

## [0.1.5] - 2018-11-17

### Changed

- Using a workaround in travis' configuration since greenkeeper doesn't work with `npm ci` (see: https://github.com/greenkeeperio/greenkeeper-lockfile/issues/156)

## [0.1.4] - 2018-11-12

### Added

- travis-ci badge to README

## [0.1.3] - 2018-11-11

### Added

- Create github releases using travis-ci
- Publish to [Visual Studio Marketplace](https://marketplace.visualstudio.com/) using travis-ci
- Publish `.vsix` to the created github release using travis-ci

## [0.1.2] - 2018-11-08

### Fixed

- Including the version number when looking for the position of the package name

  If the package name appears before the package declaration the link will be added in the incorrect position

  ![](https://user-images.githubusercontent.com/5097424/48236991-1d8cc180-e39b-11e8-8019-c55944c4d6a3.png)

## [0.1.1] - 2018-11-08

### Fixed

- Adding [`@yarnpkg/lockfile`](https://www.npmjs.com/package/@yarnpkg/lockfile) as a dependency and not a devDependency

## [0.1.0] - 2018-11-06

### Added

- Adds support for linking to a package's specific version (e.g. https://www.npmjs.com/package/vscode/v/1.1.20) from package-lock.json or yarn.lock

## [0.0.1] - 2018-11-01

- Adds links to npm dependencies to their npm package page

[0.0.1]: https://github.com/mamodom/package-json-dependencies-navigation/compare/0.0.0...0.0.1
[0.1.0]: https://github.com/mamodom/package-json-dependencies-navigation/compare/0.0.1...0.1.0
[0.1.1]: https://github.com/mamodom/package-json-dependencies-navigation/compare/0.1.0...0.1.1
[0.1.2]: https://github.com/mamodom/package-json-dependencies-navigation/compare/0.1.1...0.1.2
[0.1.3]: https://github.com/mamodom/package-json-dependencies-navigation/compare/0.1.2...0.1.3
