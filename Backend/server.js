const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const VALID_API_KEY = "sk_live_51J6hP4gF7T3z8R9qW2Lk3Vn";

// --- Mock Data Store ---

const sqlResponses = {
  "SELECT state, ROUND(AVG(unemployment_rate),2) AS unemployment_rate FROM plfs_2023_q4 GROUP BY state ORDER BY unemployment_rate DESC LIMIT 10;": [
    { state: "Kerala", unemployment_rate: 9.82 },
    { state: "Rajasthan", unemployment_rate: 9.21 },
    { state: "Haryana", unemployment_rate: 8.94 },
    { state: "Bihar", unemployment_rate: 8.63 },
  ],
  "SELECT month, ROUND(AVG(lfpr),2) AS lfpr FROM plfs_2023_q4 GROUP BY month ORDER BY month;": [
    { month: "Jan", lfpr: 42.5 },
    { month: "Feb", lfpr: 43.1 },
    { month: "Mar", lfpr: 42.8 },
  ],
};

const aiResponses = {
  "What was the average literacy rate in West Bengal during the 75th round?": [
    { state: "West Bengal", average_literacy_rate: 76.26 }
  ],
  "Show me the top 5 districts in West Bengal by female literacy rate": [
    { district: "Kolkata", female_literacy_rate: 84.98 },
    { district: "Purba Medinipur", female_literacy_rate: 80.20 },
    { district: "Howrah", female_literacy_rate: 79.05 },
    { district: "Hooghly", female_literacy_rate: 78.55 },
    { district: "North 24 Parganas", female_literacy_rate: 78.49 }
  ],
};

// New mapping for the nl2sql-preview endpoint
const nlToSqlMapping = {
    "What was the average literacy rate in West Bengal during the 75th round?": "SELECT AVG(literacy_rate) AS average_literacy_rate FROM nss_75_education WHERE state = 'West Bengal';",
    "Show me the top 5 districts in West Bengal by female literacy rate": "SELECT district, female_literacy_rate FROM nss_75_education WHERE state = 'West Bengal' ORDER BY female_literacy_rate DESC LIMIT 5;"
};


// --- API Endpoints ---

// Middleware for API Key Authentication
const checkApiKey = (req, res, next) => {
  const authHeader = req.headers["x-api-key"] || "";
  const token = authHeader.trim();

  if (token !== VALID_API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
};

// SQL Execution Endpoint
app.post("/v1/query/sql", checkApiKey, (req, res) => {
  const { sql } = req.body;
  if (!sql) return res.status(400).json({ error: "Missing 'sql' field in request body" });

  const normalized = sql.replace(/\s+/g, " ").trim();
  const data = sqlResponses[normalized];

  if (!data) {
    return res.status(400).json({ error: "Query not recognized" });
  }

  return res.json({
    metadata: {
      rows_returned: data.length,
      query_runtime: "150 ms",
      dataset_name: "PLFS 2023 Q4",
      dataset_version: "v1.0",
      privacy_meta: { k_threshold_applied: true, k_value: 5 }
    },
    data
  });
});

// AI Query Execution Endpoint
app.post("/v1/query/ai", checkApiKey, (req, res) => {
  const { query, dataset_id = null, language = "en" } = req.body;
  if (!query) return res.status(400).json({ error: "Missing 'query' field in request body" });

  const normalized = query.trim();
  const data = aiResponses[normalized];

  if (!data) {
    return res.status(400).json({ error: "Prompt not recognized" });
  }

  return res.json({
    metadata: {
      rows_returned: data.length,
      query_runtime: "120 ms",
      dataset_name: dataset_id || "Auto-inferred",
      dataset_version: "1.0",
      privacy_meta: { k_threshold_applied: true, k_value: 5 }
    },
    data
  });
});

// NEW: Natural Language to SQL Preview Endpoint
app.post("/nl2sql-preview", checkApiKey, (req, res) => {
    const { query, dataset_id = null, language = "en" } = req.body;
    if (!query) return res.status(400).json({ error: "Missing 'query' field in request body" });

    const normalized = query.trim();
    const proposedSql = nlToSqlMapping[normalized];

    if (!proposedSql) {
        return res.status(400).json({ error: "Prompt not recognized for SQL generation" });
    }

    return res.json({
        sql_proposal: proposedSql,
        confidence_score: 0.95, // Mock confidence score
        metadata: {
            engine: "SurveyQuery-AI-v2",
            language_detected: language,
            dataset_inferred: dataset_id || "nss_75_education"
        }
    });
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`SurveyQuery.ai backend running at http://localhost:${PORT}`);
});
