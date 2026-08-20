# @seosiri/industrial-ai-gateway

> 📖 **Official Architecture & Documentation:** [SEOSiri IAIG Guide](https://www.seosiri.com/2026/08/industrial-ai-gateway.html) | [Developer Portal & Graph Explorer](https://developers.seosiri.com/) | [Central Directory](https://www.seosiri.com/2026/07/seosiri-mcp-servers.html)

[![SEOSiri IAIG on Glama](https://glama.ai/mcp/servers/SEOSiri-Official/industrial-ai-gateway/badges/score.svg)](https://glama.ai/mcp/servers/SEOSiri-Official/industrial-ai-gateway)

The Zero-Trust Semantic Infrastructure for Autonomous Cyber-Physical Systems, Factory Floors, SCADA/MES Bridges, and Industrial Robot Fleets.

## 🏭 6 Core Architectural Layers
1. **Core Integration & Connectivity Layer:** ISA-95 Unified Namespace (UNS) translation, Modbus TCP/OPC UA/Sparkplug B bridges.
2. **Telemetry Optimization & Token Management:** Local machine learning vectorized summarization and time-series compression buffers.
3. **Deterministic Guardrail Validation Core:** Physics-Aware Digital Twin simulation, mechanical hard interlocks, and exception feedback loops.
4. **Hierarchical Reasoning & Hybrid Routing:** Air-gapped Small Language Model (SLM) diagnostic execution and multi-tier cloud escalation.
5. **Security, Access Control & AI Firewalls:** Protocol-level prompt inspection (AI Firewall) and hardware-bound TPM 2.0 signatures.
6. **Advanced Fleet Robotics & IoT Control:** ROS 2 Action Goal synthesis (nav2_msgs), E-Nose olfactory arrays, and Biometric IoT Bridge authentication.

## 💼 Commercial Licensing & High-Throughput API Keys
Need production edge gateway access or bespoke plant integration?
- **Free Tier:** 30 requests / minute.
- **Pro Tier ($299/mo):** 1,000 req/min across all industrial edge gateways.
- **Enterprise Contract ($2,500):** Dedicated Zero Trust VPC setup, custom PLC drivers, and on-site TPM calibration.
- **Payment Method:** Payoneer (`badhan_pbn@yahoo.com`).
- **Developer Portal:** [developers.seosiri.com](https://developers.seosiri.com/) | **Contact:** `info@seosiri.com`

## Quickstart
```bash
npm install @seosiri/industrial-ai-gateway
npm run build
npm test
```

### Claude Desktop Configuration (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "seosiri-iaig": {
      "command": "npx",
      "args": [
        "-y",
        "@seosiri/industrial-ai-gateway"
      ]
    }
  }
}
```

## License
Distributed under the MIT License. See [LICENSE](https://github.com/SEOSiri-Official/industrial-ai-gateway/blob/main/LICENSE) for more information.
