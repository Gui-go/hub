terraform {
  backend "gcs" {
    bucket = "hub26gcs4state-1762736768"
    prefix = "terragrunt/environments/dev"
  }
}
