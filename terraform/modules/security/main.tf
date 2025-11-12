

# GitHub account settings > Developer settings > Personal access tokens > Tokens (classic)
resource "google_secret_manager_secret" "gh_token_secret" {
  project   = var.proj_id
  secret_id = "gh-access-token-secret"
  labels = {
    label = "gh-token123"
    owner = var.tag_owner
    env   = var.tag_env
  }
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}


resource "google_secret_manager_secret" "main_secret" {
  project   = var.proj_id
  secret_id = "main-secret"
  labels = {
    owner = var.tag_owner
    env   = var.tag_env
  }
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

