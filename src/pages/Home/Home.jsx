import Navbar from "@/components/common/Navbar"
import Hero from "@/components/common/Hero"
import Service from "@/components/common/Service"
import Founder from "@/components/common/Founder"
import Team from "@/components/common/Team"
import Footer from "@/components/common/Footer"
import Product from "@/components/common/Product"
import { useEffect, useState } from "react"
import { API_URL } from "@/config/config"
import axios from "axios"

export default function Home() {
  const [cylinder, setCylinder] = useState(null)
  const [accessories, setAccessories] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL + "/api/items");
        const items = res?.data?.data?.data; 
        let data = items.filter(dt => dt?.is_cylinder == true);
        setCylinder(data);
        let accessoriesData = items.filter(dt => dt?.is_cylinder == false);
        setAccessories(accessoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-background">
        <Navbar/>
        <Hero/>
        <Product products={cylinder}/>
        <Service products={accessories}/>
        <Founder/>
        {/* <Team/> */}
        <Footer/>
    </div>
  )
}
