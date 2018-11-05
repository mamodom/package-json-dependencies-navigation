import {
  DocumentLinkProvider,
  ProviderResult,
  TextDocument,
  DocumentLink,
  Range,
  Position,
  Uri,
} from 'vscode';

import PackageJson from './PackageJson';

class NpmDependenciesLinkProvider implements DocumentLinkProvider {
  provideDocumentLinks(document: TextDocument): ProviderResult<DocumentLink[]> {
    const documentText = document.getText();

    const packageJson: PackageJson = JSON.parse(documentText);

    const { dependencies = {}, devDependencies = {} } = packageJson;

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
          Uri.parse(`https://www.npmjs.com/package/${k}`)
        );
      })
      .filter((link): link is DocumentLink => !!link);
  }
}

export default NpmDependenciesLinkProvider;
