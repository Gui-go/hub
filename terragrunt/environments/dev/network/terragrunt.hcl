locals {
  parent_vars = read_terragrunt_config("../terragrunt.hcl")
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//network"
}

inputs = {
  project_id  = local.parent_vars.inputs.project_id
  region      = local.parent_vars.inputs.region
  subnet_cidr = "10.0.1.0/24"
  net_name    = "vpc-net"
  subnet_name = "vpc-subnet"
  domain      = "guigo.dev.br"
  # subdomains       = [
  #   "www", 
  #   # "api", 
  #   # "rstudio", 
  #   # "grafana"
  # ]
  # run_names = {
  #   "www" = "www-service"
  #   # "api" = "api-service"
  # }
}





