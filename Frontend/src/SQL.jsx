import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import {
  Database,
  ShieldCheck,
  Key,
  Lock,
  Zap,
  TerminalSquare,
  Play,
  ChevronRight,
  Info,
} from "lucide-react";
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

const sampleSets = [
  { id: "all", name: "All Datasets", version: "-" },
  { id: "plfs_2023_q4", name: "PLFS 2023 Q4", version: "v1.0" },
  { id: "nss_cons_78", name: "NSS Consumption Round 78", version: "v1.0" },
  { id: "asih_2022", name: "ASIH 2022 Health", version: "v1.0" },
  { id: "plfs_all", name: "PLFS Historical", version: "v1.0" },
];

const templates = [
  {
    title: "Top 10 states by unemployment rate",
    sql: `SELECT state, ROUND(AVG(unemployment_rate),2) AS unemployment_rate
FROM plfs_2023_q4
GROUP BY state
ORDER BY unemployment_rate DESC
LIMIT 10;`,
  },
  {
    title: "Monthly LFPR trend (national)",
    sql: `SELECT month, ROUND(AVG(lfpr),2) AS lfpr
FROM plfs_2023_q4
GROUP BY month
ORDER BY month;`,
  },
  {
    title: "Rural vs Urban consumption (mean)",
    sql: `SELECT sector, ROUND(AVG(mpce),2) AS avg_mpce
FROM nss_cons_78
GROUP BY sector;`,
  },
  {
    title: "States with fastest rise in unemployment (Q3 → Q4)",
    sql: `SELECT state, 
             ROUND(AVG(CASE WHEN quarter = '2023_Q3' THEN unemployment_rate END), 2) AS q3_rate,
             ROUND(AVG(CASE WHEN quarter = '2023_Q4' THEN unemployment_rate END), 2) AS q4_rate,
             ROUND(
               (AVG(CASE WHEN quarter = '2023_Q4' THEN unemployment_rate END) - 
                AVG(CASE WHEN quarter = '2023_Q3' THEN unemployment_rate END)), 2
             ) AS change
      FROM plfs_all
      WHERE quarter IN ('2023_Q3', '2023_Q4')
      GROUP BY state
      ORDER BY change DESC
      LIMIT 10;`,
  },
  {
    title: "Top states by LFPR growth (Q3 → Q4)",
    sql: `SELECT state, 
             ROUND(AVG(CASE WHEN quarter = '2023_Q3' THEN lfpr END), 2) AS q3_lfpr,
             ROUND(AVG(CASE WHEN quarter = '2023_Q4' THEN lfpr END), 2) AS q4_lfpr,
             ROUND(
               (AVG(CASE WHEN quarter = '2023_Q4' THEN lfpr END) - 
                AVG(CASE WHEN quarter = '2023_Q3' THEN lfpr END)), 2
             ) AS change
      FROM plfs_all
      WHERE quarter IN ('2023_Q3', '2023_Q4')
      GROUP BY state
      ORDER BY change DESC
      LIMIT 10;`,
  },
  {
    title: "Fastest growing rural consumption (monthly)",
    sql: `SELECT month, 
             ROUND(AVG(mpce), 2) AS avg_mpce,
             ROUND(
               AVG(mpce) - LAG(AVG(mpce)) OVER (ORDER BY month), 2
             ) AS change
      FROM nss_cons_78
      WHERE sector = 'Rural'
      GROUP BY month
      ORDER BY change DESC
      LIMIT 10;`,
  }
];

export default function SQL() {
  const [apiKey, setApiKey] = useState("FAKE_API");
  const [dataset, setDataset] = useState(sampleSets[0]); // default "All"
  const [sql, setSql] = useState("");
  const [running, setRunning] = useState(false);
  const [meta, setMeta] = useState(null);
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("table");
  const [copied, setCopied] = useState(false);

  const runMap = useMemo(() => {
    return [
      {
        match: (q) => q.replace(/\s+/g, " ").trim() === templates[0].sql.replace(/\s+/g, " ").trim(),
        data: [
          { state: "Kerala", unemployment_rate: 9.82, sample_n: 1842 },
          { state: "Rajasthan", unemployment_rate: 9.21, sample_n: 2110 },
          { state: "Haryana", unemployment_rate: 8.94, sample_n: 1734 },
          { state: "Bihar", unemployment_rate: 8.63, sample_n: 2650 },
          { state: "Punjab", unemployment_rate: 8.22, sample_n: 1490 },
          { state: "Assam", unemployment_rate: 7.98, sample_n: 1204 },
          { state: "Jharkhand", unemployment_rate: 7.61, sample_n: 1377 },
          { state: "Goa", unemployment_rate: 7.25, sample_n: 402 },
          { state: "Uttar Pradesh", unemployment_rate: 7.02, sample_n: 4982 },
          { state: "Himachal Pradesh", unemployment_rate: 6.88, sample_n: 690 },
        ],
      },
      {
        match: (q) => q.replace(/\s+/g, " ").trim() === templates[1].sql.replace(/\s+/g, " ").trim(),
        data: [
          { month: "Jan", lfpr: 42.5 },
          { month: "Feb", lfpr: 43.1 },
          { month: "Mar", lfpr: 42.8 },
          { month: "Apr", lfpr: 43.6 },
          { month: "May", lfpr: 44.0 },
          { month: "Jun", lfpr: 43.3 },
        ],
      },
      {
        match: (q) => q.replace(/\s+/g, " ").trim() === templates[2].sql.replace(/\s+/g, " ").trim(),
        data: [
          { sector: "Rural", avg_mpce: 1543.25 },
          { sector: "Urban", avg_mpce: 2891.42 },
        ],
      },
      {
        match: (q) => q.replace(/\s+/g, " ").trim() === templates[3].sql.replace(/\s+/g, " ").trim(),
        data: [
          { state: "Kerala", q3_rate: 8.12, q4_rate: 9.82, change: 1.70 },
          { state: "Rajasthan", q3_rate: 7.75, q4_rate: 9.21, change: 1.46 },
          { state: "Haryana", q3_rate: 7.60, q4_rate: 8.94, change: 1.34 },
          { state: "Bihar", q3_rate: 7.45, q4_rate: 8.63, change: 1.18 },
          { state: "Punjab", q3_rate: 7.12, q4_rate: 8.22, change: 1.10 },
          { state: "Assam", q3_rate: 7.05, q4_rate: 7.98, change: 0.93 },
          { state: "Jharkhand", q3_rate: 6.88, q4_rate: 7.61, change: 0.73 },
          { state: "Goa", q3_rate: 6.50, q4_rate: 7.25, change: 0.75 },
          { state: "Uttar Pradesh", q3_rate: 6.50, q4_rate: 7.02, change: 0.52 },
          { state: "Himachal Pradesh", q3_rate: 6.50, q4_rate: 6.88, change: 0.38 },
        ],
      },
      {
        match: (q) => q.replace(/\s+/g, " ").trim() === templates[4].sql.replace(/\s+/g, " ").trim(),
        data: [
          { state: "Karnataka", q3_lfpr: 40.5, q4_lfpr: 42.1, change: 1.6 },
          { state: "Kerala", q3_lfpr: 39.8, q4_lfpr: 41.3, change: 1.5 },
          { state: "Tamil Nadu", q3_lfpr: 41.0, q4_lfpr: 42.4, change: 1.4 },
          { state: "Rajasthan", q3_lfpr: 42.2, q4_lfpr: 43.5, change: 1.3 },
          { state: "Bihar", q3_lfpr: 38.7, q4_lfpr: 40.0, change: 1.3 },
          { state: "Punjab", q3_lfpr: 40.1, q4_lfpr: 41.3, change: 1.2 },
          { state: "Haryana", q3_lfpr: 41.3, q4_lfpr: 42.5, change: 1.2 },
          { state: "UP", q3_lfpr: 39.0, q4_lfpr: 40.1, change: 1.1 },
          { state: "Gujarat", q3_lfpr: 42.5, q4_lfpr: 43.5, change: 1.0 },
          { state: "MP", q3_lfpr: 41.0, q4_lfpr: 42.0, change: 1.0 },
        ],
      },
      {
        match: (q) => q.replace(/\s+/g, " ").trim() === templates[5].sql.replace(/\s+/g, " ").trim(),
        data: [
          { month: "Feb", avg_mpce: 1500.25, change: 50.12 },
          { month: "May", avg_mpce: 1600.80, change: 48.50 },
          { month: "Aug", avg_mpce: 1650.42, change: 45.20 },
          { month: "Apr", avg_mpce: 1550.70, change: 44.80 },
          { month: "Jul", avg_mpce: 1620.55, change: 42.30 },
          { month: "Mar", avg_mpce: 1520.40, change: 40.15 },
          { month: "Jun", avg_mpce: 1585.90, change: 38.25 },
          { month: "Sep", avg_mpce: 1670.10, change: 35.50 },
          { month: "Jan", avg_mpce: 1450.00, change: 30.00 },
          { month: "Oct", avg_mpce: 1700.00, change: 29.90 },
        ],
      },
    ];
  }, []);

  const fakeRun = () => {
    setRunning(true);
    setTab("table");
    setTimeout(() => {
      const normalized = sql.replace(/\s+/g, " ").trim();
      const found = runMap.find((m) => m.match(normalized));
      const data = found ? found.data : [];
      const runtime = Math.floor(220 + Math.random() * 180);
      setRows(data);
      setMeta({
        rows_returned: data.length,
        query_runtime: `${runtime} ms`,
        dataset_name: dataset.name,
        dataset_version: dataset.version,
        privacy_meta: { mode: "aggregation", k_threshold: 5, dp_noise: false },
      });
      setRunning(false);
    }, 600);
  };

  const jsonOutput = useMemo(
    () => JSON.stringify({ meta: meta || {}, rows }, null, 2),
    [meta, rows]
  );

  const csvOutput = useMemo(() => {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        headers.map((h) => String(r[h]).replace(/,/g, "")).join(",")
      ),
    ];
    return lines.join("\n");
  }, [rows]);

  const curlCmd = useMemo(() => {
    const endpoint = `https://api.surveyquery.ai/sql?dataset=${dataset.id}`;
    const payload = JSON.stringify({ q: sql });
    return `curl -X POST '${endpoint}' \\
  -H 'Authorization: Bearer ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '${payload}'`;
  }, [apiKey, dataset, sql]);

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">SurveyQuery.ai</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" /> RBAC: Researcher
            </span>
            <span className="hidden md:flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Lock className="w-4 h-4" /> SQL Safe: SELECT-only
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TerminalSquare className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold">SQL Editor</h2>
              </div>
              <div className="flex items-center gap-3">
                <select
                  className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                  value={dataset.id}
                  onChange={(e) => {
                    const d = sampleSets.find((s) => s.id === e.target.value);
                    if (d) setDataset(d);
                  }}
                >
                  {sampleSets.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} • {s.version}</option>
                  ))}
                </select>
                <div className="hidden md:flex items-center gap-2 bg-[#0b1222] border border-white/10 rounded-lg px-3 py-1.5">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <input
                    value={apiKey}
                    readOnly
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-transparent outline-none text-sm w-[260px]"
                    placeholder="API Key"
                  />
                </div>
              </div>
            </div>

            <div className="p-5">
              <textarea
                spellCheck={false}
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                className="w-full h-56 md:h-64 rounded-xl bg-[#0b1222] border border-white/10 focus:border-cyan-500/50 outline-none p-4 font-mono text-sm"
                placeholder="Write your SQL here..."
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Auto LIMIT 1000</span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Timeout 30s</span>
                </div>
                <div className="flex items-center gap-3">
                  <FancyButton color="blue" icon={Play} onClick={fakeRun} disabled={running || !sql.trim()}>
                    {running ? "Running..." : "Run Query"}
                  </FancyButton>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-300" />
              <h3 className="font-semibold">Query Templates</h3>
            </div>
            <div className="space-y-2">
              {templates.slice(0, 3).map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSql(t.sql)}
                  className="w-full text-left group px-3 py-3 rounded-xl bg-[#0b1222] border border-white/10 hover:border-cyan-400/40 hover:bg-[#0e1730] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
                  </div>
                  <pre className="mt-1 text-[11px] text-gray-300 opacity-80 line-clamp-2">{t.sql}</pre>
                </button>
              ))}
            </div>
            <div className="mt-5 text-xs text-gray-400 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5" />
              <p>Only SELECT queries are allowed. Sensitive columns may be masked based on your role.</p>
            </div>
          </motion.aside>
        </section>
        <Common
          tab={tab}
          setTab={setTab}
          rows={rows}
          meta={meta}
          dataset={dataset}
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
