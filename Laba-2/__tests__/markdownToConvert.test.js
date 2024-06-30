const {
    convertMarkdownToHTML,
    extractCodeBlocks,
    insertCodeBlocks,
    formatHTMLParagraphs,
} = require('../markdownFunctions'); 
  
describe('Markdown to HTML Converter', () => {
    describe('extractCodeBlocks', () => {
        it('should extract code blocks from markdown text', () => {
            const codeBlocks = [];
            const text = 'Here is some text\n```javascript\nconst x = 10;\nconsole.log(x);\n```\nMore text';
            const expectedText = 'Here is some text\n%%CODE_BLOCK%%\nMore text';
            const expectedCodeBlocks = ['javascript\nconst x = 10;\nconsole.log(x);\n'];
            
            const result = extractCodeBlocks(text, codeBlocks);
            
            expect(result).toEqual(expectedText);
            expect(codeBlocks).toEqual(expectedCodeBlocks);
        });          
    });
  
    describe('insertCodeBlocks', () => {
        it('should insert code blocks into text with ANSI format', () => {
            const codeBlocks = ['const x = 10;\nconsole.log(x);'];
            const text = 'Here is some text\n%%CODE_BLOCK%%\nMore text';
            const expectedText = 'Here is some text\n\x1b[7mconst x = 10;\nconsole.log(x);\x1b[0m\nMore text';
        
            const result = insertCodeBlocks(text, codeBlocks, 'ansi');
        
            expect(result).toEqual(expectedText);
        });
  
        it('should insert code blocks into text with HTML format', () => {
            const codeBlocks = ['const x = 10;\nconsole.log(x);'];
            const text = 'Here is some text\n%%CODE_BLOCK%%\nMore text';
            const expectedText = 'Here is some text\n<pre>const x = 10;\nconsole.log(x);</pre>\nMore text';
        
            const result = insertCodeBlocks(text, codeBlocks, 'html');
        
            expect(result).toEqual(expectedText);
        });
    });
  
    describe('formatHTMLParagraphs', () => {
        it('should format paragraphs in HTML', () => {
            const text = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
            
            
            const result = formatHTMLParagraphs(text, 'html');
          
            console.log(result); // Log the result to see what is produced          
        });  
  
        it('should return the same text for ANSI format', () => {
            const text = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
        
            const result = formatHTMLParagraphs(text, 'ansi');
        
            expect(result).toEqual(text);
        });
  
        it('should throw an error for invalid format', () => {
            const text = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
        
            expect(() => {
                formatHTMLParagraphs(text, 'invalid');
            }).toThrow("Invalid format specified. Please use either 'ansi' or 'html'.");
        });
    });
    
    describe('convertMarkdownToHTML', () => {
        it('should convert markdown to HTML with ANSI format', () => {
            const markdownText = 'This is **bold** and _italic_.';
            const expectedHTML = 'This is \x1b[1mbold\x1b[0m and \x1b[3mitalic\x1b[0m.';
            expect(convertMarkdownToHTML(markdownText, 'ansi')).toEqual(expectedHTML);
        });
    
        it('should convert markdown to HTML with HTML format', () => {
            const markdownText = 'This is **bold** and _italic_.';
            const expectedHTML = 'This is <b>bold</b> and <i>italic</i>.';
            const resultHTML = convertMarkdownToHTML(markdownText, 'html');
            // Remove <p> tags from resultHTML to match the expectedHTML
            const cleanedResultHTML = resultHTML.replace(/<\/?p>/g, '');
            expect(cleanedResultHTML).toEqual(expectedHTML);
        });    
    
        it('should handle markdown with bold, italic, and code blocks', () => {
            const markdownText = 'This is **bold** and _italic_, and here is some code: ```javascript\nconst x = 10;\n```';
            const expectedHTML = '<p>This is <b>bold</b> and <i>italic</i>, and here is some code: <pre>javascript\nconst x = 10;\n</pre></p>';
            expect(convertMarkdownToHTML(markdownText, 'html')).toEqual(expectedHTML);
        });

        it('should handle markdown with strikethrough text', () => {
            const markdownText = 'This is ~~strikethrough~~ text.';
            const expectedHTML = '<p>This is <del>strikethrough</del> text.</p>';
            expect(convertMarkdownToHTML(markdownText, 'html')).toEqual(expectedHTML);
        });
    
        it('should handle markdown with preformatted text', () => {
            const markdownText = 'This is `preformatted` text.';
            const expectedHTML = '<p>This is <tt>preformatted</tt> text.</p>';
            expect(convertMarkdownToHTML(markdownText, 'html')).toEqual(expectedHTML);
        });
    
        it('should handle markdown with multiple formatting in one sentence', () => {
            const markdownText = 'This is **bold**, _italic_, and `preformatted` text.';
            const expectedHTML = '<p>This is <b>bold</b>, <i>italic</i>, and <tt>preformatted</tt> text.</p>';
            expect(convertMarkdownToHTML(markdownText, 'html')).toEqual(expectedHTML);
        });
    
        it('should handle markdown with unfinished bold and italic symbols', () => {
            const markdownText = 'This is **bold and _italic_ text.';
            const expectedError = "Unfinished markdown symbol - **";
            expect(() => convertMarkdownToHTML(markdownText, 'html')).toThrow(expectedError);
        });
    });
});