export class Piper {
    private static pipes = new Map<string, Function>();

    /**
     * Adds to a list of pipes in piper.
     * @param pipeName
     * @param func
     */
    static install(pipeName: string, func: Function) {
        pipeName = pipeName.trim();
        if (pipeName.match(/^[a-zA-Z]+$/g)) {
            if (Piper.pipes.has(pipeName)) {
                throw new Error(`Pipe already exists: ${pipeName}.`);
            }
            Piper.pipes.set(pipeName, func);
        } else {
            throw new Error('Pipe names must only contain letters. Whitespaces are trimmed.');
        }
    }

    /**
     * Pipes a string through the Aych piper.
     * @param value
     * @param pipeName
     * @param parameters
     */
    static pipe(value: string, pipeName: string, parameters?: string) {
        if (pipeName !== undefined) {
            let params = parameters !== undefined ? parameters.split(/\s*,\s*/) : [];

            if (Piper.pipes.has(pipeName)) {
                // convert the string parameters to their proper types (number/boolean/string)
                let transformedParams = params.map((el) => {
                    if (!isNaN(parseFloat(el))) return parseFloat(el);
                    if (el === 'true') return true;
                    if (el === 'false') return false;
                    return el;
                });
                // @ts-ignore TODO: Find a fix to remove the need for this ignore statement.
                return Piper.pipes.get(pipeName).apply(null, [value, ...transformedParams]);
            } else {
                throw new Error(`Pipe does not exist: ${pipeName}.`);
            }
        }
        return value;
    }
}

Piper.install('uppercase', (str: string) => {
    return str.toUpperCase();
});

Piper.install('substr', (str: string, from: number, length: number) => {
    return str.substr(from, length);
});
