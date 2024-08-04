#!/usr/bin/env node
const fs = require('node:fs');
const path = require('path');
const process = require('process')
const { Template, App } = require('./app.js')

var isSuffix = false;
var isBefore = false;
var isAfter = false;
var after = ''
const app = new App() 

function copyApp2Build() {
    try {
        var moveFrom = process.cwd() + path.sep + "app";
        var moveTo = process.cwd() + path.sep + "build" + path.sep + "app"

        console.log(`[INFO]  compile: moving 'app' folder to 'build' folder.`)
        fs.cpSync(moveFrom, moveTo, { recursive: true });

    } catch (error) {
        throw new Error(`[ERROR] compile: error trying copy 'app/' to 'build/app'\n ${error}`)

    }

}

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);

}

function getDirectories(srcpath) {
    try {
        console.log(`[INFO]  compile: reading project.json: ${'.' + path.sep + 'project.json'}`)
        var project = fs.readFileSync('.' + path.sep + 'project.json', 'utf8')

        project = JSON.parse(project)
        app.n = (project.namespace)

        console.log(`[INFO]  compile: reading main.js: ${'.' + path.sep + 'main.js'}\n`)
        try {
            var mainJs = fs.readFileSync('.' + path.sep + 'main.js', 'utf8')

            eval(mainJs)

            console.log(`[INFO]  compile: 'main.js' evaluation finished!\n`)

            if (app.suffix != null) {
                this.isSuffix = true;

            }
            if (app.after != null) {
                this.isAfter = true

            }

        } catch (error) {
            console.log(`[ERROR] compile: error trying run 'main.js'\n`)
            throw error

        }

        return fs.readdirSync(srcpath)
            .map(file => path.join(srcpath, file))
            .filter(p => {
                var stat = fs.statSync(p);
                if (stat && !stat.isDirectory()) {
                    if (this.isSuffix) {
                        if (!path.basename(p).startsWith(app.suffix)) {
                            console.log(`[WARNING] compile: skipping ${p}, suffix: ${app.suffix}`)
                            return fs.statSync(p).isDirectory()

                        }
                    }
                    if (this.isAfter) {
                        let pathFile = p.replace(process.cwd(), '')
                        let v = app.after
                        let i = v.indexOf('?')

                        let p2 = v.substring(0, i).replaceAll('.', path.sep)
                        let f = v.substring(i + 1)

                        p2 = p2 + path.sep + f
                        if (pathFile === p2) {
                            this.after = fs.readFileSync('.' + path.sep + p, 'utf8')
                            
                            console.log(`[WARNING] compile: skipping ${p}, after: ${app.after}`)

                            this.isAfter = false
                            return fs.statSync(p).isDirectory()
                        }

                    }
                    console.log(`[INFO]  compile: parsing .js file: ${'.' + path.sep + p}`)
                    var content = fs.readFileSync('.' + path.sep + p, 'utf8')
                    try {
                        console.log(`[INFO]  compile: evaluating!\n`)
                        eval(content)
                        console.log(`[INFO]  compile: script js evaluation finished!\n`)

                    } catch (error) {
                        console.log(`[ERROR] compile: error running: ${'.' + path.sep + p}`)
                        console.log(error)

                    }

                }
                return fs.statSync(p).isDirectory()

            });

    } catch (error) {
        throw new Error(`[ERROR] compile: error on compile!\n ${error}`)

    }
}

function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

function init() {
    copyApp2Build()
    getDirectoriesRecursive('./src')

    if (this.after != '') {
        console.log('[INFO]  compile: running after script!\n')
        
        eval(this.after)
        console.log('\n')

    }

    console.log(`[INFO]  compile: init compile method completed!`)

}

module.exports.compile = init