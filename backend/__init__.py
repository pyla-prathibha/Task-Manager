from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.config.Config')
    migrate = Migrate(app, db)

    
    db.init_app(app)
    CORS(app, supports_credentials=True)
    
    with app.app_context():
        from . import models, routes
        db.create_all()  # Optionally create tables on startup
    return app
