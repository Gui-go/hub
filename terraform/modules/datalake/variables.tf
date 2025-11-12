variable "proj_name" {
  description = "Project name identifier"
  type        = string
}

variable "proj_id" {
  description = "Project ID identifier"
  type        = string
}

variable "proj_number" {
  description = "Project Number identifier"
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

variable "enabled_apis" {
  type        = map(any)
  description = "Map of enabled Google Cloud APIs"
  default     = {}
}



