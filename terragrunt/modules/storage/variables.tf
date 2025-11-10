variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "location" {
  description = "The GCS bucket location"
  type        = string
  default     = "US"
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "bucket" {
  description = "Map of bucket names to their configuration (location, storage class, etc.)"
  type = map(object({
    bucket_name   = string
    storage_class = string
  }))
}

variable "repo_id" {
  description = "Repository ID"
  type        = string
  default     = "artifact-repo"
}

variable "repo_desc" {
  description = "Repository description"
  type        = string
  default     = "Docker repository for storing container images"
}

variable "keep_count" {
  description = "The number of images to be kept before deletion"
  type        = number
  default     = 1
}


variable "portfolio_app_path" {
  description = "Portfolio app folder path"
  type        = string
}

