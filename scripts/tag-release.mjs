import {execSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {URL} from 'node:url';
import {promisify} from 'node:util';

import program from 'commander';

let exec = promisify(execSync);

async function main(tag) {
  let publishSummary = JSON.parse(
    await readFile(
      new URL('../lerna-publish-summary.json', import.meta.url).pathname,
      'utf8',
    ),
  );

  await Promise.all(
    publishSummary.map(({packageName, version}) => {
      exec(`npm dist-tag add ${packageName}@${version} ${tag}`, {
        encoding: 'utf8',
      });
    }),
  );
}

let { tag } = program
  // TODO Use requiredOption once commander is upgraded in the root
  .option('--tag <tag>', 'The npm tag to add to every package published in the latest release')
  .parse(process.argv);


if (!tag) {
  throw new Error('Required option `tag` not specified');
}

main(tag);
