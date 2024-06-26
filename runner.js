const fs = require("fs");
const path = require("path");
const kleur = require("kleur");

const forbiddenDirs = ["node_modules"];

class Runner {
  constructor() {
    this.testFiles = [];
  }

  async collectFiles(targetdir) {
    const files = await fs.promises.readdir(targetdir);

    for (let file of files) {
      const filepath = path.join(targetdir, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes(".test.js")) {
        this.testFiles.push({ name: filepath, shortName: file });
      } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map((f) => path.join(file, f)));
      }
    }
  }

  runTests() {
    for (let file of this.testFiles) {
      console.log(`---> Running ${file.shortName}`);
      const beforeEaches = [];

      global.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };

      global.it = (desc, fn) => {
        beforeEaches.forEach((func) => func());
        try {
          fn();
          console.log(kleur.green(`\t✔ OK - ${desc}`));
        } catch (err) {
          console.log(kleur.red(`\t✖ Fail - ${desc}`));
          console.log(kleur.red("\t", err.message));
        }
      };

      try {
        require(file.name);
      } catch (err) {
        console.log(kleur.red(err));
      }
    }
  }
}

module.exports = Runner;
