"use strict"

const {processMarkdownFile, validateCommandLineArguments} = require('./markdownProcessor')

function runMarkdownConversion() {
  try {
    const { argv } = process;

    validateCommandLineArguments(argv);
    const markdownFilePath = argv[2];
    processMarkdownFile(markdownFilePath);

  } catch (error) {
    console.error('Error during processing:', error.message);
    process.exit(1);
  }
}
  
runMarkdownConversion();