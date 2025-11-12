variable "release" {
  description = "Release version"
  type        = string
}

variable "proj_name" {
  description = "Project name"
  type        = string
}

variable "proj_id" {
  description = "Project ID identifier"
  type        = string
}

variable "proj_number" {
  description = "Project Number identifier"
  type        = string
}

variable "location" {
  description = "Location of the resources"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

variable "zone" {
  description = "Zone of the resources"
  type        = string
}

variable "tag_owner" {
  description = "Tag to describe the owner of the resources"
  type        = string
}

variable "tag_env" {
  description = "Tag to describe the environment of the resources"
  type        = string
}

# variable "vault_bucket_name" {
#   description = "Vaultwarden bucket name"
#   type        = string
# }

# variable "vault_backup_bucket_name" {
#   description = "Vaultwarden backup bucket name"
#   type        = string
# }

# variable "vault_backup_function_name" {
#   description = "Vaultwarden backup function name"
#   type        = string
# }

# variable "vault_backup_func_sa_email" {
#   description = "Vaultwarden backup function Service Account email"
#   type        = string
# }

# variable "run_connector_id" {
#   description = "Cloud Run Connector ID identifier"
#   type        = string
# }


# variable "portfolio_sa_email" {
#   description = "Portfolio Service Account email"
#   type        = string
# }

# variable "fastapi_sa_email" {
#   description = "FastAPI Service Account email"
#   type        = string
# }

variable "github_owner" {
  description = "GitHub owner name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "vpc_subnet_cidr" {
  description = "CIDE subnetwork for the VPC"
  type        = string
}

variable "domain" {
  description = "Root domain name"
  type        = string
}

variable "subdomains" {
  description = "List of subdomains to route"
  type        = list(string)
}
