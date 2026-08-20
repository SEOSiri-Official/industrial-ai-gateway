import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import {
  listAssetsSchema, solveListAssets,
  readTagSchema, solveReadTag,
  queryHistorianSchema, solveQueryHistorian,
  getSemanticTelemetrySchema, solveGetSemanticTelemetry,
  getEventAnomaliesSchema, solveGetEventAnomalies,
  compressTrendWindowSchema, solveCompressTrendWindow,
  simulatePhysicsImpactSchema, solveSimulatePhysicsImpact,
  checkPlcInterlocksSchema, solveCheckPlcInterlocks,
  validateControlLimitsSchema, solveValidateControlLimits,
  routeLocalSlmSchema, solveRouteLocalSlm,
  proxyCloudEscalationSchema, solveProxyCloudEscalation,
  syncOfflineCacheSchema, solveSyncOfflineCache,
  verifyOperatorSessionSchema, solveVerifyOperatorSession,
  validateTpmSignatureSchema, solveValidateTpmSignature,
  inspectPromptSafetySchema, solveInspectPromptSafety,
  dispatchRos2GoalSchema, solveDispatchRos2Goal,
  queueProposalHmiSchema, solveQueueProposalHmi,
  throttleToolContextSchema, solveThrottleToolContext
} from './tools.js';

dotenv.config();

const mcpServer = new Server(
  {
    name: 'SEOSiri-Industrial-AI-Gateway',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// ----------------------------------------------------------------------------
// REGISTRATION OF ALL 18 IAIG PRODUCTION TOOLS
// ----------------------------------------------------------------------------
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // 1. Connectivity & Pipeline Layer
    {
      name: 'iaig_list_assets',
      description: 'Browses the ISA-95 hierarchical asset tree (Enterprise/Site/Area/Line/Cell/Asset).',
      inputSchema: {
        type: 'object',
        properties: {
          enterprise_scope: { type: 'string', description: 'Enterprise domain name.' },
          level_depth: { type: 'string', enum: ['SITE', 'AREA', 'LINE', 'CELL', 'ASSET'] }
        }
      }
    },
    {
      name: 'iaig_read_tag',
      description: 'Fetches real-time process variables from the Unified Namespace (UNS) over MQTT Sparkplug B or OPC UA.',
      inputSchema: {
        type: 'object',
        properties: {
          uns_topic_path: { type: 'string', description: 'Full UNS topic path.' },
          protocol: { type: 'string', enum: ['MQTT_SPARKPLUG_B', 'OPC_UA', 'MODBUS_TCP'] }
        },
        required: ['uns_topic_path']
      }
    },
    {
      name: 'iaig_query_historian',
      description: 'Pulls deep historical time-series database logs for pattern and trend analysis.',
      inputSchema: {
        type: 'object',
        properties: {
          tag_name: { type: 'string', description: 'Target sensor or actuator tag.' },
          start_time_iso: { type: 'string', description: 'Start timestamp in ISO format.' },
          end_time_iso: { type: 'string', description: 'End timestamp in ISO format.' },
          aggregation: { type: 'string', enum: ['RAW', 'AVERAGE_1M', 'MAX_5M'] }
        },
        required: ['tag_name', 'start_time_iso', 'end_time_iso']
      }
    },

    // 2. Optimization & Compression Layer
    {
      name: 'iaig_get_semantic_telemetry',
      description: 'Fetches edge-computed text summaries of high-frequency sensor waves instead of raw numbers.',
      inputSchema: {
        type: 'object',
        properties: {
          sensor_channel_id: { type: 'string', description: 'Sensor channel identifier.' },
          high_frequency_burst: { type: 'array', items: { type: 'number' }, description: 'Array of high-frequency sensor readings.' }
        },
        required: ['sensor_channel_id', 'high_frequency_burst']
      }
    },
    {
      name: 'iaig_get_event_anomalies',
      description: 'Returns localized vector-based anomaly alerts (e.g. Bearing wear index at 84%).',
      inputSchema: {
        type: 'object',
        properties: {
          asset_path: { type: 'string', description: 'Asset path under inspection.' },
          raw_vibration_or_acoustic_fft: { type: 'array', items: { type: 'number' }, description: 'FFT frequency spectrum array.' }
        },
        required: ['asset_path', 'raw_vibration_or_acoustic_fft']
      }
    },
    {
      name: 'iaig_compress_trend_window',
      description: 'Batches heavy operational datasets into compact analytical trends to save LLM tokens.',
      inputSchema: {
        type: 'object',
        properties: {
          dataset_tag: { type: 'string', description: 'Data series tag.' },
          raw_samples: { type: 'array', items: { type: 'number' }, description: 'Raw numerical time-series samples.' }
        },
        required: ['dataset_tag', 'raw_samples']
      }
    },

    // 3. Safety & Validation Core Layer
    {
      name: 'iaig_simulate_physics_impact',
      description: 'Passes proposed machine commands through the physics-aware Digital Twin sandbox to evaluate safety.',
      inputSchema: {
        type: 'object',
        properties: {
          asset_path: { type: 'string', description: 'Target asset path in Unified Namespace.' },
          proposed_command: { type: 'string', description: 'Command to simulate.' },
          target_parameters: { type: 'object', description: 'Proposed execution parameters.' }
        },
        required: ['asset_path', 'proposed_command', 'target_parameters']
      }
    },
    {
      name: 'iaig_check_plc_interlocks',
      description: 'Verifies if physical machinery satisfies hardcoded plant pre-conditions and safety interlocks.',
      inputSchema: {
        type: 'object',
        properties: {
          asset_path: { type: 'string', description: 'Machine asset path to check.' }
        },
        required: ['asset_path']
      }
    },
    {
      name: 'iaig_validate_control_limits',
      description: 'Reviews proposed parameters against an immutable mechanical safety profile.',
      inputSchema: {
        type: 'object',
        properties: {
          asset_path: { type: 'string', description: 'Equipment asset path.' },
          proposed_velocity_deg_s: { type: 'number', description: 'Proposed axis velocity.' },
          proposed_temp_celsius: { type: 'number', description: 'Proposed thermal setpoint.' }
        },
        required: ['asset_path']
      }
    },

    // 4. Hybrid Routing & Multi-Tier Layer
    {
      name: 'iaig_route_local_slm',
      description: 'Executes localized, low-latency diagnostic loops safely within air-gapped hardware.',
      inputSchema: {
        type: 'object',
        properties: {
          diagnostic_prompt: { type: 'string', description: 'Fault description or query.' },
          machine_telemetry_snippet: { type: 'object', description: 'Recent sensor readings.' }
        },
        required: ['diagnostic_prompt', 'machine_telemetry_snippet']
      }
    },
    {
      name: 'iaig_proxy_cloud_escalation',
      description: 'Anonymizes data and pushes complex multi-site optimization problems to cloud LLM clusters.',
      inputSchema: {
        type: 'object',
        properties: {
          multi_site_optimization_problem: { type: 'string', description: 'Global optimization problem statement.' },
          site_nodes: { type: 'array', items: { type: 'string' }, description: 'List of participating plant sites.' }
        },
        required: ['multi_site_optimization_problem', 'site_nodes']
      }
    },
    {
      name: 'iaig_sync_offline_cache',
      description: 'Flushes and updates local tool-call logs built up during network dropouts.',
      inputSchema: {
        type: 'object',
        properties: {
          pending_audit_logs: { type: 'array', items: { type: 'object' }, description: 'Queued offline audit logs.' }
        },
        required: ['pending_audit_logs']
      }
    },

    // 5. Security & Identity Layer
    {
      name: 'iaig_verify_operator_session',
      description: 'Binds active tool execution to an operator corporate OAuth2 session and Biometric IoT token.',
      inputSchema: {
        type: 'object',
        properties: {
          operator_oauth_token: { type: 'string', description: 'Operator OAuth2 session token.' },
          biometric_token: { type: 'string', description: 'Optional biometric hardware auth string.' }
        },
        required: ['operator_oauth_token']
      }
    },
    {
      name: 'iaig_validate_tpm_signature',
      description: 'Challenges physical hardware to prove the request originated from a trusted edge gateway TPM chip.',
      inputSchema: {
        type: 'object',
        properties: {
          signed_command_payload: { type: 'string', description: 'Serialized payload to verify.' },
          tpm_2_signature: { type: 'string', description: 'HMAC signature from TPM 2.0 cryptoprocessor.' }
        },
        required: ['signed_command_payload', 'tpm_2_signature']
      }
    },
    {
      name: 'iaig_inspect_prompt_safety',
      description: 'Runs incoming operator text strings through the AI Firewall to intercept prompt injections.',
      inputSchema: {
        type: 'object',
        properties: {
          incoming_prompt_string: { type: 'string', description: 'Text prompt to inspect.' }
        },
        required: ['incoming_prompt_string']
      }
    },

    // 6. Robotics Fleet Control Layer
    {
      name: 'iaig_dispatch_ros2_goal',
      description: 'Translates high-level natural language instructions into deterministic ROS 2 Nav2 goals.',
      inputSchema: {
        type: 'object',
        properties: {
          amr_id: { type: 'string', description: 'Autonomous Mobile Robot ID.' },
          destination_zone: { type: 'string', description: 'Target plant zone.' },
          speed_limit_mps: { type: 'number', description: 'Maximum navigation speed in m/s.' }
        },
        required: ['amr_id', 'destination_zone']
      }
    },
    {
      name: 'iaig_queue_proposal_hmi',
      description: 'Locks physical AI action inside a queue until human operator physically approves on plant HMI screen.',
      inputSchema: {
        type: 'object',
        properties: {
          proposed_action_name: { type: 'string', description: 'Action name.' },
          target_equipment: { type: 'string', description: 'Target machine identifier.' },
          parameters: { type: 'object', description: 'Command parameters.' }
        },
        required: ['proposed_action_name', 'target_equipment', 'parameters']
      }
    },
    {
      name: 'iaig_throttle_tool_context',
      description: 'Dynamically restricts exposed tools based on operator clearance or license to reduce context bloat.',
      inputSchema: {
        type: 'object',
        properties: {
          operator_role: { type: 'string', enum: ['OPERATOR', 'ENGINEER', 'MAINTENANCE_SUPERVISOR', 'SYSTEM_ARCHITECT'] },
          active_work_order: { type: 'string', description: 'Current maintenance or job ID.' }
        },
        required: ['operator_role', 'active_work_order']
      }
    }
  ]
}));

// Tool Execution Router
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      // 1. Connectivity
      case 'iaig_list_assets':
        return { content: [{ type: 'text', text: JSON.stringify(solveListAssets(listAssetsSchema.parse(args))) }] };
      case 'iaig_read_tag':
        return { content: [{ type: 'text', text: JSON.stringify(solveReadTag(readTagSchema.parse(args))) }] };
      case 'iaig_query_historian':
        return { content: [{ type: 'text', text: JSON.stringify(solveQueryHistorian(queryHistorianSchema.parse(args))) }] };

      // 2. Optimization
      case 'iaig_get_semantic_telemetry':
        return { content: [{ type: 'text', text: JSON.stringify(solveGetSemanticTelemetry(getSemanticTelemetrySchema.parse(args))) }] };
      case 'iaig_get_event_anomalies':
        return { content: [{ type: 'text', text: JSON.stringify(solveGetEventAnomalies(getEventAnomaliesSchema.parse(args))) }] };
      case 'iaig_compress_trend_window':
        return { content: [{ type: 'text', text: JSON.stringify(solveCompressTrendWindow(compressTrendWindowSchema.parse(args))) }] };

      // 3. Safety & Interlocks
      case 'iaig_simulate_physics_impact':
        return { content: [{ type: 'text', text: JSON.stringify(solveSimulatePhysicsImpact(simulatePhysicsImpactSchema.parse(args))) }] };
      case 'iaig_check_plc_interlocks':
        return { content: [{ type: 'text', text: JSON.stringify(solveCheckPlcInterlocks(checkPlcInterlocksSchema.parse(args))) }] };
      case 'iaig_validate_control_limits':
        return { content: [{ type: 'text', text: JSON.stringify(solveValidateControlLimits(validateControlLimitsSchema.parse(args))) }] };

      // 4. Hybrid Routing
      case 'iaig_route_local_slm':
        return { content: [{ type: 'text', text: JSON.stringify(solveRouteLocalSlm(routeLocalSlmSchema.parse(args))) }] };
      case 'iaig_proxy_cloud_escalation':
        return { content: [{ type: 'text', text: JSON.stringify(solveProxyCloudEscalation(proxyCloudEscalationSchema.parse(args))) }] };
      case 'iaig_sync_offline_cache':
        return { content: [{ type: 'text', text: JSON.stringify(solveSyncOfflineCache(syncOfflineCacheSchema.parse(args))) }] };

      // 5. Security & Identity
      case 'iaig_verify_operator_session':
        return { content: [{ type: 'text', text: JSON.stringify(solveVerifyOperatorSession(verifyOperatorSessionSchema.parse(args))) }] };
      case 'iaig_validate_tpm_signature':
        return { content: [{ type: 'text', text: JSON.stringify(solveValidateTpmSignature(validateTpmSignatureSchema.parse(args))) }] };
      case 'iaig_inspect_prompt_safety':
        return { content: [{ type: 'text', text: JSON.stringify(solveInspectPromptSafety(inspectPromptSafetySchema.parse(args))) }] };

      // 6. Robotics
      case 'iaig_dispatch_ros2_goal':
        return { content: [{ type: 'text', text: JSON.stringify(solveDispatchRos2Goal(dispatchRos2GoalSchema.parse(args))) }] };
      case 'iaig_queue_proposal_hmi':
        return { content: [{ type: 'text', text: JSON.stringify(solveQueueProposalHmi(queueProposalHmiSchema.parse(args))) }] };
      case 'iaig_throttle_tool_context':
        return { content: [{ type: 'text', text: JSON.stringify(solveThrottleToolContext(throttleToolContextSchema.parse(args))) }] };

      default:
        throw new Error(`Tool '${name}' is not recognized in SEOSiri IAIG Registry.`);
    }
  } catch (error: any) {
    return { isError: true, content: [{ type: 'text', text: JSON.stringify({ status: 'ERROR', message: error.message }) }] };
  }
});

async function startServer() {
  const mode = process.env.MCP_TRANSPORT || 'stdio';
  if (mode === 'sse') {
    const app = express();
    const port = parseInt(process.env.PORT || '8005', 10);
    app.use(cors());
    app.use(express.json());

    let sseTransport: SSEServerTransport | null = null;
    app.get('/health', (_req, res) => res.json({ status: 'HEALTHY', server: 'SEOSiri IAIG', total_tools: 18 }));
    app.get('/sse', async (req, res) => {
      sseTransport = new SSEServerTransport('/messages', res);
      await mcpServer.connect(sseTransport);
    });
    app.post('/messages', async (req, res) => {
      if (sseTransport) await sseTransport.handlePostMessage(req, res);
      else res.status(400).json({ error: 'SSE_NOT_INITIALIZED' });
    });
    app.listen(port, () => console.error(`[SEOSiri IAIG] Live over SSE on port ${port}`));
  } else {
    const stdio = new StdioServerTransport();
    await mcpServer.connect(stdio);
    console.error('[SEOSiri IAIG] Live over local standard I/O (stdio) with 18 tools active.');
  }
}

startServer().catch(err => {
  console.error('[SEOSiri IAIG Fatal]:', err);
  process.exit(1);
});