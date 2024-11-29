import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight, Sprout, Heart, Users, LeafyGreen } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Once the animation is done, stop observing the element
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Get all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-32 md:py-48 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="animate-on-scroll fade-in">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                    Nurturing Health Through
                    <span className="text-primary"> Nature</span>
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                    Experience the power of soya-based nutrition with our comprehensive health management platform. Join us in promoting wellness through natural solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="text-lg">
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sign In to SNULI Hub</DialogTitle>
                        </DialogHeader>
                        <LoginForm />
                      </DialogContent>
                    </Dialog>
                    <Button size="lg" variant="outline" className="text-lg">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="animate-on-scroll slide-right">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2080"
                    alt="Modern Business Management"
                    className="rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 animate-on-scroll fade-in">
              Why Choose SNULI Hub?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 animate-on-scroll slide-left">
                <Sprout className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Natural & Pure</h3>
                <p className="text-muted-foreground">
                  Premium quality soya products sourced from nature's finest ingredients.
                </p>
              </Card>
              <Card className="p-6 animate-on-scroll fade-in">
                <Heart className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Health Benefits</h3>
                <p className="text-muted-foreground">
                  Scientifically proven health benefits for overall wellness.
                </p>
              </Card>
              <Card className="p-6 animate-on-scroll slide-right">
                <LeafyGreen className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Sustainable Living</h3>
                <p className="text-muted-foreground">
                  Eco-friendly practices for a healthier planet and community.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto text-center">
            <div className="animate-on-scroll fade-in">
              <h2 className="text-3xl font-bold mb-4">Start Your Wellness Journey</h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands embracing a healthier lifestyle with SNULI's natural solutions.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary" className="text-lg">
                    Begin Your Journey
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start Your Wellness Journey</DialogTitle>
                  </DialogHeader>
                  <LoginForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}