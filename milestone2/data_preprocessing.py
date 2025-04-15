import pandas as pd

# We are interested in
CRIME_CATEGORIES = {
    "ASSAULT": [
        "BATTERY",
        "ASSAULT", 
        "ROBBERY", 
        "WEAPONS VIOLATION", 
        "HOMICIDE", 
        "INTIMIDATION"
    ],
    
    "SEX OFFENSE": [
        "SEX OFFENSE", 
        "CRIM SEXUAL ASSAULT", 
        "KIDNAPPING", 
        "CRIMINAL SEXUAL ASSAULT", 
        "STALKING"
    ],

    "THEFT": [
        "THEFT", 
        "CRIMINAL DAMAGE",  
        "MOTOR VEHICLE THEFT"
    ],

    "MINOR": [
        "NARCOTICS",
        "BURGLARY",
        "PROSTITUTION",
        "PUBLIC PEACE VIOLATION",
        "OBSCENITY",
        "PUBLIC INDECENCY",
        "ARSON"
    ],

    "NON STREET CRIME": [
        "OTHER OFFENSE",
        "DECEPTIVE PRACTICE",
        "CRIMINAL TRESPASS",
        "OFFENSE INVOLVING CHILDREN",
        "CONCEALED CARRY LICENSE VIOLATION",
        "NON-CRIMINAL",
        "OTHER NARCOTIC VIOLATION",
        "HUMAN TRAFFICKING",
        "NON - CRIMINAL",
        "RITUALISM",
        "NON-CRIMINAL (SUBJECT SPECIFIED)",
        "DOMESTIC VIOLENCE"
    ]
}

CRIME_SUBCATEGORIES = {
    
    "ASSAULT": [
        "BATTERY",
        "ASSAULT", 
        "ROBBERY", 
        "WEAPONS VIOLATION", 
        "HOMICIDE", 
        "INTIMIDATION"
    ],
    
    "SEX OFFENSE": [
        "SEX OFFENSE", 
        "CRIM SEXUAL ASSAULT", 
        "KIDNAPPING", 
        "CRIMINAL SEXUAL ASSAULT", 
        "STALKING"
    ],

    "THEFT": [
        "THEFT", 
        "CRIMINAL DAMAGE",  
        "MOTOR VEHICLE THEFT"
    ],

    "MINOR": [
        "NARCOTICS",
        "BURGLARY",
        "PROSTITUTION",
        "PUBLIC PEACE VIOLATION",
        "ARSON"
    ],

    "NON STREET CRIME": [
        "DECEPTIVE PRACTICE",
        "CRIMINAL TRESPASS",
        "HUMAN TRAFFICKING",
        "RITUALISM",
        "DOMESTIC VIOLENCE"
    ]
}

# Public transport-related locations
PUBLIC_TRANSPORTS = [
    'CTA BUS STOP',
    'VEHICLE NON-COMMERCIAL',
    'TAXICAB',
    'CTA BUS',
    'VEHICLE-COMMERCIAL',
    'CTA PLATFORM',
    'CTA TRAIN',
    'VEHICLE - DELIVERY TRUCK',
    'CTA TRACKS - RIGHT OF WAY',
    'OTHER COMMERCIAL TRANSPORTATION',
    'CTA STATION',
    'VEHICLE - OTHER RIDE SHARE SERVICE (E.G., UBER, LYFT)',
    'VEHICLE - COMMERCIAL',
    'CTA GARAGE / OTHER PROPERTY',
    'VEHICLE - OTHER RIDE SHARE SERVICE (E.G., LYFT, UBER, ETC.)',
    'CTA PARKING LOT / GARAGE / OTHER PROPERTY',
    'VEHICLE - OTHER RIDE SHARE SERVICE (LYFT, UBER, ETC.)',
    'VEHICLE - OTHER RIDE SERVICE',
]

AIRPORT = [
    'AIRPORT TERMINAL LOWER LEVEL - NON-SECURE AREA',
    'AIRPORT TERMINAL UPPER LEVEL - NON-SECURE AREA',
    'AIRPORT TERMINAL LOWER LEVEL - SECURE AREA',
    'AIRPORT TRANSPORTATION SYSTEM (ATS)',
    'AIRPORT EXTERIOR - SECURE AREA',
    'AIRPORT TERMINAL MEZZANINE - NON-SECURE AREA',
    'AIRPORT EXTERIOR - NON-SECURE AREA',
    'AIRPORT BUILDING NON-TERMINAL - SECURE AREA',
    'AIRPORT TERMINAL UPPER LEVEL - SECURE AREA',
    'AIRPORT/AIRCRAFT'
]



STORES = [
    'SMALL RETAIL STORE',
    'CAR WASH',
    'CLEANING STORE',
    'GROCERY FOOD STORE',
    'TAVERN / LIQUOR STORE',
    'MOVIE HOUSE / THEATER',
    'RESTAURANT',
    'CONVENIENCE STORE',
    'SPORTS ARENA / STADIUM',
    'RETAIL STORE',
    'DEPARTMENT STORE',
    'COMMERCIAL / BUSINESS OFFICE',
    'FACTORY/MANUFACTURING BUILDING',
    'BAR OR TAVERN',
    'BARBER SHOP/BEAUTY SALON'
]

# Street-related locations
STREET = [
    'SCHOOL, PRIVATE, GROUNDS',
    'VACANT LOT/LAND',
    'ALLEY',
    'COLLEGE / UNIVERSITY GROUNDS',
    'AIRPORT EXTERIOR - SECURE AREA',
    'HIGHWAY/EXPRESSWAY',
    'FOREST PRESERVE',
    'PARKING LOT',
    'PARKING LOT / GARAGE (NON RESIDENTIAL)',
    'SCHOOL, PUBLIC, BUILDING',
    'SCHOOL - PRIVATE GROUNDS',
    'PARKING LOT/GARAGE(NON.RESID.)',
    'NEWSSTAND',
    'LAKEFRONT/WATERFRONT/RIVERBANK',
    'BRIDGE',
    'HOSPITAL BUILDING/GROUNDS',
    'COLLEGE / UNIVERSITY - GROUNDS',
    'VACANT LOT',
    'HIGHWAY / EXPRESSWAY',
    'OTHER (SPECIFY)',
    'POLICE FACILITY/VEH PARKING LOT',
    'CHA PARKING LOT/GROUNDS',
    'PARK PROPERTY',
    'OTHER RAILROAD PROP / TRAIN DEPOT',
    'VEHICLE - DELIVERY TRUCK',
    'PARKING LOT / GARAGE(NON.RESID.)',
    'BANK',
    'SIDEWALK',
    'LAKEFRONT / WATERFRONT / RIVERBANK',
    'POLICE FACILITY / VEHICLE PARKING LOT',
    'STREET',
    'VACANT LOT / LAND',
    'CEMETARY',
    'SCHOOL - PUBLIC BUILDING',
    'GAS STATION',
    'ATM (AUTOMATIC TELLER MACHINE)',
    'SCHOOL, PUBLIC, GROUNDS',
    'DELIVERY TRUCK'
]

# Private locations
PRIVATE = [  
    'COLLEGE / UNIVERSITY - RESIDENCE HALL',
    'HALLWAY',
    'CASINO/GAMBLING ESTABLISHMENT',
    'CHA HALLWAY',
    'YARD',
    'AUTO / BOAT / RV DEALERSHIP',
    'CHURCH / SYNAGOGUE / PLACE OF WORSHIP',
    'SAVINGS AND LOAN',
    'RESIDENCE - PORCH / HALLWAY',
    'FEDERAL BUILDING',
    'MEDICAL / DENTAL OFFICE',
    'BOAT/WATERCRAFT',
    'FIRE STATION',
    'RESIDENCE-GARAGE',
    'JAIL / LOCK-UP FACILITY',
    'SPORTS ARENA/STADIUM',
    'COIN OPERATED MACHINE',
    'DRIVEWAY',
    'BARBER SHOP / BEAUTY SALON',
    'HOUSE',
    'MOVIE HOUSE/THEATER',
    'HOTEL/MOTEL',
    'SCHOOL - PRIVATE BUILDING',
    'CHURCH/SYNAGOGUE/PLACE OF WORSHIP',
    'SCHOOL - PUBLIC GROUNDS',
    'HOTEL / MOTEL',
    'BOWLING ALLEY',
    'RESIDENCE - GARAGE',
    'CREDIT UNION',
    'COLLEGE/UNIVERSITY RESIDENCE HALL',
    'GOVERNMENT BUILDING/PROPERTY',
    'DAY CARE CENTER',
    'HOSPITAL BUILDING / GROUNDS',
    'HOTEL',
    'AIRCRAFT',
    'AIRPORT BUILDING NON-TERMINAL - NON-SECURE AREA',
    'MEDICAL/DENTAL OFFICE',
    'POOL ROOM',
    'APPLIANCE STORE',
    'VESTIBULE',
    'NURSING HOME/RETIREMENT HOME',
    'BASEMENT',
    'SPORTS ARENA / STADIUM',
    'PORCH',
    'AUTO',
    'ABANDONED BUILDING',
    'NURSING / RETIREMENT HOME',
    'TAVERN',
    'CHA PARKING LOT / GROUNDS',
    'VACANT LOT / LAND',
    'ANIMAL HOSPITAL',
    'GARAGE',
    'OTHER RAILROAD PROPERTY / TRAIN DEPOT',
    'CONSTRUCTION SITE',
    'STAIRWELL',
    'RESIDENCE - YARD (FRONT / BACK)',
    'COLLEGE/UNIVERSITY GROUNDS',
    'SCHOOL, PRIVATE, BUILDING',
    'AIRPORT PARKING LOT',
    'RESIDENCE',
    'FACTORY / MANUFACTURING BUILDING',
    'PAWN SHOP',
    'RESIDENCE PORCH/HALLWAY',
    'DRIVEWAY - RESIDENTIAL',
    'GOVERNMENT BUILDING / PROPERTY',
    'AIRPORT VENDING ESTABLISHMENT',
    'BOAT / WATERCRAFT',
    'CHA GROUNDS',
    'GAS STATION DRIVE/PROP.',
    'COLLEGE / UNIVERSITY RESIDENCE HALL',
    'DRUG STORE',
    'CHA HALLWAY/STAIRWELL/ELEVATOR',
    'CHA PARKING LOT',
    'RESIDENTIAL YARD (FRONT/BACK)',
    'TAVERN/LIQUOR STORE',
    'CHA APARTMENT',
    'OTHER',
    'CURRENCY EXCHANGE',
    'SCHOOL - PRIVATE GROUNDS',
    'TAVERN / LIQUOR STORE',
    'OFFICE',
    'CASINO / GAMBLING ESTABLISHMENT',
    'WAREHOUSE',
    'BARBERSHOP',
    'GANGWAY',
    'CHA HALLWAY / STAIRWELL / ELEVATOR',
    'APARTMENT',
    'LIBRARY',
    'ATHLETIC CLUB',
    'CHA HALLWAY''AUTO / BOAT / RV DEALERSHIP',
]

def load_and_preprocess_data(dataset_path: str) -> pd.DataFrame:

    # Load from file 
    # The dataset is too large to push to github, it can be downloaded from: 
    # https://catalog.data.gov/dataset/crimes-2001-to-present/resource/31b027d7-b633-4e82-ad2e-cfa5caaf5837
    dataset = pd.read_csv(dataset_path)

    # Preprocessing date and texts
    dataset['Date'] = pd.to_datetime(dataset['Date'], format='%m/%d/%Y %I:%M:%S %p', errors='coerce')
    dataset['Primary Type'] = dataset['Primary Type'].str.upper()  
    dataset['Location Description'] = dataset['Location Description'].str.upper()

    # Remove duplicates
    dataset = dataset.drop_duplicates()

    # Filter data: exclude those without latitude
    dataset = dataset[~dataset["Latitude"].isna()]

    # exclude those in "rare locations" (< 20 occurrences, will make location processing simpler)
    rare_locations = dataset.groupby("Location Description").filter(lambda x: len(x) < 20)["Location Description"].tolist()
    dataset = dataset[~dataset["Location Description"].isin(rare_locations)]

    # Set crime macro-category
    dataset["Category"] = None
    for category, crime_list in CRIME_CATEGORIES.items():
        dataset.loc[dataset["Primary Type"].isin(crime_list), "Category"] = category

    # Set location category
    dataset["Location Category"] = None
    dataset.loc[dataset["Location Description"].isin(PUBLIC_TRANSPORTS), "Location Category"] = "Public Transports"
    dataset.loc[dataset["Location Description"].isin(STREET), "Location Category"] = "Street"
    dataset.loc[dataset["Location Description"].isin(AIRPORT), "Location Category"] = "Airport"
    dataset.loc[dataset["Location Description"].isin(STORES), "Location Category"] = "Stores"
    dataset.loc[dataset["Location Description"].isin(PRIVATE), "Location Category"] = "Non concerning"
    dataset["Location Category"].value_counts()

    # set hour and year
    dataset['hour'] = dataset['Date'].dt.hour
    dataset["Year"] = dataset["Date"].dt.year


    # set subcategory
    dataset["Subcategory"] = "Others"
    for main_cat, subcategories in CRIME_SUBCATEGORIES.items():
        for subcat in subcategories:
            dataset.loc[(dataset["Category"] == main_cat) & (dataset["Primary Type"] == subcat), "Subcategory"] = subcat


    return dataset


