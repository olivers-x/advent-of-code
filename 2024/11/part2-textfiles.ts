import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";

const toInt = (s: string) => parseInt(s, 10);

const sum = (a: number, b: number) => a + b;

let stoneCounter = 0;

function blink(asString: string) {
  stoneCounter++;

  const stone = toInt(asString);
  if (stone === 0) {
    return "1";
  }

  const nDigits = asString.length;
  if (nDigits % 2 === 0) {
    const half = nDigits / 2;
    return asString.slice(0, half) + " " + asString.slice(half);
  }

  return (stone * 2024).toString();
}

class Blinker extends Transform {
  override _transform(chunk: any, __: any, done: any) {
    let numbers = chunk.toString("utf8").split(/\s+/g);
    // Process words here. In this example we'll simply attach a number to each word.
    let processedChunk = numbers.map(blink).join(" ");

    done(null, processedChunk);
  }
}

let nBlinks = 45;

// blink  25  done 229043
// blink  45  done 2950692459
// blink  46  done 1537755398 + 2950692459

function onBlinkFinish() {
  console.log("blink ", nBlinks, " done", stoneCounter);
  nBlinks++;
  if (nBlinks <= 75) {
    processMemory(nBlinks);
  }
}

function processMemory(nBlinks: number) {
  createReadStream("memory" + nBlinks + ".txt")
    .pipe(new Blinker())
    .pipe(createWriteStream("memory" + (nBlinks + 1) + ".txt"))
    .on("finish", onBlinkFinish);
}

async function part2() {
  const fileName = process.argv[process.argv.length - 1];

  // copy to memory.txt
  createReadStream(fileName)
    .pipe(createWriteStream("memory" + nBlinks + ".txt"))
    .on("finish", () => processMemory(0));
}

// Example usage:
// (async () => {
//   const filePath = "./input.txt"; // Replace with your file path

//   const nextNumber = createNumberReader(filePath);

//   let num;
//   while ((num = await nextNumber()) !== null) {
//     console.log(num); // Logs the next number
//   }

//   console.log("Finished reading all numbers");
// })();

// async function part2(input: string) {
//   const stones = input.split(" ").map(toInt);
//   const file = await Deno.open("blinks.txt");
//   const nBlinks = 5;

//   console.table(stones);

//   let state = list;
//   for (let i = 0; i < nBlinks; i++) {
//     state = blink(state);
//   }

//   console.log("n of stones", state.size);
// }

if (import.meta.main) {
  part2();
}
