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

# variable "vpc_network_id" {
#   description = "VPC Network ID identifier"
#   type        = string
# }

# variable "vpc_connection_id" {
#   description = "VPC connection ID identifier"
#   type        = string
# }

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





