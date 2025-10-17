#!/usr/bin/env python3
"""
Simple HTTP server with clean URL support for melodiesforhumanity.org
Serves .html files for clean URLs (e.g., /start serves start.html)
"""

import http.server
import socketserver
import os
from urllib.parse import urlparse

PORT = 8000

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        # Remove trailing slash
        if path.endswith('/') and path != '/':
            path = path[:-1]

        # If it's the root, serve index.html
        if path == '/' or path == '':
            self.path = '/index.html'
        # If it doesn't have an extension and doesn't exist, try adding .html
        elif '.' not in os.path.basename(path):
            html_path = path + '.html'
            # Check if the .html file exists
            if os.path.exists('.' + html_path):
                self.path = html_path

        # Serve the file
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever()
