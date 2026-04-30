"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Users, Search, X, Copy, Check, ChevronDown,
  Twitter, ExternalLink, Pencil, TrendingUp, Crown,
  RefreshCw, AlertCircle
} from "lucide-react";

// ─── GIF Library ─────────────────────────────────────────────────────────────
const GIF_LIBRARY = [
  { id: "2F9NoLzsg9RgBSE10X", label: "Buzzd",       url: "https://media.giphy.com/media/2F9NoLzsg9RgBSE10X/giphy.gif" },
  { id: "ygxlakNTPSHgV3k7m0", label: "Love",        url: "https://media.giphy.com/media/ygxlakNTPSHgV3k7m0/giphy.gif" },
  { id: "slaDyEARpzHLFt1pbl", label: "GVC",         url: "https://media.giphy.com/media/slaDyEARpzHLFt1pbl/giphy.gif" },
  { id: "JElPMiBMkozSxn1ZY4", label: "Sunshine",    url: "https://media.giphy.com/media/JElPMiBMkozSxn1ZY4/giphy.gif" },
  { id: "yeac8qwFZFQxTkgJDn", label: "Buzzd 2",     url: "https://media.giphy.com/media/yeac8qwFZFQxTkgJDn/giphy.gif" },
  { id: "WAJ9lDsrZcpZOfQ0nT", label: "Smart",       url: "https://media.giphy.com/media/WAJ9lDsrZcpZOfQ0nT/giphy.gif" },
  { id: "M8OObCJn10limG2uNx", label: "Welcome",     url: "https://media.giphy.com/media/M8OObCJn10limG2uNx/giphy.gif" },
  { id: "2ATcJnbpzboIq4ZFNo", label: "Sup",         url: "https://media.giphy.com/media/2ATcJnbpzboIq4ZFNo/giphy.gif" },
  { id: "Uq9Bb6BcFRGFjfFwbd", label: "Tendy",       url: "https://media.giphy.com/media/Uq9Bb6BcFRGFjfFwbd/giphy.gif" },
  { id: "yZCUdGSEOi0CC4HM9k", label: "Finger Guns", url: "https://media.giphy.com/media/yZCUdGSEOi0CC4HM9k/giphy.gif" },
];

// ─── Team Config ──────────────────────────────────────────────────────────────
type TeamMember = "chris" | "ty" | "ronnie" | "maison";

const TEAM: { id: TeamMember; name: string; avatar: string }[] = [
  { id: "chris",  name: "Chris",  avatar: "🎯" },
  { id: "ty",     name: "Ty",     avatar: "🌊" },
  { id: "ronnie", name: "Ronny",  avatar: "⚡" },
  { id: "maison", name: "Maison", avatar: "🎨" },
];

// ─── Tier Config ──────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  whale:     { label: "Whale",     color: "#FFE048", bg: "rgba(255,224,72,0.12)",  icon: "🐋",  min: 25,  desc: "25+ NFTs" },
  core:      { label: "Core",      color: "#FF5F1F", bg: "rgba(255,95,31,0.12)",   icon: "💎",  min: 10,  desc: "10–24 NFTs" },
  solid:     { label: "Solid",     color: "#2EFF2E", bg: "rgba(46,255,46,0.10)",   icon: "⚡",  min: 5,   desc: "5–9 NFTs" },
  collector: { label: "Collector", color: "#888",    bg: "rgba(136,136,136,0.10)", icon: "✨",  min: 1,   desc: "1–4 NFTs" },
};
type HolderTier = keyof typeof TIER_CONFIG;

// ─── Templates ───────────────────────────────────────────────────────────────
interface TeamTemplate {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bodies: Record<TeamMember, string>;
}

const TEMPLATES: TeamTemplate[] = [
  {
    id: "welcome",
    name: "Welcome",
    emoji: "👋",
    color: "#2EFF2E",
    bodies: {
      chris:  "yo @{twitter} welcome to vibetown 🏙️ let's get it",
      ty:     "welcome to the city @{twitter} 🏙️ vibetown is different",
      ronnie: "@{twitter} in. welcome to vibetown 🏙️",
      maison: "@{twitter} welcome to the culture 🏙️ vibetown is alive",
    },
  },
  {
    id: "thankyou",
    name: "Thank You",
    emoji: "🙏",
    color: "#FFE048",
    bodies: {
      chris:  "@{twitter} real ones don't go unnoticed 💛 appreciate you fr",
      ty:     "@{twitter} — real talk, we appreciate you. always 💛",
      ronnie: "@{twitter} straight up — thank you. means everything 💛",
      maison: "grateful for you @{twitter} — you make this real 💛",
    },
  },
  {
    id: "reactivate",
    name: "Re-activate",
    emoji: "📡",
    color: "#FF6B9D",
    bodies: {
      chris:  "@{twitter} vibetown's calling 📡 we ain't forgot about you",
      ty:     "@{twitter} where you been? the vibes are still here 🌊",
      ronnie: "@{twitter} it's been a minute. what's good?",
      maison: "@{twitter} the energy is still here. come back to the vibe 🌊",
    },
  },
  {
    id: "whale",
    name: "Whale Appreciation",
    emoji: "🐋",
    color: "#7C3AED",
    bodies: {
      chris:  "@{twitter} {nfts} GVCs. absolute conviction. we see you 👑",
      ty:     "@{twitter} {nfts} strong. the foundation fr 🐋",
      ronnie: "{nfts} GVCs @{twitter}. no cap, that's legendary 👑",
      maison: "@{twitter} holding {nfts} like it's nothing 🐋 you're the backbone",
    },
  },
  {
    id: "gift",
    name: "Gift Drop",
    emoji: "🎁",
    color: "#06B6D4",
    bodies: {
      chris:  "@{twitter} 👀 check your mentions. something's moving",
      ty:     "@{twitter} stay close. something good coming your way 🎁",
      ronnie: "@{twitter} 🎁 keep your eyes open",
      maison: "@{twitter} something special is headed your way 👀 stay tuned 🎁",
    },
  },
  {
    id: "accumulator",
    name: "Accumulator",
    emoji: "📈",
    color: "#2EFF2E",
    bodies: {
      chris:  "@{twitter} keep stacking 📈 we see every move",
      ty:     "the conviction on @{twitter} is unmatched rn 📈",
      ronnie: "@{twitter} buying mode activated. love to see it 📈",
      maison: "@{twitter} the accumulation is real. vibetown notices 📈",
    },
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface RawHolder {
  rank: number;
  address: string;
  nfts: number;
  twitter: string;
  ens: string;
  tier: HolderTier;
  isAccumulating: boolean;
  buysThisMonth: number;
}

interface Holder extends RawHolder {
  manualTwitter: string; // user-entered, overrides twitter
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function truncate(addr: string) { return addr.slice(0, 6) + "..." + addr.slice(-4); }

function fillTemplate(body: string, h: Holder): string {
  const handle = h.manualTwitter || h.twitter || h.ens || truncate(h.address);
  return body
    .replace(/{twitter}/g, handle)
    .replace(/{nfts}/g, String(h.nfts));
}

function displayName(h: Holder): string {
  if (h.manualTwitter) return `@${h.manualTwitter}`;
  if (h.twitter) return `@${h.twitter}`;
  if (h.ens) return h.ens;
  return truncate(h.address);
}

function isIdentified(h: Holder): boolean {
  return !!(h.manualTwitter || h.twitter);
}

const LS_KEY = "gvc:crm:twitter-map";

function loadManualMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
}

function saveManualMap(map: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: HolderTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function TeamDropdown({ active, onChange }: { active: TeamMember; onChange: (m: TeamMember) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const member = TEAM.find(m => m.id === active)!;

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121212] border border-[#1F1F1F] hover:border-[#333] transition-all">
        <span>{member.avatar}</span>
        <span className="text-sm font-bold text-white font-body">{member.name}</span>
        <ChevronDown size={12} className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] overflow-hidden z-50 shadow-2xl"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.12 }}>
            {TEAM.map(m => (
              <button key={m.id} onClick={() => { onChange(m.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-body transition-colors ${
                  m.id === active ? "bg-[rgba(255,224,72,0.08)] text-[#FFE048]" : "text-gray-300 hover:bg-[#1F1F1F]"
                }`}>
                <span>{m.avatar}</span>
                <span className="font-bold">{m.name}</span>
                {m.id === active && <Check size={12} className="ml-auto text-[#FFE048]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Twitter Edit Inline ──────────────────────────────────────────────────────
function TwitterEdit({ holder, onSave }: { holder: Holder; onSave: (addr: string, handle: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(holder.manualTwitter || holder.twitter || "");
  const inputRef = useRef<HTMLInputElement>(null);

  function save() {
    const clean = val.trim().replace(/^@/, "");
    onSave(holder.address, clean);
    setEditing(false);
  }

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 text-sm">@</span>
        <input ref={inputRef} value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          placeholder="twitterhandle"
          className="bg-[#1F1F1F] border border-[#FFE048]/40 rounded-lg px-2 py-1 text-sm text-white font-body focus:outline-none w-36" />
        <button onClick={save} className="p-1 rounded-lg bg-[#FFE048] text-black hover:bg-[#FFD000] transition-all">
          <Check size={11} />
        </button>
        <button onClick={() => setEditing(false)} className="p-1 rounded-lg bg-[#1F1F1F] text-gray-400 hover:text-white transition-all">
          <X size={11} />
        </button>
      </div>
    );
  }

  const name = displayName(holder);
  const identified = isIdentified(holder);

  return (
    <button onClick={() => setEditing(true)}
      className={`flex items-center gap-1.5 group/edit transition-colors ${identified ? "text-white" : "text-gray-500"}`}>
      <Twitter size={12} className={identified ? "text-[#1DA1F2]" : "text-gray-600"} />
      <span className="text-sm font-body">{name}</span>
      <Pencil size={10} className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-gray-500" />
    </button>
  );
}

// ─── GIF Picker ───────────────────────────────────────────────────────────────
function GifPicker({ selected, onSelect }: { selected: string | null; onSelect: (url: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const selectedGif = GIF_LIBRARY.find(g => g.url === selected);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-body border transition-all ${
          selected ? "border-[#FFE048]/40 text-[#FFE048] bg-[rgba(255,224,72,0.06)]"
                   : "border-[#1F1F1F] text-gray-400 bg-[#121212] hover:border-[#333] hover:text-white"
        }`}>
        🎞️ {selected ? `GIF: ${selectedGif?.label}` : "Pick GIF"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute bottom-full mb-2 left-0 w-72 rounded-2xl bg-[#0D0D0D] border border-[#1F1F1F] p-3 z-50 shadow-2xl"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-gray-400 font-body uppercase tracking-wider">GVC GIF Library</span>
              {selected && <button onClick={() => { onSelect(null); setOpen(false); }} className="text-[10px] text-gray-500 hover:text-white font-body">Clear</button>}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {GIF_LIBRARY.map(gif => (
                <button key={gif.id} onClick={() => { onSelect(gif.url); setOpen(false); }}
                  className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${selected === gif.url ? "border-[#FFE048]" : "border-transparent hover:border-[#333]"}`}
                  title={gif.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gif.url} alt={gif.label} className="w-full h-full object-cover" />
                  {selected === gif.url && (
                    <div className="absolute inset-0 bg-[#FFE048]/20 flex items-center justify-center">
                      <Check size={14} className="text-[#FFE048] drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Holder Modal ─────────────────────────────────────────────────────────────
function HolderModal({ holder, activeMember, onClose, onSaveTwitter }: {
  holder: Holder;
  activeMember: TeamMember;
  onClose: () => void;
  onSaveTwitter: (addr: string, handle: string) => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<TeamTemplate | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const cfg = TIER_CONFIG[holder.tier];

  function copy() {
    if (!selectedTemplate) return;
    const msg = fillTemplate(selectedTemplate.bodies[activeMember], holder);
    const full = selectedGif ? `${msg}\n${selectedGif}` : msg;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const twitterHandle = holder.manualTwitter || holder.twitter;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#1F1F1F] bg-[#0D0D0D]"
        initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 35 }}>

        <div className="sm:hidden w-10 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="p-5 border-b border-[#1F1F1F] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: cfg.bg }}>
              {cfg.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <TwitterEdit holder={holder} onSave={onSaveTwitter} />
                {twitterHandle && (
                  <a href={`https://x.com/${twitterHandle}`} target="_blank" rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-400 transition-colors">
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-500 font-body font-mono">{truncate(holder.address)}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <TierBadge tier={holder.tier} />
                {holder.isAccumulating && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(46,255,46,0.12)] text-[#2EFF2E]">
                    📈 +{holder.buysThisMonth} this month
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1F1F1F] text-gray-400 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-[#1F1F1F] border-b border-[#1F1F1F]">
          {[
            { label: "GVCs Held",  value: holder.nfts,                   icon: "🖼️" },
            { label: "Rank",       value: `#${holder.rank}`,              icon: "👑" },
            { label: "Buys (30d)", value: holder.buysThisMonth || "—",    icon: "📈" },
          ].map(s => (
            <div key={s.label} className="bg-[#0D0D0D] p-3 text-center">
              <div className="text-base mb-0.5">{s.icon}</div>
              <div className="text-sm font-display text-[#FFE048]">{s.value}</div>
              <div className="text-[10px] text-gray-500 font-body">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div className="p-4 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121212] border border-[#1F1F1F]">
            <span className="text-xs text-gray-500 font-body font-mono flex-1">{holder.address}</span>
            <button onClick={() => navigator.clipboard.writeText(holder.address)}
              className="text-gray-500 hover:text-white transition-colors shrink-0">
              <Copy size={12} />
            </button>
            <a href={`https://etherscan.io/address/${holder.address}`} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors shrink-0">
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Sending as */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <span className="text-xs text-gray-500 font-body">Sending as</span>
          <span className="text-xs font-bold text-white font-body">
            {TEAM.find(m => m.id === activeMember)?.avatar}{" "}
            {TEAM.find(m => m.id === activeMember)?.name}
          </span>
        </div>

        {/* Template picker */}
        <div className="px-4 pb-3 pt-2">
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => { setSelectedTemplate(selectedTemplate?.id === t.id ? null : t); setSelectedGif(null); }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedTemplate?.id === t.id
                    ? "border-[#FFE048] bg-[rgba(255,224,72,0.08)]"
                    : "border-[#1F1F1F] bg-[#121212] hover:border-[#333]"
                }`}>
                <div className="text-lg mb-0.5">{t.emoji}</div>
                <div className="text-[10px] font-bold text-white font-display leading-tight">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message preview */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div className="mx-4 mb-4 rounded-2xl border border-[#1F1F1F] overflow-hidden"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="p-4 bg-[#121212]">
                <p className="text-sm text-white font-body leading-relaxed">
                  {fillTemplate(selectedTemplate.bodies[activeMember], holder)}
                </p>
                <AnimatePresence>
                  {selectedGif && (
                    <motion.div className="mt-3 relative inline-block"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedGif} alt="gif" className="max-h-36 rounded-xl" />
                      <button onClick={() => setSelectedGif(null)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0D0D0D] border border-[#1F1F1F] flex items-center justify-center text-gray-400 hover:text-white">
                        <X size={10} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2 p-3 border-t border-[#1F1F1F] bg-[#0D0D0D]">
                <GifPicker selected={selectedGif} onSelect={setSelectedGif} />
                <button onClick={copy}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE048] text-black text-sm font-bold hover:bg-[#FFD000] transition-all active:scale-95">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy Message"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Main CRM Page ────────────────────────────────────────────────────────────
type Tab = "holders" | "templates";
type TierFilter = "all" | HolderTier | "accumulating" | "unknown";

export default function CRMPage() {
  const [tab, setTab] = useState<Tab>("holders");
  const [activeMember, setActiveMember] = useState<TeamMember>("chris");
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [selectedHolder, setSelectedHolder] = useState<Holder | null>(null);
  const [manualMap, setManualMap] = useState<Record<string, string>>({});
  const [templateGifs, setTemplateGifs] = useState<Record<string, string | null>>({});
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Load manual Twitter map from localStorage
  useEffect(() => { setManualMap(loadManualMap()); }, []);

  async function loadHolders() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/holders");
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const map = loadManualMap();
      const withManual: Holder[] = data.holders.map((h: RawHolder) => ({
        ...h,
        manualTwitter: map[h.address.toLowerCase()] || "",
      }));
      setHolders(withManual);
      setFetchedAt(data.fetchedAt);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load holder data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadHolders(); }, []);

  function saveTwitter(address: string, handle: string) {
    const addr = address.toLowerCase();
    const newMap = { ...manualMap, [addr]: handle };
    setManualMap(newMap);
    saveManualMap(newMap);
    setHolders(prev => prev.map(h =>
      h.address.toLowerCase() === addr ? { ...h, manualTwitter: handle } : h
    ));
    setSelectedHolder(prev => prev && prev.address.toLowerCase() === addr ? { ...prev, manualTwitter: handle } : prev);
  }

  const counts = useMemo(() => ({
    whale:       holders.filter(h => h.tier === "whale").length,
    core:        holders.filter(h => h.tier === "core").length,
    solid:       holders.filter(h => h.tier === "solid").length,
    collector:   holders.filter(h => h.tier === "collector").length,
    accumulating: holders.filter(h => h.isAccumulating).length,
    unknown:     holders.filter(h => !isIdentified(h)).length,
  }), [holders]);

  const filtered = useMemo(() => {
    let list = holders;
    if (tierFilter === "accumulating") list = list.filter(h => h.isAccumulating);
    else if (tierFilter === "unknown") list = list.filter(h => !isIdentified(h));
    else if (tierFilter !== "all") list = list.filter(h => h.tier === tierFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(h =>
        h.manualTwitter.toLowerCase().includes(q) ||
        h.twitter.toLowerCase().includes(q) ||
        h.ens.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [holders, tierFilter, search]);

  const identified = holders.filter(isIdentified).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(/grid.svg)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#1F1F1F] bg-[#050505]/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/gvc-logotype.svg" alt="GVC" width={80} height={28} className="brightness-110" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F1F1F] border border-[#2a2a2a]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2EFF2E] animate-pulse" />
              <span className="text-[10px] font-bold text-[#2EFF2E] font-body tracking-wider">HOLDER CRM</span>
            </div>
          </div>
          <nav className="flex items-center gap-1 bg-[#121212] rounded-xl p-1 border border-[#1F1F1F]">
            {(["holders", "templates"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 sm:px-5 py-1.5 rounded-lg text-xs font-bold font-body capitalize transition-all ${
                  tab === t ? "bg-[#FFE048] text-black" : "text-gray-400 hover:text-white"
                }`}>
                {t === "holders" ? "👥" : "✉️"}
                <span className="hidden sm:inline ml-1.5">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
              </button>
            ))}
          </nav>
          <TeamDropdown active={activeMember} onChange={setActiveMember} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ── Holders Tab ─────────────────────────────────────────────── */}
          {tab === "holders" && (
            <motion.div key="holders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Page header */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl text-shimmer mb-1">Top 100 Holders</h1>
                  <p className="text-gray-400 font-body text-sm">
                    Real on-chain data · {identified}/{holders.length} identified
                    {fetchedAt && <span className="ml-2 text-gray-600">· refreshed {new Date(fetchedAt).toLocaleTimeString()}</span>}
                  </p>
                </div>
                <button onClick={loadHolders} disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121212] border border-[#1F1F1F] text-gray-400 hover:text-white text-xs font-body transition-all disabled:opacity-40">
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              {/* Stat pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {(Object.entries(TIER_CONFIG) as [HolderTier, typeof TIER_CONFIG[HolderTier]][]).map(([key, cfg]) => (
                  <button key={key} onClick={() => setTierFilter(tierFilter === key ? "all" : key)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      tierFilter === key ? "border-[#FFE048]/40 bg-[rgba(255,224,72,0.05)]" : "border-[#1F1F1F] bg-[#121212] hover:border-[#333]"
                    }`}>
                    <div className="text-xl mb-1">{cfg.icon}</div>
                    <div className="font-display text-2xl" style={{ color: cfg.color }}>{counts[key]}</div>
                    <div className="text-xs text-gray-500 font-body">{cfg.label} <span className="text-gray-600">({cfg.desc})</span></div>
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body mb-4">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* Filters + search */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" placeholder="Search by Twitter, ENS, or wallet address..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121212] border border-[#1F1F1F] text-sm text-white placeholder-gray-600 font-body focus:outline-none focus:border-[#FFE048]/40 transition-colors" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {([
                  { key: "all",          label: "All",             count: holders.length },
                  { key: "accumulating", label: "📈 Accumulating", count: counts.accumulating },
                  { key: "unknown",      label: "❓ Not Identified", count: counts.unknown },
                ] as { key: TierFilter; label: string; count: number }[]).map(f => (
                  <button key={f.key} onClick={() => setTierFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-body transition-all ${
                      tierFilter === f.key ? "bg-[#FFE048] text-black" : "bg-[#121212] border border-[#1F1F1F] text-gray-400 hover:border-[#333]"
                    }`}>
                    {f.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tierFilter === f.key ? "bg-black/20" : "bg-[#1F1F1F]"}`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Holder list */}
              {loading ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-[#121212] border border-[#1F1F1F] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#1F1F1F] bg-[#121212] overflow-hidden">
                  {filtered.map((h, i) => {
                    const cfg = TIER_CONFIG[h.tier];
                    return (
                      <motion.div key={h.address}
                        className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-[#1a1a1a] transition-colors ${
                          i < filtered.length - 1 ? "border-b border-[#1A1A1A]" : ""
                        }`}
                        onClick={() => setSelectedHolder(h)}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>

                        {/* Rank */}
                        <div className="w-8 text-center text-xs font-bold font-body shrink-0"
                          style={{ color: h.rank <= 3 ? "#FFE048" : h.rank <= 10 ? "#FF5F1F" : "#555" }}>
                          #{h.rank}
                        </div>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                          style={{ background: cfg.bg }}>
                          {cfg.icon}
                        </div>

                        {/* Identity */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold font-body truncate ${isIdentified(h) ? "text-white" : "text-gray-500"}`}>
                              {displayName(h)}
                            </span>
                            {!isIdentified(h) && (
                              <span className="text-[10px] text-gray-600 font-body shrink-0">click to identify</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-600 font-body font-mono truncate">{h.address}</div>
                        </div>

                        {/* NFT count */}
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold font-display" style={{ color: cfg.color }}>{h.nfts}</div>
                          <div className="text-[10px] text-gray-600 font-body">NFTs</div>
                        </div>

                        {/* Badges */}
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                          <TierBadge tier={h.tier} />
                          {h.isAccumulating && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(46,255,46,0.12)] text-[#2EFF2E] whitespace-nowrap">
                              📈 +{h.buysThisMonth}
                            </span>
                          )}
                        </div>

                        {/* Twitter link */}
                        {(h.manualTwitter || h.twitter) && (
                          <a href={`https://x.com/${h.manualTwitter || h.twitter}`}
                            target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-gray-600 hover:text-[#1DA1F2] transition-colors shrink-0 hidden sm:block">
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </motion.div>
                    );
                  })}

                  {filtered.length === 0 && !loading && (
                    <div className="py-16 text-center text-gray-600 font-body">No holders match your filter.</div>
                  )}
                </div>
              )}

              {/* Unknown holders CTA */}
              {!loading && counts.unknown > 0 && (
                <div className="mt-4 p-4 rounded-2xl bg-[#121212] border border-[#FFE048]/10 flex items-center gap-3">
                  <Crown size={16} className="text-[#FFE048] shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white font-body">
                      {counts.unknown} holders not yet identified
                    </p>
                    <p className="text-xs text-gray-500 font-body">
                      Click any wallet to add their Twitter handle. Saves locally — persists between sessions.
                    </p>
                  </div>
                  <button onClick={() => setTierFilter("unknown")}
                    className="px-3 py-1.5 rounded-xl bg-[#FFE048]/10 text-[#FFE048] text-xs font-bold font-body hover:bg-[#FFE048]/20 transition-all shrink-0">
                    View →
                  </button>
                </div>
              )}

              {/* Accumulator highlight */}
              {!loading && counts.accumulating > 0 && (
                <div className="mt-3 p-4 rounded-2xl bg-[#121212] border border-[#2EFF2E]/10 flex items-center gap-3">
                  <TrendingUp size={16} className="text-[#2EFF2E] shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white font-body">
                      {counts.accumulating} top holders actively buying this month
                    </p>
                    <p className="text-xs text-gray-500 font-body">
                      These wallets are in accumulation mode — strong conviction signal.
                    </p>
                  </div>
                  <button onClick={() => setTierFilter("accumulating")}
                    className="px-3 py-1.5 rounded-xl bg-[#2EFF2E]/10 text-[#2EFF2E] text-xs font-bold font-body hover:bg-[#2EFF2E]/20 transition-all shrink-0">
                    View →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Templates Tab ────────────────────────────────────────────── */}
          {tab === "templates" && (
            <motion.div key="templates" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <h1 className="font-display text-3xl text-shimmer mb-1">Message Templates</h1>
                <p className="text-gray-400 font-body text-sm">
                  Viewing as{" "}
                  <span className="text-white font-bold">
                    {TEAM.find(m => m.id === activeMember)?.avatar}{" "}
                    {TEAM.find(m => m.id === activeMember)?.name}
                  </span>
                  {" "}— switch team member in the header.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map(t => {
                  const gif = templateGifs[t.id] ?? null;
                  return (
                    <motion.div key={t.id}
                      className="rounded-2xl border border-[#1F1F1F] bg-[#121212] overflow-hidden hover:border-[#333] transition-all"
                      whileHover={{ y: -2 }}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{t.emoji}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: t.color, background: `${t.color}18` }}>
                            {t.name.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 font-body leading-relaxed">
                          &ldquo;{t.bodies[activeMember]}&rdquo;
                        </p>
                        <AnimatePresence>
                          {gif && (
                            <motion.div className="mt-3 relative inline-block"
                              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={gif} alt="gif" className="max-h-24 rounded-xl" />
                              <button onClick={() => setTemplateGifs(p => ({ ...p, [t.id]: null }))}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0D0D0D] border border-[#1F1F1F] flex items-center justify-center text-gray-400 hover:text-white">
                                <X size={10} />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="px-4 pb-4 flex items-center gap-2 border-t border-[#1A1A1A] pt-3">
                        <GifPicker selected={gif} onSelect={url => setTemplateGifs(p => ({ ...p, [t.id]: url }))} />
                        <button
                          onClick={() => {
                            const msg = t.bodies[activeMember];
                            const full = gif ? `${msg}\n${gif}` : msg;
                            navigator.clipboard.writeText(full);
                            setCopiedTemplate(t.id);
                            setTimeout(() => setCopiedTemplate(null), 2000);
                          }}
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F1F1F] text-gray-300 text-xs font-bold hover:bg-[#2a2a2a] transition-all">
                          {copiedTemplate === t.id ? <Check size={11} className="text-[#2EFF2E]" /> : <Copy size={11} />}
                          {copiedTemplate === t.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Holder modal */}
      <AnimatePresence>
        {selectedHolder && (
          <HolderModal
            holder={selectedHolder}
            activeMember={activeMember}
            onClose={() => setSelectedHolder(null)}
            onSaveTwitter={saveTwitter}
          />
        )}
      </AnimatePresence>

      {/* Embers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="ember absolute" style={{ left: `${12 + i * 18}%`, bottom: 0 }}
            animate={{ y: [0, -600], opacity: [0, 0.5, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.8, ease: "easeOut" }} />
        ))}
      </div>
    </div>
  );
}
