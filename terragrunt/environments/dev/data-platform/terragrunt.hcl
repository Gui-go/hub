locals {
  env_vars = read_terragrunt_config("../env.hcl")
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//data-platform"
}

inputs = {
  project_id = local.env_vars.inputs.project_id
  location   = local.env_vars.inputs.location
  region     = local.env_vars.inputs.region
  dataset = {
    "bronze" = {
      dataset_id   = "bronze"
      dataset_name = "bronze"
      dataset_desc = "Dataset for loading raw/unprocessed tables into BigQuery"
    }
    "silver" = {
      dataset_id   = "silver"
      dataset_name = "silver"
      dataset_desc = "Dataset for cleaned tables and transformations in BigQuery"
    }
    "gold" = {
      dataset_id   = "gold"
      dataset_name = "gold"
      dataset_desc = "Dataset for joined tables in BigQuery"
    }
    "mart" = {
      dataset_id   = "mart"
      dataset_name = "mart"
      dataset_desc = "Dataset for serving ready tables from BigQuery"
    }
  }
}







