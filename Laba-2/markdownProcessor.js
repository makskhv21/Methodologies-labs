'use strict';

const fs = require('fs');
const {
  convertMarkdownToHTML,
} = require('./markdownFunctions');

function validateCommandLineArguments(argv) {
  // Define valid lengths for command-line arguments
  if (argv.length === 5 && argv[3] !== '--format') {
      throw new Error("Invalid format of command-line arguments. If providing 5 arguments, the 4th argument should be '--format'.");
  }
}
    
function processMarkdownFile(markdownFilePath, format = 'ansi') {
    try {
        // Check if the file exists
        if (!fs.existsSync(markdownFilePath)) {
            throw new Error(`File not found: ${markdownFilePath}`);
        }

        // Read the markdown content from the file
        const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');

        // Convert markdown to HTML or text with tags based on the format flag
        let outputContent;
        if (format === 'html') {
            outputContent = convertMarkdownToHTML(markdownContent, 'html');
        } else if (format === 'text') {
            outputContent = markdownContent;
        } else {
            outputContent = convertMarkdownToHTML(markdownContent, 'ansi');
        }
        // Output the HTML content
        console.log(outputContent);
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