resource "google_cloud_run_v2_service" "run_teste" {
  project  = var.proj_id
  name     = "teste"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.proj_id}/artifact-repo/portfolio-app:latest"
      ports { container_port = 3000 }
      resources {
        limits = {
          cpu    = "1"  # "1"
          memory = "512Mi" #"2048Mi" # "1024Mi" # "512Mi"
        }
      }
    }
    scaling {
      max_instance_count = 1 # 1
      min_instance_count = 0 # 0 
    }
    vpc_access {
      connector = var.run_connector_id
      egress = "ALL_TRAFFIC"
    }
    timeout = "360s"
    service_account = var.portfolio_run_sa_email
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_v2_service_iam_member" "open_access_run_teste" {
  location = google_cloud_run_v2_service.run_teste.location
  project  = google_cloud_run_v2_service.run_teste.project
  name     = google_cloud_run_v2_service.run_teste.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}



# Portfolio ------------------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "run_portfolio" {
  project  = var.proj_id
  name     = "portfolio-run"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.proj_id}/artifact-repo/portfolio-app:latest"
      ports { container_port = 3000 }
      resources {
        limits = {
          cpu    = "1"  # "1"
          memory = "512Mi" #"2048Mi" # "1024Mi" # "512Mi"
        }
      }
    }
    scaling {
      max_instance_count = 1 # 1
      min_instance_count = 0 # 0 
    }
    vpc_access {
      connector = var.run_connector_id
      egress = "ALL_TRAFFIC"
    }
    timeout = "360s"
    service_account = var.portfolio_run_sa_email
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_v2_service_iam_member" "open_access_run_portfolio" {
  location = google_cloud_run_v2_service.run_portfolio.location
  project  = google_cloud_run_v2_service.run_portfolio.project
  name     = google_cloud_run_v2_service.run_portfolio.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}


# FastAPI API ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_fastapi" {
#   project  = var.proj_id
#   name     = "fastapi-run"
#   location = var.region
#   # ingress  = "INGRESS_TRAFFIC_ALL"
#   ingress = "INGRESS_TRAFFIC_INTERNAL_ONLY"
#   template {
#     containers {
#       # image = "guigo13/fastapi-api:latest"
#       image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/fastapi-api:latest"
#       ports { container_port = 8080 }
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#     vpc_access {
#       connector = var.run_connector_id
#       egress = "ALL_TRAFFIC"
#     }
#     timeout = "60s"
#     service_account = var.fastapi_run_sa_email
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }


# vaultwarden ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_vault" {
#   project  = var.proj_id
#   name     = "vault-run"
#   location = var.region
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "vaultwarden/server:latest"
#       # image = "us-central1-docker.pkg.dev/personalhub13/personalhub-artifact-repo/vault-app:latest"
#       env {
#         name  = "WEBSOCKET_ENABLED"
#         value = "true"
#       }
#       # env {
#       #   name  = "SIGNUPS_ALLOWED"
#       #   value = "false" # Disable if signup is needed          
#       # }
#       env {
#         name  = "SIGNUPS_ALLOWED"
#         value = "true"          
#       }
#       env {
#         name  = "DATA_FOLDER"
#         value = "/data"
#       }
#       env {
#         name  = "DATABASE_URL"
#         value = "sqlite:///data/db.sqlite3"
#       }
#       # env {
#       #   name  = "ADMIN_TOKEN"
#       #   value = var.admin_token
#       # }
#       # env {
#       #   name  = "INVITATIONS_ALLOWED"
#       #   value = "true"
#       # }
      
#       env {
#         name  = "ADMIN_TOKEN"
#         value = "passwd123#"
#       }
#       # env {
#       #   name  = "DATABASE_URL"
#       #   value = "postgresql://user:password@db-host:5432/vaultdb"  # If using PostgreSQL
#       # }
#       # env {
#       #   name  = "DOMAIN"
#       #   value = "https://vault.guigo.dev.br"
#       # }
#       ports {container_port = 80}
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#       volume_mounts {
#         name       = "vault-data"
#         mount_path = "/data"
#       }
#     }
#     volumes {
#       name = "vault-data"
#       gcs {
#         bucket    = var.vault_bucket_name
#         read_only = false
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#     timeout = "60s"
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }


# resource "google_cloud_run_service_iam_member" "vault_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_vault.name
#   location = google_cloud_run_v2_service.run_vault.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# # # BackUp Function 
# # resource "google_cloudfunctions2_function" "run_vault_backup" {
# #   name     = "${var.proj_name}-func-backup"
# #   project  = var.proj_id
# #   location = var.region
# #   # deletion_protection=false
# #   build_config {
# #     runtime     = "python310"
# #     entry_point = "fct_backup_vaultwarden"
# #     source {
# #       storage_source {
# #         bucket = var.vault_backup_bucket_name
# #         object = var.vault_backup_function_name
# #       }
# #     }
# #   }
# #   service_config {
# #     available_memory = "256M"
# #     timeout_seconds  = 60
# #     service_account_email = var.vault_backup_func_sa_email
# #     environment_variables = {
# #       BACKUP_BUCKET = var.vault_backup_bucket_name
# #     }
# #   }
# #   event_trigger {
# #     event_type = "google.cloud.storage.object.v1.finalized"
# #     trigger_region = var.region
# #     event_filters {
# #       attribute = "bucket"
# #       value     = var.vault_bucket_name
# #     }
# #   }
# #   depends_on = [var.vault_backup_function_name]
# # }



# # resource "google_project_iam_member" "gcs_pubsub_publisher" {
# #   project = var.proj_id
# #   role    = "roles/pubsub.publisher"
# #   member  = "serviceAccount:service-${var.proj_number}@gs-project-accounts.iam.gserviceaccount.com"
# #   # depends_on = [google_storage_bucket.vault_bucket]
# #   depends_on = [var.vault_bucket_name]
# # }

# Rstudio ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_rstudio" {
#   project  = var.proj_id
#   name     = "rstudio-run"
#   location = var.region
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/rstudio-app:latest"
#       ports { container_port = 8787 }
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#     vpc_access {
#       connector = var.run_connector_id
#       egress = "ALL_TRAFFIC"
#     }
#     timeout = "60s"
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }

# resource "google_cloud_run_service_iam_member" "rstudio_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_rstudio.name
#   location = google_cloud_run_v2_service.run_rstudio.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# Grafana ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_grafana" {
#   provider = google-beta
#   name     = "grafana-run"
#   location = var.region
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
#     service_account = var.grafana_run_sa_email
#     containers {
#       image = "grafana/grafana:latest"
#       # image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/grafana-app:latest"
#       ports { container_port = 3000 }
#       volume_mounts {
#         name       = "grafana-config"
#         mount_path = "/etc/grafana"
#       }
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#       env {
#         name  = "GF_PATHS_CONFIG"
#         value = "/etc/grafana/grafana.ini"
#       }
#       env {
#         name  = "GF_PATHS_PROVISIONING"
#         value = "/etc/grafana/provisioning"
#       }
#       env {
#         name  = "GF_PATHS_DATA"
#         value = "/var/lib/grafana"
#       }
#       # env {
#       #   name  = "GF_SERVER_HTTP_PORT"
#       #   value = "3000"
#       # }
#       env {
#         name  = "GF_SECURITY_ADMIN_USER"
#         value = "admin"
#       }
#       env {
#         name  = "GF_SECURITY_ADMIN_PASSWORD"
#         value = "admin"
#       }
#       env {
#         name  = "GF_INSTALL_PLUGINS"
#         value = "grafana-stackdriver-datasource"
#       }
#       # env {
#       #   name  = "GF_SERVER_ROOT_URL"
#       #   value = "https://grafana.guigo.dev.br"
#       #   # value = "https://grafana-run-<HASH>-<REGION>.a.run.app"
#       # }
#       env {
#         name  = "GF_SERVER_ROOT_URL"
#         value = "%(protocol)s://%(domain)s/"
#       }
#       env {
#         name  = "GF_SERVER_HTTP_ADDR"
#         value = "0.0.0.0"
#       }
#       env {
#         name  = "GCS_BUCKET"
#         value = var.grafana_bucket_name
#       }
#     }
#     volumes {
#       name = "grafana-config"
#       gcs {
#         bucket    = var.grafana_bucket_name
#         read_only = false 
#       }
#     }
#   }
#   traffic {
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#     percent = 100
#   }
# }

# resource "google_cloud_run_service_iam_member" "grafana_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_grafana.name
#   location = google_cloud_run_v2_service.run_grafana.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }









# # Allow unauthenticated invocations (optional, remove if you want auth)
# resource "google_cloud_run_service_iam_member" "noauth" {
#   location = google_cloud_run_service.grafana.location
#   project  = google_cloud_run_service.grafana.project
#   service  = google_cloud_run_service.grafana.name

#   role   = "roles/run.invoker"
#   member = "allUsers"
# }




# # run functions ------------------------------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_r_functions" {
#   project  = var.proj_id
#   name     = "run-r-functions"
#   location = var.region
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/python_function:latest"
#       ports { container_port = 8080 }
#       resources {
#         limits = {
#           cpu    = "1"
#           memory = "512Mi"
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1
#       min_instance_count = 0
#     }
#     vpc_access {
#       connector = var.run_connector_id
#       egress = "ALL_TRAFFIC"
#     }
#     timeout = "60s"
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }

# resource "google_cloud_run_service_iam_member" "r_functions_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_r_functions.name
#   location = google_cloud_run_v2_service.run_r_functions.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }


# Airflow -------------------------------------------------------------------
# resource "google_cloud_run_v2_service" "run_airflow" {
#   project  = var.proj_id
#   name     = "airflow-run"
#   location = var.region
#   ingress  = "INGRESS_TRAFFIC_ALL"
#   template {
#     containers {
#       image = "${var.region}-docker.pkg.dev/${var.proj_id}/personalhub-artifact-repo/airflow-app:latest"
#       ports { container_port = 8080 }
#       resources {
#         limits = {
#           cpu    = "1"  # "1"
#           memory = "512Mi" #"2048Mi" # "1024Mi" # "512Mi"
#         }
#       }
#     }
#     scaling {
#       max_instance_count = 1 # 1
#       min_instance_count = 0 # 0 
#     }
#     vpc_access {
#       connector = var.run_connector_id
#       egress = "ALL_TRAFFIC"
#     }
#     timeout = "60s"
#     service_account = var.portfolio_run_sa_email
#   }
#   traffic {
#     percent = 100
#     type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#   }
# }

# resource "google_cloud_run_service_iam_member" "airflow_public_access" {
#   project  = var.proj_id
#   service  = google_cloud_run_v2_service.run_airflow.name
#   location = google_cloud_run_v2_service.run_airflow.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }