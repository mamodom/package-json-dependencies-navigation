interface PackageLock {
  dependencies: {
    [key: string]: {
      version: string;
    };
  };
}

export default PackageLock;
