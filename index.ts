export type OptionDefinitions = {
    name: string;
    type: (t: unknown) => unknown;
    aliases?: string[];
    default?: boolean;
}[];

export interface Result {
    _unknown: {
        _?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export function bargs(
    options: OptionDefinitions,
    argv: string[] = process.argv.slice(2),
): Result {
    if (options.filter((i) => i.default).length > 1)
        throw new Error("More than one default option is not allowed");
    const result: Result = { _unknown: {} };
    const aliases: { [alias: string]: string } = {};
    const splitargv = argv
        .join(" ")
        .split("-")
        .filter((i) => !!i)
        .map((i) => i.trim());
    for (const index in options) {
        const option = options[index];
        if (!option.name)
            throw new Error("Option name should not be an empty string");
        if (!option.aliases || !option.aliases.length) continue;
        for (const alias of option.aliases as string[]) {
            aliases[alias] = option.name;
        }
    }
    for (const key of splitargv) {
        const split = key.split(" ");
        let name = split.shift() as string;
        if (!argv.includes("-" + name) && !argv.includes("--" + name)) {
            const defaultOption = options.find((option) => option.default);
            if (defaultOption)
                result[defaultOption.name] = defaultOption.type(key);
            else result._unknown._ = key;
        } else {
            if (aliases[name]) name = aliases[name] as string;
            const option = options.find((option) => option.name == name);
            const value = split.join(" ") || true;
            if (!option) result._unknown[name] = value;
            else result[name] = option.type(value);
        }
    }
    return result;
}
