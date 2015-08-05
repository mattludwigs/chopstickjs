#! /usr/bin/python
# Must use python v2.7.x, not python 3

import SimpleHTTPServer
import SocketServer

PORT = 3000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving on port", PORT

httpd.serve_forever()