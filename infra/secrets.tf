# ── Secret Manager ────────────────────────────────────
resource "google_secret_manager_secret" "db_password" {
  secret_id = "line-engage-db-password"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

resource "google_secret_manager_secret" "nextauth_secret" {
  secret_id = "line-engage-nextauth-secret"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "nextauth_secret" {
  secret      = google_secret_manager_secret.nextauth_secret.id
  secret_data = var.nextauth_secret
}
