from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from services.bill.bill import BillService
from schemas.bill import UpdateBill


billRouter = APIRouter(prefix="/bills", tags=["bills"])


@billRouter.get("/")
@inject
async def get_bills(access_token: str | None = Cookie(default=None),
                    refresh_token: str | None = Cookie(default=None),
                    service: BillService = Depends(Provide[Container.bill_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, service.getAll)
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@billRouter.get("/id")
@inject
async def get_bill_by_id(id: int,
                         access_token: str | None = Cookie(default=None),
                         refresh_token: str | None = Cookie(default=None),
                         service: BillService = Depends(Provide[Container.bill_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    bill = service.getById(id)
    if bill is None:
        status_code = 400
        bill = {"error": "not found"}
    return returnResponse(JSONResponse, access, refresh, bill, status_code)


@billRouter.get("/status")
@inject
async def get_bills_by_status(status: int,
                              access_token: str | None = Cookie(default=None),
                              refresh_token: str | None = Cookie(default=None),
                              service: BillService = Depends(Provide[Container.bill_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.getByStatusId(status), role=[1, 3])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@billRouter.get("/user")
@inject
async def get_user_bills(user: int | None = None,
                         access_token: str | None = Cookie(default=None),
                         refresh_token: str | None = Cookie(default=None),
                         service: BillService = Depends(Provide[Container.bill_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    if content['role'] == 3:
        user = content['user']
    bills = service.getByUserId(user)
    if bills is None or type(bills) is str:
        status_code = 400
        bills = {"error": bills}
    return returnResponse(JSONResponse, access, refresh, bills, status_code)


@billRouter.put("/")
@inject
async def update_bill_status(id: int, data: UpdateBill,
                             access_token: str | None = Cookie(default=None),
                             refresh_token: str | None = Cookie(default=None),
                             service: BillService = Depends(Provide[Container.bill_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    upd_bill = service.update(id, data.status_id)
    if type(upd_bill) is str:
        status_code = 400
        upd_bill = {"error": upd_bill}
    return returnResponse(JSONResponse, access, refresh, upd_bill, status_code)
