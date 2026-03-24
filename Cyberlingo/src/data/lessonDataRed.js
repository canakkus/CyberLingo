export const redBeginner = {
  id: 'red-beginner',
  title: 'Red Team: Beginner Level',
  topics: [
    {
      id: 'topic1',
      title: 'Grundlegende Aufklärung & OSINT',
      content: [
        'OSINT bedeutet Open Source Intelligence – das ist die Kunst, öffentlich verfügbare Informationen so zu sammeln und zu analysieren, dass du ein vollständiges Bild über ein Ziel bekommst. Stell dir vor, du bist ein Detektiv, der nur Telefonbücher, Internetseiten und Social Media nutzt. 100% legal, weil du nur öffentliche Daten verwendest. Das ist Schritt 1 jeder Attack Chain – bevor Hacker angreifen, recherchieren sie.',
        'Warum OSINT für HTL wichtig ist\nIn deinen Projekten wie Cyber-Threat-Simulator oder IoT-Netzwerk musst du wissen:\n• Welche Subdomains hat die Ziel-Firma? (api.firma.com)\n• Welche Server sind im Internet sichtbar? (Shodan)\n• Welche Mitarbeiter sind Admins? (LinkedIn)\n• Welche Technologien nutzen sie? (Apache 2.4.29)',
        'Die 4 OSINT-Phasen (CTRP)\n1. Collection – Alle Daten sammeln (Google, Shodan, LinkedIn, etc.)\n2. Transformation – Strukturieren (Excel-Tabelle: IP, Service, Owner)\n3. Reduction – Wichtiges filtern (nur AT-Location, nur Port 22)\n4. Production – Report schreiben',
        'Passive OSINT (Target merkt NICHTS)\nDas ist der Profi-Weg – du hinterlässt keine Spuren:\nGoogle Dorks: `site:*.wien-west.htl.ac.at -www` → Alle Subdomains finden. `filetype:sql` für Datenbank-Dumps.\nCertificate Transparency Logs (crt.sh): Finde Domains via SSL-Zertifikate.\nShodan (IoT Suchmaschine): `port:22 os:Ubuntu country:AT`\nWHOIS Lookup: `whois htl.ac.at` → Admin-Emails.',
        'Active OSINT (Target merkt etwas)\nDNS Brute Force: `gobuster dns -d target.com`.\ntheHarvester: Emails und Subdomains sammeln.\nPersonensuche OSINT: LinkedIn ("IT Administrator"), HaveIBeenPwned (Leaks prüfen).',
        'Tools für Anfänger (Kali Linux)\nrecon-ng: All-in-One Framework.\nSpiderfoot: Automatisiert 100+ OSINT-Quellen.\nMaltego: Graphische Link-Analyse.\nAmass: Subdomain Enumeration.',
        'OPSEC (Operational Security)\nVPN/Tor immer nutzen bei Active Recon.\nUser-Agent ändern.\nRate Limiting: Nicht 1000 Anfragen/Minute (Cloudflare bannt).\nSeparate VM pro Target.'
      ],
      quiz: [
        {
          question: 'Was ist OSINT?',
          options: ['Open Source Intelligence', 'Operating System Intelligence', 'Offensive Security INT', 'Online Social INT'],
          correctIndex: 0
        },
        {
          question: 'Vorteil Passive OSINT?',
          options: ['Kein Footprint', 'Sehr schnell', 'Sehr genau', 'Kostenlos'],
          correctIndex: 0
        },
        {
          question: 'Subdomains mit?',
          options: ['crt.sh', 'Nmap Scan', 'Metasploit', 'Burp Suite'],
          correctIndex: 0
        },
        {
          question: 'Shodan sucht nach?',
          options: ['Exposed Internet Services', 'Social Media Profile', 'Email Listen', 'PDF Dateien'],
          correctIndex: 0
        },
        {
          question: 'Google Dork Beispiel?',
          options: ['site:*.htl.ac.at -www', 'htl.ac.at', 'google htl', 'www.htl.ac.at'],
          correctIndex: 0
        }
      ]
    },
    {
      id: 'topic2',
      title: 'Scanning & Enumeration Techniken',
      content: [
        'Scanning & Enumeration ist die zweite Phase jeder Angriffskette. Nachdem OSINT die Ziele identifiziert hat, kommt das aktive Scannen, um ein exaktes Bild vom Netzwerk, den Diensten, Versionen, Betriebssystemen und Benutzern zu bekommen. Das Ziel ist eine vollständige Karte der Angriffsfläche zu zeichnen.',
        'Arten des Network Scannings\nNetzwerk-Entdeckung: Findet alle aktiven Hosts (z.B. TCP/UDP-Pings).\nPort-Scanning: Prüft 65.535 Ports. Zustände: offen (antwortet), geschlossen (Host antwortet, aber Dienst nicht), gefiltert (Firewall blockt).\nService-Version-Erkennung: Identifiziert die exakte Software-Version (wichtig für CVEs).\nBetriebssystem-Erkennung: TCP/IP-Stack-Fingerprints wie TTL-Werte.',
        'Scanning Techniken (stealth vs laut)\nTCP SYN Scanning (Stealth): Sendet SYN, wartet auf SYN/ACK, sendet RST – minimale Spuren.\nTCP Connect Scanning: Vollständiger TCP-Handshake, hinterlässt Logs.\nUDP Scanning: UDP antwortet oft nur mit ICMP "Port Unreachable", wenn geschlossen.\nIdle/Zombie Scanning: Nutzt einen Dritten (Zombie), um das Ziel zu scannen, absolut stealthy.',
        'Enumeration – Der Detail-Angriff\nSMB-Enumeration: Extrahiert User/Shares auf Windows.\nSNMP-Enumeration: Router/Switch Infos über "public"-Community-Strings.\nLDAP-Enumeration: Active Directory User abfragen.\nWeb Directory Enumeration: Findet versteckte Ordner.',
        'OPSEC & Umgehung\nStealth Scanning mit Timing Templates, Fragmentierung und Decoy IPs.\nHoneypots und Next-Gen Firewalls erkennen oft die Scanner – daher Traffic verstecken oder VPN nutzen.'
      ],
      quiz: [
        {
          question: 'Was macht TCP SYN Scanning?',
          options: ['Halb-offene Verbindung, stealthy', 'Vollständige TCP-Verbindung', 'UDP-Pakete', 'Ping Sweep'],
          correctIndex: 0
        },
        {
          question: 'Port-State "filtered" bedeutet?',
          options: ['Firewall blockt, keine Antwort', 'Service aktiv', 'Port geschlossen', 'Host offline'],
          correctIndex: 0
        },
        {
          question: 'SMB Enumeration findet?',
          options: ['Benutzer, Shares, Policies', 'Web Apps', 'Datenbanken', 'Router Configs'],
          correctIndex: 0
        },
        {
          question: 'Stealthiest Scanning?',
          options: ['Idle Zombie Scan', 'TCP Connect', 'UDP Scan', 'Full Port Scan'],
          correctIndex: 0
        },
        {
          question: 'Warum Service Version wichtig?',
          options: ['Exakte CVE-Schwachstellen', 'Nur Diensttyp', 'OS bestimmen', 'User finden'],
          correctIndex: 0
        }
      ]
    },
    {
      id: 'topic3',
      title: 'Social Engineering & Phishing',
      content: [
        'Social Engineering ist die Kunst, Menschen psychologisch zu manipulieren, damit sie freiwillig sensible Informationen preisgeben. Es basiert auf menschlichen Schwächen wie Neugier, Angst, Autorität oder Gier. Technik ist zweitrangig – der Mensch ist immer das schwächste Glied.',
        'Psychologische Grundprinzipien\n• Reziprozität: Menschen geben zurück, was sie erhalten.\n• Knappheit: Zeitdruck erzeugt Panik ("Nur noch 2 Stunden!").\n• Autorität: Fake-Anrufe von "IT-Support" oder "Chef".\n• Sympathie und Sozialer Beweis ("Alle anderen haben die Datei schon geöffnet").',
        'Phishing Kategorien\n• Massenphishing: Millionen identischer Emails.\n• Spearphishing: Personalisiert auf eine Person/Firma.\n• Whaling: Zielt auf C-Level Executives (CEOs).\n• Vishing (Telefon), Smishing (SMS) und Quishing (QR-Codes).',
        'Technische Phishing-Tricks\nHomograph Attacks: Kyrillisches "а" statt lateinisches "a".\nURL-Verkürzer oder HTML/CSS-Manipulation, wo der Linktext anders aussieht als das Ziel.\nDoppeldateien: dokument.pdf.exe.',
        'Phishing-Ziele und Payloads\nCredential Harvesting (Login-Seiten fälschen). Malware Delivery (Ransomware/RAT). Drive-by Downloads. Command & Control.',
        'Physisches Social Engineering\nDumpster Diving (Müll durchsuchen), Shoulder Surfing (Passwörter abschreiben), Tailgating (durch Türen schlüpfen ohne Ausweis), USB Baiting (infizierte Sticks auf dem Parkplatz).'
      ],
      quiz: [
        {
          question: 'Social Engineering basiert primär auf?',
          options: ['Psychologie', 'Technischen Exploits', 'Netzwerkscans', 'Malware'],
          correctIndex: 0
        },
        {
          question: 'Welcher Phishing-Typ zielt auf Führungskräfte?',
          options: ['Whaling', 'Smishing', 'Massenphishing', 'Vishing'],
          correctIndex: 0
        },
        {
          question: 'Wirkung von Dringlichkeit?',
          options: ['Rationales Denken blockiert', 'Mehr Misstrauen', 'Ignorieren', 'Sofort melden'],
          correctIndex: 0
        },
        {
          question: 'Effektivste Abwehr?',
          options: ['Regelmäßige Phishing-Übungen', 'Antivirus-Software', 'Firewalls', 'Updates'],
          correctIndex: 0
        },
        {
          question: 'Erstes Phishing-Erkennungsmerkmal?',
          options: ['Unerwartete Passwortanfrage', 'Perfekte Rechtschreibung', 'Bekannter Absender', 'Keine Anhänge'],
          correctIndex: 0
        }
      ]
    }
  ],
  finalQuiz: [
    { type: 'mc', question: 'Was beschreibt OSINT am besten?', options: ['Das Hacken geschützter Server', 'Logs auswerten', 'Passwörter knacken', 'Das Sammeln und Analysieren öffentlich zugänglicher Informationen'], correctIndex: 3 },
    { type: 'mc', question: 'Warum ist passive OSINT so beliebt bei Angreifern?', options: ['Sie ist immer illegal', 'Extrem teuer', 'Sie hinterlässt kaum Spuren beim Ziel', 'Nur im Darknet'], correctIndex: 2 },
    { type: 'mc', question: 'Was ist das Hauptziel von Network Scanning?', options: ['Passwörter erraten', 'Viren verbreiten', 'Aktive Hosts und ihre Dienste identifizieren', 'OS installieren'], correctIndex: 2 },
    { type: 'mc', question: 'Was bedeutet Port "filtered"?', options: ['Dienst verwundbar', 'Definitiv geschlossen', 'Eine Firewall blockiert oder filtert die Pakete', 'System aus'], correctIndex: 2 },
    { type: 'mc', question: 'Was ist Social Engineering?', options: ['Design von Social-Media-Apps', 'Security-Dev', 'Manipulation von Menschen für Infos/Aktionen', 'Firewall-Programmierung'], correctIndex: 2 },
    { type: 'mc', question: 'Was unterscheidet Spear Phishing von normalem Phishing?', options: ['Nur SMS', 'Nur im LAN', 'Gezielt und persönlich zugeschnitten', 'Immer harmlos'], correctIndex: 2 },
    { type: 'mc', question: 'Typischer Hinweis auf Phishing-Mail?', options: ['Perfekte Grammatik', 'Nur PDF-Anhänge', 'Unerwartete Aufforderung, Zugangsdaten einzugeben', 'Keine Links'], correctIndex: 2 },
    { type: 'open', question: 'Erkläre OSINT und nenne zwei Quellen.', expected: 'Das Sammeln von Infos aus öffentlichen Quellen wie Suchmaschinen oder Social Media.' },
    { type: 'open', question: 'Unterschied zwischen Scanning und Enumeration?', expected: 'Scanning findet laufende Dienste/Ports, Enumeration extrahiert Details wie User, Shares, genaue Versionen.' },
    { type: 'open', question: 'Warum ist Social Engineering oft erfolgreicher als technische Angriffe?', expected: 'Es setzt bei menschlichen Schwächen an und umgeht so Firewalls und technische Hürden.' }
  ]
};

export const redAdvanced = {
  id: 'red-advanced',
  title: 'Red Team: Advanced Level',
  topics: [
    {
      id: 'topic1',
      title: 'Exploitation Grundlagen',
      content: [
        'Exploitation bedeutet, eine Schwachstelle so auszunutzen, dass ein System etwas tut, das eigentlich nicht vorgesehen ist. Ein Exploit ist der „Code“, der die Schwachstelle anspricht. Die Payload ist das, was danach auf dem System läuft (z.B. eine Reverse Shell).',
        'Begriffe: Vulnerability, Exploit, Payload\nVulnerability: Die Schwachstelle selbst.\nExploit: Das Werkzeug, das die Lücke ausnutzt.\nPayload: Das ausführbare Ziel-Paket nach dem Durchbruch.',
        'Klassische Exploit-Arten\nBuffer Overflows: Zu viele Daten im Speicher überschreiben angrenzenden Speicher (oft RIP-Register), um eigenen Code auszuführen. Gegenmaßnahmen: ASLR und DEP.\nInjection-Angriffe (SQL, Command Injection): Eingaben werden als Code interpretiert.\nLogische Exploits: Fehlende Checks (IDOR, API-Bugs).',
        'Lokale vs. Remote Exploits\nRemote Exploits: Direkter Netzwerkangriff (z.B. Webserver-Lücke).\nLokale Exploits: Der Angreifer hat bereits User-Rechte und versucht Privilege Escalation.',
        'Exploit-Lifecycle\nSchwachstelle finden → Exploit entwickeln → Payload einbinden → Post-Exploitation (Persistenz + Lateral Movement).\nSicherheitsmaßnahmen: Code Reviews, Patching, EDR-Systeme.'
      ],
      quiz: [
        {
          question: 'Was ist ein Exploit?',
          options: ['Ein Antivirenprogramm', 'Ein Backup-Tool', 'Ein Code oder eine Technik, die eine Schwachstelle gezielt ausnutzt', 'Ein Benutzerkonto'],
          correctIndex: 2
        },
        {
          question: 'Was beschreibt eine Vulnerability?',
          options: ['Ein fertiges Exploit-Skript', 'Eine Schwachstelle in Software, Hardware oder Konfiguration', 'Ein sicheres Protokoll', 'Ein Backup-Server'],
          correctIndex: 1
        },
        {
          question: 'Was ist das typische Ziel eines Buffer-Overflow-Exploits?',
          options: ['Nur das System langsamer zu machen', 'Nur Logdateien zu löschen', 'Die Programmausführung zu übernehmen, z.B. hin zu eigenem Code', 'Nur Daten zu verschlüsseln'],
          correctIndex: 2
        },
        {
          question: 'Was versteht man unter Privilege Escalation?',
          options: ['Das Ändern der IP-Adresse', 'Das Löschen von Logfiles', 'Das Erweitern von Benutzerrechten auf ein höheres Level', 'Das Neustarten eines Dienstes'],
          correctIndex: 2
        },
        {
          question: 'Wofür dient die Payload bei einem Exploit?',
          options: ['Sie verhindert Ausnutzung', 'Sie verschlüsselt Schwachstellen', 'Der Teil, der nach erfolgreicher Ausnutzung ausgeführt wird (z.B. Malware oder Shell)', 'Sie deaktiviert Accounts'],
          correctIndex: 2
        }
      ]
    },
    {
      id: 'topic2',
      title: 'Passwortangriffe & Credential Harvesting',
      content: [
        'Passwortangriffe zielen darauf ab, die Schutzschicht „Wissen“ zu brechen. Credential Harvesting sammelt systematisch Zugangsdaten (z.B. durch Keylogger oder Phishing).',
        'Typen von Passwortangriffen\nBrute-Force: Alle Kombinationen systematisch testen.\nDictionary-Angriff: Wortlisten probieren (effektiv bei schwachen Passwörtern).\nHybrid-Angriff: Wörterbuch + Ergänzungen (z.B. "Sommer2024!").\nPassword Spraying: Wenige häufige Passwörter bei vielen Nutzern probieren, um Lockouts zu entgehen.\nCredential Stuffing: Bekannte Passwörter aus Leaks auf anderen Seiten probieren.',
        'Credential Harvesting\nPhishing/Gefälschte Logins: Direkte Eingabe der Opfer.\nKeylogger: Tastatureingaben mitschneiden.\nBrowser-Dumps: Malware, die Chrome/Firefox-Passwortspeicher ausliest.\nMan-in-the-Middle.',
        'Schutzmaßnahmen\nMFA (Multi-Faktor-Authentifizierung) ist der beste Schutz! Rate-Limiting blockt Brute-Force.',
        'Gefahr der Wiederverwendung\nWenn ein User dasselbe Passwort überall nutzt, führt ein Leak zum Kompromiss aller Accounts.'
      ],
      quiz: [
        {
          question: 'Was ist ein Brute-Force-Angriff?',
          options: ['Löschen aller Passwörter', 'Verschlüsseln mit AES', 'Das systematische Ausprobieren aller möglichen Kombinationen', 'Accounts deaktivieren'],
          correctIndex: 2
        },
        {
          question: 'Unterschied Credential Stuffing / klassischer Brute-Force?',
          options: ['Nutzt nur Zahlen', 'Funktioniert nur offline', 'Nutzt geleakte Zugangsdaten statt wild zu raten', 'Braucht keinen Usernamen'],
          correctIndex: 2
        },
        {
          question: 'Was ist Credential Harvesting?',
          options: ['Passwörter erraten', 'Passwörter im Tresor sichern', 'Gezieltes Sammeln von Zugangsdaten (Phishing, Keylogs)', 'Passwörter rotieren'],
          correctIndex: 2
        },
        {
          question: 'Welche Gewohnheit macht Passwortangriffe gefährlich?',
          options: ['Passwörter aktualisieren', 'Passphrasen', 'Das Wiederverwenden desselben Passworts', 'Passwortmanager'],
          correctIndex: 2
        },
        {
          question: 'Maßnahme gegen Ausnutzung gestohlener Passwörter?',
          options: ['Kurze Passwörter', 'In Textdateien speichern', 'Multi-Faktor-Authentifizierung', 'Nur WLAN nutzen'],
          correctIndex: 2
        }
      ]
    },
    {
      id: 'topic3',
      title: 'Post Exploitation & Persistence',
      content: [
        'Nach dem Einbruch: Wie halte ich mich im System und was mache ich jetzt? Das ist Post-Exploitation. Ziel ist Privilege Escalation, Lateral Movement, Data Exfiltration und Persistence.',
        'Privilege Escalation und Lateral Movement\nVertikale Escalation: Vom Standard-User zum Admin/Root werden.\nHorizontale Escalation (Lateral Movement): Auf andere Maschinen/User "springen", um das Netzwerk zu übernehmen.',
        'Persistence: Dauerhaften Zugriff sichern\nNach einem Neustart darf der Zugang nicht verschwinden. Windows-Tricks: Registry Run-Keys, Scheduled Tasks, bösartige Services.\nLinux-Tricks: Cronjobs, SUID-Backdoors, SSH-Keys injizieren.\nEDR-Evasion: Tarnung unter legitimen Prozessnamen ("Living off the Land").',
        'Warum ist das so kritisch?\nEin erster Einbruch ist oft nur der Anfang. Erst in der Post-Exploitation-Phase wird das Active Directory übernommen, Daten gestohlen (Ransomware Double Extortion) und Spuren verwischt.'
      ],
      quiz: [
        {
          question: 'Was ist die Post-Exploitation-Phase?',
          options: ['Das erste Auffinden einer Lücke', 'Das Patchen danach', 'Alle Aktionen nach erfolgreicher Kompromittierung', 'Phishing'],
          correctIndex: 2
        },
        {
          question: 'Hauptziel von Persistence?',
          options: ['System abstürzen lassen', 'Benutzer abmelden', 'Wiederkehrenden Zugriff auf das System sicherzustellen', 'Logdateien löschen'],
          correctIndex: 2
        },
        {
          question: 'Aktivität in der Post-Exploitation?',
          options: ['OS Installation', 'Firewall anlegen', 'Lateral Movement zu weiteren Systemen', 'Gästerechte vergeben'],
          correctIndex: 2
        },
        {
          question: 'Beispiel für einen Persistence-Mechanismus?',
          options: ['Einmaliger Test-Login', 'Temporäre Datei', 'Scheduled Task/Dienst, der Malware beim Systemstart ausführt', 'Normale Textdatei'],
          correctIndex: 2
        },
        {
          question: 'Warum für Verteidiger relevant?',
          options: ['Phase vor dem Angriff', 'Harmlose Phase', 'Weil in dieser Phase der eigentliche Schaden entsteht', 'Keine Spuren bleiben'],
          correctIndex: 2
        }
      ]
    }
  ],
  finalQuiz: [
    { type: 'mc', question: 'Was ist ein Exploit im Kontext der IT-Sicherheit?', options: ['Antivirus', 'Backup', 'User Account', 'Code/Technik, die eine Schwachstelle ausnutzt'], correctIndex: 3 },
    { type: 'mc', question: 'Was beschreibt eine Vulnerability?', options: ['Logfile', 'Passwort', 'Schwachstelle in Software, Hardware, Config', 'Gepatchtes System'], correctIndex: 2 },
    { type: 'mc', question: 'Brute-Force vs Credential Stuffing?', options: ['Nur Zahlen', 'Identisch', 'Brute ratet neu, Stuffing nutzt Leaks', 'Nur offline'], correctIndex: 2 },
    { type: 'mc', question: 'Ziel von Credential Harvesting?', options: ['Verlangsamen', 'Updaten', 'Zugangsdaten sammeln', 'Passwörter schützen'], correctIndex: 2 },
    { type: 'mc', question: 'Was ist Post-Exploitation?', options: ['Scannen', 'Patchen', 'Aktionen nach Kompromittierung', 'Phishing'], correctIndex: 2 },
    { type: 'mc', question: 'Ziel von Persistence?', options: ['Abstürzen', 'Abmelden', 'Langfristigen Zugriff sichern', 'Archivieren'], correctIndex: 2 },
    { type: 'mc', question: 'Warum sind gestohlene Credentials für Post-Exploitation so wertvoll?', options: ['Schnelleres Internet', 'Firewall deaktivieren', 'Unauffällige Logins (Lateral Movement)', 'Unbesiegbar'], correctIndex: 2 },
    { type: 'open', question: 'Erkläre Vulnerability, Exploit und Payload.', expected: 'Vulnerability: Lücke. Exploit: Code-Werkzeug für die Lücke. Payload: Was danach ausgeführt wird.' },
    { type: 'open', question: 'Warum ist Passwort-Wiederverwendung gefährlich?', expected: 'Wegen Leak-Gefahr: Ein Leak bei Dienst A führt (durch Credential Stuffing) zum Hack von Dienst B.' },
    { type: 'open', question: 'Zwei Ziele der Post-Exploitation?', expected: 'Privilege Escalation und Lateral Movement (sowie Persistence einrichten).' }
  ]
};

export const redPro = {
  id: 'red-pro',
  title: 'Red Team: Pro Level',
  topics: [
    {
      id: 'topic1',
      title: 'Lateral Movement & Privilege Escalation',
      content: [
        'Vom Standard-User zum Domain-Admin. Es braucht vertikale Eskalation (zum lokalen Admin) und horizontale Eskalation (Lateral Movement).',
        'Vertikale Eskalation (Der Aufstieg)\nKernel Exploits: Lücken direkt im OS-Core.\nFehlkonfigurierte Dienste: Unquoted Service Paths in Windows.\nSUID-Bits (Linux): Dateien, die ein User mit Root-Rechten ausführt, können ausbrechen (z.B. GTFOBins).',
        'Lateral Movement (Die Reise)\nVom lokalen Admin zum DC-Admin.\nCredential Harvesting: Mimikatz nutzt lsass.exe (LSA Subsystem), um Cleartext Passwörter oder NTLM/Kerberos-Hashes aus dem RAM zu stehlen.\nPass-the-Hash (PtH): Man braucht oft gar kein Klartext-Passwort, der Hash reicht zur Authentifizierung.\nLiving off the Land Tools: PowerShell Remoting, WMI, SMB, WinRM.\nActive Directory Mapping: BloodHound zeigt den Graphen an (welcher User auf welchem Server welche Rechte hat).',
        'Verteidigung\nNetzwerk-Segmentierung (VLANs) verhindert freies Springen. EDR (Endpoint Detection) überwacht lsass.exe. Privileged Access Management (PAM).'
      ],
      quiz: [
        {
          question: 'SUID-Bit auf Linux. Was ist das Ziel?',
          options: ['Formatieren', 'Vertical Privilege Escalation', 'Internet drosseln', 'Backup'],
          correctIndex: 1
        },
        {
          question: 'Vorteil Living off the Land (LotL) bei Lateral Movement?',
          options: ['Spart Platz', 'Nutzt legitime Tools (z.B. PowerShell), wird seltener blockiert', 'Offline fähig', 'Knackt schneller'],
          correctIndex: 1
        },
        {
          question: 'Anmelden via Hash ohne Klartext-Passwort?',
          options: ['Brute-Force', 'Phishing', 'Pass-the-Hash (PtH)', 'SQL-Injection'],
          correctIndex: 2
        },
        {
          question: 'Tool für Active Directory Visualisierung (Graphentheorie)?',
          options: ['Wireshark', 'BloodHound', 'CCleaner', 'Windows Media Player'],
          correctIndex: 1
        },
        {
          question: 'Warum nützt Segmentierung gegen Lateral Movement?',
          options: ['Macht Internet schneller', 'Physischer Schutz in Racks', 'Aufbau interner Barrieren', 'Verschlüsselt alles'],
          correctIndex: 2
        }
      ]
    },
    {
      id: 'topic2',
      title: 'Advanced Persistence & C2 Frameworks',
      content: [
        'Damit ein Hacker nicht aus dem System fliegt, braucht er einen "Zweitschlüssel" (Persistence) und eine sichere Fernsteuerung (C2 Framework).',
        'Advanced Persistence: Wie man sich festbeißt\n• Registry Run Keys (HKCU/Software/Microsoft/Windows/CurrentVersion/Run)\n• Scheduled Tasks\n• Dienst-Erstellung (SYSTEM Rechte)\n• Fiese Methoden: DLL Search Order Hijacking (legitimes Programm lädt Fake-DLL), WMI Event Subscriptions (Fileless Persistence in Datenbank), Rootkits (UEFI/MBR).',
        'Command & Control (C2)\nEin infizierter PC (Agent/Beacon) fragt regelmäßig nach Befehlen (Polling).\nJitter: Fügt zufällige Zeitschwankungen hinzu, um IDS Pattern Matching zu entgehen (Sleep 60s + 10% Jitter).\nMalleable C2: Traffic sieht aus wie Google Docs oder Windows Update (Tarnung im Payload).\nFrameworks: Metasploit, Cobalt Strike, Sliver, Havoc.',
        'Kanäle & Evasion\nDNS Tunneling: Nutzt DNS-Anfragen, um Daten rauszuschmuggeln. Oft erlaubt von Firewalls.\nCloud-Hiding: Tarnt C2 Traffic zu legalen Cloud-Services wie Dropbox oder Slack (Domain Fronting/API Missbrauch).'
      ],
      quiz: [
        {
          question: 'Methode, um Malware beim Systemstart als SYSTEM laufen zu lassen?',
          options: ['Registry HKCU', 'Windows-Dienst (Service)', 'Verknüpfung', 'Autostart Ordner'],
          correctIndex: 1
        },
        {
          question: 'Was ist "Jitter" im C2-Traffic?',
          options: ['Download-Takt', 'Zufällige Variation der Polling-Zeiten zur Tarnung', 'Zittern des Bildschirms', 'Verschlüsselung'],
          correctIndex: 1
        },
        {
          question: 'Beliebtes Profi-C2-Framework mit Beacons?',
          options: ['Windows Defender', 'Cobalt Strike', 'Wireshark', 'Nmap'],
          correctIndex: 1
        },
        {
          question: 'Verstecken von Traffic in legitimen Protokollen?',
          options: ['Schnellste Transferart', 'DNS Tunneling wird oft von Firewalls zugelassen', 'Festplattenverschlüsselung', 'Ping-Sweep'],
          correctIndex: 1
        },
        {
          question: 'DLL Search Order Hijacking Prinzip?',
          options: ['Mehr Arbeitsspeicher', 'Ein legitimes Programm lädt fälschlicherweise eine böse Kopie einer DLL', 'Passwörter löschen', 'Formatierung'],
          correctIndex: 1
        }
      ]
    },
    {
      id: 'topic3',
      title: 'Living off the Land & Evasion Techniques',
      content: [
        'Moderne EDRs erkennen fast jede traditionelle Malware. Die Antwort: LotL (Living off the Land) und Fileless Malware – die Ausnutzung von On-Board-Werkzeugen.',
        'Living off the Land Binaries (LOLBins)\nTools wie PowerShell, WMI oder Certutil.exe, die Microsoft digital signiert hat.\nHäufig genutzt zum Downloaden von Scripts, Ausführen von in-memory Payloads (ohne Festplattenberührung).',
        'Evasion Techniques (Verschleierung)\nObfuskation: Skripte werden unlesbar gemacht, variablen kryptisch benannt und mit Base64 verpackt.\nProcess Injection/Hollowing: Schadcode in einen laufenden notepad.exe- oder svchost.exe-Speicher injizieren.\nAMSI Bypass: Das Anti-Malware Scan Interface (AMSI) wird von PowerShell direkt beim Start durch Memory Patching "geblendet".\nAnti-Sandbox: Malware prüft Mausbewegung/Wartezeiten (Environmental Keying) bevor sie entpackt wird.'
      ],
      quiz: [
        {
          question: 'Merkmal eines LotL-Angriffs?',
          options: ['Physische Werkzeuge', 'Ausschließlich vorinstallierte, legitime Systemprogramme', 'Strom abschalten', 'Keylogger Hardware'],
          correctIndex: 1
        },
        {
          question: 'Tool für eigentlich Zertifikate, missbraucht für Downloads?',
          options: ['Notepad.exe', 'Certutil.exe', 'Calc.exe', 'Ping.exe'],
          correctIndex: 1
        },
        {
          question: 'Was ist Process Injection?',
          options: ['Festplatte zerstören', 'Schadcode in bereits laufende, legitime Prozesse injizieren', 'Einen neuen User anlegen', 'Log löschen'],
          correctIndex: 1
        },
        {
          question: 'Zweck von Obfuskation?',
          options: ['Schneller', 'Tarnung vor Scannern und Analysten', 'Weniger Bytes', 'Höhere Auflösung'],
          correctIndex: 1
        },
        {
          question: 'Malware wartet auf Mausbewegung. Wie nennt man das?',
          options: ['Overclocking', 'Anti-Sandbox / Environmental Keying', 'Social Engineering', 'Pass-the-Hash'],
          correctIndex: 1
        }
      ]
    }
  ],
  finalQuiz: [
    { type: 'mc', question: 'Vertical Privilege Escalation?', options: ['Horizontal', 'Standard-User erhält Admin', 'Lateral', 'Data Exfiltration'], correctIndex: 1 },
    { type: 'mc', question: 'Pass-the-Hash?', options: ['Brute-Force', 'Anmelden ohne Klartext-Passwort', 'Verschlüsseln', 'RAM löschen'], correctIndex: 1 },
    { type: 'mc', question: 'Jitter in C2-Beacons?', options: ['Beschleunigen', 'Signale unregelmäßig (Anti-Detection)', 'CPU Last senken', 'Firewall hacken'], correctIndex: 1 },
    { type: 'mc', question: 'Typische Persistence in Windows?', options: ['Verlauf löschen', 'Scheduled Task/Run Key für Malware', 'Desktop ändern', 'Herunterfahren'], correctIndex: 1 },
    { type: 'mc', question: 'Living off the Land?', options: ['Eigene Tools', 'Ausschließlich bordeigene Werkzeuge (LOLBins)', 'Kein Strom', 'Land-Router'], correctIndex: 1 },
    { type: 'mc', question: 'Process Injection Vorteil?', options: ['Internet schnell', 'Tarnung in notepad.exe/svchost.exe', 'Löscht Backups', 'Ausloggen'], correctIndex: 1 },
    { type: 'mc', question: 'DNS Tunneling?', options: ['Oft nicht blockiert', 'Sicherste Algo', 'Ändert IP', 'Spart Strom'], correctIndex: 0 },
    { type: 'open', question: 'Schritte vom Standard-User zum Domain-Admin?', expected: 'Local Privilege Escalation → Credential Harvesting (Mimikatz) → Lateral Movement (PtH).' },
    { type: 'open', question: 'Warum schützt Segmentierung?', expected: 'Baut interne Firewalls, die Lateral Movement eines kompromittierten Users blockieren.' },
    { type: 'open', question: 'Problem mit Fileless Malware?', expected: 'Existiert oft nur im RAM. Klassische Scanner, die Dateisignaturen prüfen, finden nichts.' }
  ]
};
