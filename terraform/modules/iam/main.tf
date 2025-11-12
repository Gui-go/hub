


# Create a service account for Terraform 
resource "google_service_account" "terraform_sa" {
  project      = var.proj_id
  account_id   = "terraform-sa"
  display_name = "Terraform Service Account"
  description  = "Service Account for Deployment via Terraform"
}

resource "google_project_iam_member" "terraform_sa_role" {
  project = var.proj_id
  role    = "roles/owner"
  member  = "serviceAccount:${google_service_account.terraform_sa.email}"
}

# Download Json key manually from GCP console
# or continue here the script to download it, make it personalhub proj dynamic on terraform provider

# # Portfolio ------------------------------------------------------------------------------------------

resource "google_service_account" "portfolio_run_sa" {
  project      = var.proj_id
  account_id   = "portfolio-sa"
  display_name = "Portfolio Service Account"
  description  = "Service Account for Portfolio Cloud Run Service"
}

# resource "google_cloud_run_service_iam_member" "portfolio_invoker_iam_member" {
#   project  = var.proj_id
#   service  = var.run_portfolio.service
#   location = var.run_portfolio.region
#   role     = "roles/run.invoker"
#   member   = "allUsers"
#   # member = "serviceAccount:${google_service_account.portfolio_sa.email}"
# }

# # FastAPI API ------------------------------------------------------------------------------------------

resource "google_service_account" "fastapi_run_sa" {
  project      = var.proj_id
  account_id   = "fastapi-sa"
  display_name = "FastAPI Service Account"
  description  = "Service Account for FastAPI Cloud Run Service"
}

resource "google_project_iam_member" "fastapi_run_sa_roles" {
  for_each = toset([
    "roles/bigquery.dataViewer",
    "roles/bigquery.jobUser",
    "roles/bigquery.admin",
    "roles/storage.objectViewer",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.fastapi_run_sa.email}"
  project = var.proj_id
}

# # Allow unauthenticated access (optional, remove if authentication is required)
# resource "google_cloud_run_service_iam_member" "public_access" {
#   project  = var.proj_id
#   service  = var.run_fastapi.service
#   location = var.region
#   role     = "roles/run.invoker"
#   # member   = "allUsers"
#   member = "serviceAccount:${google_service_account.portfolio_sa.email}"
#   # member = "serviceAccount:frontend-invoker@your-project-id.iam.gserviceaccount.com"
# }



# # BQ Dataform ------------------------------------------------------------------------------------------

resource "google_service_account" "customdataform_sa" {
  project      = var.proj_id
  account_id   = "dataform-sa"
  display_name = "Dataform SA"
}

resource "google_project_iam_member" "customdataform_sa_roles" {
  for_each = toset([
    "roles/bigquery.dataViewer",
    "roles/bigquery.jobUser",
    "roles/bigquery.dataEditor",
    "roles/bigquery.admin",
    "roles/storage.objectViewer",
    "roles/iam.serviceAccountTokenCreator",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.customdataform_sa.email}"
  project = var.proj_id
}



# # Managed BQ DataForm SA ------------------------------------------------------------------------------------------

# resource "google_project_iam_member" "manageddataform_sa_roles" {
#   for_each = toset([
#     "roles/bigquery.jobUser",
#     "roles/bigquery.dataEditor",
#     "roles/bigquery.dataViewer",
#     "roles/secretmanager.secretAccessor",
#     "roles/iam.serviceAccountTokenCreator",
#   ])
#   role    = each.key
#   member  = "serviceAccount:service-${var.proj_number}@gcp-sa-dataform.iam.gserviceaccount.com"
#   project = var.proj_id
# }

# BQ Gemini Connection -------------------------------------------------------------------------

resource "google_bigquery_connection" "bq_gemini_connection" {
  connection_id = "bq_gemini_connection"
  project       = var.proj_id
  location      = var.location
  cloud_resource {}
}

resource "google_project_iam_member" "vertex_ai_user" {
  project = var.proj_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_bigquery_connection.bq_gemini_connection.cloud_resource[0].service_account_id}"
}

resource "google_bigquery_connection_iam_member" "dataform_can_use_connection" {
  project       = var.proj_id
  location      = var.location
  connection_id = google_bigquery_connection.bq_gemini_connection.connection_id
  role          = "roles/bigquery.connectionUser"
  member        = "serviceAccount:${google_service_account.customdataform_sa.email}"
}

# BQ Remote Functions Connection -------------------------------------------------------------------------

resource "google_bigquery_connection" "bq_remote_functions_connection" {
  connection_id = "bq_remote_functions_connection"
  project       = var.proj_id
  location      = var.location
  cloud_resource {}
}

# # GH Actions SA -------------------------------------------------------------------------

# Create a service account
resource "google_service_account" "githubactions_sa" {
  project      = var.proj_id
  account_id   = "github-actions-sa"
  display_name = "GitHub Actions Service Account"
  description  = "Service Account for Deployment via GitHub Actions"
}

resource "google_project_iam_member" "githubactions_sa_roles" {
  for_each = toset([
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/iam.securityAdmin",
    "roles/artifactregistry.writer",
    "roles/storage.admin",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.githubactions_sa.email}"
  project = var.proj_id
}

# Grafana SA ----------------------------------------------------------
resource "google_service_account" "grafana_run_sa" {
  project      = var.proj_id
  account_id   = "grafana-run-sa"
  display_name = "Grafana Cloud Run Service Account"
}

resource "google_project_iam_member" "grafana_sa_roles" {
  for_each = toset([
    "roles/storage.admin",
    "roles/logging.viewer",
    "roles/monitoring.viewer",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.grafana_run_sa.email}"
  project = var.proj_id
}


# Firestore SA ----------------------------------------------------------
resource "google_service_account" "firestore_sa" {
  project      = var.proj_id
  account_id   = "firestore-sa"
  display_name = "Firestore Service Account"
}

resource "google_project_iam_member" "firestore_sa_roles" {
  for_each = toset([
    "roles/datastore.owner",
    "roles/datastore.user",
    "roles/firebase.admin",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.firestore_sa.email}"
  project = var.proj_id
}



