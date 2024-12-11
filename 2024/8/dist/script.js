import {argv as $7YbGL$argv} from "process";
import {createReadStream as $7YbGL$createReadStream} from "fs";
import {createInterface as $7YbGL$createInterface} from "readline";




const $fe9ff54eec9539d7$var$sum = (a, b)=>a + b;
let $fe9ff54eec9539d7$var$mapSize;
let $fe9ff54eec9539d7$var$antinodeMap;
let $fe9ff54eec9539d7$var$char = "#";
let $fe9ff54eec9539d7$var$count = 0;
async function $fe9ff54eec9539d7$var$readFileLineByLine(filePath) {
    const fileStream = $7YbGL$createReadStream(filePath);
    const rl = $7YbGL$createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // const size = rl.length;
    const lines = []; // new Array(size);
    for await (const line of rl)lines.push(line);
    return lines;
}
function $fe9ff54eec9539d7$var$getLocations(map) {
    const locations = {};
    const size = map.length;
    for(let i = 0; i < size; i++)for(let j = 0; j < size; j++){
        const char = map[i][j];
        if (char !== ".") {
            if (!locations[char]) locations[char] = [];
            else {
                // at least a pair of antennas
                $fe9ff54eec9539d7$var$antinodeMap[i][j] = char;
                const [{ x: x, y: y }] = locations[char];
                $fe9ff54eec9539d7$var$antinodeMap[x][y] = char;
            }
            locations[char].push({
                x: i,
                y: j
            });
        }
    }
    return locations;
}
function $fe9ff54eec9539d7$var$initAntinodeMap() {
    $fe9ff54eec9539d7$var$antinodeMap = Array($fe9ff54eec9539d7$var$mapSize).fill().map(()=>Array($fe9ff54eec9539d7$var$mapSize).fill("."));
}
function $fe9ff54eec9539d7$var$getAntinodeCount() {
    for(let i = 0; i < $fe9ff54eec9539d7$var$mapSize; i++)for(let j = 0; j < $fe9ff54eec9539d7$var$mapSize; j++)if ($fe9ff54eec9539d7$var$antinodeMap[i][j] !== ".") $fe9ff54eec9539d7$var$count += 1;
    return $fe9ff54eec9539d7$var$count;
}
function $fe9ff54eec9539d7$var$placeIfOk(x, y) {
    if (!(x < 0 || y < 0 || x > $fe9ff54eec9539d7$var$mapSize - 1 || y > $fe9ff54eec9539d7$var$mapSize - 1)) $fe9ff54eec9539d7$var$antinodeMap[x][y] = $fe9ff54eec9539d7$var$char;
}
function $fe9ff54eec9539d7$var$placeAntinode(a, b) {
    // b > a
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    $fe9ff54eec9539d7$var$placeIfOk(a.x + dx, a.y + dy);
    $fe9ff54eec9539d7$var$placeIfOk(b.x - dx, b.y - dy);
}
function $fe9ff54eec9539d7$var$placeAntinode2(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    let x = a.x + dx;
    let y = a.y + dy;
    while(x < $fe9ff54eec9539d7$var$mapSize && y < $fe9ff54eec9539d7$var$mapSize){
        $fe9ff54eec9539d7$var$placeIfOk(x, y);
        x += dx;
        y += dy;
    }
    x = b.x - dx;
    y = b.y - dy;
    while(x >= 0 && y >= 0){
        $fe9ff54eec9539d7$var$placeIfOk(x, y);
        x -= dx;
        y -= dy;
    }
}
function $fe9ff54eec9539d7$var$goThrouLocations(locations) {
    // for each two points place two antinodes
    const size = locations.length;
    for(let i = 0; i < size; i++)for(let j = 0; j < i; j++){
        if (i === j) continue;
        const a = locations[i];
        const b = locations[j];
        $fe9ff54eec9539d7$var$placeAntinode2(a, b);
    }
}
async function $fe9ff54eec9539d7$var$main() {
    const fileName = $7YbGL$argv[$7YbGL$argv.length - 1];
    const map = await $fe9ff54eec9539d7$var$readFileLineByLine(fileName);
    $fe9ff54eec9539d7$var$mapSize = map.length;
    $fe9ff54eec9539d7$var$initAntinodeMap();
    const locations = $fe9ff54eec9539d7$var$getLocations(map);
    Object.values(locations).forEach($fe9ff54eec9539d7$var$goThrouLocations);
    console.log($fe9ff54eec9539d7$var$getAntinodeCount());
}
$fe9ff54eec9539d7$var$main();


//# sourceMappingURL=script.js.map
