const ARFS = require('../async-real-fs');


async function main() {
    const vfs = new ARFS();
    await vfs.mv('/tmp/VFS/tests/1', '/tmp/VFS/tests/2');
}

main().then(() => console.log('done'));