import React from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent,CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import API, { API_URL } from '@/config/config'
export default function Product({products}) {
  return (
       
        <section id="products" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Products</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">LPG Cylinders for Every Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of certified LPG cylinders. Available for both wholesale and retail customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((cylinder, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                {cylinder.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <img
                    src={API_URL + '/' + cylinder?.image}
                    alt={`${cylinder.size} LPG Cylinder`}
                    className="w-32 h-32 mx-auto mb-4 object-contain"
                  />
                  <CardTitle className="text-2xl font-bold">{cylinder?.name}</CardTitle>
                  <CardDescription>{cylinder?.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{cylinder?.price}TK</div>
                  <p className="text-sm text-muted-foreground">+ Delivery charges</p>
                </CardContent>
                <CardFooter>
                  <a href="tel:01792429367" className='w-full'>
                  <Button className="w-full" variant= "outline">
                  <a >Order Now</a>
                  </Button>
                  </a>
           
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}
