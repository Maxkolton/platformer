let timeStart = Date.now();
let counter = 0;
let fps = 0;
export function counterFPS() {
    counter++;
    if (Date.now() - timeStart >= 1000) {
        timeStart = Date.now();
        fps = counter;
        counter = 0;
        return fps;
    }
}


