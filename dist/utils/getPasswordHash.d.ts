declare const generateHash: (password: string) => Promise<string>;
declare const comparePassword: (password: string, comparedVal: string) => Promise<boolean>;
export { comparePassword, generateHash };
