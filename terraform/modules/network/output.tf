
output "vpc_network_name" {
  value = google_compute_network.vpc_net.name
}

output "vpc_network_id" {
  value = google_compute_network.vpc_net.id
}

output "vpc_connection_id" {
  value = google_service_networking_connection.vpc_connection.id
}

output "run_connector_id" {
  value = google_vpc_access_connector.run_connector.id
}

