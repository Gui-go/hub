


resource "google_artifact_registry_repository" "hub" {
  project       = var.proj_id
  location      = var.region
  repository_id = "artifact-repo"
  description   = "Docker repository for storing container images"
  format        = "DOCKER"
  # Optional: Enable customer-managed encryption key (CMEK) if needed
  # kms_key_name = "projects/[PROJECT_ID]/locations/[REGION]/keyRings/[KEYRING]/cryptoKeys/[KEY]"
  # Optional: Add labels for organization
  # labels = {
  #   environment = "production"
  #   purpose     = "container-storage"
  # }
  cleanup_policies {
    id     = "keep-recent-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 1
    }
  }
  depends_on = [
    # var.enabled_apis
    # var.enabled_apis
    # google_project_service.artifactregistry
  ]
}

# Vaultwarden Bucket and Backup Bucket ------------------------------------------------------------
# resource "google_storage_bucket" "vaultwarden_bucket" {
#   project  = var.proj_id
#   name     = "${var.proj_id}-vault-bucket"
#   location = var.location
#   versioning { enabled = true }
#   uniform_bucket_level_access = true
# }

# resource "google_storage_bucket_iam_member" "eventarc_vaultwarden_iam_member" {
#   bucket = google_storage_bucket.vaultwarden_bucket.name
#   role   = "roles/storage.admin"
#   member = "serviceAccount:service-${var.proj_number}@gcp-sa-eventarc.iam.gserviceaccount.com"
#   depends_on = [google_storage_bucket.vaultwarden_bucket]
# }

# resource "google_storage_bucket_iam_member" "vaultwarden_objectviewer_iam_member" {
#   bucket = google_storage_bucket.vaultwarden_bucket.name
#   role   = "roles/storage.objectViewer"
#   member = "serviceAccount:${google_service_account.vault_backup_func_sa.email}"
# }



# # Vault Backup Bucket ------------------------------------------------
# resource "google_storage_bucket" "vaultwarden_backup_bucket" {
#   project  = var.proj_id
#   name     = "${var.proj_id}-backup-bucket"
#   location = var.location
#   versioning { enabled = true }
#   uniform_bucket_level_access = true
# }

# resource "google_service_account" "vault_backup_func_sa" {
#   project      = var.proj_id
#   account_id   = "${var.proj_id}-backup-sa"
#   display_name = "Vaultwarden Backup Cloud Function SA"
# }

# resource "google_storage_bucket_iam_member" "vaultwarden_backup_bucketobjectcreator_iam_member" {
#   bucket = google_storage_bucket.vaultwarden_backup_bucket.name
#   role   = "roles/storage.objectCreator"
#   member = "serviceAccount:${google_service_account.vault_backup_func_sa.email}"
# }

# resource "google_storage_bucket_object" "vaultwarden_backup_func_src" {
#   name = "func"
#   bucket = google_storage_bucket.vaultwarden_backup_bucket.name
#   source = "index.zip"
# }



# buckets ------------------------------------------------------------------------------------

# resource "google_storage_bucket" "vault_bucket" {
#   project                     = var.proj_id
#   name                        = "vault-bucket-${var.proj_id}"
#   location                    = var.location
#   uniform_bucket_level_access = true
#   versioning {
#     enabled = true
#   }
# }

# resource "google_storage_bucket" "billing_bucket" {
#   project                     = var.proj_id
#   name                        = "billing-bucket-${var.proj_id}"
#   location                    = var.location
#   uniform_bucket_level_access = true
# }

# resource "google_storage_bucket" "sqlite_bucket" {
#   project                     = var.proj_id
#   name                        = "sqlite-bucket-${var.proj_id}"
#   location                    = var.location
#   uniform_bucket_level_access = true
#   # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
# }

resource "google_storage_bucket" "brvectors_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-brvectors-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

# resource "google_storage_bucket" "geolayers_bucket" {
#   project                     = var.proj_id
#   name                        = "${var.proj_id}-geolayers-bucket"
#   location                    = var.location
#   uniform_bucket_level_access = true
#   # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
# }

resource "google_storage_bucket" "discovery_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-discovery-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

resource "google_storage_bucket" "grafana_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-grafana-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

resource "google_storage_bucket" "bqml_import_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-bqmlimport-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

resource "google_storage_bucket" "terraform_state_bucket" {
  project                     = var.proj_id
  name                        = "${var.proj_id}-tf-state-bucket"
  location                    = var.location
  uniform_bucket_level_access = true
  # force_destroy = true # Allows deletion of non-empty buckets (use with caution)
}

# resource "google_storage_bucket_object" "bqml_import_bucket_tffunction1" {
#   name   = "tf_function1/create_model.py"
#   bucket = google_storage_bucket.bqml_import_bucket.name
#   content = file("../../functions_img/tf_function1/create_model.py")
# }

# resource "google_storage_bucket_object" "bqml_import_bucket_tffunction2" {
#   name   = "tf_function1/simple_model.keras"
#   bucket = google_storage_bucket.bqml_import_bucket.name
#   # content = file("../../functions_img/tf_function1/simple_model.keras")
#   content = filebase64("../../functions_img/tf_function1/simple_model.keras")
# }

# resource "google_storage_bucket_object" "grafana_datasource_config" {
#   name   = "provisioning/datasources/datasources.yaml"
#   bucket = var.grafana_bucket_name
#   content = templatefile("${path.module}/datasources.yaml", {
#     proj_id = var.proj_id
#   })
# }

# resource "google_storage_bucket_object" "grafana_dashboard_config" {
#   name   = "provisioning/dashboards/dashboards.yaml"
#   bucket = var.grafana_bucket_name
#   content = file("${path.module}/dashboards.yaml")
# }

# resource "google_storage_bucket_object" "grafana_dashboard" {
#   name   = "provisioning/dashboards/cloud-run-logs.json"
#   bucket = var.grafana_bucket_name
#   content = templatefile("${path.module}/cloud-run-logs.json", {
#     proj_id = var.proj_id
#   })
# }

# # datasets ------------------------------------------------------------------------------------

resource "google_bigquery_dataset" "billing_dev_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "billing_dev"
  location      = var.location
  description   = "BigQuery dataset in development stage for Cloud Billing dumping"
}

resource "google_bigquery_dataset" "billing_prod_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "billing_prod"
  location      = var.location
  description   = "BigQuery dataset in production stage for Cloud Billing dumping"
}


resource "google_bigquery_dataset" "brvectors_source_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "brvectors_source"
  location      = var.location
  description   = "BigQuery dataset for BRvectors sources"
}

resource "google_bigquery_dataset" "brvectors_dev_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "brvectors_dev"
  location      = var.location
  description   = "BigQuery dataset in developement stage for BRvectors"
}

resource "google_bigquery_dataset" "brvectors_prod_bq_dataset" {
  project       = var.proj_id
  dataset_id    = "brvectors_prod"
  location      = var.location
  description   = "BigQuery dataset in production stage for BRvectors"
}

# # Tables ----------------------------------------------------------------------------

# resource "google_bigquery_table" "bq_table_locations" {
#   project             = var.proj_id
#   dataset_id          = google_bigquery_dataset.brvectors_source_bq_dataset.dataset_id
#   table_id            = "locations"
#   deletion_protection = false
#   external_data_configuration { 
#     source_uris       = ["gs://${google_storage_bucket.brvectors_bucket.name}/locations.csv"]
#     source_format     = "CSV"
#     autodetect        = true
#   }
# }


# # DATAFORM ------------------------------------

# # resource "google_secret_manager_secret" "gh_token_secret" {
# #   secret_id = "gh-access-token-secret"
# #   labels = {
# #     label = "gh-token123"
# #   }
# #   replication {
# #     user_managed {
# #       replicas {
# #         location = var.location
# #       }
# #       # replicas {
# #       #   location = "us-east1"
# #       # }
# #     }
# #   }
# # }


# # data "google_secret_manager_secret_version" "tf_mainuser" {
# #   project = var.proj_id
# #   secret  = "main-user"
# #   version = "latest"
# # }

# # data "google_secret_manager_secret_version" "tf_mainsecret" {
# #   project = var.proj_id
# #   secret  = "main-passwd"
# #   version = "latest"
# # }

# # data "google_secret_manager_secret_version" "tf_secretgitprivsshk" {
# #   project = var.proj_id
# #   secret  = "secret-gcp-ssh-key"
# #   version = "latest"
# # }



# # resource "google_secret_manager_secret" "gh_token_secret" {
# #   project   = var.proj_id
# #   secret_id = "gh-access-token-secret"
# #   labels = {
# #     label = "gh-token123"
# #   }
# #   replication {
# #     user_managed {
# #       replicas {
# #         location = var.location
# #       }
# #     }
# #   }
# # }

# # resource "google_secret_manager_secret_version" "gh_token_secret_version" {
# #   secret      = google_secret_manager_secret.gh_token_secret.id
# #   secret_data = var.github_token
# # }

# # resource "google_secret_manager_secret_iam_member" "dataform_secret_access" {
# #   secret_id = google_secret_manager_secret.gh_token_secret.id
# #   role      = "roles/secretmanager.secretAccessor"
# #   member    = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-dataform.iam.gserviceaccount.com"
# # }

# # #https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataform_repository
# # resource "google_dataform_repository" "bqdataform_repository" {
# #   provider = google-beta
# #   name = "${var.proj_name}-dataform-repo"
# #   display_name = "${var.proj_name}-dataform-repo"
# #   git_remote_settings {
# #       url = "https://github.com/Gui-go/gcp_billing_analytics.git"
# #       default_branch = "main"
# #       authentication_token_secret_version = "projects/292524820499/secrets/dataform-github-personal-access-token/versions/latest" #TODO
# #   }
# #   workspace_compilation_overrides {
# #     default_database = var.proj_id
# #     schema_suffix = ""
# #     table_prefix = ""
# #   }
# #   # depends_on = [google_bigquery_dataset.tf_bqdataset_bronze]
# # }

# # resource "google_dataform_repository_release_config" "tf_bqdataform_release" {
# #   provider = google-beta
# #   project    = google_dataform_repository.bqdataform_repository.project
# #   region     = google_dataform_repository.bqdataform_repository.region
# #   repository = google_dataform_repository.bqdataform_repository.name
# #   name          = "my_release"
# #   git_commitish = "main"
# #   cron_schedule = "0 7 * * *"
# #   time_zone     = "America/New_York"
# #   code_compilation_config {
# #     default_database = "bronze"
# #     default_schema   = "bronze"
# #     default_location = var.location
# #     assertion_schema = "example-assertion-dataset"
# #     database_suffix  = ""
# #     schema_suffix    = ""
# #     table_prefix     = ""
# #     vars = {
# #       var1 = "value"
# #     }
# #   }
# # }

# # resource "google_dataform_repository_workflow_config" "tf_bqdataform_workflow" {
# #   provider       = google-beta
# #   project        = google_dataform_repository.bqdataform_repository.project
# #   region         = google_dataform_repository.bqdataform_repository.region
# #   repository     = google_dataform_repository.bqdataform_repository.name
# #   name           = "my_workflow"
# #   release_config = google_dataform_repository_release_config.tf_bqdataform_release.id
# #   invocation_config {
# #     included_targets {
# #       database = "silver"
# #       schema   = "schema1"
# #       name     = "target1"
# #     }
# #     included_targets {
# #       database = "gold"
# #       schema   = "schema2"
# #       name     = "target2"
# #     }
# #     transitive_dependencies_included         = true
# #     transitive_dependents_included           = true
# #     fully_refresh_incremental_tables_enabled = false
# #     # service_account                          = google_service_account.dataform_sa.email
# #   }
# #   cron_schedule   = "0 7 * * *"
# #   time_zone       = "America/New_York"
# # }

# # --------------------------------------------------------------


# # resource "google_storage_bucket" "tf_rawbucket" {
# #   name          = "${var.proj_name}-raw-bucket"
# #   project       = var.proj_id
# #   location      = var.location
# #   storage_class = "COLDLINE" # NEARLINE COLDLINE ARCHIVE
# #   lifecycle_rule {
# #     action {
# #       type          = "SetStorageClass"
# #       storage_class = "ARCHIVE"
# #     }
# #     condition {
# #       age = 180 # Move to ARCHIVE after 180 days
# #     }
# #   }
# #   labels = {
# #     environment = "varproj_name"
# #     project     = var.proj_id
# #     owner       = var.tag_owner
# #   }
# # }

# # resource "google_storage_bucket" "rstudio_bucket" {
# #   project  = var.proj_id
# #   name     = "${var.proj_id}-rstudio-bucket"
# #   location = var.location
# #   versioning {
# #     enabled = true
# #   }
# #   uniform_bucket_level_access = true
# # }




