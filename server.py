import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class DualStackServer(HTTPServer):
    address_family = socket.AF_INET6
    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except Exception:
            pass
        return super().server_bind()

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    port = 8088
    try:
        server = DualStackServer(('::', port), SimpleHTTPRequestHandler)
        print(f"Dual-stack server running on port {port} at {web_dir}")
        server.serve_forever()
    except Exception as e:
        # Fallback to standard IPv4 if IPv6 dual-stack not supported
        print(f"Fallback to IPv4: {e}")
        from http.server import HTTPServer as StandardServer
        server = StandardServer(('0.0.0.0', port), SimpleHTTPRequestHandler)
        server.serve_forever()
