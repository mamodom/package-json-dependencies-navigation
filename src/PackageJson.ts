export default interface PackageJson {
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
}
