import requests
import simplejson
import json

fromName = "Jona*Bollwies"
searchDistanz = 15000  # In meter

fromIDRequest = requests.get(f'https://timetable.search.ch/api/completion.json?term={fromName}&show_ids=1')
fromID = int(json.loads(fromIDRequest.text)[0]["id"])
fromLabel = json.loads(fromIDRequest.text)[0]["label"]
print("From:")
print(f"\t ID:\t\t{fromID}")
print("\t Name:\t\t" + fromLabel)
fromLocationRequest = requests.get(f'https://data.sbb.ch/api/v2/catalog/datasets/didok-liste/exports/json?search={fromID}&rows=-1&pretty=false&timezone=UTC')
fromLatitude = json.loads(fromLocationRequest.text)[0]["geopos"]["lat"]
fromLongitude = json.loads(fromLocationRequest.text)[0]["geopos"]["lon"]
print(f"\t Position:\t{fromLatitude}, {fromLongitude}")

destinationsRequest = requests.get(f'https://data.sbb.ch/api/records/1.0/search/?dataset=didok-liste&rows=700&geofilter.distance={fromLatitude}%2C{fromLongitude}%2C{searchDistanz}')
destinations = json.loads(destinationsRequest.text)["records"]
print(f"Destination Count: {len(destinations)}")

routesToDestinations = []
fromRecord = {}
for destination in destinations:
    print(destination)
    destinationID = destination["fields"]["nummer"]
    if fromID == destinationID:
        fromRecord = destination
        continue
    routesRequest = requests.get(f'https://timetable.search.ch/api/route.json?from={fromID}&to={destinationID}')
    routes = json.loads(routesRequest.text)
    routes.update({"RecordsTo": destination})
    routes.update({"RecordsFrom": fromRecord})
    routesToDestinations.append(routes)

routesDataFile = open("routesDataFile.json", "w")
routesDataFile.write(simplejson.dumps(routesToDestinations, indent=4, sort_keys=True))
routesDataFile.close()


