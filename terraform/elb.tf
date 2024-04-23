resource "aws_elb" "elb_create" {
  name               = "stormsentry-elb"
  availability_zones = ["us-east-1a", "us-east-1b","us-east-1c"]  // adjust according to your region

  listener {
    instance_port     = 80
    instance_protocol = "HTTP"
    lb_port           = 80
    lb_protocol       = "HTTP"
  }

  health_check {
    target              = "HTTP:80/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}
