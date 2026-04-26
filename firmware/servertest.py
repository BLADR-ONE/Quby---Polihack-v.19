from flask import Flask, request
from datetime import datetime

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def debug_post():
    # Get current timestamp for the log
    now = datetime.now().strftime("%H:%M:%S")
    
    # Check if the request has JSON data
    data = request.get_json(silent=True)
    
    print(f"[{now}] --- Connection Detected! ---")
    if data:
        print(f"Data Received: {data}")
    else:
        print("Warning: Received a request but no JSON body was found.")
        print(f"Raw Data: {request.data}")
        
    return {"status": "received"}, 200

if __name__ == '__main__':
    print("Server starting...")
    print("Press Ctrl+C to stop the server.")
    # host='0.0.0.0' makes the server accessible to other devices (the ESP32)
    app.run(host='0.0.0.0', port=5000, debug=False)