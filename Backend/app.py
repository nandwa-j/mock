from flask import Flask, jsonify, request

app = Flask(__name__)

# Example cart data structure
cart = [
    {"produceId": 1, "name": "Tomatoes", "quantity": 3, "price": 100},
    {"produceId": 2, "name": "Lettuce", "quantity": 2, "price": 50}
]

@app.route('/api/cart', methods=['GET'])
def get_cart():
    return jsonify(cart)

@app.route('/api/cart/<int:produce_id>', methods=['PUT'])
def update_cart(produce_id):
    data = request.json
    for item in cart:
        if item['produceId'] == produce_id:
            item['quantity'] = data['quantity']
    return jsonify({'message': 'Cart updated', 'cart': cart})

@app.route('/api/cart/<int:produce_id>', methods=['DELETE'])
def remove_from_cart(produce_id):
    global cart
    cart = [item for item in cart if item['produceId'] != produce_id]
    return jsonify({'message': 'Item removed from cart', 'cart': cart})

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.json
    cart = data['cart']  # Assuming this is the submitted cart
    return jsonify({'message': 'Checkout complete', 'cart': cart})

if __name__ == '__main__':
    app.run(debug=True)
