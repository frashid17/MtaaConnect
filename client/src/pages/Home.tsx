import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Bell } from "lucide-react";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Hero section */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="bg-primary rounded-xl overflow-hidden">
              <div className="px-6 py-16 sm:px-12 sm:py-24 lg:py-32 lg:px-16 relative z-10">
                <h1 className="text-3xl font-display font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                  Connect with your community in Mombasa
                </h1>
                <p className="mt-6 max-w-lg text-xl text-primary-100">
                  Join local events, support harambees, find rentals, and stay updated with community alerts.
                </p>
                <div className="mt-10 max-w-sm flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="default" 
                    className="bg-white text-primary hover:bg-primary-50"
                    onClick={() => scrollToSection("features")}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-primary-600"
                    onClick={() => scrollToSection("events")}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 sm:mt-24" id="features">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-gray-800 sm:text-3xl">
                How MtaaConnect helps our community
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Bringing Mombasa residents together to share resources and support each other
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-primary-100 rounded-md p-3 inline-flex">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">Local Events</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Discover and join events happening in your neighborhood, from cultural celebrations to networking meetups.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-green-100 rounded-md p-3 inline-flex">
                    <DollarSign className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">Harambees</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Support community fundraisers for medical bills, education, and other causes that matter.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-amber-100 rounded-md p-3 inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">Rent & Sell</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Find affordable rentals and items for sale from your neighbors and local vendors.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-red-100 rounded-md p-3 inline-flex">
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">Alerts</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Stay informed about community alerts, lost & found items, and emergency notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preview Sections */}
          <div className="mt-20">
            {/* Events Preview */}
            <div id="events" className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-800">Popular Events</h2>
                  <p className="text-gray-500 mt-1">Check out what's happening in Mombasa</p>
                </div>
                <Link href="/events">
                  <Button variant="outline">View All Events</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <img src="https://pixabay.com/get/ge0c8f0b0fa097c770303a27e4286072a84252a85a3293f8193f855c3b786914047da58d9a3eee1c001be485c6d2c229a88d0215c667dc4be40a12f7bafaabbf4_1280.jpg" alt="Mombasa Cultural Festival" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">Mombasa Cultural Festival</h3>
                        <p className="text-sm text-gray-500">June 15, 2023 • 10:00 AM</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary-100 text-primary">KSh 500</span>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <MapPin className="h-5 w-5 mr-1 text-gray-400" />
                      <span>Mama Ngina Waterfront, Mombasa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* More sections... */}
            <div className="text-center mt-12">
              <h2 className="text-2xl font-display font-bold text-gray-800">Ready to connect with your community?</h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Join MTAA CONNECT today and be part of Mombasa's most vibrant community platform.
              </p>
              <div className="mt-8">
                <Link href="/events">
                  <Button size="lg" className="mx-2">Explore Events</Button>
                </Link>
                <Link href="/harambees">
                  <Button size="lg" variant="outline" className="mx-2">Support Harambees</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
