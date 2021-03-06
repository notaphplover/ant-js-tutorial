#!/usr/bin/env node
'use strict'

const { resolve } = require('path');
const { unlink, readdirSync, statSync } = require('fs');

/**
 * Scans a folder and its subfolders and returns all its files.
 * @param {string} dir Directory to scan
 * @returns { Promise<string[]> } Files found.
 */
async function getFiles(dir) {
  const subdirs = readdirSync(dir);
  const files = await Promise.all(subdirs.map((subdir) => {
    const res = resolve(dir, subdir);
    return statSync(res).isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

const foldersToClear = [
  __dirname + '/../step-2-adding-a-model/ts',
  __dirname + '/../step-3-adding-simple-queries/ts',
  __dirname + '/../step-4-adding-queries/ts',
];
const fileExtensions = [
  '.js',
  '.js.map',
  '.d.ts',
  'd.ts.map',
];

for (const folderToClear of foldersToClear) {
  getFiles(folderToClear).then((files) => {
    files = files.filter(
      (path) => fileExtensions.find(
        (extension) => path.endsWith(extension),
      ),
    );
    for (const fileName of files) {
      unlink(fileName, (err) => {
        if (err) { throw err; }
      });
    }
  }).catch((err) => { console.error(err); });
}
