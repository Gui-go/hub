output "bucket_urls" {
  value = { for k, v in google_storage_bucket.buckets : k => v.name }
}

output "bucket_names" {
  value = [for b in google_storage_bucket.buckets : b.name]
}

output "repo_id" {
    description = "The ID of the Artifact Registry repository"
    value       = google_artifact_registry_repository.artifact_repository.repository_id
}

# output "repo_name" {
#     description = "The name of the Artifact Registry repository"
#     value       = google_artifact_registry_repository.artifact_repository.name
# }

output "repo_location" {
    description = "The location of the Artifact Registry repository"
    value       = google_artifact_registry_repository.artifact_repository.location
}

output "repo_format" {
    description = "The format of the Artifact Registry repository"
    value       = google_artifact_registry_repository.artifact_repository.format
}

output "repo_create_time" {
    description = "The creation time of the Artifact Registry repository"
    value       = google_artifact_registry_repository.artifact_repository.create_time
}

output "repo_update_time" {
    description = "The update time of the Artifact Registry repository"
    value       = google_artifact_registry_repository.artifact_repository.update_time
}



