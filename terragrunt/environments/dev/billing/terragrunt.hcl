locals {
  env_vars = read_terragrunt_config("../env.hcl")
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//billing"
}

inputs = {
  project_id   = local.env_vars.inputs.project_id
  location     = local.env_vars.inputs.location
  dataset_id   = "billing_export"
  dataset_name = "Billing Export"
  dataset_desc = "A BQ dataset for billing export data"
}

