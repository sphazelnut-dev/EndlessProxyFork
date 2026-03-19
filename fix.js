const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const bingPattern = /https:\/\/th\.bing\.com\/th\/id\/OIP\.([^?"]+)[^"]*/g;

let i = 1;
const seen = {};
html = html.replace(bingPattern, (match) => {
  if (!seen[match]) {
    seen[match] = '_/bing_images/image_' + i++ + '.webp';
  }
  return seen[match];
});

fs.writeFileSync('index.html', html);
console.log('Done! Replaced ' + Object.keys(seen).length + ' URLs');