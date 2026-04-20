import asyncio
import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from database import AsyncSessionLocal
from models import Accident

fake = Faker('en_IN')  # Use Indian locale for Faker

# --- Constants & Weights for Realistic Data ---

CITIES_ZONES = [
    "Mumbai - Andheri East (Commercial)",
    "Mumbai - Western Express Highway",
    "Delhi - Ring Road (Highway)",
    "Delhi - Connaught Place (Commercial)",
    "Bengaluru - Outer Ring Road",
    "Bengaluru - Koramangala (Commercial)",
    "Chennai - Silk Board Junction",
    "Chennai - OMR (Highway)",
    "Hyderabad - Electronic City (Commercial)",
    "Pune - HITEC City (Commercial)"
]

ROAD_TYPES = ["City Junction", "Narrow Lane", "Highway", "Service Lane", "Flyover"]
WEATHER_CONDITIONS = ["Clear", "Rain", "Fog/Smog", "Overcast"]
ROAD_CONDITIONS = ["Dry", "Wet", "Potholes", "Unmarked Breaker", "Under Construction"]
VEHICLE_TYPES = ["Two-wheeler", "Car", "Auto-rickshaw", "Bus", "Truck", "Pedestrian"]
SEVERITY_LEVELS = ["Property Damage", "Minor Injury", "Severe Injury", "Fatal"]
AMBULANCE_ETAS = ["< 15 mins", "15-30 mins", "> 30 mins", "N/A"]

def generate_random_accident() -> Accident:
    """Generates a single realistic accident record with weighted probabilities."""
    
    # Base Randoms
    incident_datetime = fake.date_time_between(start_date='-2y', end_date='now')
    weather = random.choices(WEATHER_CONDITIONS, weights=[60, 20, 15, 5])[0]
    
    # Correlate Road Condition with Weather
    if weather == "Rain":
        road_condition = random.choices(ROAD_CONDITIONS, weights=[5, 60, 30, 5, 0])[0]
    else:
        road_condition = random.choices(ROAD_CONDITIONS, weights=[70, 5, 10, 10, 5])[0]

    # Entity info
    vehicle_type = random.choices(VEHICLE_TYPES, weights=[45, 30, 10, 5, 8, 2])[0]
    
    # Driver Age (skewed towards younger for certain vehicles)
    if vehicle_type in ["Two-wheeler", "Car"]:
        driver_age = int(random.triangular(18, 65, 25))
    else:
        driver_age = int(random.triangular(21, 60, 35))

    # Contextual Booleans
    stray_animals = random.choices([True, False], weights=[15, 85])[0]  # Common in India
    wrong_way = random.choices([True, False], weights=[20, 80])[0]
    overloaded = random.choices([True, False], weights=[25, 75])[0] if vehicle_type in ["Truck", "Auto-rickshaw", "Two-wheeler"] else False
    dui_alcohol = random.choices([True, False], weights=[10, 90])[0]
    
    helmet_seatbelt = random.choices([True, False], weights=[40, 60])[0] # Assuming low compliance for dummy data

    # Correlate Severity with Factors
    severity_weights = [40, 40, 15, 5] # Default: Prop Damage, Minor, Severe, Fatal
    if wrong_way or dui_alcohol or (vehicle_type == "Two-wheeler" and not helmet_seatbelt):
        severity_weights = [10, 30, 40, 20] # Higher chance of severe/fatal
    elif vehicle_type == "Truck" and weather in ["Rain", "Fog/Smog"]:
        severity_weights = [15, 25, 35, 25]

    severity = random.choices(SEVERITY_LEVELS, weights=severity_weights)[0]

    # Ambulance ETA
    if severity in ["Severe Injury", "Fatal"]:
        ambulance_eta = random.choices(["< 15 mins", "15-30 mins", "> 30 mins"], weights=[30, 50, 20])[0]
    else:
        ambulance_eta = "N/A"

    return Accident(
        incident_date=incident_datetime.date(),
        incident_time=incident_datetime.time(),
        road_type=random.choice(ROAD_TYPES),
        location_zone=random.choice(CITIES_ZONES),
        weather=weather,
        road_condition=road_condition,
        stray_animals=stray_animals,
        wrong_way=wrong_way,
        overloaded=overloaded,
        dui_alcohol=dui_alcohol,
        helmet_seatbelt=helmet_seatbelt,
        vehicle_type=vehicle_type,
        driver_age=driver_age,
        severity=severity,
        ambulance_eta=ambulance_eta
    )

async def seed_database(num_records: int = 100):
    """Inserts generated records into the database asynchronously."""
    print(f"Generating {num_records} dummy accident records...")
    
    async with AsyncSessionLocal() as session:
        # Create objects
        accidents = [generate_random_accident() for _ in range(num_records)]
        
        # Add to session
        session.add_all(accidents)
        
        try:
            await session.commit()
            print(f"✅ Successfully seeded {num_records} records into the database.")
        except Exception as e:
            await session.rollback()
            print(f"❌ Error seeding database: {e}")

if __name__ == "__main__":
    # Insert 4900 more records in chunks to create 5000 records
    asyncio.run(seed_database(4900))
