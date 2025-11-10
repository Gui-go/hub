# terraform {
#   experiments = [module_variable_optional_attrs]
# }

resource "google_cloud_run_v2_service" "run_portfolio" {
  for_each = var.apps
  project  = var.project_id
  name     = each.value.app_name
  location = var.region
  ingress  = each.value.ingress
  deletion_protection = false
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repo_id}/${each.value.app_name}:latest"
      ports { container_port = each.value.port }
      resources {
        limits = {
          cpu    = each.value.cpu
          memory = each.value.memory
        }
      }
    }
    scaling {
      max_instance_count = each.value.max_instance
      min_instance_count = each.value.min_instance
    }
    vpc_access {
      connector = google_vpc_access_connector.run_connector[each.key].id
      egress = each.value.egress
    }
    timeout = each.value.timeout
    service_account = each.value.service_account
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_vpc_access_connector" "run_connector" {
  for_each       = var.apps
  project        = var.project_id
  name           = each.value.connector_name
  region         = var.region
  ip_cidr_range  = each.value.ip_cidr
  network        = var.network_id
  min_throughput = 200
  max_throughput = 300
}

resource "google_cloud_run_service_iam_member" "run_invoker_iam_member" {
  for_each = {
    for app_key, app_val in var.apps :
    app_key => app_val
    if try(app_val.cloud_run_iam, null) != null
  }
  project  = var.project_id
  service  = google_cloud_run_v2_service.run_portfolio[each.key].name
  location = var.region
  role     = each.value.cloud_run_iam.role
  member   = "allUsers"
}

resource "google_compute_region_network_endpoint_group" "neg_region" {
  for_each              = var.apps
  name                  = "${each.key}-neg"
  region                = var.region
  project               = var.project_id
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = each.value.cloud_run_iam.service
  }
}

resource "google_compute_backend_service" "backend" {
  for_each    = var.apps
  name        = "${each.key}-backend"
  project     = var.project_id
  protocol    = "HTTPS"
  # timeout_sec = 360
  enable_cdn = true
  backend {
    group = google_compute_region_network_endpoint_group.neg_region[each.key].id
  }
  log_config {
    enable      = true
    sample_rate = 1.0
  }
}

resource "google_compute_url_map" "url_map" {
  for_each = var.apps
  name     = "${each.key}-url-map"
  project  = var.project_id
  default_service = google_compute_backend_service.backend[keys(var.apps)[0]].id
  dynamic "host_rule" {
    for_each = var.apps
    content {
      hosts        = ["${host_rule.value.subdomain}.${host_rule.value.domain}"]
      path_matcher = "${host_rule.key}-matcher"
    }
  }
  dynamic "path_matcher" {
    for_each = var.apps
    content {
      name            = "${path_matcher.key}-matcher"
      default_service = google_compute_backend_service.backend[path_matcher.key].id
      path_rule {
        paths   = ["/*"]
        service = google_compute_backend_service.backend[path_matcher.key].id
      }
    }
  }
}

resource "google_compute_url_map" "http_redirect" {
  for_each = var.apps
  name     = "${each.key}-http-redirect"
  project  = var.project_id
  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_managed_ssl_certificate" "ssl_certs" {
  for_each = var.apps
  name    = "${each.key}-ssl-cert"
  project = var.project_id
  managed {
    domains = ["${each.value.subdomain}.${each.value.domain}"]
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_compute_target_https_proxy" "https_proxy" {
  for_each         = var.apps
  name             = "${each.key}-https-proxy"
  project          = var.project_id
  url_map          = google_compute_url_map.url_map[each.key].id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl_certs[each.key].id]
  depends_on       = [google_compute_managed_ssl_certificate.ssl_certs]
  lifecycle {
    create_before_destroy = true
  }
}

# HTTP Proxy for Redirect
resource "google_compute_target_http_proxy" "http_proxy" {
  for_each         = var.apps
  name    = "${each.key}-http-proxy"
  project = var.project_id
  url_map = google_compute_url_map.http_redirect[each.key].id
}

# Global IP Address
## do I need one for each?
# resource "google_compute_global_address" "lb_ip" {
#   for_each         = var.apps
#   name    = "${each.key}-lb-ip"
#   project = var.project_id
# }

# resource "google_compute_global_address" "cloudsql_peering_range" {
#   for_each         = var.apps
#   name          = "cloudsql-peering-range"
#   project       = var.project_id
#   purpose       = "VPC_PEERING"
#   address_type  = "INTERNAL"
#   prefix_length = 16
#   network       = google_compute_network.vpc_net.id
# }

# resource "google_service_networking_connection" "vpc_connection" {
#   network                 = google_compute_network.vpc_net.id
#   service                 = "servicenetworking.googleapis.com"
#   reserved_peering_ranges = [google_compute_global_address.cloudsql_peering_range.name]
#   # depends_on              = [google_project_service.service_networking]
# }



# HTTPS Forwarding Rule
resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  for_each         = var.apps
  name                  = "${each.key}-https-forwarding-rule"
  project               = var.project_id
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.https_proxy[each.key].id
  ip_address            = var.lb_ip_id
}

# # HTTP Forwarding Rule for Redirect
resource "google_compute_global_forwarding_rule" "http_forwarding_rule" {
  for_each         = var.apps
  name                  = "${each.key}-http-forwarding-rule"
  project               = var.project_id
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "80"
  target                = google_compute_target_http_proxy.http_proxy[each.key].id
  ip_address            = var.lb_ip_id
}


## It may take long to repair if deleted. Takes a while to propagate DNS mappings.
# resource "google_dns_managed_zone" "dns_zone" {
#   for_each         = var.apps
#   name        = "${each.key}-dns-zone"
#   project     = var.project_id
#   dns_name    = "${each.value.domain}."
#   description = "DNS zone for the domain"
# }

resource "google_dns_record_set" "subdomain_records" {
  for_each         = var.apps
  # for_each     = toset(var.subdomains)
  name         = "${each.value.subdomain}.${each.value.domain}."
  project      = var.project_id
  managed_zone = var.dns_zone_name
  # managed_zone = google_dns_managed_zone.dns_zone[each.key].name
  type         = "A"
  ttl          = 300
  rrdatas      = [var.lb_ip_address]
}

