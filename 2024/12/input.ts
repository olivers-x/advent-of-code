export function readInput() {
  const fileName = process.argv[process.argv.length - 1];
  return Deno.readTextFileSync(fileName);
}
