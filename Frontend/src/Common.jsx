import React, { useState } from "react";
import {
  Database,
  ShieldCheck,
  TerminalSquare,
  Clipboard,
  Download,
  CheckCircle2,
  FileJson,
  FileText,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#06b6d4", "#facc15", "#f472b6", "#a78bfa", "#10b981"];

const Common = ({
  tab,
  setTab,
  rows,
  meta,
  dataset,
  jsonOutput,
  csvOutput,
  curlCmd,
  copyText,
  downloadFile,
  copied,
}) => {
  const [chartType, setChartType] = useState("bar");

  const chartData = rows.map((r, i) => ({
    name: r[Object.keys(r)[0]] || `Row ${i + 1}`,
    value: Number(r[Object.keys(r)[1]]) || 0,
  }));

  const renderChart = () => {
    if (!chartData.length) return <div className="text-gray-400 text-sm">No chart data available.</div>;
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0b1222", border: "none", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#0b1222", border: "none", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0b1222", border: "none", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return <div className="text-gray-400 text-sm">Unsupported chart type.</div>;
    }
  };

  return (
    <div>
      <section className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
          <button
            onClick={() => setTab("table")}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
              tab === "table"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <Database className="w-4 h-4" /> Table
          </button>
          <button
            onClick={() => setTab("json")}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
              tab === "json"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <FileJson className="w-4 h-4" /> JSON
          </button>
          <button
            onClick={() => setTab("csv")}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
              tab === "csv"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <FileText className="w-4 h-4" /> CSV
          </button>
          <button
            onClick={() => setTab("curl")}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
              tab === "curl"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <TerminalSquare className="w-4 h-4" /> cURL
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() =>
                copyText(
                  tab === "json"
                    ? jsonOutput
                    : tab === "csv"
                    ? csvOutput
                    : tab === "curl"
                    ? curlCmd
                    : csvOutput
                )
              }
              className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 hover:border-cyan-400/40 flex items-center gap-2"
            >
              <Clipboard className="w-4 h-4" /> Copy
            </button>
            {tab === "csv" && (
              <button
                onClick={() => downloadFile(csvOutput || "no_data", `${dataset.id}.csv`, "text/csv")}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 hover:border-cyan-400/40 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
            )}
            {tab === "json" && (
              <button
                onClick={() => downloadFile(jsonOutput || "{}", `${dataset.id}.json`, "application/json")}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 hover:border-cyan-400/40 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> JSON
              </button>
            )}
          </div>
        </div>
        
        {tab === "json" && (
          <div className="p-5">
            <pre className="bg-[#0b1222] border border-white/10 rounded-xl p-4 text-xs overflow-auto">{jsonOutput}</pre>
          </div>
        )}
        {tab === "csv" && (
          <div className="p-5">
            <pre className="bg-[#0b1222] border border-white/10 rounded-xl p-4 text-xs overflow-auto">{csvOutput || ""}</pre>
          </div>
        )}
        {tab === "curl" && (
          <div className="p-5">
            <pre className="bg-[#0b1222] border border-white/10 rounded-xl p-4 text-xs overflow-auto">{curlCmd}</pre>
            <div className="text-xs text-gray-400 mt-3">
              Replace the SQL and dataset as needed. CSV available via <span className="text-gray-300">?format=csv</span>.
            </div>
          </div>
        )}
          <div className="p-5">
            {rows.length ? (
              <>
                <div className="w-full overflow-auto rounded-xl border border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#0b1222]">
                      <tr>
                        {Object.keys(rows[0]).map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-semibold border-b border-white/10">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} className="odd:bg-white/[0.02]">
                          {Object.keys(rows[0]).map((h) => (
                            <td key={h} className="px-4 py-2 border-b border-white/5">
                              {String(r[h])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8">
                  <div className="flex gap-2 mb-3">
                    {["bar", "pie", "line"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          chartType === type ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 hover:bg-white/10 text-gray-300"
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">{renderChart()}</div>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm">Run a query to see results.</div>
            )}
            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                <span className="text-gray-400">Rows</span>
                <div className="text-cyan-300 font-semibold">{meta?.rows_returned ?? 0}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                <span className="text-gray-400">Runtime</span>
                <div className="text-cyan-300 font-semibold">{meta?.query_runtime ?? "-"}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                <span className="text-gray-400">Dataset</span>
                <div className="text-cyan-300 font-semibold">{meta?.dataset_name ?? "-"}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
                <span className="text-gray-400">Version</span>
                <div className="text-cyan-300 font-semibold">{meta?.dataset_version ?? "-"}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Privacy: aggregation-only • k-threshold 5 • DP noise off
            </div>
          </div>
      </section>
      <section className="grid md:grid-cols-3 gap-6 mt-10 mb-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-semibold">Safety & Controls</h4>
          </div>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>SQL AST validation • SELECT-only</li>
            <li>Column-level masking via RBAC</li>
            <li>Auto LIMIT & execution timeout</li>
            <li>Audit hash & query logging</li>
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold">Quick Tips</h4>
          </div>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>Qualify dataset and column names</li>
            <li>Use GROUP BY for aggregates</li>
            <li>Prefer WHERE filters to speed up</li>
            <li>Limit results when exploring</li>
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold">After SQL</h4>
          </div>
          <p className="text-sm text-gray-300">
            Auto-generate bar, pie, line, and India map charts; export as PNG or PDF. Switch to the AI mode for natural-language insights or export results as CSV for charting in the dashboard.
          </p>
        </div>
      </section>
      {copied && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Copied to clipboard
          </div>
        </div>
      )}
      <footer className="relative z-10 px-6 py-8 text-gray-400 text-center border-t border-white/10">
        © 2025 SurveyQuery.ai
      </footer>
    </div>
  );
};

export default Common;
