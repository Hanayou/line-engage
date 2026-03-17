# VPC for private Cloud SQL access
resource "google_compute_network" "main" {
  name                    = "line-engage-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  name          = "line-engage-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id
}

# VPC connector for Cloud Run → Cloud SQL
resource "google_vpc_access_connector" "connector" {
  name          = "line-engage-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.main.name
}

# Private IP for Cloud SQL
resource "google_compute_global_address" "private_ip" {
  name          = "line-engage-db-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_service_networking_connection" "private_vpc" {
  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip.name]
}
