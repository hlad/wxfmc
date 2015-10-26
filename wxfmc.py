import xpc
import threading
from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit, send
from flask import copy_current_request_context

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
app.debug = True
socketio = SocketIO(app)

client = xpc.XPlaneConnect(timeout= 1000)


panels = ["xfmc/Panel_1",
    "xfmc/Panel_2",
    "xfmc/Panel_3",
    "xfmc/Panel_4",
    "xfmc/Panel_5",
    "xfmc/Panel_6",
    "xfmc/Panel_7",
    "xfmc/Panel_8",
    "xfmc/Panel_9",
    "xfmc/Panel_10",
    "xfmc/Panel_11",
    "xfmc/Panel_12",
    "xfmc/Upper",
    "xfmc/Scratch",
    "xfmc/Messages"

]

old_messages = {}
messages = {}

status = None
old_status = None
status_dict = {}


for x in panels:
    messages[x]=''

@app.route("/")
def default():
    global messages
    global status_dict
    return render_template('wxfmc.html',messages=messages, status=status_dict)

@socketio.on('key_event')
def key_pressed(message):
    k = int(message['data'])
    client.sendDREF("xfmc/Keypath", k)

def print_messages():
    global messages
    for k in messages:
	print messages[k]

def update_messages():
    global messages
    values = client.getDREFs(panels)
    i = 0
    for s in values:
	o = unicode(toString(s))
	messages[panels[i]]=o
	i=i+1

def update_status():
    global status
    status= int(client.getDREF('xfmc/Status')[0])

def send_messages():
    #for k, v in messages.iteritems():
    #	t=v.split('/',1)[1]
    #	u=t.split(';')
    socketio.emit('send_messages',  messages)

def send_status():
    socketio.emit('send_status',  status_dict)

	
    
def forever():
    global old_messages
    global messages
    global status
    global old_status
    while True:
	update_messages()
	if old_messages!=messages:
	    old_messages=dict(messages)
	    send_messages()
	update_status()
	if old_status!=status :
	    old_status=status
	    status_dict['XFMC'] = 1 if status&1!=0 else 0
	    status_dict['LNAV'] = 1 if status&2!=0 else 0
	    status_dict['VNAV'] = 1 if status&4!=0 else 0
	    status_dict['ATH'] = 1 if status&8!=0 else 0
	    status_dict['KEYB'] = 1 if status&16!=0 else 0
	    status_dict['Execute'] = 1 if status&32!=0 else 0
	    send_status()

def toString(a):
    s=u''
    for i in a:
	if i<0:
	    i=i+128
	a=chr(int(i))
	if i==30:		#correct degree character
	    a=u'\u00b0'
	s=s+a
    return s



if __name__ == "__main__":
    thread = threading.Thread(target=forever, args=())
    thread.daemon = True                            # Daemonize thread
    thread.start()
    socketio.run(app,host='0.0.0.0')

