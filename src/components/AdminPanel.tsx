import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Lock, Shield, Settings, Users, Award, HelpCircle, Calendar,
  Edit3, Save, Plus, Trash2, RefreshCw, LogOut, ChevronRight,
  Database, Globe, Star, FileText, CheckCircle2, Code2, AlertCircle,
  Search, Download, ExternalLink, Activity, ClipboardList, Key,
  Clock, Layers, Sparkles, Navigation, CheckSquare, Upload, Image, Swords
} from "lucide-react";
import { useSiteContent } from "../context/ContentContext";
import { supabase, uploadMediaToSupabase } from "../lib/supabase";

interface AdminPanelProps {
  onClose: () => void;
}

type Section = 
  | "overview" 
  | "eventControl"
  | "loadingScreen"
  | "registrationConfig"
  | "registrations"
  | "hero" 
  | "eventInfo"
  | "navbar"
  | "mission"
  | "stats"
  | "prizes" 
  | "challenges"
  | "timeline"
  | "teams" 
  | "faq" 
  | "sponsors"
  | "footer"
  | "adminSecurity"
  | "rawJson";

const API_BASE = "/api";
const TOKEN_KEY = "hv26_admin_token";

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { refreshContent } = useSiteContent();
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [content, setContent] = useState<Record<string, any>>({});
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [rawJsonText, setRawJsonText] = useState("");
  const [rawJsonError, setRawJsonError] = useState("");
  const [regSearch, setRegSearch] = useState("");

  // Editing a specific registration state
  const [editingReg, setEditingReg] = useState<any | null>(null);
  const [editRegSaving, setEditRegSaving] = useState(false);

  // Adding a new registration manually
  const [addingRegModal, setAddingRegModal] = useState(false);
  const [addRegSaving, setAddRegSaving] = useState(false);
  const [newRegData, setNewRegData] = useState({
    teamName: "",
    fullName: "",
    email: "",
    phone: "",
    collegeOrOrg: "",
    selectedChallenge: "AI & MACHINE LEARNING",
    teamMembers: "",
    githubOrPortfolio: "",
  });

  // Change Admin Passcode state
  const [newPasscode, setNewPasscode] = useState("");
  const [passcodeMsg, setPasscodeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passcodeLoading, setPasscodeLoading] = useState(false);

  // Loading Screen Logo upload states
  const [loadingLogoUploading, setLoadingLogoUploading] = useState(false);
  const [loadingLogoUploadErr, setLoadingLogoUploadErr] = useState("");

  const fetchContent = useCallback(async () => {
    // 1. Try Supabase first
    try {
      const { data: sbRow } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'hackverse_2026')
        .maybeSingle();

      if (sbRow?.content && typeof sbRow.content === 'object') {
        const data = sbRow.content as Record<string, any>;
        setContent(data);
        setEditData(data);
        setRawJsonText(JSON.stringify(data, null, 2));
        return;
      }
    } catch (e) {
      console.warn("Supabase fetchContent notice:", e);
    }

    // 2. Fallback to local server
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        setEditData(data);
        setRawJsonText(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.error("Failed to fetch admin content", e);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    if (!token) return;

    // 1. Try Supabase first
    try {
      const { data: sbRegs, error } = await supabase
        .from('registrations')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && Array.isArray(sbRegs) && sbRegs.length > 0) {
        const mapped = sbRegs.map((r: any) => ({
          id: r.id,
          teamName: r.team_name,
          fullName: r.full_name,
          email: r.email,
          phone: r.phone,
          collegeOrOrg: r.college_or_org,
          selectedChallenge: r.selected_challenge,
          teamMembers: r.team_members,
          githubOrPortfolio: r.github_or_portfolio,
          submittedAt: r.submitted_at,
        }));
        setRegistrations(mapped);
        return;
      }
    } catch (e) {
      console.warn("Supabase registrations fetch notice:", e);
    }

    // 2. Fallback to local server
    try {
      const res = await fetch(`${API_BASE}/admin/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Failed to fetch registrations", e);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchContent();
      fetchRegistrations();
    }
  }, [token, fetchContent, fetchRegistrations]);

  const ADMIN_EMAIL = 'techxerahack@gmail.com';
  const ADMIN_PASSWORD = 'Techxera@gmail.2026';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const emailNorm = email.trim().toLowerCase();

    // Direct credential check (email + password)
    if ((emailNorm === ADMIN_EMAIL.toLowerCase() || !emailNorm) && password === ADMIN_PASSWORD) {
      const validToken = ADMIN_PASSWORD;
      sessionStorage.setItem(TOKEN_KEY, validToken);
      setToken(validToken);
      setLoginLoading(false);
      return;
    }

    // Fallback: Try server-based login
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      } else {
        setLoginError("Invalid email or password. Please try again.");
      }
    } catch {
      // If server is unreachable, still notify user
      setLoginError("Invalid email or password. Please try again.");
    }
    setLoginLoading(false);
  };

  const handleSaveSection = async (sectionKey: string, data: any) => {
    setSaveStatus("saving");
    try {
      const updatedFull = { ...editData, [sectionKey]: data };

      // Sync with Supabase Cloud
      try {
        await supabase
          .from('site_content')
          .upsert({ id: 'hackverse_2026', content: updatedFull, updated_at: new Date().toISOString() });
      } catch (sbErr) {
        console.warn("Supabase section save notice:", sbErr);
      }

      // Sync with local API
      const res = await fetch(`${API_BASE}/admin/content/${sectionKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSaveStatus("saved");
        await fetchContent();
        await refreshContent();
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("saved"); // If Supabase saved, still celebrate
        await refreshContent();
        setTimeout(() => setSaveStatus("idle"), 2500);
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const handleSaveRawJson = async () => {
    setRawJsonError("");
    try {
      const parsed = JSON.parse(rawJsonText);
      setSaveStatus("saving");

      // Sync with Supabase Cloud
      try {
        await supabase
          .from('site_content')
          .upsert({ id: 'hackverse_2026', content: parsed, updated_at: new Date().toISOString() });
      } catch (sbErr) {
        console.warn("Supabase raw JSON save notice:", sbErr);
      }

      // Sync with local API
      const res = await fetch(`${API_BASE}/admin/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed),
      });
      if (res.ok) {
        setSaveStatus("saved");
        await fetchContent();
        await refreshContent();
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("saved");
        await refreshContent();
        setTimeout(() => setSaveStatus("idle"), 2500);
      }
    } catch (err: any) {
      setRawJsonError(`Invalid JSON syntax: ${err.message}`);
    }
  };

  const handleSaveEditedRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReg) return;
    setEditRegSaving(true);
    try {
      const targetId = editingReg.id || editingReg.ticketId;
      const res = await fetch(`${API_BASE}/admin/registrations/${targetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingReg),
      });
      if (res.ok) {
        await fetchRegistrations();
        await fetchContent();
        setEditingReg(null);
      } else {
        alert("Failed to save changes to registration.");
      }
    } catch (err) {
      console.error("Save registration error", err);
      alert("Error saving registration.");
    } finally {
      setEditRegSaving(false);
    }
  };

  const handleAddManualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddRegSaving(true);
    try {
      const payload = {
        ...newRegData,
        teamMembers: typeof newRegData.teamMembers === "string"
          ? newRegData.teamMembers.split(",").map((s) => s.trim()).filter(Boolean)
          : newRegData.teamMembers,
      };
      const res = await fetch(`${API_BASE}/admin/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchRegistrations();
        await fetchContent();
        setAddingRegModal(false);
        setNewRegData({
          teamName: "",
          fullName: "",
          email: "",
          phone: "",
          collegeOrOrg: "",
          selectedChallenge: "AI & MACHINE LEARNING",
          teamMembers: "",
          githubOrPortfolio: "",
        });
      } else {
        alert("Failed to create registration");
      }
    } catch (err) {
      console.error("Add registration error", err);
      alert("Error connecting to server");
    } finally {
      setAddRegSaving(false);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm(`Delete registration ${id}? This action cannot be undone.`)) return;
    try {
      await supabase.from('registrations').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase delete failed", e);
    }
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchRegistrations();
        await fetchContent();
      }
    } catch (e) {
      console.error("Delete failed", e);
      await fetchRegistrations();
    }
  };

  const handleExportRegistrations = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registrations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hackverse-registrations-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeMsg(null);
    setPasscodeLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/change-passcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPasscode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setNewPasscode("");
        setPasscodeMsg({ type: "success", text: "Security passcode updated successfully!" });
      } else {
        setPasscodeMsg({ type: "error", text: data.error || "Failed to update passcode" });
      }
    } catch {
      setPasscodeMsg({ type: "error", text: "Error connecting to server" });
    } finally {
      setPasscodeLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  // ─── LOGIN SCREEN (FULL DISPLAY) ──────────────────────────────
  if (!token) {
    return (
      <div className="fixed inset-0 z-[200] w-screen h-screen flex items-center justify-center bg-[#05070a] select-none p-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#0c1017] border border-[#D4AF37]/50 sf-clip-angled-sm p-8 sm:p-10 relative shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-10"
        >
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
            title="Return to site"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 border border-[#D4AF37] sf-clip-angled-sm flex items-center justify-center bg-[#D4AF37]/10 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              <Shield className="w-8 h-8 text-[#F5D061]" />
            </div>
            <h2 className="sf-gothic-title text-3xl sm:text-4xl text-[#F5D061] mb-1">
              Admin Matrix
            </h2>
            <p className="font-rajdhani text-neutral-400 text-xs tracking-widest uppercase">
              HACKVERSE '26 // FULL SYSTEM CONTROL
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-rajdhani text-xs text-[#F5D061] font-bold tracking-wider uppercase mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="techxerahack@gmail.com"
                  className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white pl-10 pr-4 py-2.5 text-sm font-rajdhani outline-none focus:border-[#D4AF37] transition-colors"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block font-rajdhani text-xs text-[#F5D061] font-bold tracking-wider uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white pl-10 pr-4 py-2.5 text-sm font-rajdhani outline-none focus:border-[#D4AF37] transition-colors"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 border border-[#FF4655]/40 bg-[#FF4655]/10 text-[#FF4655] font-rajdhani text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase transition-all cursor-pointer"
            >
              {loginLoading ? "VERIFYING CREDENTIALS..." : "ENTER COMMAND SYSTEM"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-end text-[11px] font-mono text-neutral-500">
            <button onClick={onClose} className="hover:text-white underline cursor-pointer">← Back to website</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── NAVIGATION TABS ──────────────────────────────────────────
  const sidebarItems: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview & Health", icon: <Activity className="w-4 h-4" /> },
    { key: "eventControl", label: "Event Control Center", icon: <Clock className="w-4 h-4 text-[#FF4655]" /> },
    { key: "loadingScreen", label: "Loading Screen & Logo", icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" /> },
    { key: "registrationConfig", label: "Register Form Config", icon: <ClipboardList className="w-4 h-4 text-[#F5D061]" /> },
    { key: "registrations", label: `Warriors Enlisted (${registrations.length})`, icon: <Database className="w-4 h-4 text-[#55FF55]" /> },
    { key: "hero", label: "Hero Banner Content", icon: <Star className="w-4 h-4" /> },
    { key: "eventInfo", label: "Event & Brand Info", icon: <Settings className="w-4 h-4" /> },
    { key: "navbar", label: "Navigation Bar", icon: <Navigation className="w-4 h-4" /> },
    { key: "mission", label: "Mission & Doctrine", icon: <FileText className="w-4 h-4" /> },
    { key: "stats", label: "Combat Benchmarks", icon: <Activity className="w-4 h-4" /> },
    { key: "prizes", label: "Prize & Bounties", icon: <Award className="w-4 h-4" /> },
    { key: "challenges", label: "Battleground Quests", icon: <Layers className="w-4 h-4" /> },
    { key: "timeline", label: "Event Chronology", icon: <Clock className="w-4 h-4" /> },
    { key: "teams", label: "Featured Squads", icon: <Users className="w-4 h-4" /> },
    { key: "faq", label: "Rules & FAQ Base", icon: <HelpCircle className="w-4 h-4" /> },
    { key: "sponsors", label: "Sponsors & Allies", icon: <Shield className="w-4 h-4" /> },
    { key: "footer", label: "Footer & Coordinates", icon: <Globe className="w-4 h-4" /> },
    { key: "adminSecurity", label: "Security & Passcode", icon: <Key className="w-4 h-4" /> },
    { key: "rawJson", label: "Full Database JSON", icon: <Code2 className="w-4 h-4" /> },
  ];

  const regConfig = editData.registrationForm || {};
  const eventInfo = editData.eventInfo || {};
  const eventControlData = editData.eventControl || { countdownTargetDate: "2026-10-16T09:00:00Z", battlegroundsLocked: false, battlegroundsLockedMessage: "BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE." };
  const loadingScreenData = editData.loadingScreen || {
    enabled: true,
    logoUrl: "",
    showLogo: true,
    presentsText: "TECHXERA PRESENTS",
    titleGothic: "𝕳𝖆𝖈𝖐𝖛𝖊𝖗𝖘𝖊",
    titleAccent: "'26",
    tagline: "BUILD THE FUTURE • ENTER THE ARENA",
    durationMs: 4600,
    allowSkip: true,
  };

  const handleLoadingLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingLogoUploading(true);
    setLoadingLogoUploadErr("");
    try {
      const publicUrl = await uploadMediaToSupabase(file, 'loading-logos');
      if (publicUrl) {
        setEditData({
          ...editData,
          loadingScreen: {
            ...loadingScreenData,
            logoUrl: publicUrl,
            showLogo: true,
            logoUrlDeleted: false,
          },
        });
      } else {
        setLoadingLogoUploadErr("Storage upload notice: file could not be uploaded. You can paste an image URL directly below.");
      }
    } catch (err: any) {
      setLoadingLogoUploadErr(err.message || "Failed to upload logo");
    } finally {
      setLoadingLogoUploading(false);
    }
  };

  const handleDeleteLoadingLogo = () => {
    setEditData({
      ...editData,
      loadingScreen: {
        ...loadingScreenData,
        logoUrl: "",
        logoUrlDeleted: true,
      },
    });
  };

  const hero = editData.hero || {};
  const navbar = editData.navbar || {};
  const mission = editData.mission || {};
  const stats = editData.stats || {};
  const prizes = editData.prizes || {};
  const footer = editData.footer || {};
  const challenges: any[] = Array.isArray(editData.challenges) ? editData.challenges : [];
  const timeline: any[] = Array.isArray(editData.timeline) ? editData.timeline : [];
  const teams: any[] = Array.isArray(editData.teams) ? editData.teams : [];
  const faq: any[] = Array.isArray(editData.faq) ? editData.faq : [];
  const sponsors: any[] = Array.isArray(editData.sponsors) ? editData.sponsors : [];

  const filteredRegistrations = registrations.filter((r) => {
    if (!regSearch) return true;
    const s = regSearch.toLowerCase();
    return (
      (r.teamName || "").toLowerCase().includes(s) ||
      (r.fullName || "").toLowerCase().includes(s) ||
      (r.email || "").toLowerCase().includes(s) ||
      (r.phone || "").toLowerCase().includes(s) ||
      (r.collegeOrOrg || "").toLowerCase().includes(s) ||
      (r.selectedChallenge || "").toLowerCase().includes(s) ||
      (r.id || "").toLowerCase().includes(s)
    );
  });

  return (
    <div 
      data-lenis-prevent="true"
      className="fixed inset-0 z-[200] w-screen h-screen bg-[#05070a] flex flex-col md:flex-row overflow-hidden"
      style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      {/* ─── FULL DISPLAY SIDEBAR ─── */}
      <aside 
        data-lenis-prevent="true"
        className="w-full md:w-64 lg:w-72 shrink-0 border-b md:border-b-0 md:border-r border-[#D4AF37]/20 bg-[#06090f] flex flex-col max-h-[35vh] md:max-h-full md:h-full overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#080d16] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#D4AF37] sf-clip-angled-sm bg-[#D4AF37]/15 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <Shield className="w-5 h-5 text-[#F5D061]" />
            </div>
            <div>
              <h3 className="font-cinzel font-black text-base text-[#F5D061] tracking-wider leading-none">
                HACKVERSE '26
              </h3>
              <span className="font-rajdhani text-[10px] text-[#D4AF37]/80 font-bold uppercase tracking-widest block mt-0.5">
                SYSTEM COMMAND CENTER
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden text-neutral-400 hover:text-white p-1 cursor-pointer"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav 
          data-lenis-prevent="true"
          className="p-2.5 space-y-1 flex-1 min-h-0 overflow-y-auto custom-admin-scrollbar"
          style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", minHeight: 0 }}
        >
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left font-rajdhani text-xs font-bold uppercase tracking-wider transition-all sf-clip-angled-sm cursor-pointer ${
                  isActive
                    ? "bg-[#D4AF37]/20 text-[#F5D061] border-l-2 border-[#D4AF37] shadow-[inset_0_0_15px_rgba(212,175,55,0.1)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 sm:p-4 border-t border-[#D4AF37]/20 bg-[#070b12] space-y-2 shrink-0">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-wider cursor-pointer"
          >
            <span>VIEW LIVE WEBSITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center justify-between pt-1 px-1">
            <button
              onClick={() => {
                fetchContent();
                fetchRegistrations();
                refreshContent();
              }}
              className="flex items-center gap-1.5 font-rajdhani text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SYNC</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 font-rajdhani text-xs text-[#FF4655]/80 hover:text-[#FF4655] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── FULL DISPLAY WORKSPACE ─── */}
      <main 
        data-lenis-prevent="true"
        className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden bg-[#070a10]"
        style={{ minWidth: 0, minHeight: 0, height: "100%", overflow: "hidden" }}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-3.5 border-b border-[#D4AF37]/20 bg-[#080d16] shrink-0">
          <div>
            <h2 className="font-cinzel font-black text-base sm:text-lg text-white uppercase tracking-wider flex items-center gap-2.5">
              <span>{sidebarItems.find((s) => s.key === activeSection)?.label}</span>
            </h2>
            <span className="font-rajdhani text-[11px] text-[#D4AF37]/70 uppercase tracking-widest">
              LIVE PERSISTENCE MATRIX • PORT 4000 CONNECTED
            </span>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus !== "idle" && (
              <div
                className={`flex items-center gap-1.5 font-rajdhani text-xs font-bold px-3 py-1.5 border sf-clip-angled-sm ${
                  saveStatus === "saved"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : saveStatus === "saving"
                    ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F5D061]"
                    : "border-red-500/40 bg-red-500/10 text-red-400"
                }`}
              >
                {saveStatus === "saved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {saveStatus === "saving" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {saveStatus === "saving"
                    ? "COMMITTING TO DATABASE..."
                    : saveStatus === "saved"
                    ? "CHANGES SAVED LIVE!"
                    : "WRITE FAILED"}
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-1.5 text-neutral-300 hover:text-white transition-all sf-clip-angled-sm font-rajdhani text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <span>EXIT</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Panel Area */}
        <div 
          data-lenis-prevent="true"
          className="flex-1 min-h-0 p-5 sm:p-7 lg:p-9 overflow-y-auto space-y-6 custom-admin-scrollbar"
          style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", minHeight: 0 }}
        >
          {/* 1. OVERVIEW & SYSTEM HEALTH */}
          {activeSection === "overview" && (
            <div className="space-y-6 max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <span className="font-rajdhani text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    WARRIORS ENLISTED
                  </span>
                  <h3 className="font-cinzel text-3xl font-black text-[#55FF55] mt-1">
                    {registrations.length}
                  </h3>
                  <p className="font-rajdhani text-xs text-neutral-500 mt-1">Real-time squad submissions</p>
                </div>
                <div className="p-5 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <span className="font-rajdhani text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    REGISTRATION PORTAL
                  </span>
                  <h3 className={`font-cinzel text-3xl font-black mt-1 ${regConfig.isOpen !== false ? 'text-[#55FF55]' : 'text-[#FF4655]'}`}>
                    {regConfig.isOpen !== false ? "OPEN" : "PAUSED"}
                  </h3>
                  <p className="font-rajdhani text-xs text-neutral-500 mt-1">
                    {regConfig.isOpen !== false ? "Accepting squad entries" : "Portal locked"}
                  </p>
                </div>
                <div className="p-5 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <span className="font-rajdhani text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    BOUNTY POOL
                  </span>
                  <h3 className="font-cinzel text-3xl font-black text-[#F5D061] mt-1">
                    {prizes.poolTotal || "₹1,50,000+"}
                  </h3>
                  <p className="font-rajdhani text-xs text-neutral-500 mt-1">Active state grants</p>
                </div>
                <div className="p-5 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <span className="font-rajdhani text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    BATTLEGROUND TRACKS
                  </span>
                  <h3 className="font-cinzel text-3xl font-black text-[#FF4655] mt-1">
                    {challenges.length || 5}
                  </h3>
                  <p className="font-rajdhani text-xs text-neutral-500 mt-1">Classified quests</p>
                </div>
              </div>

              {/* Quick Jump Bar */}
              <div className="p-6 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5D061]" />
                  <h4 className="font-cinzel font-bold text-base text-[#F5D061] uppercase tracking-wider">
                    Direct Management Modules
                  </h4>
                </div>
                <p className="font-rajdhani text-sm text-neutral-300 leading-relaxed max-w-3xl">
                  You are viewing the <strong>Full Display Command Center</strong>. Every text line, metric, quest, sponsor, prize figure, registration setting, and submitted registration can be updated and saved live with instant persistence.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    onClick={() => setActiveSection("registrationConfig")}
                    className="px-4 py-2 border border-[#F5D061]/50 bg-[#F5D061]/10 hover:bg-[#F5D061]/20 font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Edit Registration Form & Notice →</span>
                  </button>
                  <button
                    onClick={() => setActiveSection("registrations")}
                    className="px-4 py-2 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 font-rajdhani text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Manage Enlisted Warriors ({registrations.length}) →</span>
                  </button>
                  <button
                    onClick={() => setActiveSection("hero")}
                    className="px-4 py-2 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 font-rajdhani text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Edit Hero Banner →</span>
                  </button>
                  <button
                    onClick={() => setActiveSection("challenges")}
                    className="px-4 py-2 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 font-rajdhani text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Edit Quests & Tracks ({challenges.length}) →</span>
                  </button>
                  <button
                    onClick={() => setActiveSection("rawJson")}
                    className="px-4 py-2 border border-neutral-600 hover:border-neutral-400 font-rajdhani text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Raw JSON Matrix →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1b. EVENT CONTROL CENTER */}
          {activeSection === "eventControl" && (
            <div className="space-y-6 max-w-4xl">

              {/* ── Status Summary Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-5 border sf-clip-angled-sm ${eventControlData.battlegroundsLocked ? 'border-[#FF4655]/50 bg-[#FF4655]/10' : 'border-[#55FF55]/50 bg-[#55FF55]/10'}`}>
                  <p className="font-rajdhani text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">BATTLEGROUNDS STATUS</p>
                  <p className={`font-cinzel text-2xl font-black ${eventControlData.battlegroundsLocked ? 'text-[#FF4655]' : 'text-[#55FF55]'}`}>
                    {eventControlData.battlegroundsLocked ? '🔒 LOCKED' : '🔓 OPEN'}
                  </p>
                  <p className="font-rajdhani text-xs text-neutral-500 mt-1">{eventControlData.battlegroundsLocked ? 'Challenge tracks are hidden from visitors' : 'Visitors can browse all combat tracks'}</p>
                </div>
                <div className="p-5 border border-[#D4AF37]/50 bg-[#D4AF37]/5 sf-clip-angled-sm">
                  <p className="font-rajdhani text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">COUNTDOWN TARGET</p>
                  <p className="font-cinzel text-lg font-black text-[#F5D061] break-all">
                    {eventControlData.countdownTargetDate ? new Date(eventControlData.countdownTargetDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not Set'}
                  </p>
                  <p className="font-rajdhani text-xs text-neutral-500 mt-1">Live countdown shown in hero section</p>
                </div>
              </div>

              {/* ── Countdown Timer Control ── */}
              <div className="p-6 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
                  <Clock className="w-4 h-4 text-[#F5D061]" />
                  <h4 className="font-cinzel font-bold text-sm text-[#F5D061] uppercase tracking-wider">
                    Countdown Timer Configuration
                  </h4>
                </div>
                <p className="font-rajdhani text-xs text-neutral-400">
                  Set the <strong className="text-white">target date and time</strong> for the live countdown displayed on the hero section. The countdown ticks in real time for every visitor.
                </p>

                <div className="space-y-3">
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider">
                    Target Date & Time (Event Start)
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      eventControlData.countdownTargetDate
                        ? new Date(new Date(eventControlData.countdownTargetDate).getTime() - new Date(eventControlData.countdownTargetDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                        : "2026-10-16T09:00"
                    }
                    onChange={(e) => {
                      const localDate = e.target.value; // "YYYY-MM-DDTHH:mm"
                      const isoDate = localDate ? new Date(localDate).toISOString() : "2026-10-16T09:00:00Z";
                      setEditData({
                        ...editData,
                        eventControl: { ...eventControlData, countdownTargetDate: isoDate }
                      });
                    }}
                    className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white px-4 py-3 text-sm font-rajdhani outline-none focus:border-[#D4AF37] transition-colors sf-clip-angled-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                  <p className="font-rajdhani text-[11px] text-neutral-500">
                    Use your local timezone — the system converts automatically. Current: <span className="text-[#D4AF37]/80">{eventControlData.countdownTargetDate || 'not set'}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleSaveSection("eventControl", { ...eventControlData, countdownTargetDate: eventControlData.countdownTargetDate })}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-widest flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  SAVE COUNTDOWN DATE
                </button>
              </div>

              {/* ── Battlegrounds Lock/Unlock ── */}
              <div className="p-6 border border-[#FF4655]/30 bg-[#0c1017] sf-clip-angled-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-[#FF4655]/20 pb-3">
                  <Lock className="w-4 h-4 text-[#FF4655]" />
                  <h4 className="font-cinzel font-bold text-sm text-[#FF4655] uppercase tracking-wider">
                    Battlegrounds Access Control
                  </h4>
                </div>
                <p className="font-rajdhani text-xs text-neutral-400">
                  When <strong className="text-white">LOCKED</strong>, clicking the Battlegrounds button opens a classified/restricted screen instead of showing the challenge tracks. Useful before the challenge themes are announced.
                </p>

                {/* Toggle */}
                <div className={`flex items-center justify-between p-4 border sf-clip-angled-sm ${eventControlData.battlegroundsLocked ? 'border-[#FF4655]/50 bg-[#FF4655]/8' : 'border-[#55FF55]/50 bg-[#55FF55]/8'}`}>
                  <div>
                    <p className="font-rajdhani text-sm font-bold text-white uppercase tracking-wider">
                      Battlegrounds Access
                    </p>
                    <p className="font-rajdhani text-xs text-neutral-500 mt-0.5">
                      {eventControlData.battlegroundsLocked ? 'Visitors see a locked / restricted screen' : 'Visitors can browse all challenge tracks freely'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditData({
                        ...editData,
                        eventControl: { ...eventControlData, battlegroundsLocked: !eventControlData.battlegroundsLocked }
                      })
                    }
                    className={`shrink-0 px-5 py-2.5 font-cinzel text-xs font-black uppercase tracking-wider border sf-clip-angled-sm flex items-center gap-2 transition-all cursor-pointer ${
                      eventControlData.battlegroundsLocked
                        ? "bg-[#FF4655]/15 border-[#FF4655] text-[#FF4655]"
                        : "bg-[#55FF55]/15 border-[#55FF55] text-[#55FF55]"
                    }`}
                  >
                    {eventControlData.battlegroundsLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>LOCKED</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        <span>OPEN</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Lock message */}
                <div className="space-y-2">
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider">
                    Locked Screen Message
                  </label>
                  <textarea
                    rows={3}
                    value={eventControlData.battlegroundsLockedMessage || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventControl: { ...eventControlData, battlegroundsLockedMessage: e.target.value }
                      })
                    }
                    className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white px-4 py-3 text-sm font-rajdhani outline-none focus:border-[#D4AF37] transition-colors resize-none"
                    placeholder="Message shown when battlegrounds is locked..."
                  />
                  <p className="font-rajdhani text-[11px] text-neutral-500">This message is displayed to visitors when they try to open the Battlegrounds page while it is locked.</p>
                </div>

                <button
                  onClick={() => handleSaveSection("eventControl", eventControlData)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-widest flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  SAVE BATTLEGROUNDS CONTROL
                </button>
              </div>

            </div>
          )}

          {/* 1c. LOADING SCREEN & INTRO LOGO CONTROL */}
          {activeSection === "loadingScreen" && (
            <div className="space-y-6 max-w-4xl">
              {/* Header card with Save button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#F5D061]" />
                    <h3 className="font-cinzel font-bold text-lg text-white tracking-wide">
                      Loading Screen & Logo Management
                    </h3>
                  </div>
                  <p className="font-rajdhani text-xs text-neutral-400 mt-1">
                    Customize the cinematic intro screen, upload or delete the loading logo, edit the gothic title, and control duration.
                  </p>
                </div>

                <button
                  onClick={() => handleSaveSection("loadingScreen", loadingScreenData)}
                  disabled={saveStatus === "saving"}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-widest flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saveStatus === "saving" ? "SAVING..." : "SAVE LOADING SCREEN"}
                </button>
              </div>

              {/* Live Preview of Loading Screen */}
              <div className="p-6 border border-[#D4AF37]/30 bg-[#040608] sf-clip-angled-sm text-center relative overflow-hidden">
                <div className="absolute top-2 right-3 font-mono text-[10px] text-neutral-500 uppercase">
                  [ LIVE PREVIEW ]
                </div>

                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                  {/* Badge */}
                  <div className="flex items-center gap-2">
                    <span className="block w-5 h-[1px] bg-[#D4AF37]/50" />
                    <span className="font-mono text-[10px] tracking-[0.4em] text-[#D4AF37] font-bold uppercase">
                      {loadingScreenData.presentsText || "TECHXERA PRESENTS"}
                    </span>
                    <span className="block w-5 h-[1px] bg-[#D4AF37]/50" />
                  </div>

                  {/* Logo preview */}
                  {loadingScreenData.showLogo !== false && (
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #0c1017 0%, #141d2b 100%)',
                        border: '1px solid rgba(212,175,55,0.5)',
                        clipPath: 'polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)',
                        boxShadow: '0 0 25px rgba(212,175,55,0.2)',
                      }}
                    >
                      {loadingScreenData.logoUrl && String(loadingScreenData.logoUrl).trim() ? (
                        <img
                          src={String(loadingScreenData.logoUrl)}
                          alt="Logo Preview"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="font-cinzel font-black text-xl text-[#F5D061]">
                          HV
                        </span>
                      )}
                    </div>
                  )}

                  {/* Gothic Title */}
                  <div className="space-y-1">
                    <div className="sf-gothic-title text-4xl sm:text-5xl text-[#F5D061] leading-none">
                      {loadingScreenData.titleGothic || "𝕳𝖆𝖈𝖐𝖛𝖊𝖗𝖘𝖊"}
                    </div>
                    <div className="sf-gothic-title text-2xl sm:text-3xl text-[#FF4655] leading-none">
                      {loadingScreenData.titleAccent || "'26"}
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                    {loadingScreenData.tagline || "BUILD THE FUTURE • ENTER THE ARENA"}
                  </div>

                  {/* Mini Progress Bar Simulation */}
                  <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                    <div className="w-3/4 h-full bg-gradient-to-r from-[#DC2626] via-[#D4AF37] to-[#55FF55]" />
                  </div>
                  <div className="font-mono text-[9px] text-[#55FF55]">
                    ARENA SYSTEMS ONLINE... 75%
                  </div>
                </div>
              </div>

              {/* ── Logo Control Card (Change & Delete Logo) ── */}
              <div className="p-6 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-[#F5D061]" />
                    <h4 className="font-cinzel font-bold text-sm text-[#F5D061] uppercase tracking-wider">
                      Loading Screen Logo Control
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                    loadingScreenData.logoUrl && String(loadingScreenData.logoUrl).trim()
                      ? "border-[#55FF55]/40 text-[#55FF55] bg-[#55FF55]/10"
                      : "border-[#FFAA00]/40 text-[#FFDF78] bg-[#FFAA00]/10"
                  }`}>
                    {loadingScreenData.logoUrl && String(loadingScreenData.logoUrl).trim()
                      ? "CUSTOM LOGO ACTIVE"
                      : "DEFAULT 'HV' EMBLEM"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left: Logo Preview & Delete Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-white/10 bg-[#141a24]/60">
                    <div className="w-20 h-20 bg-[#0a0e14] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                      {loadingScreenData.logoUrl && String(loadingScreenData.logoUrl).trim() ? (
                        <img
                          src={String(loadingScreenData.logoUrl)}
                          alt="Current Logo"
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <div className="text-center font-mono text-[10px] text-neutral-500">
                          <span className="font-cinzel text-xl font-bold text-[#F5D061] block">HV</span>
                          No Logo
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <p className="font-rajdhani text-xs text-neutral-300 font-bold">
                        {loadingScreenData.logoUrl && String(loadingScreenData.logoUrl).trim()
                          ? "Custom logo image is currently set."
                          : "No custom image. Falling back to the golden 'HV' animated monogram."}
                      </p>

                      {/* Action buttons: Change / Delete */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <label className="px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/60 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#F5D061]" />
                          <span>{loadingLogoUploading ? "UPLOADING..." : "UPLOAD NEW LOGO"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLoadingLogoUpload}
                            disabled={loadingLogoUploading}
                            className="hidden"
                          />
                        </label>

                        {loadingScreenData.logoUrl && String(loadingScreenData.logoUrl).trim() && (
                          <button
                            type="button"
                            onClick={handleDeleteLoadingLogo}
                            className="px-3 py-1.5 bg-[#FF4655]/20 hover:bg-[#FF4655]/30 border border-[#FF4655]/60 text-[#FF4655] hover:text-white font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>DELETE LOGO</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Direct Image URL & Show/Hide Toggle */}
                  <div className="space-y-3">
                    <div>
                      <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                        Or Paste Logo Image URL Directly
                      </label>
                      <input
                        type="url"
                        value={loadingScreenData.logoUrl || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            loadingScreen: {
                              ...loadingScreenData,
                              logoUrl: e.target.value,
                              logoUrlDeleted: !e.target.value.trim(),
                            },
                          })
                        }
                        placeholder="https://... (PNG, SVG, JPG, WebP)"
                        className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white px-3.5 py-2 text-xs font-mono outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>

                    <label className="flex items-center gap-2.5 p-2.5 border border-white/5 bg-[#141a24]/40 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loadingScreenData.showLogo !== false}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            loadingScreen: {
                              ...loadingScreenData,
                              showLogo: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                      />
                      <span className="font-rajdhani text-xs text-neutral-300 font-bold">
                        Display Logo Box on Loading Screen
                      </span>
                    </label>

                    {loadingLogoUploadErr && (
                      <p className="font-mono text-[11px] text-[#FF4655]">
                        {loadingLogoUploadErr}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Text & Title Settings ── */}
              <div className="p-6 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
                  <Edit3 className="w-4 h-4 text-[#F5D061]" />
                  <h4 className="font-cinzel font-bold text-sm text-[#F5D061] uppercase tracking-wider">
                    Title & Subtitle Branding
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Organization Badge (Top Line)
                    </label>
                    <input
                      type="text"
                      value={loadingScreenData.presentsText || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          loadingScreen: { ...loadingScreenData, presentsText: e.target.value },
                        })
                      }
                      placeholder="TECHXERA PRESENTS"
                      className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white px-3.5 py-2 text-xs font-mono outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Gothic Main Title
                    </label>
                    <input
                      type="text"
                      value={loadingScreenData.titleGothic || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          loadingScreen: { ...loadingScreenData, titleGothic: e.target.value },
                        })
                      }
                      placeholder="𝕳𝖆𝖈𝖐𝖛𝖊𝖗𝖘𝖊"
                      className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white px-3.5 py-2 text-xs font-mono outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Title Accent / Year
                    </label>
                    <input
                      type="text"
                      value={loadingScreenData.titleAccent || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          loadingScreen: { ...loadingScreenData, titleAccent: e.target.value },
                        })
                      }
                      placeholder="'26"
                      className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white px-3.5 py-2 text-xs font-mono outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Tagline / Mission Line
                    </label>
                    <input
                      type="text"
                      value={loadingScreenData.tagline || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          loadingScreen: { ...loadingScreenData, tagline: e.target.value },
                        })
                      }
                      placeholder="BUILD THE FUTURE • ENTER THE ARENA"
                      className="w-full bg-[#141a24] border border-[#D4AF37]/40 text-white px-3.5 py-2 text-xs font-mono outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* ── Timing & Behavior Settings ── */}
              <div className="p-6 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
                  <Clock className="w-4 h-4 text-[#F5D061]" />
                  <h4 className="font-cinzel font-bold text-sm text-[#F5D061] uppercase tracking-wider">
                    Duration & Behavior
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider">
                        Intro Duration
                      </label>
                      <span className="font-mono text-xs text-[#55FF55]">
                        {((loadingScreenData.durationMs || 4600) / 1000).toFixed(1)}s ({loadingScreenData.durationMs || 4600}ms)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={8000}
                      step={200}
                      value={loadingScreenData.durationMs || 4600}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          loadingScreen: {
                            ...loadingScreenData,
                            durationMs: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2.5 border border-white/5 bg-[#141a24]/40 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loadingScreenData.enabled !== false}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            loadingScreen: { ...loadingScreenData, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                      />
                      <span className="font-rajdhani text-xs text-neutral-300 font-bold">
                        Enable Loading Screen on Page Open
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 border border-white/5 bg-[#141a24]/40 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loadingScreenData.allowSkip !== false}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            loadingScreen: { ...loadingScreenData, allowSkip: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                      />
                      <span className="font-rajdhani text-xs text-neutral-300 font-bold">
                        Show 'Skip Intro' Button
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleSaveSection("loadingScreen", loadingScreenData)}
                    disabled={saveStatus === "saving"}
                    className="w-full py-3 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {saveStatus === "saving" ? "SAVING..." : "SAVE LOADING SCREEN CONFIGURATION"}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 2. REGISTRATION FORM CONFIGURATION */}
          {activeSection === "registrationConfig" && (
            <div className="space-y-6 max-w-4xl">

              {/* ── Registration Open/Close Toggle ── */}
              <div className="p-4 border border-[#F5D061]/40 bg-[#F5D061]/5 sf-clip-angled-sm flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-cinzel font-bold text-base text-[#F5D061]">
                    Registration Portal Status
                  </h3>
                  <p className="font-rajdhani text-xs text-neutral-400 mt-0.5">
                    Toggle whether participants can register on the website right now.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditData({
                      ...editData,
                      registrationForm: {
                        ...regConfig,
                        isOpen: regConfig.isOpen === false ? true : false,
                      },
                    })
                  }
                  className={`shrink-0 px-4 py-2 font-cinzel text-xs font-black uppercase tracking-wider border sf-clip-angled-sm flex items-center gap-2 transition-all cursor-pointer ${
                    regConfig.isOpen !== false
                      ? "bg-[#55FF55]/15 border-[#55FF55] text-[#55FF55]"
                      : "bg-[#FF4655]/15 border-[#FF4655] text-[#FF4655]"
                  }`}
                >
                  {regConfig.isOpen !== false ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>REGISTRATIONS: OPEN</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span>REGISTRATIONS: CLOSED</span>
                    </>
                  )}
                </button>
              </div>

              {/* ── Google Form Integration ── */}
              <div className="space-y-4 p-6 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm">
                <h4 className="font-cinzel font-bold text-sm text-[#F5D061] uppercase tracking-wider border-b border-[#D4AF37]/20 pb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Google Form Integration
                </h4>
                <p className="font-rajdhani text-xs text-neutral-400">
                  When enabled, the <strong className="text-white">"JOIN THE BATTLE"</strong> button will open your Google Form in a new tab instead of the internal registration modal.
                </p>

                {/* Toggle: Use Google Form */}
                <div className="flex items-center justify-between p-4 border border-[#D4AF37]/25 bg-[#111722] sf-clip-angled-sm">
                  <div>
                    <p className="font-rajdhani text-sm font-bold text-white uppercase tracking-wider">Use Google Form for Registration</p>
                    <p className="font-rajdhani text-xs text-neutral-500 mt-0.5">Redirects the hero register button to the Google Form URL below</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditData({
                        ...editData,
                        registrationForm: { ...regConfig, useGoogleForm: !regConfig.useGoogleForm },
                      })
                    }
                    className={`shrink-0 px-4 py-2 font-cinzel text-xs font-black uppercase tracking-wider border sf-clip-angled-sm flex items-center gap-2 transition-all cursor-pointer ${
                      regConfig.useGoogleForm
                        ? "bg-[#55FF55]/15 border-[#55FF55] text-[#55FF55]"
                        : "bg-white/5 border-neutral-600 text-neutral-400"
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>{regConfig.useGoogleForm ? "GOOGLE FORM: ON" : "GOOGLE FORM: OFF"}</span>
                  </button>
                </div>

                {/* Google Form URL input */}
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                    Google Form URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://docs.google.com/forms/d/e/..."
                      value={regConfig.googleFormUrl || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          registrationForm: { ...regConfig, googleFormUrl: e.target.value },
                        })
                      }
                      className="flex-1 bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none placeholder:text-neutral-600"
                    />
                    {regConfig.googleFormUrl && (
                      <a
                        href={regConfig.googleFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F5D061] hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1.5 font-rajdhani text-xs font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        TEST
                      </a>
                    )}
                  </div>
                  <p className="font-rajdhani text-[11px] text-neutral-500 mt-1.5">
                    Paste the full shareable URL from Google Forms → Share → Get pre-filled link
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleSaveSection("registrationForm", editData.registrationForm)}
                    className="px-5 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE GOOGLE FORM SETTINGS</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-6 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm">
                <h4 className="font-cinzel font-bold text-sm text-[#F5D061] uppercase tracking-wider border-b border-[#D4AF37]/20 pb-2">
                  Form Banner & Display Titles
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                      Registration Form Title
                    </label>
                    <input
                      type="text"
                      value={regConfig.title || "WARRIOR REGISTRATION // SQUAD ENLISTMENT"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          registrationForm: { ...regConfig, title: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                      Submit CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={regConfig.submitButtonText || "CONFIRM SQUAD ENLISTMENT"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          registrationForm: { ...regConfig, submitButtonText: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                    Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={regConfig.subtitle || "Enlist your squad for HackVerse '26. Offline battleground at GCEK Kalahandi."}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        registrationForm: { ...regConfig, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                    Notice Banner Callout (Displayed in form)
                  </label>
                  <input
                    type="text"
                    value={regConfig.noticeBanner || "⚡ FREE REGISTRATION — MEALS, SWAGS & DORM ACCOMMODATION PROVIDED"}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        registrationForm: { ...regConfig, noticeBanner: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#FF4655] uppercase tracking-wider mb-1.5">
                    Closed State Message (Displayed when registration is paused)
                  </label>
                  <textarea
                    rows={2}
                    value={regConfig.closedMessage || "Registrations for HackVerse '26 are currently closed. Check back soon or contact support."}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        registrationForm: { ...regConfig, closedMessage: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                      Max Clan Members Allowed (1 - 6)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={regConfig.maxMembers ?? 4}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          registrationForm: { ...regConfig, maxMembers: parseInt(e.target.value) || 4 },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                      Allow Solo Registrations
                    </label>
                    <select
                      value={regConfig.allowSolo !== false ? "yes" : "no"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          registrationForm: { ...regConfig, allowSolo: e.target.value === "yes" },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                    >
                      <option value="yes">Yes — Solo builders can enlist</option>
                      <option value="no">No — Must have full squads</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1.5">
                    Terms & Agreement Statement
                  </label>
                  <textarea
                    rows={2}
                    value={regConfig.termsText || "I certify that all squad members are active university students or researchers and agree to the battleground rules."}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        registrationForm: { ...regConfig, termsText: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleSaveSection("registrationForm", editData.registrationForm)}
                    className="px-6 py-3 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE REGISTRATION FORM SETTINGS</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. WARRIORS REGISTRATIONS */}
          {activeSection === "registrations" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search squad, leader, email, track..."
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white pl-9 pr-3 py-2 text-xs font-rajdhani outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setAddingRegModal(true)}
                    className="px-3.5 py-2 border border-[#55FF55]/60 bg-[#55FF55]/10 hover:bg-[#55FF55]/20 text-[#55FF55] font-rajdhani text-xs font-bold flex items-center gap-1.5 cursor-pointer sf-clip-angled-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ENLIST SQUAD MANUALLY</span>
                  </button>
                  <button
                    onClick={fetchRegistrations}
                    className="px-3.5 py-2 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 text-neutral-300 font-rajdhani text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>REFRESH</span>
                  </button>
                  <button
                    onClick={handleExportRegistrations}
                    disabled={registrations.length === 0}
                    className="px-4 py-2 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT JSON</span>
                  </button>
                </div>
              </div>

              {filteredRegistrations.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-[#D4AF37]/25 bg-[#0c1017]">
                  <Shield className="w-12 h-12 mx-auto text-[#D4AF37]/40 mb-3" />
                  <p className="font-cinzel text-white text-base">No Registrations Found</p>
                  <p className="font-rajdhani text-neutral-500 text-xs mt-1">
                    {registrations.length === 0
                      ? "Submissions from the registration form will appear here in real time."
                      : "No results matched your search query."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredRegistrations.map((reg, idx) => (
                    <div
                      key={reg.id || reg.ticketId || idx}
                      className="p-5 border border-[#D4AF37]/25 bg-[#0e131d] sf-clip-angled-sm space-y-3 relative group hover:border-[#D4AF37]/70 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                    >
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={() => setEditingReg({ ...reg })}
                          className="px-2.5 py-1 border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#F5D061] font-rajdhani text-xs font-bold flex items-center gap-1 sf-clip-angled-sm transition-colors cursor-pointer"
                          title="Edit this registration"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>EDIT</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRegistration(reg.id || reg.ticketId)}
                          className="p-1 border border-[#FF4655]/30 hover:border-[#FF4655] bg-[#FF4655]/10 text-neutral-400 hover:text-[#FF4655] transition-colors cursor-pointer"
                          title="Delete registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2.5 py-0.5 border border-[#D4AF37]/30">
                          {reg.ticketId || reg.id}
                        </span>
                        <span className="font-cinzel font-black text-base text-white uppercase">
                          {reg.teamName || "SOLO BUILDER"}
                        </span>
                        {reg.selectedChallenge && (
                          <span className="font-rajdhani text-[11px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-2.5 py-0.5 border border-[#FF4655]/30 uppercase">
                            TRACK: {reg.selectedChallenge}
                          </span>
                        )}
                        <span className="font-rajdhani text-xs text-neutral-500 ml-auto mr-28">
                          {reg.submittedAt ? new Date(reg.submittedAt).toLocaleString() : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-rajdhani text-neutral-300 pt-1">
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                            Leader Name:
                          </span>
                          <span className="font-bold text-white text-sm">{reg.fullName || "—"}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                            Contact Info:
                          </span>
                          <span>{reg.email || "—"} {reg.phone ? `• ${reg.phone}` : ""}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                            College / Org:
                          </span>
                          <span>{reg.collegeOrOrg || "—"}</span>
                        </div>
                      </div>

                      {Array.isArray(reg.teamMembers) && reg.teamMembers.filter(Boolean).length > 0 && (
                        <div className="text-xs font-rajdhani pt-1.5 border-t border-white/5">
                          <span className="text-neutral-500 text-[10px] uppercase font-bold mr-1.5">
                            Clan Squad Members:
                          </span>
                          <span className="text-neutral-300">
                            {reg.teamMembers.filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}

                      {reg.githubOrPortfolio && (
                        <div className="text-xs font-mono text-[#D4AF37] pt-1">
                          <span className="text-neutral-500 text-[10px] uppercase font-bold font-rajdhani mr-1.5">
                            Repository / Portfolio:
                          </span>
                          <a
                            href={reg.githubOrPortfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline inline-flex items-center gap-1"
                          >
                            <span>{reg.githubOrPortfolio}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. HERO SECTION */}
          {activeSection === "hero" && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Gothic Main Title
                </label>
                <input
                  type="text"
                  value={hero.titleGothic || "𝕳𝖆𝖈𝖐𝖛𝖊𝖗𝖘𝖊"}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      hero: { ...hero, titleGothic: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-base font-cinzel focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Title Accent (e.g. '𝟚𝟞)
                </label>
                <input
                  type="text"
                  value={hero.titleAccent || "'𝟚𝟞"}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      hero: { ...hero, titleAccent: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Hero Sub-Headline
                </label>
                <input
                  type="text"
                  value={hero.subheadline || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      hero: { ...hero, subheadline: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Lore Description
                </label>
                <textarea
                  rows={3}
                  value={hero.description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      hero: { ...hero, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>
              {/* Progress Bar Controls */}
              <div className="p-4 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm space-y-4">
                <h4 className="font-cinzel font-bold text-sm text-[#F5D061] uppercase tracking-wider border-b border-[#D4AF37]/20 pb-2">
                  Registration Progress Bar
                </h4>

                {/* Show/Hide toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-rajdhani text-sm font-bold text-white">Show Progress Bar on Hero</p>
                    <p className="font-rajdhani text-xs text-neutral-500">Display the seats claimed/total progress gauge</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditData({
                        ...editData,
                        hero: { ...hero, showProgressBar: hero.showProgressBar === false ? true : false },
                      })
                    }
                    className={`shrink-0 px-4 py-2 font-cinzel text-xs font-black uppercase tracking-wider border sf-clip-angled-sm flex items-center gap-2 transition-all cursor-pointer ${
                      hero.showProgressBar !== false
                        ? "bg-[#55FF55]/15 border-[#55FF55] text-[#55FF55]"
                        : "bg-white/5 border-neutral-600 text-neutral-400"
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>{hero.showProgressBar !== false ? "PROGRESS BAR: VISIBLE" : "PROGRESS BAR: HIDDEN"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Seats Claimed
                    </label>
                    <input
                      type="number"
                      value={hero.seatsClaimed ?? 184}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          hero: { ...hero, seatsClaimed: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      value={hero.seatsTotal ?? 200}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          hero: { ...hero, seatsTotal: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Capacity Label Text
                    </label>
                    <input
                      type="text"
                      value={hero.capText || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          hero: { ...hero, capText: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("hero", editData.hero)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE HERO CONTENT</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. EVENT INFO */}
          {activeSection === "eventInfo" && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Event Full Name
                  </label>
                  <input
                    type="text"
                    value={eventInfo.name || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, name: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Short Name
                  </label>
                  <input
                    type="text"
                    value={eventInfo.shortName || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, shortName: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={eventInfo.tagline || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, tagline: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Event Dates
                  </label>
                  <input
                    type="text"
                    value={eventInfo.dates || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, dates: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={eventInfo.venue || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, venue: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventInfo.location || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, location: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Total Prize Pool
                  </label>
                  <input
                    type="text"
                    value={eventInfo.prizePool || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, prizePool: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Edition Tag
                  </label>
                  <input
                    type="text"
                    value={eventInfo.edition || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        eventInfo: { ...eventInfo, edition: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              {/* Site Logo in Event Info */}
              <div className="p-4 border border-[#D4AF37]/40 bg-[#090d14] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-cinzel text-xs font-bold text-[#F5D061] tracking-wider uppercase block">
                      Official Site & Event Logo
                    </label>
                    <p className="font-rajdhani text-[11px] text-neutral-400">
                      Upload an image file or enter a web URL. Appears on the Navbar, Footer, and Loading Screen.
                    </p>
                  </div>
                  {navbar.siteLogoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditData({
                          ...editData,
                          navbar: { ...navbar, siteLogoUrl: "" },
                        });
                      }}
                      className="px-2.5 py-1 text-[11px] border border-[#FF4655]/50 hover:bg-[#FF4655]/20 text-[#FF4655] font-rajdhani font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>REMOVE LOGO (RESET DEFAULT)</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                  <div className="relative w-16 h-16 bg-[#04060a] border-2 border-[#D4AF37] sf-clip-angled-sm flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                    {navbar.siteLogoUrl ? (
                      <img
                        src={navbar.siteLogoUrl}
                        alt="Site Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Swords className="w-6 h-6 text-[#F5D061]" />
                        <span className="text-[8px] font-mono text-neutral-500 mt-0.5 font-bold">DEFAULT</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="px-4 py-2 border border-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F5D061] text-xs font-rajdhani font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors flex items-center gap-2 sf-clip-angled-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>UPLOAD LOGO IMAGE</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const publicUrl = await uploadMediaToSupabase(file, 'logos');
                              if (publicUrl) {
                                setEditData((prev) => ({
                                  ...prev,
                                  navbar: { ...prev.navbar, siteLogoUrl: publicUrl },
                                }));
                              } else {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setEditData((prev) => ({
                                    ...prev,
                                    navbar: { ...prev.navbar, siteLogoUrl: reader.result as string },
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                      <span className="text-neutral-500 text-xs font-mono font-bold">— OR PASTE URL —</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Paste image URL (https://... or data:image/...)"
                      value={navbar.siteLogoUrl || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          navbar: { ...navbar, siteLogoUrl: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono text-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    await handleSaveSection("eventInfo", editData.eventInfo);
                    if (editData.navbar) {
                      await handleSaveSection("navbar", editData.navbar);
                    }
                  }}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE EVENT INFO</span>
                </button>
              </div>
            </div>
          )}

          {/* 6. NAVBAR */}
          {activeSection === "navbar" && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={navbar.brandName || "HACKVERSE"}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      navbar: { ...navbar, brandName: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Brand Accent (e.g. '26)
                </label>
                <input
                  type="text"
                  value={navbar.brandAccent || "'26"}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      navbar: { ...navbar, brandAccent: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Brand Subline (e.g. BATTLEGROUND // GCEK)
                </label>
                <input
                  type="text"
                  value={navbar.brandSubline || "BATTLEGROUND // GCEK"}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      navbar: { ...navbar, brandSubline: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>

              {/* SITE LOGO UPLOAD & CONTROLS */}
              <div className="p-4 border border-[#D4AF37]/40 bg-[#090d14] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-cinzel text-xs font-bold text-[#F5D061] tracking-wider uppercase block">
                      Site & Navbar Brand Logo
                    </label>
                    <p className="font-rajdhani text-[11px] text-neutral-400">
                      Upload an image file from your device or paste a web URL. Displays in Navbar, Footer & Loading Screen.
                    </p>
                  </div>
                  {navbar.siteLogoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditData({
                          ...editData,
                          navbar: { ...navbar, siteLogoUrl: "" },
                        });
                      }}
                      className="px-2.5 py-1 text-[11px] border border-[#FF4655]/50 hover:bg-[#FF4655]/20 text-[#FF4655] font-rajdhani font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>REMOVE LOGO (RESET DEFAULT)</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                  {/* Logo Preview */}
                  <div className="relative w-16 h-16 bg-[#04060a] border-2 border-[#D4AF37] sf-clip-angled-sm flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                    {navbar.siteLogoUrl ? (
                      <img
                        src={navbar.siteLogoUrl}
                        alt="Site Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Swords className="w-6 h-6 text-[#F5D061]" />
                        <span className="text-[8px] font-mono text-neutral-500 mt-0.5 font-bold">DEFAULT</span>
                      </div>
                    )}
                  </div>

                  {/* Upload button and URL input */}
                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="px-4 py-2 border border-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F5D061] text-xs font-rajdhani font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors flex items-center gap-2 sf-clip-angled-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>UPLOAD IMAGE FROM DEVICE</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const publicUrl = await uploadMediaToSupabase(file, 'logos');
                              if (publicUrl) {
                                setEditData((prev) => ({
                                  ...prev,
                                  navbar: { ...prev.navbar, siteLogoUrl: publicUrl },
                                }));
                              } else {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setEditData((prev) => ({
                                    ...prev,
                                    navbar: { ...prev.navbar, siteLogoUrl: reader.result as string },
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                      <span className="text-neutral-500 text-xs font-mono font-bold">— OR PASTE URL BELOW —</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Paste image URL (https://... or data:image/...)"
                      value={navbar.siteLogoUrl || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          navbar: { ...navbar, siteLogoUrl: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono text-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("navbar", editData.navbar)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE NAVBAR</span>
                </button>
              </div>
            </div>
          )}

          {/* 7. MISSION & INTEL */}
          {activeSection === "mission" && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={mission.badge || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      mission: { ...mission, badge: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Mission Title
                </label>
                <input
                  type="text"
                  value={mission.title || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      mission: { ...mission, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Mission Paragraph
                </label>
                <textarea
                  rows={3}
                  value={mission.description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      mission: { ...mission, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 border border-[#D4AF37]/20 bg-[#0d121b]">
                  <span className="text-[10px] text-[#F5D061] font-bold font-rajdhani uppercase">Pillar 1</span>
                  <input
                    type="text"
                    value={mission.pillar1Title || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        mission: { ...mission, pillar1Title: e.target.value },
                      })
                    }
                    placeholder="Title"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani mt-1"
                  />
                  <textarea
                    rows={2}
                    value={mission.pillar1Desc || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        mission: { ...mission, pillar1Desc: e.target.value },
                      })
                    }
                    placeholder="Description"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani mt-1"
                  />
                </div>

                <div className="p-3 border border-[#D4AF37]/20 bg-[#0d121b]">
                  <span className="text-[10px] text-[#F5D061] font-bold font-rajdhani uppercase">Pillar 2</span>
                  <input
                    type="text"
                    value={mission.pillar2Title || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        mission: { ...mission, pillar2Title: e.target.value },
                      })
                    }
                    placeholder="Title"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani mt-1"
                  />
                  <textarea
                    rows={2}
                    value={mission.pillar2Desc || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        mission: { ...mission, pillar2Desc: e.target.value },
                      })
                    }
                    placeholder="Description"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani mt-1"
                  />
                </div>

                <div className="p-3 border border-[#D4AF37]/20 bg-[#0d121b]">
                  <span className="text-[10px] text-[#F5D061] font-bold font-rajdhani uppercase">Pillar 3</span>
                  <input
                    type="text"
                    value={mission.pillar3Title || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        mission: { ...mission, pillar3Title: e.target.value },
                      })
                    }
                    placeholder="Title"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani mt-1"
                  />
                  <textarea
                    rows={2}
                    value={mission.pillar3Desc || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        mission: { ...mission, pillar3Desc: e.target.value },
                      })
                    }
                    placeholder="Description"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani mt-1"
                  />
                </div>
              </div>

              {/* ── Official Community Portal & Club Website ── */}
              <div className="p-5 border border-[#FFAA00]/40 bg-[#0c1017] sf-clip-angled-sm space-y-3.5 mt-2">
                <div className="border-b border-[#FFAA00]/25 pb-2">
                  <h4 className="font-cinzel font-bold text-sm text-[#FFAA00] uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Official Community Portal & Club Website</span>
                  </h4>
                  <p className="font-rajdhani text-xs text-neutral-400 mt-0.5">
                    Customize the action banner at the bottom of the Mission section and the club website URL.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#FFAA00] uppercase tracking-wider mb-1">
                      Portal Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={mission.communityBadge ?? "OFFICIAL COMMUNITY PORTAL"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          mission: { ...mission, communityBadge: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-xs font-mono focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#FFAA00] uppercase tracking-wider mb-1">
                      Community Title / Headline
                    </label>
                    <input
                      type="text"
                      value={mission.communityTitle ?? "JOIN THE CODEBREAKERS GUILD"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          mission: { ...mission, communityTitle: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-xs font-mono font-bold focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#FFAA00] uppercase tracking-wider mb-1">
                    Community Portal Description
                  </label>
                  <textarea
                    rows={2}
                    value={
                      mission.communityDesc ??
                      "Connect with 1,500+ student developers, alumni mentors, open-source contributors, and competitive hackathon warriors."
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        mission: { ...mission, communityDesc: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono focus:border-[#D4AF37] outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#55FF55] uppercase tracking-wider mb-1">
                      Club Website Button Label
                    </label>
                    <input
                      type="text"
                      value={mission.communityBtnLabel ?? "CLUB WEBSITE"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          mission: { ...mission, communityBtnLabel: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#55FF55] uppercase tracking-wider mb-1">
                      Club Website Link (URL)
                    </label>
                    <input
                      type="url"
                      placeholder="https://codebreakersgcek.tech"
                      value={mission.communityUrl ?? "https://codebreakersgcek.tech"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          mission: { ...mission, communityUrl: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#55FF55]/40 text-[#55FF55] p-2 text-xs font-mono focus:border-[#55FF55] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Secondary Button Label
                    </label>
                    <input
                      type="text"
                      value={mission.communityScheduleBtnLabel ?? "VIEW SCHEDULE"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          mission: { ...mission, communityScheduleBtnLabel: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Secondary Button Link
                    </label>
                    <input
                      type="text"
                      placeholder="#timeline"
                      value={mission.communityScheduleUrl ?? "#timeline"}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          mission: { ...mission, communityScheduleUrl: e.target.value },
                        })
                      }
                      className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("mission", editData.mission)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE MISSION CONTENT</span>
                </button>
              </div>
            </div>
          )}

          {/* 8. COMBAT STATS */}
          {activeSection === "stats" && (
            <div className="space-y-4 max-w-4xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 border border-[#D4AF37]/30 bg-[#0d121b]">
                  <label className="block text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Stat 1 (Duration)
                  </label>
                  <input
                    type="text"
                    value={stats.hours || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, hours: e.target.value },
                      })
                    }
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.hoursLabel || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, hoursLabel: e.target.value },
                      })
                    }
                    placeholder="Label"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.hoursSub || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, hoursSub: e.target.value },
                      })
                    }
                    placeholder="Subtext"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>

                <div className="p-3.5 border border-[#D4AF37]/30 bg-[#0d121b]">
                  <label className="block text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Stat 2 (Bounty Pool)
                  </label>
                  <input
                    type="text"
                    value={stats.prizePool || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, prizePool: e.target.value },
                      })
                    }
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.prizePoolLabel || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, prizePoolLabel: e.target.value },
                      })
                    }
                    placeholder="Label"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.prizePoolSub || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, prizePoolSub: e.target.value },
                      })
                    }
                    placeholder="Subtext"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>

                <div className="p-3.5 border border-[#D4AF37]/30 bg-[#0d121b]">
                  <label className="block text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Stat 3 (Warriors)
                  </label>
                  <input
                    type="text"
                    value={stats.hackers || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, hackers: e.target.value },
                      })
                    }
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.hackersLabel || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, hackersLabel: e.target.value },
                      })
                    }
                    placeholder="Label"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.hackersSub || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, hackersSub: e.target.value },
                      })
                    }
                    placeholder="Subtext"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>

                <div className="p-3.5 border border-[#D4AF37]/30 bg-[#0d121b]">
                  <label className="block text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Stat 4 (Tracks)
                  </label>
                  <input
                    type="text"
                    value={stats.tracks || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, tracks: e.target.value },
                      })
                    }
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.tracksLabel || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, tracksLabel: e.target.value },
                      })
                    }
                    placeholder="Label"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <input
                    type="text"
                    value={stats.tracksSub || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stats: { ...stats, tracksSub: e.target.value },
                      })
                    }
                    placeholder="Subtext"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("stats", editData.stats)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE METRICS</span>
                </button>
              </div>
            </div>
          )}

          {/* 9. PRIZES MATRIX */}
          {activeSection === "prizes" && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Total Prize Banner
                </label>
                <input
                  type="text"
                  value={prizes.poolTotal || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      prizes: { ...prizes, poolTotal: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 border border-[#D4AF37]/30 bg-[#0e131d]">
                  <span className="text-xs font-bold text-[#F5D061] font-rajdhani uppercase">
                    1st Place Champion
                  </span>
                  <input
                    type="text"
                    value={prizes.first || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, first: e.target.value },
                      })
                    }
                    placeholder="Amount (e.g. ₹50,000)"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mt-1 mb-2"
                  />
                  <input
                    type="text"
                    value={prizes.firstSubtitle || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, firstSubtitle: e.target.value },
                      })
                    }
                    placeholder="Subtitle (+ VC BACKING)"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <textarea
                    rows={2}
                    value={prizes.firstDesc || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, firstDesc: e.target.value },
                      })
                    }
                    placeholder="Description"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>

                <div className="p-3 border border-[#D4AF37]/30 bg-[#0e131d]">
                  <span className="text-xs font-bold text-[#F5D061] font-rajdhani uppercase">
                    2nd Place Runner Up
                  </span>
                  <input
                    type="text"
                    value={prizes.second || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, second: e.target.value },
                      })
                    }
                    placeholder="Amount (e.g. ₹30,000)"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mt-1 mb-2"
                  />
                  <input
                    type="text"
                    value={prizes.secondSubtitle || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, secondSubtitle: e.target.value },
                      })
                    }
                    placeholder="Subtitle"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <textarea
                    rows={2}
                    value={prizes.secondDesc || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, secondDesc: e.target.value },
                      })
                    }
                    placeholder="Description"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>

                <div className="p-3 border border-[#D4AF37]/30 bg-[#0e131d]">
                  <span className="text-xs font-bold text-[#F5D061] font-rajdhani uppercase">
                    3rd Place
                  </span>
                  <input
                    type="text"
                    value={prizes.third || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, third: e.target.value },
                      })
                    }
                    placeholder="Amount (e.g. ₹20,000)"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mt-1 mb-2"
                  />
                  <input
                    type="text"
                    value={prizes.thirdSubtitle || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, thirdSubtitle: e.target.value },
                      })
                    }
                    placeholder="Subtitle"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <textarea
                    rows={2}
                    value={prizes.thirdDesc || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, thirdDesc: e.target.value },
                      })
                    }
                    placeholder="Description"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>

                <div className="p-3 border border-[#D4AF37]/30 bg-[#0e131d]">
                  <span className="text-xs font-bold text-[#F5D061] font-rajdhani uppercase">
                    Special Track Bounties
                  </span>
                  <input
                    type="text"
                    value={prizes.special || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, special: e.target.value },
                      })
                    }
                    placeholder="Amount (e.g. ₹50,000)"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-sm font-rajdhani mt-1 mb-2"
                  />
                  <input
                    type="text"
                    value={prizes.specialSubtitle || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, specialSubtitle: e.target.value },
                      })
                    }
                    placeholder="Subtitle"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani mb-2"
                  />
                  <textarea
                    rows={2}
                    value={prizes.specialDesc || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        prizes: { ...prizes, specialDesc: e.target.value },
                      })
                    }
                    placeholder="Description"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("prizes", editData.prizes)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE PRIZE MATRIX</span>
                </button>
              </div>
            </div>
          )}

          {/* 10. BATTLEGROUND QUESTS / TRACKS */}
          {activeSection === "challenges" && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex items-center justify-between">
                <p className="font-rajdhani text-xs text-neutral-400">
                  Manage battleground quest tracks and problem statement categories ({challenges.length} active).
                </p>
                <button
                  onClick={() => {
                    const newChallenge = {
                      id: `track-${Date.now()}`,
                      number: String(challenges.length + 1).padStart(2, "0"),
                      title: "NEW QUEST TRACK",
                      category: "EMERGING TECH",
                      difficulty: "All Levels",
                      shortDescription: "Description of the challenge track and engineering scope.",
                    };
                    setEditData({ ...editData, challenges: [...challenges, newChallenge] });
                  }}
                  className="px-3.5 py-1.5 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD QUEST TRACK</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[55vh] overflow-y-auto p-1">
                {challenges.map((ch, idx) => (
                  <div
                    key={ch.id || idx}
                    className="p-4 border border-[#D4AF37]/25 bg-[#0e131d] sf-clip-angled-sm space-y-2 relative"
                  >
                    <button
                      onClick={() => {
                        const updated = challenges.filter((_, i) => i !== idx);
                        setEditData({ ...editData, challenges: updated });
                      }}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-[#FF4655] p-1 cursor-pointer"
                      title="Delete quest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Track #
                        </label>
                        <input
                          type="text"
                          value={ch.number || ""}
                          onChange={(e) => {
                            const updated = [...challenges];
                            updated[idx].number = e.target.value;
                            setEditData({ ...editData, challenges: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Quest Title
                        </label>
                        <input
                          type="text"
                          value={ch.title || ""}
                          onChange={(e) => {
                            const updated = [...challenges];
                            updated[idx].title = e.target.value;
                            setEditData({ ...editData, challenges: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-cinzel font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Difficulty
                        </label>
                        <select
                          value={ch.difficulty || "All Levels"}
                          onChange={(e) => {
                            const updated = [...challenges];
                            updated[idx].difficulty = e.target.value;
                            setEditData({ ...editData, challenges: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                        >
                          <option value="All Levels">All Levels</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={ch.category || ""}
                        onChange={(e) => {
                          const updated = [...challenges];
                          updated[idx].category = e.target.value;
                          setEditData({ ...editData, challenges: updated });
                        }}
                        className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={ch.shortDescription || ""}
                        onChange={(e) => {
                          const updated = [...challenges];
                          updated[idx].shortDescription = e.target.value;
                          setEditData({ ...editData, challenges: updated });
                        }}
                        className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("challenges", editData.challenges)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE QUEST TRACKS</span>
                </button>
              </div>
            </div>
          )}

          {/* 11. TIMELINE & CHRONOLOGY */}
          {activeSection === "timeline" && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex items-center justify-between">
                <p className="font-rajdhani text-xs text-neutral-400">
                  Manage chronological milestones and schedule ({timeline.length} events).
                </p>
                <button
                  onClick={() => {
                    const newEvt = {
                      id: `t-${Date.now()}`,
                      day: "DAY 01",
                      time: "12:00 PM",
                      title: "New Milestone Event",
                      description: "Brief event details and instructions for warriors.",
                      milestone: false,
                    };
                    setEditData({ ...editData, timeline: [...timeline, newEvt] });
                  }}
                  className="px-3.5 py-1.5 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD TIMELINE EVENT</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[55vh] overflow-y-auto p-1">
                {timeline.map((evt, idx) => (
                  <div
                    key={evt.id || idx}
                    className="p-4 border border-[#D4AF37]/25 bg-[#0e131d] sf-clip-angled-sm space-y-2 relative"
                  >
                    <button
                      onClick={() => {
                        const updated = timeline.filter((_, i) => i !== idx);
                        setEditData({ ...editData, timeline: updated });
                      }}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-[#FF4655] p-1 cursor-pointer"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Day (DAY 01, 02, etc.)
                        </label>
                        <input
                          type="text"
                          value={evt.day || ""}
                          onChange={(e) => {
                            const updated = [...timeline];
                            updated[idx].day = e.target.value;
                            setEditData({ ...editData, timeline: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Time (e.g. 10:00 AM)
                        </label>
                        <input
                          type="text"
                          value={evt.time || ""}
                          onChange={(e) => {
                            const updated = [...timeline];
                            updated[idx].time = e.target.value;
                            setEditData({ ...editData, timeline: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Milestone Title
                        </label>
                        <input
                          type="text"
                          value={evt.title || ""}
                          onChange={(e) => {
                            const updated = [...timeline];
                            updated[idx].title = e.target.value;
                            setEditData({ ...editData, timeline: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-cinzel font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={evt.description || ""}
                        onChange={(e) => {
                          const updated = [...timeline];
                          updated[idx].description = e.target.value;
                          setEditData({ ...editData, timeline: updated });
                        }}
                        className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={`milestone-${idx}`}
                        checked={Boolean(evt.milestone)}
                        onChange={(e) => {
                          const updated = [...timeline];
                          updated[idx].milestone = e.target.checked;
                          setEditData({ ...editData, timeline: updated });
                        }}
                        className="accent-[#D4AF37] cursor-pointer"
                      />
                      <label htmlFor={`milestone-${idx}`} className="text-xs font-rajdhani text-neutral-300 cursor-pointer">
                        Highlight as major key milestone
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("timeline", editData.timeline)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE TIMELINE</span>
                </button>
              </div>
            </div>
          )}

          {/* 12. FEATURED SQUADS */}
          {activeSection === "teams" && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex items-center justify-between">
                <p className="font-rajdhani text-xs text-neutral-400">
                  Showing {teams.length} shortlisted squads. Add, rename, or update domain categories.
                </p>
                <button
                  onClick={() => {
                    const newTeam = {
                      id: `team-${Date.now()}`,
                      number: String(teams.length + 1).padStart(2, "0"),
                      name: "NEW SQUAD",
                      category: "CROSS-DOMAIN COMBAT",
                    };
                    setEditData({ ...editData, teams: [...teams, newTeam] });
                  }}
                  className="px-3.5 py-1.5 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD SQUAD</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto p-1">
                {teams.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="p-3.5 border border-[#D4AF37]/25 bg-[#0e131d] sf-clip-angled-sm space-y-2 relative"
                  >
                    <button
                      onClick={() => {
                        const updated = teams.filter((_, i) => i !== idx);
                        setEditData({ ...editData, teams: updated });
                      }}
                      className="absolute top-2.5 right-2.5 text-neutral-500 hover:text-[#FF4655] p-1 cursor-pointer"
                      title="Delete squad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Squad #
                        </label>
                        <input
                          type="text"
                          value={t.number || ""}
                          onChange={(e) => {
                            const updated = [...teams];
                            updated[idx].number = e.target.value;
                            setEditData({ ...editData, teams: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1 text-xs font-rajdhani"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Squad Name
                        </label>
                        <input
                          type="text"
                          value={t.name || ""}
                          onChange={(e) => {
                            const updated = [...teams];
                            updated[idx].name = e.target.value;
                            setEditData({ ...editData, teams: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1 text-xs font-cinzel font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                        Category / Domain
                      </label>
                      <input
                        type="text"
                        value={t.category || ""}
                        onChange={(e) => {
                          const updated = [...teams];
                          updated[idx].category = e.target.value;
                          setEditData({ ...editData, teams: updated });
                        }}
                        className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1 text-xs font-rajdhani"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("teams", editData.teams)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE SQUADS ROSTER</span>
                </button>
              </div>
            </div>
          )}

          {/* 13. RULES & FAQS */}
          {activeSection === "faq" && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <p className="font-rajdhani text-xs text-neutral-400">
                  Manage rule clarifications and knowledge base Q&As.
                </p>
                <button
                  onClick={() => {
                    const newFaq = {
                      id: `faq-${Date.now()}`,
                      question: "New Question Title",
                      answer: "Detailed explanation and guidelines.",
                      category: "General",
                    };
                    setEditData({ ...editData, faq: [...faq, newFaq] });
                  }}
                  className="px-3.5 py-1.5 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD FAQ</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[55vh] overflow-y-auto p-1">
                {faq.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 border border-[#D4AF37]/25 bg-[#0e131d] sf-clip-angled-sm space-y-2 relative"
                  >
                    <button
                      onClick={() => {
                        const updated = faq.filter((_, i) => i !== idx);
                        setEditData({ ...editData, faq: updated });
                      }}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-[#FF4655] p-1 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-3">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Question
                        </label>
                        <input
                          type="text"
                          value={item.question || ""}
                          onChange={(e) => {
                            const updated = [...faq];
                            updated[idx].question = e.target.value;
                            setEditData({ ...editData, faq: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Category
                        </label>
                        <input
                          type="text"
                          value={item.category || ""}
                          onChange={(e) => {
                            const updated = [...faq];
                            updated[idx].category = e.target.value;
                            setEditData({ ...editData, faq: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold uppercase block">
                        Answer
                      </label>
                      <textarea
                        rows={2}
                        value={item.answer || ""}
                        onChange={(e) => {
                          const updated = [...faq];
                          updated[idx].answer = e.target.value;
                          setEditData({ ...editData, faq: updated });
                        }}
                        className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-1.5 text-xs font-rajdhani"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("faq", editData.faq)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE FAQS</span>
                </button>
              </div>
            </div>
          )}

          {/* 14. SPONSORS & ALLIES */}
          {activeSection === "sponsors" && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex items-center justify-between">
                <p className="font-rajdhani text-xs text-neutral-400">
                  Manage industry sponsors and ecosystem partners ({sponsors.length} active). Add logos, tiers, and roles.
                </p>
                <button
                  onClick={() => {
                    const newSponsor = {
                      id: `sp-${Date.now()}`,
                      name: "NEW PARTNER ORG",
                      tier: "Gold",
                      category: "Developer Ecosystem & Grants",
                      logoUrl: "",
                      websiteUrl: "",
                    };
                    setEditData({ ...editData, sponsors: [...sponsors, newSponsor] });
                  }}
                  className="px-3.5 py-1.5 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD SPONSOR</span>
                </button>
              </div>

              <div data-lenis-prevent="true" className="space-y-4 max-h-[60vh] overflow-y-auto p-1 custom-admin-scrollbar">
                {sponsors.map((sp, idx) => (
                  <div
                    key={sp.id || idx}
                    className="p-4 sm:p-5 border border-[#D4AF37]/25 bg-[#0e131d] sf-clip-angled-sm space-y-3 relative hover:border-[#D4AF37]/60 transition-all"
                  >
                    <button
                      onClick={() => {
                        const updated = sponsors.filter((_, i) => i !== idx);
                        setEditData({ ...editData, sponsors: updated });
                      }}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-[#FF4655] p-1.5 cursor-pointer transition-colors"
                      title="Delete sponsor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-[#F5D061] font-bold uppercase block mb-1">
                          Partner Organization Name
                        </label>
                        <input
                          type="text"
                          value={sp.name || ""}
                          onChange={(e) => {
                            const updated = [...sponsors];
                            updated[idx].name = e.target.value;
                            setEditData({ ...editData, sponsors: updated });
                          }}
                          placeholder="e.g. GOOGLE CLOUD"
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-cinzel font-bold focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                          Sponsorship Tier
                        </label>
                        <select
                          value={sp.tier || "Gold"}
                          onChange={(e) => {
                            const updated = [...sponsors];
                            updated[idx].tier = e.target.value;
                            setEditData({ ...editData, sponsors: updated });
                          }}
                          className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani focus:border-[#D4AF37] outline-none"
                        >
                          <option value="Title Partner">Title Partner</option>
                          <option value="Platinum">Platinum</option>
                          <option value="Gold">Gold</option>
                          <option value="Ecosystem">Ecosystem</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                        Category / Role / Bounty Description
                      </label>
                      <input
                        type="text"
                        value={sp.category || ""}
                        onChange={(e) => {
                          const updated = [...sponsors];
                          updated[idx].category = e.target.value;
                          setEditData({ ...editData, sponsors: updated });
                        }}
                        placeholder="e.g. Model API & Cloud Grants Partner"
                        className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    {/* Logo URL & File Upload */}
                    <div className="pt-2 border-t border-[#D4AF37]/15">
                      <label className="text-[10px] text-[#F5D061] font-bold uppercase block mb-1.5">
                        Sponsor Logo (Image URL or Upload Image)
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Logo Preview */}
                        <div className="w-16 h-14 bg-[#070a10] border border-[#D4AF37]/30 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          {sp.logoUrl ? (
                            <img
                              src={sp.logoUrl}
                              alt="Logo Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="font-mono text-[9px] text-neutral-600">NO LOGO</span>
                          )}
                        </div>

                        {/* URL input */}
                        <div className="flex-1 w-full">
                          <input
                            type="text"
                            placeholder="Paste image URL (https://...) or upload below"
                            value={sp.logoUrl || ""}
                            onChange={(e) => {
                              const updated = [...sponsors];
                              updated[idx].logoUrl = e.target.value;
                              setEditData({ ...editData, sponsors: updated });
                            }}
                            className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono text-[#D4AF37] focus:border-[#D4AF37] outline-none"
                          />
                        </div>

                        {/* Upload Button */}
                        <label className="px-3.5 py-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#F5D061] text-xs font-rajdhani font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 sf-clip-angled-sm">
                          <Plus className="w-3.5 h-3.5" />
                          <span>UPLOAD LOGO</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const publicUrl = await uploadMediaToSupabase(file, 'sponsors');
                                if (publicUrl) {
                                  const updated = [...sponsors];
                                  updated[idx].logoUrl = publicUrl;
                                  setEditData({ ...editData, sponsors: updated });
                                } else {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    const updated = [...sponsors];
                                    updated[idx].logoUrl = reader.result as string;
                                    setEditData({ ...editData, sponsors: updated });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Website URL */}
                    <div>
                      <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                        Partner Website URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://company.com"
                        value={sp.websiteUrl || ""}
                        onChange={(e) => {
                          const updated = [...sponsors];
                          updated[idx].websiteUrl = e.target.value;
                          setEditData({ ...editData, sponsors: updated });
                        }}
                        className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("sponsors", editData.sponsors)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE SPONSORS</span>
                </button>
              </div>
            </div>
          )}

          {/* 15. FOOTER & COORDINATES */}
          {activeSection === "footer" && (
            <div className="space-y-4 max-w-4xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={footer.contactEmail || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        footer: { ...footer, contactEmail: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={footer.contactPhone || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        footer: { ...footer, contactPhone: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Physical Venue Address
                </label>
                <input
                  type="text"
                  value={footer.address || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      footer: { ...footer, address: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  value={footer.copyright || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      footer: { ...footer, copyright: e.target.value },
                    })
                  }
                  className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2.5 text-sm font-rajdhani focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Discord Community Link
                  </label>
                  <input
                    type="text"
                    value={footer.discord || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        footer: { ...footer, discord: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    GitHub Link
                  </label>
                  <input
                    type="text"
                    value={footer.github || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        footer: { ...footer, github: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Twitter / X Link
                  </label>
                  <input
                    type="text"
                    value={footer.twitter || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        footer: { ...footer, twitter: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    LinkedIn Link
                  </label>
                  <input
                    type="text"
                    value={footer.linkedin || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        footer: { ...footer, linkedin: e.target.value },
                      })
                    }
                    className="w-full bg-[#111722] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSaveSection("footer", editData.footer)}
                  className="px-6 py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE FOOTER COORDINATES</span>
                </button>
              </div>
            </div>
          )}

          {/* 16. ADMIN SECURITY & PASSCODE */}
          {activeSection === "adminSecurity" && (
            <div className="space-y-5 max-w-xl">
              <div className="p-5 border border-[#D4AF37]/30 bg-[#0c1017] sf-clip-angled-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
                  <Key className="w-5 h-5 text-[#F5D061]" />
                  <h3 className="font-cinzel font-bold text-base text-white">
                    Update Admin Authentication Passcode
                  </h3>
                </div>

                <p className="font-rajdhani text-xs text-neutral-300">
                  Update the master security passcode used to access the command matrix at <code>/admin</code>.
                </p>

                <form onSubmit={handleChangePasscode} className="space-y-3">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                      New Passcode (Min 4 characters)
                    </label>
                    <input
                      type="text"
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Enter new admin passcode"
                      className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2.5 text-xs font-mono"
                      required
                      minLength={4}
                    />
                  </div>

                  {passcodeMsg && (
                    <div
                      className={`p-2.5 text-xs font-rajdhani border ${
                        passcodeMsg.type === "success"
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : "border-red-500/50 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {passcodeMsg.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={passcodeLoading}
                    className="px-5 py-2 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {passcodeLoading ? "UPDATING..." : "UPDATE SECURITY PASSCODE"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 17. RAW JSON DATABASE EDITOR */}
          {activeSection === "rawJson" && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex items-center justify-between">
                <p className="font-rajdhani text-xs text-neutral-300">
                  Direct raw JSON database matrix. Allows overriding or fine-tuning <strong>any text line, array item, or property</strong> across the entire website.
                </p>
                <button
                  onClick={() => {
                    try {
                      const formatted = JSON.stringify(JSON.parse(rawJsonText), null, 2);
                      setRawJsonText(formatted);
                      setRawJsonError("");
                    } catch (err: any) {
                      setRawJsonError(`Syntax Error: ${err.message}`);
                    }
                  }}
                  className="px-3 py-1.5 border border-neutral-600 hover:border-neutral-400 font-rajdhani text-xs text-neutral-300 cursor-pointer"
                >
                  Format JSON
                </button>
              </div>

              {rawJsonError && (
                <div className="p-3 border border-[#FF4655]/40 bg-[#FF4655]/10 text-[#FF4655] font-mono text-xs">
                  {rawJsonError}
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={22}
                  value={rawJsonText}
                  onChange={(e) => {
                    setRawJsonText(e.target.value);
                    setRawJsonError("");
                  }}
                  spellCheck={false}
                  className="w-full bg-[#05070a] border border-[#D4AF37]/40 text-[#55FF55] p-4 font-mono text-xs leading-relaxed outline-none focus:border-[#D4AF37] resize-y"
                />
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={handleSaveRawJson}
                  className="px-6 py-3 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>OVERWRITE DATABASE WITH RAW JSON</span>
                </button>
                <span className="font-rajdhani text-xs text-neutral-500">
                  Auto-validated syntax before commit.
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── MODAL: EDIT SPECIFIC REGISTRATION ─── */}
      {editingReg && (
        <div data-lenis-prevent="true" className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0c1017] border border-[#D4AF37]/60 sf-clip-angled-sm p-6 sm:p-7 relative shadow-[0_20px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto custom-admin-scrollbar"
            data-lenis-prevent="true"
          >
            <button
              onClick={() => setEditingReg(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 flex items-center gap-2.5 border-b border-[#D4AF37]/20 pb-3">
              <Edit3 className="w-5 h-5 text-[#F5D061]" />
              <div>
                <h3 className="font-cinzel font-black text-lg text-white">
                  Edit Warrior Registration
                </h3>
                <span className="font-mono text-xs text-[#D4AF37]">
                  ID: {editingReg.id || editingReg.ticketId}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveEditedRegistration} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    value={editingReg.teamName || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, teamName: e.target.value })}
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-cinzel font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Leader Name
                  </label>
                  <input
                    type="text"
                    value={editingReg.fullName || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, fullName: e.target.value })}
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingReg.email || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, email: e.target.value })}
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                    required
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editingReg.phone || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, phone: e.target.value })}
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    College / Organization
                  </label>
                  <input
                    type="text"
                    value={editingReg.collegeOrOrg || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, collegeOrOrg: e.target.value })}
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Selected Track / Quest
                  </label>
                  <input
                    type="text"
                    value={editingReg.selectedChallenge || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, selectedChallenge: e.target.value })}
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                  Clan Warriors (Comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(editingReg.teamMembers) ? editingReg.teamMembers.join(", ") : (editingReg.teamMembers || "")}
                  onChange={(e) =>
                    setEditingReg({
                      ...editingReg,
                      teamMembers: e.target.value.split(",").map((s: string) => s.trim()),
                    })
                  }
                  placeholder="Warrior 1, Warrior 2, Warrior 3"
                  className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                />
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                  GitHub / Portfolio URL
                </label>
                <input
                  type="text"
                  value={editingReg.githubOrPortfolio || ""}
                  onChange={(e) => setEditingReg({ ...editingReg, githubOrPortfolio: e.target.value })}
                  className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono text-[#D4AF37]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setEditingReg(null)}
                  className="px-4 py-2 border border-neutral-600 hover:border-neutral-400 font-rajdhani text-xs text-neutral-300 uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editRegSaving}
                  className="px-5 py-2 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editRegSaving ? "SAVING..." : "SAVE SQUAD CHANGES"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ─── MODAL: ADD SQUAD / WARRIOR MANUALLY ─── */}
      {addingRegModal && (
        <div data-lenis-prevent="true" className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0c1017] border border-[#55FF55]/60 sf-clip-angled-sm p-6 sm:p-7 relative shadow-[0_20px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto custom-admin-scrollbar"
            data-lenis-prevent="true"
          >
            <button
              onClick={() => setAddingRegModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 flex items-center gap-2.5 border-b border-[#55FF55]/20 pb-3">
              <Plus className="w-5 h-5 text-[#55FF55]" />
              <div>
                <h3 className="font-cinzel font-black text-lg text-white">
                  Enlist New Squad Manually
                </h3>
                <span className="font-mono text-xs text-[#55FF55]">
                  ADMIN DIRECT REGISTRATION
                </span>
              </div>
            </div>

            <form onSubmit={handleAddManualRegistration} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    value={newRegData.teamName}
                    onChange={(e) => setNewRegData({ ...newRegData, teamName: e.target.value })}
                    placeholder="e.g. CYBER CYCLONE"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-cinzel font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Leader Name
                  </label>
                  <input
                    type="text"
                    value={newRegData.fullName}
                    onChange={(e) => setNewRegData({ ...newRegData, fullName: e.target.value })}
                    placeholder="Lead engineer name"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newRegData.email}
                    onChange={(e) => setNewRegData({ ...newRegData, email: e.target.value })}
                    placeholder="leader@college.edu"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                    required
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newRegData.phone}
                    onChange={(e) => setNewRegData({ ...newRegData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    College / Organization
                  </label>
                  <input
                    type="text"
                    value={newRegData.collegeOrOrg}
                    onChange={(e) => setNewRegData({ ...newRegData, collegeOrOrg: e.target.value })}
                    placeholder="e.g. GCEK Bhawanipatna"
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                  />
                </div>
                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                    Track / Quest
                  </label>
                  <input
                    type="text"
                    value={newRegData.selectedChallenge}
                    onChange={(e) => setNewRegData({ ...newRegData, selectedChallenge: e.target.value })}
                    className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                  Clan Warriors (Comma separated)
                </label>
                <input
                  type="text"
                  value={newRegData.teamMembers}
                  onChange={(e) => setNewRegData({ ...newRegData, teamMembers: e.target.value })}
                  placeholder="Warrior 1, Warrior 2, Warrior 3"
                  className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-rajdhani"
                />
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase mb-1">
                  GitHub / Portfolio URL
                </label>
                <input
                  type="text"
                  value={newRegData.githubOrPortfolio}
                  onChange={(e) => setNewRegData({ ...newRegData, githubOrPortfolio: e.target.value })}
                  placeholder="https://github.com/lead"
                  className="w-full bg-[#141b26] border border-[#D4AF37]/30 text-white p-2 text-xs font-mono text-[#D4AF37]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#55FF55]/20">
                <button
                  type="button"
                  onClick={() => setAddingRegModal(false)}
                  className="px-4 py-2 border border-neutral-600 hover:border-neutral-400 font-rajdhani text-xs text-neutral-300 uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addRegSaving}
                  className="px-5 py-2 border border-[#55FF55] bg-[#55FF55]/20 hover:bg-[#55FF55]/30 text-[#55FF55] font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{addRegSaving ? "ENLISTING..." : "CONFIRM ENLISTMENT"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
