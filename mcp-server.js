import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_URL =
    process.env.SF_MCP_URL ||
    "https://api.salesforce.com/platform/mcp/v1/sandbox/platform/sobject-all";

async function run() {
    const token = process.env.SF_ACCESS_TOKEN;
    const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
        requestInit: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });

    const client = new Client({ name: "CI-Runner", version: "1.0.0" }, { capabilities: {}, timeout: 300000 });
    await client.connect(transport);
    const result = await client.callTool({
        name: "soqlQuery",
        arguments: {
            q : "SELECT Id, Name FROM Contact LIMIT 10",
        },
    });

    console.log(JSON.stringify(result, null, 2));
}

run().catch(console.error);
