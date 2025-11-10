variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

variable "subnet_cidr" {
  description = "CIDE subnetwork for the VPC"
  type        = string
}

variable "net_name" {
  description = "The name of the VPC network"
  type        = string
}

variable "subnet_name" {
  description = ""
  type        = string
}

variable "domain" {
  description = ""
  type        = string
}


