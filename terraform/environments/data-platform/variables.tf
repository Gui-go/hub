variable "release" {
  description = "Release version"
  type        = string
}

variable "proj_name" {
  description = "Project name"
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

variable "zone" {
  description = "Zone of the resources"
  type        = string
}

variable "tag_owner" {
  description = "Tag to describe the owner of the resources"
  type        = string
}

variable "tag_env" {
  description = "Tag to describe the environment of the resources"
  type        = string
}

variable "github_owner" {
  description = "GitHub owner name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}
