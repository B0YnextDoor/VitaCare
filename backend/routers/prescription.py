from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from schemas.prescription import Prescription
from services.med.prescription import PrescriptionService


prescRouter = APIRouter(prefix="/prescription", tags=["prescription"])


@prescRouter.get("/")
@inject
async def get_prescriptions(access_token: str | None = Cookie(default=None),
                            refresh_token: str | None = Cookie(default=None),
                            service: PrescriptionService = Depends(Provide[Container.prescr_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _: service.getAll())
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@prescRouter.get("/id")
@inject
async def get_prescription_by_record(id: int,
                                     access_token: str | None = Cookie(
                                         default=None),
                                     refresh_token: str | None = Cookie(
                                         default=None),
                                     service: PrescriptionService = Depends(Provide[Container.prescr_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.getByRecord(id), role=[1, 2, 3])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@prescRouter.post("/")
@inject
async def create_prescription(data: Prescription,
                              access_token: str | None = Cookie(default=None),
                              refresh_token: str | None = Cookie(default=None),
                              service: PrescriptionService = Depends(Provide[Container.prescr_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[2])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_prescr = service.create(data.dosage, data.medication_id)
    if type(new_prescr) is str:
        status_code = 400
        new_prescr = {"error": new_prescr}
    return returnResponse(JSONResponse, access, refresh, new_prescr, status_code)
