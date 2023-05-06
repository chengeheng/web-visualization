const transform2Markdown = (s: string, type: string = "glsl"): string => {
    return "```" + type + "\n" + s + "```";
};

export { transform2Markdown };
