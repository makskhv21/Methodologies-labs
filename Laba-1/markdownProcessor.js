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

function validateCommandLineArguments(argv) {
    // Define valid lengths for command-line arguments
    const validLengths = [3, 5];
  
    if (!validLengths.includes(argv.length)) {
      throw new Error("Invalid number of command-line arguments. Please provide either 3 or 5 arguments.");
    }
  
    if (argv.length === 5 && argv[3] !== '--out') {
      throw new Error("Invalid format of command-line arguments. If providing 5 arguments, the 4th argument should be '--out'.");
    }
  }
    
function processMarkdownFile(markdownFilePath) {
    try {
        // Check if the file exists
        if (!fs.existsSync(markdownFilePath)) {
            throw new Error(`File not found: ${markdownFilePath}`);
        }

        // Read the markdown content from the file
        const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');

        // Convert markdown to HTML
        const htmlContent = convertMarkdownToHTML(markdownContent);

        // Output the HTML content
        console.log(htmlContent);
    } catch (error) {
        // Handle errors
        console.error('Error processing file:', error.message);
        process.exitCode = 1; // Set exit code to indicate an error
    }
}
  
module.exports = {
    processMarkdownFile,
    validateCommandLineArguments
};