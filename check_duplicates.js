const fs = require('fs');

const content = fs.readFileSync('c:/Users/Ruchika/OneDrive/Desktop/nivora app - Copy/constants/Translations.ts', 'utf8');

function findDuplicates(sectionName, sectionContent) {
    const lines = sectionContent.split('\n');
    const keys = {};
    const duplicates = [];
    lines.forEach((line, index) => {
        const match = line.match(/^\s*(\w+):/);
        if (match) {
            const key = match[1];
            if (keys[key]) {
                duplicates.push({ key, line: index + 1 });
            }
            keys[key] = true;
        }
    });
    return duplicates;
}

const englishSection = content.match(/English: \{([\s\S]*?)\},/)[1];
const sinhalaSection = content.match(/'සිංහල': \{([\s\S]*?)\},/)[1];
const tamilSection = content.match(/'தமிழ்': \{([\s\S]*?)\}/)[1];

console.log('English Duplicates:', findDuplicates('English', englishSection));
console.log('Sinhala Duplicates:', findDuplicates('Sinhala', sinhalaSection));
console.log('Tamil Duplicates:', findDuplicates('Tamil', tamilSection));
