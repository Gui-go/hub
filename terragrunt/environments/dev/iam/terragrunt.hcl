locals {
  parent_vars = read_terragrunt_config("../terragrunt.hcl")
}

terraform {
  source = "${get_repo_root()}/terragrunt/modules//iam"
}

inputs = {
  project_id = local.parent_vars.inputs.project_id
  region     = local.parent_vars.inputs.region
  sa = {
    "terraform-sa" = {
      sa_id   = "terraform-sa"
      sa_name = "terraform-sa"
      sa_desc = "Terraform Service Account"
    }
    "portfolio-sa" = {
      sa_id   = "portfolio-sa"
      sa_name = "portfolio-sa"
      sa_desc = "Portfolio Service Account"
      cloud_run_iam = {
        service = ["portfolio-app"]
        role    = ["roles/run.invoker"]
      }
    }
    "fastapi-sa" = {
      sa_id   = "fastapi-sa"
      sa_name = "fastapi-sa"
      sa_desc = "FastAPI Service Account"
    }
    "dataform-sa" = {
      sa_id   = "dataform-sa"
      sa_name = "dataform-sa"
      sa_desc = "DataForm Service Account"
    }
    "gh-actions-sa" = {
      sa_id   = "gh-actions-sa"
      sa_name = "gh-actions-sa"
      sa_desc = "GitHub Actions Service Account"
    }
    "grafana-sa" = {
      sa_id   = "grafana-sa"
      sa_name = "grafana-sa"
      sa_desc = "Grafana Service Account"
    }
    "firestore-sa" = {
      sa_id   = "firestore-sa"
      sa_name = "firestore-sa"
      sa_desc = "FireStore Service Account"
    }
  }
}


