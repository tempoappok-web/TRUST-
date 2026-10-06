import React, { useState, useEffect, useRef } from 'react';
import { 
  Scale, Mic, Video, ShieldCheck, FileText, Globe, AlertTriangle, 
  CheckCircle2, Clock, User, Lock, Search, RefreshCw, Download, 
  Send, Sparkles, Volume2, Shield, QrCode, ArrowRight, BookOpen,
  Terminal, Server, FileCheck, Check, ChevronRight, Play, Square,
  Menu, X, Camera, CheckCircle, BarChart3, AlertOctagon, Activity, Users,
  Fingerprint, ShieldAlert, Award, TrendingUp, Layers, Key, Database,
  Cpu, FileCode2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export type UserRole = 'Greffier' | 'Juge' | 'Administrateur';

export default function App() {
  const [activeTab, setActiveTab] = useState<'complaint' | 'court' | 'blockchain' | 'assistant' | 'analytics'>('complaint');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSecurityPillarsModal, setShowSecurityPillarsModal] = useState(false);
  const [activePillarTab, setActivePillarTab] = useState<number>(0);

  // Dynamic User Role
  const [currentRole, setCurrentRole] = useState<UserRole>('Administrateur');

  // Biometric Auth State (WebAuthn / Secure Layer)
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricPendingAction, setBiometricPendingAction] = useState<(() => void) | null>(null);
  const [biometricScanning, setBiometricScanning] = useState(false);

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
  
  // Camera QR Scanner State
  const [scanningQr, setScanningQr] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scanVerifiedResult, setScanVerifiedResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pillar 4: Assistant State
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'assistant', text: 'Bonjour. Je suis votre assistant juridique E-Justice. Posez vos questions sur le Code Pénal, le Code de Procédure Pénale ou les Actes Uniformes OHADA.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Pillar 5: Warrants & Analytics State
  const [warrants, setWarrants] = useState([
    { id: 'WARR-9982-INT', name: 'Moussa Konaté', crime: 'Escroquerie en bande organisée & Blanchiment', jurisdiction: 'Dakar / Interpol Red Notice', status: 'ACTIF', date: '02/10/2026', classified: true },
    { id: 'WARR-8831-NAT', name: 'Jean-Paul Mumbere', crime: 'Détournement de deniers publics', jurisdiction: 'Kinshasa TGI', status: 'ACTIF', date: '28/09/2026', classified: true },
    { id: 'WARR-7720-LOC', name: 'Fatoumatta Diallo', crime: 'Abus de confiance aggravé', jurisdiction: 'Bamako Sud', status: 'EXECUTÉ', date: '15/09/2026', classified: false }
  ]);
  const [newWarrantName, setNewWarrantName] = useState('');
  const [newWarrantCrime, setNewWarrantCrime] = useState('');

  // The 5 Pillars of Security Data
  const securityPillars = [
    {
      id: 'confidentialite',
      title: '01. Confidentialité (Confidentiality)',
      subtitle: 'Secret de l’instruction & Chiffrement de bout en bout',
      icon: Lock,
      color: 'amber',
      status: 'ACTIF — 100%',
      cipher: 'AES-256-GCM / ChaCha20-Poly1305',
      description: 'Garantit que seuls les magistrats et greffiers accrédités ont accès aux dépositions et dossiers judiciaires.',
      specs: [
        'Chiffrement E2EE des flux audio/vidéo des audiences WebRTC',
        'Preuves à divulgation nulle de connaissance (Zero-Knowledge Proofs - ZKP) sur les bulletins',
        'Chiffrement matériel des pièces à conviction numériques',
        'Conformité stricte RGPD et souveraineté des juridictions régionales'
      ]
    },
    {
      id: 'integrite',
      title: '02. Intégrité (Integrity)',
      subtitle: 'Immuabilité absolue sur Blockchain de Consortium',
      icon: ShieldCheck,
      color: 'emerald',
      status: 'VÉRIFIÉ — MERKLE ROOT',
      cipher: 'SHA-256 / Keccak-256 / Merkle Tree',
      description: 'Empêche toute altération, falsification ou suppression illicite des procès-verbaux et casiers judiciaires.',
      specs: [
        'Ancrage cryptographique des procès-verbaux d’audience dès leur clôture',
        'Arbres de Merkle pour la vérification instantanée de l’historique des condamnations',
        'Horodatage décentralisé infalsifiable certifié par les nœuds de validation judiciaires',
        'Détection automatique de toute tentative de modification d’antécédents'
      ]
    },
    {
      id: 'disponibilite',
      title: '03. Disponibilité (Availability)',
      subtitle: 'Continuité du service public de la Justice',
      icon: Server,
      color: 'blue',
      status: 'OPÉRATIONNEL — SLA 99.99%',
      cipher: 'Consensus PoA / Byzantine Fault Tolerance (IBFT 2.0)',
      description: 'Assure l’accès permanent et ininterrompu à la justice, même en cas de panne réseau ou d’attaque DDoS.',
      specs: [
        'Architecture multi-nœuds distribuée entre ministères de la justice et cours d’appel',
        'Tolérance aux pannes byzantines jusqu’à 1/3 de nœuds défaillants ou compromis',
        'Fonctionnement résilient en mode hors-ligne avec synchronisation cryptographique différée',
        'Réplication temps réel des registres sur data centers souverains'
      ]
    },
    {
      id: 'authentification',
      title: '04. Authentification (Authentication)',
      subtitle: 'Contrôle d’identité biométrique & FIDO2 WebAuthn',
      icon: Fingerprint,
      color: 'purple',
      status: 'WEBAUTHN FIDO2 NIVEAU 3',
      cipher: 'ECDSA P-256 / Ed25519 / FIDO2 Level 3',
      description: 'Vérifie de manière irréfutable l’identité des citoyens, greffiers, avocats et magistrats.',
      specs: [
        'Authentification biométrique matérielle (TouchID, FaceID, clé de sécurité FIDO2)',
        'Contrôle d’accès dynamique basé sur les rôles (RBAC : Greffier, Juge, Administrateur)',
        'Révocation instantanée des accès en cas d’anomalie ou de compromission',
        'Chaque action critique requiert une réauthentification biométrique locale'
      ]
    },
    {
      id: 'non-repudiation',
      title: '05. Non-Répudiation (Non-Repudiation)',
      subtitle: 'Signatures électroniques qualifiées & Preuve juridique opposable',
      icon: FileCheck,
      color: 'red',
      status: 'OPPOSABLE EN JUSTICE',
      cipher: 'eIDAS Qualifié / RSA-4096 / Ed25519 Signatures',
      description: 'Empêche tout signataire (magistrat, déclarant, prévenu) de nier son consentement ou sa déposition.',
      specs: [
        'Signature électronique certifiée des procès-verbaux et minutes de jugement',
        'Journal d’audit cryptographique immuable pour chaque accès ou consultation de dossier',
        'Preuve légale recevable devant toutes les juridictions nationales et internationales',
        'Scellement chronologique des événements détectés par le Greffe IA en audience'
      ]
    }
  ];

  // Recharts Dataset 1: Monthly Complaint Growth (2026)
  const monthlyData = [
    { month: 'Jan', plaintesRecues: 1840, pvGeneres: 1720, delaiMoyenJours: 4.2 },
    { month: 'Fév', plaintesRecues: 2120, pvGeneres: 2010, delaiMoyenJours: 3.9 },
    { month: 'Mar', plaintesRecues: 2540, pvGeneres: 2430, delaiMoyenJours: 3.5 },
    { month: 'Avr', plaintesRecues: 2980, pvGeneres: 2890, delaiMoyenJours: 3.1 },
    { month: 'Mai', plaintesRecues: 3410, pvGeneres: 3340, delaiMoyenJours: 2.8 },
    { month: 'Juin', plaintesRecues: 3890, pvGeneres: 3820, delaiMoyenJours: 2.4 },
    { month: 'Juil', plaintesRecues: 4320, pvGeneres: 4210, delaiMoyenJours: 2.1 },
    { month: 'Août', plaintesRecues: 4890, pvGeneres: 4810, delaiMoyenJours: 1.8 },
    { month: 'Sept', plaintesRecues: 5410, pvGeneres: 5350, delaiMoyenJours: 1.5 },
    { month: 'Oct', plaintesRecues: 6120, pvGeneres: 6050, delaiMoyenJours: 1.2 }
  ];

  // Recharts Dataset 2: Regional Caseload Distribution
  const regionalData = [
    { region: 'Dakar', enCours: 1420, juges: 2890, tauxResolution: 67 },
    { region: 'Kinshasa', enCours: 2150, juges: 3420, tauxResolution: 61 },
    { region: 'Abidjan', enCours: 1180, juges: 2640, tauxResolution: 69 },
    { region: 'Bamako', enCours: 920, juges: 1890, tauxResolution: 67 },
    { region: 'Ouagadougou', enCours: 680, juges: 1450, tauxResolution: 68 },
    { region: 'Conakry', enCours: 790, juges: 1580, tauxResolution: 66 }
  ];

  // Recharts Dataset 3: Infraction categories share
  const infractionShare = [
    { name: 'Vol & Effraction', value: 38, color: '#f59e0b' },
    { name: 'Litiges Fonciers', value: 27, color: '#10b981' },
    { name: 'Escroquerie / Cyber', value: 21, color: '#6366f1' },
    { name: 'Voies de Fait', value: 14, color: '#ef4444' }
  ];

  // Biometric Authentication Trigger Wrapper
  const triggerBiometricAuth = (onSuccess: () => void) => {
    if (biometricAuthenticated) {
      onSuccess();
      return;
    }
    setBiometricPendingAction(() => onSuccess);
    setShowBiometricModal(true);
  };

  const executeBiometricScan = async () => {
    setBiometricScanning(true);
    if (navigator.vibrate) {
      navigator.vibrate([60, 80, 60]);
    }

    try {
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.();
        if (available) {
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
        }
      }
    } catch (e) {
      console.log("WebAuthn platform auth fallback");
    }

    setTimeout(() => {
      setBiometricScanning(false);
      setShowBiometricModal(false);
      setBiometricAuthenticated(true);
      if (biometricPendingAction) {
        biometricPendingAction();
        setBiometricPendingAction(null);
      }
    }, 1400);
  };

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

  // Handle Blockchain Bulletin Generation with Biometric Check
  const handleGenerateBulletin = async () => {
    triggerBiometricAuth(async () => {
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
    });
  };

  // Start Camera for QR Scanning
  const startQrScanner = async () => {
    setScanningQr(true);
    setScanVerifiedResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Impossible d'accéder à la caméra. Vérifiez les autorisations.");
      setScanningQr(false);
    }
  };

  // Stop Camera QR Scanner
  const stopQrScanner = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setScanningQr(false);
  };

  // Play Success Beep / Chime
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // AudioContext policy restriction ignored
    }
  };

  // Simulate successful QR code capture from camera feed with Haptic & Audio feedback
  const handleCaptureAndVerify = () => {
    if (navigator.vibrate) {
      navigator.vibrate([80, 50, 80]);
    }
    playSuccessSound();

    setTimeout(() => {
      stopQrScanner();
      setScanVerifiedResult({
        valid: true,
        citizenId: bulletinResult?.citizenId || 'CID-88492026',
        fullName: bulletinResult?.fullName || 'Amadou Diallo',
        bulletinType: bulletinResult?.bulletinType || 'B3',
        status: 'CASIER VIERGE — AUTHENTIFIÉ',
        merkleRoot: bulletinResult?.merkleRoot || '0x4f8a9e...21b',
        timestamp: new Date().toLocaleString()
      });
    }, 500);
  };

  // Download verification report as PDF with Biometric check
  const handleDownloadVerificationPdf = () => {
    triggerBiometricAuth(() => {
      if (!scanVerifiedResult) return;
      const reportContent = `==================================================
RÉPUBLIQUE — RAPPORT OFFICIEL DE VÉRIFICATION E-JUSTICE
==================================================
Date et Heure : ${scanVerifiedResult.timestamp}
Statut du Bulletin : ${scanVerifiedResult.status}
Nom et Prénom : ${scanVerifiedResult.fullName}
Identifiant Citoyen (NIN) : ${scanVerifiedResult.citizenId}
Type de Bulletin : ${scanVerifiedResult.bulletinType}
Racine de Merkle (Consortium Blockchain) : ${scanVerifiedResult.merkleRoot}
Protocole de Consensus : Private PoA (Istanbul Byzantine Fault Tolerant)
Preuve ZKP : Validée sans divulgation de données privées

SIGNATURE ÉLECTRONIQUE DU GREFFE EN CHEF :
[Signé cryptographiquement et authentifié par biométrie WebAuthn]
==================================================`;

      const blob = new Blob([reportContent], { type: 'application/pdf;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rapport_Verification_${scanVerifiedResult.citizenId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
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

  // Handle Issuing New Warrant with Biometric check (Admin only)
  const handleAddWarrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarrantName.trim() || !newWarrantCrime.trim()) return;
    if (currentRole !== 'Administrateur') {
      alert("Action refusée : Seul un Administrateur Général peut émettre une notice rouge ou un mandat.");
      return;
    }
    triggerBiometricAuth(() => {
      const newW = {
        id: `WARR-${Math.floor(1000 + Math.random() * 9000)}-INT`,
        name: newWarrantName,
        crime: newWarrantCrime,
        jurisdiction: 'Cour Suprême / Interpol',
        status: 'ACTIF',
        date: new Date().toLocaleDateString(),
        classified: true
      };
      setWarrants([newW, ...warrants]);
      setNewWarrantName('');
      setNewWarrantCrime('');
      alert("Mandat international émis, signé par biométrie WebAuthn et diffusé sur le réseau souverain.");
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 5 Pillars of Security Modal */}
      {showSecurityPillarsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 p-6 md:p-8 rounded-3xl max-w-4xl w-full flex flex-col gap-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">Architecture Souveraine</span>
                  <h2 className="text-xl font-bold text-white">Les 5 Piliers de la Sécurité Judiciaire (E-Justice)</h2>
                </div>
              </div>
              <button
                onClick={() => setShowSecurityPillarsModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {securityPillars.map((p, idx) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePillarTab(idx)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                      activePillarTab === idx 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-mono leading-tight">{p.title.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Details Card */}
            {(() => {
              const currentPillar = securityPillars[activePillarTab];
              const CurrentIcon = currentPillar.icon;
              return (
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <CurrentIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{currentPillar.title}</h3>
                        <p className="text-xs text-slate-400 font-mono">{currentPillar.subtitle}</p>
                      </div>
                    </div>
                    <span className="self-start md:self-auto px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {currentPillar.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {currentPillar.description}
                  </p>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-400">Algorithme & Chiffrement Actif :</span>
                    <span className="text-amber-300 font-bold">{currentPillar.cipher}</span>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-[11px] uppercase font-mono text-slate-400 tracking-wider">Normes & Spécifications Appliquées :</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentPillar.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">Conformité : OHADA, eIDAS, ISO 27001 & NIST-SP-800</span>
              <button
                onClick={() => setShowSecurityPillarsModal(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs transition-colors"
              >
                Compris & Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biometric Authentication Modal */}
      {showBiometricModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 p-8 rounded-3xl max-w-md w-full flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 relative">
              <Fingerprint className={`w-10 h-10 ${biometricScanning ? 'animate-pulse text-amber-300 scale-110 transition-transform' : ''}`} />
              {biometricScanning && (
                <div className="absolute inset-0 border-2 border-amber-400 rounded-2xl animate-ping opacity-30"></div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Authentification Biométrique WebAuthn</h3>
              <p className="text-xs text-slate-400 mt-1">
                Veuillez scanner votre empreinte digitale ou utiliser la reconnaissance faciale pour signer et accéder à cette action judiciaire sensible.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={executeBiometricScan}
                disabled={biometricScanning}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {biometricScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Vérification biométrique en cours...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    <span>Confirmer par Empreinte / FaceID</span>
                  </>
                )}
              </button>
              <button
                onClick={() => { setShowBiometricModal(false); setBiometricPendingAction(null); }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

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
        <nav className="hidden xl:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-full border border-slate-800">
          <button 
            onClick={() => setActiveTab('complaint')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'complaint' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            01. Plaintes Vocales
          </button>
          <button 
            onClick={() => setActiveTab('court')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'court' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            02. Audience & Greffe IA
          </button>
          <button 
            onClick={() => setActiveTab('blockchain')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'blockchain' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            03. Casier Blockchain & QR
          </button>
          <button 
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'assistant' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            04. Assistant OHADA
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            05. Hub Mandats & Analytics
          </button>
        </nav>

        {/* Zone 3: Primary Actions + Security Pillars Button + Global Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Security Pillars Trigger */}
          <button
            onClick={() => setShowSecurityPillarsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-amber-500/40 hover:border-amber-400 rounded-lg text-xs font-mono text-amber-300 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">5 Piliers Sécurité</span>
          </button>

          {/* Global Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <span className="text-[10px] text-slate-400 px-1 font-mono hidden md:inline">Rôle :</span>
            {(['Greffier', 'Juge', 'Administrateur'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setCurrentRole(r)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  currentRole === r 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => triggerBiometricAuth(() => alert("Authentification biométrique WebAuthn active et vérifiée."))}
            className="hidden sm:flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 px-3 py-1.5 rounded-lg hover:bg-amber-900/30 transition-colors cursor-pointer"
          >
            <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">{biometricAuthenticated ? 'Biométrie Active' : 'WebAuthn'}</span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Profil sélectionné :</span>
            <div className="flex gap-1">
              {(['Greffier', 'Juge', 'Administrateur'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`px-2 py-0.5 rounded text-xs font-mono ${currentRole === r ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => { setShowSecurityPillarsModal(true); setMobileMenuOpen(false); }}
            className="text-left py-2 px-3 rounded-lg text-sm font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300"
          >
            🛡️ Les 5 Piliers de la Sécurité Judiciaire
          </button>
          <button 
            onClick={() => { setActiveTab('complaint'); setMobileMenuOpen(false); }}
            className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'complaint' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
          >
            01. Plaintes Vocales
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
            03. Casier Blockchain & QR
          </button>
          <button 
            onClick={() => { setActiveTab('assistant'); setMobileMenuOpen(false); }}
            className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'assistant' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
          >
            04. Assistant OHADA
          </button>
          <button 
            onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
            className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
          >
            05. Hub Mandats & Analytics
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        
        {/* ================= PILLAR 1: VOICE COMPLAINT ================= */}
        {activeTab === 'complaint' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
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
                  Déposez votre plainte dans votre langue locale. Le système transcrit, qualifie juridiquement et génère le Procès-Verbal officiel.
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-6 flex flex-col gap-6">
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
                          setComplaintText("Enregistrement audio en cours... [Simulation micro captant le témoignage en direct]");
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

              <div className="lg:col-span-6 flex flex-col gap-6">
                {complaintResult ? (
                  <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-amber-400 font-mono">Dossier Enregistré</span>
                        <h3 className="text-lg font-bold text-white font-mono">{complaintResult.complaintId}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${complaintResult.urgency === 'URGENT' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                        {complaintResult.urgency}
                      </span>
                    </div>

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

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        Traduction & Synthèse Juridique (Français)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono">
                        {complaintResult.translatedText}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 max-h-64 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5" />
                          Procès-Verbal (PV) Certifié & Empreinte SHA-256
                        </span>
                      </div>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        {complaintResult.officialPV}
                      </pre>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => triggerBiometricAuth(() => alert("PV téléchargé au format PDF sécurisé après authentification WebAuthn."))}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Fingerprint className="w-4 h-4 text-amber-400" />
                        <span>Télécharger le PV (PDF Sécurisé)</span>
                      </button>
                      <button 
                        onClick={() => triggerBiometricAuth(() => alert("Transmis au Parquet compétent et signé par biométrie.")) }
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
                        Sélectionnez un exemple ou dictez votre plainte pour lancer l'analyse par intelligence artificielle.
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
                  Visioconférence chiffrée avec diarisation automatique en temps réel, détection des incidents et rédaction assistée des minutes.
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Président du Tribunal</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700">
                      <Shield className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Ministère Public</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Avocat de la Défense</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 border border-slate-700">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="text-xs font-medium text-white">Prévenu / À la barre</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono rounded-lg flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> E2E Encrypted WebRTC
                  </span>
                  <button onClick={() => alert("Audience close.")} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-semibold">
                    Clôturer
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Greffe IA — Diarisation en Direct
                  </h3>
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
                        Cliquez sur "Démarrer l'Audience" pour lancer la diarisation IA.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    Projet de Décision
                  </h3>
                  <textarea
                    rows={4}
                    value={judgmentDraft}
                    onChange={(e) => setJudgmentDraft(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  ></textarea>
                  <button 
                    onClick={() => triggerBiometricAuth(() => alert("Minutes signées électroniquement et validées par biométrie WebAuthn."))} 
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>Valider & Signer par Biométrie</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= PILLAR 3: BLOCKCHAIN & QR SCANNER ================= */}
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
                  Casier Judiciaire sur Blockchain & Scanner QR Caméra
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Générez des bulletins sécurisés ou utilisez le scanner QR caméra intégré pour vérifier instantanément l'authenticité d'un bulletin.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={startQrScanner}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scanner un QR Code (Caméra)</span>
                </button>
              </div>
            </div>

            {/* QR Scanner Modal / Active View with smooth scanning beam animation */}
            {scanningQr && (
              <div className="bg-slate-900 border-2 border-emerald-500/60 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl relative animate-fadeIn">
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <Camera className="w-5 h-5 animate-pulse" />
                    <span>Scanner de Bulletin QR — Caméra Active</span>
                  </div>
                  <button 
                    onClick={stopQrScanner}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    Fermer la caméra
                  </button>
                </div>

                <div className="relative w-full max-w-md aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-lg pointer-events-none flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-scan-beam"></div>
                    <span className="bg-slate-950/80 text-emerald-300 font-mono text-[10px] px-2.5 py-1 rounded absolute bottom-3 border border-emerald-500/30">
                      Alignez le QR code du bulletin
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCaptureAndVerify}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Capturer & Vérifier le Bulletin</span>
                  </button>
                  <button
                    onClick={stopQrScanner}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Scan Verified Result Modal / Banner */}
            {scanVerifiedResult && (
              <div className="bg-emerald-950/40 border border-emerald-500 p-6 rounded-2xl flex flex-col gap-4 shadow-2xl relative animate-fadeIn">
                <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>BULLETIN VÉRIFIÉ AVEC SUCCÈS — AUTHENTIQUE</span>
                  </div>
                  <button 
                    onClick={() => setScanVerifiedResult(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Fermer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/50">
                    <span className="text-slate-400 block">Citoyen :</span>
                    <span className="text-white font-bold">{scanVerifiedResult.fullName} ({scanVerifiedResult.citizenId})</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/50">
                    <span className="text-slate-400 block">Type & Statut :</span>
                    <span className="text-emerald-400 font-bold">{scanVerifiedResult.bulletinType} — {scanVerifiedResult.status}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/50">
                    <span className="text-slate-400 block">Consortium Merkle :</span>
                    <span className="text-amber-400">{scanVerifiedResult.merkleRoot}</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleDownloadVerificationPdf}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le Rapport de Vérification (PDF)</span>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
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
                  {blockchainLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                  <span>Signer par Biométrie & Ancrer sur Blockchain</span>
                </button>
              </div>

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

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex flex-col gap-1 max-w-[260px]">
                        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-amber-400" />
                          Validation Hors Ligne par QR Code
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">Scannez ce QR code pour vérifier l'authenticité instantanée du bulletin.</p>
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

              <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez votre question juridique..."
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

        {/* ================= PILLAR 5: HUB MANDATS & ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            
            {/* Header & Role Indicator */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-mono mb-2">
                  <span>Pillar 05</span>
                  <span>/</span>
                  <span>Analytics & Contrôle d'Accès RBAC</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  Analytics Juridiques & Hub des Mandats
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                  Tableaux de bord interactifs propulsés par Recharts avec contrôle d'accès dynamique par rôle (Greffier, Juge, Administrateur).
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Niveau d'accréditation</span>
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {currentRole === 'Administrateur' && '🔒 Accès Total (Admin)'}
                    {currentRole === 'Juge' && '⚖️ Juridictionnel (Juge)'}
                    {currentRole === 'Greffier' && '📝 Procédural (Greffier)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-lg">
                <span className="text-xs text-slate-400 font-mono uppercase">Plaintes Vocales (Mois)</span>
                <span className="text-2xl font-bold text-white font-mono">6,120</span>
                <span className="text-[10px] text-emerald-400 font-mono mt-1">+13.1% vs Septembre</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-lg">
                <span className="text-xs text-slate-400 font-mono uppercase">Délai Moyen Traitement</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">1.2 jours</span>
                <span className="text-[10px] text-emerald-400 font-mono mt-1">-71% grâce au Greffe IA</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-lg">
                <span className="text-xs text-slate-400 font-mono uppercase">Dossiers Régionaux Actifs</span>
                <span className="text-2xl font-bold text-white font-mono">7,140</span>
                <span className="text-[10px] text-slate-400 font-mono mt-1">6 Juridictions OHADA</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-1 shadow-lg">
                <span className="text-xs text-slate-400 font-mono uppercase">Notices Rouges / Mandats</span>
                <span className="text-2xl font-bold text-red-400 font-mono">{warrants.filter(w => w.status === 'ACTIF').length}</span>
                <span className="text-[10px] text-red-400 font-mono mt-1">
                  {currentRole === 'Greffier' ? 'Accès Restreint' : 'Diffusion Active'}
                </span>
              </div>
            </div>

            {/* RECHARTS SECTION: Monthly Growth & Regional Caseload */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Chart 1: Monthly Growth (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Évolution Mensuelle des Plaintes & PV (2026)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Volume en Temps Réel
                  </span>
                </div>

                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPlaintes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="plaintesRecues" name="Plaintes Vocales Déposées" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPlaintes)" />
                      <Area type="monotone" dataKey="pvGeneres" name="PV Certifiés Générés" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Infraction Share Pie Chart (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Répartition par Typologie d'Infraction</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Année 2026</span>
                </div>

                <div className="w-full h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={infractionShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {infractionShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                        formatter={(val: any) => [`${val}%`, 'Part']}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Chart 3: Regional Caseload Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Charge Judiciaire & Affaires Jugées par Région</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Juridictions Connectées au Hub</span>
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="region" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="enCours" name="Affaires en Cours d'Instruction" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="juges" name="Affaires Jugées et Clôturées" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ROLE RESTRICTED SECTION: Interpol & Classified Warrants */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Warrants List */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-red-400" />
                    Registre des Mandats d'Arrêt & Notices Interpol
                  </h3>
                  <div className="flex items-center gap-2">
                    {currentRole === 'Greffier' && (
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-950/40 border border-amber-800 px-2 py-0.5 rounded">
                        Mode Public Seul
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">{warrants.length} Mandats</span>
                  </div>
                </div>

                {currentRole === 'Greffier' ? (
                  <div className="flex flex-col gap-3">
                    {warrants.filter(w => !w.classified).map((w, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-300">{w.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {w.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{w.name}</h4>
                          <p className="text-xs text-slate-400">{w.crime} — <span className="text-slate-300">{w.jurisdiction}</span></p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{w.date}</span>
                      </div>
                    ))}
                    
                    <div className="bg-slate-950/70 border border-amber-500/20 p-5 rounded-xl flex items-center gap-3 text-xs text-slate-300 mt-2">
                      <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">2 Notices Rouges Masquées (Accès Restreint)</span>
                        <span>Le profil <strong>Greffier</strong> ne dispose pas de l'accréditation de niveau 2 requise pour consulter les mandats Interpol classifiés. Basculez sur le profil <strong>Juge</strong> ou <strong>Administrateur</strong> pour déverrouiller.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {warrants.map((w, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-300">{w.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${w.status === 'ACTIF' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                              {w.status}
                            </span>
                            {w.classified && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                                SECRET JUDICIAIRE
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white">{w.name}</h4>
                          <p className="text-xs text-slate-400">{w.crime} — <span className="text-slate-300">{w.jurisdiction}</span></p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono self-start md:self-center">{w.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Issue New Warrant Form (Restricted to Administrateur) */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-5 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-amber-500" />
                    Émettre un Mandat International
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${currentRole === 'Administrateur' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                    {currentRole === 'Administrateur' ? 'Autorisé' : 'Verrouillé'}
                  </span>
                </div>

                {currentRole !== 'Administrateur' ? (
                  <div className="py-8 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="max-w-xs">
                      <h4 className="text-sm font-bold text-white">Privilèges Insuffisants</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Seul le profil <strong>Administrateur</strong> avec signature biométrique WebAuthn a autorité pour émettre et diffuser des mandats sur les réseaux nationaux et Interpol.
                      </p>
                      <button
                        onClick={() => setCurrentRole('Administrateur')}
                        className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
                      >
                        Basculer en Administrateur
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddWarrant} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-300">Nom du Recherché</label>
                      <input 
                        type="text"
                        value={newWarrantName}
                        onChange={(e) => setNewWarrantName(e.target.value)}
                        placeholder="Nom et prénoms..."
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-300">Chef d'Inculpation</label>
                      <input 
                        type="text"
                        value={newWarrantCrime}
                        onChange={(e) => setNewWarrantCrime(e.target.value)}
                        placeholder="Ex: Trafic illicite, Escroquerie..."
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer mt-2"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>Signer par Biométrie & Diffuser le Mandat</span>
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 px-6 text-center text-xs text-slate-500">
        <p>© 2026 E-Justice — Plateforme Judiciaire Souveraine et Intelligente. Tous droits réservés.</p>
      </footer>

    </div>
  );
}
