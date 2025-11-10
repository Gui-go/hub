output "vpc_self_link" {
  value = google_compute_network.vpc_net.self_link
}

output "subnet_self_link" {
  value = google_compute_subnetwork.vpc_subnet.self_link
}


output "network_id" {
  value = google_compute_network.vpc_net.id
}

output "subnet_id" {
  value = google_compute_subnetwork.vpc_subnet.id
}


output "network_name" {
  value = google_compute_network.vpc_net.name
}

output "dns_zone_name" {
  value = google_dns_managed_zone.dns_zone.name
}

output "lb_ip_id" {
  value = google_compute_global_address.lb_ip.id
}

output "lb_ip_address" {
  value = google_compute_global_address.lb_ip.address
}


# output "lb_ip_address" {
#   description = "The IP address of the load balancer."
#   value       = google_compute_global_address.lb_ip.address
# }

output "dns_zone_name_servers" {
  description = "The name servers for the DNS zone."
  value       = google_dns_managed_zone.dns_zone.name_servers
}

