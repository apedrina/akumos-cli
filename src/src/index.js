#!/usr/bin/env node
const fs = require('node:fs');
const yargs = require('yargs')
const { compile } = require('./compile.js');
const { Template } = require('./app.js')

yargs.command({
  command: 'compile',
  describe: 'Akumos Project Compile command',
  builder: {
    n: {
      describe: 'Namespace name',
      demandOption: false,
      type: 'string'

    }

  },
  handler(argv) {
    compile()

  }
}).command({
  command: 'init',
  describe: 'Init a new Akumos Project',
  handler(argv) {
    try {
      if (!fs.existsSync('src')) {
        fs.mkdirSync('src');
      }
      if (!fs.existsSync('config')) {
        fs.mkdirSync('config');
      }
      if (!fs.existsSync('tmpl')) {
        fs.mkdirSync('tmpl');
      }
      if (!fs.existsSync('app')) {
        fs.mkdirSync('app');
      }
      if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
      }
      if (!fs.existsSync('libs')) {
        fs.mkdirSync('libs');
        fs.mkdirSync('./libs/akumos')
        fs.writeFileSync('./libs/akumos/template.js', ``)

      }
      if (!fs.existsSync('project.json')) {
        fs.writeFileSync('./project.json', `{"namespace":"${__dirname}"}`)

      }
      if (!fs.existsSync('main.js')) {
        fs.writeFileSync('./main.js', `(function(app){\n  console.name('running namespace: ${__dirname}')  \n})(app)`)

      }
    } catch (err) {
      console.error(err);

    }

  }

})

yargs.parse()