

# Data Stores-

resource "google_discovery_engine_data_store" "virtualguigo_ds" {
    project = var.proj_id
    location = "global"
    data_store_id = "virtualguigo-ds"
    display_name = "Virtual Guigo Data Store"
    industry_vertical = "GENERIC"
    content_config = "CONTENT_REQUIRED"
    solution_types = ["SOLUTION_TYPE_SEARCH"] # Vertex AI Search
    create_advanced_site_search = false
    lifecycle { prevent_destroy = true }
    document_processing_config {
        default_parsing_config {
            digital_parsing_config {}
        }
    }
}

resource "google_discovery_engine_data_store" "migrationdynamics_ds" {
    project = var.proj_id
    location = "global"
    data_store_id = "migrationdynamics-ds"
    display_name = "Migration Dynamics Data Store"
    industry_vertical = "GENERIC"
    content_config = "CONTENT_REQUIRED"
    solution_types = ["SOLUTION_TYPE_SEARCH"] # Vertex AI Search
    create_advanced_site_search = false
    lifecycle { prevent_destroy = true }
    document_processing_config {
        default_parsing_config {
            digital_parsing_config {}
        }
    }
}

resource "google_discovery_engine_data_store" "gwr_ds" {
    project = var.proj_id
    location = "global"
    data_store_id = "gwr-ds"
    display_name = "GWR References Data Store"
    industry_vertical = "GENERIC"
    content_config = "CONTENT_REQUIRED"
    solution_types = ["SOLUTION_TYPE_SEARCH"] # Vertex AI Search
    create_advanced_site_search = false
    lifecycle { prevent_destroy = true }
    document_processing_config {
        default_parsing_config {
            digital_parsing_config {}
        }
    }
}



# Search Engines-

resource "google_discovery_engine_search_engine" "virtualguigo_searchengine" {
    depends_on = [google_discovery_engine_data_store.virtualguigo_ds]
    project = var.proj_id
    engine_id = "virtualguigo-se"
    display_name = "Virtual Guigo Search Engine"
    collection_id = "default_collection"
    location = google_discovery_engine_data_store.virtualguigo_ds.location
    industry_vertical = "GENERIC"
    data_store_ids = [google_discovery_engine_data_store.virtualguigo_ds.data_store_id]
    common_config {
        company_name = "Guigo"
    }
    search_engine_config {
        search_add_ons = ["SEARCH_ADD_ON_LLM"]
    }
}


resource "google_discovery_engine_search_engine" "migrationdynamics_searchengine" {
    depends_on = [google_discovery_engine_data_store.migrationdynamics_ds]
    project = var.proj_id
    engine_id = "migrationdynamics-se"
    display_name = "Migration Dynamics Search Engine"
    collection_id = "default_collection"
    location = google_discovery_engine_data_store.migrationdynamics_ds.location
    industry_vertical = "GENERIC"
    data_store_ids = [google_discovery_engine_data_store.migrationdynamics_ds.data_store_id]
    common_config {
        company_name = "Guigo"
    }
    search_engine_config {
        search_add_ons = ["SEARCH_ADD_ON_LLM"]
    }
}

resource "google_discovery_engine_search_engine" "gwr_searchengine" {
    depends_on = [google_discovery_engine_data_store.gwr_ds]
    project = var.proj_id
    engine_id = "gwr-se"
    display_name = "GWR Search Engine"
    collection_id = "default_collection"
    location = google_discovery_engine_data_store.gwr_ds.location
    industry_vertical = "GENERIC"
    data_store_ids = [google_discovery_engine_data_store.gwr_ds.data_store_id]
    common_config {
        company_name = "Guigo"
    }
    search_engine_config {
        search_add_ons = ["SEARCH_ADD_ON_LLM"]
    }
}

