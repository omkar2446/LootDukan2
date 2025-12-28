import { ArrowRight, TrendingUp, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
      {/* Background decorations */}
     
      
      
         

          {/* Headline */}
          <section className="w-full bg-white py-4">
        <div className="max-w-7xl mx-auto px-3">
          <div className="overflow-hidden rounded-2xl shadow-md bg-white">

            <a
              href="https://amzn.to/4qrm1qX"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://m.media-amazon.com/images/G/31/img22/WLA/2025/Unrec/PocketFriendlyStore/1500.gif"
                alt="Amazon Pocket Friendly Store"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </a>

          </div>
        </div>
      </section>

         

          {/* Trust Indicators */}
          
          
        
      
    </section>
  );
}
