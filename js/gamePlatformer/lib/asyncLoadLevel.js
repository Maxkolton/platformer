export async function* asyncLoadLevel(serialNum) {
    if (serialNum > levelTotalAmount) {
        return yield {default: null};
    }

    for (let i = serialNum; i <= levelTotalAmount; i++) {
        yield await import(`../Views/level_${i}.js`);
    }

    return yield {default: null};
}

const levelTotalAmount = 6;
