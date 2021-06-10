const fs = require('fs');

function updateProjectPackageJson(project) {
    const filename = process.cwd() + '/' + project + '/package.json';

    if (fs.existsSync(filename)) {
        const content = fs.readFileSync(filename).toString();
        const data = JSON.parse(content);
        const newData = {
            ...data,
            name: project
        };
        fs.writeFileSync(filename, JSON.stringify(newData, null, '\t'));
    }
}

module.exports = {
    updateProjectPackageJson
}