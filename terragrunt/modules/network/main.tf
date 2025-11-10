resource "google_compute_network" "vpc_net" {
  project                 = var.project_id
  name                    = var.net_name
  auto_create_subnetworks = true
}

resource "google_compute_subnetwork" "vpc_subnet" {
  project                  = var.project_id
  name                     = var.subnet_name
  ip_cidr_range            = var.subnet_cidr
  network                  = google_compute_network.vpc_net.id
  region                   = var.region
  private_ip_google_access = true
}

resource "google_compute_global_address" "lb_ip" {
  name    = "lb-ip"
  project = var.project_id
}

resource "google_dns_managed_zone" "dns_zone" {
  name        = "dns-zone"
  project     = var.project_id
  dns_name    = "${var.domain}."
  description = "DNS zone for the domain"
}




