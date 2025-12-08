export type InputType = "file" | "string";

export type SaveFunction = (params: { input: string; output: string }) => string | null;

export type CommandConfig =
  | {
      readonly description: string;
      readonly usage: string;
      readonly input: InputType;
      readonly handler: (input: string) => Promise<string>;
      readonly save: SaveFunction;
      readonly successMessage: string;
      readonly outputToStdout?: false;
    }
  | {
      readonly description: string;
      readonly usage: string;
      readonly input: InputType;
      readonly handler: (input: string, ...args: string[]) => Promise<string>;
      readonly save: null;
      readonly successMessage: null;
      readonly outputToStdout: true;
    };
