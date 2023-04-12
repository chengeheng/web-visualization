// 可直接使用row-loader
module.exports = function (content, map, data) {
    const json = JSON.stringify(content)
        .replace(/\u2028/g, "\\u2028") // 行分隔符 => 行结束符
        .replace(/\u2029/g, "\\u2029"); // 段落分隔符 => 行结束符

    return `export default ${json};`;
};
