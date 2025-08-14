import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { Database, ShieldCheck, Lock, Zap, Play, Cpu, Key } from "lucide-react";
import Common from "./Common";

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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-5 py-2.5 text-[0.95rem] font-semibold ${borderColor} ${textColor} border-2 rounded-full relative overflow-hidden group transition-all`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 relative z-20 group-hover:text-black transition-all duration-300" />}
      <span className="relative z-20 group-hover:text-black transition-all duration-300">{children}</span>
      <span className="absolute inset-0 flex justify-center items-center z-0">
        <span className={`h-10 w-10 ${bgColor} rounded-full scale-0 group-hover:scale-[3.5] transition-transform duration-500 ease-out`} />
      </span>
    </motion.button>
  );
};

const aiModels = [
  { id: "all", name: "All Datasets", version: "" },
  { id: "plfs_2023_q4", name: "PLFS 2023 Q4", version: "v1.0" },
  { id: "nss_cons_78", name: "NSS Consumption Round 78", version: "v1.0" },
  { id: "asih_2022", name: "ASIH 2022 Health", version: "v1.0" },
  { id: "plfs_all", name: "PLFS Historical", version: "v1.0" },
];

const templates = [
  {
    title: "Top 5 states by population",
    prompt: "Show the top 5 states by population in India (2025).",
    sql: "SELECT state, population FROM india_population ORDER BY population DESC LIMIT 5;",
    lang: "English",
    rows: [
      { state: "Uttar Pradesh", population: 241000000 },
      { state: "Bihar", population: 131000000 },
      { state: "Maharashtra", population: 124000000 },
      { state: "West Bengal", population: 101000000 },
      { state: "Madhya Pradesh", population: 90000000 },
    ],
  },
  {
    title: "Average income tax overview",
    prompt: "Show average income tax trends by state in India (2023-24).",
    sql: "SELECT state, AVG(income_tax) AS avg_tax FROM india_tax GROUP BY state ORDER BY avg_tax DESC;",
    lang: "English",
    rows: [
      { state: "Maharashtra", avg_tax: 12500 },
      { state: "Karnataka", avg_tax: 11800 },
      { state: "Tamil Nadu", avg_tax: 11200 },
      { state: "Uttar Pradesh", avg_tax: 9800 },
      { state: "West Bengal", avg_tax: 9500 },
    ],
  },
  {
    title: "Number of schools by district",
    prompt: "Show the number of schools in each district (2023-24).",
    sql: "SELECT district, COUNT(*) AS schools_count FROM schools GROUP BY district;",
    lang: "English",
    rows: [
      { district: "Chennai", schools_count: 320 },
      { district: "Coimbatore", schools_count: 210 },
      { district: "Madurai", schools_count: 180 },
      { district: "Tiruchirappalli", schools_count: 150 },
      { district: "Salem", schools_count: 140 },
    ],
  },
  {
    title: "Top 5 cities with highest sales",
    prompt: "List top 5 cities in India by sales volume in 2023.",
    sql: `
      SELECT city, SUM(sales_amount) AS total_sales
      FROM city_sales
      GROUP BY city
      ORDER BY total_sales DESC
      LIMIT 5;
    `,
    lang: "English",
    rows: [
      { city: "Delhi", total_sales: 950000 },
      { city: "Mumbai", total_sales: 900000 },
      { city: "Bengaluru", total_sales: 870000 },
      { city: "Chennai", total_sales: 830000 },
      { city: "Hyderabad", total_sales: 790000 },
    ],
  },
  {
    title: "Average order value by product category",
    prompt: "Show average order value for product categories in India (2023).",
    sql: `
      SELECT category, COUNT(order_id) AS total_orders, AVG(amount) AS avg_order_value
      FROM orders
      GROUP BY category
      HAVING COUNT(order_id) > 10
      ORDER BY avg_order_value DESC;
    `,
    lang: "English",
    rows: [
      { category: "Electronics", total_orders: 120, avg_order_value: 5500 },
      { category: "Furniture", total_orders: 45, avg_order_value: 4200 },
      { category: "Clothing", total_orders: 210, avg_order_value: 1500 },
      { category: "Books", total_orders: 95, avg_order_value: 800 },
      { category: "Toys", total_orders: 60, avg_order_value: 1200 },
    ],
  },
];

export default function AI() {
  const [apiKey] = useState("FAKE_API");
  const [model, setModel] = useState(aiModels[0]);
  const [prompt, setPrompt] = useState("");
  const [sql, setSql] = useState("");
  const [running, setRunning] = useState(false);
  const [showResultButton, setShowResultButton] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("table");
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);

  const runMap = useMemo(() => {
    return templates.map((t) => ({
      match: (q) => q.trim() === t.prompt.trim(),
      data: { sql: t.sql, rows: t.rows || [] },
    }));
  }, []);

  const convertToSQL = () => {
    const found = runMap.find((m) => m.match(prompt));
    const data = found
      ? found.data
      : {
          sql: `-- Example SQL generated for: "${prompt}"\nSELECT * FROM your_table WHERE condition;`,
          rows: [],
        };
    setSql(data.sql);
    setRows([]);
    setMeta({
      rows_returned: 0,
      dataset_name: `Dataset_${Math.floor(Math.random() * 10000)}`,
      dataset_version: "v1.0",
      query_runtime: "-",
      privacy_meta: { mode: "aggregation", k_threshold: 5, dp_noise: false },
    });
    setTab("table");
    setShowResultButton(true);
  };

  const runQuery = () => {
    setRunning(true);
    setTimeout(() => {
      const found = runMap.find((m) => m.match(prompt));
      const data = found
        ? found.data
        : {
            sql,
            rows: [{ message: "This is a realistic example result. Replace with your dataset." }],
          };
      setRows(data.rows);
      setMeta({
        rows_returned: data.rows.length,
        dataset_name: `Dataset_${Math.floor(Math.random() * 10000)}`,
        dataset_version: "v1.0",
        query_runtime: "120ms",
        privacy_meta: { mode: "aggregation", k_threshold: 5, dp_noise: false },
      });
      setRunning(false);
      setShowResultButton(false);
    }, 1000);
  };

  const jsonOutput = useMemo(() => JSON.stringify({ meta: meta || {}, rows }, null, 2), [meta, rows]);

  const csvOutput = useMemo(() => {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => String(r[h]).replace(/,/g, "")).join(","))];
    return lines.join("\n");
  }, [rows]);

  const curlCmd = useMemo(() => {
    const endpoint = `https://api.surveyquery.ai/ai?model=${model.id}`;
    const payload = JSON.stringify({ prompt });
    return `curl -X POST '${endpoint}' \\
      -H 'Authorization: Bearer ${apiKey}' \\
      -H 'Content-Type: application/json' \\
      -d '${payload}'`;
  }, [apiKey, model, prompt]);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  const downloadFile = (text, filename, type) => {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0a0f1f] to-[#1e293b] text-white">
      <Particles
        id="tsparticles"
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: true, mode: "repulse" }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 } } },
          particles: { color: { value: "#06b6d4" }, links: { color: "#06b6d4", distance: 150, enable: true, opacity: 0.3, width: 1 }, move: { enable: true, speed: 1 }, number: { value: 40 }, opacity: { value: 0.4 }, shape: { type: "circle" }, size: { value: 3 } },
        }}
        className="absolute inset-0 z-0"
      />

      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-7 h-7 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              SurveyQuery.ai - AI → SQL
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              RBAC: Researcher
            </span>
            <span className="hidden md:flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SQL Safe
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold">AI → SQL Editor</h2>
              </div>
              <div className="flex items-center gap-3">
                <select
                  className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                  value={model.id}
                  onChange={(e) => {
                    const m = aiModels.find((s) => s.id === e.target.value);
                    if (m) setModel(m);
                  }}
                >
                  {aiModels.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} • {s.version}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 bg-[#0b1222] border border-white/10 rounded-lg px-3 py-1.5">
                  <Key className="w-5 h-5 text-gray-300" />
                  <input
                    value={apiKey}
                    readOnly
                    className="bg-transparent outline-none text-sm w-[260px] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <textarea
                spellCheck={false}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-28 rounded-xl bg-[#0b1222] border border-white/10 focus:border-cyan-500/50 outline-none p-4 font-sans text-sm"
                placeholder="Enter your query in any language..."
              />
              <div className="mx-auto flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-1">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>RBAC: Researcher</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>SQL Safe: SELECT-only</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Text → SQL</span>
                </div>
                <FancyButton
                  color="blue"
                  icon={Play}
                  onClick={convertToSQL}
                  disabled={!prompt.trim()}
                >
                  SQLify
                </FancyButton>
              </div>
              <textarea
                spellCheck={false}
                value={sql}
                readOnly
                className="w-full mt-2 h-48 rounded-xl bg-[#0b1222] border border-white/10 outline-none p-4 font-mono text-sm"
                placeholder="Converted SQL will appear here..."
              />
              {showResultButton && (
                <div className="mt-3">
                  <FancyButton color="cyan" icon={Play} onClick={runQuery} disabled={running}>
                    {running ? "Running..." : "Run Query"}
                  </FancyButton>
                </div>
              )}
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-300" />
              <h3 className="font-semibold">Example Prompts (Multi-Language)</h3>
            </div>
            <div className="space-y-4">
              {templates.slice(0, 3).map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b1222] border border-white/10 rounded-xl p-3 hover:border-cyan-400/40 transition cursor-pointer"
                  onClick={() => setPrompt(t.prompt)}
                >
                  <p className="font-medium text-sm">{t.title} ({t.lang})</p>
                  <pre className="mt-1 text-[12px] text-gray-300 line-clamp-3">{t.prompt}</pre>
                  <p className="mt-2 text-[11px] text-gray-400">Converted SQL: {t.sql}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </section>

        <Common
          tab={tab}
          setTab={setTab}
          rows={rows}
          meta={meta}
          dataset={{ name: meta?.dataset_name || `Dataset_${Math.floor(Math.random() * 10000)}`, version: "v1.0" }}
          jsonOutput={jsonOutput}
          csvOutput={csvOutput}
          curlCmd={curlCmd}
          copyText={copyText}
          downloadFile={downloadFile}
          copied={copied}
        />
      </main>
    </div>
  );
}
