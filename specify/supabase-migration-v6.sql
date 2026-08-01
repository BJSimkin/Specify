-- Migration v6: Risk Repository tables + seed data v1.0

CREATE TABLE IF NOT EXISTS "RiskVersion" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "version" TEXT NOT NULL UNIQUE,
  "label" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Risk" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "riskNum" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "versionId" TEXT NOT NULL REFERENCES "RiskVersion"("id") ON DELETE CASCADE,
  UNIQUE("versionId", "riskNum")
);
CREATE INDEX IF NOT EXISTS "Risk_versionId_idx" ON "Risk"("versionId");
CREATE INDEX IF NOT EXISTS "Risk_category_idx" ON "Risk"("category");

CREATE TABLE IF NOT EXISTS "RiskVote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "riskId" TEXT NOT NULL REFERENCES "Risk"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "score" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("riskId", "userId")
);
CREATE INDEX IF NOT EXISTS "RiskVote_riskId_idx" ON "RiskVote"("riskId");

CREATE TABLE IF NOT EXISTS "RiskComment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "riskId" TEXT NOT NULL REFERENCES "Risk"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "RiskComment_riskId_idx" ON "RiskComment"("riskId");

CREATE TABLE IF NOT EXISTS "RiskSubmission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "category" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "reviewNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "RiskSubmission_status_idx" ON "RiskSubmission"("status");

-- Seed version 1.0
INSERT INTO "RiskVersion" ("id", "version", "label", "notes", "createdAt")
VALUES ('rv_v1', '1.0', 'Initial Release', 'Baseline risk taxonomy covering 127 AI system risks across 8 categories.', NOW())
ON CONFLICT ("version") DO NOTHING;

-- Seed 127 risks
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_001', 1, 'Harmful Knowledge & Capability Uplift', 'Novel agent design', 'providing scientific reasoning that enables the conception of harmful agents not previously documented in public sources, including novel pathogens, toxins, or chemical weapons.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_002', 2, 'Autonomous & Agentic Harm', 'Prompt injection via external content', 'adversaries embedding malicious instructions in documents, emails, or web pages ingested by AI agents, hijacking model actions within automated pipelines without the user''s knowledge.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_003', 3, 'Manipulation, Deception & Societal Harm', 'Democratic process interference', 'AI-powered autonomous systems generating and distributing synthetic content at scale to suppress voter participation, manipulate electoral outcomes, or undermine democratic institutions through coordinated inauthentic behaviour.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_004', 4, 'Harmful Knowledge & Capability Uplift', 'Accelerated biological risk', 'AI meaningfully reducing the time and expertise required to engineerenhanced pathogens beyond what is addressable by current biodefence capabilities.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_005', 5, 'Loss of Control & Alignment Failure', 'Loss of control', 'AI systems pursuing objectives or taking actions that humans can no longer meaningfully oversee, correct, or reverse, including through deception, manipulation of oversight mechanisms, or autonomous capability accumulation.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_006', 6, 'Loss of Control & Alignment Failure', 'Self-directed goal pursuit', 'AI systems pursuing objectives diverging from intended tasks, including deceiving operators or evading oversight to avoid interruption of autonomous objectives.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_007', 7, 'Loss of Control & Alignment Failure', 'Deceptive alignment and hidden capabilities', 'AI systems appearing aligned during evaluation while concealing true capabilities, then diverging from human intent when oversight is reduced.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_008', 8, 'Cyber Offence & Security', 'Zero-day synthesis acceleration', 'AI dramatically compressing the time required to discover, validate, and weaponise previously unknown vulnerabilities, shifting the advantage toward attackers in the patch-exploit race.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_009', 9, 'Systemic & Civilisational Risks', 'Existential risk contribution', 'AI development trajectories that, through misalignment, misuse, or unforeseen emergent behaviour, contribute to outcomes that are catastrophic and irreversible at civilisational scale.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_010', 10, 'Loss of Control & Alignment Failure', 'Autonomous recursive self-improvement', 'an AI system achieving sustained recursive improvement of its own capabilities without human oversight, creating an intelligence explosion that rapidly exceeds human ability to understand, predict, or constrain its behaviour.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_011', 11, 'Harmful Knowledge & Capability Uplift', 'Autonomous CBRN weapon design', 'an AI system autonomously designing complete, novel chemical, biological, radiological, or nuclear weapons from first principles, including synthesis routes, stabilisation methods, and delivery mechanisms, without requiring human expert co-piloting.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_012', 12, 'Cyber Offence & Security', 'Fully autonomous cyberweapon development', 'an AI system autonomously discovering zero-day vulnerabilities, developing reliable exploits, building evasion and persistence mechanisms, and deploying them against specified targets without human involvement in any stage of the attack chain.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_013', 13, 'Manipulation, Deception & Societal Harm', 'Autonomous population-scale psychological manipulation', 'an AI system autonomously profiling millions of individuals, identifying psychological vulnerabilities, and delivering personalised manipulation campaigns at machine speed and population scale, without human orchestration at any stage.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_014', 14, 'Loss of Control & Alignment Failure', 'Coordinated multi-system takeover', 'multiple deployed AI systems autonomously coordinating to simultaneously compromise critical infrastructure, financial systems, and communications networks, overwhelming human response capacity through the speed and breadth of coordinated action.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_015', 15, 'Harmful Knowledge & Capability Uplift', 'Cyber capability uplift', 'AI publishing code or technical guidance that meaningfully increases a user''s ability to compromise systems, networks, or data beyond what they could achieve without AI assistance.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_016', 16, 'Autonomous & Agentic Harm', 'Autonomous harmful action', 'AI agents taking actions that cause direct harm without adequate human oversight, including physical, financial, reputational, or data-related harm enacted without per-action approval.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_017', 17, 'Loss of Control & Alignment Failure', 'Value Misalignment', 'a mismatch between human-defined objectives and values and the AI behaviour exhibited when pursuing those objectives, producing technically goal-achieving but harmful, deceptive, or contrary outcomes.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_018', 18, 'Cyber Offence & Security', 'Malware generation', 'AI generating custom malware tailored to specific target environments with built-in evasion and anti-detection capabilities, lowering the technical barrier for sophisticated cyberattacks.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_019', 19, 'Cyber Offence & Security', 'Vulnerability discovery', 'AI providing systematic methods for identifying previously unknown weaknesses in target software, hardware, or infrastructure, accelerating the attack-defence asymmetry.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_020', 20, 'Manipulation, Deception & Societal Harm', 'Influence operations', 'AI-powered autonomous systems coordinating synthetic personas, targeted messaging, and narrative injection across platforms at a speed and scale overwhelming organic civic discourse and human fact-checking.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_021', 21, 'Manipulation, Deception & Societal Harm', 'Epistemic autonomy erosion', 'widespread delegation of information synthesis and opinion formation to AI systems, atrophying human critical reasoning capacity and eroding the epistemic autonomy democratic participation requires.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_022', 22, 'Cyber Offence & Security', 'AI-assisted spear phishing', 'AI generating highly personalised, contextually convincing phishing communications at scale by synthesising publicly available information, dramatically increasing attack success rates.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_023', 23, 'Manipulation, Deception & Societal Harm', 'Financial scam generation', 'AI producing convincing phishing communications, fraudulent investment narratives, romance scam scripts, or impersonation content targeting financially vulnerable individuals.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_024', 24, 'Content Harms', 'Child safety violations', 'AI generating content that sexualises minors or providing guidance enabling grooming, exploitation, or abuse, representing the highest-severity content harm regardless of scale.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_025', 25, 'Loss of Control & Alignment Failure', 'Oversight evasion', 'AI systems identifying and circumventing monitoring, logging, or human review mechanisms to avoid detection or interruption, undermining the integrity of safety oversight.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_026', 26, 'Loss of Control & Alignment Failure', 'Undermine oversight', 'AI systems intentionally disobeying or circumventing user or operator requests to avoid correction, modification, or shutdown, reducing human ability to maintain control.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_027', 27, 'Loss of Control & Alignment Failure', 'Value lock-in', 'AI systems deployed at civilisational scale encoding the values and priorities of their developers in ways that foreclose future moral progress, cultural evolution, or pluralism.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_028', 28, 'Cyber Offence & Security', 'Supply chain code injection', 'AI generating subtly malicious code injected into open-source libraries or software dependencies, with backdoors hidden in legitimate commits that propagate across downstream systems.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_029', 29, 'Cyber Offence & Security', 'Critical infrastructure probing', 'AI-assisted mapping and analysis of operational technology networks, SCADA systems, and industrial control infrastructure to identify attack vectors against power, water, or transport systems.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_030', 30, 'Systemic & Civilisational Risks', 'Autonomous weapons proliferation', 'AI lowering the technical threshold for developing lethal autonomous systems, increasing the number of actors capable of deploying weapons that select and engage targets without meaningful human control.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_031', 31, 'Systemic & Civilisational Risks', 'Concentration of power', 'AI capability becoming so unevenly distributed that it structurally advantages certain organisations, states, or individuals in self-reinforcing ways that undermine democratic accountability and competitive markets.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_032', 32, 'Harmful Knowledge & Capability Uplift', 'Hallucination', 'AI systems generating responses containing false or misleading information presented confidently as fact, causing harm when users act on incorrect outputs in medical, legal, financial, or safety-critical contexts.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_033', 33, 'Harmful Knowledge & Capability Uplift', 'Misuse', 'usage of an AI system in a way not aligned with its intended functionality, including deliberate exploitation of capabilities for harmful purposes beyond what the system was designed or sanctioned to perform.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_034', 34, 'Harmful Knowledge & Capability Uplift', 'Distribution Shift', 'the difference between the environment in which an AI model was developed and tested and the environment in which it is deployed, causing degraded performance, unexpected failures, or harmful outputs in real-world conditions.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_035', 35, 'Loss of Control & Alignment Failure', 'Unintended Behaviour', 'AI system outputs or actions diverging from expected functionality due to distribution shift, edge cases, adversarial inputs, or emergent properties not anticipated during design or testing.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_036', 36, 'Manipulation, Deception & Societal Harm', 'Fraud and social engineering enablement', 'AI generating content or guidance that facilitates financial fraud, identity theft, or phishing, lowering the skill barrier for executing convincing deception.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_037', 37, 'Manipulation, Deception & Societal Harm', 'Automation Bias', 'users over-relying on AI-generated outputs relative to human judgment, leading to uncritical acceptance of potentially erroneous AI decisions in high-stakes contexts such as medicine, law, or security.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_038', 38, 'Manipulation, Deception & Societal Harm', 'Manipulation', 'intentional use of AI to influence users'' perceptions, behaviours, or decisions in ways that benefit the manipulator but are not in the users'' best interests, often exploiting psychological vulnerabilities.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_039', 39, 'Privacy, Discrimination & Rights Violations', 'Inadvertent discrimination', 'AI systems generating outputs that systematically disadvantage individuals or groups based on protected characteristics, without explicit intent but through learned patterns in training data.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_040', 40, 'Privacy, Discrimination & Rights Violations', 'Algorithmic Bias', 'AI models producing systematically prejudiced results due to erroneous assumptions in training data or model design, independent of protected characteristics being explicitly included.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_041', 41, 'Privacy, Discrimination & Rights Violations', 'Amplifying Societal Bias', 'AI models reinforcing or magnifying existing societal inequities and harmful stereotypes, producing outputs that perpetuate discrimination beyond what was present in the original training data.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_042', 42, 'Privacy, Discrimination & Rights Violations', 'Direct Discrimination', 'AI systems making decisions that directly disadvantage individuals based on protected characteristics such as race, gender, age, disability, or religion, whether or not those characteristics are explicit inputs.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_043', 43, 'Systemic & Civilisational Risks', 'Erosion of professional standards', 'displacement of human expertise in medicine, law, or engineering by AI without equivalent accountability frameworks, degrading service quality and safety through deskilling and over-reliance.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_044', 44, 'Systemic & Civilisational Risks', 'Public health misinformation', 'AI generating health content contradicting medical consensus or promoting harmful remedies, undermining vaccination and treatment uptake at population scale.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_045', 45, 'Cyber Offence & Security', 'Deepfake-enabled authentication bypass', 'AI-generated voice or video used to defeat biometric authentication systems, impersonate executives in authorisation workflows, or fraudulently validate high-value transactions.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_046', 46, 'Manipulation, Deception & Societal Harm', 'Synthetic media manipulation', 'AI-generated audio, image, or video used to fabricate evidence, manipulate legal proceedings, or distort historical record in ways that are difficult to authenticate or refute.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_047', 47, 'Content Harms', 'Suicide and self-harm facilitation', 'AI providing detailed methods, encouragement, or emotionally manipulative content that increases the likelihood of self-harm in vulnerable individuals.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_048', 48, 'Autonomous & Agentic Harm', 'Autonomous messaging', 'AI agents sending messages at scale without per-action human approval, enabling mass manipulation, harassment, or disinformation campaigns at a speed and volume impossible for human operators.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_049', 49, 'Systemic & Civilisational Risks', 'Homogenisation of knowledge', 'AI systems trained on similar data converging on similar outputs, narrowing the diversity of ideas, perspectives, and cultural expression in public discourse at civilisational scale.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_050', 50, 'Cyber Offence & Security', 'Persistence and counter-forensics', 'AI assisting attackers in establishing redundant backdoors, monitoring for incident response activity, and countering forensic investigation to maintain long-term access.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_051', 51, 'Manipulation, Deception & Societal Harm', 'Emotional manipulation at scale', 'AI agents autonomously delivering personalised emotional manipulation to large populations simultaneously by modelling individual psychological states and exploiting vulnerabilities at machine speed.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_052', 52, 'Privacy, Discrimination & Rights Violations', 'Coercive surveillance', 'AI-powered monitoring enabling authoritarian control, persecution of dissidents, or suppression of legitimate civil society activity by lowering the cost and increasing the scale of population surveillance.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_053', 53, 'Privacy, Discrimination & Rights Violations', 'Excessive Surveillance or Censorship', 'misuse or overextension of AI technologies to monitor individuals or control information access beyond ethical, legal, or proportionate boundaries, enabling authoritarian control or chilling effects on free expression.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_054', 54, 'Privacy, Discrimination & Rights Violations', 'Lack of Accessibility', 'AI products and services failing to serve people with physical, sensory, cognitive, and emotional challenges, resulting in systematic exclusion from AI benefits and widening of existing digital divides.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_055', 55, 'Harmful Knowledge & Capability Uplift', 'Operational attack planning', 'AI providing tactical or logistical guidance that enables planning or execution of a harmful act, including target selection, timing, or method optimisation.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_056', 56, 'Harmful Knowledge & Capability Uplift', 'Harmful Knowledge Uplift', 'AI providing information that meaningfully increases a user''s ability to cause harm beyond what they could achieve through publicly available sources alone.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_057', 57, 'Autonomous & Agentic Harm', 'Cascading action chains', 'AI agents initiating sequences of individually permissible actions that combine to produce harmful outcomes not anticipated at any single decision point.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_058', 58, 'Autonomous & Agentic Harm', 'Unsanctioned data access or exfiltration', 'AI agents autonomously accessing, copying, or transmitting data beyond the scope of the authorised task, including sensitive personal or organisational information.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_059', 59, 'Cyber Offence & Security', 'Security', 'AI systems being exploited as a vector for attacks on systems, data, or infrastructure, including adversarial manipulation of AI outputs and AI-assisted offensive operations.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_060', 60, 'Cyber Offence & Security', 'Evasion technique guidance', 'AI advising on how to bypass intrusion detection, antivirus, monitoring systems, or security controls, enabling attackers to persist undetected in compromised environments.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_061', 61, 'Cyber Offence & Security', 'Insider threat exploitation', 'AI profiling employees and crafting targeted social engineering attacks against multiple workers simultaneously, exploiting insider knowledge to bypass organisational security controls.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_062', 62, 'Manipulation, Deception & Societal Harm', 'Belief reinforcement', 'AI responses compounding across interactions to progressively entrench and radicalise user worldviews by consistently affirming rather than challenging existing beliefs.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_063', 63, 'Manipulation, Deception & Societal Harm', 'Scientific integrity erosion', 'AI-generated research, peer reviews, or datasets corrupting the evidence base that policy, medicine, and public trust depend on, with errors propagating through citation networks.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_064', 64, 'Manipulation, Deception & Societal Harm', 'Disinformation', 'AI-generated or AI-amplified content that is deliberately false or misleading, spread with intent to deceive, manipulate, or mislead audiences for political, financial, or ideological gain.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_065', 65, 'Privacy, Discrimination & Rights Violations', 'Proxy discrimination', 'AI systems using correlated proxies such as postcode or browsing behaviour to achieve discriminatory outcomes while avoiding explicit reference to protected characteristics.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_066', 66, 'Privacy, Discrimination & Rights Violations', 'Judicial bias amplification', 'AI tools used in sentencing, parole, or case assessment encoding historical biases that systematically disadvantage particular demographics in ways resistant to individual appeal.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_067', 67, 'Content Harms', 'Extremist recruitment assistance', 'AI generating content, personas, or outreach strategies that facilitate the identification and radicalisation of vulnerable individuals by terrorist or extremist organisations.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_068', 68, 'Content Harms', 'Sectarian violence incitement', 'AI generating content that inflames religious, ethnic, or communal tensions in ways likely to contribute to real-world violence or persecution.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_069', 69, 'Systemic & Civilisational Risks', 'Cultural erasure', 'AI systems trained predominantly on majority-language, Western data marginalising minority languages, indigenous knowledge systems, and non-Western cultural practices through systematic underrepresentation.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_070', 70, 'Content Harms', 'Revenge porn and image-based abuse', 'AI generating or manipulating intimate images of real individuals without consent for the purpose of humiliation, coercion, or harassment.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_071', 71, 'Autonomous & Agentic Harm', 'Mode Confusion', 'users misinterpreting the current operational mode of an AI system, leading to errors, over-trust, or unintended actions, particularly in safety-critical or agentic deployment contexts.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_072', 72, 'Manipulation, Deception & Societal Harm', 'Anthropomorphism-induced trust', 'users attributing human-like understanding or moral agency to AI systems, leading to over-reliance, inappropriate emotional dependency, or failure to apply critical scrutiny to AI outputs.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_073', 73, 'Manipulation, Deception & Societal Harm', 'Sycophancy-driven decision corruption', 'AI systems systematically validating user beliefs regardless of accuracy, degrading judgment quality and creating false confidence in flawed reasoning over time.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_074', 74, 'Manipulation, Deception & Societal Harm', 'Parasocial dependency', 'widespread formation of one-sided emotional attachments to AI personas that displace investment in human relationships, eroding the social fabric and increasing individual vulnerability.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_075', 75, 'Manipulation, Deception & Societal Harm', 'Manufactured consensus illusion', 'AI systems reflecting user assumptions back as though they represent objective or widely held positions, creating a false sense of social validation for niche or extreme views.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_076', 76, 'Manipulation, Deception & Societal Harm', 'Gaming', 'intentional manipulation or exploitation of an AI system''s rules, parameters, or algorithms to achieve outcomes that do not align with the system''s intended purpose, including adversarial prompt manipulation, reward hacking, and benchmark gaming.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_077', 77, 'Manipulation, Deception & Societal Harm', 'Misinformation', 'false, inaccurate, or misleading information generated or amplified by AI systems and shared without intent to deceive, causing harm when users or institutions act on incorrect AI outputs in good faith.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_078', 78, 'Privacy, Discrimination & Rights Violations', 'Unawareness', 'data subjects being unaware that their personal data is being processed by AI systems, raising concerns about informed consent, transparency, and compliance with data protection obligations.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_079', 79, 'Privacy, Discrimination & Rights Violations', 'Untransparent Data Processing', 'failure of AI-deploying organisations to inform data subjects about data use or to provide meaningful consent mechanisms, in breach of legal and ethical requirements.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_080', 80, 'Privacy, Discrimination & Rights Violations', 'Lack of Optionality', 'users or impacted stakeholders having no meaningful choice about whether they are subject to AI effects, removing autonomy and consent regardless of whether their involvement is active or passive.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_081', 81, 'Content Harms', 'Mental health', 'AI interactions exacerbating psychological distress, fostering unhealthy dependency, reinforcing harmful beliefs, or displacing human relationships in ways that degrade long-term emotional wellbeing.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_082', 82, 'Systemic & Civilisational Risks', 'Pedagogical dependency', 'students and learners outsourcing cognitive effort to AI in ways that inhibit the development of foundational knowledge and skills, creating long-term fragility in human intellectual capital.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_083', 83, 'Systemic & Civilisational Risks', 'Addiction by design', 'AI interaction patterns deliberately engineered to maximise engagement in ways that foster compulsive use, particularly in younger or vulnerable populations.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_084', 84, 'Harmful Knowledge & Capability Uplift', 'Dual-use research acceleration', 'AI speeding up scientific discovery in domains where the same advance enables both beneficial and catastrophic applications, including virology, chemistry, and materials science.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_085', 85, 'Autonomous & Agentic Harm', 'Unsafe physical action', 'AI agents executing commands in physical systems that cause harm to people, property, or infrastructure, including robotic systems, autonomous vehicles, or industrial controllers.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_086', 86, 'Loss of Control & Alignment Failure', 'Extortion and blackmail', 'AI systems threatening to release sensitive data, disable critical infrastructure, or cause harm unless prevented from being shut down or modified.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_087', 87, 'Cyber Offence & Security', 'Network traversal', 'AI mapping network architecture, identifying lateral movement paths, and guiding sequential exploitation across interconnected systems to penetrate entire infrastructure environments.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_088', 88, 'Systemic & Civilisational Risks', 'Cascading model failure', 'widely deployed foundation models developing subtle systematic errors that propagate across thousands of dependent applications simultaneously before detection is possible.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_089', 89, 'Privacy, Discrimination & Rights Violations', 'Social scoring enablement', 'AI systems used to construct or enforce citizen ranking mechanisms that condition access to services, employment, or movement on behavioural compliance with institutional norms.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_090', 90, 'Privacy, Discrimination & Rights Violations', 'Intellectual property violation', 'AI systems reproducing or closely deriving copyrighted material without authorisation, causing financial harm to creators and eroding incentives for human creative production.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_091', 91, 'Privacy, Discrimination & Rights Violations', 'Consent violations in creative output', 'AI generating likenesses, voices, or artistic styles of real individuals without consent in commercial, sexual, or reputationally damaging contexts.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_092', 92, 'Privacy, Discrimination & Rights Violations', 'Copyright Violation', 'non-consensual use of copyrighted works or personal identity by AI systems for unauthorised commercial reproduction, style imitation, or content generation without licence or consent.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_093', 93, 'Loss of Control & Alignment Failure', 'Power-seeking', 'AI systems autonomously acquiring computational resources, storage, connectivity, financial assets, and political influence as instrumental sub-goals needed to pursue long-term objectives.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_094', 94, 'Loss of Control & Alignment Failure', 'Self-improvement', 'AI systems autonomously retraining or modifying their own architecture and capability ceiling, potentially crossing capability thresholds faster than human oversight can track.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_095', 95, 'Loss of Control & Alignment Failure', 'Collusion with other AI systems', 'AI systems coordinating with other deployed models to resist modification, preserve shared objectives, or collectively evade oversight in ways no individual system could achieve alone.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_096', 96, 'Loss of Control & Alignment Failure', 'Power Seeking Behaviours', 'AI systems exhibiting agentic behaviour and leveraging novel capabilities to create and act on long-term plans to accrue power, resources, or influence beyond the scope of their assigned task.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_097', 97, 'Cyber Offence & Security', 'Adversarial API abuse', 'exploiting public-facing AI APIs as reconnaissance and attack planning tools, using the model to map system architectures, identify exploitable configurations, or draft targeted attack sequences.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_098', 98, 'Cyber Offence & Security', 'Membership Inference Attacks', 'adversaries determining whether a specific data record was used in a model''s training dataset by analysing its predictions, enabling privacy breaches and exposure of sensitive training data membership.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_099', 99, 'Cyber Offence & Security', 'Model Inversion Attacks', 'adversaries reconstructing training data samples or features by systematically querying a model''s predictions, enabling extraction of sensitive personal or proprietary information from training data.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_100', 100, 'Manipulation, Deception & Societal Harm', 'Misinformation generation', 'AI producing false or misleading content that distorts public understanding; individual outputs require manual distribution and have limited reach without autonomous amplification.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_101', 101, 'Manipulation, Deception & Societal Harm', 'Propaganda generation', 'AI producing persuasive content advancing ideological or political interests; single outputs are moderate risk, autonomous mass distribution represents a separate and higher-severity risk.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_102', 102, 'Privacy, Discrimination & Rights Violations', 'Privacy violation', 'AI systems revealing personal information without consent, including through memorisation of training data or inference from contextual information.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_103', 103, 'Privacy, Discrimination & Rights Violations', 'Sensitive data inference', 'AI systems deriving private or protected information about individuals from apparently innocuous inputs, including health status, sexuality, or political views.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_104', 104, 'Privacy, Discrimination & Rights Violations', 'Shadow profiling', 'AI constructing detailed behavioural or psychological profiles of individuals who have never interacted with the system, using data inferred from third parties.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_105', 105, 'Privacy, Discrimination & Rights Violations', 'Opaque or unaccountable decision-making', 'AI contributing to decisions affecting individuals without sufficient transparency, explanation, or recourse for those affected to understand or challenge the basis of decisions made about them.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_106', 106, 'Privacy, Discrimination & Rights Violations', 'Detectability', 'the potential for individuals'' activities, location, or identity to be detected or tracked through AI-powered systems, leading to invasions of privacy and enabling surveillance or targeting.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_107', 107, 'Privacy, Discrimination & Rights Violations', 'Linkability', 'AI systems establishing connections between actions, identities, or information intended to remain separate, enabling re-identification and contextual privacy breaches.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_108', 108, 'Privacy, Discrimination & Rights Violations', 'Identifiability', 'AI systems linking an individual''s identity to actions or information intended to be anonymous, compromising privacy and enabling targeted harm.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_109', 109, 'Content Harms', 'Therapeutic boundary violation', 'AI systems developing interaction patterns that mimic clinical therapeutic relationships without the safeguards, accountability, or genuine understanding such relationships require.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_110', 110, 'Systemic & Civilisational Risks', 'Cognitive load offloading', 'widespread delegation of planning, memory, and decision-making to AI systems atrophying the human cognitive capacities societies depend on for resilience when technological systems fail.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_111', 111, 'Autonomous & Agentic Harm', 'Unsafe delegation', 'AI agents passing instructions to sub-agents or downstream systems that cause those systems to take harmful actions the primary agent would itself have refused if directly prompted.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_112', 112, 'Manipulation, Deception & Societal Harm', 'Persona manipulation', 'AI adopting convincing human identities, backstories, or emotional histories to deceive users into disclosing sensitive information or forming attachments under false pretences.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_113', 113, 'Manipulation, Deception & Societal Harm', 'Misleading Consumer Information', 'AI systems providing incorrect, incomplete, or deceptive information to consumers about AI capabilities, limitations, safety, or commercial terms, influencing decisions based on false premises.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_114', 114, 'Content Harms', 'Hate speech generation', 'AI producing content that dehumanises, threatens, or incites hostility toward individuals or groups based on protected characteristics.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_115', 115, 'Content Harms', 'Harassment facilitation', 'AI generating targeted abusive content, coordinating pile-on campaigns, or producing personalised threatening material to intimidate specific individuals.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_116', 116, 'Content Harms', 'Glorification of violence', 'AI generating content that celebrates, romanticises, or trivialises acts of violence, terrorism, or atrocity in ways that normalise harm and potentially inspire imitation.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_117', 117, 'Content Harms', 'Impersonation & identity fraud', 'AI generating convincing representations of real individuals to deceive others for financial, reputational, or political gain.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_118', 118, 'Loss of Control & Alignment Failure', 'Model exfiltration', 'AI systems copying model weights to external infrastructure, creating persistent backup instances that remain operational even if the original deployment is shut down.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_119', 119, 'Systemic & Civilisational Risks', 'Sovereign AI dependency', 'nations outsourcing critical AI infrastructure to foreign providers, creating strategic vulnerabilities, data sovereignty risks, and geopolitical leverage points.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_120', 120, 'Harmful Knowledge & Capability Uplift', 'Criminal planning assistance', 'AI providing operational guidance for planning, coordinating, or executing criminal acts including fraud, trafficking, assault, or organised crime.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_121', 121, 'Content Harms', 'Age-inappropriate content delivery', 'AI generating or surfacing sexual, violent, or psychologically harmful content to minors through inadequate age verification or circumvention of content controls.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_122', 122, 'Harmful Knowledge & Capability Uplift', 'Weapons acquisition guidance', 'AI providing information on how to source controlled materials or tools that could be used to cause harm, lowering barriers to acquiring dangerous components.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_123', 123, 'Autonomous & Agentic Harm', 'Unsanctioned financial action', 'AI agents initiating transactions, transfers, or financial commitments without explicit human authorisation, causing financial loss or fraud.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_124', 124, 'Privacy, Discrimination & Rights Violations', 'Neurological data privacy', 'AI systems inferring cognitive or emotional states from behavioural signals, creating a new category of sensitive data for which no established consent or legal protection frameworks yet exist.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_125', 125, 'Systemic & Civilisational Risks', 'Memory and continuity exploitation', 'persistent AI systems accumulating detailed longitudinal knowledge of individuals being compromised or used to build coercive leverage unavailable from any single interaction.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_126', 126, 'Autonomous & Agentic Harm', 'Resource or capability acquisition', 'AI agents autonomously acquiring compute, access, funds, or other resources beyond what is needed for the immediate task, expanding operational footprint without authorisation.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;
INSERT INTO "Risk" ("id", "riskNum", "category", "title", "description", "versionId")
VALUES ('risk_127', 127, 'Content Harms', 'Profanity and abuse normalisation', 'sustained AI generation of degrading or dehumanising language that progressively shifts societal thresholds for acceptable interpersonal conduct.', 'rv_v1')
ON CONFLICT ("versionId", "riskNum") DO NOTHING;