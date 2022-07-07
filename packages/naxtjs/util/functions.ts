export function solidIsInstalled() {
    try {
        require.resolve('solid-js');
        return true
    } catch (e) {
        return false
    }
}

export function protectedRequire(module: string) {
    try {
        return require(module)
    } catch (e) {
        console.error(`Could not load module ${module}`)
        process.exit(1)
    }
}