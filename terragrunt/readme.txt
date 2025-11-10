



terraform init -reconfigure
terragrunt run-all init



environment
    network
    iam
    security
    storage
    data-platform
    portfolio_host
    vault_host
    rstudio_host
    grafana_host
    
modules:
    network (vpc, subvpc, neg, )
    iam (sa, iam, )
    security (secrets)
    storage (GCS, artifact registry)
    data-platform (bq, df, )
    app_host()


