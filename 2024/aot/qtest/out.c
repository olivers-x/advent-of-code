.../script.js$readFileLineByLinemapSizeantinodeMapchar
countgetLocationsinitAntinodeMap getAntinodeCountplaceIfOkplaceAntinodeplaceAntinode2 goThrouLocationsmainpath
linesfilelinestdopenrconsole
error$Cannot open file: osexitgetlinepush
closemaplocationsijxy.fillabdxdyfileNamescriptArgsforEach
print#�     ��   	E � �	�	�	�	�����	�
��C��  ��  � 0�0� a a a  &  �8�   B�   ��   $ �b ��,8�   B�   �   B]   �$ $ 8�   B�   �$ �b B�   $  c ��b  B�   b $ ��b B�   $  b  (�w&S5\65? 4*+A0,
�function readFileLineByLine(path) {
  const lines = [];
  const file = std.open(path, "r"); // Open file in read mode
  if (!file) {
    console.error(`Cannot open file: ${path}`);
    os.exit(1);
  }

  let line;
  while ((line = file.getline()) !== null) {
    lines.push(line);
  }

  file.close(); // Don't forget to close the file

  return lines;
}C�� ��  � 0b0� � �0�
0�
0�a a  ����a ��b b �i�   a ��b b �i�   a �b Gb G�b   �i�   b  b G��b  b ��q&  qI�aa a e  b Gb ��qb qI��~� pB  �B  ���b  b G��e  b Gb ��qb qIb  b GB�   b L  b L  $ b �c �,�b �c ��b  (� S<� @0�=? �function getLocations(map) {
  const locations = {};
  const size = map.length;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const char = map[i][j];
      if (char !== ".") {
        if (!locations[char]) {
          locations[char] = [];
        } else {
          // at least a pair of antennas
          antinodeMap[i][j] = char;
          const [{ x, y }] = locations[char];
          antinodeMap[x][y] = char;
        }
        locations[char].push({ x: i, y: j });
      }
    }
  }

  return locations;
}C��     ��B�      � 8�   e  �B    % �3/() => Array(mapSize).fill(".")8�   e  �B  $  B�   � $ f )�060+ sfunction initAntinodeMap() {
  antinodeMap = Array(mapSize)
    .fill()
    .map(() => Array(mapSize).fill("."));
}C��   Q�  � ���a  ��b  e  ��@a ��b e  ��(e b  Gb G  ��e ��f b �c ��b  �c  �e (�6�@�function getAntinodeCount() {
  for (let i = 0; i < mapSize; i++)
    for (let j = 0; j < mapSize; j++) {
      if (antinodeMap[i][j] !== ".") count += 1;
    }

  return count;
}C��  :�  �  ���Ѵ��Ҵ���e  ����	�e  �����e �G���qe qI)�?�~function placeIfOk(x, y) {
  if (!(x < 0 || y < 0 || x > mapSize - 1 || y > mapSize - 1)) {
    antinodeMap[x][y] = char;
  }
}C�� P�  �  �  � � a a  �A  �A  ���A  �A  ����A  b  ��A  b ����A  b  ��A  b ��)�E
 "&	!p43�function placeAntinode(a, b) {
  // b > a

  let dx = a.x - b.x;
  let dy = a.y - b.y;

  placeIfOk(a.x + dx, a.y + dy);
  placeIfOk(b.x - dx, b.y - dy);
}C�� ��  �  �  � � � �� a a a a  �A  �A  ���A  �A  ���A  b  ���A  b ��b e  ��-b e  ��$�b b �b b  �c b b �c ���A  b  �c �A  b �c b ���+b ���$�b b �b b  �c b b �c ��)�O PJA*?JO�-*?�function placeAntinode2(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;

  let x = a.x + dx;
  let y = a.y + dy;

  while (x < mapSize && y < mapSize) {
    placeIfOk(x, y);
    x += dx;
    y += dy;
  }

  x = b.x - dx;
  y = b.y - dy;

  while (x >= 0 && y >= 0) {
    placeIfOk(x, y);
    x -= dx;
    y -= dy;
  }
}C�� \�  b 0� � �0�0�
 a  ���a ��b b  ��Ha ��b b ��0a a b b ���b G��b G��b b �b �c ��b �c �)�f >4	'�function goThrouLocations(locations) {
  // for each two points place two antinodes
  const size = locations.length;

  for (let i = 0; i < size; i++)
    for (let j = 0; j < i; j++) {
      if (i === j) continue;

      const a = locations[i];
      const b = locations[j];

      placeAntinode2(a, b);
    }
}b��   Y� 0�0�0�  �� � � � a a a  8
  8
  鵞G��b  ��b �f ���b ��8�   Bl   b $ B  ^ $ 8  ^ ��.�u�&1!	$6/9$%A�async function main() {
  const fileName = scriptArgs[scriptArgs.length - 1];
  const map = readFileLineByLine(fileName);

  mapSize = map.length;

  initAntinodeMap();

  const locations = getLocations(map);

  Object.values(locations).forEach(goThrouLocations);

  print(getAntinodeCount());
}�-� �_ �_ �_ �_ �_	 �_
 �_ �_ )��  �_ ^ �.� =�  