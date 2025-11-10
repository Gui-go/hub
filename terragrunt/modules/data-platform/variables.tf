variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "location" {
  description = "Location for the dataset"
  type        = string
}

variable "dataset" {
  description = "Map of datasets to their configuration"
  type = map(object({
    dataset_id   = string
    dataset_name = string
    dataset_desc = string
  }))
}

# variable "dataset_id" {
#   description = "ID for the bq dataset"
#   type        = string
# }

# variable "dataset_name" {
#   description = "Friendly name for the bq dataset"
#   type        = string
# }

# variable "dataset_desc" {
#   description = "Description for the bq dataset"
#   type        = string
# }


