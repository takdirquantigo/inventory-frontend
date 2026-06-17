import React from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader,CardDescription , CardTitle } from '../ui/card'
import { Users } from 'lucide-react'
import { Heart } from 'lucide-react'
import { Button } from '../ui/button'

export default function Team() {
  return (
    <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4">Our Team</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Expert Team Members</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the dedicated professionals who ensure safe, reliable LPG delivery and exceptional customer service.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: "Amit Sharma",
            role: "Operations Manager",
            experience: "8+ Years",
            specialization: "Safety & Logistics",
            description:
              "Ensures all deliveries meet the highest safety standards and coordinates our delivery network.",
            image: "professional operations manager in safety gear at LPG facility",
          },
          {
            name: "Priya Patel",
            role: "Customer Service Head",
            experience: "6+ Years",
            specialization: "Customer Relations",
            description: "Leads our customer support team and ensures every customer receives exceptional service.",
            image: "friendly customer service manager with headset in modern office",
          },
          {
            name: "Vikram Singh",
            role: "Safety Inspector",
            experience: "10+ Years",
            specialization: "Safety Compliance",
            description: "Certified safety expert who oversees all safety protocols and equipment maintenance.",
            image: "safety inspector with clipboard checking LPG equipment",
          },
          {
            name: "Sunita Reddy",
            role: "Delivery Coordinator",
            experience: "5+ Years",
            specialization: "Route Planning",
            description: "Manages delivery schedules and ensures timely, efficient service across all locations.",
            image: "delivery coordinator with tablet planning routes in dispatch center",
          },
          {
            name: "Ravi Kumar",
            role: "Technical Support",
            experience: "7+ Years",
            specialization: "Installation & Repair",
            description: "Expert technician providing installation support and technical guidance to customers.",
            image: "technical support engineer with tools working on gas connections",
          },
          {
            name: "Meera Joshi",
            role: "Quality Assurance",
            experience: "4+ Years",
            specialization: "Product Quality",
            description: "Ensures all cylinders and equipment meet quality standards before customer delivery.",
            image: "quality assurance specialist inspecting LPG cylinders in warehouse",
          },
        ].map((member, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="relative mb-4">
                <img
                  src={`/abstract-geometric-shapes.png?height=200&width=200&query=${member.image}`}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/10"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {member.experience}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{member.specialization}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  </section>
  )
}
