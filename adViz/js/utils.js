function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function hash(str) {
    let hash = 0

    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

function filterObj(obj, filter) {
    let filtered = {};

    for (let key in obj) {
        let value = obj[key];

        if (filter(key, value)) {
            filtered[key] = value;
        }
    }
    return filtered;
}
