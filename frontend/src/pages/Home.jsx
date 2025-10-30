// src/pages/Home.jsx
import React from "react";
import landscapeImage from "../assets/landscape.png"; // <-- IMPORTED YOUR IMAGE
import { Brain, BarChart3, MapPin, Building2, Users2, Footprints } from "lucide-react";

// --- Custom Styles for the AI-inspired landing page ---
const customStyles = `
  body {
    font-family: 'Inter', sans-serif; /* Clean, modern sans-serif */
    /* New background inspired by your image: dark purple-blue to near-black */
    background-color: #0a0a1a; 
    background-image: linear-gradient(110deg, #1a1a2e 0%, #0a0a1a 100%);
    background-attachment: fixed; /* Makes the background stay in place on scroll */
    color: #e0e7ff; /* Light, futuristic text color */
  }

  /* Hero section with a dark gradient and subtle tech pattern */
  .hero-background-ai {
    /* Removed the specific gradient, as it now inherits from the body */
    position: relative;
    overflow: hidden; /* For containing potential absolute elements */
  }

  /* Overlay for subtle grid/circuitry effect - updated color */
  .hero-background-ai::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(#2c2a4a 1px, transparent 1px); /* Subtler purple dot grid */
    background-size: 40px 40px;
    opacity: 0.2;
    z-index: 0;
  }

  /* Neon gradient text for highlights - NEW PALETTE (Indigo to Purple) */
  .neon-text-gradient {
    background: linear-gradient(90deg, #6366f1, #a855f7); /* Indigo-500 to Purple-500 */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  /* Neon button style - NEW PALETTE */
  .btn-neon {
    background: linear-gradient(90deg, #6366f1, #a855f7); /* Indigo to Purple */
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 9999px; /* Pill shape */
    font-weight: 700;
    letter-spacing: 0.05em;
    transition: all 0.4s ease;
    /* Updated shadow to match new colors */
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(168, 85, 247, 0.4); 
    position: relative;
    overflow: hidden;
  }
  .btn-neon:hover {
    transform: translateY(-3px) scale(1.02);
    /* Updated hover shadow */
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.7), 0 0 40px rgba(168, 85, 247, 0.6);
  }
  .btn-neon::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-30deg);
    transition: all 0.7s ease;
  }
  .btn-neon:hover::after {
    left: 100%;
  }

  /* Glassy card effect adapted for new dark theme */
  .glass-card-dark {
    background: rgba(30, 27, 70, 0.1); /* Subtle purple-tinted glass */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1); /* Slightly stronger border */
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); /* Slightly stronger shadow */
  }

  /* Feature icon styling - NEW PALETTE */
  .feature-icon-circle {
    background: linear-gradient(45deg, #6366f1, #a855f7); /* Indigo to Purple */
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
  }

  /* Timeline line for process section - NEW PALETTE */
  .timeline-line-dark {
    background: linear-gradient(to bottom, #6366f1, #a855f7);
  }
`;

// --- Reusable Components ---

const FeatureCard = ({ Icon, title, description }) => (
  <div className="glass-card-dark p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
    <div className="flex justify-center mb-4">
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
        <Icon className="w-10 h-10 text-white" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
  </div>
);

const ProcessStep = ({ step, title, description, reverse }) => (
  <div
    className={`flex flex-col md:flex-row items-center gap-8 ${
      reverse ? "md:flex-row-reverse" : ""
    } mb-16`}
  >
    <div className="md:w-5/12 text-center md:text-left">
      <div className="glass-card-dark p-6 rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-200 leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0 z-10 border-4 border-[#0a0a1a]">
      {/* Updated border color to match the new deep background */}
      {step}
    </div>
    <div className="md:w-5/12 hidden md:block">
      {/* Empty div for spacing on larger screens */}
    </div>
  </div>
);

const TestimonialCard = ({ quote, name, title, avatar }) => (
  <div className="glass-card-dark p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
    {avatar && (
      <img
        src={avatar}
        alt={name}
        className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-500" /* Updated border color */
      />
    )}
    <p className="text-lg italic text-gray-200 mb-5 leading-relaxed">
      "{quote}"
    </p>
    <div className="border-t border-gray-700 w-full pt-4">
      <p className="font-bold text-white text-md">{name}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </div>
);

// --- Page Sections ---

const HeroSection = () => (
  <section
    id="home"
    className="hero-background-ai min-h-screen flex items-center justify-center text-center px-4 md:px-8 py-16 md:py-20 relative"
  >
    {/* Decorative animated lines/dots */}
    <div className="absolute top-1/4 left-10 w-48 h-1 bg-indigo-500 rounded-full blur-sm opacity-50 animate-pulse hidden lg:block"></div>
    <div className="absolute bottom-1/4 right-20 w-64 h-1 bg-purple-500 rounded-full blur-sm opacity-50 animate-pulse-slow hidden lg:block"></div>
    <div className="absolute top-1/2 right-10 w-2 h-2 bg-indigo-400 rounded-full animate-ping-slow"></div>
    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>

    <div className="max-w-7xl mx-auto z-10 grid md:grid-cols-2 gap-10 lg:gap-16 items-center text-left">
      {/* --- Left Text Section --- */}
      <div className="md:pr-6 lg:pr-10">
        <h2 className="text-base md:text-lg uppercase tracking-widest text-indigo-400 mb-2 font-semibold">
          Local Insight AI
        </h2>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug md:leading-tight mb-5 tracking-tight">
          The New <br />
          <span className="neon-text-gradient">Intelligent Platform</span> for
          Local Growth
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed md:leading-loose">
          Unlock area-wise business analysis powered by cutting-edge AI — built
          to guide your local enterprise toward smarter growth decisions.
        </p>

        <a href="#features" className="btn-neon inline-block mt-2">
          Discover Insights
        </a>
      </div>

      {/* --- Image Section --- */}
      <div className="relative flex justify-center items-center md:justify-end mt-10 md:mt-0">
        <img
          src={landscapeImage}
          alt="AI Platform Landscape"
          className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl scale-105 md:scale-115"
        />
      </div>
    </div>
  </section>
);


const FeaturesSection = () => {
  const features = [
    {
      Icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Uncover hidden opportunities and mitigate risks with intelligent analysis of local market dynamics.",
    },
    {
      Icon: BarChart3,
      title: "Data Visualization & Trends",
      description:
        "See complex data brought to life through intuitive dashboards and charts, making trends easy to grasp.",
    },
    {
      Icon: Building2,
      title: "Market Forecasting / Predictions",
      description:
        "Anticipate future market shifts and consumer behavior to position your business ahead of the curve.",
    },
    {
      Icon: MapPin,
      title: "City Growth & Land Use",
      description:
        "Identify prime locations by analyzing zoning changes, permit trends, and urban development projects.",
    },
    {
      Icon: Users2,
      title: "Local Demographics & Needs",
      description:
        "Understand the unique characteristics of your local customer base – income, age, preferences, and unmet needs.",
    },
    {
      Icon: Footprints,
      title: "Mobility & Footfall",
      description:
        "Optimize your operations by tracking real-time movement data, peak hours, and pedestrian traffic.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Animated gradient blobs for atmosphere */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-fast"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-fast animation-delay-4000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Core Features Driving Your{" "}
            <span className="neon-text-gradient">Local Success</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Our platform equips local businesses with the intelligence to make
            confident, data-backed decisions and foster community growth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};


const ProcessSection = () => (
  <section
    id="process"
    className="py-20 md:py-28 relative bg-gradient-to-br from-indigo-700 to-purple-700" /* Removed bg-[#0a0a2a] */
  >
    <div className="container mx-auto px-6 relative z-10">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          The LocalInsight <span className="neon-text-gradient">Journey</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          From raw data to actionable insights, our platform makes sophisticated
          analysis simple.
        </p>
      </div>
      <div className="relative max-w-5xl mx-auto">
        {/* The vertical timeline bar with neon gradient */}
        <div className="absolute hidden md:block w-1 timeline-line-dark left-1/2 transform -translate-x-1/2 h-full top-0"></div>
        <ProcessStep
          step={1}
          title="Data Aggregation"
          description="We securely ingest and normalize billions of local data points from public, social, and proprietary sources across your target region."
        />
        <ProcessStep
          step={2}
          title="AI-Powered Analysis"
          description='Our custom AI model, "LocalMind," processes the data, identifies complex patterns, and benchmarks your performance against the local market.'
          reverse
        />
        <ProcessStep
          step={3}
          title="Actionable Reports"
          description="Receive intuitive, customized reports delivered directly to your dashboard, complete with clear, prioritized recommendations to implement immediately."
        />
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "LocalInsight AI transformed how we approach marketing. We saw a significant increase in foot traffic within weeks of implementing their recommendations. It’s truly a local business game-changer!",
      name: "Maria Sanchez",
      title: "Owner, 'The Corner Cafe'",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      quote:
        "Before LocalInsight, we were guessing. Now, with their precise demographic data and trend forecasts, our new branch opening was the smoothest and most successful to date. Highly recommend!",
      name: "Javier Moreno",
      title: "CEO, 'Peak Fitness Gyms'",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      quote:
        "The data visualization made complex market dynamics so easy to understand. We optimized our product offerings and saw a direct boost in customer satisfaction and sales!",
      name: "Chloe Lim",
      title: "Manager, 'Urban Threads Boutique'",
      avatar: "https://randomuser.me/api/portraits/women/78.jpg",
    },
  ];
  return (
    <section
      id="testimonials"
      className="py-20 md:py-28" /* Removed bg-[#0e0e3e] */
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            What Local Leaders{" "}
            <span className="neon-text-gradient">Are Saying</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hear how LocalInsight AI is already transforming businesses in
            communities just like yours.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section
    id="cta"
    className="py-20 md:py-28 bg-gradient-to-br from-indigo-700 to-purple-700 text-white text-center" /* NEW PALETTE */
  >
    <div className="container mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 max-w-4xl mx-auto leading-tight">
        Ready to Stop Guessing and{" "}
        <span className="neon-text-gradient">Start Growing</span>?
      </h2>
      <p className="text-xl text-indigo-200 mb-10 max-w-3xl mx-auto leading-relaxed">
        {" "}
        {/* Updated text color */}
        Take the first step toward a data-driven future. Sign up for your free,
        7-day trial—no commitment, just pure local business intelligence.
      </p>
      <a
        href="#"
        className="btn-neon inline-block !bg-white !text-indigo-700 !shadow-none !px-12 !py-4" /* Updated text color */
      >
        Start My Free Analysis Now
      </a>
      <p className="text-sm text-indigo-200 mt-4">
        {" "}
        {/* Updated text color */}
        Full access to all features for 7 days. Limited spots available for
        immediate onboarding.
      </p>
    </div>
  </section>
);

const Footer = () => (
  <footer
    className="border-t border-white/10 py-10 text-center text-gray-400" /* Removed bg, updated border */
  >
    <div className="container mx-auto px-6">
      <p className="text-2xl font-bold text-white tracking-wide block mb-4">
        LocalInsight AI
      </p>
      <div className="flex justify-center space-x-8 mb-6 text-gray-500">
        <a
          href="#features"
          className="hover:text-white transition duration-300"
        >
          Features
        </a>
        <a href="#process" className="hover:text-white transition duration-300">
          Process
        </a>
        <a href="#" className="hover:text-white transition duration-300">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-white transition duration-300">
          Contact
        </a>
      </div>
      <p>
        &copy; {new Date().getFullYear()} LocalInsight AI. All rights reserved.
      </p>
    </div>
  </footer>
);

// --- Main Page Component ---
const Home = () => (
  <>
    {/* Google Fonts for 'Inter' (if not already in your project) */}
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <style>{customStyles}</style>
    <style>
      {`
        /* Keyframe animations for background blobs and pulsing elements */
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-fast {
            0% { transform: translate(0px, 0px) scale(1); }
            25% { transform: translate(15px, -25px) scale(1.05); }
            50% { transform: translate(-10px, 10px) scale(0.95); }
            75% { transform: translate(20px, 5px) scale(1.03); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.03); }
        }
        @keyframes ping {
            0% { transform: scale(0.2); opacity: 0.8; }
            100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ping-slow {
            0% { transform: scale(0.5); opacity: 0.6; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        .animate-blob { animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55); }
        .animate-blob-fast { animation: blob-fast 10s infinite alternate cubic-bezier(0.42, 0, 0.58, 1); }
        .animate-pulse { animation: pulse 2s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
        .animate-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-fade-in { animation: fade-in 2s ease-out forwards; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        `}
    </style>
    <div className="relative">
      {" "}
      {/* Added relative to body to correctly position absolute elements */}
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <Footer />
    </div>
  </>
);

export default Home;
