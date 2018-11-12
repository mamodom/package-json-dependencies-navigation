const Octokit = require('@octokit/rest');
const fs = require('fs');

const { name, version } = require('../package.json');

const run = async () => {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  const commit = process.env.TRAVIS_COMMIT;

  if (!token) {
    throw new Error('Missing GITHUB_PERSONAL_ACCESS_TOKEN');
  }

  const auth = {
    type: 'token',
    token: token,
  };

  const repoInfo = {
    owner: 'mamodom',
    repo: name,
  };

  const octokit = new Octokit();

  octokit.authenticate(auth);

  const existingRelease = await octokit.repos
    .getReleaseByTag({
      ...repoInfo,
      tag: version,
    })
    .catch(() => null);

  if (existingRelease !== null) {
    throw new Error(
      `Release ${version} already exists: ${existingRelease.data.html_url}`
    );
  }

  const result = await octokit.repos.createRelease({
    ...repoInfo,
    tag_name: version,
    target_commitish: commit,
  });

  const artifactName = `${name}-${version}.vsix`;

  const file = await new Promise((resolve, reject) => {
    fs.readFile(`./${artifactName}`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  await octokit.repos.uploadAsset({
    url: result.data.upload_url,
    name: artifactName,
    file: file,
    headers: {
      'Content-Length': file.byteLength,
      'Content-Type': 'application/vsix',
    },
  });
};

run()
  .then(console.log)
  .catch(reason => {
    console.error(reason);
    process.exitCode = 1;
  });
