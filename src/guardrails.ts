export interface PhysicsConstraint {
  max_velocity_deg_per_sec: number;
  allowed_joints: number[];
  max_temperature_celsius: number;
  max_pressure_bar: number;
  emergency_stop_latched: boolean;
}

export const PLANT_PHYSICS_CONSTRAINTS: Record<string, PhysicsConstraint> = {
  "Enterprise/Site_01/Area_Manufacturing/Line_A/Cell_02/Robot_Arm": {
    max_velocity_deg_per_sec: 50.0,
    allowed_joints: [1, 2, 3, 4, 5, 6],
    max_temperature_celsius: 85.0,
    max_pressure_bar: 12.0,
    emergency_stop_latched: false
  },
  "Enterprise/Site_01/Area_Bioprocess/Line_Bio/Cell_01/Bioreactor": {
    max_velocity_deg_per_sec: 10.0,
    allowed_joints: [1],
    max_temperature_celsius: 42.0,
    max_pressure_bar: 3.5,
    emergency_stop_latched: false
  }
};

export class DigitalTwinGuardrailEngine {
  public static validateCommand(assetPath: string, command: string, params: Record<string, any>): { approved: boolean; error?: string } {
    const constraint = PLANT_PHYSICS_CONSTRAINTS[assetPath];
    if (!constraint) {
      return { approved: false, error: `Asset path '${assetPath}' is not registered in ISA-95 Unified Namespace.` };
    }

    if (constraint.emergency_stop_latched) {
      return { approved: false, error: "Mechanical Interlock Active: Hardware E-Stop is physically latched." };
    }

    if (command === 'set_joint_velocity') {
      const jointId = params.joint_id;
      const velocity = params.velocity_deg_per_sec || 0;

      if (!constraint.allowed_joints.includes(jointId)) {
        return { approved: false, error: `Physical Guardrail: Joint ${jointId} does not exist or is locked.` };
      }

      if (velocity > constraint.max_velocity_deg_per_sec) {
        return { 
          approved: false, 
          error: `Physical Limit Exceeded: Requested velocity (${velocity}°/s) exceeds maximum rated safety limit (${constraint.max_velocity_deg_per_sec}°/s).` 
        };
      }
    }

    if (command === 'adjust_temperature' && params.target_temperature_c > constraint.max_temperature_celsius) {
      return { 
        approved: false, 
        error: `Thermodynamic Violation: Requested temperature (${params.target_temperature_c}°C) exceeds structural boundary (${constraint.max_temperature_celsius}°C).` 
      };
    }

    return { approved: true };
  }
}
