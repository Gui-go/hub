

provider "google" {
  project = var.proj_id
  region  = var.region
  credentials = file("../ghactionsSA-key.json")
}

provider "google-beta" {
  project     = var.proj_id
  region      = var.location
}

# provider "azurerm" {
#   features {}
#   subscription_id = "125cd73f-0eb0-497b-b8ac-589bc32789cd"
# }

# resource "azurerm_resource_group" "main_rg" {
#   name     = "foundry-tf-rg"
#   location = "East US"
# }

# resource "azurerm_cognitive_account" "openai" {
#   name                = "exampleopenaiacct"
#   location            = azurerm_resource_group.main_rg.location
#   resource_group_name = azurerm_resource_group.main_rg.name
#   kind                = "OpenAI"
#   sku_name            = "S0"

#   custom_subdomain_name = "exampleopenaiacct"

#   tags = {
#     environment = "dev"
#   }
# }





# resource "google_project_service" "apis" {
#   for_each = toset([
#     "run.googleapis.com",
#     "dns.googleapis.com",
#     "servicenetworking.googleapis.com",
#     "storage.googleapis.com",
#     "cloudfunctions.googleapis.com",
#     "eventarc.googleapis.com",
#     "cloudscheduler.googleapis.com",
#     "iam.googleapis.com",
#     "cloudbuild.googleapis.com",
#     "secretmanager.googleapis.com",
#     "vpcaccess.googleapis.com",
#     "eventarc.googleapis.com", # although not used, it is needed for google_cloudfunctions2_function
#     "pubsub.googleapis.com",    # although not used, it is needed for google_cloudfunctions2_function
#     "bigquery.googleapis.com",
#     "discoveryengine.googleapis.com",
#     "artifactregistry.googleapis.com",
#     # "vertexai.googleapis.com"
#   ])
#   project = var.proj_id
#   service = each.key
#   disable_on_destroy = false
# }

module "network" {
  source            = "./modules/network"
  proj_name         = var.proj_name
  proj_id           = var.proj_id
  region            = var.region
  tag_owner         = var.tag_owner
  vpc_subnet_cidr   = var.vpc_subnet_cidr
  # run_frontend_name = module.compute.run_frontend_name
  # run_vault_name    = module.compute.run_vault_name
  run_names         = module.compute.run_names
  domain            = var.domain
  subdomains        = var.subdomains
}


module "datalake" {
  source      = "./modules/datalake"
  proj_name   = var.proj_name
  proj_id     = var.proj_id
  proj_number = var.proj_number
  location    = var.location
  region      = var.region
  tag_owner   = var.tag_owner
#   tag_env     = var.tag_env
}

module "storage" {
  source      = "./modules/storage"
  proj_name   = var.proj_name
  proj_id     = var.proj_id
  proj_number = var.proj_number
  region      = var.region
  location    = var.location
  tag_owner   = var.tag_owner
  # tag_env     = var.tag_env
}

module "iam" {
  source        = "./modules/iam"
  proj_name     = var.proj_name
  proj_id       = var.proj_id
  proj_number   = var.proj_number
  location      = var.location
  region        = var.region
  # run_portfolio = module.compute.run_portfolio
  grafana_bucket_name = module.datalake.grafana_bucket_name
  # run_fastapi   = module.compute.run_fastapi
}

module "compute" {
  source            = "./modules/compute"
  proj_name         = var.proj_name
  proj_id           = var.proj_id
  proj_number       = var.proj_number
  region            = var.region
  location          = var.location
  run_connector_id  = module.network.run_connector_id
  # vault_bucket_name = module.datalake.vault_bucket_name
  # vault_backup_bucket_name = module.datalake.vault_backup_bucket_name
  # vault_backup_function_name = module.datalake.vault_backup_function_name
  # vault_backup_func_sa_email = module.datalake.vault_backup_func_sa_email
  # grafana_bucket_name = module.datalake.grafana_bucket_name
  portfolio_run_sa_email = module.iam.portfolio_run_sa_email
  # fastapi_run_sa_email = module.iam.fastapi_run_sa_email
  # grafana_run_sa_email = module.iam.grafana_run_sa_email
}

# module "security" {
#   source      = "./modules/security"
#   proj_id     = var.proj_id
#   proj_number = var.proj_number
#   region      = var.region
#   tag_owner   = var.tag_owner
#   tag_env     = var.tag_env
# }

# module "discovery" {
#   source      = "./modules/discovery"
#   proj_name   = var.proj_name
#   proj_id     = var.proj_id
#   # region      = var.region
#   release     = var.release
#   # zone        = var.zone
#   # tag_env   = var.tag_env
# }

# module "datawarehouse" {
#   source            = "./modules/datawarehouse"
#   proj_name         = var.proj_name
#   proj_id           = var.proj_id
#   proj_number       = var.proj_number
#   region            = var.region
#   dataform_sa_email = module.iam.dataform_sa_email
#   gh_token_secret   = module.security.gh_token_secret
# }
