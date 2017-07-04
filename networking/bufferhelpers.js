module.exports.read = function read(source, size, offset) {
    const buffer = source.slice(offset, offset + size);
    return buffer;
};
