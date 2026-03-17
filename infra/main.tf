terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.28"
    }
  }

  # Remote state in GCS bucket (create bucket manually first)
  backend "gcs" {
    bucket = "line-engage-tfstate"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
