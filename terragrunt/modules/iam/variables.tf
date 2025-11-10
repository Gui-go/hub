variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

variable "sa" {
  description = "Map of service accounts to create"
  type        = any
  default     = {}
}

variable "artifact_registry_readers" {
  description = "List of service account keys that should have Artifact Registry Reader role"
  type        = list(string)
  default     = []
}

variable "public_run_services" {
  description = "List of Cloud Run service names to make public"
  type        = list(string)
  default     = []
}