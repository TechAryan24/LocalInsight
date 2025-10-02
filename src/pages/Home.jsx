// src/pages/Home.jsx
import React from "react";

// --- Custom Styles for the AI-inspired landing page ---
const customStyles = `
  body {
    font-family: 'Inter', sans-serif; /* Clean, modern sans-serif */
    background-color: #0a0a2a; /* Deep blue/purple background */
    color: #e0e7ff; /* Light, futuristic text color */
  }

  /* Hero section with a dark gradient and subtle tech pattern */
  .hero-background-ai {
    background: linear-gradient(135deg, #0a0a2a 0%, #1e0a4a 100%);
    position: relative;
    overflow: hidden; /* For containing potential absolute elements */
  }

  /* Overlay for subtle grid/circuitry effect */
  .hero-background-ai::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(#2d0d5d 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.2;
    z-index: 0;
  }

  /* Neon gradient text for highlights */
  .neon-text-gradient {
    background: linear-gradient(90deg, #8b5cf6, #ec4899); /* Purple to Pink */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  /* Neon button style */
  .btn-neon {
    background: linear-gradient(90deg, #8b5cf6, #ec4899); /* Purple to Pink */
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 9999px; /* Pill shape */
    font-weight: 700;
    letter-spacing: 0.05em;
    transition: all 0.4s ease;
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(236, 72, 153, 0.4); /* Neon glow effect */
    position: relative;
    overflow: hidden;
  }
  .btn-neon:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(236, 72, 153, 0.6);
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

  /* Glassy card effect adapted for dark theme */
  .glass-card-dark {
    background: rgba(255, 255, 255, 0.08); /* Very subtle white background */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05); /* Very subtle border */
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  }

  /* Feature icon styling */
  .feature-icon-circle {
    background: linear-gradient(45deg, #8b5cf6, #ec4899); /* Matching neon gradient */
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
  }

  /* Timeline line for process section */
  .timeline-line-dark {
    background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  }
`;

// --- Reusable Components ---

const FeatureCard = ({ iconPath, title, description }) => (
  <div className="glass-card-dark p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
    <div className="feature-icon-circle p-3 rounded-full inline-flex mb-4">
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={iconPath}
        ></path>
      </svg>
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
        <h3 className="text-2xl font-bold neon-text-gradient mb-2">{title}</h3>
        <p className="text-gray-200 leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0 z-10 border-4 border-[#0a0a2a]">
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
        className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-purple-600"
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
    className="hero-background-ai min-h-screen flex items-center justify-center text-center px-6 py-24 relative"
  >
    {/* Abstract tech lines/arcs for visual interest, similar to the image */}
    <div className="absolute top-1/4 left-10 w-48 h-1 bg-purple-500 rounded-full blur-sm opacity-50 animate-pulse hidden lg:block"></div>
    <div className="absolute bottom-1/4 right-20 w-64 h-1 bg-pink-500 rounded-full blur-sm opacity-50 animate-pulse-slow hidden lg:block"></div>
    <div className="absolute top-1/2 right-10 w-2 h-2 bg-purple-400 rounded-full animate-ping-slow"></div>
    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>

    <div className="max-w-6xl mx-auto z-10 grid md:grid-cols-2 gap-12 items-center text-left">
      <div className="md:pr-8">
        <h2 className="text-lg uppercase tracking-widest text-purple-400 mb-3 font-semibold">
          Local Insight AI
        </h2>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tighter">
          The New <br />
          <span className="neon-text-gradient">Intelligent Platform</span> for
          Local Growth
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
          Unlock Area-wise Business Analysis powered
          by cutting-edge AI for your local enterprise.
        </p>
        <a href="#features" className="btn-neon inline-block">
          Discover Insights
        </a>
      </div>
      <div className="relative flex justify-center items-center md:justify-end">
        {/* Visual element inspired by the image - abstract representation */}
        <div className="w-96 h-96 bg-gradient-to-br from-purple-700 to-pink-700 rounded-full mix-blend-screen opacity-20 animate-blob"></div>
        <div className="absolute w-80 h-80 bg-gradient-to-tl from-purple-500 to-blue-500 rounded-full mix-blend-screen opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute text-center"></div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => {
  const features = [
    {
      path: "M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 13h18M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      title: "AI-Powered Insights",
      description:
        "Uncover hidden opportunities and mitigate risks with intelligent analysis of local market dynamics.",
    },
    {
      path: "M16 8v8m-4-0V8m-4 0v8M4 16h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z",
      title: "Data Visualization & Trends",
      description:
        "See complex data brought to life through intuitive dashboards and charts, making trends easy to grasp.",
    },
    {
      path: "M3 13V6a2 2 0 012-2h14a2 2 0 012 2v7M5 13h14M12 17a4 4 0 100-8 4 4 0 000 8z",
      title: "Market Forecasting / Predictions",
      description:
        "Anticipate future market shifts and consumer behavior to position your business ahead of the curve.",
    },
    {
      path: "M12 21.5c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zM15 12h-2V7h-2v5H9l3 3 3-3z",
      title: "City Growth & Land Use",
      description:
        "Identify prime locations by analyzing zoning changes, permit trends, and urban development projects.",
    },
    {
      path: "M17 20h-4v-2h4v2zM5 20h4v-2H5v2zM12 4a3 3 0 100 6 3 3 0 000-6zM3 17a1 1 0 011-1h16a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z",
      title: "Local Demographics & Needs",
      description:
        "Understand the unique characteristics of your local customer base – income, age, preferences, and unmet needs.",
    },
    {
      path: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Mobility & Footfall",
      description:
        "Optimize your operations by tracking real-time movement data, peak hours, and pedestrian traffic.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-28 relative overflow-hidden bg-[#0e0e3e]"
    >
      {/* Background blobs for a dynamic, futuristic feel */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-fast"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-fast animation-delay-4000"></div>

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
  <section id="process" className="py-20 md:py-28 relative bg-[#0a0a2a]">
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
    <section id="testimonials" className="py-20 md:py-28 bg-[#0e0e3e]">
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
    className="py-20 md:py-28 bg-gradient-to-br from-purple-800 to-pink-800 text-white text-center"
  >
    <div className="container mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 max-w-4xl mx-auto leading-tight">
        Ready to Stop Guessing and{" "}
        <span className="neon-text-gradient">Start Growing</span>?
      </h2>
      <p className="text-xl text-purple-200 mb-10 max-w-3xl mx-auto leading-relaxed">
        Take the first step toward a data-driven future. Sign up for your free,
        7-day trial—no commitment, just pure local business intelligence.
      </p>
      <a
        href="#"
        className="btn-neon inline-block !bg-white !text-purple-700 !shadow-none !px-12 !py-4"
      >
        Start My Free Analysis Now
      </a>
      <p className="text-sm text-purple-200 mt-4">
        Full access to all features for 7 days. Limited spots available for
        immediate onboarding.
      </p>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#0a0a2a] border-t border-gray-800 py-10 text-center text-gray-400">
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
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  </>
);

export default Home;
