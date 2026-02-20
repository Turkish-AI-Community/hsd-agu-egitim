import json
import logging
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "chat_history.db"

_conn: sqlite3.Connection | None = None


def init_db():
    global _conn
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    _conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    _conn.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)
    _conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_session ON chat_messages(session_id)"
    )
    # Migrate old schema: drop single-row-per-session table so it gets recreated with auto-increment id
    cols = [r[1] for r in _conn.execute("PRAGMA table_info(prediction_context)").fetchall()]
    if cols and "id" not in cols:
        _conn.execute("DROP TABLE prediction_context")

    _conn.execute("""
        CREATE TABLE IF NOT EXISTS prediction_context (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            inputs TEXT NOT NULL,
            result TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)
    _conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_pred_session ON prediction_context(session_id)"
    )
    _conn.commit()


def save_message(session_id: str, role: str, content: str):
    if _conn is None:
        return
    _conn.execute(
        "INSERT INTO chat_messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (session_id, role, content, datetime.now(timezone.utc).isoformat()),
    )
    _conn.commit()


def get_history(session_id: str, limit: int = 20) -> list[dict]:
    if _conn is None:
        return []
    rows = _conn.execute(
        "SELECT role, content, timestamp FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT ?",
        (session_id, limit),
    ).fetchall()
    return [
        {"role": r[0], "content": r[1], "timestamp": r[2]}
        for r in reversed(rows)
    ]


def save_prediction(session_id: str, inputs: dict, result: dict):
    if _conn is None:
        return
    _conn.execute(
        "INSERT INTO prediction_context (session_id, inputs, result, timestamp) VALUES (?, ?, ?, ?)",
        (session_id, json.dumps(inputs, ensure_ascii=False), json.dumps(result, ensure_ascii=False),
         datetime.now(timezone.utc).isoformat()),
    )
    _conn.commit()
    logger.info("Prediction saved for session %s: %s (prob=%.4f)",
                session_id[:8], result.get("prediction"), result.get("probability", 0))


def get_latest_prediction(session_id: str) -> dict | None:
    if _conn is None:
        return None
    row = _conn.execute(
        "SELECT inputs, result FROM prediction_context WHERE session_id = ? ORDER BY id DESC LIMIT 1",
        (session_id,),
    ).fetchone()
    if not row:
        logger.info("No prediction context for session %s", session_id[:8])
        return None
    data = {"inputs": json.loads(row[0]), "result": json.loads(row[1])}
    logger.info("Loaded prediction for session %s: %s (prob=%.4f)",
                session_id[:8], data["result"].get("prediction"), data["result"].get("probability", 0))
    return data
