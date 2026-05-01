"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search, X, Copy, Check, ChevronDown,
  ExternalLink, TrendingUp, RefreshCw, AlertCircle
} from "lucide-react";

// ─── Team Config ──────────────────────────────────────────────────────────────
type TeamMember = "chris" | "ty" | "ronnie" | "maison";

const TEAM: { id: TeamMember; name: string; avatar: string }[] = [
  { id: "chris",  name: "Chris",  avatar: "🎯" },
  { id: "ty",     name: "Ty",     avatar: "🌊" },
  { id: "ronnie", name: "Ronny",  avatar: "⚡" },
  { id: "maison", name: "Maison", avatar: "🎨" },
];

// ─── Tier Config (for filtering only, not displayed on rows) ─────────────────
const TIER_CONFIG = {
  whale:     { label: "25+ NFTs",  color: "#FFE048", min: 25 },
  core:      { label: "10–24",     color: "#FF5F1F", min: 10 },
  solid:     { label: "5–9",       color: "#2EFF2E", min: 5  },
  collector: { label: "1–4",       color: "#888",    min: 1  },
};
type HolderTier = keyof typeof TIER_CONFIG;

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
    id: "welcome",   name: "Welcome",   emoji: "👋", color: "#2EFF2E",
    bodies: {
      chris:  "yo @{twitter} welcome to vibetown 🏙️ let's get it",
      ty:     "welcome to the city @{twitter} 🏙️ vibetown is different",
      ronnie: "@{twitter} in. welcome to vibetown 🏙️",
      maison: "@{twitter} welcome to the culture 🏙️ vibetown is alive",
    },
  },
  {
    id: "thankyou",  name: "Thank You", emoji: "🙏", color: "#FFE048",
    bodies: {
      chris:  "@{twitter} real ones don't go unnoticed 💛 appreciate you fr",
      ty:     "@{twitter} — real talk, we appreciate you. always 💛",
      ronnie: "@{twitter} straight up — thank you. means everything 💛",
      maison: "grateful for you @{twitter} — you make this real 💛",
    },
  },
  {
    id: "reactivate", name: "Re-activate", emoji: "📡", color: "#FF6B9D",
    bodies: {
      chris:  "@{twitter} vibetown's calling 📡 we ain't forgot about you",
      ty:     "@{twitter} where you been? the vibes are still here 🌊",
      ronnie: "@{twitter} it's been a minute. what's good?",
      maison: "@{twitter} the energy is still here. come back to the vibe 🌊",
    },
  },
  {
    id: "appreciation", name: "Appreciation", emoji: "👑", color: "#7C3AED",
    bodies: {
      chris:  "@{twitter} {nfts} GVCs. absolute conviction. we see you 👑",
      ty:     "@{twitter} {nfts} strong. the foundation fr",
      ronnie: "{nfts} GVCs @{twitter}. no cap, that's legendary 👑",
      maison: "@{twitter} holding {nfts} — you're the backbone",
    },
  },
  {
    id: "gift", name: "Gift Drop", emoji: "🎁", color: "#06B6D4",
    bodies: {
      chris:  "@{twitter} 👀 check your mentions. something's moving",
      ty:     "@{twitter} stay close. something good coming your way 🎁",
      ronnie: "@{twitter} 🎁 keep your eyes open",
      maison: "@{twitter} something special is headed your way 👀",
    },
  },
  {
    id: "accumulator", name: "Accumulator", emoji: "📈", color: "#2EFF2E",
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
  knownName: string;
  knownTwitter: string;
  knownDiscord: string;
}

interface Annotation {
  name: string;
  twitter: string;
  notes: string;
}

interface Holder extends RawHolder {
  annotation: Annotation;
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const LS_KEY = "gvc:crm:annotations:v2";

function loadAnnotations(): Record<string, Annotation> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
}

function saveAnnotations(map: Record<string, Annotation>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function truncate(addr: string) { return addr.slice(0, 6) + "..." + addr.slice(-4); }

function displayTwitter(h: Holder): string {
  return h.annotation.twitter || h.twitter || "";
}

function fillTemplate(body: string, h: Holder): string {
  const tw = displayTwitter(h);
  const name = h.annotation.name || tw || truncate(h.address);
  return body
    .replace(/{twitter}/g, tw || name)
    .replace(/{nfts}/g, String(h.nfts));
}

// ─── Inline Cell Editor ───────────────────────────────────────────────────────
function EditableCell({
  value,
  placeholder,
  prefix,
  onSave,
  className = "",
}: {
  value: string;
  placeholder: string;
  prefix?: string;
  onSave: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function commit() {
    onSave(draft.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 -mx-1.5">
        {prefix && <span className="text-gray-500 text-xs shrink-0">{prefix}</span>}
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setDraft(value); setEditing(false); }
          }}
          onBlur={commit}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-[#1A1A1A] border border-[#FFE048]/40 rounded-md px-2 py-0.5 text-sm text-white font-body focus:outline-none"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`group/cell text-left w-full hover:bg-[#1A1A1A] rounded-md px-1.5 py-0.5 transition-colors ${className}`}
    >
      {value ? (
        <span className="text-sm text-white font-body">
          {prefix && <span className="text-gray-500">{prefix}</span>}{value}
        </span>
      ) : (
        <span className="text-sm text-gray-600 font-body italic group-hover/cell:text-gray-400 transition-colors">
          {placeholder}
        </span>
      )}
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

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-body border transition-all ${
          selected ? "border-[#FFE048]/40 text-[#FFE048] bg-[rgba(255,224,72,0.06)]"
                   : "border-[#1F1F1F] text-gray-400 bg-[#121212] hover:border-[#333]"
        }`}>
        🎞️ {selected ? "GIF ✓" : "Add GIF"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute bottom-full mb-2 left-0 w-72 rounded-2xl bg-[#0D0D0D] border border-[#1F1F1F] p-3 z-50 shadow-2xl"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 font-body uppercase tracking-wider">GVC GIFs</span>
              {selected && <button onClick={() => { onSelect(null); setOpen(false); }} className="text-[10px] text-gray-500 hover:text-white">Clear</button>}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {GIF_LIBRARY.map(gif => (
                <button key={gif.id} onClick={() => { onSelect(gif.url); setOpen(false); }}
                  className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${selected === gif.url ? "border-[#FFE048]" : "border-transparent hover:border-[#333]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gif.url} alt={gif.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Team Dropdown ────────────────────────────────────────────────────────────
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

// ─── Message Modal ────────────────────────────────────────────────────────────
function MessageModal({ holder, activeMember, onClose }: {
  holder: Holder;
  activeMember: TeamMember;
  onClose: () => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<TeamTemplate | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tw = displayTwitter(holder);

  function copy() {
    if (!selectedTemplate) return;
    const msg = fillTemplate(selectedTemplate.bodies[activeMember], holder);
    const full = selectedGif ? `${msg}\n${selectedGif}` : msg;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#1F1F1F] bg-[#0D0D0D]"
        initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 35 }}>

        <div className="sm:hidden w-10 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="p-5 border-b border-[#1F1F1F] flex items-center justify-between">
          <div>
            <div className="font-display text-base text-white">
              {holder.annotation.name || (tw ? `@${tw}` : truncate(holder.address))}
            </div>
            <div className="text-xs text-gray-500 font-body mt-0.5">
              {holder.nfts} NFTs · #{holder.rank} holder
              {holder.isAccumulating && <span className="ml-2 text-[#2EFF2E]">+{holder.buysThisMonth} this month</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1F1F1F] text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Sending as */}
        <div className="px-5 pt-4 pb-1 flex items-center gap-2">
          <span className="text-xs text-gray-500 font-body">Sending as</span>
          <span className="text-xs font-bold text-white font-body">
            {TEAM.find(m => m.id === activeMember)?.avatar}{" "}
            {TEAM.find(m => m.id === activeMember)?.name}
          </span>
        </div>

        {/* Templates */}
        <div className="px-5 pb-4 pt-2">
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map(t => (
              <button key={t.id}
                onClick={() => { setSelectedTemplate(selectedTemplate?.id === t.id ? null : t); setSelectedGif(null); }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedTemplate?.id === t.id
                    ? "border-[#FFE048] bg-[rgba(255,224,72,0.08)]"
                    : "border-[#1F1F1F] bg-[#121212] hover:border-[#333]"
                }`}>
                <div className="text-lg mb-0.5">{t.emoji}</div>
                <div className="text-[10px] font-bold text-white font-display">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div className="mx-5 mb-5 rounded-2xl border border-[#1F1F1F] overflow-hidden"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="p-4 bg-[#121212]">
                <p className="text-sm text-white font-body leading-relaxed">
                  {fillTemplate(selectedTemplate.bodies[activeMember], holder)}
                </p>
                {selectedGif && (
                  <div className="mt-3 relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedGif} alt="gif" className="max-h-32 rounded-xl" />
                    <button onClick={() => setSelectedGif(null)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0D0D0D] border border-[#1F1F1F] flex items-center justify-center text-gray-400 hover:text-white">
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-3 border-t border-[#1F1F1F] bg-[#0D0D0D]">
                <GifPicker selected={selectedGif} onSelect={setSelectedGif} />
                <button onClick={copy}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE048] text-black text-sm font-bold hover:bg-[#FFD000] transition-all">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
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
  const [annotations, setAnnotations] = useState<Record<string, Annotation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [messagingHolder, setMessagingHolder] = useState<Holder | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [templateGifs, setTemplateGifs] = useState<Record<string, string | null>>({});

  useEffect(() => { setAnnotations(loadAnnotations()); }, []);

  async function loadHolders() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/holders");
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const anns = loadAnnotations();
      const withAnns: Holder[] = data.holders.map((h: RawHolder) => ({
        ...h,
        annotation: anns[h.address.toLowerCase()] || {
          name: h.knownName || "",
          twitter: h.knownTwitter || "",
          notes: "",
        },
      }));
      setHolders(withAnns);
      setFetchedAt(data.fetchedAt);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadHolders(); }, []);

  function updateAnnotation(address: string, field: keyof Annotation, value: string) {
    const addr = address.toLowerCase();
    const current = annotations[addr] || { name: "", twitter: "", notes: "" };
    const updated = { ...current, [field]: value };
    const newMap = { ...annotations, [addr]: updated };
    setAnnotations(newMap);
    saveAnnotations(newMap);
    setHolders(prev => prev.map(h =>
      h.address.toLowerCase() === addr ? { ...h, annotation: updated } : h
    ));
    if (messagingHolder?.address.toLowerCase() === addr) {
      setMessagingHolder(prev => prev ? { ...prev, annotation: updated } : null);
    }
  }

  const counts = useMemo(() => ({
    whale:        holders.filter(h => h.tier === "whale").length,
    core:         holders.filter(h => h.tier === "core").length,
    solid:        holders.filter(h => h.tier === "solid").length,
    collector:    holders.filter(h => h.tier === "collector").length,
    accumulating: holders.filter(h => h.isAccumulating).length,
    unknown:      holders.filter(h => !h.annotation.name && !displayTwitter(h)).length,
  }), [holders]);

  const filtered = useMemo(() => {
    let list = holders;
    if (tierFilter === "accumulating") list = list.filter(h => h.isAccumulating);
    else if (tierFilter === "unknown") list = list.filter(h => !h.annotation.name && !displayTwitter(h));
    else if (tierFilter !== "all") list = list.filter(h => h.tier === tierFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(h =>
        h.annotation.name.toLowerCase().includes(q) ||
        h.annotation.twitter.toLowerCase().includes(q) ||
        h.annotation.notes.toLowerCase().includes(q) ||
        h.twitter.toLowerCase().includes(q) ||
        h.ens.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [holders, tierFilter, search]);

  const identified = holders.filter(h => h.annotation.name || displayTwitter(h)).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(/grid.svg)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#1F1F1F] bg-[#050505]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
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
                className={`px-4 sm:px-5 py-1.5 rounded-lg text-xs font-bold font-body capitalize transition-all ${
                  tab === t ? "bg-[#FFE048] text-black" : "text-gray-400 hover:text-white"
                }`}>
                {t === "holders" ? "Holders" : "Templates"}
              </button>
            ))}
          </nav>
          <TeamDropdown active={activeMember} onChange={setActiveMember} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ── Holders Tab ─────────────────────────────────────────────── */}
          {tab === "holders" && (
            <motion.div key="holders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Page header */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl text-shimmer mb-1">Top 100 Holders</h1>
                  <p className="text-gray-400 font-body text-sm">
                    {identified} of {holders.length} identified
                    {fetchedAt && <span className="ml-2 text-gray-600">· {new Date(fetchedAt).toLocaleTimeString()}</span>}
                  </p>
                </div>
                <button onClick={loadHolders} disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121212] border border-[#1F1F1F] text-gray-400 hover:text-white text-xs font-body transition-all disabled:opacity-40">
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {([
                  { key: "all",          label: "All",            count: holders.length },
                  { key: "whale",        label: "25+ NFTs",       count: counts.whale },
                  { key: "core",         label: "10–24",          count: counts.core },
                  { key: "solid",        label: "5–9",            count: counts.solid },
                  { key: "collector",    label: "1–4",            count: counts.collector },
                  { key: "accumulating", label: "Accumulating",   count: counts.accumulating },
                  { key: "unknown",      label: "Not Identified", count: counts.unknown },
                ] as { key: TierFilter; label: string; count: number }[]).map(f => (
                  <button key={f.key} onClick={() => setTierFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-body transition-all ${
                      tierFilter === f.key
                        ? "bg-[#FFE048] text-black"
                        : "bg-[#121212] border border-[#1F1F1F] text-gray-400 hover:border-[#333] hover:text-white"
                    }`}>
                    {f.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tierFilter === f.key ? "bg-black/20" : "bg-[#1F1F1F]"}`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search name, Twitter, notes, wallet..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121212] border border-[#1F1F1F] text-sm text-white placeholder-gray-600 font-body focus:outline-none focus:border-[#FFE048]/40 transition-colors" />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body mb-4">
                  <AlertCircle size={14} />{error}
                </div>
              )}

              {/* Table */}
              {loading ? (
                <div className="space-y-px rounded-2xl overflow-hidden border border-[#1F1F1F]">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-14 bg-[#121212] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#1F1F1F] overflow-hidden">
                  {/* Column headers */}
                  <div className="grid grid-cols-[40px_1fr_1fr_1fr_80px_100px_44px] gap-0 bg-[#0D0D0D] border-b border-[#1F1F1F] px-4 py-2.5">
                    {["#", "Name", "Twitter / X", "Notes", "NFTs", "30d Buys", ""].map((col, i) => (
                      <div key={i} className="text-[10px] font-bold text-gray-600 font-body uppercase tracking-wider">
                        {col}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {filtered.map((h, i) => {
                    const tw = displayTwitter(h);
                    const tierColor = TIER_CONFIG[h.tier].color;
                    return (
                      <div
                        key={h.address}
                        className={`grid grid-cols-[40px_1fr_1fr_1fr_80px_100px_44px] items-center gap-0 px-4 py-3 hover:bg-[#0F0F0F] transition-colors ${
                          i < filtered.length - 1 ? "border-b border-[#141414]" : ""
                        }`}
                      >
                        {/* Rank */}
                        <div className="text-xs font-bold font-body tabular-nums"
                          style={{ color: h.rank <= 10 ? tierColor : "#444" }}>
                          {h.rank}
                        </div>

                        {/* Name (editable) */}
                        <div className="pr-3">
                          <EditableCell
                            value={h.annotation.name}
                            placeholder="Add name..."
                            onSave={v => updateAnnotation(h.address, "name", v)}
                          />
                        </div>

                        {/* Twitter (editable) */}
                        <div className="pr-3">
                          <div className="flex items-center gap-1">
                            <EditableCell
                              value={h.annotation.twitter || h.twitter}
                              placeholder="Add @handle..."
                              prefix="@"
                              onSave={v => updateAnnotation(h.address, "twitter", v.replace(/^@/, ""))}
                            />
                            {tw && (
                              <a href={`https://x.com/${tw}`} target="_blank" rel="noopener noreferrer"
                                className="text-gray-600 hover:text-[#1DA1F2] transition-colors shrink-0 ml-1"
                                onClick={e => e.stopPropagation()}>
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Notes (editable) */}
                        <div className="pr-3">
                          <EditableCell
                            value={h.annotation.notes}
                            placeholder="Add notes..."
                            onSave={v => updateAnnotation(h.address, "notes", v)}
                            className="text-gray-400"
                          />
                        </div>

                        {/* NFT count */}
                        <div className="text-sm font-bold font-display tabular-nums" style={{ color: tierColor }}>
                          {h.nfts}
                        </div>

                        {/* Accumulating */}
                        <div>
                          {h.isAccumulating ? (
                            <span className="flex items-center gap-1 text-[#2EFF2E] text-xs font-bold font-body">
                              <TrendingUp size={11} />
                              +{h.buysThisMonth}
                            </span>
                          ) : (
                            <span className="text-gray-700 text-xs font-body">—</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setMessagingHolder(h)}
                            className="p-1.5 rounded-lg hover:bg-[#1F1F1F] text-gray-600 hover:text-white transition-colors"
                            title="Send message">
                            ✉️
                          </button>
                          <a href={`https://etherscan.io/address/${h.address}`}
                            target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-[#1F1F1F] text-gray-600 hover:text-white transition-colors"
                            title="View on Etherscan">
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    );
                  })}

                  {filtered.length === 0 && (
                    <div className="py-16 text-center text-gray-600 font-body text-sm">
                      No holders match your filter.
                    </div>
                  )}
                </div>
              )}

              {/* Footer hint */}
              {!loading && holders.length > 0 && (
                <p className="text-xs text-gray-600 font-body mt-3 text-center">
                  Click any Name, Twitter, or Notes cell to edit · saves automatically
                </p>
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
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map(t => {
                  const gif = templateGifs[t.id] ?? null;
                  return (
                    <div key={t.id} className="rounded-2xl border border-[#1F1F1F] bg-[#121212] overflow-hidden hover:border-[#333] transition-all">
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
                        {gif && (
                          <div className="mt-3 relative inline-block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={gif} alt="gif" className="max-h-24 rounded-xl" />
                            <button onClick={() => setTemplateGifs(p => ({ ...p, [t.id]: null }))}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0D0D0D] border border-[#1F1F1F] flex items-center justify-center text-gray-400 hover:text-white">
                              <X size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="px-4 pb-4 flex items-center gap-2 border-t border-[#1A1A1A] pt-3">
                        <GifPicker selected={gif} onSelect={url => setTemplateGifs(p => ({ ...p, [t.id]: url }))} />
                        <button
                          onClick={() => {
                            const msg = t.bodies[activeMember];
                            navigator.clipboard.writeText(gif ? `${msg}\n${gif}` : msg);
                            setCopiedTemplate(t.id);
                            setTimeout(() => setCopiedTemplate(null), 2000);
                          }}
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F1F1F] text-gray-300 text-xs font-bold hover:bg-[#2a2a2a] transition-all">
                          {copiedTemplate === t.id ? <Check size={11} className="text-[#2EFF2E]" /> : <Copy size={11} />}
                          {copiedTemplate === t.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Message modal */}
      <AnimatePresence>
        {messagingHolder && (
          <MessageModal
            holder={messagingHolder}
            activeMember={activeMember}
            onClose={() => setMessagingHolder(null)}
          />
        )}
      </AnimatePresence>

      {/* Embers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} className="ember absolute" style={{ left: `${15 + i * 22}%`, bottom: 0 }}
            animate={{ y: [0, -600], opacity: [0, 0.4, 0] }}
            transition={{ duration: 9 + i * 2, repeat: Infinity, delay: i * 2, ease: "easeOut" }} />
        ))}
      </div>
    </div>
  );
}
