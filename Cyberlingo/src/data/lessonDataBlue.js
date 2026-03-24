export const blueBeginner = {
  id: 'blue-beginner',
  title: 'Blue Team: Beginner Level',
  topics: [
    {
      id: 'topic1',
      title: 'IT-Sicherheit Grundlagen & CIA-Triade',
      content: [
        'IT-Sicherheit umfasst den Schutz von IT-Systemen, Netzwerken, Daten und Geräten vor Bedrohungen wie Hacking, Malware oder Ausfällen. Die Grundlagen basieren auf Prinzipien wie Risikoanalyse, technischen Maßnahmen (z. B. Firewalls, Verschlüsselung) und organisatorischen Schritten (z. B. Schulungen). Für deine HTL-Studien und Projekte wie den Cyber-Threat-Simulator ist das essenziell, um sensible Daten in IoT-Systemen oder Netzwerken zu schützen.',
        'Was ist IT-Sicherheit?\nIT-Sicherheit schützt digitale Assets vor unbefugtem Zugriff, Manipulation oder Zerstörung. Sie umfasst Hardware, Software, Netzwerke und Daten und berücksichtigt Bedrohungen wie Phishing, Ransomware oder DDoS-Angriffe. Wichtige Maßnahmen sind Updates, starke Passwörter, Backups und Multi-Faktor-Authentifizierung (MFA).',
        'CIA-Triade: Die Kernprinzipien\nDie CIA-Triade (Confidentiality, Integrity, Availability) ist das zentrale Modell der Informationssicherheit und definiert drei Schutzziele. Diese Säulen sind miteinander verknüpft und bilden die Basis für alle Sicherheitsstrategien, ergänzt durch Standards wie BSI-IT-Grundschutz oder ISO 27001.',
        'Vertraulichkeit (Confidentiality)\nVertraulichkeit stellt sicher, dass nur autorisierte Personen auf Daten zugreifen können. Maßnahmen: Verschlüsselung (z. B. AES), Zugriffssteuerung und VPNs. Beispiel: Deine Raspberry-Pi-Daten im IoT-Projekt bleiben vor Spionage geschützt.',
        'Integrität (Integrity)\nIntegrität gewährleistet, dass Daten vollständig, korrekt und unverändert bleiben. Schutz vor Manipulation durch Hash-Funktionen, digitale Signaturen oder Checksums. Beispiel: In deinem Netzwerkprojekt verhindert das Änderungen an Konfigurationsdateien.',
        'Verfügbarkeit (Availability)\nVerfügbarkeit bedeutet, dass Systeme und Daten jederzeit für Berechtigte zugänglich sind. Gegenmaßnahmen: Redundanz, DDoS-Schutz und Backups. Beispiel: Dein Cyber-Threat-Simulator läuft auch bei Ausfällen weiter.',
        'Erweiterte Aspekte\nManchmal wird die Triade um Authentizität erweitert. In der Praxis analysierst du Risiken (Bedrohungen x Vulnerabilities x Impact) und implementierst Schichten: Physisch (Zugangssicherung), Technisch (Firewalls, IDS/IPS) und Organisatorisch (Awareness-Trainings). Für Schulprojekte: Starte mit BSI-Grundschutz-Katalogen für praktische Umsetzung.'
      ],
      quiz: [
        {
          question: 'Was steht "C" in der CIA-Triade?',
          options: ['Compliance', 'Control', 'Confidentiality (Vertraulichkeit)', 'Communication'],
          correctIndex: 2
        },
        {
          question: 'Welche Maßnahme schützt primär die Integrität (Integrity) von Daten?',
          options: ['Firewalls', 'Hash-Funktionen oder digitale Signaturen', 'Backups', 'VPNs'],
          correctIndex: 1
        },
        {
          question: 'Was bedeutet Verfügbarkeit (Availability) in der CIA-Triade?',
          options: ['Daten sind vor Manipulation geschützt', 'Nur Berechtigte haben Zugriff', 'Daten und Systeme sind jederzeit zugänglich', 'Daten werden verschlüsselt'],
          correctIndex: 2
        },
        {
          question: 'Welche Bedrohung verletzt hauptsächlich die Vertraulichkeit?',
          options: ['Phishing oder unbefugter Zugriff', 'DDoS-Angriff', 'Ransomware', 'Hardware-Ausfall'],
          correctIndex: 0
        },
        {
          question: 'Welches IT-Sicherheitsprinzip wird durch starke Passwörter und MFA unterstützt?',
          options: ['Integrität', 'Vertraulichkeit', 'Verfügbarkeit', 'Authentizität'],
          correctIndex: 1
        }
      ]
    },
    {
      id: 'topic2',
      title: 'Authentifizierung & Account-Sicherheit',
      content: [
        'Authentifizierung und Account-Sicherheit sind zentrale Säulen der IT-Sicherheit, um unbefugten Zugriff zu verhindern. Sie unterscheiden sich von Autorisierung: Authentifizierung prüft "Wer bist du?", während Autorisierung klärt "Was darfst du?". Für deine HTL-Projekte wie Netzwerke oder den Cyber-Threat-Simulator sind starke Accounts essenziell, z. B. mit MFA in SSH oder IoT-Logins.',
        'Theorie: Authentifizierung\nAuthentifizierung überprüft die Identität von Nutzern, Geräten oder Diensten durch Faktoren wie Wissen (Passwort), Besitz (Token) oder Eigenschaft (Biometrie). Typen: Single-Factor (nur Passwort, unsicher), Two-Factor (2FA) oder Multi-Factor-Authentifizierung (MFA, empfohlen). Protokolle: SAML für SSO, FIDO2 für passwortlos oder Kerberos in Active Directory.',
        'Theorie: Account-Sicherheit\nAccount-Sicherheit umfasst Best Practices wie Principle of Least Privilege (minimale Rechte), regelmäßige Passwort-Rotation und Deaktivierung inaktiver Konten. Vermeide Standard-Passwörter, nutze Passwort-Manager und monitore Logins. Häufige Risiken: Credential Stuffing, Phishing oder schwache Service-Accounts in Projekten.',
        'Praktische Maßnahmen\n• Passwörter: Mind. 12 Zeichen, komplex (Groß-/Kleinbuchstaben, Zahlen, Symbole), keine Wiederverwendung.\n• MFA aktivieren: App (z. B. Authenticator), Hardware-Token oder SMS – blockt 99% der Account-Hacks.\n• Überwachen: Audit Logs prüfen, Anomalien erkennen (z. B. mit Tools wie ADAudit Plus).\nIn Wien-West-Projekten: MFA für Hyper-V-VMs oder GitHub-Accounts einrichten.'
      ],
      quiz: [
        {
          question: 'Was ist der Hauptzweck der Authentifizierung?',
          options: ['Zugriffsrechte verteilen', 'Identität eines Nutzers prüfen', 'Daten verschlüsseln', 'Backups erstellen'],
          correctIndex: 1
        },
        {
          question: 'Welcher Faktor gehört zur MFA (Multi-Factor-Authentifizierung)?',
          options: ['Nur Passwort', 'Smartphone-App + Passwort', 'Firewall', 'Antivirus'],
          correctIndex: 1
        },
        {
          question: 'Was besagt das Principle of Least Privilege?',
          options: ['Konten nur minimale Rechte geben', 'Alle Rechte für Admins', 'Passwörter teilen', 'Keine Logs führen'],
          correctIndex: 0
        },
        {
          question: 'Welche Bedrohung zielt auf Account-Sicherheit ab?',
          options: ['Virus-Scan', 'Phishing für Passwörter', 'Hardware-Update', 'Netzwerk-Switch'],
          correctIndex: 1
        },
        {
          question: 'Welches Protokoll wird für SSO-Authentifizierung genutzt?',
          options: ['HTTP', 'SAML', 'FTP', 'SMTP'],
          correctIndex: 1
        }
      ]
    },
    {
      id: 'topic3',
      title: 'Netzwerksicherheit Grundlagen',
      content: [
        'Netzwerksicherheit schützt Netzwerke vor unbefugtem Zugriff, Angriffen und Ausfällen, essenziell für deine HTL-Projekte wie das virtuelle Schulnetzwerk oder IoT mit Raspberry Pi. Sie basiert auf Schichten (Perimeter, Internal, Cloud) und kombiniert Hardware, Software und Policies. Häufige Bedrohungen sind DDoS, Man-in-the-Middle oder Port-Scans – Grundlage ist das Defense-in-Depth-Prinzip mit mehreren Verteidigungslinien.',
        'Theorie: Grundlagen Netzwerksicherheit\nNetzwerksicherheit umfasst den Schutz von Daten in Übertragung, Geräten und Infrastruktur durch Konfidentialität, Integrität und Verfügbarkeit (CIA). Wichtige Modelle: OSI-Schichten (Layer 3-7 relevant) und Purdue-Modell für industrielle Netze. Risiken entstehen durch offene Ports, schwache Protokolle (z.B. Telnet) oder ungesicherte WLANs. Ziele: Traffic filtern, Anomalien erkennen und Zero-Trust-Architektur (nie blind vertrauen).',
        'Netzwerk-Architektur & Zonen\nNetzwerke gliedern sich in DMZ (Demilitarisierte Zone für öffentliche Services), Internal-Netz (geschützt) und VLANs zur Segmentierung. VLANs trennen Traffic logisch (z.B. IoT von Admin-Netz). Subnetting (z.B. 192.168.1.0/24) minimiert Broadcast-Domains und Angriffsflächen. In Schulprojekten: Hyper-V mit VLAN-Tags für simulierte Netze nutzen.',
        'Kerntechnologien\n• Firewalls: Stateful Inspection (prüft Sessions) vs. Next-Gen (App-Control, IPS). Regeln: Allow/deny nach IP, Port, Protokoll (z.B. Block ICMP für Ping-Floods).\n• IDS/IPS: Intrusion Detection (passiv warnt), Prevention (blockt aktiv). Signaturen vs. Anomalie-basiert.\n• VPNs: IPsec (Tunnel/Secure Transport) oder OpenVPN für sichere Remote-Zugriffe.\n• NAC (Network Access Control): Prüft Geräte vor Einlass (z.B. 802.1X mit RADIUS).',
        'Bedrohungen & Gegenmaßnahmen\n• DDoS: Volumen-Angriffe überfluten Bandbreite – Mitigation via Rate-Limiting, Cloud-Scrubber (z.B. Cloudflare).\n• Man-in-the-Middle (MitM): ARP-Poisoning oder SSL-Strip – ARP-Schutz, HSTS/HTTPS.\n• Port-Scanning: Nmap-Tools – Honeypots als Köder, Fail2Ban für Auto-Bans.\n• WLAN-Sicherheit: WPA3 > WPA2, EAP für Enterprise, deaktiviere WPS. Guest-Netz isolieren.',
        'Praktische Umsetzung (für HTL)\nStarte mit Wireshark für Traffic-Analyse, pfSense als Free-Firewall-VM. In Projekten: Port-Knocking für SSH (z.B. knockd auf Linux), Segmentierung via pfSense-Regeln. Monitor mit Zabbix oder ELK-Stack. Best Practices: Least Privilege (keine offenen RDP-Ports), regelmäßige Vulnerability-Scans (Nessus/OpenVAS), Zero-Trust (jeder Request verifizieren).'
      ],
      quiz: [
        {
          question: 'Was ist der Zweck einer Firewall?',
          options: ['Daten verschlüsseln', 'Traffic nach Regeln filtern', 'Backups machen', 'User authentifizieren'],
          correctIndex: 1
        },
        {
          question: 'Welches Protokoll schützt VPN-Verbindungen?',
          options: ['HTTP', 'IPsec', 'FTP', 'SNMP'],
          correctIndex: 1
        },
        {
          question: 'Was bewirkt VLAN-Segmentierung?',
          options: ['Trennt Netzwerk-Traffic logisch', 'Erhöht Bandbreite', 'Verschlüsselt Daten', 'Speichert Logs'],
          correctIndex: 0
        },
        {
          question: 'Welcher Angriff zielt auf Verfügbarkeit ab?',
          options: ['Phishing', 'DDoS', 'SQL-Injection', 'Buffer Overflow'],
          correctIndex: 1
        },
        {
          question: 'Was ist Zero-Trust?',
          options: ['Alle Netzwerkgeräte voll vertrauen', 'Perimeter-Verteidigung maximieren', 'Jede Anfrage explizit autorisieren', 'Offene Ports erlauben'],
          correctIndex: 2
        }
      ]
    }
  ],
  finalQuiz: [
    { type: 'mc', question: 'Was steht "I" für in der CIA-Triade?', options: ['Integrity (Integrität)', 'Identification', 'Internet', 'Installation'], correctIndex: 0 },
    { type: 'mc', question: 'Welche Maßnahme unterstützt Verfügbarkeit?', options: ['Verschlüsselung', 'Backups', 'Hashing', 'Passwortrichtlinie'], correctIndex: 1 },
    { type: 'mc', question: 'Was ist MFA?', options: ['Multi-Firewall-Auth', 'Multi-Factor-Authentifizierung', 'Mainframe-Access', 'Manual File Audit'], correctIndex: 1 },
    { type: 'mc', question: 'Best Practice für Passwörter?', options: ['Kurze, einfache Wörter', 'Mind. 12 Zeichen, komplex', 'Wiederverwenden', 'Teilen mit Kollegen'], correctIndex: 1 },
    { type: 'mc', question: 'Zweck einer Firewall?', options: ['Daten speichern', 'Traffic filtern', 'User trainieren', 'Hardware reparieren'], correctIndex: 1 },
    { type: 'mc', question: 'Was ist Zero-Trust?', options: ['Alles vertrauen', 'Jede Anfrage verifizieren', 'Offene Ports', 'Single-Factor'], correctIndex: 1 },
    { type: 'mc', question: 'Principle of Least Privilege bedeutet?', options: ['Minimale Rechte vergeben', 'Alle Rechte für alle', 'Keine Logs', 'Standard-Passwörter'], correctIndex: 0 },
    { type: 'open', question: 'Nenne die 3 Säulen der CIA-Triade und ein Beispiel-Maßnahme pro Säule.', expected: 'Confidentiality (Verschlüsselung), Integrity (Hashing), Availability (Redundanz/Backups)' },
    { type: 'open', question: 'Warum ist MFA wichtiger als nur Passwörter?', expected: 'MFA erfordert zusätzlichen Faktor (z.B. App), blockt Diebstahl von Credentials (99% Angriffe)' },
    { type: 'open', question: 'Erkläre kurz den Unterschied zwischen IDS und IPS.', expected: 'IDS erkennt/warnt vor Angriffen (passiv), IPS blockt aktiv (z.B. Traffic droppen)' }
  ]
};

export const blueAdvanced = {
  id: 'blue-advanced',
  title: 'Blue Team: Advanced Level',
  topics: [
    {
      id: 'topic1',
      title: 'Protokolle, TLS & Verschlüsselung',
      content: [
        'Protokolle, TLS und Verschlüsselung sind fundamentale Bausteine der IT-Sicherheit, die Datenübertragung schützen und für deine HTL-Projekte (z.B. sichere IoT-Kommunikation mit Raspberry Pi oder Web-Apps) unverzichtbar sind. Sie verhindern Abhören (Eavesdropping), Manipulation und Fakes durch mathematische Algorithmen und standardisierte Protokolle.',
        'Theorie: Sicherheitsprotokolle\nSicherheitsprotokolle wie TLS/SSL, IPsec oder SSH sichern Datenströme in Netzwerken. Sie arbeiten auf OSI-Layern 3–7: Transport (TLS), Netzwerk (IPsec) oder Anwendung (HTTPS). Kernaufgabe: Key Exchange, Verschlüsselung und Integritätsprüfung. Schwache Protokolle wie Telnet/SMTP (plain text) sind tabu – immer TLS 1.3 oder höher nutzen.',
        'TLS (Transport Layer Security)\nTLS ist der Nachfolger von SSL und schützt Web-Verbindungen (HTTPS), E-Mails (SMTPS) oder APIs. Handshake-Prozess:\n1. ClientHello: Client schlägt Cipher-Suites vor.\n2. ServerHello: Server wählt Suite, sendet Zertifikat.\n3. Key Exchange: Diffie-Hellman (ECDHE) oder RSA für Session-Key.\n4. Finished: Beide encrypten mit neuem Key – Forward Secrecy garantiert.\nTLS 1.3 (aktuell) eliminiert schwache Ciphers.',
        'Verschlüsselung: Symmetrisch vs. Asymmetrisch\n• Symmetrisch: Ein Key für Encrypt/Decrypt (schnell). Algos: AES-256, ChaCha20.\n• Asymmetrisch: Public/Private-Key-Paar (sicherer Austausch). RSA (2048+ Bit), ECC (kleinere Keys, schneller).\n• Hybride: TLS kombiniert asymmetrisch (Key-Austausch) + symmetrisch (Daten). Perfect Forward Secrecy (PFS) via Ephemeral Keys.',
        'Hash-Funktionen & Signaturen\n• Hashing: Einweg-Funktion für Integrität. SHA-256/SHA-3. HMAC: Hash + Secret Key.\n• Digitale Signaturen: Private Key signiert Hash – Public Key verifiziert (non-repudiation).\n• PKI (Public Key Infrastructure): CAs signieren Zertifikate. CRL/OCSP prüft Gültigkeit.',
        'Praktische Umsetzung (HTL-Projekte)\n• HTTPS einrichten: Nginx/Apache mit Certbot (ACME). Force HSTS.\n• IoT: MQTT over TLS, AES für Sensor-Daten.\n• Tools: OpenSSL, Wireshark, Nmap.\n• Best Practices: Cipher-Priorität (TLS 1.3 first), Zertifikat-Pinning, keine Self-Signed in Prod.'
      ],
      quiz: [
        {
          question: 'Was schützt TLS primär?',
          options: ['Dateien lokal', 'Daten in Übertragung', 'Hardware', 'Backups'],
          correctIndex: 1
        },
        {
          question: 'Unterschied symmetrisch/asymmetrisch?',
          options: ['Symmetrisch: 1 Key (schnell), asymmetrisch: Key-Paar', 'Symmetrisch: Public Key', 'Asymmetrisch: Immer AES', 'Kein Unterschied'],
          correctIndex: 0
        },
        {
          question: 'Welcher Algo für moderne TLS-Keys?',
          options: ['DES', 'ECDHE (Elliptic Curve Diffie-Hellman)', 'MD5', 'WEP'],
          correctIndex: 1
        },
        {
          question: 'Zweck von Hash-Funktionen?',
          options: ['Verschlüsseln', 'Integrität prüfen', 'Komprimieren', 'Authentifizieren'],
          correctIndex: 1
        },
        {
          question: 'Was ist TLS-Handshake?',
          options: ['Key-Austausch + Cipher-Vereinbarung', 'Passwort-Check', 'Firewall-Regel', 'DNS-Lookup'],
          correctIndex: 0
        }
      ]
    },
    {
      id: 'topic2',
      title: 'Betriebssysstem-Sicherheit (Windows/Linux)',
      content: [
        'Betriebssystem-Sicherheit für Windows und Linux schützt das Herzstück deiner IT-Systeme vor Exploits, Malware und Privilege Escalation – super relevant für deine HTL-Projekte mit Hyper-V, Ubuntu-VMs oder Raspberry Pi. Beide OS folgen Defense-in-Depth, unterscheiden sich aber in Architektur: Linux (modular, Root-Privileges) ist oft sicherer durch Standard-User-Rechte, Windows punktet mit integrierten Tools wie Defender. Fokus: Least Privilege, Updates und Hardening.',
        'Theorie: Windows-Sicherheit\nWindows (aktuell Win11/Server 2025) nutzt UAC (User Account Control) für Admin-Elevation, BitLocker für Full-Disk-Encryption und Windows Defender (AV + EDR). Schwachstellen: Legacy-Support (SMBv1), Registry-Exploits, PowerShell-Missbrauch.\nHardening-Schritte:\n• AppLocker/WDAC: Whitelisting von Apps/Scripts.\n• Group Policy: Passwort-Policies, RDP deaktivieren (Port 3389).\n• Updates: WSUS oder automatische Patches.',
        'Theorie: Linux-Sicherheit\nLinux basiert auf User/Root-Modell (sudo), AppArmor/SELinux für Mandatory Access Control (MAC) und iptables/nftables als Firewall. Vorteile: Open-Source, Paket-Manager. Häufige Risiken: SUID-Binaries, Cron-Jobs, SSH-Brute-Force.\nHardening-Schritte:\n• User Management: useradd -m, kein Root-Login (PermitRootLogin no in sshd_config).\n• Firewall: ufw enable oder firewalld.\n• Kernel-Hardening: sysctl für ASLR, unattended-upgrades.',
        'Vergleich: Windows vs. Linux\nPrivileges: UAC popups (Windows) vs Strict Root via sudo (Linux).\nUpdates: Automatisch (Windows) vs Granular (Linux apt).\nAV: Defender integriert (Windows) vs ClamAV optional (Linux).\nFirewall: Windows Firewall vs iptables/nft.\nLogging: Event Viewer vs journalctl.\nEncryption: BitLocker vs LUKS.',
        'Praktische Umsetzung (HTL-Projekte)\n• Hyper-V (Windows): Secure Boot aktivieren, VM-Isolation, Credential Guard.\n• Raspberry Pi (Linux): raspi-config → Boot/SSH sichern, unattended-upgrades.\n• Lab-Setup: Proxmox VE (Linux-Hypervisor) mit VLANs, Windows-VMs mit AppLocker testen.\n• Monitoring: OSSEC (Host-IDS) für beide, ELK-Stack für Logs.'
      ],
      quiz: [
        {
          question: 'Was schützt UAC in Windows?',
          options: ['Dateien verschlüsseln', 'Admin-Rechte abfragen', 'Netzwerk blocken', 'Updates installieren'],
          correctIndex: 1
        },
        {
          question: 'Wie wird Root-Login in Linux gesperrt?',
          options: ['PermitRootLogin no in sshd_config', 'UAC aktivieren', 'BitLocker', 'Defender'],
          correctIndex: 0
        },
        {
          question: 'Welches Tool für Linux File-Integrity?',
          options: ['Event Viewer', 'AIDE', 'Sysmon', 'WSUS'],
          correctIndex: 1
        },
        {
          question: 'Was ist SELinux/AppArmor?',
          options: ['Mandatory Access Control', 'AV-Scanner', 'Firewall', 'Passwort-Manager'],
          correctIndex: 0
        },
        {
          question: 'Best Practice für beide OS?',
          options: ['Least Privilege (kein Admin/Root daily)', 'Root/UAC deaktivieren komplett', 'Automatische Admin-Logins', 'Legacy-Protokolle nutzen'],
          correctIndex: 0
        }
      ]
    },
    {
      id: 'topic3',
      title: 'Netzwerkdienste & Hardening',
      content: [
        'Betriebssystem-Sicherheit schützt das Kernsystem vor Malware, Privilege Escalation und Exploit-Chains. Beide Systeme nutzen Defense-in-Depth, unterscheiden sich aber grundlegend: Windows setzt auf integrierte Tools + User Account Control, Linux auf modularen Root-Zugriff + Open-Source-Patches.',
        'Windows-Sicherheit: Konzepte & Tools\nWindows schützt durch UAC (User Account Control). Windows Defender kombiniert Antivirus + Endpoint Detection (EDR) mit Cloud-Scans und Behavioral Analysis. BitLocker verschlüsselt Festplatten mit TPM 2.0. Schwachstellen: Legacy-Protokolle (SMBv1), PowerShell-Missbrauch, Registry-Hijacking.\nHardening Windows:\n• AppLocker/WDAC: Nur signierte Apps erlauben\n• Group Policy: secpol.msc → Passwort-Komplexität, RDP-Port sperren\n• Sysmon + Event Viewer überwachen\n• LAPS: Local Admin Passwort zentral verwalten',
        'Linux-Sicherheit: Root-Schutz & Kernel-Hardening\nLinux trennt User (standardmäßig) von Root (sudo oder su). Jeder Befehl mit Root-Rechten wird explizit freigegeben. AppArmor/SELinux enforcen Mandatory Access Control.\nHardening Linux:\n• User-Management: useradd -m -G sudo, Root-Login sperren\n• Firewall: ufw enable\n• Kernel-Parameter: sysctl -w kernel.kptr_restrict=2, ASLR aktiv\n• Fail2Ban: SSH-Bruteforce-IPs sperren\n• Unattended-Upgrades',
        'Gemeinsame Bedrohungen & Gegenmaßnahmen\nPrivilege Escalation: Windows (Token Kidnapping), Linux (Dirty COW, SUID-Binaries). Lösung: Least Privilege, sudo -l prüfen.\nMalware: Windows (Trojans via Office-Makros), Linux (Cryptominer via Cron). Lösung: clamav scan, rkhunter Rootkits.\nLateral Movement: SMB/SSH-Hopping. Lösung: RDP/SSH nur via VPN, Passwort-Ablauf.',
        'Praktische HTL-Projekte\nHyper-V Lab: Secure Boot aktivieren, Credential Guard.\nRaspberry Pi: raspi-config → SSH + Boot sichern, apt install fail2ban ufw unattended-upgrades.\nUbuntu Server: apt install apparmor apparmor-profiles, aa-enforce.',
        'Monitoring & Incident Response\nWindows: wevtutil qe Security (letzte 50 Security-Events), Autoruns.\nLinux: journalctl -u ssh -f (Live SSH-Logs), lastb (fehlgeschlagene Logins), aide --check (File-Changes).'
      ],
      quiz: [
        {
          question: 'Was bewirkt UAC in Windows?',
          options: ['Fragt vor Admin-Rechten nach', 'Verschlüsselt Dateien', 'Blockt Netzwerk', 'Installiert Updates'],
          correctIndex: 0
        },
        {
          question: 'Wie wird Root-Login in SSH gesperrt?',
          options: ['PermitRootLogin no in sshd_config', 'userdel root', 'passwd -l root', 'rm /bin/su'],
          correctIndex: 0
        },
        {
          question: 'Welches Tool checkt Linux Rootkits?',
          options: ['Windows Defender', 'rkhunter', 'Event Viewer', 'BitLocker'],
          correctIndex: 1
        },
        {
          question: 'Was macht AppArmor/SELinux?',
          options: ['Mandatory Access Control', 'Firewall', 'Antivirus', 'VPN'],
          correctIndex: 0
        },
        {
          question: 'Linux-Kernel-Hardening Parameter?',
          options: ['kernel.kptr_restrict=2 + ASLR', 'root_login=yes', 'sudo_timeout=0', 'ufw disable'],
          correctIndex: 0
        }
      ]
    }
  ],
  finalQuiz: [
    { type: 'mc', question: 'Was passiert im TLS-Handshake?', options: ['Nur Passwort-Check', 'Key-Austausch + Cipher-Vereinbarung', 'Firewall-Regel setzen', 'DNS-Query'], correctIndex: 1 },
    { type: 'mc', question: 'Unterschied AES vs. RSA?', options: ['AES symmetrisch (schnell), RSA asymmetrisch', 'Beide symmetrisch', 'RSA für Integrität', 'AES für Signaturen'], correctIndex: 0 },
    { type: 'mc', question: 'Was schützt UAC in Windows?', options: ['Admin-Rechte explizit abfragen', 'Dateien lokal encrypten', 'Netzwerk-Ports schließen', 'Kernel updaten'], correctIndex: 0 },
    { type: 'mc', question: 'Linux-Tool gegen Rootkits?', options: ['Event Viewer', 'rkhunter', 'BitLocker', 'WSUS'], correctIndex: 1 },
    { type: 'mc', question: 'SSH-Hardening: PermitRootLogin no bewirkt?', options: ['Blockt Root-Direct-Login', 'Erlaubt alle IPs', 'Ändert Port automatisch', 'Aktiviert Passwörter'], correctIndex: 0 },
    { type: 'mc', question: 'Zweck von Fail2Ban?', options: ['IP-Bans bei Brute-Force', 'Zertifikate signen', 'Webseiten hosten', 'Backups'], correctIndex: 0 },
    { type: 'mc', question: 'Moderner Key-Exchange in TLS 1.3?', options: ['RSA nur', 'ECDHE (Elliptic Curve Diffie-Hellman)', 'DES', 'MD5'], correctIndex: 1 },
    { type: 'open', question: 'Erkläre symmetrische vs. asymmetrische Verschlüsselung mit TLS-Bezug.', expected: 'Symmetrisch (AES) braucht 1 Key für Encrypt/Decrypt; asymmetrisch (RSA/ECDHE) Public/Private-Paar für sicheren Key-Austausch im TLS-Handshake' },
    { type: 'open', question: 'Warum ist Least Privilege wichtig in Windows/Linux?', expected: 'Verhindert, dass kompromittierte User-Accounts Root/Admin-Rechte missbrauchen und lateral bewegen können.' },
    { type: 'open', question: 'Nenne 3 Hardening-Maßnahmen für SSH-Server.', expected: '1. PermitRootLogin no, 2. PasswordAuthentication no (nur Keys), 3. Fail2Ban + non-standard Port (z.B. 2222).' }
  ]
};

export const bluePro = {
  id: 'blue-pro',
  title: 'Blue Team: Pro Level',
  topics: [
    {
      id: 'topic1',
      title: 'Incident Response & Monitoring',
      content: [
        'Incident Response ist der strukturierte Prozess zur Erkennung, Eindämmung und Behandlung von Sicherheitsvorfällen. NIST SP 800-61 definiert 6 Phasen: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned. Das NIST-Modell ist Goldstandard für HTL-Projekte und Cyber-Threat-Simulatoren.',
        'Die 6 Phasen nach NIST:\n1. Preparation: Playbooks, Tools (SIEM), Netzwerk-Spiegelung.\n2. Identification: Anomalien erkennen (Triage/Escalation).\n3. Containment: Schaden stoppen (IP blocken, Endpoint isolieren).\n4. Eradication: Root Cause finden und komplett entfernen.\n5. Recovery: Clean-State, intensives Monitoring.\n6. Lessons Learned: Root Cause Analysis (RCA), Training.',
        'Monitoring: Die Augen & Ohren\nLog-Management: Syslog, Windows Events, Netflow. Retention: 90 Tage Hot, 1 Jahr Cold.\nSIEM-Systems (Security Information & Event Management): Splunk, ELK-Stack (Elasticsearch+Logstash+Kibana) für HTL-Labs, Graylog/QRadar.\nKorrelation Rules: z.B. 10 failed SSH + successful Login + whoami + sudo -l = Privilege Escalation.',
        'Spezifische Monitoring-Tools\nHost-basiert (HIDS):\nWindows: Sysmon (Event ID 1=Process Creation, 3=Network Connection), ProcMon, Autoruns.\nLinux: auditd, aide (File-Integrity), OSSEC.\nNetzwerk-basiert (NIDS):\nSnort/Suricata: Signatur-basierte IDS.\nZeek: Protokolliert SMB/HTTP/DNS.\nWireshark/tshark: Deep Packet Inspection.',
        'Incident Response Playbooks (Vorlagen)\nPhishing: E-Mail isolieren → User Account suspendieren → Endpoint trennen → Threat Hunting.\nRansomware: Netzwerkkarte physisch trennen (!) → Backups identifizieren → IOCs sammeln → KEIN Lösegeld zahlen.\nLateral Movement: Sessions killen → Kerberos Tickets löschen → Passwörter rotieren.',
        'HTL-Praktische Umsetzung\nELK-Stack Lab (3 VMs): Logstash → Elasticsearch → Kibana.\nRaspberry Pi Monitoring: rsyslog, aide, fail2ban.\nHyper-V SIEM: Winlogbeat + Sysmon → ELK, pfSense Netflow → Logstash.'
      ],
      quiz: [
        {
          question: 'NIST IR erste Phase?',
          options: ['Preparation', 'Containment', 'Identification', 'Recovery'],
          correctIndex: 0
        },
        {
          question: 'Welches Tool für NIDS?',
          options: ['Snort/Suricata', 'AIDE', 'BitLocker', 'UAC'],
          correctIndex: 0
        },
        {
          question: 'SIEM-Zweck?',
          options: ['Log-Korrelation + Threat Hunting', 'Firewall', 'Encryption', 'Backup'],
          correctIndex: 0
        },
        {
          question: 'Windows Event ID Failed Login?',
          options: ['4625', '4688', '4648', '1102'],
          correctIndex: 0
        },
        {
          question: 'Ransomware: Erste Maßnahme?',
          options: ['Netzwerkkarte physisch trennen', 'Lösegeld zahlen', 'System neu installieren', 'Internet-Software killen'],
          correctIndex: 0
        }
      ]
    },
    {
      id: 'topic2',
      title: 'Threat Modeling & Risiko-Analyse',
      content: [
        'Threat Modeling analysiert Assets (Daten, Systeme), Threat Actors (Hacker, Insider), Attack Vectors und Schwachstellen. Prozess (Microsoft DREAD): 1. Decompose, 2. Determine Threats, 3. Rate Threats, 4. Mitigate.',
        'STRIDE-Bedrohungen (6 Kategorien):\nSpoofing (Identität faken) → Authentifizierung\nTampering (Daten manipulieren) → Integrität\nRepudiation (Leugnen) → Non-Repudiation\nInformation Disclosure (Datenlecks) → Vertraulichkeit\nDenial of Service (Ausfall) → Verfügbarkeit\nElevation of Privilege (Rechte stehlen) → Autorisierung',
        'Risiko-Analyse: Quantifizieren & Priorisieren\nRisiko = Wahrscheinlichkeit × Impact. Qualitative Skala: Low/Medium/High. Quantitative: €-Schaden pro Jahr.\nCVSS v4.0 = Exploitability + Impact (10.0 = Critical).',
        'Threat Modeling Methoden\nPASTA (Process for Attack Simulation and Threat Analysis): Define Context, Technical Scope, Decompose, Threat Analysis, Risk Assessment, Mitigation.\nATT&CK Navigator (MITRE): Mappt TTPs auf Assets.',
        'Risk Assessment Frameworks\nFAIR (Factor Analysis of Information Risk): Annualized Loss Expectancy (ALE) = Loss Event Frequency × Loss Magnitude.\nBeispiel: SSH Brute Force ALE = 0.1 Incidents/Jahr × €700 = €70/Jahr → Fail2Ban rechtfertigt sich.',
        'Tools für HTL-Labs\nMicrosoft Threat Modeling Tool: DFD zeichnen, STRIDE auto-generieren.\nOWASP Threat Dragon: Open Source.\nNmap/Nikto/OpenVAS: Vulnerability Scans.'
      ],
      quiz: [
        {
          question: 'STRIDE steht für?',
          options: ['Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege', '5 Phasen IR', 'CIA + Auth', 'Risk Assessment'],
          correctIndex: 0
        },
        {
          question: 'Risiko-Formel?',
          options: ['Wahrscheinlichkeit × Impact', 'Cost × Time', 'Threats × Assets', 'CVSS × DREAD'],
          correctIndex: 0
        },
        {
          question: 'CVSS 10.0 bedeutet?',
          options: ['Critical Vulnerability', 'Low Risk', 'Medium', 'Informational'],
          correctIndex: 0
        },
        {
          question: 'PASTA Phase 2?',
          options: ['Technical Scope definieren (DFD)', 'Business Context', 'Threat Analysis', 'Mitigation'],
          correctIndex: 0
        },
        {
          question: 'ALE in FAIR?',
          options: ['Annualized Loss Expectancy', 'Attack Likelihood Estimate', 'Asset Loss Event', 'Annual License Expense'],
          correctIndex: 0
        }
      ]
    },
    {
      id: 'topic3',
      title: 'Advanced Netzwerksicherheit',
      content: [
        'Advanced Netzwerksicherheit geht weit über einfache Firewalls und VPNs hinaus und fokussiert sich auf moderne Konzepte wie Zero Trust Architecture, Micro-Segmentation, Encrypted Traffic Analytics und Software Defined Networking Security. Diese schützen gegen Advanced Persistent Threats (APTs) und Lateral Movement.',
        'Zero Trust Architecture – Never Trust, Always Verify\nJede Anfrage wird immer authentifiziert, autorisiert und inspiziert. Core Principles: Verify Explicitly, Least Privilege Access, Assume Breach. Komponenten: MFA mit Context-Awareness, ZTNA.',
        'Netzwerk-Segmentation – East-West Traffic\n80% der Angriffe bewegen sich lateral. Micro-Segmentation geht weiter als VLANs: Jede VM bekommt eigene Firewall-Policies (East-West Firewalls).',
        'Software Defined Networking Security (SDN)\nTrennt Control Plane von Data Plane. Dynamische Segmentation und Flow-basierte ACLs. Countermeasures gegen SDN-Angriffe (Controller-DDoS, OpenFlow-Spoofing): TLS zwischen Controller und Switch.',
        'Encrypted Traffic Analytics (ETA) & SASE\nETA analysiert verschlüsselten Traffic mittels TLS-Fingerprinting (JA3), Traffic Patterns, ohne Decryption.\nSASE kombiniert Zero Trust mit SDN-WAN in der Cloud (ZTNA, CASB, SWG, FWaaS).',
        'Advanced Threat Protection & Labs\nDeception Technologies (Honeypots, Canarytokens). Labs: Service Mesh wie Istio mit mutual TLS (mTLS), Kubernetes Network Policies. Attack Simulation Frameworks wie MITRE Caldera, BloodHound.'
      ],
      quiz: [
        {
          question: 'Zero Trust Motto?',
          options: ['Never Trust, Always Verify', 'Trust but Verify', 'Perimeter First', 'Firewall Everything'],
          correctIndex: 0
        },
        {
          question: 'Micro-Segmentation schützt primär?',
          options: ['East-West Traffic zwischen VMs/Containers', 'Nur Internet-Zugriff', 'DNS-Server', 'North-South Traffic'],
          correctIndex: 0
        },
        {
          question: 'SASE umfasst?',
          options: ['ZTNA + CASB + SWG + FWaaS', 'Traditionelles VPN', 'Hardware Firewalls', 'VLANs nur'],
          correctIndex: 0
        },
        {
          question: 'ETA erkennt Malware durch?',
          options: ['TLS Fingerprinting + Traffic Patterns', 'Deep Packet Inspection', 'DNS-Logs nur', 'Netflow'],
          correctIndex: 0
        },
        {
          question: 'Größte SDN-Sicherheitsbedrohung?',
          options: ['Controller als Single Point of Failure (DDoS)', 'VLAN Tagging', 'OSPF Routing', 'Data Plane Encryption'],
          correctIndex: 0
        }
      ]
    }
  ],
  finalQuiz: [
    { type: 'mc', question: 'STRIDE steht für?', options: ['Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege', '5 IR-Phasen', 'CIA + Auth', 'Risk-Matrix'], correctIndex: 0 },
    { type: 'mc', question: 'Risiko-Formel?', options: ['Wahrscheinlichkeit × Impact', 'Cost × Threats', 'CVSS × Assets', 'ALE × DREAD'], correctIndex: 0 },
    { type: 'mc', question: 'Zero Trust Prinzip?', options: ['Never Trust, Always Verify', 'Perimeter Defense', 'Trust Internals', 'VLAN Only'], correctIndex: 0 },
    { type: 'mc', question: 'Micro-Segmentation schützt?', options: ['East-West Traffic', 'Nur Internet', 'DNS', 'North-South'], correctIndex: 0 },
    { type: 'mc', question: 'NIST IR erste Phase?', options: ['Preparation', 'Containment', 'Identification', 'Recovery'], correctIndex: 0 },
    { type: 'mc', question: 'SIEM-Zweck?', options: ['Log-Korrelation + Alerting', 'Firewall', 'Encryption', 'Backup'], correctIndex: 0 },
    { type: 'mc', question: 'CVSS 10.0 = ?', options: ['Critical', 'Low', 'Medium', 'Info'], correctIndex: 0 },
    { type: 'open', question: 'Erkläre STRIDE mit 1 Beispiel pro Kategorie.', expected: 'Spoofing (Fake Login), Tampering (Daten ändern), Repudiation (Leugnen), Info Disclosure (Leak), DoS (Ausfall), Elevation (Rechte stehlen).' },
    { type: 'open', question: 'Warum Zero Trust statt Perimeter?', expected: 'Angreifer sind oft schon im Netz (Lateral Movement); ZTA verifiziert jede Anfrage an jedem Ort.' },
    { type: 'open', question: 'Ransomware: 3 erste Maßnahmen?', expected: '1. Netzwerkkarte trennen, 2. Backup identifizieren, 3. IOCs sammeln (KEIN Lösegeld zahlen).' }
  ]
};
