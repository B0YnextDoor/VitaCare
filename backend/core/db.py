from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from contextlib import AbstractContextManager, contextmanager
from typing import Any, Generator


class Database:
    def __init__(self, db_url: str) -> None:
        self._engine = create_engine(db_url, echo=True)
        self._session_maker = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self._engine,
        )

    @contextmanager
    def session(self) -> Generator[AbstractContextManager[Session], Any, Any]:
        session: Session = self._session_maker()
        try:
            yield session
        except Exception as e:
            print(e)
            session.rollback()
            raise e
        finally:
            session.close()
