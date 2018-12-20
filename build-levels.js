var fs = require('fs');

var Parser = require('binary-parser').Parser;

const levelParser = new Parser()
        .array('data', {
          type: 'int8',
          length: 1440
        })
        .skip(4)
        .uint8('gravity')
        .uint8('th')
        .string('title', { length: 23 })
        .uint8('freezeZonks')
        .uint8('infotronsNeeded')
        .uint8('gravityPorts')
        .skip(60)
        .skip(4);

const levelsParser = new Parser()
        .array('levels', {
          type: levelParser,
          readUntil: 'eof'
        });

module.exports = function parse(data) {
  var result = levelsParser.parse(data);
  return result;
};

(function writeTask() {

  fs.readFile("data/levels.dat", (err, data) => {
    if (err) {
      throw(err);
    }

    data = levelsParser.parse(data);

    fs.writeFile("build/levels.json",
                 JSON.stringify(data), (err) => {
                   if (err) {
                     throw(err);
                   }
                   console.log('done');
                 });
  });
})();
