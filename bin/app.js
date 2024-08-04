const fs = require('node:fs');
const path = require('path');
const process = require('process')

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

function exec(file, filters, m) {
    var fname = path.basename(file);
    var dirname = path.dirname(file);
    var n = dirname + '?' + fname
    n = n.replaceAll(path.sep, '.')
    n = n.replace('..', '')

    if (filters.includes(n) || filters.includes(path.extname(file))) {
        let dataFile = fs.readFileSync(file, { encoding: 'utf8' })

        m.forEach((v, k) => {
            console.log(`[INFO]  app: k: ${k}, v: ${v}`)
            dataFile = dataFile.replaceAll(k, v)

        })
        file = file.replace('.', '')
        file = '.' + path.sep + file

        console.log(`[INFO]  app: saving replaced file: ${file}`)
        console.log(`[INFO]  app: content replaced file: ${dataFile}`)

        fs.writeFileSync(file, dataFile)
    }
}

const walk = function (dir, filters, m) {
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + path.sep + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            walk(file, filters, m);

        } else {
            exec(file, filters, m)
        
        }
    });
}

class App {
    after;
    suffix;
    scripts = new Map();
    n;
    templates = [];
    regsConfig = new Map()
    regsTmpl = new Map()
    regsScr = new Map()
    params = new Map()
    regs = new Map()

    get after() { return this.after }
    get suffix() { return this.suffix }
    get scripts() { return this.scripts }
    get templates() { return this.templates }
    get params() { return this.params }
    get n() { return n }
    get config() { return this.regsConfig }
    get tmpl() { return this.regsTmpl }
    get src() { return this.regsScr }
    get regs() { return this.regs }

    set after(v) { this.after = v }
    set suffix(v) { this.suffix = v }
    set scripts(v) { this.scripts = v }
    set templates(v) { this.templates = v }
    set params(v) { this.params = v }
    set n(v) { this.n = v }
    set config(v) { this.regsConfig = v }
    set tmpl(v) { this.regsTmpl = v }
    set src(v) { this.regsScr = v }
    set regs(V) { this.regs = v }

    js(v, params) {
        if (!v.startsWith('libs')) {
            return
        }
        let i = v.indexOf('?')

        let p = v.substring(0, i).replaceAll('.', path.sep)
        let f = v.substring(i + 1)

        p = p + path.sep + f
        var param = params

        return eval(fs.readFileSync('.' + path.sep + p).toString())

    }
    call(v) {
        if (!v.startsWith('config') && !v.startsWith('tmpl')) {
            return
        }
        let i = v.indexOf('?')
        console.log(v.substring(0, i))
        let p = v.substring(0, i).replaceAll('.', path.sep)
        let f = v.substring(i + 1)

        p = p + path.sep + f

        return fs.readFileSync('.' + path.sep + p).toString()

    }
    create(t) {
        try {
            if (t.path == null) {
                console.log(`[WARN] app: template.path is empty or null, ${t}`)
                return;

            }
            let i = t.path.indexOf('?')
            let p = t.path.substring(0, i).replaceAll('.', path.sep)
            let f = t.path.substring(i + 1)
            p = p + path.sep + f

            let path2Save = process.cwd() + path.sep + 'build' + path.sep + p

            console.log(`[INFO]  app: parent file exist?: ${fs.existsSync(path.dirname(path2Save))}`)
            if (!fs.existsSync(path.dirname(path2Save))) {
                console.log(`[INFO]  app: creating parent folder`)
                fs.mkdirSync(path.dirname(path2Save), { recursive: true })

            }

            console.log(`[INFO]  app: saving template to: ${path2Save}`)
            fs.writeFileSync(path2Save, t.template)

        } catch (err) {
            console.log(`[ERROR] app: error try creating template: ${t}`)
            console.log(err)

        }

    }
    replace(m, ...params) {
        try {
            const filters = [...params.values()]
            var dir = '.' + path.sep + 'build' + path.sep + 'app'
            var list = fs.readdirSync(dir);

            list.forEach(function (file) {
                file = dir + path.sep + file;
                var stat = fs.statSync(file);

                if (stat && stat.isDirectory()) {
                    walk(file, filters, m);

                } else {
                    exec(file, filters, m)

                }
            });
        } catch (error) {
            throw new Error(`[ERROR] app: error trying replacing map at 'build/app'.\n ${error}`)

        }


    }
    reg(k, v) { }
    addT(template) { this.templates.push(template) }

}

module.exports = {
    Template,
    App

}
