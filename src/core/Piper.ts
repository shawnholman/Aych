type PipeFunc = (str: string, ...args: any[]) => string;
type PipeUpdateFunc = (original: PipeFunc, str: string, ...args:any[]) => string;
/**
 * Piper is the piping engine. Template pipes are defined and executed here.
 */
export class Piper {
    private static pipes = new Map<string, PipeFunc>();

    /**
     * Updates an existing pipe.
     * @param pipeName The name of the pipe to update.
     * @param func The update pipe function to build the update.
     * TODO: Create a copy method which is like update but would not remove the old pipe.
     */
    static update(pipeName: string, func: PipeUpdateFunc): void {
        pipeName = pipeName.trim();
        if (Piper.pipes.has(pipeName)) {
            let pipeFunc: PipeFunc = func.bind(this, Piper.pipes.get(pipeName));
            Piper.pipes.set(pipeName, pipeFunc);
        } else {
            throw new Error(`Cannot update non-existing pipe: ${pipeName}.`);
        }
    }

    /**
     * Register a new pipe with piper.
     * @param pipeName
     * @param func
     */
    static register(pipeName: string, func: PipeFunc): void {
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
     * Remove an existing pipe.
     * @param pipeName The pipe to remove.
     * @return Whether or not the uninstall was a success.
     */
    static deregister(pipeName: string): boolean {
        return Piper.pipes.delete(pipeName);
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
                return Piper.pipes.get(pipeName)!.call(this, value, ...transformedParams);
            } else {
                throw new Error(`Pipe does not exist: ${pipeName}.`);
            }
        }
        return value;
    }
}

Piper.register('lowercase', (str: string) => {
    return str.toLowerCase();
});

Piper.register('uppercase', (str: string) => {
    return str.toUpperCase();
});

Piper.register('substr', (str: string, from: number, length: number) => {
    return str.substr(from, length);
});
