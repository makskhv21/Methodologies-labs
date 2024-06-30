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

// This function extracts code blocks enclosed in triple backticks from the given text and populates the provided array.
function extractCodeBlocks(text, codeBlocks) {
    const codeBlockPlaceholder = '%%CODE_BLOCK%%';
    return text.replace(/```([\s\S]*?)```/g, (match, content) => {
        codeBlocks.push(content);
        return codeBlockPlaceholder;
    });
}
  
// This function inserts code blocks back into the text using a placeholder and the provided array.
function insertCodeBlocks(text, codeBlocks,  format) {
    const codeBlockPlaceholder = '%%CODE_BLOCK%%';
    return text.replace(new RegExp(codeBlockPlaceholder, 'g'), (format === 'html') ? '<pre>' + codeBlocks.shift() + '</pre>' : '\x1b[7m' + codeBlocks.shift() + '\x1b[0m');
}
  
function formatHTMLParagraphs(text, format) {
    if (format === 'ansi') {
      return text; // В ANSI форматі абзаци не потрібні
    } else if (format === 'html') {
      return '<p>' + text.trim().replace(/(?:\r?\n\r?\n|^)([^<>\r\n]+)(?:\r?\n\r?\n|$)/g, '</p>\n<p>$1</p>\n') + '</p>'; // HTML форматування абзаців
    } else {
      throw new Error("Invalid format specified. Please use either 'ansi' or 'html'.");
    }
}

function convertMarkdownToHTML(markdownText, format) {
  const codeBlocks = [];

  const textReplacements = [
    [/\*\*(.*?)\*\*/g, format === 'ansi' ? '\x1b[1m$1\x1b[0m' : '<b>$1</b>'], // Bold text with bold ANSI escape code or HTML tag
      [/_([\w\s]+)_/gu, format === 'ansi' ? '\x1b[3m$1\x1b[0m' : '<i>$1</i>'], // Italic text with italic ANSI escape code or HTML tag
      [/~~([^~]+)~~/g, format === 'ansi' ? '\x1b[9m$1\x1b[0m' : '<del>$1</del>'], // Strikethrough text with strikethrough ANSI escape code or HTML tag
      [/`([^`]+)`/g, format === 'ansi' ? '\x1b[7m$1\x1b[0m' : '<tt>$1</tt>'], // Preformatted text with inverse mode ANSI escape code or HTML tag
  ];

  markdownText = extractCodeBlocks(markdownText, codeBlocks);

  for (const [pattern, replacement] of textReplacements) {
    markdownText = markdownText.replace(pattern, replacement);
  }

  validateHTMLStructure(markdownText);
  validateMarkdownSymbols(markdownText);

  markdownText = insertCodeBlocks(markdownText, codeBlocks, format);

  // Format paragraphs based on the selected format
  markdownText = formatHTMLParagraphs(markdownText, format);

  return markdownText;
}

module.exports = {
    validateHTMLStructure,
    validateMarkdownSymbols,
    extractCodeBlocks,
    insertCodeBlocks,
    formatHTMLParagraphs,
    convertMarkdownToHTML
};