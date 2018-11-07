import {
  DocumentLinkProvider,
  TextDocument,
  DocumentLink,
  Range,
  Position,
  Uri,
  workspace,
  RelativePattern,
} from 'vscode';

import PackageJson from './PackageJson';

import { parse } from '@yarnpkg/lockfile';
import * as fs from 'fs';
import PackageLock from './PackageLock';

class NpmDependenciesLinkProvider implements DocumentLinkProvider {
  async provideDocumentLinks(document: TextDocument): Promise<DocumentLink[]> {
    const documentText = document.getText();

    const packageJson: PackageJson = JSON.parse(documentText);

    const { dependencies = {}, devDependencies = {} } = packageJson;

    const versions = await this.getLockedVersions();

    return Object.entries({ ...dependencies, ...devDependencies })
      .map(([k, version]) => {
        if (version.indexOf('/') !== -1) return null;

        const keyIndex = documentText.indexOf(`"${k}"`);

        const position = document.positionAt(keyIndex + 1);

        return new DocumentLink(
          new Range(
            position,
            new Position(position.line, position.character + k.length)
          ),
          Uri.parse(this.buildURI(k, versions[k]))
        );
      })
      .filter((link): link is DocumentLink => !!link);
  }

  buildURI(packageKey: string, version: string): string {
    if (version)
      return `https://www.npmjs.com/package/${packageKey}/v/${version}`;
    return `https://www.npmjs.com/package/${packageKey}`;
  }

  async getLockedVersions(): Promise<{ [k: string]: string }> {
    const folders = workspace.workspaceFolders || [];

    const pattern = new RelativePattern(
      folders[0],
      '{package-lock.json,yarn.lock}'
    );

    const files = await workspace.findFiles(pattern);

    if (!files[0]) return {};

    if (files[0].path.endsWith('package-lock.json')) {
      const { dependencies = {} }: PackageLock = require(files[0].path);
      return Object.assign(
        {},
        ...Object.entries(dependencies).map(([k, { version }]) => ({
          [k]: version,
        }))
      );
    }

    if (files[0].path.endsWith('yarn.lock')) {
      const yarnLock: ParseResult = parse(
        fs.readFileSync(files[0].path, 'utf8')
      );

      return Object.assign(
        {},
        ...Object.entries(yarnLock.object).map(([key, { version }]) => {
          const k = /^(.*)\@[^\@]*$/.exec(key) || [];
          return {
            [k[1]]: version,
          };
        })
      );
    }

    return {};
  }
}

export default NpmDependenciesLinkProvider;
