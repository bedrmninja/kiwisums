import os
import http.server
import socketserver

port = int(os.environ.get("PORT", "8000"))
handler = http.server.SimpleHTTPRequestHandler


class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 64


with ThreadingHTTPServer(("", port), handler) as httpd:
    print(f"Serving on port {port}")
    httpd.serve_forever()
