'use strict';

import { ExtensionContext, languages } from 'vscode';

import NpmDependenciesLinkProvider from './NpmDependenciesLinkProvider';

export function activate(context: ExtensionContext) {
  const disposable = languages.registerDocumentLinkProvider(
    { language: 'json', scheme: 'file', pattern: '**/package.json' },
    new NpmDependenciesLinkProvider()
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
