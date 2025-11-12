terraform {
  backend "gcs" {
    bucket  = "hub027gcs4state"
    prefix  = "terraform/state"
    credentials = "../ghactionsSA-key.json"
  }
}