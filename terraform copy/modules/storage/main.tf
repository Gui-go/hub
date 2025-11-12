resource "google_firestore_database" "firestore_datastore" {
  name                              = "firestore-datasbase"
  project                           = var.proj_id
  location_id                       = var.region
  type                              = "FIRESTORE_NATIVE"
  concurrency_mode                  = "OPTIMISTIC"
  app_engine_integration_mode       = "DISABLED"
  point_in_time_recovery_enablement = "POINT_IN_TIME_RECOVERY_ENABLED"
  delete_protection_state           = "DELETE_PROTECTION_ENABLED"
}

resource "google_firestore_database" "firestore_counterplusone" {
  name                              = "counterplusone-db"
  project                           = var.proj_id
  location_id                       = var.region
  type                              = "FIRESTORE_NATIVE"
  concurrency_mode                  = "OPTIMISTIC"
  app_engine_integration_mode       = "DISABLED"
  point_in_time_recovery_enablement = "POINT_IN_TIME_RECOVERY_ENABLED"
  delete_protection_state           = "DELETE_PROTECTION_ENABLED"
}

resource "google_firestore_database" "firestore_flappybird" {
  name                              = "flappybird-db"
  project                           = var.proj_id
  location_id                       = var.region
  type                              = "FIRESTORE_NATIVE"
  concurrency_mode                  = "OPTIMISTIC"
  app_engine_integration_mode       = "DISABLED"
  point_in_time_recovery_enablement = "POINT_IN_TIME_RECOVERY_ENABLED"
  delete_protection_state           = "DELETE_PROTECTION_ENABLED"
}



# resource "google_firestore_database" "default" {
#   name     = "firestore1"
#   project  = var.proj_id
#   location = var.region
#   type     = "NATIVE"
# }


# resource "google_sql_database_instance" "postgres_instance" {
#   project          = var.proj_id
#   name             = "cloudsql-postgres"
#   region           = var.region
#   database_version = "POSTGRES_17"
#   deletion_protection = false # true
#   settings {
#     tier = "db-f1-micro"  # 1 vCPU, 0.614 GB Shared Core
#     availability_type = "ZONAL"
#     data_cache_config {
#       data_cache_enabled = false
#     }
#     disk_type        = "PD_HDD"
#     disk_size        = 10
#     disk_autoresize  = true
#     maintenance_window {
#       day          = 1    # Monday
#       hour         = 5    # 2 AM UTC
#       update_track = "stable"
#     }
#     # ip_configuration {
#     #   ipv4_enabled    = false
#     #   private_network = var.vpc_network_id
#     # }
#     ip_configuration {
#       ipv4_enabled    = true  # Enables public IP
#       authorized_networks {
#         name  = "public-access"
#         value = "0.0.0.0/0" # Open access; restrict this in production
#       }
#     }
#     # ip_configuration {
#     #   ipv4_enabled = false  # Disable public IP
#     #   private_network = var.vpc_self_link  # Connect to your VPC
#     # }
#     insights_config {
#       query_insights_enabled = true
#       record_application_tags = true
#       record_client_address = true
#     }
#     edition = "ENTERPRISE"
#   }
#   lifecycle {
#     prevent_destroy = false# true
#   }
#   depends_on = [var.vpc_connection_id]
# }








# resource "google_sql_user" "postgres_user" {
#   name     = "postgres"
#   instance = google_sql_database_instance.postgres_instance.name
#   password = "YourSecurePasswordHere"
# }
# gcloud sql users create guigo --instance=cloudsql-postgres --password=passwd123#


# resource "google_sql_database" "default_db" {
#   name     = "defaultdb"
#   instance = google_sql_database_instance.postgres_instance.name
# }
# gcloud sql databases create defaultdb --instance=cloudsql-postgres



# gcloud sql import sql INSTANCE_NAME gs://YOUR_BUCKET/yourfile.sql --database=DATABASE_NAME

# gcloud sql connect YOUR_INSTANCE --user=postgres


# \l
# CREATE DATABASE mydb;
# CREATE USER myuser WITH PASSWORD 'mypassword';
# GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
# \dt

# CREATE TABLE users (
#     id SERIAL PRIMARY KEY,
#     username VARCHAR(50) UNIQUE NOT NULL,
#     email VARCHAR(100) UNIQUE NOT NULL,
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );
# CREATE TABLE posts (
#     id SERIAL PRIMARY KEY,
#     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
#     title VARCHAR(255) NOT NULL,
#     content TEXT NOT NULL,
#     published BOOLEAN DEFAULT FALSE,
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );
# CREATE TABLE comments (
#     id SERIAL PRIMARY KEY,
#     post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
#     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
#     comment TEXT NOT NULL,
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );

# INSERT INTO users (username, email) VALUES ('alice', 'alice@example.com');
# INSERT INTO posts (user_id, title, content) VALUES (1, 'Hello World', 'This is my first post!');
# INSERT INTO comments (post_id, user_id, comment) VALUES (1, 1, 'Great post!');

# CREATE EXTENSION postgis;
# \dx

# CREATE TABLE parks (
#     id SERIAL PRIMARY KEY,
#     name TEXT NOT NULL,
#     location GEOGRAPHY(Point, 4326)  -- or GEOMETRY(Point, 4326)
# );
# INSERT INTO parks (name, location)
# VALUES ('Golden Gate Park', ST_GeogFromText('POINT(-122.4862 37.7694)'));

# SELECT *
# FROM parks
# WHERE ST_DWithin(
#   location,
#   ST_GeogFromText('POINT(-122.48 37.77)'),
#   5000  -- meters
# );



# psql -h 172.17.0.3 -p 5432 -U postgres -d mydb


# ./cloud-sql-proxy \
#   # --credentials-file=your-service-account.json \
#   personalhub13:us-central1:cloudsql-postgres4


# psql -h 35.224.60.87 -U postgres -d mydb
# psql -h 35.224.60.87 -U postgres -d postgres