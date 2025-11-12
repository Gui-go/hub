

output "portfolio_run_sa_email" {
  value = google_service_account.portfolio_run_sa.email
}

output "fastapi_run_sa_email" {
  value = google_service_account.fastapi_run_sa.email
}

output "grafana_run_sa_email" {
  value = google_service_account.grafana_run_sa.email
}

output "dataform_sa_email" {
  value = google_service_account.customdataform_sa.email
}
