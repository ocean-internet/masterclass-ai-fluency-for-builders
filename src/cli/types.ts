export type SaveParams = { input: string; output: string };
export type SaveFunction = (params: SaveParams) => string;

export type SaveCommand = {
  readonly description: string;
  readonly usage: string;
  readonly handler: (input: string) => Promise<string>;
  readonly save: SaveFunction;
  readonly successMessage: string;
};

export type PrintCommand = {
  readonly description: string;
  readonly usage: string;
  readonly handler: (input: string, ...args: string[]) => Promise<string>;
};

export type CommandConfig = SaveCommand | PrintCommand;
