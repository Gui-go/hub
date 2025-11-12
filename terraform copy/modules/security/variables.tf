# variable "proj_name" {
#   description = "Project name identifier"
#   type        = string
# }

variable "proj_id" {
  description = "Project ID identifier"
  type        = string
}

variable "proj_number" {
  description = "Project Number identifier"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

variable "tag_owner" {
  description = "Owner identifier"
  type        = string
  default     = "GuilhermeViegas"
}

variable "tag_env" {
  description = "Environment identifier"
  type        = string
  default     = "prod"
}

variable "portfolio_run_sa_email" {
  description = "Service account email for the portfolio Cloud Run service"
  type        = string
}



