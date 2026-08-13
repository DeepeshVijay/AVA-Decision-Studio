import { useState, useCallback } from "react";

// ─────────────────────────────────────────────
// DESIGN TOKENS — Aerospace workstation aesthetic
// Thin borders, restrained palette, strong mono type
// Signature element: the vertical program sidebar
// ─────────────────────────────────────────────
const T = {
  bg:          "#090C10",
  surface:     "#0F1318",
  panel:       "#141820",
  card:        "#1A1F2A",
  border:      "#1F2535",
  borderLight: "#2A3145",
  accent:      "#3B82F6",
  accentLow:   "#1E3A5F",
  accentGlow:  "#3B82F620",
  amber:       "#F59E0B",
  amberLow:    "#78450A",
  green:       "#10B981",
  greenLow:    "#064E35",
  red:         "#EF4444",
  redLow:      "#5C1A1A",
  purple:      "#8B5CF6",
  txt1:        "#E2E8F0",
  txt2:        "#94A3B8",
  txt3:        "#4B5A6E",
  txt4:        "#2A3448",
};

// ─── Static data ───────────────────────────────
const ZONES = [
  { id:"front_end",   label:"Front End",          sub:"Bumper → Firewall",   glyph:"F" },
  { id:"engine_bay",  label:"Engine / Motor Bay",  sub:"Under bonnet",        glyph:"E" },
  { id:"cockpit",     label:"Cockpit & IP",        sub:"Instrument panel zone",glyph:"C" },
  { id:"underbody",   label:"Underbody",           sub:"Floor & battery tray", glyph:"U" },
  { id:"rear_end",    label:"Rear End",            sub:"Boot → Rear bumper",  glyph:"R" },
  { id:"roof_pillars",label:"Roof & Pillars",      sub:"A / B / C pillar zone",glyph:"P" },
];

const CONFLICT_TYPES = [
  "Cooling airflow vs. component packaging",
  "ADAS sensor FOV vs. surface geometry",
  "Structural / crash requirement vs. packaging space",
  "Thermal management vs. layout",
  "Electrical / wiring harness routing",
  "Pedestrian safety vs. styling surface",
  "NVH / sealing vs. aperture sizing",
  "Weight / mass distribution vs. content",
  "Regulatory / homologation constraint",
  "Manufacturing / tooling feasibility",
  "Service access vs. packaging density",
  "Battery / HV system clearance",
];

const DEPARTMENTS = [
  "Powertrain","ADAS / Sensors","BIW / Structures","Thermal",
  "Electrical / E/E","Exterior Design","Safety","Manufacturing",
  "Chassis","Interior","Supplier / Procurement","Homologation",
];

const VEHICLE_TYPES   = ["Hatchback","Sedan","SUV / Crossover","MPV","Pickup","Van / LCV","Sports Car"];
const POWERTRAINS     = ["ICE","Mild Hybrid (MHEV)","Full Hybrid (HEV)","Plug-in Hybrid (PHEV)","Battery EV (BEV)","Fuel Cell (FCEV)"];
const MARKETS         = ["India (domestic)","India + Export","European Union","North America","Global"];
const SAFETY_TARGETS  = ["3-star (BNVSAP)","4-star (BNVSAP)","5-star (BNVSAP)","Euro NCAP 3★","Euro NCAP 5★","NHTSA 5★"];
const STAGES          = ["Pre-concept / Feasibility","Concept Phase","Styling Freeze","Package Freeze","Design Freeze","Prototype Build","Validation","Job 1 / SOP"];
const COST_POS        = ["Entry / Budget","Mid-segment","Premium","Luxury"];

// ─── Micro components ──────────────────────────
const mono = { fontFamily:"'SF Mono','Fira Mono','Consolas',monospace" };

function Eyebrow({ children, color = T.txt3 }) {
  return <div style={{ ...mono, fontSize:9, letterSpacing:3, textTransform:"uppercase", color, marginBottom:6 }}>{children}</div>;
}

function FieldLabel({ children }) {
  return <div style={{ ...mono, fontSize:10, letterSpacing:2, textTransform:"uppercase", color:T.txt3, marginBottom:5 }}>{children}</div>;
}

function Chip({ label, color = T.accent, dim = T.accentLow }) {
  return (
    <span style={{
      ...mono, fontSize:10, letterSpacing:1,
      background: dim + "88", color, border:`1px solid ${color}33`,
      borderRadius:3, padding:"2px 8px", display:"inline-block",
    }}>{label}</span>
  );
}

function StatusDot({ color }) {
  return <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:color, marginRight:6 }} />;
}

function Divider({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0 16px" }}>
      <div style={{ flex:1, height:1, background:T.border }} />
      {label && <span style={{ ...mono, fontSize:9, letterSpacing:3, color:T.txt3 }}>{label}</span>}
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  );
}

function StyledInput({ value, onChange, placeholder, rows }) {
  const base = {
    width:"100%", background:T.bg, border:`1px solid ${T.border}`,
    color:T.txt1, borderRadius:4, padding:"9px 11px",
    fontSize:13, fontFamily:"system-ui,sans-serif",
    outline:"none", boxSizing:"border-box", lineHeight:1.55,
    transition:"border 0.15s",
  };
  return rows
    ? <textarea value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        style={{ ...base, resize:"vertical" }}
        onFocus={e=>e.target.style.borderColor=T.accent}
        onBlur={e=>e.target.style.borderColor=T.border} />
    : <input value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder} style={base}
        onFocus={e=>e.target.style.borderColor=T.accent}
        onBlur={e=>e.target.style.borderColor=T.border} />;
}

function StyledSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{
      width:"100%", background:T.bg, border:`1px solid ${T.border}`,
      color: value ? T.txt1 : T.txt3, borderRadius:4,
      padding:"9px 11px", fontSize:13, outline:"none",
      boxSizing:"border-box", cursor:"pointer",
    }}>
      <option value="">{placeholder}</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"6px 12px", borderRadius:3, cursor:"pointer",
      border:`1px solid ${selected ? T.accent : T.border}`,
      background: selected ? T.accentLow : "transparent",
      color: selected ? T.txt1 : T.txt2,
      fontSize:12, fontFamily:"system-ui,sans-serif",
      transition:"all 0.12s",
    }}>{label}</button>
  );
}

function Panel({ children, style = {} }) {
  return (
    <div style={{
      background:T.panel, border:`1px solid ${T.border}`,
      borderRadius:6, padding:16, ...style,
    }}>{children}</div>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign:"center", padding:"48px 0" }}>
      <div style={{
        width:32, height:32,
        border:`2px solid ${T.border}`,
        borderTop:`2px solid ${T.accent}`,
        borderRadius:"50%", margin:"0 auto 16px",
        animation:"spin 0.7s linear infinite",
      }}/>
      <div style={{ ...mono, fontSize:10, letterSpacing:3, color:T.txt3 }}>RUNNING ENGINEERING ASSESSMENT</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Confidence gauge ──────────────────────────
function ConfidenceGauge({ score, drivers, gaps }) {
  const color = score >= 75 ? T.green : score >= 50 ? T.amber : T.red;
  return (
    <Panel>
      <Eyebrow>Decision Confidence</Eyebrow>
      <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginBottom:12 }}>
        <div style={{ fontSize:40, fontWeight:700, color, ...mono, lineHeight:1 }}>{score}%</div>
        <div style={{ ...mono, fontSize:10, color:T.txt3, paddingBottom:6, letterSpacing:1 }}>
          {score>=75?"SUFFICIENT FOR CONCEPT PHASE":score>=50?"REQUIRES ADDITIONAL DATA":"INSUFFICIENT — DO NOT RELEASE"}
        </div>
      </div>
      <div style={{ height:4, background:T.border, borderRadius:2, marginBottom:16 }}>
        <div style={{ height:4, width:`${score}%`, background:color, borderRadius:2, transition:"width 1s" }}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <div style={{ ...mono, fontSize:9, letterSpacing:2, color:T.green, marginBottom:6 }}>CONFIDENCE DRIVERS</div>
          {drivers?.map((d,i)=>(
            <div key={i} style={{ display:"flex", gap:6, marginBottom:4 }}>
              <span style={{ color:T.green, fontSize:11 }}>✓</span>
              <span style={{ color:T.txt2, fontSize:12 }}>{d}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ ...mono, fontSize:9, letterSpacing:2, color:T.amber, marginBottom:6 }}>INFORMATION GAPS</div>
          {gaps?.map((g,i)=>(
            <div key={i} style={{ display:"flex", gap:6, marginBottom:4 }}>
              <span style={{ color:T.amber, fontSize:11 }}>⚠</span>
              <span style={{ color:T.txt2, fontSize:12 }}>{g}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ─── Decision matrix ───────────────────────────
function DecisionMatrix({ matrix, options }) {
  if (!matrix || !options) return null;
  const criteria = Object.keys(matrix);
  const getColor = (v) => v >= 4 ? T.green : v >= 3 ? T.amber : T.red;

  return (
    <Panel style={{ overflowX:"auto" }}>
      <Eyebrow>Engineering Decision Matrix</Eyebrow>
      <table style={{ width:"100%", borderCollapse:"collapse", marginTop:8 }}>
        <thead>
          <tr>
            <th style={{ ...mono, fontSize:10, color:T.txt3, textAlign:"left", padding:"6px 10px", borderBottom:`1px solid ${T.border}`, letterSpacing:1 }}>CRITERION</th>
            {options.map((o,i)=>(
              <th key={i} style={{ ...mono, fontSize:10, color:T.accent, textAlign:"center", padding:"6px 10px", borderBottom:`1px solid ${T.border}`, letterSpacing:1 }}>
                OPT {String.fromCharCode(65+i)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c,i)=>(
            <tr key={i} style={{ background: i%2===0 ? T.bg+"44" : "transparent" }}>
              <td style={{ fontSize:12, color:T.txt2, padding:"7px 10px" }}>{c}</td>
              {options.map((_,j)=>{
                const val = matrix[c]?.[j] ?? 0;
                return (
                  <td key={j} style={{ textAlign:"center", padding:"7px 10px" }}>
                    <span style={{ ...mono, fontSize:13, fontWeight:700, color:getColor(val) }}>{val}</span>
                    <span style={{ ...mono, fontSize:10, color:T.txt3 }}>/5</span>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr style={{ borderTop:`1px solid ${T.border}` }}>
            <td style={{ ...mono, fontSize:10, color:T.txt3, padding:"8px 10px", letterSpacing:1 }}>OVERALL</td>
            {options.map((_,j)=>{
              const avg = (criteria.reduce((s,c)=>s+(matrix[c]?.[j]??0),0)/criteria.length).toFixed(1);
              const col = parseFloat(avg)>=4?T.green:parseFloat(avg)>=3?T.amber:T.red;
              return (
                <td key={j} style={{ textAlign:"center", padding:"8px 10px" }}>
                  <span style={{ ...mono, fontSize:15, fontWeight:700, color:col }}>{avg}</span>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </Panel>
  );
}

// ─── Result panels ─────────────────────────────
const TABS = ["Overview","Design Options","Decision Matrix","Trade-offs","Closure Plan"];

function ResultView({ result }) {
  const [tab, setTab] = useState(0);
  const critColor = { High:T.red, Medium:T.amber, Low:T.green };
  const color = critColor[result.decisionCriticality] || T.accent;

  return (
    <div style={{ marginTop:24 }}>
      {/* Report header */}
      <div style={{
        background:T.panel, border:`1px solid ${T.border}`,
        borderRadius:"6px 6px 0 0", padding:"16px 20px",
        display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      }}>
        <div>
          <Eyebrow color={T.txt3}>VADSS · PACKAGING DECISION SUPPORT · ASSESSMENT REPORT</Eyebrow>
          <div style={{ fontSize:17, fontWeight:600, color:T.txt1, marginTop:4, lineHeight:1.3 }}>
            {result.conflictTitle}
          </div>
          {result.decisionStatus && (
            <div style={{ marginTop:8 }}>
              <StatusDot color={color}/>
              <span style={{ ...mono, fontSize:10, color, letterSpacing:1 }}>{result.decisionStatus?.toUpperCase()}</span>
            </div>
          )}
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ ...mono, fontSize:9, color:T.txt3, letterSpacing:2, marginBottom:4 }}>DECISION CRITICALITY</div>
          <Chip label={result.decisionCriticality?.toUpperCase()} color={color} dim={color+"22"} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:T.surface, border:`1px solid ${T.border}`, borderTop:"none" }}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{
            flex:1, padding:"9px 0", cursor:"pointer",
            ...mono, fontSize:9, letterSpacing:1.5,
            background: tab===i ? T.panel : "transparent",
            color: tab===i ? T.accent : T.txt3,
            border:"none",
            borderBottom: tab===i ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
            transition:"all 0.12s",
          }}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* Tab body */}
      <div style={{
        background:T.panel, border:`1px solid ${T.border}`,
        borderTop:"none", borderRadius:"0 0 6px 6px",
        padding:20, minHeight:360,
      }}>
        {tab===0 && <OverviewPanel r={result}/>}
        {tab===1 && <OptionsPanel r={result}/>}
        {tab===2 && <DecisionMatrix matrix={result.decisionMatrix} options={result.designOptions}/>}
        {tab===3 && <TradeoffsPanel r={result}/>}
        {tab===4 && <ClosurePlan r={result}/>}
      </div>
    </div>
  );
}

function OverviewPanel({ r }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Panel>
        <Eyebrow>Conflict Summary</Eyebrow>
        <p style={{ color:T.txt1, fontSize:13, lineHeight:1.7, margin:0 }}>{r.summary}</p>
      </Panel>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Panel>
          <Eyebrow>Root Cause — Physical</Eyebrow>
          <p style={{ color:T.txt2, fontSize:13, lineHeight:1.6, margin:0 }}>{r.rootCausePhysical}</p>
        </Panel>
        <Panel>
          <Eyebrow>Root Cause — Architecture</Eyebrow>
          <p style={{ color:T.txt2, fontSize:13, lineHeight:1.6, margin:0 }}>{r.rootCauseArchitecture}</p>
        </Panel>
      </div>

      <Panel>
        <Eyebrow>Affected Systems</Eyebrow>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:4 }}>
          {r.affectedSystems?.map(s=><Chip key={s} label={s}/>)}
        </div>
      </Panel>

      {r.engineeringAssumptions?.length>0 && (
        <Panel style={{ borderColor:T.accentLow }}>
          <Eyebrow color={T.accent}>Engineering Assumptions</Eyebrow>
          {r.engineeringAssumptions?.map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
              <span style={{ ...mono, fontSize:10, color:T.accent }}>•</span>
              <span style={{ color:T.txt2, fontSize:12 }}>{a}</span>
            </div>
          ))}
        </Panel>
      )}

      {r.missingInformation?.length>0 && (
        <Panel style={{ borderColor:T.amberLow }}>
          <Eyebrow color={T.amber}>Information Required Before Design Release</Eyebrow>
          {r.missingInformation?.map((m,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
              <span style={{ ...mono, fontSize:10, color:T.amber }}>{String(i+1).padStart(2,"0")}</span>
              <span style={{ color:T.txt2, fontSize:12 }}>{m}</span>
            </div>
          ))}
          <div style={{ marginTop:10, padding:"6px 10px", background:T.amberLow+"44", borderRadius:3 }}>
            <span style={{ ...mono, fontSize:10, color:T.amber, letterSpacing:1 }}>
              DECISION STATUS: PRELIMINARY — INSUFFICIENT DATA FOR RELEASE
            </span>
          </div>
        </Panel>
      )}

      {r.regulatoryFlags?.length>0 && (
        <Panel style={{ borderColor:T.redLow }}>
          <Eyebrow color={T.red}>Regulatory / Homologation Flags</Eyebrow>
          {r.regulatoryFlags?.map((f,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
              <span style={{ color:T.red }}>▲</span>
              <span style={{ color:T.txt2, fontSize:12 }}>{f}</span>
            </div>
          ))}
        </Panel>
      )}

      <ConfidenceGauge
        score={r.confidenceScore}
        drivers={r.confidenceDrivers}
        gaps={r.confidenceGaps}
      />
    </div>
  );
}

function OptionsPanel({ r }) {
  const feasColor = { High:T.green, Medium:T.amber, Low:T.red };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {r.designOptions?.map((opt,i)=>(
        <div key={i} style={{
          background:T.surface, border:`1px solid ${opt.recommended ? T.accent : T.border}`,
          borderRadius:6, padding:16,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ ...mono, fontSize:11, color:T.accent, background:T.accentLow, padding:"3px 8px", borderRadius:3 }}>
                OPTION {String.fromCharCode(65+i)}
              </span>
              <span style={{ fontSize:14, fontWeight:600, color:T.txt1 }}>{opt.title}</span>
              {opt.recommended && <Chip label="RECOMMENDED" color={T.green} dim={T.greenLow}/>}
            </div>
            <Chip label={opt.feasibility} color={feasColor[opt.feasibility]} dim={feasColor[opt.feasibility]+"22"}/>
          </div>

          <p style={{ color:T.txt2, fontSize:13, lineHeight:1.6, margin:"0 0 12px" }}>{opt.description}</p>

          <Divider label="ENGINEERING IMPACT"/>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
            {Object.entries(opt.impacts||{}).map(([k,v])=>{
              const c = v==="Low"?T.green:v==="Medium"?T.amber:T.red;
              return (
                <div key={k} style={{ background:T.bg, borderRadius:3, padding:"7px 10px", textAlign:"center" }}>
                  <div style={{ ...mono, fontSize:8, color:T.txt3, letterSpacing:1, marginBottom:3 }}>{k.toUpperCase()}</div>
                  <div style={{ ...mono, fontSize:11, color:c, fontWeight:700 }}>{v}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display:"flex", gap:16 }}>
            <span style={{ ...mono, fontSize:10, color:T.txt3 }}>COST IMPACT <span style={{ color:T.amber }}>{opt.costImpact}</span></span>
            <span style={{ ...mono, fontSize:10, color:T.txt3 }}>MASS IMPACT <span style={{ color:T.accent }}>{opt.massImpact}</span></span>
            <span style={{ ...mono, fontSize:10, color:T.txt3 }}>TIMING <span style={{ color:T.green }}>{opt.timing}</span></span>
          </div>
        </div>
      ))}

      {r.rejectedOptions?.length>0 && (
        <>
          <Divider label="ALTERNATIVES CONSIDERED & REJECTED"/>
          {r.rejectedOptions?.map((opt,i)=>(
            <div key={i} style={{
              background:T.bg, border:`1px solid ${T.border}`,
              borderRadius:6, padding:14, opacity:0.75,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ ...mono, fontSize:10, color:T.red, background:T.redLow+"44", padding:"2px 7px", borderRadius:3 }}>REJECTED</span>
                <span style={{ fontSize:13, fontWeight:600, color:T.txt2 }}>{opt.title}</span>
              </div>
              <p style={{ color:T.txt3, fontSize:12, lineHeight:1.5, margin:0 }}>
                <span style={{ color:T.red }}>✗ </span>{opt.reason}
              </p>
            </div>
          ))}
        </>
      )}

      {r.architectureRecommendation && (
        <Panel style={{ borderColor:T.accentLow, background:T.accentGlow }}>
          <Eyebrow color={T.accent}>Architecture Recommendation</Eyebrow>
          <p style={{ color:T.txt1, fontSize:13, lineHeight:1.7, margin:"0 0 12px" }}>
            {r.architectureRecommendation}
          </p>
          <Eyebrow color={T.accent}>Why This Option</Eyebrow>
          {r.recommendationRationale?.map((point,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
              <span style={{ ...mono, fontSize:11, color:T.accent }}>{i+1}.</span>
              <span style={{ color:T.txt2, fontSize:13 }}>{point}</span>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}

function TradeoffsPanel({ r }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {r.tradeoffs?.map((t,i)=>(
        <div key={i} style={{
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:0,
          border:`1px solid ${T.border}`, borderRadius:6, overflow:"hidden",
        }}>
          <div style={{ background:T.greenLow+"33", padding:"12px 14px", borderRight:`1px solid ${T.border}` }}>
            <div style={{ ...mono, fontSize:9, color:T.green, letterSpacing:2, marginBottom:6 }}>✓ GAIN</div>
            <p style={{ color:T.txt1, fontSize:13, margin:0, lineHeight:1.5 }}>{t.gain}</p>
          </div>
          <div style={{ background:T.redLow+"33", padding:"12px 14px" }}>
            <div style={{ ...mono, fontSize:9, color:T.red, letterSpacing:2, marginBottom:6 }}>✗ COMPROMISE</div>
            <p style={{ color:T.txt1, fontSize:13, margin:0, lineHeight:1.5 }}>{t.compromise}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClosurePlan({ r }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Panel>
        <Eyebrow>Architecture Review</Eyebrow>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
          {[
            ["Decision Owner", r.reviewMeta?.owner || "AVA"],
            ["Next Gate", r.reviewMeta?.nextGate || "—"],
            ["Target Closure", r.reviewMeta?.targetClosure || "—"],
            ["Open Actions", r.immediateActions?.length || 0],
          ].map(([k,v])=>(
            <div key={k} style={{ background:T.bg, borderRadius:3, padding:"8px 12px" }}>
              <div style={{ ...mono, fontSize:9, color:T.txt3, letterSpacing:1, marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:13, color:T.txt1, fontWeight:600 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12 }}>
          <Eyebrow>Required Reviews</Eyebrow>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {r.stakeholders?.map(s=><Chip key={s} label={s} color={T.amber} dim={T.amberLow}/>)}
          </div>
        </div>
      </Panel>

      <Panel>
        <Eyebrow>Immediate Actions — 0 to 2 Weeks</Eyebrow>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {r.immediateActions?.map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ ...mono, fontSize:10, color:T.accent, background:T.accentLow, padding:"2px 6px", borderRadius:2, flexShrink:0 }}>
                {String(i+1).padStart(2,"0")}
              </span>
              <span style={{ color:T.txt2, fontSize:13, lineHeight:1.5 }}>{a}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <Eyebrow>Review Milestones</Eyebrow>
        {r.milestones?.map((m,i)=>(
          <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
            <span style={{ color:T.accent, fontSize:10 }}>◆</span>
            <span style={{ color:T.txt2, fontSize:13 }}>{m}</span>
          </div>
        ))}
      </Panel>

      {r.escalationNote && (
        <Panel style={{ borderColor:T.amberLow }}>
          <Eyebrow color={T.amber}>Escalation Note</Eyebrow>
          <p style={{ color:T.txt1, fontSize:13, lineHeight:1.6, margin:0 }}>{r.escalationNote}</p>
        </Panel>
      )}

      <div style={{
        background:T.card, border:`1px solid ${T.border}`,
        borderRadius:6, padding:14,
      }}>
        <Eyebrow>Decision Record</Eyebrow>
        <div style={{ ...mono, fontSize:11, color:T.txt3, lineHeight:2 }}>
          <div>PROGRAM &nbsp;&nbsp;&nbsp;&nbsp;—&nbsp; {r.vehicleProgram || "Not specified"}</div>
          <div>CONFLICT &nbsp;&nbsp;&nbsp;—&nbsp; {r.conflictTitle}</div>
          <div>DECISION &nbsp;&nbsp;&nbsp;—&nbsp; {r.architectureRecommendation?.slice(0,80)}...</div>
          <div>STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—&nbsp; {r.decisionStatus}</div>
          <div>DATE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—&nbsp; {new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
        </div>
      </div>
    </div>
  );
}

// ─── PROMPT BUILDER ────────────────────────────
function buildPrompt(f) {
  return `You are a senior Advanced Vehicle Architecture (AVA) engineer and engineering decision support system. Analyze this packaging conflict using structured reasoning. Return ONLY raw JSON — no markdown, no explanation.

VEHICLE PROGRAM:
Type: ${f.vehicleType||"Not specified"}
Powertrain: ${f.powertrain||"Not specified"}
Market: ${f.market||"Not specified"}
Safety Target: ${f.safetyTarget||"Not specified"}
Cost Position: ${f.costPosition||"Not specified"}
Mass Target: ${f.massTarget||"Not specified"}
Volume Target: ${f.volume||"Not specified"}
Wheelbase: ${f.wheelbase||"Not specified"}
Program Stage: ${f.stage||"Not specified"}

CONFLICT:
Zone: ${f.zone}
Type: ${f.conflictType}
Departments: ${f.departments.join(", ")}
Description: ${f.description}
Constraints: ${f.constraints||"None"}

Return this exact JSON (keep string values concise, 1-2 sentences each):
{"conflictTitle":"...","decisionCriticality":"High|Medium|Low","decisionStatus":"Preliminary|Under Review|Recommended for Concept Phase|Requires Escalation","vehicleProgram":"...","summary":"...","rootCausePhysical":"...","rootCauseArchitecture":"...","affectedSystems":["..."],"regulatoryFlags":["..."],"engineeringAssumptions":["...","...","..."],"missingInformation":["...","..."],"confidenceScore":75,"confidenceDrivers":["...","..."],"confidenceGaps":["...","..."],"designOptions":[{"title":"...","description":"...","feasibility":"High|Medium|Low","recommended":true,"costImpact":"Low|Medium|High","massImpact":"Low|Medium|High","timing":"...","impacts":{"BIW":"Low|Medium|High","ADAS":"Low|Medium|High","Thermal":"Low|Medium|High","Manufacturing":"Low|Medium|High","Cost":"Low|Medium|High","Mass":"Low|Medium|High","Service":"Low|Medium|High","Styling":"Low|Medium|High"}},{"title":"...","description":"...","feasibility":"High|Medium|Low","recommended":false,"costImpact":"Low|Medium|High","massImpact":"Low|Medium|High","timing":"...","impacts":{"BIW":"Low|Medium|High","ADAS":"Low|Medium|High","Thermal":"Low|Medium|High","Manufacturing":"Low|Medium|High","Cost":"Low|Medium|High","Mass":"Low|Medium|High","Service":"Low|Medium|High","Styling":"Low|Medium|High"}},{"title":"...","description":"...","feasibility":"High|Medium|Low","recommended":false,"costImpact":"Low|Medium|High","massImpact":"Low|Medium|High","timing":"...","impacts":{"BIW":"Low|Medium|High","ADAS":"Low|Medium|High","Thermal":"Low|Medium|High","Manufacturing":"Low|Medium|High","Cost":"Low|Medium|High","Mass":"Low|Medium|High","Service":"Low|Medium|High","Styling":"Low|Medium|High"}}],"rejectedOptions":[{"title":"...","reason":"..."},{"title":"...","reason":"..."}],"decisionMatrix":{"Packaging space":[4,3,5],"Cost impact":[4,2,3],"Mass impact":[3,4,2],"Manufacturing":[5,3,2],"ADAS compliance":[3,5,4],"Styling impact":[3,5,4],"Service access":[4,3,3],"Overall risk":[4,3,3]},"tradeoffs":[{"gain":"...","compromise":"..."},{"gain":"...","compromise":"..."},{"gain":"...","compromise":"..."}],"architectureRecommendation":"...","recommendationRationale":["...","...","...","..."],"immediateActions":["...","...","...","..."],"stakeholders":["...","...","..."],"milestones":["...","...","..."],"escalationNote":"...","reviewMeta":{"owner":"AVA","nextGate":"${f.stage||'Package Freeze'}","targetClosure":"14 days"}}`;
}

// ─── MAIN APP ──────────────────────────────────
export default function AVADecisionStudio() {
  // Vehicle definition
  const [vehicleType,   setVehicleType]   = useState("");
  const [powertrain,    setPowertrain]    = useState("");
  const [market,        setMarket]        = useState("");
  const [safetyTarget,  setSafetyTarget]  = useState("");
  const [costPosition,  setCostPosition]  = useState("");
  const [massTarget,    setMassTarget]    = useState("");
  const [volume,        setVolume]        = useState("");
  const [wheelbase,     setWheelbase]     = useState("");
  // Conflict
  const [zone,          setZone]          = useState("");
  const [conflictType,  setConflictType]  = useState("");
  const [departments,   setDepartments]   = useState([]);
  const [stage,         setStage]         = useState("");
  const [description,   setDescription]   = useState("");
  const [constraints,   setConstraints]   = useState("");
  // UI state
  const [loading,       setLoading]       = useState(false);
  const [result,        setResult]        = useState(null);
  const [error,         setError]         = useState("");

  const canSubmit = zone && conflictType && departments.length>0 && description.trim().length>20;

  const toggleDept = (d) => setDepartments(prev =>
    prev.includes(d) ? prev.filter(x=>x!==d) : [...prev,d]
  );

  const runAssessment = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true); setResult(null); setError("");
    const fields = {
      vehicleType,powertrain,market,safetyTarget,costPosition,
      massTarget,volume,wheelbase,zone,conflictType,departments,
      stage,description,constraints
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:4000,
          system:"You are an AVA engineering decision support system. Output ONLY valid raw JSON. No markdown fences, no preamble, no commentary.",
          messages:[{ role:"user", content:buildPrompt(fields) }],
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(()=>({}));
        throw new Error(`API ${res.status}: ${e?.error?.message||res.statusText}`);
      }
      const data = await res.json();
      const raw = data.content?.map(b=>b.text||"").join("") || "";
      const clean = raw.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim();
      let parsed;
      try { parsed = JSON.parse(clean); }
      catch { const m = clean.match(/\{[\s\S]*\}/); if(m) parsed=JSON.parse(m[0]); else throw new Error("JSON parse failed"); }
      setResult(parsed);
    } catch(err) {
      setError("Assessment failed: " + (err.message||"Unknown error"));
    } finally { setLoading(false); }
  }, [vehicleType,powertrain,market,safetyTarget,costPosition,massTarget,volume,wheelbase,zone,conflictType,departments,stage,description,constraints]);

  const reset = () => {
    setVehicleType("");setPowertrain("");setMarket("");setSafetyTarget("");
    setCostPosition("");setMassTarget("");setVolume("");setWheelbase("");
    setZone("");setConflictType("");setDepartments([]);setStage("");
    setDescription("");setConstraints("");setResult(null);setError("");
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.txt1, fontFamily:"system-ui,-apple-system,sans-serif", paddingBottom:60 }}>

      {/* Top bar */}
      <div style={{
        background:T.surface, borderBottom:`1px solid ${T.border}`,
        padding:"0 24px", display:"flex", alignItems:"center",
        justifyContent:"space-between", height:52, position:"sticky", top:0, zIndex:20,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{
              width:28, height:28, background:T.accent, borderRadius:4,
              display:"flex", alignItems:"center", justifyContent:"center",
              ...mono, fontSize:13, fontWeight:700, color:"#fff", letterSpacing:-0.5,
            }}>V</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, letterSpacing:0.3, lineHeight:1 }}>AVA Decision Studio</div>
              <div style={{ ...mono, fontSize:8, color:T.txt3, letterSpacing:2, marginTop:2 }}>ADVANCED VEHICLE ARCHITECTURE</div>
            </div>
          </div>
          <div style={{ height:24, width:1, background:T.border }}/>
          <span style={{ ...mono, fontSize:9, color:T.txt3, letterSpacing:2 }}>PACKAGING & TRADE-OFF DECISION SUPPORT</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Chip label="MODULE 01 — PACKAGING" color={T.accent}/>
          <Chip label="DECISION SUPPORT" color={T.txt3} dim={T.bg}/>
        </div>
      </div>

      <div style={{ maxWidth:820, margin:"0 auto", padding:"28px 20px" }}>

        {/* ── SECTION 1: Vehicle Program Definition ── */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ ...mono, fontSize:9, color:T.accent, letterSpacing:3 }}>SECTION 01</span>
            <div style={{ flex:1, height:1, background:T.border }}/>
            <span style={{ fontSize:14, fontWeight:600, color:T.txt1 }}>Vehicle Program Definition</span>
          </div>
          <Panel>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div><FieldLabel>Vehicle Type</FieldLabel>
                <StyledSelect value={vehicleType} onChange={setVehicleType} options={VEHICLE_TYPES} placeholder="Select vehicle type..."/></div>
              <div><FieldLabel>Powertrain</FieldLabel>
                <StyledSelect value={powertrain} onChange={setPowertrain} options={POWERTRAINS} placeholder="Select powertrain..."/></div>
              <div><FieldLabel>Target Market</FieldLabel>
                <StyledSelect value={market} onChange={setMarket} options={MARKETS} placeholder="Select market..."/></div>
              <div><FieldLabel>Safety Target</FieldLabel>
                <StyledSelect value={safetyTarget} onChange={setSafetyTarget} options={SAFETY_TARGETS} placeholder="Select safety target..."/></div>
              <div><FieldLabel>Cost Position</FieldLabel>
                <StyledSelect value={costPosition} onChange={setCostPosition} options={COST_POS} placeholder="Select cost position..."/></div>
              <div><FieldLabel>Program Stage</FieldLabel>
                <StyledSelect value={stage} onChange={setStage} options={STAGES} placeholder="Select stage..."/></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              <div><FieldLabel>Mass Target (kg)</FieldLabel>
                <StyledInput value={massTarget} onChange={setMassTarget} placeholder="e.g. 1650 kg"/></div>
              <div><FieldLabel>Volume Target (units/yr)</FieldLabel>
                <StyledInput value={volume} onChange={setVolume} placeholder="e.g. 50,000 units"/></div>
              <div><FieldLabel>Wheelbase (mm)</FieldLabel>
                <StyledInput value={wheelbase} onChange={setWheelbase} placeholder="e.g. 2750 mm"/></div>
            </div>
          </Panel>
        </div>

        {/* ── SECTION 2: Vehicle Zone ── */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ ...mono, fontSize:9, color:T.accent, letterSpacing:3 }}>SECTION 02</span>
            <div style={{ flex:1, height:1, background:T.border }}/>
            <span style={{ fontSize:14, fontWeight:600, color:T.txt1 }}>Vehicle Zone</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {ZONES.map(z=>(
              <button key={z.id} onClick={()=>setZone(z.id)} style={{
                background: zone===z.id ? T.accentLow : T.panel,
                border:`1px solid ${zone===z.id ? T.accent : T.border}`,
                borderRadius:5, padding:"12px 14px", cursor:"pointer",
                textAlign:"left", transition:"all 0.12s",
              }}>
                <div style={{ ...mono, fontSize:16, color: zone===z.id ? T.accent : T.txt3, marginBottom:5, fontWeight:700 }}>{z.glyph}</div>
                <div style={{ fontSize:12, fontWeight:600, color:T.txt1 }}>{z.label}</div>
                <div style={{ ...mono, fontSize:9, color:T.txt3, letterSpacing:1, marginTop:2 }}>{z.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: Conflict Classification ── */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ ...mono, fontSize:9, color:T.accent, letterSpacing:3 }}>SECTION 03</span>
            <div style={{ flex:1, height:1, background:T.border }}/>
            <span style={{ fontSize:14, fontWeight:600, color:T.txt1 }}>Conflict Classification</span>
          </div>
          <Panel>
            <FieldLabel>Conflict Type</FieldLabel>
            <StyledSelect value={conflictType} onChange={setConflictType} options={CONFLICT_TYPES} placeholder="Select conflict category..."/>
            <div style={{ marginTop:14 }}>
              <FieldLabel>Departments Involved</FieldLabel>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {DEPARTMENTS.map(d=>(
                  <Toggle key={d} label={d} selected={departments.includes(d)} onClick={()=>toggleDept(d)}/>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* ── SECTION 4: Conflict Description ── */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ ...mono, fontSize:9, color:T.accent, letterSpacing:3 }}>SECTION 04</span>
            <div style={{ flex:1, height:1, background:T.border }}/>
            <span style={{ fontSize:14, fontWeight:600, color:T.txt1 }}>Conflict Description & Constraints</span>
          </div>
          <Panel>
            <FieldLabel>Describe the Packaging Conflict</FieldLabel>
            <StyledInput value={description} onChange={setDescription} rows={5}
              placeholder="Describe the conflict in engineering detail. Include dimensions, clearances, component specs, what triggered the conflict, which requirement is driving it. The more specific, the higher the decision confidence score."/>
            <div style={{ marginTop:12 }}>
              <FieldLabel>Known Constraints & Non-Negotiables</FieldLabel>
              <StyledInput value={constraints} onChange={setConstraints} rows={3}
                placeholder="Hard constraints — regulatory requirements, frozen components, cost limits, supplier-locked parts, weight targets, design freeze status..."/>
            </div>
          </Panel>
        </div>

        {/* CTA */}
        <button onClick={runAssessment} disabled={!canSubmit||loading} style={{
          width:"100%", padding:"13px 0", borderRadius:5, cursor: canSubmit?"pointer":"not-allowed",
          background: canSubmit ? T.accent : T.card,
          color: canSubmit ? "#fff" : T.txt3,
          border:`1px solid ${canSubmit ? T.accent : T.border}`,
          ...mono, fontSize:11, letterSpacing:3,
          transition:"all 0.15s", opacity:loading?0.65:1,
        }}>
          {loading ? "RUNNING ASSESSMENT..." : "▶  RUN ENGINEERING ASSESSMENT"}
        </button>

        {!canSubmit && (
          <p style={{ ...mono, fontSize:9, color:T.txt3, textAlign:"center", marginTop:8, letterSpacing:1 }}>
            SELECT ZONE · CONFLICT TYPE · MIN ONE DEPARTMENT · DESCRIBE CONFLICT TO PROCEED
          </p>
        )}

        {error && (
          <div style={{
            background:T.redLow+"44", border:`1px solid ${T.red}44`,
            borderRadius:5, padding:14, marginTop:16,
            color:T.txt2, fontSize:12, ...mono,
          }}>⚠ {error}</div>
        )}

        {loading && <div style={{ marginTop:24 }}><Spinner/></div>}
        {result && !loading && <ResultView result={result}/>}

        {result && (
          <button onClick={reset} style={{
            marginTop:14, width:"100%", padding:"9px 0",
            background:"transparent", border:`1px solid ${T.border}`,
            color:T.txt3, borderRadius:5, cursor:"pointer",
            ...mono, fontSize:9, letterSpacing:3,
          }}>
            ↺ &nbsp; NEW ASSESSMENT
          </button>
        )}
      </div>
    </div>
  );
}
