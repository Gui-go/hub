terraform {
  backend "gcs" {
    bucket  = "hub-infra027gcs4state"
    prefix  = "terraform/state"
    credentials = "../ghactionsSA-key.json"
  }
}