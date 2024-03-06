'use strict'

function validateHTMLStructure(markdownText) {
  const sanitizedTags = (markdownText.match(/<\/?[^>]+>/g) || []).map(tag => tag.replace('/', ''));

  for (let i = 0; i < sanitizedTags.length; i += 2) {
    if (sanitizedTags[i] !== sanitizedTags[i + 1]) {
      throw new Error("Mismatched HTML tags. Check for nesting issues.");
    }
  }
}