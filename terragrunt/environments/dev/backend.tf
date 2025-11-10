terraform {
  backend "gcs" {
    bucket = "hub26gcs4state"
    prefix = "terragrunt/environments/dev"
  }
}
