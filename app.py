from flask import *

import time
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/qr-space')
def qr_space():
    return render_template('qr_space.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/tutorial')
def tutorial():
    return render_template('tutorial.html')


@app.route('/data')
def data():
    return render_template('data.html')

@app.route('/feedback')
def feedback():
    return render_template('feedback.html')


@app.route('/_reload')
def reload():
    template_dir = os.path.join(app.root_path, "templates")

    # record last known mtimes for all templates
    last_mtimes = {}

    # initial scan
    for filename in os.listdir(template_dir):
        if filename.endswith(".html"):
            path = os.path.join(template_dir, filename)
            last_mtimes[path] = os.path.getmtime(path)

    def stream():
        while True:
            time.sleep(0.5)

            for path in list(last_mtimes.keys()):
                try:
                    mtime = os.path.getmtime(path)
                except FileNotFoundError:
                    continue

                if mtime > last_mtimes[path]:
                    last_mtimes[path] = mtime
                    yield "data: reload\n\n"

            # detect newly added template files
            for filename in os.listdir(template_dir):
                if filename.endswith(".html"):
                    path = os.path.join(template_dir, filename)
                    if path not in last_mtimes:
                        last_mtimes[path] = os.path.getmtime(path)
                        yield "data: reload\n\n"

    return Response(stream(), mimetype='text/event-stream')



if __name__ == '__main__':
    app.run()