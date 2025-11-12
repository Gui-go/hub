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

# variable "zone" {
#   description = "Zone of the resources"
#   type        = string
# }

variable "tag_owner" {
  description = "Tag to describe the owner of the resources"
  type        = string
}

variable "vpc_subnet_cidr" {
  description = "CIDE subnetwork for the VPC"
  type        = string
}

# variable "run_frontend_name" {
#   description = "Run instance frontend output name"
#   type        = string
# }

variable "run_names" {
  description = "Mapping of run instances names"
  type        = map(string)
}

variable "domain" {
  description = "Root domain name"
  type        = string
}

variable "subdomains" {
  description = "List of subdomains to route"
  type        = list(string)
}

