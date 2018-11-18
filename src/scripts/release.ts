import Octokit = require('@octokit/rest');
import fs = require('fs');

const { name, version } = require('../package.json');

const run = async () => {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  const commit = process.env.TRAVIS_COMMIT;

  if (!token) throw new Error('Missing GITHUB_PERSONAL_ACCESS_TOKEN');

  const octokit = new Octokit();

  octokit.authenticate({
    type: 'token',
    token: token,
  });

  const repoInfo = {
    owner: 'mamodom',
    repo: name,
  };

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

  const file = await new Promise<Buffer>((resolve, reject) => {
    fs.readFile(`./${artifactName}`, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  await octokit.repos.uploadReleaseAsset({
    url: result.data.upload_url,
    name: artifactName,
    file: file,
    headers: {
      'content-length': file.byteLength,
      'content-type': 'application/vsix',
    },
  });
};

run()
  .then(console.log)
  .catch(reason => {
    console.error(reason);
    process.exitCode = 1;
  });
