resource "google_bigquery_dataset" "billing_export_dataset" {
  dataset_id    = var.dataset_id
  friendly_name = var.dataset_name
  description   = var.dataset_desc
  location      = var.location
  project       = var.project_id
}