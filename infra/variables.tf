variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-northeast1" # Tokyo
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "db_tier" {
  description = "Cloud SQL machine tier"
  type        = string
  default     = "db-f1-micro"
}

variable "db_password" {
  description = "Database password (use Secret Manager in production)"
  type        = string
  sensitive   = true
}

variable "nextauth_secret" {
  description = "NextAuth JWT secret"
  type        = string
  sensitive   = true
}
