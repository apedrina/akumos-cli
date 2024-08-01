const fs = require('node:fs');
const path = require('path');

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

class App {
    scripts = new Map();
    n;
    templates = [];
    regsConfig = new Map()
    regsTmpl = new Map()
    regsScr = new Map()
    params = new Map()
    regs = new Map()

    get scripts() { return this.scripts }
    get templates() { return this.templates }
    get params() { return this.params }
    get n() { return n }
    get config() { return this.regsConfig }
    get tmpl() { return this.regsTmpl }
    get src() { return this.regsScr }
    get regs() { return this.regs }

    set scripts(v) { this.scripts = v }
    set templates(v) { this.templates = v }
    set params(v) { this.params = v }
    set n(v) { this.n = v }
    set config(v) { this.regsConfig = v }
    set tmpl(v) { this.regsTmpl = v }
    set src(v) { this.regsScr = v }
    set regs(V) { this.regs = v }

    js(v, params){
        if (!v.startsWith('libs')){
            return
        }
        let i = v.indexOf('?')
        console.log(v.substring(0, i))
        let p = v.substring(0, i).replaceAll('.', path.sep)
        let f = v.substring(i + 1)

        p = p + path.sep + f
        var param = params

        return eval(fs.readFileSync('.' + path.sep + p).toString())

    }
    call(v) {
        if (!v.startsWith('config') && !v.startsWith('tmpl')){
            return
        }
        let i = v.indexOf('?')
        console.log(v.substring(0, i))
        let p = v.substring(0, i).replaceAll('.', path.sep)
        let f = v.substring(i + 1)

        p = p + path.sep + f

        return fs.readFileSync('.' + path.sep + p).toString()

    }
    create() {
        this.templates.forEach(t => {
            console.log(t)
            console.log(t.path)

            let i = t.path.indexOf('?')
            let p = t.path.substring(0, i).replaceAll('.', path.sep)
            let f = t.path.substring(i + 1)
            p = p + path.sep + f

            let path2Save = '.' + path.sep + 'build' + path.sep + p 

            console.log(path2Save)

            fs.writeFileSync(path2Save, t.template)


        })

    }
    replace(m, ...params) {
        const filters = [...params.values()]
        var results = [];
        var dir = './app'
        var list = fs.readdirSync(dir);

        list.forEach(function (file) {
            file = dir + path.sep + file;
            var stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                if (filters.includes(file)) {
                    console.log('target namespace found!')
                }
                results = results.concat(walk(file));

            } else {
                var fname = path.basename(file);
                var dirname = path.dirname(file);
                var n = dirname + '?' + fname
                n = n.replaceAll(path.sep, '.')
                n = n.replace('..', '')

                if (filters.includes(n) || filters.includes(path.extname(file))) {
                    let dataFile = fs.readFileSync(file, { encoding: 'utf8' })

                    m.forEach((v, k) => {
                        console.log(v + ' :: ' + k)
                        dataFile = dataFile.replaceAll(k, v)

                    })
                    file = file.replace('.', '')
                    file = '.' + path.sep + 'build' + file

                    fs.writeFileSync(file, dataFile)

                }

                results.push(n);
            }
        });
        //}

    }
    reg(k, v) { }
    addT(template) { this.templates.push(template) }

}


let app = new App()
let t = new Template()
app.js('libs?hello.js', 'apedrina akumeiro')

let map = new Map()
map.set('{{msg}}', 'Hello World!')
app.replace(map, '.java')

t.template = app.call('tmpl?hello.txt')
t.map.set('{{msg}}', 'Hello World!')
t.path = 'app?JavaSnippet.java'
t.bind()

app.addT(t)
app.create()

module.exports = {
    Template,
    App

}
