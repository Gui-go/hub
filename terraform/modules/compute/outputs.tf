# output "run_frontend_name" {
#   value = google_cloud_run_v2_service.run_portfolio.name
# }

output "run_portfolio" {
  value = {
    service  = google_cloud_run_v2_service.run_portfolio.name
    region   = google_cloud_run_v2_service.run_portfolio.location
  }
}

# output "run_fastapi" {
#   value = {
#     service  = google_cloud_run_v2_service.run_fastapi.name
#     region   = google_cloud_run_v2_service.run_fastapi.location
#   }
# }

output "run_names" {
  value = {
    www               = google_cloud_run_v2_service.run_portfolio.name,
    # api               = google_cloud_run_v2_service.run_fastapi.name,
    # rstudio           = google_cloud_run_v2_service.run_rstudio.name,
    # grafana           = google_cloud_run_v2_service.run_grafana.name,

    # portfolio         = google_cloud_run_v2_service.run_portfolio.name,
    # # vault             = google_cloud_run_v2_service.run_vault.name,
    # tom-riddles-diary = google_cloud_run_v2_service.run_portfolio.name,
    # ollama            = google_cloud_run_v2_service.run_portfolio.name,
    # soi-erasmus       = google_cloud_run_v2_service.run_portfolio.name,
    # soi-h-index       = google_cloud_run_v2_service.run_portfolio.name,

    # react-portfolio   = google_cloud_run_v2_service.run_portfolio.name,
    # flutter-portfolio = google_cloud_run_v2_service.run_flutter_portfolio.name
    # wordpress         = google_cloud_run_v2_service.run_portfolio.name,

    # django-portfolio = google_cloud_run_v2_service.run_flutter_portfolio.name,
    # php-portfolio   = google_cloud_run_v2_service.run_frontend.name,

    # postgres          = google_cloud_run_v2_service.run_frontend.name,
    # mongodb          = google_cloud_run_v2_service.run_frontend.name,
    # neo4j          = google_cloud_run_v2_service.run_frontend.name,
    # mariadb          = google_cloud_run_v2_service.run_frontend.name,
    # elasticsearch          = google_cloud_run_v2_service.run_frontend.name,
    # zookeeper          = google_cloud_run_v2_service.run_frontend.name,
    # mysql          = google_cloud_run_v2_service.run_frontend.name,
    # frontend          = google_cloud_run_v2_service.run_frontend.name,

    # geoserver          = google_cloud_run_v2_service.run_frontend.name,
    # geonetwork          = google_cloud_run_v2_service.run_frontend.name,
    
    
    # airflow          = google_cloud_run_v2_service.run_frontend.name,
    # kibana          = google_cloud_run_v2_service.run_frontend.name,
    # cassandra          = google_cloud_run_v2_service.run_frontend.name,
    # opensearch-dashboards          = google_cloud_run_v2_service.run_frontend.name,
  }
}




