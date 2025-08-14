import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Copy,
  Lock,
  BarChart3,
  Info,
  MessageCircle,
  Mail,
  Cpu,
  LogOut,
  Key,
  FileText,
  GraduationCap,
  Bell,
  UploadCloud,
  MessageSquare,
  CheckCircle,
  Download,
  Zap,
} from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import Tilt from "react-parallax-tilt";
import Particles from "react-tsparticles";

const FancyButton = ({ children, icon: Icon, color = "cyan", ...props }) => {
  const colors = {
    teal: "border-teal-400 text-teal-400 bg-teal-400",
    cyan: "border-cyan-400 text-cyan-400 bg-cyan-400",
    blue: "border-blue-400 text-blue-400 bg-blue-400",
    purple: "border-purple-400 text-purple-400 bg-purple-400",
    green: "border-green-400 text-green-400 bg-green-400",
    mist: "border-gray-200 text-gray-200 bg-gray-200",
  };
  const [borderColor, textColor, bgColor] = colors[color].split(" ");
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-[1.25rem] py-[0.625rem] text-[1rem] font-semibold ${borderColor} ${textColor} border-2 rounded-full relative overflow-hidden group transition-all`}
      {...props}
    >
      {Icon && (
        <Icon className="w-4 h-4 relative z-20 group-hover:text-black transition-all duration-300" />
      )}
      <span className="relative z-20 group-hover:text-black transition-all duration-300">
        {children}
      </span>
      <span className="absolute inset-0 flex justify-center items-center z-0">
        <span
          className={`h-[3rem] w-[3rem] ${bgColor} rounded-full scale-0 group-hover:scale-[3.75] transition-transform duration-500 ease-out`}
        />
      </span>
    </motion.button>
  );
};

const federatedFeatures = [
  {
    title: "Blockchain-Based Verification",
    desc: "Tamper-proof dataset version hashing ensures data integrity.",
    icon: Lock,
  },
  {
    title: "Smart Query Caching & History",
    desc: "Cache frequent queries and save last 10 for quick access.",
    icon: Database,
  },
  {
    title: "Privacy-Preserving AI",
    desc: "Built-in masking, aggregation, and differential privacy controls.",
    icon: Info,
  },
  {
    title: "Voice & Multilingual Support",
    desc: "Query in Indian languages with voice-to-text capabilities.",
    icon: MessageCircle,
  },
];

const performanceStats = [
  { label: "Queries Served", value: "12,345" },
  { label: "Avg Response Time", value: "350 ms" },
  { label: "API Keys Issued", value: "12" },
  { label: "Security Events Blocked", value: "98%" },
];

export default function Homepage() {
  const [showModal, setShowModal] = useState(false);
  //const fakeApiKey = "sk_live_51J6hP4gF7T3z8R9qW2Lk3Vn";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const navItems = [
    { name: "SQL", href: "/sql", icon: Cpu },
    { name: "AI Query", href: "/ai", icon: MessageCircle },
    { name: "Pricing", href: "/pricing", icon: Zap },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const keyFeatures = [
    {
      Icon: FileText,
      title: "Comprehensive API Access",
      desc: "Unified endpoints for easy MoSPI data retrieval.",
    },
    {
      Icon: MessageSquare,
      title: "Natural Language Interface",
      desc: "Submit queries in English or SQL with instant validation.",
    },
    {
      Icon: Lock,
      title: "Robust Security",
      desc: "Role-based access and encrypted API key management.",
    },
    {
      Icon: Download,
      title: "Export & Reporting",
      desc: "Download datasets and reports in multiple formats.",
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-[#0f172a] via-[#0a0f1f] to-[#1e293b] text-white min-h-screen overflow-hidden">
      <Particles
        id="tsparticles"
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#06b6d4" },
            links: {
              color: "#06b6d4",
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1,
            },
            move: { enable: true, speed: 1 },
            number: { value: 50 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: 3 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      <nav className="relative z-10 flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/5 border-b border-white/10">
        <h1 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          <Database className="w-7 h-7 text-cyan-400" />
          SurveyQuery.ai
        </h1>
        <div className="hidden md:flex space-x-6">
          {navItems.map((item, i) => (
            <motion.a
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
              key={i}
              href={item.href}
              className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-cyan-500/10 hover:text-cyan-300 transition group"
            >
              <item.icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>{item.name}</span>
            </motion.a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <FancyButton color="cyan" icon={Key} onClick={() => setShowModal(true)}>
            Get API Key
          </FancyButton>
          <FancyButton color="mist" icon={LogOut}>
            Logout
          </FancyButton>
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1e293b] p-8 rounded-xl max-w-md w-full shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Your API Key</h2>
            <p className="bg-[#0f172a] p-3 rounded-md text-gray-200 font-mono break-all border border-cyan-400/30">
              {fakeApiKey}
            </p>
            <p className="text-xs text-gray-400 mt-2">Keep this key secure — treat it like a password.</p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={handleCopy} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md text-white">
                Copy
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white">
                Close
              </button>
            </div>
            {copied && <div className="text-green-400 text-sm mt-2 text-right">✅ Copied!</div>}
          </div>
        </div>
      )}

      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 gap-10">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-lg text-center md:text-left"
        >
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            AI + SQL <span className="text-cyan-400">API Gateway</span>
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Query MoSPI datasets in English or SQL — fast, secure, JSON/CSV output with built-in visualization.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <FancyButton color="blue" icon={FileText}>
              API Docs
            </FancyButton>
            <FancyButton color="teal" icon={GraduationCap}>
              Learn More
            </FancyButton>
          </div>
        </motion.div>
        <div className="flex gap-6">
          {[
            "https://assets9.lottiefiles.com/packages/lf20_kyu7xb1v.json",
            "https://assets10.lottiefiles.com/packages/lf20_w51pcehl.json",
          ].map((src, i) => (
            <motion.div key={i} initial={{ y: i === 0 ? -30 : 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareColor="cyan" glareMaxOpacity={0.2}>
                <Player autoplay loop src={src} style={{ height: "300px", width: "300px" }} />
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 px-8 md:px-20 py-20 backdrop-blur-lg border-t border-white/10">
        <h3 className="text-4xl font-bold text-center mb-16">Key Features</h3>
        <div className="grid md:grid-cols-4 gap-10">
          {keyFeatures.map(({ Icon, title, desc }, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} className="p-6 bg-white/5 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition">
              <Icon className="w-10 h-10 text-cyan-400 mb-4" />
              <h4 className="text-xl font-semibold mb-2">{title}</h4>
              <p className="text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-8 md:px-20 py-20 backdrop-blur-lg border-t border-white/10">
        <h3 className="text-4xl font-bold text-center mb-16">Unique Differentiators</h3>
        <div className="grid md:grid-cols-4 gap-10">
          {federatedFeatures.map(({ title, desc, icon: Icon }, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} className="p-6 bg-white/5 rounded-xl shadow-lg hover:shadow-purple-400/20 transition">
              <Icon className="w-10 h-10 text-purple-400 mb-4" />
              <h4 className="text-xl font-semibold mb-2">{title}</h4>
              <p className="text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-8 md:px-20 py-20 backdrop-blur-lg border-t border-white/10">
        <h3 className="text-4xl font-bold text-center mb-16">How to Use</h3>
        <div className="grid md:grid-cols-4 gap-10">
          {[
            { Icon: UploadCloud, step: "Step 1", title: "Get API Key", desc: "Sign up and obtain your secure API key to start." },
            { Icon: MessageSquare, step: "Step 2", title: "Ask a Query", desc: "Use plain English or SQL to request data." },
            { Icon: CheckCircle, step: "Step 3", title: "Get Results", desc: "Receive structured data in JSON or CSV format." },
            { Icon: Download, step: "Step 4", title: "Visualize & Export", desc: "Generate charts and download as PNG or PDF." },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} className="p-6 bg-white/5 rounded-xl shadow-lg hover:shadow-green-400/20 transition text-center">
              <item.Icon className="w-10 h-10 text-green-400 mb-4 mx-auto" />
              <h5 className="text-lg font-bold text-green-300 mb-1">{item.step}</h5>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-8 md:px-20 py-20 backdrop-blur-lg border-t border-white/10">
        <h3 className="text-3xl font-bold text-center mb-12">Performance & Security Stats</h3>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {performanceStats.map(({ label, value }, i) => (
            <motion.div key={i} whileHover={{ scale: 1.1 }} className="bg-white/5 rounded-xl p-6 shadow-md">
              <p className="text-4xl font-extrabold text-cyan-400">{value}</p>
              <p className="mt-2 text-gray-300 font-semibold">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-8 md:px-20 py-20 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Stay Updated with Data Trends</h3>
          <p className="text-gray-300 mb-6">Subscribe to real-time alerts and get notified when government data changes significantly.</p>
          <div className="flex justify-center">
            <FancyButton color="green" icon={Bell}>
              Subscribe Now
            </FancyButton>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-8 md:px-20 py-10 border-t border-white/10 text-gray-400 text-center">
        <p>© 2025 SurveyQuery.ai | Built for STATATHON Hackathon</p>
      </footer>
    </div>
  );
}
