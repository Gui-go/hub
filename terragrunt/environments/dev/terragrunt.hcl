locals {
  env_vars_path = try(find_in_parent_folders("env.hcl"), "env.hcl")
  env_vars      = read_terragrunt_config(local.env_vars_path)
}



generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
  provider "google" {
    project = "${local.env_vars.inputs.project_id}"
    region  = "${local.env_vars.inputs.region}"
  }
  EOF
}

inputs = local.env_vars.inputs


