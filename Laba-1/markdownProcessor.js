'use strict';

const fs = require('fs');
const {
  validateHTMLStructure,
  validateMarkdownSymbols,
  extractCodeBlocks,
  insertCodeBlocks,
  formatHTMLParagraphs
} = require('./markdownFunctions');

function convertMarkdownToHTML(markdownText) {
    const codeBlocks = [];
  
    const textReplacements = [
      [/\*\*\*([^*]+)\*\*\*/g, '<b><i>$1</i></b>'],
      [/\*\*(.*?)\*\*/g, '<b>$1</b>'],
      [/_([\w\s]+)_/gu, '<i>$1</i>'],
      [/`([^`]+)`/g, '<tt>$1</tt>'],
      [/~~([^~]+)~~/g, '<del>$1</del>'],
    ];
  
    markdownText = extractCodeBlocks(markdownText, codeBlocks);
  
    for (const [pattern, replacement] of textReplacements) {
      markdownText = markdownText.replace(pattern, replacement);
    }
  
    validateHTMLStructure(markdownText);
    validateMarkdownSymbols(markdownText);
  
    markdownText = insertCodeBlocks(markdownText, codeBlocks);
  
    return formatHTMLParagraphs(markdownText);
}