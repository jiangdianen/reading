function fontUri(fontFamily, name, size) {
  let glyphMap;
  if (fontFamily === 'Ionicons') {
    glyphMap = require('react-native-vector-icons/glyphmaps/Ionicons.json');
  } else {
    console.error(`还没处理 ${fontFamily} 这种字体`);
  }

  if (!glyphMap) {
    glyphMap = require('react-native-vector-icons/glyphmaps/Ionicons.json');
  }

  let glyph = glyphMap[name] || '?';
  if (typeof glyph === 'number') {
    glyph = String.fromCharCode(glyph);
  }
  return `font://${fontFamily}/${glyph}/${size}`;
}

export default fontUri;
