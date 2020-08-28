import {isString} from "../Util";

type PipeFunc = (str: string, ...args: any[]) => any;
type PipeCopyFunc = (original: PipeFunc, str: string, ...args:any[]) => any;

/**
 * Piper is the piping engine. Template pipes are defined and executed here.
 * TODO: Scope piper.
 */
export class Piper {
    private static readonly pipes = new Map<string, string | PipeFunc>([
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

    private static readonly aliasLinks = new Map<string, string[]>([
        ['lowercase', []],
        ['uppercase', []],
        ['substr', []],
        ['==', []],
        ['!=', []],
        ['>', []],
        ['<', []],
        ['>=', []],
        ['<=', []],
    ]);

    /**
     * Register a new pipe with piper.
     * @param pipeName
     * @param func
     */
    static register(pipeName: string, func: PipeFunc): void {
        this.addPipe(pipeName, func, false);
    }

    /**
     * Remove an existing pipe.
     * @param pipeName The pipe to remove.
     * @return Whether or not the uninstall was a success.
     */
    static deregister(pipeName: string): boolean {
        let pipeToCall;

        try { // Ignore error if the pipe is not found.
            pipeToCall = this.findPipeName(pipeName);
        } catch(error) {
            return false;
        }

        // Deletes all aliased pipes.
        for (const aliasedPipeName of Piper.aliasLinks.get(pipeToCall) as string[]) {
            Piper.pipes.delete(aliasedPipeName);
        }
        Piper.aliasLinks.delete(pipeToCall);

        // Deletes the pipe.
        return Piper.pipes.delete(pipeToCall);
    }

    /**
     * Updates an existing pipe.
     * @param pipeName The name of the pipe to update.
     * @param func The update pipe function to build the update.
     */
    static update(pipeName: string, func: PipeCopyFunc): void {
        this.copy(pipeName, pipeName, false, func);
    }

    /**
     * Creates a copy of a pipe with a different name.
     * @param pipeName
     * @param newPipeName
     * TODO: Allow all alias to be linked. Updating one should update all. Deleting one should delete all.
     */
    static alias (pipeName: string, newPipeName: string): void {
        if (pipeName === newPipeName) {
            throw new Error(`Cannot alias with the same pipe name.`);
        }
        if (Piper.pipes.has(newPipeName)) {
            throw new Error(`Pipe already exists: ${newPipeName}.`);
        }
        this.copy(this.findPipeName(pipeName), newPipeName, true);
    }

    /**
     * Copies an existing pipe over to a new name.
     * @param pipeName The name of the pipe to copy.
     * @param newPipeName The name of the new pipe to make from the copy.
     * @param func The copy pipe function to build the update.
     */
    static copy(pipeName: string, newPipeName: string, asAlias = false, func?: PipeCopyFunc): void {
        if (asAlias && func) {
            throw new Error('Alias should retain original function.');
        }

        let pipeToCall: string = this.findPipeName(pipeName);

        if (func) {
            let pipeFunc: PipeFunc = func.bind(this, Piper.pipes.get(pipeToCall));
            this.addPipe(newPipeName, pipeFunc, true);
        } else {
            if (asAlias) {
                // It's implied if Piper.pipes has the pipeToCall then so does Piper.aliasLinks
                Piper.aliasLinks.get(pipeToCall)!.push(newPipeName);
                // Create a logical link
                Piper.pipes.set(newPipeName, pipeToCall);
            } else {
                this.register(newPipeName, Piper.pipes.get(pipeToCall) as PipeFunc);
            }
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
            const pipeToCall = this.findPipeName(pipeName);
            const params = Piper.parsePipeParameters(parameters);
            const pipeFunction = Piper.pipes.get(pipeToCall) as PipeFunc;

            return pipeFunction!.call(this, value, ...params).toString();
        }

        return value;
    }

    /**
     * Adds a pipe into piper w/ some error checking.
     * @param pipeName
     * @param func
     */
    private static addPipe(pipeName: string, func: PipeFunc, allowOverride: boolean) {
        pipeName = pipeName.trim();
        if (pipeName.match(/^[a-zA-Z]+$/g)) {
            if (!allowOverride && Piper.pipes.has(pipeName)) {
                throw new Error(`Pipe already exists: ${pipeName}.`);
            }
            Piper.aliasLinks.set(pipeName, []);
            Piper.pipes.set(pipeName, func);
        } else {
            throw new Error('Pipe names must only contain letters. Whitespaces are trimmed.');
        }
    }

    /**
     * Parses a comma separated list into an array and transforms each value into a proper data type.
     * @param parameters
     * @private
     */
    private static parsePipeParameters(parameters?: string) {
        const params = parameters !== undefined ? parameters.split(/\s*,\s*/) : [];
        // convert the string parameters to their proper types (number/boolean/string)
        return params.map((el) => {
            if (!isNaN(parseFloat(el))) return parseFloat(el);
            if (el === 'true') return true;
            if (el === 'false') return false;
            return el;
        });
    }

    /**
     * Finds a pipe in the map taken into account aliases.
     * @param pipeName
     * @private
     */
    private static findPipeName(pipeName: string): string {
        let pipe = Piper.pipes.get(pipeName.trim());

        if (!pipe) {
            throw new Error(`Pipe does not exist: ${pipeName}.`);
        }

        return isString(pipe) ? pipe : pipeName;
    }
}