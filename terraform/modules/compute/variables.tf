variable "proj_name" {
  description = "Project name"
  type        = string
}

variable "proj_id" {
  description = "Project ID identifier"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

variable "location" {
  description = "Location of the resources"
  type        = string
}

# variable "tag_owner" {
#   description = "Tag to describe the owner of the resources"
#   type        = string
# }

# variable "vault_bucket_name" {
#   description = "Vaultwarden bucket name"
#   type        = string
# }

# variable "vault_backup_bucket_name" {
#   description = "Vaultwarden backup bucket name"
#   type        = string
# }

# variable "vault_backup_function_name" {
#   description = "Vaultwarden backup function name"
#   type        = string
# }

# variable "vault_backup_func_sa_email" {
#   description = "Vaultwarden backup function Service Account email"
#   type        = string
# }

variable "run_connector_id" {
  description = "Cloud Run Connector ID identifier"
  type        = string
}

variable "proj_number" {
  description = "Project Number identifier"
  type        = string
}

variable "portfolio_run_sa_email" {
  description = "Portfolio Service Account email"
  type        = string
}

# variable "grafana_run_sa_email" {
#   description = "Grafana Service Account email"
#   type        = string
# }

# variable "fastapi_run_sa_email" {
#   description = "FastAPI Service Account email"
#   type        = string
# }

# variable "grafana_bucket_name" {
#   description = "Grafana bucket name"
#   type        = string
# }


