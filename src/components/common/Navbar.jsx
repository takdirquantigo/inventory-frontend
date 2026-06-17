import React from 'react';
import { Button } from '../ui/button';
import { PersonStanding, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className='border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-sm'>MS</span>
          </div>
          <span className='text-xl font-bold text-foreground'>MS MOHAMMAD ENTERPRICE</span>
        </div>
        <nav className='hidden md:flex items-center space-x-6'>
          <a href='#products' className='text-muted-foreground hover:text-foreground transition-colors'>
            Products
          </a>
          <a href='#services' className='text-muted-foreground hover:text-foreground transition-colors'>
            Services
          </a>
          <a href='#about' className='text-muted-foreground hover:text-foreground transition-colors'>
            About
          </a>
          <a href='#contact' className='text-muted-foreground hover:text-foreground transition-colors'>
            Contact
          </a>
        </nav>
        <div className='flex items-center gap-2'>
          <Link to='/login'>
            <Button variant='secondary' className='cursor-pointer'>
              <PersonStanding /> Client Area
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
