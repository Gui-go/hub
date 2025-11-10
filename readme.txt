










# Flutter app:
flutter config --enable-web
flutter create flutter_app
cd flutter_app
flutter run -d web
flutter run -d chrome
flutter build web

# Build:
docker build -t guigo13/personalhub .

# Run:
docker run -p 8080:80 guigo13/personalhub

docker push guigo13/personalhub


gcloud auth configure-docker
docker tag flutter-app gcr.io/YOUR_PROJECT_ID/flutter-app
docker push gcr.io/YOUR_PROJECT_ID/flutter-app
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME .
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME



gcloud run deploy flutter-app --image gcr.io/YOUR_PROJECT_ID/flutter-app --platform managed --allow-unauthenticated --region us-central1


gcloud services enable run.googleapis.com

gcloud iam service-accounts create github-actions-deployer \
  --display-name "GitHub Actions Cloud Run Deployer"


gcloud projects add-iam-policy-binding personalhub3 \
  --member="serviceAccount:github-actions-deployer@personalhub3.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding personalhub3 \
  --member="serviceAccount:github-actions-deployer@personalhub3.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding personalhub3 \
  --member="serviceAccount:github-actions-deployer@personalhub3.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud iam service-accounts keys create ../github-actions-deployer-key.json \
  --iam-account=github-actions-deployer@personalhub3.iam.gserviceaccount.com






--
# To get Discovery Engine access to GCS bucket: 
gcloud storage buckets add-iam-policy-binding gs://personalhub-docs-bucket \
  --member=user:guilhermeviegas1993@gmail.com \
  --role=roles/storage.admin

gcloud storage buckets add-iam-policy-binding gs://personalhub-docs-bucket \
  --member=user:guilhermeviegas1993@gmail.com \
  --role=roles/storage.objectAdmin

gcloud storage buckets add-iam-policy-binding gs://personalhub-docs-bucket \
  --member=user:guilhermeviegas1993@gmail.com \
  --role=roles/storage.objectCreator

--

gcloud iam service-accounts create terraform-local-sa \
  --display-name "Allows Terraform to create GCP resources"




terraform init 
terraform apply
terraform state list

terraform state show module.network.google_dns_record_set.tf_a_record

# Get a graph viz:
terraform graph | dot -Tsvg > graph.svg




Google Search Console
TXT Record 
domain from registro.br





add network


# docker build -t d3-map-app .
# docker run -p 3000:3000 d3-map-app
docker compose up --build


docker build -t vanilla_app .
docker run -p 3000:3000 vanilla_app



docker build -t guigo13/personalhub-flutter .
docker build -t guigo13/personalhub-flutter -f flutter_app/Dockerfile .
docker build -t guigo13/personalhub-flutter -f flutter_app/Dockerfile flutter_app

docker run -p 8080:8080 guigo13/personalhub-flutter

docker build -t guigo13/dbt -f dbt.dockerfile .

--


Common types:
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Formatting, missing semicolons, etc.
refactor: Code change that neither fixes nor adds a feature
perf: Performance improvement
test: Adding or updating tests
chore: Maintenance tasks, config changes



----------------------------

https://whois.domaintools.com/guigo.dev.br





docker build -t vanilla_app .
docker run -p 3000:3000 vanilla_app



docker build -t guigo13/gitlab -f gitlab.dockerfile .
docker run -p 81:80 guigo13/gitlab




----------------------------------



When adding new subdomains, add them in terraform/main.tf and terraform/modules/compute/outputs.tf


Error: Error creating ManagedSslCertificate: googleapi: Error 409: The resource 'projects/personalhub3/global/sslCertificates/ssl-certs' already exists, alreadyExists
# Delete before creating new subdomains
terraform destroy -target=module.network.google_compute_managed_ssl_certificate.ssl_certs

terraform destroy -target=module.network.google_compute_region_network_endpoint_group.neg_region



# List APIs enabled:
gcloud services list --enabled --project=personalhub3




------------------------------------



# proxmox
# ntpd/chronyd
# Audiobookshelf
# Navidrome
# Mylar3
# gitlab
# Linkding: Self-hosted bookmark manager
# Prometheus: System monitoring and alerting toolkit
# Grafana: Data visualization and dashboarding tool, often used with Prometheus
# Cockpit: Web-based server management interface for Linux systems
# Filebrowser: Web-based file manager
# Fail2ban: Intrusion prevention software that monitors log files for malicious activity.
# OpenVAS: Comprehensive vulnerability scanner.
# Suricata/Snort (IDS/IPS): Intrusion Detection/Prevention Systems (can be resource-intensive).
# Minecraft Server: Host your own Minecraft multiplayer server  
# Game Server Emulators (e.g., for classic games): Explore emulators for various game servers.
# Plex Arcade/Game Server Hosting Tools: Some tools help integrate retro gaming with Plex or manage dedicated game servers.
# Jenkins/GitLab Runner: Automation servers for CI/CD pipelines
# Database Servers (PostgreSQL, MySQL, MariaDB, MongoDB): Run development or personal database instances.
# Redis/Memcached: In-memory data stores for caching and more.
# postgis/postgis: A powerful spatial database extender for PostgreSQL. Essential for storing, querying, and analyzing vector and raster geospatial data. You can combine this with a regular PostgreSQL image if needed.   
# geoserver/geoserver: An open-source server for sharing geospatial data. It implements open standards like WMS, WFS, WCS, and WPS. Great for visualizing and serving maps and spatial data.   
# mapserver/mapserver: Another robust open-source platform for publishing spatial data and creating interactive map applications.   
# osgeo/gdal: The Geospatial Data Abstraction Library. A translator library for raster and vector geospatial data formats. Useful for command-line data conversion and processing within a containerized environment.   
# osgeo/grass-gis: GRASS GIS (Geographic Resources Analysis Support System) is a powerful open-source GIS software suite with capabilities for raster, vector, image processing, and temporal data analysis.   
# qgis/qgis-server: Publishes QGIS projects as OGC Web Services (WMS). Allows you to serve maps created in the desktop QGIS application.   
# mapbox/tilemaker: A tool for generating vector tiles from various geospatial data sources, optimized for web mapping.
# maptiler/tileserver-gl: Serves vector tiles in the Mapbox GL JS format, enabling fast and interactive web maps.
# pgrouting/pgrouting: A PostgreSQL extension that adds routing functionality, allowing you to find shortest paths and perform network analysis on your spatial data.   
# arachnaworkflow/arachna: A workflow engine for geospatial processing, allowing you to chain together GDAL, GRASS, and other tools.
# Web Mapping & Visualization:

# leaflet/leaflet (as a base for custom apps): While Leaflet itself is a JavaScript library, you can containerize a web server (like Nginx or Apache) that serves your Leaflet-based web map applications.
# openlayers/openlayers (as a base for custom apps): Similar to Leaflet, OpenLayers is a powerful JavaScript library for displaying map data in web browsers. Containerize your application that uses it.   
# keplergl/kepler.gl (as a base for custom apps or pre-built demos): Kepler.gl is a powerful open-source geospatial visualization tool for large-scale datasets. You can containerize a web server hosting pre-configured Kepler.gl instances.   
# streamlit/streamlit (for geospatial dashboards): Streamlit is a Python library that makes it easy to create interactive web applications and dashboards. You can build compelling geospatial data visualizations with it and containerize the app.   
# plotly/dash (for interactive mapping): Dash is a Python framework for building analytical web applications. It has excellent support for interactive maps through libraries like plotly.express.   
# Geocoding & Reverse Geocoding:

# nominatim/nominatim: A powerful open-source geocoding service based on OpenStreetMap data. Running your own instance gives you control and privacy. (Note: Can be resource-intensive for large areas).   
# photon-geocoder/photon: Another fast, open-source geocoder built on top of Elasticsearch and OpenStreetMap data. Lighter than a full Nominatim instance.   
# pelias/api: A modular open-source geocoding and search service. You can choose the components you need.   
# Remote Sensing & Earth Observation:

# sentinelhub/eo-learn (as a base for processing scripts): EO-Learn is a Python library for large-scale Earth observation data processing with Sentinel Hub. You can create Docker containers with your EO-Learn scripts and necessary dependencies.   
# rasterio/rasterio (as a base for processing scripts): Rasterio is a Python library for reading and writing raster data. Containerize your Python scripts that use Rasterio for remote sensing analysis.   
# openeo/openeo-backend (for advanced EO processing): openEO is an API and framework for cloud-based Earth observation processing. Running a backend instance allows for complex analysis workflows.   
# GNSS & Tracking:

# traccar/traccar: An open-source GPS tracking server that supports a wide range of devices. You can host your own tracking platform for vehicles, assets, or even personal devices.   
# gpsd/gpsd: A service daemon that monitors one or more GPS or AIS receivers attached to a host computer through serial or USB ports, making the data available to be queried by client applications. Useful if you have physical GPS hardware connected to your server.   
# Fun & Experimental:

# blender/blender (for geospatial visualization): While not strictly a geospatial tool, Blender can be used for advanced 3D visualization of terrain and other geographic data. You can run Blender in a container for rendering tasks.   
# Containers hosting Jupyter Notebooks with geospatial libraries (e.g., jupyter/datascience-notebook with geopandas, rioxarray, etc. installed): Great for interactive exploration and analysis of geospatial data.


# apache/airflow:2.x: Platform to programmatically author, schedule, and monitor workflows.

# dbtlabs/dbt-core: Transformation workflow tool that lets teams quickly and collaboratively deploy analytics code.

# apache/hadoop:latest-jdk8: Apache Hadoop environment (can be resource-intensive for a full cluster). You might start with a single-node setup.
# apache/spark:latest: Apache Spark for big data processing (also resource-intensive). Again, a standalone setup is good for learning.
# Data Streaming:

# apache/kafka:latest: As mentioned before, essential for building real-time data pipelines.
# confluentinc/cp-kafka-connect:latest: Kafka Connect for scalable and reliable data streaming between Kafka and other systems.
# debezium/connect:latest: Change Data Capture (CDC) platform that streams database changes in real-time to Kafka.
# redpanda/redpanda:latest: Kafka-compatible streaming platform that aims for simplicity and performance.

# jupyter/datascience-notebook:latest: A full-fledged Jupyter Notebook environment with many popular data science libraries pre-installed (Pandas, NumPy, Matplotlib, Scikit-learn).
# jupyter/tensorflow-notebook:latest: Jupyter environment with TensorFlow.
# jupyter/pytorch-notebook:latest: Jupyter environment with PyTorch.
# jupyter/r-notebook:latest: Jupyter environment with R.
# These provide isolated and reproducible environments for data exploration, analysis, and model building.


# dosbox/dosbox: Run classic DOS games and applications in a container

# vncserver/vnc with an old operating system (e.g., Windows 98, BeOS): For the truly nostalgic, try running a VNC server with an image of a vintage operating system.

# grafana/grafana: For monitoring and visualization of your containerized applications and infrastructure.
# prometheus/prometheus: For monitoring and alerting, especially if you're running multiple containers.


# trueNAS

# ollama



#
terraform output -raw service_account_key_json | base64 -d > github-actions-deployer-key.json






------------------------------------------



Add: 
Laguna, 
PoA,       
Toledo,
Marbella,
caceres,
merida,
portmao,
albufeira,
criciuma


Correct lat-long:
Washington (casa branca ou obelisco),
Colon,
floripa (morro da cruz)


---------------------------------------------------------------------
Features:
Berlin wall
DMZ Korea
Damian gap 
Metros of Lisbon
Metros of SP 
Metros of the World




----------------------------------------------------------------------
Cool:
Tile com relevo:
const rasterLayer = new TileLayer({
  source: new OGCMapTile({
    url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
    crossOrigin: '',
  }),
});






----------------------------------------------------------------
Data types:
geojson
topology
geometry
kmz
wms
GPX   GeoJSON   IGC   KML   TopoJSON
WKB (Well Known Binary) format
mvt

----------------------------------------------------------


# find . -type f -exec sed -i 's/antes/depois/g' {} +


----------------------------------------------

IBGE Raod Network data:

https://www.ibge.gov.br/geociencias/downloads-geociencias.html
organization_of_the_territory/geographic_networks_and_flows/transport_logistics/database/2014.zip

ogr2ogr -f CSV -dialect sqlite -sql "SELECT AsGeoJSON(geometry) AS geom, * FROM rodovia_2014" rodovia_2014.csv rodovia_2014.shp
jq -c '.features[]' rodovia_2014.geojson > rodovia_2014_nd.geojson



ogr2ogr -f GeoJSON BR_Municipios_2024.geojson BR_Municipios_2024
jq -c '.features[]' BR_Municipios_2024.geojson > BR_Municipios_2024_nd.geojson



---------------------------------------------------


terraform refresh

terraform state list

-------------------------------------------------

pg tile server
mapbiomas




-----------------------------------------------------
DNS zone
Registros.br > 
  Configurar DNS > 
    Modo Avançado > 
      Esperar >
        Adicionar TXT 
      Aguardar processo (cerca de 2 horas)


----------------------------------------------------
Ideas:

0) D3 maps for Stories:
https://observablehq.com/@mbostock/methods-of-comparison-compared

0) D3 projections:
https://observablehq.com/@d3/versor-dragging
https://observablehq.com/@d3/projection-transitions




1) Measure distance with different projections (as selected dropdown):
https://openlayers.org/en/latest/examples/measure-style.html

2) Geo Transition annimation 
https://openlayers.org/en/latest/examples/animation.html


3) Circles to ilustrate projections:
https://openlayers.org/en/latest/examples/tissot.html

4) Line annimation:
https://openlayers.org/en/latest/examples/feature-move-animation.html

5) Free hand drawer:
https://openlayers.org/en/latest/examples/draw-freehand.html

6) Where am I?
https://openlayers.org/en/latest/examples/geolocation.html

7) Wind:
https://openlayers.org/en/latest/examples/wind.html

8) Flights and airports:
https://openflights.org/

9) Flight animation:
https://openlayers.org/en/latest/examples/flight-animation.html

10/ Kaggle Datasets:
https://www.kaggle.com/datasets/

11) NDVI
https://openlayers.org/en/latest/examples/cog-colors.html
https://openlayers.org/en/latest/examples/raster.html

12) PG ROUTING WITH PG TILE SERVER:
https://www.youtube.com/watch?v=TXPtocZWr78&t=2394s
https://www.postgresql.org/about/news/pg_tileserv-for-postgresqlpostgis-2016/

13) tratado de versalhes





Berliner Mauer API data:
https://sigcfe.maps.arcgis.com/home/item.html?id=a8543baa8ffc41fe9c78d367e912bc70
https://services2.arcgis.com/jUpNdisbWqRpMo35/ArcGIS/rest/services/Berliner_Mauer/FeatureServer/0
https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Berliner_Mauer/FeatureServer/0/query?where=1=1&outFields=*&f=json

Berlin city polygon:
https://opendatalab.de/projects/geojson-utilities/



