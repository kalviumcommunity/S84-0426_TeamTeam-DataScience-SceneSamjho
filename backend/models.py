import uuid
from sqlalchemy import Column, String, Boolean, Integer, Date, Time
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class Accident(Base):
    __tablename__ = "accidents"

    incident_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_date = Column(Date, nullable=False)
    incident_time = Column(Time, nullable=False)
    
    # Location Metadata
    road_type = Column(String(50), nullable=False)
    location_zone = Column(String(50), nullable=False)
    
    # Environmental Data
    weather = Column(String(50), nullable=False)
    road_condition = Column(String(50), nullable=False)
    
    # Human & Localized Factors
    stray_animals = Column(Boolean, default=False)
    wrong_way = Column(Boolean, default=False)
    overloaded = Column(Boolean, default=False)
    dui_alcohol = Column(Boolean, default=False)
    helmet_seatbelt = Column(Boolean, default=False)
    
    # Entity Info
    vehicle_type = Column(String(50), nullable=False)
    driver_age = Column(Integer, nullable=True)
    
    # Outcome Metrics
    severity = Column(String(50), nullable=False)
    ambulance_eta = Column(String(50), nullable=True)