const download = require('download-git-repo');

function downloadRepo(repo, path) {
    return new Promise((resolve, reject) => {
        download(repo, path, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    downloadRepo
};