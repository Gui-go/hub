# /environments/gcp-infra-project/main.tf

# 1. Define the Remote State Backend (Unique prefix for the Infra project)
terraform {
  backend "gcs" {
    bucket = "state4hub29infra"
    prefix = "terraform/state"
  }
}

# 2. Define the Google Provider (Targets the Infra Project ID)
provider "google" {
  project = var.proj_id
  region  = var.region
  # credentials = file("../../../ghactionsSA-hub-infra-key.json")
}


# modules
