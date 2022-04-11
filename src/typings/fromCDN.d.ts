
interface Options {
    stripBOM?: boolean;
    addBOM?: boolean;
    defaultEncoding?: string;
}

declare function decode(buffer: Buffer, encoding: string, options?: Options): string;

declare module jschardet {
    export function detect(buffer: Buffer | string, options?: { minimumThreshold: number }): IDetectedMap;
}

interface IDetectedMap {
    encoding: string,
    confidence: number
}
