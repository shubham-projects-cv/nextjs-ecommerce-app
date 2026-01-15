import { Client } from "@elastic/elasticsearch";

export const esClient =
  process.env.ENABLE_ELASTIC === "true"
    ? new Client({
        node: process.env.ELASTICSEARCH_URL,
      })
    : null;
