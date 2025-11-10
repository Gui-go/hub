
import json

def convert_esri_to_geojson(esri_json_path, geojson_path):
    with open(esri_json_path, 'r') as f:
        esri_data = json.load(f)

    features = []
    for esri_feature in esri_data['features']:
        geo_feature = {
            'type': 'Feature',
            'properties': esri_feature['attributes'],
            'geometry': {
                'type': 'MultiLineString',
                'coordinates': esri_feature['geometry']['paths']
            }
        }
        features.append(geo_feature)

    geojson_data = {
        'type': 'FeatureCollection',
        'features': features
    }

    with open(geojson_path, 'w') as f:
        json.dump(geojson_data, f, indent=4)

if __name__ == '__main__':
    convert_esri_to_geojson('berliner_mauer.geojson', 'berliner_mauer_fixed.geojson')
