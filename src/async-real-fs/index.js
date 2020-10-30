const fs = require('fs');
const util = require('util');
const path = require('path');

const mkdir = require('mkdirp');
const ls = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const rm = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const write = util.promisify(fs.writeFile);
const read = util.promisify(fs.readFile);
const mv = util.promisify(fs.rename);

class AsyncRealFs {
    /**
     * Builds the specified path.
     * Recursively builds all the missing folders when needed between the first path element and the last.
     * @param sPath {string} path to be created
     * @return {Promise}
     */
    mkdir(sPath) {
        return mkdir(sPath);
    }

    /**
     * Deletes the specified folder
     * @param sFolder {string}
     * @return {Promise}
     */
    rmdir(sFolder) {
        rmdir(sFolder);
    }

    /**
     * Lists all entries inside a folder
     * @param sPath {string}
     * @return {Promise}
     */
    async ls(sPath) {
        const list = await ls(sPath, {
            withFileTypes: true
        });
        return list.map(f => ({
            name: f.name,
            dir: f.isDirectory()
        }));
    }

    /**
     * Give stat structure for the given file
     * @param sFile {string}
     * @return {Promise}
     */
    async stat(sFile) {
        const st = await stat(sFile);
        const pp = path.parse(sFile);
        return {
            name: pp.base,
            dir: st.isDirectory(),
            size: st.size,
            dates: {
                created: Math.floor(st.birthtimeMs / 1000),
                modified: Math.floor(st.mtimeMs / 1000),
                accessed: Math.floor(st.atimeMs / 1000)
            }
        };
    }

    /**
     * Deletes a file
     * @param sFile {string}
     * @return {Promise}
     */
    rm(sFile) {
        return rm(sFile);
    }

    mv(sOld, sNew) {
        return mv(sOld, sNew);
    }

    read(sFile, bBinary = false) {
        return read(sFile, {
            encoding: bBinary ? 'ascii' : 'utf8'
        });
    }

    write(sFile, data) {
        return write(sFile, data, {
            encoding: typeof data === 'string' ? 'utf-8' : 'ascii'
        });
    }
}

module.exports = AsyncRealFs;
