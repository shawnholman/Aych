type PipeFunc = (str: string, ...args: any[]) => any;
type PipeCopyFunc = (original: PipeFunc, str: string, ...args:any[]) => any;

/**
 * Piper is the piping engine. Template pipes are defined and executed here.
 * TODO: Scope piper.
 */
export class Piper {
    private static pipes = new Map<string, PipeFunc>([
        ['lowercase', (str: string) => {
            return str.toLowerCase();
        }],
        ['uppercase', (str: string) => {
            return str.toUpperCase();
        }],
        ['substr', (str: string, from: number, length: number) => {
            return str.substr(from, length);
        }],

        // Expressions:
        ['==', (str: string, to: string | number | boolean) => {
            return str === to.toString();
        }],
        ['!=', (str: string, to: string | number | boolean) => {
            return str !== to.toString();
        }],
        ['>', (str: string, to: number) => {
            return Number(str) > to;
        }],
        ['<', (str: string, to: number) => {
            return Number(str) < to;
        }],
        ['>=', (str: string, to: number) => {
            return Number(str) >= to;
        }],
        ['<=', (str: string, to: number) => {
            return Number(str) <= to;
        }],
    ]);

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
     * Updates an existing pipe.
     * @param pipeName The name of the pipe to update.
     * @param func The update pipe function to build the update.
     */
    static update(pipeName: string, func: PipeCopyFunc): void {
        this.copy(pipeName, pipeName, func);
    }

    /**
     * Creates a copy of a pipe with a different name.
     * @param pipeName
     * @param newPipeName
     */
    static alias (pipeName: string, newPipeName: string): void {
        if (pipeName === newPipeName) {
            throw new Error(`Cannot alias with the same pipe name.`);
        }
        if (Piper.pipes.has(newPipeName)) {
            throw new Error(`Pipe already exists: ${newPipeName}.`);
        }
        this.copy(pipeName, newPipeName);
    }

    /**
     * Copies an existing pipe over to a new name.
     * @param pipeName The name of the pipe to copy.
     * @param newPipeName The name of the new pipe to make from the copy.
     * @param func The copy pipe function to build the update.
     */
    static copy(pipeName: string, newPipeName: string, func?: PipeCopyFunc): void {
        pipeName = pipeName.trim();
        if (Piper.pipes.has(pipeName)) {
            if (func) {
                let pipeFunc: PipeFunc = func.bind(this, Piper.pipes.get(pipeName));
                Piper.pipes.set(newPipeName, pipeFunc);
            } else {
                Piper.pipes.set(newPipeName, Piper.pipes.get(pipeName) as PipeFunc);
            }
        } else {
            throw new Error(`Cannot use non-existing pipe: ${pipeName}.`);
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
                return Piper.pipes.get(pipeName)!.call(this, value, ...transformedParams).toString();
            } else {
                throw new Error(`Pipe does not exist: ${pipeName}.`);
            }
        }
        return value;
    }
}