type PipeFunc = (...args: any[]) => string;
/**
 * Piper is the piping engine. Template pipes are defined and executed here.
 */
export class Piper {
    private static pipes = new Map<string, PipeFunc>();

    /**
     * Adds to a list of pipes in piper.
     * @param pipeName
     * @param func
     */
    static install(pipeName: string, func: PipeFunc): void {
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
    static pipe(value: string, pipeName: string, parameters?: string): string {
        if (pipeName !== undefined) {
            const params = parameters !== undefined ? parameters.split(/\s*,\s*/) : [];

            if (Piper.pipes.has(pipeName)) {
                // convert the string parameters to their proper types (number/boolean/string)
                const transformedParams = params.map((el) => {
                    if (!isNaN(parseFloat(el))) return parseFloat(el);
                    if (el === 'true') return true;
                    if (el === 'false') return false;
                    return el;
                });
                return Piper.pipes.get(pipeName)!.apply('ho', [value, ...transformedParams]);
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
