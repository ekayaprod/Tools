# filepath: Tools/UK-US-Boardgame-Arbitrage/jules-arbitrage-workers.md

## Task Context
You are orchestrating a multi-stage data gathering workflow to identify board games that are cheaper or more available in the UK than the US. 

## Sub-Tasks for Execution
Execute the following stages sequentially using your available MCP tools.

### Stage 1: Market Data Collection
*   **Objective:** Query Amazon UK and US endpoints to build a baseline list of UK-advantaged games from European publishers.
*   **Tools:** Web search, pricing MCPs.

### Stage 2: Metadata Verification
*   **Objective:** Query the BoardGameGeek database using the `bgg-mcp` tool.
*   **Constraints:** Filter out low-effort meme games. Verify weight and complexity ratings to ensure the list favors mid-to-heavy strategy Eurogames or highly rated party games.

### Stage 3: Accessibility Review
*   **Objective:** Use the `bgg-mcp` tool to scan forum threads and rulesets for the remaining games.
*   **Target:** Identify any fan-made variants or inherent mechanics suitable for a 4-year-old child.

### Stage 4: Synthesis
*   **Objective:** Generate a final markdown table containing the following columns: Game Title, Publisher, Primary Category, UK vs. US Market Status, 4-Year-Old Accessible.
