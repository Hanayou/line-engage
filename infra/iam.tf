# ── Artifact Registry ─────────────────────────────────
resource "google_artifact_registry_repository" "main" {
  location      = var.region
  repository_id = "line-engage"
  format        = "DOCKER"
  description   = "Docker images for LINE Engage services"
}

# ── Service Accounts ──────────────────────────────────
resource "google_service_account" "api" {
  account_id   = "line-engage-api"
  display_name = "LINE Engage API Service"
}

resource "google_service_account" "web" {
  account_id   = "line-engage-web"
  display_name = "LINE Engage Web Service"
}

# Cloud SQL client role for API
resource "google_project_iam_member" "api_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.api.email}"
}

# Secret accessor for both services
resource "google_project_iam_member" "api_secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.api.email}"
}

resource "google_project_iam_member" "web_secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.web.email}"
}
