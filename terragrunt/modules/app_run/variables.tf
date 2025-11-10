variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "Region of the resources"
  type        = string
}

# variable "app_name" {
#   description = "Name of the Cloud Run app"
#   type        = string
# }

variable "repo_id" {
  description = "ID of the Artifact Registry"
  type        = string
}

variable "dns_zone_name" {
  description = ""
  type        = string
}

variable "lb_ip_id" {
  description = ""
  type        = string
}

variable "lb_ip_address" {
  description = ""
  type        = string
}



# variable "ingress" {
#   description = ""
#   type        = string
# }

# variable "egress" {
#   description = ""
#   type        = string
# }

# variable "port" {
#   description = ""
#   type        = number
#   default     = 8080
# }

# variable "cpu" {
#   description = "The number of CPUs"
#   type        = string
# }

# variable "memory" {
#   description = ""
#   type        = string
# }

# variable "min_instance" {
#   description = ""
#   type        = number
#   default     = 0
# }

# variable "max_instance" {
#   description = ""
#   type        = number
#   default     = 1
# }

# variable "run_connector" {
#   description = ""
#   type        = string
#   default     = ""
# }

# variable "timeout" {
#   description = ""
#   type        = string
# }

# variable "service_account" {
#   description = ""
#   type        = string
# }

variable "network_id" {
  description = ""
  type        = string
}

# variable "connector_name" {
#   description = ""
#   type        = string
# }

# variable "ip_cidr" {
#   description = ""
#   type        = string
# }

variable "apps" {
  description = "Map of applications with their configuration"
  type = map(object({
    app_id          = string
    app_name        = string
    app_desc        = string
    domain          = optional(string)
    subdomain       = optional(string)
    ingress         = optional(string)
    port            = optional(number)
    cpu             = optional(string)
    memory          = optional(string)
    min_instance    = optional(number)
    max_instance    = optional(number)
    connector_name  = optional(string)
    ip_cidr         = optional(string)
    egress          = optional(string)
    timeout         = optional(string)
    service_account = optional(string)
    cloud_run_iam   = optional(object({
      service = string
      role    = string
    }))
  }))
}


