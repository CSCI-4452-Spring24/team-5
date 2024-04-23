resource "aws_route53_record" "dns_record" {
  zone_id = "Z0666407BZLQWL7QYK29"
  name    = "stormsentry.click"
  type    = "A"

  alias {
    name                   = aws_elb.elb_create.dns_name
    zone_id                = aws_elb.elb_create.zone_id
    evaluate_target_health = true
  }
}
