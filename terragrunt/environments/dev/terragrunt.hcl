locals {
  common_vars_path = try(find_in_parent_folders("common.hcl"), "common.hcl")
  common_vars      = read_terragrunt_config(local.common_vars_path)
}

remote_state {
  backend = "gcs"
  config = {
    bucket = "hub26gcs4state"
    # prefix   = "terragrunt/${path_relative_to_include()}"
    prefix = "terragrunt/environments/dev"
    # prefix   = "${path_relative_to_include()}/terraform.tfstate"
    project  = local.common_vars.inputs.project_id
    location = local.common_vars.inputs.location
  }
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  # disable_init_prompt = true
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
  provider "google" {
    project = "${local.common_vars.inputs.project_id}"
    region  = "${local.common_vars.inputs.region}"
  }
  EOF
}

inputs = local.common_vars.inputs


