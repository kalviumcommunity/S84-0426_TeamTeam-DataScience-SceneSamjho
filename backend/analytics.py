import pandas as pd
import datetime

def _get_time_bucket(time_obj: datetime.time) -> str:
    """Helper function to map a time object to a specific time of day bucket."""
    hour = time_obj.hour
    if 6 <= hour < 12:
        return "Morning (6AM-12PM)"
    elif 12 <= hour < 16:
        return "Afternoon (12PM-4PM)"
    elif 16 <= hour < 20:
        return "Evening (4PM-8PM)"
    else:
        return "Night (8PM-6AM)"

def get_kpis(df: pd.DataFrame) -> dict:
    """Calculates top-level KPI metrics."""
    if df.empty:
        return {}
        
    total_accidents = int(len(df))
    total_fatalities = int(len(df[df['severity'] == 'Fatal']))
    
    top_hazard_weather = str(df['weather'].mode()[0]) if not df['weather'].empty else "N/A"
    
    # Try to find the most common hazard that isn't 'Dry'
    hazard_df = df[df['road_condition'] != 'Dry']
    if not hazard_df.empty:
        top_hazard_road = str(hazard_df['road_condition'].mode()[0])
    else:
        top_hazard_road = "N/A"
        
    dui_accidents = int(df['dui_alcohol'].sum())
    dui_percentage = round((dui_accidents / total_accidents) * 100, 1) if total_accidents > 0 else 0
        
    return {
        "total_accidents": total_accidents,
        "total_fatalities": total_fatalities,
        "top_hazard_weather": top_hazard_weather,
        "top_hazard_road": top_hazard_road,
        "dui_percentage": dui_percentage
    }

def get_time_trends(df: pd.DataFrame) -> list:
    """Groups accidents by time bucket and severity for Recharts line chart."""
    if df.empty:
        return []
    
    # Create a new column mapping time to our designated buckets
    df['time_bucket'] = df['incident_time'].apply(_get_time_bucket)
    
    # Group by bucket and severity, then count occurrences
    trend_df = df.groupby(['time_bucket', 'severity']).size().unstack(fill_value=0).reset_index()
    
    # Calculate a 'total' column per bucket
    severities = [col for col in trend_df.columns if col != 'time_bucket']
    trend_df['total'] = trend_df[severities].sum(axis=1)
    
    # Convert Dataframe to list of dictionaries (JSON friendly format)
    return trend_df.to_dict(orient='records')

def get_indian_context(df: pd.DataFrame) -> dict:
    """Calculates correlations specific to localized Indian road hazards."""
    if df.empty:
        return {}
        
    stray_animals_accidents = int(df['stray_animals'].sum())
    wrong_way_accidents = int(df['wrong_way'].sum())
    pothole_related = int(len(df[df['road_condition'] == 'Potholes']))
    
    # Distribution of severity for wrong-way driving
    wrong_way_df = df[df['wrong_way'] == True]
    severity_dist_ww = wrong_way_df['severity'].value_counts().to_dict()
    
    # Impact of weather conditions
    weather_dist = df['weather'].value_counts().to_dict()
    
    # Vehicle Types
    vehicle_types = df['vehicle_type'].value_counts().to_dict()
    
    # Driver Age Demographics
    bins = [0, 25, 40, 60, 100]
    labels = ['Under 25', '26-40', '41-60', 'Over 60']
    df['age_group'] = pd.cut(df['driver_age'], bins=bins, labels=labels, right=True)
    age_dist = df['age_group'].value_counts().to_dict()
    
    # Safety Gear vs Severity
    safety_crosstab = pd.crosstab(df['helmet_seatbelt'], df['severity']).to_dict(orient='index')
    safety_gear_impact = {("Safety Gear Used" if k else "No Safety Gear"): v for k, v in safety_crosstab.items()}
    
    # Ambulance ETA
    eta_dist = df['ambulance_eta'].value_counts().to_dict()
    
    return {
        "stray_animals_accidents": stray_animals_accidents,
        "wrong_way_accidents": wrong_way_accidents,
        "pothole_related": pothole_related,
        "severity_distribution_wrong_way": severity_dist_ww,
        "weather_impact": weather_dist,
        "vehicle_types": vehicle_types,
        "age_distribution": age_dist,
        "safety_gear_impact": safety_gear_impact,
        "ambulance_eta_dist": eta_dist
    }
