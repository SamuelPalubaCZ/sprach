const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Simple template renderer for Jekyll-like .md files
function renderMarkdown(content, layout) {
    // Extract frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return content;
    
    const frontmatter = match[1];
    const markdownContent = match[2];
    
    // Read layout file
    const layoutPath = path.join(__dirname, '_layouts', 'default.html');
    let layoutContent = '';
    
    try {
        layoutContent = fs.readFileSync(layoutPath, 'utf8');
    } catch (err) {
        return markdownContent;
    }
    
    // Simple replacement
    return layoutContent.replace('{{ content }}', markdownContent);
}

// Route handler for pages
app.get('/', (req, res) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, 'index.md'), 'utf8');
        const rendered = renderMarkdown(content, 'default');
        res.send(rendered);
    } catch (err) {
        res.status(404).send('Page not found');
    }
});

app.get('/:page.html', (req, res) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, `${req.params.page}.md`), 'utf8');
        const rendered = renderMarkdown(content, 'default');
        res.send(rendered);
    } catch (err) {
        res.status(404).send('Page not found');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Sprach Machine server running on port ${port}`);
});