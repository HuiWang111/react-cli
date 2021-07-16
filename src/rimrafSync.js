import rimraf from 'rimraf';

export function rimrafSync(path) {
    rimraf(path, err => {
        if (err) {
            return Promise.reject(err);
        }

        return Promise.resolve();
    })
}