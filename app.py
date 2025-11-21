from flask import *

import time
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/_reload')
def reload():
    def stream():
        path = 'templates/index.html'
        last_mtime = os.path.getmtime(path)
        while True:
            time.sleep(0.5)
            current_mtime = os.path.getmtime(path)
            if current_mtime > last_mtime:
                last_mtime = current_mtime
                yield "data: reload\n\n"
    return Response(stream(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
