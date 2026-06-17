import React, { useState, useEffect } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CheckCircle, Phone, Shield, Star, Truck } from 'lucide-react'

import heroImage1 from '@/assets/home/image1.png'
import heroImage2 from '@/assets/home/image2.png'
import heroImage3 from '@/assets/home/image3.png'

const images = [heroImage1, heroImage2, heroImage3]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 2000) // change every 2 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20">Trusted Since 2017</Badge>
            <h1 className="text-4xl lg:text-6xl font-black text-foreground leading-tight">
              Premium LPG Cylinders with
              <span className="text-primary"> Fast Home Delivery</span>
              <span className="text-primary"> With Retail Price</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get reliable, safe LPG cylinders delivered to your doorstep. Expert support, competitive prices, and
              guaranteed quality for all your cooking needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                <Truck className="w-5 h-5 mr-2" />
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:01792429367">Get Quote</a>
              </Button>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Same Day Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Safety Certified</span>
              </div>
            </div>
          </div>

          {/* Custom Slider */}
          <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hero ${index + 1}`}
                  className="w-full flex-shrink-0 h-full object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Rating Card */}
            <div className="absolute bottom-0 bg-card border rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">4.9/5 Rating</p>
                  <p className="text-sm text-muted-foreground">2000+ Happy Customers</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
