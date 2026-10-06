import React, { useState, useEffect, useRef } from 'react';
import { 
  Scale, Mic, Video, ShieldCheck, FileText, Globe, AlertTriangle, 
  CheckCircle2, Clock, User, Lock, Search, RefreshCw, Download, 
  Send, Sparkles, Volume2, Shield, QrCode, ArrowRight, BookOpen,
  Terminal, Server, FileCheck, Check, ChevronRight, Play, Square,
  Menu, X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'complaint' | 'court' | 'blockchain' | 'assistant'>('complaint');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pillar 1: Complaint State
  const [selectedLang, setSelectedLang] = useState('Wolof');
  const [complaintText, setComplaintText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [analyzingComplaint, setAnalyzingComplaint] = useState(false);
  const [complaintResult, setComplaintResult] = useState<any>(null);

  // Pillar 2: Court State
  const [hearingActive, setHearingActive] = useState(false);
  const [hearingType, setHearingType] = useState('Correctionnel - Vol et Abus de confiance');
  const [diarizationLogs, setDiarizationLogs] = useState<any[]>([]);
  const [detectedEvents, setDetectedEvents] = useState<string[]>([]);
  const [judgmentDraft, setJudgmentDraft] = useState('');
  const [courtLoading, setCourtLoading] = useState(false);

  // Pillar 3: Blockchain Casier State
  const [citizenId, setCitizenId] = useState('CID-88492026');
  const [fullName, setFullName] = useState('Amadou Diallo');
  const [birthDate, setBirthDate] = useState('14/05/1992');
  const [criminalHistory, setCriminalHistory] = useState('Néant (Casier vierge)');
  const [bulletinType, setBulletinType] = useState('B3');
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [bulletinResult, setBulletinResult] = useState<any>(null);
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);

  // Pillar 4: Assistant State
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'assistant', text: 'Bonjour. Je suis votre assistant juridique E-Justice. Posez vos questions sur le Code Pénal, le Code de Procédure Pénale ou les Actes Uniformes OHADA.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Sample quick complaints in local languages
  const sampleComplaints: Record<string, { lang: string, text: string }> = {
    wolof: {
      lang: 'Wolof',
      text: 'Mangi wo dëkk bi, am na nit ku fi dugg sama boutique ci Dakar, jël sama alal ak telephone yi te dóor ma. Ma ngi laaj yoon defar ma.'
    },
    lingala: {
      lang: 'Lingala',
      text: 'Moto moko ayaki na ndako na ngi na Kinshasa, akɔtisi pasi mpe abengi biloko na ngi nyonso ya motuya. Nazali koluka bosungi ya mibeko.'
    },
    bambara: {
      lang: 'Bambara',
      text: 'Cɛ kelen ye n ka sɔn fɛn furu Bamako, ka n na baara sɔnka ni kili ye. N bɛ ɲini ka yɛlɛmɛn ni kɛlawu ye.'
    },
    swahili: {
      lang: 'Swahili',
      text: 'Mtu mmoja alivamia duka langu hapa Dar es Salaam, akaiba mali na pesa taslimu. Ninaomba msaada wa kisheria na haki.'
    },
    french: {
      lang: 'Français',
      text: 'Vol qualifié avec effraction perpétré dans mon commerce au Plateau à Dakar dans la nuit du 4 au 5 octobre 2026. Préjudice estimé à 2 millions de francs.'
    }
  };

  // Handle complaint analysis call
  const handleAnalyzeComplaint = async () => {
    if (!complaintText.trim()) return;
    setAnalyzingComplaint(true);
    try {
      const res = await fetch('/api/complaint/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: complaintText, language: selectedLang })
      });
      const data = await res.json();
      if (data.success) {
        setComplaintResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingComplaint(false);
    }
  };

  // Handle Court Diarization
  const handleStartHearing = async () => {
    setCourtLoading(true);
    setHearingActive(true);
    try {
      const res = await fetch('/api/court/diarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          caseType: hearingType,
          transcriptStream: "Le Président ouvre l'audience. Le Procureur expose les faits d'escroquerie foncière. L'avocat de la défense soulève une exception de nullité. Le témoin principal est à la barre."
        })
      });
      const data = await res.json();
      if (data.success) {
        setDiarizationLogs(data.diarization || []);
        setDetectedEvents(data.detectedEvents || []);
        setJudgmentDraft(data.judgmentDraft || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCourtLoading(false);
    }
  };

  // Handle Blockchain Bulletin Generation
  const handleGenerateBulletin = async () => {
    setBlockchainLoading(true);
    try {
      const res = await fetch('/api/blockchain/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenId, fullName, birthDate, criminalHistory, bulletinType })
      });
      const data = await res.json();
      if (data.success) {
        setBulletinResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBlockchainLoading(false);
    }
  };

  // Handle Legal Assistant Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/legal/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Erreur lors de la consultation de l\'assistant juridique.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* TOP BAR CONTRACT: 3 Zones */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Scale className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              E-Justice
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                v2.6 Secure
              </span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-full border border-slate-800">
          <button 
            onClick={() => setActiveTab('complaint')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'complaint' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            01. Dépôt Vocal Multilingue
          </button>
          <button 
            onClick={() => setActiveTab('court')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'court' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            02. Audience & Greffe IA
          </button>
          <button 
            onClick={() => setActiveTab('blockchain')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'blockchain' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            03. Casier Blockchain
          </button>
          <button 
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'assistant' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            04. Assistant OHADA & Pénal
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Réseau Souverain OK</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col gap-2">
          <button 
            onClick={() => { setActiveTab('complaint'); setMobileMenuOpen(false); }}
            className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'complaint' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
          >
            01. Dépôt Vocal Multilingue
          </button>
          <button 
            onClick={() => { setActiveTab('court'); setMobileMenuOpen(false); }}
            className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'court' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
          >
            02. Audience & Greffe IA
          </button>
          <button 
            onClick={() => { setActiveTab('blockchain'); setMobileMenuOpen(false); }}
            className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'blockchain' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
          >
            03. Casier Blockchain
          </button>
          <button 
            onClick={() => { setActiveTab('assistant'); setMobileMenuOpen(false); }}
            className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'assistant' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
          >
            04. Assistant OHADA & Pénal
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        
        {/* ================= PILLAR 1: VOICE COMPLAINT ================= */}
        {activeTab === 'complaint' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-mono mb-2">
                  <span>Pillar 01</span>
                  <span>/</span>
                  <span>Accès Citoyen & Multilinguisme</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Plateforme de Dépôt de Plainte Vocal
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Déposez votre plainte dans votre langue locale (Wolof, Lingala, Bambara, Swahili, etc.). Le système transcrit, qualifie juridiquement et génère le Procès-Verbal officiel avec signature cryptographique.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Langue source :</span>
                <select 
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Wolof">Wolof (Sénégal / Gambie)</option>
                  <option value="Lingala">Lingala (RDC / Congo)</option>
                  <option value="Bambara">Bambara (Mali)</option>
                  <option value="Swahili">Swahili (Afrique de l'Est)</option>
                  <option value="Peul">Peul / Pulaar</option>
                  <option value="Mooré">Mooré (Burkina Faso)</option>
                  <option value="Français">Français Officiel</option>
                  <option value="Arabe">Arabe Dialectal</option>
                </select>
              </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Input & Voice Simulation */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                
                {/* Quick Samples */}
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    Exemples Rapides (Simulateur Audio)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(sampleComplaints).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => { setSelectedLang(item.lang); setComplaintText(item.text); }}
                        className="text-left text-xs bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-2.5 rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <span className="font-medium text-slate-300 group-hover:text-amber-300">{item.lang}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recorder / Text Area Box */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-white flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-500" />
                      Transcription & Déposition Vocale
                    </label>
                    <button 
                      onClick={() => {
                        setIsRecording(!isRecording);
                        if (!isRecording) {
                          setComplaintText("Enregistrement audio en cours... [Simulation micro captant le témoignage en direct dans la langue sélectionnée]");
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`}></span>
                      {isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer la voix'}
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="Écrivez ou dictez votre plainte ici..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 placeholder:text-slate-600 font-mono"
                  ></textarea>

                  <button
                    onClick={handleAnalyzeComplaint}
                    disabled={analyzingComplaint || !complaintText.trim()}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    {analyzingComplaint ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyse IA & Qualification en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Générer la Plainte & Le PV Officiel</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: AI Results & Official PV */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {complaintResult ? (
                  <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-amber-400 font-mono">Dossier Enregistré</span>
                        <h3 className="text-lg font-bold text-white font-mono">{complaintResult.complaintId}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${complaintResult.urgency === 'URGENT' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                          {complaintResult.urgency}
                        </span>
                      </div>
                    </div>

                    {/* Entities Extracted */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 uppercase font-mono">Qualification Juridique</span>
                        <p className="text-sm font-bold text-amber-300 mt-0.5">{complaintResult.entities.infractionType}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 uppercase font-mono">Lieu des Faits</span>
                        <p className="text-sm font-medium text-white mt-0.5">{complaintResult.entities.location}</p>
                      </div>
                    </div>

                    {/* Translated Summary */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        Traduction & Synthèse Juridique (Français)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono">
                        {complaintResult.translatedText}
                      </p>
                    </div>

                    {/* Official PV */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 max-h-64 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5" />
                          Procès-Verbal (PV) Certifié & Empreinte SHA-256
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Signé électroniquement</span>
                      </div>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        {complaintResult.officialPV}
                      </pre>
                      <div className="text-[10px] text-slate-500 font-mono break-all mt-1">
                        Hash : {complaintResult.hash}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => alert("PV téléchargé au format PDF sécurisé.")}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger le PV (PDF)</span>
                      </button>
                      <button 
                        onClick={() => alert("Transmis au Parquet compétent et enregistré sur la blockchain.")}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Transmettre au Parquet</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[420px]">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="max-w-xs">
                      <h3 className="text-base font-semibold text-slate-300">Aucun dossier en attente</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Sélectionnez un exemple ou dictez votre plainte pour lancer l'analyse par intelligence artificielle et la génération du Procès-Verbal.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ================= PILLAR 2: VIRTUAL COURTROOM & GREFFE IA ================= */}
        {activeTab === 'court' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-mono mb-2">
                  <span>Pillar 02</span>
                  <span>/</span>
                  <span>Audience Virtuelle & Greffe IA</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Salle d'Audience Sécurisée WebRTC & Greffier IA
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Visioconférence chiffrée de bout en bout avec diarisation automatique en temps réel, détection des incidents d'audience et rédaction assistée des minutes du jugement.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={hearingType}
                  onChange={(e) => setHearingType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Correctionnel - Vol et Abus de confiance">Correctionnel - Vol & Abus de confiance</option>
                  <option value="Civis - Contentieux Foncier">Contentieux Foncier OHADA</option>
                  <option value="Chambre d'Accusation">Chambre d'Accusation</option>
                </select>
                <button
                  onClick={handleStartHearing}
                  disabled={courtLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {courtLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{hearingActive ? 'Relancer l\'Audience' : 'Démarrer l\'Audience'}</span>
                </button>
              </div>
            </div>

            {/* Courtroom Viewport Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Video Feeds Simulation (8 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* President du Tribunal */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700 shadow-inner">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Président du Tribunal (Siège)</span>
                    </div>
                  </div>

                  {/* Ministère Public */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700 shadow-inner">
                      <Shield className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Ministère Public (Parquet)</span>
                    </div>
                  </div>

                  {/* Avocat Défense */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700 shadow-inner">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Avocat de la Défense</span>
                    </div>
                  </div>

                  {/* Prévenu / Témoin */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700 shadow-inner">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Prévenu / À la barre</span>
                    </div>
                  </div>

                </div>

                {/* Court Controls Bar */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono rounded-lg flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> E2E Encrypted WebRTC
                    </span>
                    <span className="text-xs text-slate-400">Latence: 42ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => alert("Micro coupé")}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg font-medium"
                    >
                      Couper Micro
                    </button>
                    <button 
                      onClick={() => alert("Audience mise en délibéré et enregistrée.")}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg font-semibold"
                    >
                      Suspendre / Clôturer
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Court Clerk Live Diarization & Minutes (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Diarization Feed */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Greffe IA — Diarisation en Direct
                    </h3>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800">
                      Actif
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                    {diarizationLogs.length > 0 ? diarizationLogs.map((log, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-amber-300">{log.speaker}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed">{log.text}</p>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-xs text-slate-500">
                        Cliquez sur "Démarrer l'Audience" pour lancer la transcription et la diarisation en direct par le Greffe IA.
                      </div>
                    )}
                  </div>
                </div>

                {/* Judgment Draft */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 shadow-xl">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    Projet de Décision / Minutes d'Audience
                  </h3>
                  <textarea
                    rows={4}
                    value={judgmentDraft}
                    onChange={(e) => setJudgmentDraft(e.target.value)}
                    placeholder="Les minutes du jugement s'afficheront ici en temps réel pour validation par le Greffier en Chef..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  ></textarea>
                  <button 
                    onClick={() => alert("Minutes signées électroniquement et enregistrées au greffe.")}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Valider & Signer Électroniquement
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= PILLAR 3: BLOCKCHAIN CASIER JUDICIAIRE ================= */}
        {activeTab === 'blockchain' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-mono mb-2">
                  <span>Pillar 03</span>
                  <span>/</span>
                  <span>Sécurité & Immutabilité</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Casier Judiciaire sur Blockchain Privée (Consortium)
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Génération des bulletins N°1, N°2 et N°3 sécurisés par arbres de Merkle, hachage SHA-256 avec salage et Zero-Knowledge Proofs pour le respect de la vie privée et le droit à l'oubli.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form (6 cols) */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-5 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  Paramètres du Citoyen & Demande de Bulletin
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300">Identifiant Citoyen (NIN)</label>
                    <input 
                      type="text"
                      value={citizenId}
                      onChange={(e) => setCitizenId(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300">Date de Naissance</label>
                    <input 
                      type="text"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">Nom et Prénom</label>
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">Type de Bulletin Demandé</label>
                  <select
                    value={bulletinType}
                    onChange={(e) => setBulletinType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="B3">Bulletin N°3 (Certificat de bonne vie et mœurs - Emploi)</option>
                    <option value="B2">Bulletin N°2 (Extrait officiel des condamnations)</option>
                    <option value="B1">Bulletin N°1 (Intégral — Dossier complet magistrats)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">Antécédents / Situation judiciaire</label>
                  <input 
                    type="text"
                    value={criminalHistory}
                    onChange={(e) => setCriminalHistory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={handleGenerateBulletin}
                  disabled={blockchainLoading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer mt-2"
                >
                  {blockchainLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  <span>Ancrer sur Blockchain & Générer le Bulletin</span>
                </button>
              </div>

              {/* Right Results (6 cols) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {bulletinResult ? (
                  <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl flex flex-col gap-5 shadow-2xl relative">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono">Certificat Cryptographique Validé</span>
                        <h3 className="text-lg font-bold text-white font-mono">Bulletin {bulletinResult.bulletinType} — {bulletinResult.fullName}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${bulletinResult.isClean ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                        {bulletinResult.isClean ? 'CASIER VIERGE' : 'MENTIONS ACTIVES'}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                      <span className="text-xs font-semibold text-slate-300">Contenu Officiel</span>
                      <p className="text-xs font-mono text-emerald-300">{bulletinResult.contentSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Hash SHA-256 :</span>
                        <span className="text-amber-400 truncate max-w-[280px]">{bulletinResult.recordHash}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Merkle Root :</span>
                        <span className="text-amber-400 truncate max-w-[280px]">{bulletinResult.merkleRoot}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Bloc Consortium :</span>
                        <span className="text-white">#{bulletinResult.blockHeight} ({bulletinResult.consensusProtocol})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Preuve ZKP :</span>
                        <span className="text-emerald-400">{bulletinResult.zkpAttestation}</span>
                      </div>
                    </div>

                    {/* QR Code Verification Simulation */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex flex-col gap-1 max-w-[260px]">
                        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-amber-400" />
                          Validation Hors Ligne par QR Code
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">Scannez ce QR code pour vérifier l'authenticité instantanée du bulletin sans divulguer les données privées.</p>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-950 flex items-center justify-center text-[8px] text-amber-400 font-mono text-center">
                          QR_SECURE
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[380px]">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div className="max-w-xs">
                      <h3 className="text-base font-semibold text-slate-300">Aucun bulletin généré</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Renseignez les informations du citoyen et cliquez sur l'ancrage blockchain pour obtenir le certificat infalsifiable.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ================= PILLAR 4: AI LEGAL ASSISTANT ================= */}
        {activeTab === 'assistant' && (
          <div className="flex flex-col gap-6 animate-fadeIn max-w-4xl mx-auto w-full">
            
            <div className="border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-mono mb-2">
                <span>Pillar 04</span>
                <span>/</span>
                <span>Intelligence Juridique</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Assistant Juridique IA — OHADA & Code Pénal
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Posez vos questions sur la jurisprudence, les infractions, les peines encourues ou les procédures applicables.
              </p>
            </div>

            {/* Chat Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-2xl overflow-hidden">
              
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400 border border-slate-700'}`}>
                      {msg.role === 'user' ? 'U' : <Scale className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs md:text-sm font-mono leading-relaxed ${msg.role === 'user' ? 'bg-amber-500 text-slate-950 font-medium' : 'bg-slate-950 text-slate-200 border border-slate-800'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-3 max-w-xl">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-950 text-slate-400 border border-slate-800 p-4 rounded-2xl text-xs font-mono flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Analyse des textes de loi et jurisprudence...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez votre question juridique (ex: Quelles sont les sanctions de l'abus de confiance selon le code pénal ?)..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600 font-mono"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Envoyer</span>
                </button>
              </form>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 px-6 text-center text-xs text-slate-500">
        <p>© 2026 E-Justice — Plateforme Judiciaire Souveraine et Intelligente. Tous droits réservés.</p>
      </footer>

    </div>
  );
}
