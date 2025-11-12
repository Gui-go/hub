
output "gh_token_secret" {
  value       = google_secret_manager_secret.gh_token_secret.name
  description = "The fully qualified name of the GitHub token secret"
  sensitive   = true
}

output "proxy_secret_id" {
  value       = google_secret_manager_secret.proxy_secret.id
  description = "The fully qualified ID of the proxy secret"
  sensitive   = true
}
