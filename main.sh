#!/bin/bash

# chmod +x main.sh
# grep -rl "hub21" . | xargs sed -i 's/hub21/hub22/g'

# gcloud resetting:
gcloud config unset compute/region
gcloud config unset project
gcloud config unset billing/quota_project
gcloud auth application-default revoke --quiet

# gcloud auth:
# These credentials will be used by any library that requests Application Default Credentials (ADC).
export GCLOUD_CONF_NAME="gcloud-conf-hub${PROJECT_NUMBER}"
gcloud config configurations create $GCLOUD_CONF_NAME
gcloud config configurations activate $GCLOUD_CONF_NAME
gcloud auth login --quiet
gcloud auth application-default login --quiet

# Variables:
set -o allexport; source .env; set +o allexport
echo $PROJ_ID

# Other related projects:
# gcloud projects create "gcs-hub1" --name="gcs-hub" --labels=owner=guilhermeviegas --enable-cloud-apis --quiet
# gcloud beta billing projects link "gcs-hub1" --billing-account=$BILLING_ACC
# gcloud config set project "gcs-hub1"
# gcloud config set billing/quota_project "gcs-hub1"

# gcloud auth application-default set-quota-project hub13
# gcloud config set billing/quota_project hub13



# GCP setting:
# gcloud config configurations list
gcloud projects create $PROJ_ID --name=$PROJ_NAME --labels=owner=guilhermeviegas --enable-cloud-apis --quiet
gcloud beta billing projects link $PROJ_ID --billing-account=$BILLING_ACC --quiet
gcloud config set project $PROJ_ID
gcloud config set billing/quota_project $PROJ_ID
gcloud services enable cloudresourcemanager.googleapis.com --project=$PROJ_ID
gcloud auth application-default set-quota-project $PROJ_ID --quiet
cd ~/Documents/01-hub
gcloud config list


# APIs enabling:
gcloud services enable vpcaccess.googleapis.com --project=$PROJ_ID
gcloud services enable compute.googleapis.com --project=$PROJ_ID
gcloud services enable dns.googleapis.com --project=$PROJ_ID
gcloud services enable iam.googleapis.com --project=$PROJ_ID
gcloud services enable discoveryengine.googleapis.com --project=$PROJ_ID
gcloud services enable secretmanager.googleapis.com --project=$PROJ_ID
gcloud services enable artifactregistry.googleapis.com --project=$PROJ_ID
gcloud services enable run.googleapis.com --project=$PROJ_ID
gcloud services enable container.googleapis.com --project=$PROJ_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJ_ID
gcloud services enable cloudfunctions.googleapis.com --project=$PROJ_ID
gcloud services enable logging.googleapis.com --project=$PROJ_ID
gcloud services enable monitoring.googleapis.com --project=$PROJ_ID
gcloud services enable storage.googleapis.com --project=$PROJ_ID
gcloud services enable pubsub.googleapis.com --project=$PROJ_ID
gcloud services enable cloudtasks.googleapis.com --project=$PROJ_ID
gcloud services enable cloudscheduler.googleapis.com --project=$PROJ_ID
gcloud services enable bigquery.googleapis.com --project=$PROJ_ID
gcloud services enable bigquerydatatransfer.googleapis.com --project=$PROJ_ID
gcloud services enable bigquerydatatransfer.googleapis.com --project=$PROJ_ID
gcloud services enable servicenetworking.googleapis.com --project=$PROJ_ID
gcloud services enable firestore.googleapis.com --project=$PROJ_ID
gcloud services enable firebaserules.googleapis.com --project=$PROJ_ID

# analyticsadmin.googleapis.com

# gcloud services enable bigqueryconnection.googleapis.com aiplatform.googleapis.com
# gcloud services enable aiplatform.googleapis.com bigqueryconnection.googleapis.com

# Create SA and grant roles to it.
export GH_ACTIONS_SA="ghactionsSA"

gcloud iam service-accounts create $GH_ACTIONS_SA \
    --description="Service account for project ${PROJECT_NAME}, named $GH_ACTIONS_SA, to build and deploy in GCP in my behalf." \
    --display-name=$GH_ACTIONS_SA

gcloud projects add-iam-policy-binding $PROJ_ID \
  --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
  --role="roles/owner"

# gcloud storage buckets add-iam-policy-binding gs://hub22gcs4state \
#   --member="serviceAccount:ghactionsSA@hub22.iam.gserviceaccount.com" \
#   --role="roles/storage.objectAdmin"
# gcloud storage buckets add-iam-policy-binding gs://hub22gcs4state \
#   --member="serviceAccount:ghactionsSA@hub22.iam.gserviceaccount.com" \
#   --role="roles/storage.legacyBucketReader"





# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/iam.serviceAccountAdmin"

# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/iam.serviceAccountKeyAdmin"

# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/storage.admin"

# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/artifactregistry.admin"

# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/run.admin"

# gcloud projects add-iam-policy-binding $PROJ_ID \
#   --member="serviceAccount:$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com" \
#   --role="roles/storage.objectAdmin"











# Create key JSON file and add it to GH Actions: 
gcloud iam service-accounts keys create ${GH_ACTIONS_SA}-key.json \
  --iam-account=$GH_ACTIONS_SA@$PROJ_ID.iam.gserviceaccount.com

##

# Go execute terragrunt at /home/guigo/Documents/01-Hub/terragrunt/environments/dev
# cd /home/guigo/Documents/01-Hub/terragrunt/environments/dev

# terragrunt run-all init
# terragrunt validate
# terragrunt run-all plan
# terragrunt run-all apply
# terragrunt run-all destroy

# gcloud auth configure-docker europe-north2-docker.pkg.dev --quiet

# docker buildx build --platform linux/amd64 \
#   -t europe-north2-docker.pkg.dev/hub11/hub-artifact-repo/portfolio-app:latest  \
#   -f react.dockerfile \
#   --push .




# terraform init 
# terraform plan -out=plan.out
# terraform apply
# terraform state list
# # terraform output
# terraform graph | dot -Tsvg > terraform-graph.svg


# Create TXT record for domain verification:
## Browse "Google Search Console"
## Copy "TXT Record"
## Paste to registro.br domain registry.



# gcloud projects delete $PROJ_ID
