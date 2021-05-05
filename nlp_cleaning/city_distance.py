# %%
import json
import pandas as pd
from math import dist, radians, cos, sin, asin, sqrt
from typing import ItemsView
import pandas as pd

import sys
from opencage.geocoder import OpenCageGeocode

key = 'd8d8e048663e4a9e9b54e22308bf5f24'
geocoder = OpenCageGeocode(key)
addressfile = 'indian_cities_ with_india_tag.txt'
latitude_lst = []
longitude_lst = []
try:
    with open(addressfile, 'r') as f:
        for line in f:
            address = line.strip()
            results = geocoder.geocode(address, no_annotations='1')

            if results and len(results):
                longitude = results[0]['geometry']['lng']
                latitude = results[0]['geometry']['lat']
                latitude_lst.append(latitude)
                longitude_lst.append(longitude)
                #print(u'%f;%f;%s' % (latitude, longitude, address))
                # 40.416705;-3.703582;Madrid,Spain
                # 45.466797;9.190498;Milan,Italy
                # 52.517037;13.388860;Berlin,Germany
            else:
                sys.stderr.write("not found: %s\n" % address)
except IOError:
    print('Error: File %s does not appear to exist.' % addressfile)


# %%
df = df = pd.read_excel('indian_cities_cleaned.xlsx')
df['latitude'] = latitude_lst
df['longitude'] = longitude_lst
df.head()
# %%
df.to_excel(
    r'C:\Users\Administrator\Desktop\Akhil\Work\Vectra\Resume app\Streamlit\indian_cities_cleaned.xlsx')

# %%

with open('india_cities_database.json') as f:
    data = json.load(f)

# print(data['alternatenames'])
length = len(data)
city_list = []
city_latitude = []
city_longitude = []
city_alt_names = []
index = 0

for item in data:
    for attribute, value in item.items():
        if attribute == 'ascii_name':
            city_list.append(value)
        elif attribute == 'alternatenames':
            if value != value:
                city_alt_names.append('No names available')
            else:
                city_alt_names.append(value)
        elif attribute == 'latitude':
            city_latitude.append(value)
        elif attribute == 'longitude':
            city_longitude.append(value)
        else:
            pass
# while(index<length):
    # city_list.append(data[index]['ascii_name'])
    # city_alt_names.append(data[index]['alternatenames'])
    # city_latitude.append(data[index]['latitude'])
    # city_longitude.append(data[index]['longitude'])
    #index += 1

# %%
df3 = pd.DataFrame(columns=['city', 'latitude', 'longitude'])
df3['city'] = city_list
df3['latitude'] = city_latitude
df3['longitude'] = city_longitude

df3.head()

# %%
city = []
near_by_city = []
distance = []


def calc_haversine_dist(city_name, lat1, long1):

    for next_idx, next_val in enumerate(city_list):
        if city_name == next_val:
            pass
        else:
            lat2 = city_latitude[next_idx]
            long2 = city_longitude[next_idx]
            lat1, long1, lat2, long2 = map(radians, [lat1, long1, lat2, long2])
            # haversine formula
            dlon = long2 - long1
            dlat = lat2 - lat1
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * asin(sqrt(a))
            # Radius of earth in kilometers is 6371
            km = 6371 * c
            if(km > 100):
                pass
            else:
                return city_name, next_val,km


df5 = pd.DataFrame(columns=['city', 'nearby city', 'distance'])

cities_info = []
for idx, val in enumerate(city_list):
    lat1 = city_latitude[idx]
    long1 = city_longitude[idx]
    name = val
    cities_info.append(calc_haversine_dist(name, lat1, long1))

# %%
print(cities_info)
# %%
copy_city_list = city_list
for idx, val in enumerate(city_list):
    lat1 = city_latitude[idx]
    long1 = city_longitude[idx]
    for next_idx, next_val in enumerate(copy_city_list):
        if val == next_val:
            pass
        else:
            lat2 = city_latitude[next_idx]
            long2 = city_longitude[next_idx]
            lat1, long1, lat2, long2 = map(radians, [lat1, long1, lat2, long2])
            # haversine formula
            dlon = long2 - long1
            dlat = lat2 - lat1
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * asin(sqrt(a))
            # Radius of earth in kilometers is 6371
            km = 6371 * c
            #if(km > 100):
            #    pass
            #else:
            city.append(val)
            near_by_city.append(next_val)
            distance.append(km)


# %%
df5 = pd.DataFrame(columns=['city', 'nearby city', 'distance'])
df5['city'] = city
df5['nearby city'] = near_by_city
df5['distance'] = distance

df5.head()
# %%
df6 = df5.query("distance<=100")
df6
result = df5.loc[0:1000000,:]
result
# %%
result.to_excel(r'C:\Users\Administrator\Desktop\Akhil\Work\Vectra\Resume app\Streamlit\indian_cities_with_nearby_city_test.xlsx')
# %%
result.to_excel(r'C:\Users\Administrator\Desktop\Akhil\Work\Vectra\Resume app\Streamlit\indian_cities_with_nearby_city_test.xlsx')

# %%
