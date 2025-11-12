output "grafana_bucket_name" {
  description = "Name of the GCS Grafana bucket"
  value       = google_storage_bucket.grafana_bucket.name
}

# output "vault_bucket_name" {
#   description = "Name of the GCS Vault bucket"
#   value       = google_storage_bucket.vaultwarden_bucket.name
# }

# output "vault_backup_bucket_name" {
#   description = "Name of the GCS Vault backup bucket"
#   value       = google_storage_bucket.vaultwarden_backup_bucket.name
# }

# output "vault_backup_function_name" {
#   description = "Name of vault backup function"
#   value       = google_storage_bucket_object.vaultwarden_backup_func_src.name
# }

# output "vault_backup_func_sa_email" {
#   description = "The email of the created service account"
#   value = google_service_account.vault_backup_func_sa.email
# }


