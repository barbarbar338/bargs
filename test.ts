import { expect } from "chai";
import { bargs } from ".";

it("Basic Parsing", () => {
    const defaultProcessArgs = process.argv;
    process.argv = [
        "node",
        "index.js",
        "Hello,",
        "world!",
        "-h",
        "--page",
        "12",
        "--command",
        "push",
    ];
    try {
        const args = bargs([
            { name: "help", type: Boolean, aliases: ["h"] },
            { name: "page", type: Number },
            { name: "message", type: String, default: true },
        ]);
        expect(args).to.exist;
        expect(args["help"]).to.be.true;
        expect(args["page"]).to.equal(12);
        expect(args["message"]).to.equal("Hello, world!");
        expect(args["_unknown"]).to.deep.equal({ command: "push" });
    } finally {
        process.argv = defaultProcessArgs;
    }
});

it("Parsing With No Args", () => {
    const defaultProcessArgs = process.argv;
    process.argv = ["node", "index.js"];
    try {
        const args = bargs([
            { name: "help", type: Boolean, aliases: ["h"] },
            { name: "page", type: Number },
            { name: "message", type: String, default: true },
        ]);
        expect(args).to.exist;
        expect(args).to.deep.equal({ _unknown: {} });
    } finally {
        process.argv = defaultProcessArgs;
    }
});

it("Parsing With No Options", () => {
    const defaultProcessArgs = process.argv;
    process.argv = [
        "node",
        "index.js",
        "Hello,",
        "world!",
        "-h",
        "--page",
        "12",
        "--command",
        "push",
    ];
    try {
        const args = bargs([]);
        expect(args).to.exist;
        expect(args).to.deep.equal({
            _unknown: {
                _: "Hello, world!",
                h: true,
                page: "12",
                command: "push",
            },
        });
    } finally {
        process.argv = defaultProcessArgs;
    }
});

it("Unexpected String", () => {
    const defaultProcessArgs = process.argv;
    process.argv = [
        "node",
        "index.js",
        "Hello,",
        "world!",
        "-h",
        "--page",
        "12",
        "--command",
        "push",
        "--message",
        "this",
        "is",
        "message",
    ];
    try {
        const args = bargs([
            { name: "help", type: Boolean, aliases: ["h"] },
            { name: "page", type: Number },
            { name: "message", type: String },
        ]);
        expect(args).to.exist;
        expect(args["help"]).to.be.true;
        expect(args["page"]).to.equal(12);
        expect(args["message"]).to.equal("this is message");
        expect(args["_unknown"]).to.deep.equal({
            _: "Hello, world!",
            command: "push",
        });
    } finally {
        process.argv = defaultProcessArgs;
    }
});

it("Error: MoreThanOneDefaultOption", () => {
    const defaultProcessArgs = process.argv;
    process.argv = [
        "node",
        "index.js",
        "Hello,",
        "world!",
        "-h",
        "--page",
        "12",
        "--command",
        "push",
    ];
    try {
        expect(() =>
            bargs([
                { name: "help", type: Boolean, aliases: ["h"] },
                { name: "page", type: Number, default: true },
                { name: "message", type: String, default: true },
            ]),
        ).to.throw("More than one default option is not allowed");
    } finally {
        process.argv = defaultProcessArgs;
    }
});

it("Error: EmptyOptionName", () => {
    const defaultProcessArgs = process.argv;
    process.argv = [
        "node",
        "index.js",
        "Hello,",
        "world!",
        "-h",
        "--page",
        "12",
        "--command",
        "push",
    ];
    try {
        expect(() =>
            bargs([
                { name: "help", type: Boolean, aliases: ["h"] },
                { name: "", type: Number },
                { name: "message", type: String, default: true },
            ]),
        ).to.throw("Option name should not be an empty string");
    } finally {
        process.argv = defaultProcessArgs;
    }
});
