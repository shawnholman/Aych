export class Aych {

    public static Pipes = class {
        [key: string]: string;

        static uppercase(str: string): string {
            return str.toUpperCase();
        }

        static substr(str: string, from: string, length: string): string {
            console.log(str, from, length);
            return str.substr(parseInt(from), parseInt(length));
        }
    }
}

export const H = new Aych();
