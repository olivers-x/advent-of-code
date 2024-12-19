import { read, sum } from "../lib.mjs";

function main(input) {
  let [patterns, designs] = input.split("\n\n");

  patterns = patterns.split(", ");
  designs = designs.split("\n");

  function countPatterns(target, patterns) {
    const patternsSet = new Set(patterns);

    const memo = {};
    function canConstruct(s) {
      if (s === "") return 1;

      if (s in memo) return memo[s];

      let count = 0;

      for (let i = 1; i <= s.length; i++) {
        const prefix = s.slice(0, i);
        const suffix = s.slice(i);

        if (patternsSet.has(prefix)) {
          count += canConstruct(suffix);
        }
      }

      memo[s] = count;
      return count;
    }

    return canConstruct(target);
  }

  const possible = designs.map((design) => countPatterns(design, patterns));

  console.log("part1", possible.filter(Boolean).length);
  console.log("part2", possible.reduce(sum));
}

main(read());
