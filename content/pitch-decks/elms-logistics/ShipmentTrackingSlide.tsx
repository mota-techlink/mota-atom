"use client";

import React, { useState } from "react";
import {
  Package,
  Warehouse,
  FileText,
  ShieldCheck,
  Truck,
  MapPin,
  CheckCircle2,
  Circle,
  Loader2,
  X,
  Printer,
  ClipboardList,
  Leaf,
  Thermometer,
  Globe,
  BarChart3,
  ScanLine,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "./MobileDetailModal";
import { useContent } from "./useContent";

// ─── Types ───────────────────────────────────────────────────────
type NodeStatus = "completed" | "current" | "pending";

interface Document {
  id: string;
  title: string;
  type: string;
  status: "Approved" | "Pending" | "Processing" | "Generated";
  date: string;
  details: Record<string, string>;
}

interface RouteNode {
  id: string;
  label: string;
  location: string;
  status: NodeStatus;
  icon: React.ReactNode;
  timestamp?: string;
  documents: Document[];
}

// ─── Mock Data (linked to ELMS-2026-SZX-DUB-0847) ───────────────
const SHIPMENT_ID = "ELMS-2026-SZX-DUB-0847";

const routeNodes: RouteNode[] = [
  {
    id: "origin",
    label: "Origin Warehouse",
    location: "Shenzhen, China",
    status: "completed",
    icon: <Warehouse className="w-5 h-5" />,
    timestamp: "2026-02-14 09:30 CST",
    documents: [
      {
        id: "PO-20260214-001",
        title: "Purchase Order",
        type: "Order",
        status: "Approved",
        date: "2026-02-14",
        details: {
          "Order ID": "PO-20260214-001",
          Customer: "TechRetail Europe GmbH",
          Items: "50 × Consumer Electronics (Mixed SKUs)",
          "Total Value": "€127,500.00",
          Currency: "EUR",
          "Payment Terms": "Net 30",
          "Incoterms": "DDP Dublin",
        },
      },
      {
        id: "PL-20260214-001",
        title: "Packing List",
        type: "Logistics",
        status: "Approved",
        date: "2026-02-14",
        details: {
          "Packing List ID": "PL-20260214-001",
          "Total Boxes": "50",
          "Gross Weight": "1,250 kg",
          "Net Weight": "1,080 kg",
          Dimensions: "50 × 40cm × 35cm × 30cm",
          "Pallet Count": "4 (Euro Pallets)",
          "Special Handling": "Fragile — Handle with Care",
        },
      },
      {
        id: "CI-20260214-001",
        title: "Commercial Invoice",
        type: "Finance",
        status: "Approved",
        date: "2026-02-14",
        details: {
          "Invoice No": "CI-20260214-001",
          Seller: "Shenzhen Digi-Tech Co., Ltd",
          Buyer: "TechRetail Europe GmbH",
          "Total Amount": "€127,500.00",
          "HS Code": "8471.30 / 8528.72",
          "Country of Origin": "China (CN)",
          "Terms": "DDP Dublin, Ireland",
        },
      },
    ],
  },
  {
    id: "pickup",
    label: "Carrier Pickup",
    location: "SZX Hub, Shenzhen",
    status: "completed",
    icon: <Truck className="w-5 h-5" />,
    timestamp: "2026-02-14 14:15 CST",
    documents: [
      {
        id: "AWB-784-2026-0847",
        title: "Air Waybill (MAWB)",
        type: "Shipping",
        status: "Approved",
        date: "2026-02-14",
        details: {
          "AWB Number": "784-2026-0847",
          Carrier: "SF Express International",
          Service: "Priority Express",
          Origin: "SZX (Shenzhen Bao'an Intl.)",
          Destination: "DUB (Dublin Airport)",
          "Transit Hub": "AMS (Amsterdam Schiphol)",
          "Est. Transit": "2–3 Business Days",
        },
      },
      {
        id: "LBL-SZX-50",
        title: "Shipping Labels (×50)",
        type: "Labels",
        status: "Generated",
        date: "2026-02-14",
        details: {
          "Label Batch": "LBL-SZX-50",
          Format: "A6 Thermal (100×150mm)",
          "Label Count": "50 labels",
          "QR Code": "Embedded — links to ELMS tracking",
          "Barcode Standard": "Code 128",
          "Auto-Generated": "Yes (ELMS AI)",
          Status: "Printed & Applied",
        },
      },
    ],
  },
  {
    id: "transit-hub",
    label: "Transit Hub",
    location: "Amsterdam Schiphol (AMS)",
    status: "completed",
    icon: <Globe className="w-5 h-5" />,
    timestamp: "2026-02-15 06:45 CET",
    documents: [
      {
        id: "T1-AMS-2026-3391",
        title: "Transit Declaration (T1)",
        type: "Customs",
        status: "Approved",
        date: "2026-02-15",
        details: {
          "T1 MRN": "26NL00T1AMS003391",
          Type: "Union Transit (T1)",
          "Office of Departure": "NL000396 — Schiphol",
          "Office of Destination": "IE002100 — Dublin Airport",
          "Guarantee Ref": "GRN-NL-2026-08847",
          "Seal Numbers": "NL-SEAL-887441, NL-SEAL-887442",
          Status: "Released",
        },
      },
      {
        id: "IOT-TEMP-AMS",
        title: "IoT Temperature Log",
        type: "IoT",
        status: "Approved",
        date: "2026-02-15",
        details: {
          "Sensor ID": "ELMS-IOT-T7742",
          Location: "AMS Cold Chain Zone B",
          "Min Temp": "18.2°C",
          "Max Temp": "22.1°C",
          "Avg Temp": "20.4°C",
          Threshold: "15°C – 25°C",
          Result: "✅ Within Acceptable Range",
        },
      },
    ],
  },
  {
    id: "customs",
    label: "EU Customs Clearance",
    location: "Dublin Airport (DUB)",
    status: "current",
    icon: <ShieldCheck className="w-5 h-5" />,
    timestamp: "2026-02-15 11:30 GMT — Processing",
    documents: [
      {
        id: "ICS2-IE-2026-0847",
        title: "ICS2 Import Declaration",
        type: "Customs",
        status: "Processing",
        date: "2026-02-15",
        details: {
          "MRN": "26IE00ICS2DUB00847",
          "Declaration Type": "ICS2 Entry Summary (ENS)",
          Declarant: "ELMS Customs Broker IE",
          "HS Codes": "8471.30.00, 8528.72.00",
          "Duty Rate": "0% (ITA Agreement)",
          "VAT Rate": "23% (Irish Standard)",
          Status: "⏳ Under Review",
        },
      },
      {
        id: "COO-SZX-2026",
        title: "Certificate of Origin",
        type: "Compliance",
        status: "Approved",
        date: "2026-02-14",
        details: {
          "Certificate No": "COO-CN-2026-44871",
          "Issuing Authority": "CCPIT Shenzhen",
          "Country of Origin": "People's Republic of China",
          Beneficiary: "TechRetail Europe GmbH",
          "Trade Agreement": "N/A (MFN Rates Apply)",
          "Valid Until": "2026-08-14",
          "Verified By": "ELMS Compliance Engine",
        },
      },
      {
        id: "CARBON-DUB-0847",
        title: "Carbon Emission Report",
        type: "Environment",
        status: "Generated",
        date: "2026-02-15",
        details: {
          "Report ID": "CARBON-DUB-0847",
          "Total CO₂": "1.2 tonnes",
          "Air Segment": "1.08t (SZX→AMS→DUB)",
          "Ground Segment": "0.12t (Last-mile)",
          "EU Standard": "CSRD / CBAM Aligned",
          "Offset Available": "Yes — €18.60 via ETS",
          "Generated By": "ELMS Carbon Module",
        },
      },
    ],
  },
  {
    id: "last-mile",
    label: "Last-Mile Delivery",
    location: "Dublin, Ireland",
    status: "pending",
    icon: <MapPin className="w-5 h-5" />,
    documents: [
      {
        id: "DEL-DUB-0847",
        title: "Delivery Order",
        type: "Delivery",
        status: "Pending",
        date: "—",
        details: {
          "Delivery ID": "DEL-DUB-0847",
          Recipient: "TechRetail Europe GmbH",
          Address: "Unit 12, Citywest Business Park, Dublin 24",
          "Contact": "Michael O'Brien (+353 1 XXX XXXX)",
          "Time Window": "2026-02-16 09:00–12:00 GMT",
          "Last-Mile Carrier": "An Post / DPD Ireland",
          Status: "⏳ Awaiting Customs Release",
        },
      },
      {
        id: "POD-DUB-0847",
        title: "Proof of Delivery",
        type: "Confirmation",
        status: "Pending",
        date: "—",
        details: {
          "POD ID": "POD-DUB-0847",
          "Signature": "— (Pending)",
          "Photo Proof": "— (Pending)",
          "Delivery Time": "— (Pending)",
          "Condition Check": "— (Pending)",
          "Receiver Name": "— (Pending)",
          Status: "⏳ Not Yet Delivered",
        },
      },
    ],
  },
];

// ─── Status Helpers ──────────────────────────────────────────────
function getStatusColors(status: NodeStatus) {
  switch (status) {
    case "completed":
      return {
        node: "bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]",
        text: "text-emerald-400",
        line: "bg-emerald-500/60",
        badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        ring: "ring-emerald-500/20",
      };
    case "current":
      return {
        node: "bg-blue-500 border-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.5)]",
        text: "text-blue-400",
        line: "bg-slate-600/40",
        badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
        ring: "ring-blue-500/20",
      };
    case "pending":
      return {
        node: "bg-slate-700 border-slate-600",
        text: "text-slate-500",
        line: "bg-slate-700/40",
        badge: "bg-slate-700/30 text-slate-500 border-slate-600/30",
        ring: "ring-slate-600/20",
      };
  }
}

function StatusIcon({ status }: { status: NodeStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case "current":
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-4 h-4 text-blue-400" />
        </motion.div>
      );
    case "pending":
      return <Circle className="w-4 h-4 text-slate-500" />;
  }
}

function docTypeIcon(type: string) {
  switch (type) {
    case "Order":
      return <ClipboardList className="w-4 h-4" />;
    case "Logistics":
      return <Package className="w-4 h-4" />;
    case "Finance":
      return <Receipt className="w-4 h-4" />;
    case "Shipping":
      return <Truck className="w-4 h-4" />;
    case "Labels":
      return <Printer className="w-4 h-4" />;
    case "Customs":
      return <ShieldCheck className="w-4 h-4" />;
    case "IoT":
      return <Thermometer className="w-4 h-4" />;
    case "Compliance":
      return <FileText className="w-4 h-4" />;
    case "Environment":
      return <Leaf className="w-4 h-4" />;
    case "Delivery":
      return <MapPin className="w-4 h-4" />;
    case "Confirmation":
      return <ScanLine className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

function docStatusColor(status: Document["status"]) {
  switch (status) {
    case "Approved":
      return "text-emerald-400 bg-emerald-500/10";
    case "Processing":
      return "text-blue-400 bg-blue-500/10";
    case "Generated":
      return "text-cyan-400 bg-cyan-500/10";
    case "Pending":
      return "text-slate-500 bg-slate-500/10";
  }
}

// ─── Document Modal ──────────────────────────────────────────────
function DocumentModal({
  doc,
  localeDoc,
  docStatuses,
  onClose,
}: {
  doc: Document;
  localeDoc?: { title: string; details: Record<string, string> };
  docStatuses?: Record<string, string>;
  onClose: () => void;
}) {
  const dm = useContent().slide6.documentModal;
  const displayTitle = localeDoc?.title ?? doc.title;
  const displayStatus = docStatuses?.[doc.status] ?? doc.status;
  const displayDetails = localeDoc?.details ?? doc.details;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              {docTypeIcon(doc.type)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                {displayTitle}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[13px] text-slate-500 font-mono">
                  {doc.id}
                </span>
                <span
                  className={`text-[12px] font-mono font-bold px-2 py-1 rounded ${docStatusColor(doc.status)}`}
                >
                  {displayStatus}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shipment reference */}
        <div className="mx-6 mt-4 px-4 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-emerald-400/60 font-mono uppercase">
              {dm.shipmentRef}
            </div>
            <BarChart3 className="w-4 h-4 text-emerald-400/30" />
          </div>
          <div className="text-sm text-emerald-300 font-mono font-bold mt-0.5">
            {SHIPMENT_ID}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-2.5">
          {Object.entries(displayDetails).map(([key, value], i) => (
            <motion.div
              key={key}
              className="flex items-start justify-between gap-4 px-4 py-2.5 rounded-lg bg-white/3 border border-white/5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <span className="text-[13px] lg:text-sm text-slate-500 font-mono uppercase tracking-wider whitespace-nowrap shrink-0">
                {key}
              </span>
              <span className="text-[13px] lg:text-sm text-white/90 font-mono text-right">
                {value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/2 flex items-center justify-between">
          <span className="text-[12px] text-slate-500 font-mono">
            {dm.datePrefix} {doc.date}
          </span>
          <span className="text-[12px] text-slate-500 font-mono">
            {dm.autoGenerated}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Route Node Component ────────────────────────────────────────
function RouteNodeCard({
  node,
  index,
  isLast,
  onDocClick,
}: {
  node: RouteNode;
  index: number;
  isLast: boolean;
  onDocClick: (doc: Document, docIndex: number) => void;
}) {
  const colors = getStatusColors(node.status);
  const rc = useContent().slide6;
  const localeNode = rc.routeNodes[index];
  const localeDocuments = localeNode?.documents as unknown as { title: string; details: Record<string, string> }[] | undefined;
  const docStatuses = rc.docStatuses as Record<string, string> | undefined;

  return (
    <motion.div
      className="flex flex-col items-center relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15 }}
    >
      {/* ── Node Circle ── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Pulse ring for current */}
        {node.status === "current" && (
          <motion.div
            className="absolute -inset-3 rounded-full border-2 border-blue-400/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${colors.node}`}
        >
          <span className="text-white">{node.icon}</span>
        </div>

        {/* Location label */}
        <div className="mt-2.5 text-center max-w-36">
          <div
            className={`text-[13px] lg:text-sm font-bold font-mono leading-tight ${colors.text}`}
          >
            {localeNode?.label ?? node.label}
          </div>
          <div className="text-[12px] text-slate-500 font-mono mt-0.5">
            {localeNode?.location ?? node.location}
          </div>
          {(localeNode?.timestamp ?? node.timestamp) && (
            <div className="text-[10px] text-slate-600 font-mono mt-0.5 leading-tight">
              {localeNode?.timestamp ?? node.timestamp}
            </div>
          )}
        </div>
      </div>

      {/* ── Connection Line to next node ── */}
      {!isLast && (
        <div className="hidden" />
      )}

      {/* ── Document List ── */}
      <div className="mt-4 w-full max-w-44 space-y-1.5">
        {node.documents.map((doc, di) => {
          const lDoc = localeDocuments?.[di];
          return (
            <motion.button
              key={doc.id}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border cursor-pointer text-left transition-all
                ${colors.badge} hover:ring-2 ${colors.ring} hover:scale-[1.03] active:scale-[0.98]`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.15 + di * 0.08 }}
              onClick={() => onDocClick(doc, di)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="shrink-0 opacity-70">
                {docTypeIcon(doc.type)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-mono font-semibold truncate leading-tight">
                  {lDoc?.title ?? doc.title}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <StatusIcon status={
                    doc.status === "Approved" || doc.status === "Generated"
                      ? "completed"
                      : doc.status === "Processing"
                      ? "current"
                      : "pending"
                  } />
                  <span className="text-[10px] font-mono opacity-70">
                    {docStatuses?.[doc.status] ?? doc.status}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Horizontal Connection Line ──────────────────────────────────
function HorizontalConnector({
  status,
  index,
}: {
  status: NodeStatus;
  index: number;
}) {
  const isActive = status === "completed";

  return (
    <motion.div
      className="flex items-start pt-5 self-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.15 }}
    >
      <div className="relative w-6 lg:w-12 xl:w-16 h-0.5 mt-5">
        {/* Base line */}
        <div
          className={`absolute inset-0 rounded-full ${
            isActive ? "bg-emerald-500/50" : "bg-slate-700/40"
          }`}
        />
        {/* Traveling dot */}
        {isActive && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
            animate={{ left: ["0%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Slide Component ────────────────────────────────────────
export function ShipmentTrackingSlide() {
  const [selectedDoc, setSelectedDoc] = useState<{ doc: Document; nodeIndex: number; docIndex: number } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const content = useContent();
  const c = content.slide6;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-br from-slate-950 via-[#0b1222] to-slate-950 text-white relative overflow-hidden p-4 md:p-5 lg:p-8">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow spots */}
      <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-emerald-500/4 rounded-full blur-[100px]" />

      {/* ── Header ── */}
      <div className="relative z-10 text-center mb-3 md:mb-4 lg:mb-6">
        <motion.div
          className="flex items-center justify-center gap-2 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-400/60" />
          <span className="text-[12px] md:text-[13px] lg:text-sm font-mono text-blue-400/70 tracking-[0.25em] uppercase">
            {c.badge}
          </span>
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-400/60" />
        </motion.div>

        <motion.h2
          className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="text-white">{c.title}</span>
          <span className="text-blue-400 mx-1 md:mx-2">—</span>
          <span className="text-emerald-300 font-mono text-sm md:text-xl lg:text-2xl">
            {c.shipmentId}
          </span>
        </motion.h2>

        <motion.p
          className="mt-1 text-[12px] md:text-[13px] lg:text-sm text-slate-500 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Legend */}
        <motion.div
          className="flex items-center justify-center gap-3 md:gap-4 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {[
            { color: "bg-emerald-500", label: c.legend.completed },
            { color: "bg-blue-500", label: c.legend.inProgress },
            { color: "bg-slate-600", label: c.legend.pending },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${item.color}`} />
              <span className="text-[10px] md:text-[12px] text-slate-500 font-mono">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Desktop: Horizontal Route Flow ── */}
      <div className="relative z-10 hidden md:flex items-start justify-center gap-0 w-full max-w-7xl py-2">
        {routeNodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <RouteNodeCard
              node={node}
              index={i}
              isLast={i === routeNodes.length - 1}
              onDocClick={(doc, di) => setSelectedDoc({ doc, nodeIndex: i, docIndex: di })}
            />
            {i < routeNodes.length - 1 && (
              <HorizontalConnector
                status={routeNodes[i + 1].status === "pending" && node.status === "current" ? "current" : node.status}
                index={i}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Mobile: Condensed vertical node list ── */}
      <div className="relative z-10 flex md:hidden flex-col items-center gap-2 flex-1 justify-center min-h-0">
        {/* Mini vertical timeline */}
        <div className="flex flex-col items-center gap-0">
          {routeNodes.map((node, i) => {
            const colors = getStatusColors(node.status);
            return (
              <React.Fragment key={node.id}>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center ${colors.node}`}
                  >
                    <span className="text-white scale-75">{node.icon}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-[12px] font-mono font-bold ${colors.text} truncate max-w-28`}>
                      {c.routeNodes[i]?.label ?? node.label}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {node.documents.length} {c.docsSuffix}
                    </span>
                  </div>
                </motion.div>
                {i < routeNodes.length - 1 && (
                  <div className={`w-px h-3 ${i < 2 ? "bg-emerald-500/40" : "bg-slate-700/40"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <MobileExpandButton
          label={c.mobileExpand}
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* ── Desktop: Bottom status bar ── */}
      <motion.div
        className="relative z-10 mt-3 md:mt-4 lg:mt-6 hidden md:flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-[12px] lg:text-[13px] font-mono text-slate-500"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            <span className="text-emerald-400 font-bold">3/5</span> {c.statusBar.nodesCompleted}
          </span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>
            <span className="text-blue-400 font-bold">12</span> {c.statusBar.documentsTracked}
          </span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>
            {c.statusBar.customs} <span className="text-blue-400 font-bold">{c.statusBar.customsStatus}</span>
          </span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-400" />
          <span>
            {c.statusBar.carbon} <span className="text-green-400 font-bold">{c.statusBar.carbonValue}</span>
          </span>
        </div>
      </motion.div>

      {/* ── Document Modal (desktop click) ── */}
      <AnimatePresence>
        {selectedDoc && (
          <DocumentModal
            doc={selectedDoc.doc}
            localeDoc={(c.routeNodes[selectedDoc.nodeIndex]?.documents as unknown as { title: string; details: Record<string, string> }[] | undefined)?.[selectedDoc.docIndex]}
            docStatuses={c.docStatuses as Record<string, string> | undefined}
            onClose={() => setSelectedDoc(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Detail Modal ── */}
      <MobileDetailModal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title={c.mobileModal.title}
        subtitle={c.mobileModal.subtitle}
      >
        <div className="space-y-4">
          {routeNodes.map((node, i) => {
            const colors = getStatusColors(node.status);
            const mNode = c.routeNodes[i];
            return (
              <div key={node.id}>
                {/* Node header */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${colors.node}`}
                  >
                    <span className="text-white">{node.icon}</span>
                  </div>
                  <div>
                    <div className={`text-sm font-bold font-mono ${colors.text}`}>
                      {mNode?.label ?? node.label}
                    </div>
                    <div className="text-[12px] text-slate-500 font-mono">
                      {mNode?.location ?? node.location}
                    </div>
                    {(mNode?.timestamp ?? node.timestamp) && (
                      <div className="text-[10px] text-slate-600 font-mono">
                        {mNode?.timestamp ?? node.timestamp}
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="ml-12 space-y-2">
                  {node.documents.map((doc, di) => {
                    const mlDoc = (mNode?.documents as unknown as { title: string; details: Record<string, string> }[] | undefined)?.[di];
                    const mDocStatuses = c.docStatuses as Record<string, string> | undefined;
                    return (
                      <button
                        key={doc.id}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${colors.badge} active:scale-[0.98]`}
                        onClick={() => {
                          setMobileOpen(false);
                          setTimeout(() => setSelectedDoc({ doc, nodeIndex: i, docIndex: di }), 300);
                        }}
                      >
                        <span className="shrink-0 opacity-70">
                          {docTypeIcon(doc.type)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-mono font-semibold truncate">
                            {mlDoc?.title ?? doc.title}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <StatusIcon
                              status={
                                doc.status === "Approved" || doc.status === "Generated"
                                  ? "completed"
                                  : doc.status === "Processing"
                                    ? "current"
                                    : "pending"
                              }
                            />
                            <span className="text-[10px] font-mono opacity-70">
                              {mDocStatuses?.[doc.status] ?? doc.status}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2.5 pt-2.5 border-t border-white/5">
            {c.mobileModal.stats.map((stat: { value: string; label: string }, si: number) => {
              const statColors = ["text-emerald-400", "text-blue-400", "text-blue-400", "text-green-400"];
              return (
                <div key={si} className="text-center p-2 rounded-lg bg-white/3">
                  <div className={`text-sm font-mono font-bold ${statColors[si] ?? "text-slate-400"}`}>{stat.value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </MobileDetailModal>

      {/* Click hint (desktop only) */}
      <motion.div
        className="absolute bottom-3 right-4 text-[12px] text-slate-600 font-mono hidden md:flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      >
        <FileText className="w-4 h-4" />
        {c.clickHint}
      </motion.div>
    </div>
  );
}
