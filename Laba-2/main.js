"use strict"

const {processMarkdownFile, validateCommandLineArguments} = require('./markdownProcessor')

function runMarkdownConversion() {
  try {
    const { argv } = process;

    validateCommandLineArguments(argv);
    const markdownFilePath = argv[2];
    const formatIndex = argv.indexOf('--format');
    const format = formatIndex !== -1 ? argv[formatIndex + 1] : 'ansi';
    
    // Process Markdown file with the specified format
    processMarkdownFile(markdownFilePath, format);
  } catch (error) {
    console.error('Error during processing:', error.message);
    process.exit(1);
  }
}
  
runMarkdownConversion();