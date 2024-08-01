const fs = require('fs');

var configN;
var tmplN;
var libN;

const walk = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + path.sep + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));

        } else {
            var fname = path.basename(file);
            var dirname = path.dirname(file);
            var n = dirname + '?' + fname
            n = n.replaceAll(path.sep, '.')
            n = n.replace('..', '')

            results.push(n);
        }
    });
    return results;
}

function loadN() {
    configN = walk('./config')
    tmplN = walk('./tmpl')
    libN = walk('./libs')

}

module.exports = {
    configN,
    tmplN,
    libN,
    loadN

}

