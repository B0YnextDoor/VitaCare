from typing import Any, Dict, Union
from fastapi import HTTPException
from schemas.auth import PatientUpdate, UserSignUp


ProfileType = Union[PatientUpdate, UserSignUp]


def parse_profile(data: Dict[str, Any]) -> ProfileType:
    try:
        if "gender" in data:
            return PatientUpdate(**data)
        return UserSignUp(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=e.errors())
