output "service_name" {
  value = { for k, v in google_cloud_run_v2_service.run_portfolio : k => v.name }
}