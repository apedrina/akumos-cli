#!/usr/bin/env node
const fs = require('node:fs');
const yargs = require('yargs')
const { compile } = require('./compile.js');
const process = require('process')
const path = require('path')

yargs.command({
  command: 'cp',
  describe: 'Akumos Project Compile command',
  builder: {
    n: {
      describe: 'Namespace name',
      demandOption: false,
      type: 'string'

    }

  },
  handler(argv) {
    try {
      console.log(`[INFO]  index: cleaning build folder!`)
      fs.rmSync(process.cwd() + path.sep + 'build', { recursive: true, force: true });

      console.log(`[INFO]  index: creating a new build folder!`)
      fs.mkdirSync(process.cwd() + path.sep + 'build');

      console.log(`[INFO]  index: reading 'project.json'!`)
      let project = fs.readFileSync(process.cwd() + path.sep + 'project.json')
      project = JSON.parse(project)
      project.namespace = process.cwd()
      fs.writeFileSync(process.cwd() + path.sep + 'project.json', JSON.stringify(project))

      compile()

      console.log(`[INFO]  index: compile command fineshed!`)

    } catch (error) {
      throw new Error(`[ERROR] index: error trying compile: \n ${error}`)

    }

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
        fs.mkdirSync(process.cwd() + path.sep + '/libs/akumos')
        fs.writeFileSync(process.cwd() + path.sep + '/libs/akumos/template.js', `
              class Template {
                map = new Map();
                path;
                template;
                name;

                get map() { return this.map }
                get path() { return this.path }
                get template() { return this.template }
                get name() { return this.name }

                set map(v) { this.map = v }
                set path(v) { this.path = v }
                set template(v) { this.template = v }
                set name(v) { this.name = v }

                bind() {
                    this.map.forEach((v, k, m) => {
                        console.log(this.template)
                        this.template = this.template.replaceAll(k, v);

                    });
                }
                addConfig(v) {
                    this.map = new Map(Object.entries(v.props.json), this.map);
                }

            }
          `)

      }
      if (!fs.existsSync('project.json')) {
        fs.writeFileSync(process.cwd() + path.sep + '/project.json', `{"namespace":"${process.cwd()}"}`)

      }
      if (!fs.existsSync('main.js')) {
        fs.writeFileSync(process.cwd() + path.sep + '/main.js', `(function(app){\n  console.log('running akumos project...')  \n})(app)`)

      }
    } catch (err) {
      console.log(`[ERROR] index: error trying init an Akumos project: ${err}`);

    }

  }

})

yargs.parse()