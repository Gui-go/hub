resource "google_storage_bucket" "buckets" {
  for_each      = var.bucket
  project       = var.project_id
  name          = each.value.bucket_name
  location      = var.location
  storage_class = each.value.storage_class
  force_destroy                = false
  uniform_bucket_level_access  = true
  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      project
      # labels,
      # effective_labels,
      # versioning,
      # public_access_prevention,
      # rpo,
      # soft_delete_policy,
      # enable_object_retention,
      # default_event_based_hold
    ]
  }
}

resource "google_artifact_registry_repository" "artifact_repository" {
  project       = var.project_id
  location      = var.region
  repository_id = var.repo_id
  description   = var.repo_desc
  format        = "DOCKER"
  cleanup_policies {
    id     = "keep-recent-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = var.keep_count
    }
  }
  lifecycle {
    ignore_changes = [
      update_time
    ]
  }
}

# resource "null_resource" "push_initial_images2" {
#   depends_on = [google_artifact_registry_repository.artifact_repository]
#   provisioner "local-exec" {
#     working_dir = "${path.root}/../../../../portfolio_app"
#     command = <<EOT
#       gcloud auth configure-docker ${var.region}-docker.pkg.dev -q
#       docker buildx build --platform linux/amd64 \
#         -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repo_id}/portfolio-app:latest \
#         -f portfolio-app.dockerfile \
#         --push .
#     EOT
#   }
# }

# resource "null_resource" "push_initial_images" {
#   depends_on = [google_artifact_registry_repository.artifact_repository]
#   provisioner "local-exec" {
#     working_dir = var.portfolio_app_path
#     command = <<EOT
#       gcloud auth configure-docker ${var.region}-docker.pkg.dev -q
#       docker buildx build --platform linux/amd64 \
#         -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repo_id}/portfolio-app:latest \
#         -f portfolio-app.dockerfile \
#         --push .
#     EOT
#   }
# }


