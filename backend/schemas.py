from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class AccidentCreate(BaseModel):
    incident_date: date
    incident_time: time
    road_type: str
    location_zone: str
    weather: str
    road_condition: str
    stray_animals: bool = False
    wrong_way: bool = False
    overloaded: bool = False
    dui_alcohol: bool = False
    helmet_seatbelt: bool = False
    vehicle_type: str
    driver_age: Optional[int] = None
    severity: str
    ambulance_eta: Optional[str] = None
