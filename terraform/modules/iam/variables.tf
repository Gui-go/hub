variable "proj_name" {
  description = "Project name"
  type        = string
}

variable "proj_id" {
  description = "Project ID identifier"
  type        = string
}

variable "location" {
  description = "Location of the resources"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

# variable "tag_owner" {
#   description = "Tag to describe the owner of the resources"
#   type        = string
# }

variable "proj_number" {
  description = "Project Number identifier"
  type        = string
}

variable "grafana_bucket_name" {
  description = "Grafana bucket name"
  type        = string
}



# variable "run_portfolio" {
#   description = "GCP Cloud Run service for Portfolio"
#   type = object({
#     service  = string
#     region   = string
#   })
# }

# variable "run_fastapi" {
#   description = "GCP Cloud Run service for FastAPI"
#   type = object({
#     service  = string
#     region   = string
#   })
# }

