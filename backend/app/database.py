import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Handle passwords with @ or special characters in postgresql URL
if "postgresql://" in db_url and "@" in db_url:
    try:
        scheme, rest = db_url.split("://", 1)
        if "@" in rest:
            user_pass, host_db = rest.rsplit("@", 1)
            if ":" in user_pass:
                user, password = user_pass.split(":", 1)
                password_encoded = urllib.parse.quote_plus(urllib.parse.unquote(password))
                db_url = f"{scheme}://{user}:{password_encoded}@{host_db}"
    except Exception as err:
        print(f"[PEGMA DB URL PARSE WARNING] {err}")

# Handle SQLite specific connect args
connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

engine = create_engine(
    db_url, 
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
