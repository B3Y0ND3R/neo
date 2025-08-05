function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function generateTermFrequencyVector(text) {
  const tokens = tokenize(text);
  const vector = new Map();
  
  tokens.forEach(token => {
    vector.set(token, (vector.get(token) || 0) + 1);
  });
  
  return vector;
}

function calculateCosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  // Calculate dot product and norms
  for (const [term, freq] of vec1) {
    const freq2 = vec2.get(term) || 0;
    dotProduct += freq * freq2;
    norm1 += freq * freq;
  }
  
  for (const [_, freq] of vec2) {
    norm2 += freq * freq;
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

function generateProductVector(product) {
  const text = `${product.title} ${product.description} ${product.category} ${product.brand}`;
  return generateTermFrequencyVector(text);
}

module.exports = {
  generateProductVector,
  calculateCosineSimilarity,
  generateTermFrequencyVector
}; 