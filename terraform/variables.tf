#terraform [option] -var-file="secrets.tfvars" to include API keys.
variable "GEOCODE_API_KEY" {
  description = "API key for geocoding"
  type        = string
  sensitive   = true
}

variable "WEATHER_API_KEY" {
  description = "API key for weather"
  type        = string
  sensitive   = true
}


# Putting in the version "latest" tag no longer works. type: terraform [option] -var "image_version_backend=1.2.3-whatever-goes-here" 
variable "image_version_backend" {
  description = "Version of the backend image"
  type        = string
  default     = "0.0.0-prerelease0"
}

# Putting in the version "latest" tag no longer works. type: terraform [option] -var "image_version_nginx=1.2.3-whatever-goes-here" 
variable "image_version_nginx" {
  description = "Version of the nginx image"
  type        = string
  default     = "0.0.0-prerelease0"
}


# Revise a task definition type terraform [option] -var "t_def_revision=true" or "=false" to toggle
variable "t_def_revision" {
  description = "Whether to create a new task definition revision"
  type        = bool
  default     = false
}

# Create a new task definition. Type: terraform [option] -var "t_def_create=true" or "=false" to toggle
variable "t_def_create" {
  description = "Toggle to create a new ECS task definition"
  type        = bool
  default     = false
}

# Revise a task definition type terraform [option] -var "cluster_create=true" or "=false" to toggle
variable "cluster_create" {
  description = "Toggle to create a new cluster"
  type        = bool
  default     = false
}