declare module '@yarnpkg/lockfile';

declare type ParseResultType = 'merge' | 'success' | 'conflict';

declare type ParseResult = {
  type: ParseResultType;
  object: { [key: string]: { version: string } };
};

declare function parse(str: string, fileLoc: string): ParseResult;
