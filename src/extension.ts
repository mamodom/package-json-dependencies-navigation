'use strict';

import {
  Position,
  DocumentLinkProvider,
  TextDocument,
  ProviderResult,
  DocumentLink,
  Range,
  Uri,
  ExtensionContext,
  languages,
} from 'vscode';

class NpmDependenciesLinkProvider implements DocumentLinkProvider {
  provideDocumentLinks(document: TextDocument): ProviderResult<DocumentLink[]> {
    const documentText = document.getText();

    const { dependencies = {}, devDependencies = {} } = JSON.parse(
      documentText
    );

    const packages = { ...dependencies, ...devDependencies };

    return Object.keys(packages)
      .map(k => {
        const version: string = packages[k];

        if (version.indexOf('/') !== -1) {
          return null;
        }
        const keyIndex = documentText.indexOf(`"${k}"`);

        const position = document.positionAt(keyIndex + 1);

        return new DocumentLink(
          new Range(
            position,
            new Position(position.line, position.character + k.length)
          ),
          Uri.parse(`https://www.npmjs.com/package/${k}`)
        );
      })
      .filter((link): link is DocumentLink => !!link);
  }
}

export function activate(context: ExtensionContext) {
  const disposable = languages.registerDocumentLinkProvider(
    { language: 'json', scheme: 'file', pattern: '**/package.json' },
    new NpmDependenciesLinkProvider()
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
