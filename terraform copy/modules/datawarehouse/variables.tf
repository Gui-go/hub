
variable "proj_name" {
  description = "Project name identifier"
  type        = string
}

variable "proj_id" {
  description = "Project ID identifier"
  type        = string
}

variable "proj_number" {
  description = "Project number identifier"
  type        = string
}

# variable "location" {
#   description = "Location of the resources"
#   type        = string
# }

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

variable "gh_token_secret" {
  description = "GitHub Token Secret Name"
  type        = string
}

variable "dataform_sa_email" {
  description = "DataForm Service Account email"
  type        = string
}





