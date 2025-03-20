from flask import request, jsonify, session, current_app as app
from .models import User, Task
from . import db

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists."}), 400
    
    user = User(username=username, password=password)  # Hash in real apps!
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully."}), 201

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if not user or user.password != password:
        return jsonify({"error": "Invalid username or password."}), 401

    # Store user id in session
    session['user_id'] = user.id
    return jsonify({"message": "Logged in successfully.", "user": user.to_dict()})

# Logout endpoint
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully."})

# Helper function to require login
def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required."}), 401
        return f(*args, **kwargs)
    return decorated_function

# Task endpoints (only accessible if logged in)
@app.route('/api/tasks', methods=['GET'])
@login_required
def get_tasks():
    user_id = session['user_id']
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
@login_required
def add_task():
    data = request.get_json()
    print("Received data:", data)  # Debug print
    user_id = session['user_id']
    new_task = Task(
        title=data['title'], 
        description=data.get('description', ''),
        user_id=user_id
    )
    db.session.add(new_task)
    db.session.commit()
    print("New task added:", new_task.to_dict())  # Debug print
    return jsonify(new_task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    user_id = session['user_id']
    # Ensure the task belongs to the logged-in user
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    data = request.get_json()

    # Update fields if new data is provided; otherwise, keep the existing value
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.completed = data.get('completed', task.completed)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error updating task", "message": str(e)}), 500

    return jsonify(task.to_dict())


@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    user_id = session['user_id']
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})
