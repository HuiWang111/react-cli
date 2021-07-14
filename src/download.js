import download from 'download-git-repo';

export function downloadRepo(repo, path) {
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