resource "google_bigquery_dataset" "dataset" {
  for_each      = var.dataset
  dataset_id    = each.value.dataset_id
  friendly_name = each.value.dataset_name
  description   = each.value.dataset_desc
  location      = var.location
  project       = var.project_id
}

