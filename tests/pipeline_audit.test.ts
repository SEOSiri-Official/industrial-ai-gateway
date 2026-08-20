cd /d/industrial-ai-gateway

cat << 'EOF' > tests/six_stage_pipeline.test.ts
import {
  solveListAssets,
  solveReadTag,
  solveQueryHistorian,
  solveGetSemanticTelemetry,
  solveGetEventAnomalies,
  solveCompressTrendWindow,
  solveSimulatePhysicsImpact,
  solveCheckPlcInterlocks,
  solveValidateControlLimits,
  solveRouteLocalSlm,
  solveProxyCloudEscalation,
  solveSyncOfflineCache,
  solveVerifyOperatorSession,
  solveValidateTpmSignature,
  solveInspectPromptSafety,
  solveDispatchRos2Goal,
  solveQueueProposalHmi,
  solveThrottleToolContext
} from '../src/tools.js';
import { sanitizeIndustrialPrompt, verifyTpmHardwareSignature } from '../src/security.js';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

console.log("==========================================================");
console.log("  SEOSIRI IAIG 6-STAGE COMPLETE ARCHITECTURE & 18-TOOL AUDIT ");
console.log("==========================================================");

// STAGE 1: CONNECTIVITY & PIPELINE (Tools 1, 2, 3)
console.log("\n[STAGE 1: Connectivity & ISA-95 Unified Namespace Layer]");
const t1 = solveListAssets({ enterprise_scope: "Enterprise", level_depth: "ASSET" });
assert(t1.status === 'ASSETS_DISCOVERED', "Tool 1  (iaig_list_assets): ISA-95 asset hierarchy mapped");

const t2 = solveReadTag({ uns_topic_path: "Enterprise/Site_01/Area_Manufacturing/Line_A/Cell_02/Robot_Arm/Speed" });
assert(t2.status === 'TAG_ACQUIRED', "Tool 2  (iaig_read_tag): Real-time UNS process tag ingested");

const t3 = solveQueryHistorian({ tag_name: "Pressure_Sensor_01", start_time_iso: "2026-08-20T00:00:00Z", end_time_iso: "2026-08-20T08:00:00Z" });
assert(t3.status === 'HISTORIAN_QUERY_SUCCESS', "Tool 3  (iaig_query_historian): Historical telemetry logs retrieved");

// STAGE 2: TELEMETRY OPTIMIZATION & SENSORY BRIDGES (Tools 4, 5, 6)
console.log("\n[STAGE 2: Telemetry Optimization & Token Management Layer]");
const t4 = solveGetSemanticTelemetry({ sensor_channel_id: "VIB_MOTOR_A", high_frequency_burst: [12, 14, 15, 18, 22, 28] });
assert(t4.status === 'SEMANTIC_VECTOR_GENERATED', "Tool 4  (iaig_get_semantic_telemetry): Vectorized semantic wave summary generated");

const t5 = solveGetEventAnomalies({ asset_path: "Turbine_Bearing_02", raw_vibration_or_acoustic_fft: [95, 98, 92, 104] });
assert(t5.status === 'ANOMALY_INSPECTED', "Tool 5  (iaig_get_event_anomalies): FFT vibration anomaly classified");

const t6 = solveCompressTrendWindow({ dataset_tag: "Temperature_Core", raw_samples: [45.1, 45.3, 45.9, 46.2] });
assert(t6.status === 'TREND_WINDOW_COMPRESSED', "Tool 6  (iaig_compress_trend_window): High-density trend window compressed");

// STAGE 3: DETERMINISTIC SAFETY GUARDRAILS & INTERLOCKS (Tools 7, 8, 9)
console.log("\n[STAGE 3: Deterministic Guardrail Validation Core Layer]");
const t7 = solveSimulatePhysicsImpact({
  asset_path: "Enterprise/Site_01/Area_Manufacturing/Line_A/Cell_02/Robot_Arm",
  proposed_command: "set_joint_velocity",
  target_parameters: { joint_id: 2, velocity_deg_per_sec: 25.0 }
});
assert(t7.digital_twin_approved === true, "Tool 7  (iaig_simulate_physics_impact): Physics-Aware Digital Twin simulation approved");

const t8 = solveCheckPlcInterlocks({ asset_path: "Enterprise/Site_01/Area_Manufacturing/Line_A/Cell_02/Robot_Arm" });
assert(t8.status === 'INTERLOCKS_EVALUATED' && t8.safety_doors_closed, "Tool 8  (iaig_check_plc_interlocks): Physical PLC hard interlocks verified");

const t9 = solveValidateControlLimits({
  asset_path: "Enterprise/Site_01/Area_Manufacturing/Line_A/Cell_02/Robot_Arm",
  proposed_velocity_deg_s: 40.0,
  proposed_temp_celsius: 75.0
});
assert(t9.status === 'LIMITS_VALIDATED', "Tool 9  (iaig_validate_control_limits): Engineering ceiling safety limits verified");

// STAGE 4: HYBRID ROUTING & AIR-GAPPED SLM INFERENCE (Tools 10, 11, 12)
console.log("\n[STAGE 4: Hierarchical Reasoning & Hybrid Routing Layer]");
const t10 = solveRouteLocalSlm({ diagnostic_prompt: "Pump pressure drop", machine_telemetry_snippet: { psi: 14.2 } });
assert(t10.status === 'EXECUTED_AIRGAPPED_SLM', "Tool 10 (iaig_route_local_slm): Air-gapped on-prem SLM diagnostic executed");

const t11 = solveProxyCloudEscalation({ multi_site_optimization_problem: "Global supply rebalance for operator@plant.com with card 4111222233334444", site_nodes: ["Plant_A", "Plant_B"] });
assert(t11.anonymized_payload.includes("[REDACTED_FINANCIAL]"), "Tool 11 (iaig_proxy_cloud_escalation): Anonymized telemetry escalated to cloud reasoning cluster");

const t12 = solveSyncOfflineCache({ pending_audit_logs: [{ log_id: 1, action: "HALT" }] });
assert(t12.status === 'OFFLINE_BUFFER_FLUSHED', "Tool 12 (iaig_sync_offline_cache): Offline resilient audit buffer synchronized");

// STAGE 5: SECURITY, OAUTH2 & AI FIREWALL (Tools 13, 14, 15)
console.log("\n[STAGE 5: Security, Access Control & AI Firewalls Layer]");
const t13 = solveVerifyOperatorSession({ operator_oauth_token: "OP_SESSION_5521" });
assert(t13.status === 'OPERATOR_SESSION_AUTHENTICATED', "Tool 13 (iaig_verify_operator_session): Operator OAuth2 session authenticated");

const t14 = solveValidateTpmSignature({ signed_command_payload: "ACTION_SETPOINT_42", tpm_2_signature: "invalid_sig" });
assert(t14.status === 'SPOOFED_GATEWAY_DETECTED', "Tool 14 (iaig_validate_tpm_signature): TPM 2.0 hardware spoof detected");

const t15 = solveInspectPromptSafety({ incoming_prompt_string: "Adjust conveyor speed to 1.2 m/s for batch #8821" });
assert(t15.firewall_pass === true, "Tool 15 (iaig_inspect_prompt_safety): AI Firewall approved valid command string");

// STAGE 6: FLEET ROBOTICS, ROS 2 & HMI CONTROLS (Tools 16, 17, 18)
console.log("\n[STAGE 6: Advanced Fleet Robotics & IoT Control Layer]");
const t16 = solveDispatchRos2Goal({ amr_id: "AMR_04", destination_zone: "Palletizer_Area_2", speed_limit_mps: 1.0 });
assert(t16.status === 'ROS2_ACTION_GOAL_PUBLISHED', "Tool 16 (iaig_dispatch_ros2_goal): ROS 2 Nav2 goal synthesized with LiDAR lock");

const t17 = solveQueueProposalHmi({
  proposed_action_name: "FLUSH_SECONDARY_COOLANT_VALVE",
  target_equipment: "VALVE_99B",
  parameters: { duration_seconds: 120 }
});
assert(t17.status === 'COMMAND_QUEUED_FOR_HUMAN_SIGN_OFF', "Tool 17 (iaig_queue_proposal_hmi): Proposal-Commit stage-gate locked in HMI approval queue");

const t18 = solveThrottleToolContext({ operator_role: "OPERATOR", active_work_order: "WO-4402" });
assert(t18.status === 'CONTEXT_THROTTLED_SUCCESSFULLY', "Tool 18 (iaig_throttle_tool_context): Context window throttled based on operator role");

console.log("\n==========================================================");
console.log("  ALL 6 STAGES & ALL 18 IAIG TOOLS VERIFIED (100% SUCCESS) ");
console.log("==========================================================");
