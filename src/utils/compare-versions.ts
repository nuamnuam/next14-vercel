const compareVersions = (v1: string, v2: string) => {
  const parseVersion = (version: string) => version.split('.').map(Number);

  const [major1, minor1, patch1] = parseVersion(v1);
  const [major2, minor2, patch2] = parseVersion(v2);

  if (major1 !== major2) {
    return major1 > major2 ? 1 : -1;
  }

  if (minor1 !== minor2) {
    return minor1 > minor2 ? 1 : -1;
  }

  if (patch1 !== patch2) {
    return patch1 > patch2 ? 1 : -1;
  }

  return 0;
};

export default compareVersions;
