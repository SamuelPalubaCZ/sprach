#!/usr/bin/env python3
import http.server
import socketserver
import os
import re
from urllib.parse import unquote

class SprachHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="/app", **kwargs)
    
    def do_GET(self):
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Convert .md requests to .html
        if self.path.endswith('.md'):
            self.path = self.path[:-3] + '.html'
        
        # Handle Jekyll-style pages
        if self.path.endswith('.html'):
            md_file = self.path[:-5] + '.md'
            if os.path.exists(f"/app{md_file}"):
                self.serve_jekyll_page(md_file)
                return
        
        # Serve static files normally
        super().do_GET()
    
    def serve_jekyll_page(self, md_path):
        try:
            with open(f"/app{md_path}", 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract frontmatter and content
            frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
            if frontmatter_match:
                frontmatter = frontmatter_match.group(1)
                markdown_content = frontmatter_match.group(2)
                
                # Extract title from frontmatter
                title_match = re.search(r'^title:\s*(.*)$', frontmatter, re.MULTILINE)
                title = title_match.group(1).strip() if title_match else "Sprach Machine"
            else:
                markdown_content = content
                title = "Sprach Machine"
            
            # Load layout
            try:
                with open("/app/_layouts/default.html", 'r', encoding='utf-8') as f:
                    layout = f.read()
                
                # Simple template replacement
                layout = layout.replace('{{ content }}', markdown_content)
                layout = layout.replace('{{ site.title | default: site.github.repository_name }}', title)
                layout = layout.replace('{{ site.description | default: site.github.project_tagline }}', 'Cold War Numbers Station Simulator')
                
                # Fix asset paths
                layout = re.sub(r"{{ '/assets/([^']+)' \| relative_url }}", r'/assets/\1', layout)
                layout = re.sub(r"{{ '/([^']+)\.html' \| relative_url }}", r'/\1.html', layout)
                layout = re.sub(r"{{ '/' \| relative_url }}", r'/', layout)
                
                html_content = layout
            except:
                html_content = f"<html><head><title>{title}</title></head><body>{markdown_content}</body></html>"
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Content-length', len(html_content.encode('utf-8')))
            self.end_headers()
            self.wfile.write(html_content.encode('utf-8'))
            
        except Exception as e:
            print(f"Error serving {md_path}: {e}")
            self.send_error(404, f"File not found: {md_path}")

PORT = 3000
with socketserver.TCPServer(("0.0.0.0", PORT), SprachHandler) as httpd:
    print(f"Sprach Machine server running on port {PORT}")
    httpd.serve_forever()