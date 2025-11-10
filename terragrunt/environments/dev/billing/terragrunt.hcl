locals {
  parent_vars = read_terragrunt_config("../terragrunt.hcl")
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//billing"
}

inputs = {
  project_id   = local.parent_vars.inputs.project_id
  location     = local.parent_vars.inputs.location
  dataset_id   = "billing_export"
  dataset_name = "Billing Export"
  dataset_desc = "A BQ dataset for billing export data"
}

