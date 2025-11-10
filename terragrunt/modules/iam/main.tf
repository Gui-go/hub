resource "google_service_account" "sa" {
  for_each     = var.sa
  project      = var.project_id
  account_id   = each.value.sa_id
  display_name = each.value.sa_name
  description  = each.value.sa_desc
}

# resource "google_cloud_run_service_iam_member" "run_invoker_iam_member" {
#   for_each = toset(var.public_run_services)
#   project  = var.project_id
#   service  = each.key
#   location = var.region
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# resource "google_cloud_run_service_iam_member" "run_invoker_iam_member" {
#   for_each = {
#     for sa_key, sa_val in var.sa :
#     sa_key => sa_val
#     if contains(keys(sa_val), "cloud_run_iam")
#   }
#   project  = var.project_id
#   service  = each.value.cloud_run_iam.service[0]
#   location = var.region
#   role     = each.value.cloud_run_iam.role[0]
#   member   = "allUsers"
# }

# locals {
#   cloud_run_invoker_binding = try(var.sa.cloud_run_invoker, {})
#   run_services = compact(try(local.cloud_run_invoker_binding.services, [local.cloud_run_invoker_binding.service], [local.cloud_run_invoker_binding.name]))
#   run_roles    = compact(try(local.cloud_run_invoker_binding.roles, [local.cloud_run_invoker_binding.role]))
# }

# resource "google_cloud_run_service_iam_member" "sa_cloud_run_invoker" {
#   for_each = {
#     for service in local.run_services :
#     for role in local.run_roles :
#     "${service}-${role}" => {
#       service = service
#       role    = role
#     }
#   }

#   location = try(local.cloud_run_invoker_binding.location, var.region)
#   project  = try(local.cloud_run_invoker_binding.project, var.project_id)
#   service  = each.value.service
#   role     = each.value.role
#   member   = "serviceAccount:${google_service_account.sa["cloud_run_invoker"].email}"
# }

# "portfolio-sa" = {
#       app_run = "portfolio-app"
#       sa_id   = "portfolio-sa"
#       sa_name = "portfolio-sa"
#       sa_desc = "Portfolio Service Account"
#       bucket_iam  = {
#         bucket = "bucket2"
#         role   = ["roles/storage.admin", "roles/storage.viewer"]
#       }
#       run_iam = {
#         services = ["my-portfolio-service", "my-other-service"]
#         role     = ["roles/run.invoker", "roles/run.viewer"]
#       }
#     }
# resource "google_cloud_run_service_iam_member" "portfolio_invoker_iam_member" {
#   project  = var.proj_id
#   service  = var.run_portfolio.service
#   location = var.run_portfolio.region
#   role     = "roles/run.invoker"
#   member   = "allUsers"
#   # member = "serviceAccount:${google_service_account.portfolio_sa.email}"
# }



# resource "google_storage_bucket_iam_member" "sa_bucket_access" {
#   for_each = {
#     for pair in setproduct(
#       [for sa_key, sa in var.sa : { sa_key = sa_key, buckets = try(sa.bucket_iam.buckets, []), roles = try(sa.bucket_iam.role, [])} if lookup(sa, "bucket_iam", null) != null],
#       range(length(try(local.sa.bucket_iam.buckets, [])) * length(try(local.sa.bucket_iam.role, [])))
#     ) : "${pair[0].sa_key}.${pair[0].buckets[pair[1] % length(pair[0].buckets)]}.${pair[0].roles[floor(pair[1] / length(pair[0].buckets))]}" => {
#       sa_key = pair[0].sa_key
#       bucket = pair[0].buckets[pair[1] % length(pair[0].buckets)]
#       role   = pair[0].roles[floor(pair[1] / length(pair[0].buckets))]
#     }
#   }
#   bucket = each.value.bucket
#   role   = each.value.role
#   member = "serviceAccount:${google_service_account.sa[each.value.sa_key].email}"
# }




# resource "google_storage_bucket_iam_member" "sa_bucket_access" {
#   for_each = { for sa_key, sa in var.sa : sa_key => sa if contains(var.bucket_access_sas, sa_key) }
#   bucket   = var.bucket_name
#   role     = "roles/storage.admin"
#   member   = "serviceAccount:${google_service_account.sa[each.key].email}"
# }


# Assign Cloud Run IAM bindings for specific service accounts
# resource "google_cloud_run_service_iam_member" "sa_cloud_run_invoker" {
#   for_each = { for sa_key, sa in var.sa : sa_key => sa if contains(var.cloud_run_access_sas, sa_key) }
#   project  = var.project_id
#   service  = var.cloud_run_service_name
#   location = var.region
#   role     = "roles/run.invoker"
#   member   = "serviceAccount:${google_service_account.sa[each.key].email}"
# }

# resource "google_storage_bucket_iam_member" "sa_bucket_access" {
#   for_each = toset(var.bucket)
#   bucket   = each.value
#   member   = "serviceAccount:${google_service_account.sa.email}"
#   role     = "roles/storage.admin"
# }



# resource "google_cloud_run_service_iam_member" "portfolio_invoker_iam_member" {
#   project  = var.proj_id
#   service  = var.run_portfolio.service
#   location = var.run_portfolio.region
#   role     = "roles/run.invoker"
#   member   = "allUsers"
#   # member = "serviceAccount:${google_service_account.portfolio_sa.email}"
# }