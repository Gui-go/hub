
## Billing Analytics ----------------------------------------------------------------------------------

# #https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataform_repository
resource "google_dataform_repository" "billinganalytics_repo" {
  provider = google-beta
  name = "billing-repo"
  display_name = "Billing Analytics DataForm Repository"
  region     = var.region
  service_account = var.dataform_sa_email
  git_remote_settings {
      url = "https://github.com/Gui-go/gcp_billing_analytics.git"
      default_branch = "main"
      authentication_token_secret_version = var.gh_token_secret
  }
  workspace_compilation_overrides {
    default_database = var.proj_id
    schema_suffix = ""
    table_prefix = ""
  }
  # depends_on = [google_bigquery_dataset.bqdataset_bronze]   ####### dataset source
}



resource "google_dataform_repository_release_config" "main_release" {
  provider = google-beta
  project    = google_dataform_repository.billinganalytics_repo.project
  region     = google_dataform_repository.billinganalytics_repo.region
  repository = google_dataform_repository.billinganalytics_repo.name
  name          = "main_release"
  git_commitish = "main"
  cron_schedule = "45 5 * * *" # everyday at 5:45
  time_zone     = "Europe/Berlin" # "America/New_York"
  code_compilation_config {
    # default_database = "billing_source"
    # default_schema   = "bronze"
    # assertion_schema = "example-assertion-dataset"
    # database_suffix  = ""
    # schema_suffix    = ""
    # table_prefix     = ""
    vars = {
      ENV: "prod"
      PROJ_BILL_DUMP: "dump-billing-export1"
      DATASET_BILL_DUMP: "billing_dataset"
      BILLING_ACCOUNT: "01F474_510F73_35550F"
      GEMINI_CNX: "bq_gemini_connection"
    }
  }
}

resource "google_dataform_repository_workflow_config" "main_workflow" {
  provider       = google-beta
  project        = google_dataform_repository.billinganalytics_repo.project
  region         = google_dataform_repository.billinganalytics_repo.region
  repository     = google_dataform_repository.billinganalytics_repo.name
  name           = "main_workflow"
  release_config = google_dataform_repository_release_config.main_release.id
  invocation_config {
    # included_targets {
    #   database = "silver"
    #   schema   = "schema1"
    #   name     = "target1"
    # }
    # included_targets {
    #   database = "gold"
    #   schema   = "schema2"
    #   name     = "target2"
    # }
    transitive_dependencies_included         = true
    transitive_dependents_included           = true
    fully_refresh_incremental_tables_enabled = false
    service_account                          = var.dataform_sa_email
  }
  cron_schedule   = "0 6 * * *"
  time_zone       = "Europe/Berlin"            # "Etc/GMT" # Greenwich Mean Time (UTC+0)
}




## BRvectors ----------------------------------------------------------------------------------

# #https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataform_repository
resource "google_dataform_repository" "bqdataform_brvectos_repo" {
  provider = google-beta
  name = "brvectors-repo"
  display_name = "BR Vectors DataForm Repository"
  region       = var.region
  service_account = var.dataform_sa_email
  git_remote_settings {
      url = "git@github.com:Gui-go/BRvectors.git"
      default_branch = "main"
      authentication_token_secret_version = var.gh_token_secret
  }
  workspace_compilation_overrides {
    default_database = var.proj_id
    schema_suffix = ""
    table_prefix = ""
  }
  # depends_on = [google_bigquery_dataset.bqdataset_bronze]
}


