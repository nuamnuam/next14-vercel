const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'fa');
const outputFile = path.join(__dirname, 'langTypes.d.ts');

const files = fs
  .readdirSync(directoryPath)
  .filter((file) => file.endsWith('.json'));

const typeContent = `
export type LangFileNames = ${files
  .map((file) => `'${file.replace('.json', '')}'`)
  .join(' | ')};
`;

fs.writeFileSync(outputFile, typeContent);
