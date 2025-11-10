locals {
  env_vars = read_terragrunt_config("../env.hcl")
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//storage"
}

inputs = {
  project_id = local.env_vars.inputs.project_id
  region     = local.env_vars.inputs.region
  bucket = {
    "raw" = {
      bucket_name   = "${local.env_vars.inputs.project_id}-${local.env_vars.inputs.env}-raw"
      storage_class = "STANDARD"
    }
    "mart" = {
      bucket_name   = "${local.env_vars.inputs.project_id}-${local.env_vars.inputs.env}-mart"
      storage_class = "STANDARD"
    }
  }
  repo_id            = "artifact-repo"
  repo_desc          = "Docker repository for storing container images"
  keep_count         = 1
  portfolio_app_path = "/home/guigo/Documents/01-hub/portfolio_app"
}





