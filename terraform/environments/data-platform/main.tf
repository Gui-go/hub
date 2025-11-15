# /environments/data-platform/main.tf

# 1. Define the Remote State Backend (Unique prefix for the data-platform project)
terraform {
  backend "gcs" {
    bucket = "state4hub29data"
    prefix = "terraform/state/data-platform"
  }
}

# 2. Define the Google Provider (Targets the data-platform Project ID)
provider "google" {
  project = var.proj_id
  region  = var.region
}

# modules
