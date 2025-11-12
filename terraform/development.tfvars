release         = "v0.8.0.0"
proj_name       = "hub"
proj_id         = "hub027"
proj_number     = "908381025333"
location        = "US" # location > region > zone
region          = "us-central1" # us-central1 is the 3rd cheapest on average and has all resources.
zone            = "us-central1-b"
vpc_subnet_cidr = "10.8.0.0/28"   # cicd
domain          = "guigo.dev.br"
subdomains      = [
    "www", 
    # "api", 
    # "rstudio", 
    # "grafana"
  ]
tag_owner       = "guilhermeviegas"
tag_env         = "dev"
github_owner    = "Gui-go"
github_repo     = "hub"




