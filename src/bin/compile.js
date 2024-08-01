#!/usr/bin/env node
const fs = require('node:fs');
const path = require('path');
const { Template, App } = require('./app.js')

function copyApp2Build() {
    var moveFrom = "./app";
    var moveTo = "./build"

    fs.cpSync(moveFrom, moveTo, { recursive: true });

}

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);

}

function getDirectories(srcpath) {
    const app = new App()

    var project = fs.readFileSync('.' + path.sep + 'project.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        return data

    });

    project = JSON.parse(project)
    app.n = (project.namespace)

    var mainJs = fs.readFileSync('.' + path.sep + 'main.js', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        return data

    });

    eval(mainJs)

    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(p => {
            var stat = fs.statSync(p);
            if (stat && stat.isDirectory()) {
                if (!fs.existsSync('.' + path.sep + 'build' + path.sep + p)) {
                    fs.mkdirSync('.' + path.sep + 'build' + path.sep + p)
                }

            } else {
                var content = fs.readFileSync('.' + path.sep + p, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    return data

                });
                let templateDefinition = eval(content)

                app.addT(templateDefinition)
                app.create()
                app.replace()

            }
            return fs.statSync(p).isDirectory()

        });
}

function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

function init() {
    copyApp2Build()
    getDirectoriesRecursive('./src')

}

module.exports.compile = init