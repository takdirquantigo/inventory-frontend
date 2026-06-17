import React from 'react'

import { Award } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import founder from '@/assets/home/Founder.png'

export default function Founder() {
  return (
    <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4">Our Story</Badge>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Meet Our Founder</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built on a foundation of trust, safety, and customer service excellence.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative p-4 ">
              <img
                src={founder}
                alt="Founder Portrait"
                className="w-full h-full rounded-lg object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">9+ Years Experience</span>
                </div>
              </div>
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Mohammad Topu</h3>
                <p className="text-primary font-medium mb-4">Founder </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "Starting GasFlow in 2017, my vision was simple - make LPG delivery safe, reliable, and convenient
                  for every household. With over 9 years in the gas industry, I've built this company on the
                  principles of trust, quality, and customer satisfaction."
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  "Today, we serve over 2000+ families with the same commitment to safety and excellence that
                  started this journey."
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2017</div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2000+</div>
                  <div className="text-sm text-muted-foreground">Customers</div>
                </div>
               
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  </section>
  )
}
