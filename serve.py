import os, sys, threading, socket
from http.server import HTTPServer, SimpleHTTPRequestHandler

web_dir = os.path.abspath(os.path.dirname(__file__))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=web_dir, **kwargs)

    def log_message(self, format, *args):
        pass

class IPv6Server(HTTPServer):
    address_family = socket.AF_INET6

def run_v4():
    try:
        s = HTTPServer(('127.0.0.1', 8088), Handler)
        s.serve_forever()
    except Exception as e:
        print('v4 error:', e, flush=True)

def run_v6():
    try:
        s = IPv6Server(('::1', 8088), Handler)
        s.serve_forever()
    except Exception as e:
        print('v6 error:', e, flush=True)

if __name__ == '__main__':
    t1 = threading.Thread(target=run_v4, daemon=True)
    t2 = threading.Thread(target=run_v6, daemon=True)
    t1.start()
    t2.start()
    print("Serving on both http://localhost:8088 and http://127.0.0.1:8088", flush=True)
    t1.join()
