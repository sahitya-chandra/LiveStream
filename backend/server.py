from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

client = MongoClient('mongodb://localhost:27017/')
db = client['overlayDB']
overlays = db['overlays']

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    data = request.json
    overlays.insert_one(data)
    return jsonify({'message': 'Overlay created successfully'}), 201

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    all_overlays = [{**overlay, '_id': str(overlay['_id'])} for overlay in overlays.find()]
    return jsonify(all_overlays), 200

@app.route('/api/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    data = request.json
    overlays.update_one({'_id': ObjectId(id)}, {'$set': data})
    return jsonify({'message': 'Overlay updated successfully'}), 200

@app.route('/api/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    overlays.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Overlay deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)
