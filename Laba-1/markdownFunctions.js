'use strict'

// This function validates the HTML structure within Markdown text.
function validateHTMLStructure(markdownText) {
  const sanitizedTags = (markdownText.match(/<\/?[^>]+>/g) || []).map(tag => tag.replace('/', ''));

  for (let i = 0; i < sanitizedTags.length; i += 2) {
    if (sanitizedTags[i] !== sanitizedTags[i + 1]) {
      throw new Error("Mismatched HTML tags. Check for nesting issues.");
    }
  }
}

// This function validates if markdown symbols in the given text are properly closed and not unfinished.
function validateMarkdownSymbols(markdownText) {
    // List of supported markdown symbols to check for completeness.
    const markdownSymbols = ['**', '_', '`'];
    
    const isUnfinishedSymbol = (word, symbol) =>
      word.includes(symbol) && word !== symbol &&
      (word.startsWith(symbol) || word.endsWith(symbol));
  
    const hasUnfinishedSymbol = words => words.some(word =>
      markdownSymbols.some(symbol => isUnfinishedSymbol(word, symbol))
    );
  
    const words = markdownText.split(/\s+/);
  
    if (hasUnfinishedSymbol(words)) {
      throw new Error(`Unfinished markdown symbol - ${words.find(word => markdownSymbols.some(symbol => isUnfinishedSymbol(word, symbol)))}`);
    }
}