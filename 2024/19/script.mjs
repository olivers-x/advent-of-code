import { read } from "../lib.mjs";

function main(input) {
  let [patterns, designs] = input.split("\n\n");

  patterns = patterns.split(", ").sort((a, b) => b.length - a.length);
  designs = designs.split("\n");

  console.log("removed", removed);
  console.log("patterns", patterns);

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

  let total = 0;
  for (let design of designs) {
    const result = countPatterns(design, patterns);

    console.log("checking", design, result);
    total += result;
  }

  console.log("total", total);
}

main(read());
