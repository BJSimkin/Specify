// ──────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────

export interface RegArticle {
  id: string
  regulationId: string  // "eu-ai-act" | "nist-ai-rmf"
  path: string[]        // breadcrumb e.g. ["Title III", "Chapter 2"]
  number: string        // "Article 9" or "GOVERN 1.1"
  title: string
  summary: string       // 2-3 accurate sentences
  tags: string[]
  abstractedReqIds: string[]
}

export interface AbstractedRequirement {
  id: string            // "AR-001"
  title: string
  description: string   // 2-3 sentences
  category: string      // "Technical" | "Governance" | "Transparency" | "Data" | "Oversight" | "Security" | "Documentation"
  refs: {
    regulationId: string
    articleId: string
    articleRef: string  // e.g. "Article 9" or "GOVERN 1.2"
    relevance: 'direct' | 'related'
  }[]
}

export interface Regulation {
  id: string
  shortName: string
  fullName: string
  year: number
  jurisdiction: string
  color: string
  description: string
}

// ──────────────────────────────────────────────
// REGULATIONS
// ──────────────────────────────────────────────

export const REGULATIONS: Regulation[] = [
  {
    id: 'eu-ai-act',
    shortName: 'EU AI Act',
    fullName: 'EU Artificial Intelligence Act',
    year: 2024,
    jurisdiction: 'EU',
    color: '#003399',
    description:
      'A comprehensive regulatory framework establishing a risk-based approach to AI governance in the European Union. It classifies AI systems by risk level and imposes proportionate obligations on providers and deployers operating in the EU market.',
  },
  {
    id: 'nist-ai-rmf',
    shortName: 'NIST AI RMF',
    fullName: 'NIST AI Risk Management Framework',
    year: 2023,
    jurisdiction: 'USA',
    color: '#1B4F72',
    description:
      'A voluntary framework published by the National Institute of Standards and Technology to help organisations manage risks associated with AI systems. It is structured around four core functions — GOVERN, MAP, MEASURE, and MANAGE — and promotes trustworthy and responsible AI development.',
  },
]

// ──────────────────────────────────────────────
// ARTICLES
// ──────────────────────────────────────────────

export const ARTICLES: RegArticle[] = [
  // ── EU AI Act ──────────────────────────────
  {
    id: 'EU-AIA-ART-1',
    regulationId: 'eu-ai-act',
    path: ['Title I — General Provisions'],
    number: 'Article 1',
    title: 'Subject matter',
    summary:
      'Establishes the purpose of the AI Act to ensure a high level of protection of health, safety, fundamental rights, democracy, rule of law, and the environment from harmful effects of AI, while supporting innovation and the internal market.',
    tags: ['scope', 'general'],
    abstractedReqIds: [],
  },
  {
    id: 'EU-AIA-ART-2',
    regulationId: 'eu-ai-act',
    path: ['Title I — General Provisions'],
    number: 'Article 2',
    title: 'Scope',
    summary:
      'The Regulation applies to providers placing AI systems on the EU market, deployers using AI systems in the EU, and providers/deployers established in third countries where the AI system output is used in the EU. Certain exclusions apply for military, national security, and research purposes.',
    tags: ['scope', 'applicability'],
    abstractedReqIds: [],
  },
  {
    id: 'EU-AIA-ART-3',
    regulationId: 'eu-ai-act',
    path: ['Title I — General Provisions'],
    number: 'Article 3',
    title: 'Definitions',
    summary:
      "Defines key terms including 'AI system' (a machine-based system designed to operate with varying levels of autonomy that generates outputs such as predictions, recommendations, or decisions), 'provider', 'deployer', 'high-risk AI system', 'general-purpose AI model', and 'serious incident'.",
    tags: ['definitions'],
    abstractedReqIds: [],
  },
  {
    id: 'EU-AIA-ART-5',
    regulationId: 'eu-ai-act',
    path: ['Title II — Prohibited AI Practices'],
    number: 'Article 5',
    title: 'Prohibited AI practices',
    summary:
      'Prohibits AI systems that use subliminal manipulation, exploit vulnerabilities of specific groups, enable social scoring by public authorities, use real-time remote biometric identification in public spaces (with limited law-enforcement exceptions), and AI systems used for emotion recognition in workplace/education contexts.',
    tags: ['prohibited', 'fundamental-rights', 'biometric'],
    abstractedReqIds: ['AR-015'],
  },
  {
    id: 'EU-AIA-ART-6',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 1 — Classification'],
    number: 'Article 6',
    title: 'Classification rules for high-risk AI systems',
    summary:
      'Defines two categories of high-risk AI: systems that are safety components of products covered by existing EU legislation (Annex I), and AI systems listed in Annex III covering critical infrastructure, education, employment, essential services, law enforcement, migration, and justice.',
    tags: ['high-risk', 'classification'],
    abstractedReqIds: ['AR-018'],
  },
  {
    id: 'EU-AIA-ART-8',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 8',
    title: 'Compliance with requirements',
    summary:
      'Establishes that high-risk AI systems must comply with the requirements of Chapter 2 throughout their entire lifecycle, taking into account their intended purpose and the generally acknowledged state of the art.',
    tags: ['high-risk', 'compliance'],
    abstractedReqIds: ['AR-007'],
  },
  {
    id: 'EU-AIA-ART-9',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 9',
    title: 'Risk management system',
    summary:
      'Requires providers of high-risk AI systems to establish, implement, document and maintain a risk management system throughout the lifecycle. This includes identifying and analysing known and reasonably foreseeable risks, estimating and evaluating risks, and adopting suitable risk management measures.',
    tags: ['risk-management', 'high-risk', 'documentation'],
    abstractedReqIds: ['AR-001'],
  },
  {
    id: 'EU-AIA-ART-10',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 10',
    title: 'Data and data governance',
    summary:
      'Requires that training, validation and testing data for high-risk AI systems be subject to appropriate data governance practices, ensuring relevance, representativeness, and freedom from errors. Data must be processed in accordance with the purpose of the AI system, and must address data gaps and biases.',
    tags: ['data', 'governance', 'high-risk', 'bias'],
    abstractedReqIds: ['AR-003', 'AR-010', 'AR-011'],
  },
  {
    id: 'EU-AIA-ART-11',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 11',
    title: 'Technical documentation',
    summary:
      'Requires providers to draw up technical documentation before placing a high-risk AI system on the market and to keep it updated. The documentation must demonstrate compliance with all applicable requirements and contain the information specified in Annex IV.',
    tags: ['documentation', 'high-risk'],
    abstractedReqIds: ['AR-002'],
  },
  {
    id: 'EU-AIA-ART-12',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 12',
    title: 'Record-keeping',
    summary:
      'Requires high-risk AI systems to be capable of automatically logging events (logs) throughout their lifetime, to the extent enabled by the system. These logs must be retained for appropriate periods to facilitate post-market monitoring and incident investigation.',
    tags: ['record-keeping', 'logging', 'high-risk'],
    abstractedReqIds: ['AR-017'],
  },
  {
    id: 'EU-AIA-ART-13',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 13',
    title: 'Transparency and provision of information to deployers',
    summary:
      "Requires high-risk AI systems to be sufficiently transparent to enable deployers to interpret outputs and use them appropriately. Systems must be accompanied by instructions for use containing information about the provider, the system's characteristics, performance metrics, limitations, and human oversight measures.",
    tags: ['transparency', 'high-risk', 'information'],
    abstractedReqIds: ['AR-005', 'AR-013'],
  },
  {
    id: 'EU-AIA-ART-14',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 14',
    title: 'Human oversight',
    summary:
      'Requires high-risk AI systems to be designed and developed to enable effective human oversight. This includes enabling natural persons to understand AI system capabilities and limitations, monitor operations, intervene or interrupt when necessary, and not rely excessively on AI outputs.',
    tags: ['human-oversight', 'high-risk'],
    abstractedReqIds: ['AR-004'],
  },
  {
    id: 'EU-AIA-ART-15',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 2 — Requirements'],
    number: 'Article 15',
    title: 'Accuracy, robustness and cybersecurity',
    summary:
      'Requires high-risk AI systems to achieve an appropriate level of accuracy, robustness, and cybersecurity throughout their lifecycle. Systems must be resilient against errors, faults, or inconsistencies, and protected against attempts to alter their use, outputs, or performance through adversarial attacks.',
    tags: ['accuracy', 'robustness', 'cybersecurity', 'high-risk'],
    abstractedReqIds: ['AR-006'],
  },
  {
    id: 'EU-AIA-ART-16',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 3 — Obligations'],
    number: 'Article 16',
    title: 'Obligations of providers of high-risk AI systems',
    summary:
      'Lists obligations for providers: ensuring compliance with requirements, registering in the EU database, affixing the CE marking, taking corrective action when non-compliant, informing national authorities of risks and serious incidents.',
    tags: ['provider', 'obligations', 'high-risk'],
    abstractedReqIds: ['AR-009', 'AR-014'],
  },
  {
    id: 'EU-AIA-ART-17',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 3 — Obligations'],
    number: 'Article 17',
    title: 'Quality management system',
    summary:
      'Requires providers of high-risk AI systems to implement a quality management system covering strategies for regulatory compliance, design and development procedures, testing and validation, data governance, record-keeping obligations, and post-market monitoring plans.',
    tags: ['quality-management', 'high-risk', 'governance'],
    abstractedReqIds: ['AR-016', 'AR-009'],
  },
  {
    id: 'EU-AIA-ART-25',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 3 — Obligations'],
    number: 'Article 25',
    title: 'Obligations of deployers',
    summary:
      'Deployers of high-risk AI systems must use them in accordance with their instructions, ensure human oversight, monitor operation, inform providers of risks, maintain logs where they have control, and ensure workers are trained on AI capabilities and limitations.',
    tags: ['deployer', 'obligations', 'high-risk'],
    abstractedReqIds: ['AR-012', 'AR-004'],
  },
  {
    id: 'EU-AIA-ART-43',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 5 — Standards and Conformity'],
    number: 'Article 43',
    title: 'Conformity assessment',
    summary:
      'High-risk AI systems listed in Annex III must undergo conformity assessment before market placement. Depending on the system type, this can be internal control (Annex VI) or involving a notified body. The assessment must verify compliance with all applicable requirements.',
    tags: ['conformity', 'assessment', 'certification'],
    abstractedReqIds: ['AR-007'],
  },
  {
    id: 'EU-AIA-ART-49',
    regulationId: 'eu-ai-act',
    path: ['Title III — High-Risk AI Systems', 'Chapter 5 — Standards and Conformity'],
    number: 'Article 49',
    title: 'Registration',
    summary:
      'Providers must register high-risk AI systems in the EU database before market placement. Deployers of certain high-risk systems also have registration obligations. The registration must include information about the provider, the system, and compliance documentation.',
    tags: ['registration', 'database'],
    abstractedReqIds: [],
  },
  {
    id: 'EU-AIA-ART-50',
    regulationId: 'eu-ai-act',
    path: ['Title IV — Transparency Obligations'],
    number: 'Article 50',
    title: 'Transparency obligations for certain AI systems',
    summary:
      'AI systems interacting with natural persons must disclose that they are AI systems, unless obvious. Systems generating synthetic content must label the output as artificially generated. Providers of deep fakes must disclose the artificial nature of the content.',
    tags: ['transparency', 'chatbot', 'deepfake', 'disclosure'],
    abstractedReqIds: ['AR-005', 'AR-013'],
  },
  {
    id: 'EU-AIA-ART-53',
    regulationId: 'eu-ai-act',
    path: ['Title V — General-Purpose AI Models'],
    number: 'Article 53',
    title: 'Obligations for providers of GPAI models',
    summary:
      'Providers of general-purpose AI models must draw up and maintain technical documentation, provide it to downstream providers, implement a policy to respect copyright law, and publish a summary of training data content.',
    tags: ['gpai', 'documentation', 'copyright'],
    abstractedReqIds: ['AR-020', 'AR-002'],
  },
  {
    id: 'EU-AIA-ART-55',
    regulationId: 'eu-ai-act',
    path: ['Title V — General-Purpose AI Models'],
    number: 'Article 55',
    title: 'Obligations for providers of GPAI models with systemic risk',
    summary:
      'GPAI model providers whose models present systemic risk (as defined by compute thresholds) must perform adversarial testing (red-teaming), report serious incidents, ensure cybersecurity protections, and assess and mitigate systemic risks.',
    tags: ['gpai', 'systemic-risk', 'red-teaming', 'cybersecurity'],
    abstractedReqIds: ['AR-020', 'AR-006'],
  },
  {
    id: 'EU-AIA-ART-72',
    regulationId: 'eu-ai-act',
    path: ['Title VIII — Post-Market Monitoring'],
    number: 'Article 72',
    title: 'Post-market monitoring',
    summary:
      'Providers must implement a post-market monitoring system proportional to the nature of the AI technology and the risks involved, collecting and reviewing data from users throughout the product lifetime and taking necessary corrective actions.',
    tags: ['monitoring', 'post-market', 'lifecycle'],
    abstractedReqIds: ['AR-008'],
  },
  {
    id: 'EU-AIA-ART-73',
    regulationId: 'eu-ai-act',
    path: ['Title VIII — Post-Market Monitoring'],
    number: 'Article 73',
    title: 'Reporting of serious incidents',
    summary:
      'Providers of high-risk AI systems placed on the EU market must report to national authorities any serious incidents or malfunctions that constitute a breach of obligations under Union law, without undue delay and no later than 15 days after becoming aware.',
    tags: ['incident-reporting', 'serious-incident', 'notification'],
    abstractedReqIds: ['AR-008'],
  },
  {
    id: 'EU-AIA-ART-85',
    regulationId: 'eu-ai-act',
    path: ['Title XII — Final Provisions'],
    number: 'Article 85',
    title: 'Right to explanation',
    summary:
      'Affected persons subject to decisions based significantly on high-risk AI system outputs have the right to obtain an explanation of the role of the AI system in the decision-making procedure and the main elements of the decision.',
    tags: ['explainability', 'rights', 'transparency'],
    abstractedReqIds: ['AR-005'],
  },
  {
    id: 'EU-AIA-ART-99',
    regulationId: 'eu-ai-act',
    path: ['Title XII — Final Provisions'],
    number: 'Article 99',
    title: 'Penalties',
    summary:
      'Infringements of Article 5 (prohibited practices) are subject to fines up to €35 million or 7% of global annual turnover. Non-compliance with other requirements is subject to fines up to €15 million or 3% of global annual turnover.',
    tags: ['penalties', 'enforcement'],
    abstractedReqIds: [],
  },

  // ── NIST AI RMF — GOVERN ──────────────────
  {
    id: 'NIST-GOVERN-1-1',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 1.1',
    title: 'AI risk management policies established',
    summary:
      'Policies, processes, procedures, and practices across the organization related to the mapping, measuring, and managing of AI risks are in place, transparent, and implemented effectively.',
    tags: ['governance', 'policy', 'risk-management'],
    abstractedReqIds: ['AR-001', 'AR-016'],
  },
  {
    id: 'NIST-GOVERN-1-2',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 1.2',
    title: 'Accountability for AI risk',
    summary:
      'Organizational teams are committed to a culture that considers and communicates AI risk. Accountability and responsibility for decisions about AI are designated at appropriate levels of the organization.',
    tags: ['accountability', 'governance'],
    abstractedReqIds: ['AR-009'],
  },
  {
    id: 'NIST-GOVERN-1-3',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 1.3',
    title: 'Organizational risk tolerance for AI',
    summary:
      'Organizational risk tolerances are established, communicated, and inform decision-making for AI systems. Risk tolerance thresholds are calibrated to reflect the potential negative impacts of AI systems on individuals and communities.',
    tags: ['risk-tolerance', 'governance'],
    abstractedReqIds: ['AR-001'],
  },
  {
    id: 'NIST-GOVERN-1-4',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 1.4',
    title: 'Organizational risk culture',
    summary:
      'Organizational teams are committed to a culture that considers and communicates AI risk, including senior leadership commitment. AI risk management is prioritized alongside performance and commercial objectives.',
    tags: ['culture', 'leadership'],
    abstractedReqIds: ['AR-016'],
  },
  {
    id: 'NIST-GOVERN-1-5',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 1.5',
    title: 'Ongoing monitoring processes',
    summary:
      'Ongoing monitoring and periodic review of AI risk management policies and processes are established and in place. Monitoring processes capture changes in AI system use, operational context, and emerging risks.',
    tags: ['monitoring', 'review'],
    abstractedReqIds: ['AR-008'],
  },
  {
    id: 'NIST-GOVERN-1-6',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 1.6',
    title: 'Policies apply to third-party AI',
    summary:
      'Policies and procedures for AI risk management include third-party AI providers, deployers, and other stakeholders across the AI lifecycle, including supply chain partners.',
    tags: ['third-party', 'supply-chain'],
    abstractedReqIds: ['AR-012'],
  },
  {
    id: 'NIST-GOVERN-1-7',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 1.7',
    title: 'AI lifecycle processes documented',
    summary:
      'Processes for AI lifecycle stages (development, deployment, operation, retirement) are documented, including how risks are managed across each stage, roles and responsibilities, and how documentation is maintained and updated.',
    tags: ['lifecycle', 'documentation'],
    abstractedReqIds: ['AR-002', 'AR-017'],
  },
  {
    id: 'NIST-GOVERN-2-1',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 2.1',
    title: 'Roles and responsibilities defined',
    summary:
      'Roles and responsibilities and organizational reporting hierarchies for AI risk management are established, documented, and communicated across the organization.',
    tags: ['roles', 'accountability'],
    abstractedReqIds: ['AR-009', 'AR-004'],
  },
  {
    id: 'NIST-GOVERN-2-2',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 2.2',
    title: 'Cross-functional AI risk teams',
    summary:
      'AI risk management is integrated into broader enterprise risk functions through cross-functional teams that include legal, compliance, technical, and product roles alongside diverse perspectives.',
    tags: ['cross-functional', 'governance'],
    abstractedReqIds: ['AR-014'],
  },
  {
    id: 'NIST-GOVERN-3-1',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 3.1',
    title: 'Workforce diversity and inclusion',
    summary:
      'Workforce diversity, equity, inclusion, and accessibility processes are prioritized in the mapping, measuring, and managing of AI risks throughout the AI lifecycle.',
    tags: ['diversity', 'fairness', 'workforce'],
    abstractedReqIds: ['AR-010'],
  },
  {
    id: 'NIST-GOVERN-3-2',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 3.2',
    title: 'AI practitioner competence',
    summary:
      'Policies and procedures are in place to define and differentiate roles and responsibilities for human-AI configurations and human oversight of AI systems. AI practitioners are identified and their competencies validated.',
    tags: ['training', 'competence', 'oversight'],
    abstractedReqIds: ['AR-014', 'AR-004'],
  },
  {
    id: 'NIST-GOVERN-4-1',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 4.1',
    title: 'AI risk in enterprise risk management',
    summary:
      'Organizational risk priorities are integrated into AI risk management activities via enterprise risk management (ERM), including at the board and C-suite level where applicable.',
    tags: ['enterprise-risk', 'governance'],
    abstractedReqIds: ['AR-016'],
  },
  {
    id: 'NIST-GOVERN-4-2',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 4.2',
    title: 'AI risk policies aligned across enterprise',
    summary:
      'Organizational teams responsible for AI risk management have authority to act on AI risk decisions and are aligned with broader enterprise policies, legal obligations, and stakeholder expectations.',
    tags: ['governance', 'enterprise'],
    abstractedReqIds: ['AR-016'],
  },
  {
    id: 'NIST-GOVERN-5-1',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 5.1',
    title: 'Risk priorities inform AI management',
    summary:
      'Organizational risk priorities, including those from legal, compliance, and policy sources, inform the approach to AI risk management and the selection of AI use cases.',
    tags: ['risk-priorities', 'governance'],
    abstractedReqIds: ['AR-015', 'AR-001'],
  },
  {
    id: 'NIST-GOVERN-5-2',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 5.2',
    title: 'AI risk connected to business objectives',
    summary:
      'AI risk management is integrated with business objectives, with risk decisions reflecting trade-offs between organizational opportunity and the potential negative impacts of AI deployment.',
    tags: ['business-objectives', 'governance'],
    abstractedReqIds: [],
  },
  {
    id: 'NIST-GOVERN-6-1',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 6.1',
    title: 'Policies for third-party AI components',
    summary:
      'Policies and procedures are established for risk management of third-party AI technologies, data, and services, including due diligence in procurement and ongoing monitoring of supply chain risks.',
    tags: ['third-party', 'supply-chain', 'procurement'],
    abstractedReqIds: ['AR-012'],
  },
  {
    id: 'NIST-GOVERN-6-2',
    regulationId: 'nist-ai-rmf',
    path: ['GOVERN — Policies and Culture'],
    number: 'GOVERN 6.2',
    title: 'Policies reflect applicable laws',
    summary:
      'Organizational policies for AI risk management reflect applicable laws, regulations, and industry standards, and are regularly reviewed and updated as the legal and regulatory landscape evolves.',
    tags: ['compliance', 'legal', 'regulations'],
    abstractedReqIds: ['AR-015'],
  },

  // ── NIST AI RMF — MAP ─────────────────────
  {
    id: 'NIST-MAP-1-1',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 1.1',
    title: 'AI deployment context established',
    summary:
      'Context is established for framing risks related to an AI system, including its intended purpose, deployment context, users, and affected groups. This context informs subsequent risk identification and evaluation.',
    tags: ['context', 'purpose', 'users'],
    abstractedReqIds: ['AR-005', 'AR-013'],
  },
  {
    id: 'NIST-MAP-1-2',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 1.2',
    title: 'Scientific and sector knowledge consulted',
    summary:
      'Scientific principles underpinning AI risk identification and evaluation are understood by teams and documented. Sector- and context-specific risks are identified using domain expertise.',
    tags: ['scientific', 'domain-knowledge'],
    abstractedReqIds: [],
  },
  {
    id: 'NIST-MAP-1-3',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 1.3',
    title: 'AI system categorized',
    summary:
      'The AI system to be deployed is categorized according to its risk level, using established frameworks for trustworthiness characteristics including fairness, reliability, safety, privacy, and explainability.',
    tags: ['categorization', 'trustworthiness', 'risk-level'],
    abstractedReqIds: ['AR-018'],
  },
  {
    id: 'NIST-MAP-1-5',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 1.5',
    title: 'Risk tolerances applied to AI',
    summary:
      'Organizational risk tolerances are applied to AI systems in context. Risks are evaluated against established thresholds to determine whether AI deployment is appropriate and what risk treatments are required.',
    tags: ['risk-tolerance', 'evaluation'],
    abstractedReqIds: ['AR-001'],
  },
  {
    id: 'NIST-MAP-1-6',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 1.6',
    title: 'AI context and affected groups documented',
    summary:
      'AI system deployment context, including the operational environment, affected individuals and groups, relevant societal and cultural considerations, and potential for downstream harms, is documented and considered in risk management.',
    tags: ['context', 'affected-groups', 'transparency'],
    abstractedReqIds: ['AR-005', 'AR-013'],
  },
  {
    id: 'NIST-MAP-2-2',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 2.2',
    title: 'AI risk data from diverse sources',
    summary:
      'AI risk and benefit data is collected from technical experts, domain practitioners, affected communities, and other stakeholders to ensure a comprehensive view of potential harms and benefits.',
    tags: ['data-collection', 'stakeholders', 'diverse'],
    abstractedReqIds: ['AR-003'],
  },
  {
    id: 'NIST-MAP-2-3',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 2.3',
    title: 'AI system risks documented',
    summary:
      'AI system risks, likelihood, and potential impacts are documented in a structured risk register that is reviewed and updated as the system evolves. Both technical and societal risks are included.',
    tags: ['risk-register', 'documentation'],
    abstractedReqIds: ['AR-001', 'AR-002'],
  },
  {
    id: 'NIST-MAP-3-3',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 3.3',
    title: 'Risks and benefits to individuals mapped',
    summary:
      'AI system risks and benefits to individuals, groups, and affected communities are mapped across the AI lifecycle, including consideration of disparate impacts and cumulative harms.',
    tags: ['impact', 'fairness', 'affected-groups'],
    abstractedReqIds: ['AR-010', 'AR-019'],
  },
  {
    id: 'NIST-MAP-3-4',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 3.4',
    title: 'Third-party component risks identified',
    summary:
      'Risks from use of third-party AI data, tools, models, and systems are identified and documented. Organizational risk management processes account for external dependencies.',
    tags: ['third-party', 'supply-chain'],
    abstractedReqIds: ['AR-012'],
  },
  {
    id: 'NIST-MAP-5-1',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 5.1',
    title: 'Likelihood and impact documented',
    summary:
      'Likelihood and magnitude of each identified AI risk is estimated and documented. Impact assessments consider the severity and breadth of potential harms across technical, social, and organizational dimensions.',
    tags: ['risk-assessment', 'impact', 'likelihood'],
    abstractedReqIds: ['AR-001'],
  },
  {
    id: 'NIST-MAP-5-2',
    regulationId: 'nist-ai-rmf',
    path: ['MAP — Context and Categorization'],
    number: 'MAP 5.2',
    title: 'Risk information sharing practices',
    summary:
      'Practices for sharing AI risk information within the organization and with external stakeholders, including affected communities, regulators, and partners, are established and followed.',
    tags: ['communication', 'transparency', 'sharing'],
    abstractedReqIds: ['AR-005'],
  },

  // ── NIST AI RMF — MEASURE ─────────────────
  {
    id: 'NIST-MEASURE-1-1',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 1.1',
    title: 'AI risk measurement methods identified',
    summary:
      'Approaches and metrics for measuring AI risks are identified and agreed upon by relevant organizational teams. Methods reflect the nature, context, and scale of the AI system and cover trustworthiness characteristics.',
    tags: ['measurement', 'metrics', 'methods'],
    abstractedReqIds: ['AR-007'],
  },
  {
    id: 'NIST-MEASURE-1-2',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 1.2',
    title: 'Trustworthiness characteristics measured',
    summary:
      "Approaches for evaluating the AI system's trustworthiness characteristics — including accuracy, fairness, reliability, explainability, privacy, and security — are established and applied across the AI lifecycle.",
    tags: ['trustworthiness', 'evaluation'],
    abstractedReqIds: ['AR-007'],
  },
  {
    id: 'NIST-MEASURE-2-1',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.1',
    title: 'Test sets representative of deployment',
    summary:
      'Test sets used to evaluate AI system performance are representative of the intended deployment context, including diverse data, edge cases, and potential failure modes.',
    tags: ['testing', 'evaluation', 'representativeness'],
    abstractedReqIds: ['AR-003'],
  },
  {
    id: 'NIST-MEASURE-2-3',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.3',
    title: 'Safety and bias evaluation',
    summary:
      'AI system performance is evaluated on safety, reliability, and bias metrics relevant to the deployment context. Evaluations include assessments of disparate performance across subgroups.',
    tags: ['safety', 'bias', 'evaluation'],
    abstractedReqIds: ['AR-010', 'AR-006'],
  },
  {
    id: 'NIST-MEASURE-2-5',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.5',
    title: 'Robustness evaluated',
    summary:
      'The robustness of the AI system to distribution shift, adversarial inputs, and operational variability is evaluated. Robustness assessments inform risk treatment and deployment decisions.',
    tags: ['robustness', 'adversarial', 'evaluation'],
    abstractedReqIds: ['AR-006'],
  },
  {
    id: 'NIST-MEASURE-2-6',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.6',
    title: 'Explainability methods applied',
    summary:
      'Explainability and interpretability methods are applied to AI systems to provide human-understandable insights into model behaviour, limitations, and outputs. Results are communicated to relevant stakeholders.',
    tags: ['explainability', 'interpretability', 'transparency'],
    abstractedReqIds: ['AR-005'],
  },
  {
    id: 'NIST-MEASURE-2-7',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.7',
    title: 'Security and privacy tested',
    summary:
      'AI system security vulnerabilities and privacy risks are evaluated through testing, including adversarial testing where applicable. Security assessments cover the full system including data pipelines and APIs.',
    tags: ['security', 'privacy', 'testing'],
    abstractedReqIds: ['AR-006', 'AR-011'],
  },
  {
    id: 'NIST-MEASURE-2-8',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.8',
    title: 'Fairness and bias measured',
    summary:
      'Fairness and bias are evaluated using appropriate metrics and methodologies, including disaggregated performance analysis across demographic groups. Evaluation results inform risk treatment decisions.',
    tags: ['fairness', 'bias', 'metrics'],
    abstractedReqIds: ['AR-010'],
  },
  {
    id: 'NIST-MEASURE-2-9',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.9',
    title: 'Privacy risks evaluated',
    summary:
      "Privacy risks are evaluated in the context of the AI system's data practices, including collection, retention, inference, and sharing. Evaluations are informed by applicable privacy laws and best practices.",
    tags: ['privacy', 'evaluation'],
    abstractedReqIds: ['AR-011'],
  },
  {
    id: 'NIST-MEASURE-2-10',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.10',
    title: 'Privacy risk management applied',
    summary:
      'Privacy risk management practices, including data minimisation, consent mechanisms, and privacy-by-design principles, are applied throughout the AI lifecycle.',
    tags: ['privacy', 'data-minimisation', 'design'],
    abstractedReqIds: ['AR-011'],
  },
  {
    id: 'NIST-MEASURE-2-11',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 2.11',
    title: 'Environmental impact measured',
    summary:
      'The environmental impact of AI systems, including energy consumption and carbon footprint of training and inference, is estimated and documented as part of the risk assessment.',
    tags: ['environment', 'sustainability'],
    abstractedReqIds: ['AR-019'],
  },
  {
    id: 'NIST-MEASURE-3-1',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 3.1',
    title: 'Risk treatment decisions documented',
    summary:
      'Risk treatment decisions, including accepted residual risks and the rationale for treatment choices, are documented and communicated to appropriate stakeholders across the organization.',
    tags: ['documentation', 'risk-treatment'],
    abstractedReqIds: ['AR-002', 'AR-017'],
  },
  {
    id: 'NIST-MEASURE-3-2',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 3.2',
    title: 'Risk metrics monitored over lifecycle',
    summary:
      'Identified AI risks are monitored over the lifecycle using established metrics. Changes in risk levels are detected and responded to in a timely manner.',
    tags: ['monitoring', 'lifecycle', 'metrics'],
    abstractedReqIds: ['AR-008', 'AR-017'],
  },
  {
    id: 'NIST-MEASURE-4-1',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 4.1',
    title: 'Risk response effectiveness defined',
    summary:
      'Metrics for evaluating the effectiveness of AI risk responses are defined before deployment and tracked over time. Effectiveness evaluations inform continuous improvement of risk management processes.',
    tags: ['effectiveness', 'metrics', 'evaluation'],
    abstractedReqIds: ['AR-008'],
  },
  {
    id: 'NIST-MEASURE-4-2',
    regulationId: 'nist-ai-rmf',
    path: ['MEASURE — Analysis and Assessment'],
    number: 'MEASURE 4.2',
    title: 'Risks monitored post-deployment',
    summary:
      'Identified AI risks are monitored following deployment using defined processes, and monitoring results are used to update risk assessments and treatment plans as appropriate.',
    tags: ['monitoring', 'post-deployment'],
    abstractedReqIds: ['AR-008'],
  },

  // ── NIST AI RMF — MANAGE ─────────────────
  {
    id: 'NIST-MANAGE-1-1',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 1.1',
    title: 'Risks prioritized for treatment',
    summary:
      'Risks based on risk assessments are prioritized for treatment. Prioritization considers the likelihood and magnitude of harm, the feasibility of treatment options, and organizational risk tolerances.',
    tags: ['prioritization', 'risk-treatment'],
    abstractedReqIds: ['AR-001'],
  },
  {
    id: 'NIST-MANAGE-1-2',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 1.2',
    title: 'Treatment of risks documented',
    summary:
      'Treatment of prioritized AI risks is documented, including the selected risk response (accept, mitigate, transfer, avoid), implementation details, and accountability for follow-through.',
    tags: ['risk-treatment', 'documentation'],
    abstractedReqIds: ['AR-002', 'AR-017'],
  },
  {
    id: 'NIST-MANAGE-1-3',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 1.3',
    title: 'Response plans for remaining risks',
    summary:
      'Response plans are established for AI risks that cannot be fully mitigated, including contingency plans, fallback procedures, and escalation paths for unexpected risk materialisation.',
    tags: ['contingency', 'planning', 'residual-risk'],
    abstractedReqIds: ['AR-001'],
  },
  {
    id: 'NIST-MANAGE-2-1',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 2.1',
    title: 'Incident reporting mechanisms',
    summary:
      'Mechanisms are established for users and other stakeholders to report AI incidents, near misses, and unexpected outcomes. Reporting channels are accessible, well-communicated, and regularly tested.',
    tags: ['incident-reporting', 'reporting', 'mechanisms'],
    abstractedReqIds: ['AR-008'],
  },
  {
    id: 'NIST-MANAGE-2-2',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 2.2',
    title: 'AI incidents documented and communicated',
    summary:
      'Responses to AI incidents, including corrective actions taken, root cause analyses, and lessons learned, are documented and communicated to relevant stakeholders.',
    tags: ['incident-response', 'communication', 'documentation'],
    abstractedReqIds: ['AR-008'],
  },
  {
    id: 'NIST-MANAGE-2-3',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 2.3',
    title: 'AI risks tracked over time',
    summary:
      'AI risks, including residual risks and newly identified risks, are tracked over the lifecycle of the AI system. Tracking processes are systematic and include regular review intervals.',
    tags: ['tracking', 'monitoring', 'lifecycle'],
    abstractedReqIds: ['AR-008', 'AR-017'],
  },
  {
    id: 'NIST-MANAGE-3-1',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 3.1',
    title: 'Risk response plans tested',
    summary:
      'AI risk response plans are tested and exercised before and during deployment to verify their effectiveness and identify gaps. Testing results are used to improve response capability.',
    tags: ['testing', 'response-plans'],
    abstractedReqIds: ['AR-007'],
  },
  {
    id: 'NIST-MANAGE-3-2',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 3.2',
    title: 'Pre-deployment risk treatment activated',
    summary:
      'Pre-deployment risk treatment plans, including configuration settings, access controls, monitoring mechanisms, and human oversight protocols, are activated and verified before the AI system goes live.',
    tags: ['deployment', 'pre-deployment', 'activation'],
    abstractedReqIds: ['AR-004'],
  },
  {
    id: 'NIST-MANAGE-4-1',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 4.1',
    title: 'Post-deployment risk monitoring in place',
    summary:
      'Post-deployment AI risk monitoring mechanisms, including system performance dashboards, anomaly detection, and feedback loops from users and affected communities, are in place and actively used.',
    tags: ['monitoring', 'post-deployment', 'feedback'],
    abstractedReqIds: ['AR-008'],
  },
  {
    id: 'NIST-MANAGE-4-2',
    regulationId: 'nist-ai-rmf',
    path: ['MANAGE — Risk Response'],
    number: 'MANAGE 4.2',
    title: 'Risk treatment effectiveness reviewed',
    summary:
      'The effectiveness of AI system risk treatments is reviewed on a regular basis. Reviews consider changes in deployment context, emerging risks, incident data, and user feedback.',
    tags: ['review', 'effectiveness', 'continuous-improvement'],
    abstractedReqIds: ['AR-008'],
  },
]

// ──────────────────────────────────────────────
// ABSTRACTED REQUIREMENTS
// ──────────────────────────────────────────────

export const ABSTRACTED_REQUIREMENTS: AbstractedRequirement[] = [
  {
    id: 'AR-001',
    title: 'Risk Management System',
    description:
      'Organisations must establish and maintain a systematic process for identifying, analysing, evaluating, and treating AI risks across the full lifecycle of the AI system. The risk management system should be documented, proportionate to the risk level of the AI system, and subject to ongoing review and improvement.',
    category: 'Governance',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-9', articleRef: 'Article 9', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-1-1', articleRef: 'GOVERN 1.1', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-1-3', articleRef: 'GOVERN 1.3', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-5-1', articleRef: 'MAP 5.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-1-1', articleRef: 'MANAGE 1.1', relevance: 'related' },
    ],
  },
  {
    id: 'AR-002',
    title: 'Technical Documentation',
    description:
      'Providers must create and maintain comprehensive technical documentation that demonstrates compliance with applicable requirements before placing an AI system on the market or into service. Documentation must be kept current, cover the system design and risk management measures, and be made available to relevant authorities on request.',
    category: 'Documentation',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-11', articleRef: 'Article 11', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-1-7', articleRef: 'GOVERN 1.7', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-3-1', articleRef: 'MEASURE 3.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-1-2', articleRef: 'MANAGE 1.2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-003',
    title: 'Data Quality and Governance',
    description:
      'Training, validation, and testing datasets must be subject to appropriate data governance practices to ensure they are relevant, representative, and free from errors that could lead to discriminatory outcomes. Data lineage, quality controls, and dataset documentation should be maintained throughout the AI lifecycle.',
    category: 'Data',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-10', articleRef: 'Article 10', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-2-2', articleRef: 'MAP 2.2', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-1', articleRef: 'MEASURE 2.1', relevance: 'related' },
    ],
  },
  {
    id: 'AR-004',
    title: 'Human Oversight Mechanisms',
    description:
      'AI systems, particularly those used in high-stakes contexts, must be designed and deployed with effective human oversight capabilities that allow natural persons to monitor, understand, and intervene in AI system operation. Deployers must designate individuals responsible for oversight and ensure they are adequately trained.',
    category: 'Oversight',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-14', articleRef: 'Article 14', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-25', articleRef: 'Article 25', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-2-1', articleRef: 'GOVERN 2.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-3-2', articleRef: 'GOVERN 3.2', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-3-2', articleRef: 'MANAGE 3.2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-005',
    title: 'Transparency and Explainability',
    description:
      'AI systems must provide sufficient transparency to enable users and affected persons to understand how outputs are generated, the limitations of the system, and the role of AI in consequential decisions. Explainability methods should be applied and results communicated in an accessible manner.',
    category: 'Transparency',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-13', articleRef: 'Article 13', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-50', articleRef: 'Article 50', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-85', articleRef: 'Article 85', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-6', articleRef: 'MEASURE 2.6', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-1-6', articleRef: 'MAP 1.6', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-5-2', articleRef: 'MAP 5.2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-006',
    title: 'Accuracy, Robustness and Cybersecurity',
    description:
      'AI systems must achieve appropriate levels of accuracy and robustness, remaining reliable under operational variability and adversarial conditions. Cybersecurity measures must protect the system from attacks that could alter its behaviour, outputs, or performance.',
    category: 'Technical',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-15', articleRef: 'Article 15', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-55', articleRef: 'Article 55', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-5', articleRef: 'MEASURE 2.5', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-7', articleRef: 'MEASURE 2.7', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-3', articleRef: 'MEASURE 2.3', relevance: 'related' },
    ],
  },
  {
    id: 'AR-007',
    title: 'Conformity Assessment and Testing',
    description:
      'AI systems must undergo appropriate conformity assessment or testing procedures before deployment to verify compliance with applicable requirements. Assessment methods should be proportionate to the risk level and may involve independent third-party evaluation for higher-risk systems.',
    category: 'Technical',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-43', articleRef: 'Article 43', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-8', articleRef: 'Article 8', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-1-1', articleRef: 'MEASURE 1.1', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-1-2', articleRef: 'MEASURE 1.2', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-3-1', articleRef: 'MANAGE 3.1', relevance: 'related' },
    ],
  },
  {
    id: 'AR-008',
    title: 'Incident Reporting and Post-Market Monitoring',
    description:
      'Organisations must implement mechanisms for detecting, documenting, and reporting AI incidents and malfunctions, including serious incidents that may constitute a breach of legal obligations. Post-deployment monitoring processes should continuously track system performance and emerging risks throughout the operational lifecycle.',
    category: 'Governance',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-72', articleRef: 'Article 72', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-73', articleRef: 'Article 73', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-4-1', articleRef: 'MANAGE 4.1', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-2-1', articleRef: 'MANAGE 2.1', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-4-2', articleRef: 'MANAGE 4.2', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-3-2', articleRef: 'MEASURE 3.2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-009',
    title: 'Governance and Accountability Structure',
    description:
      'Organisations must establish clear governance structures with defined roles, responsibilities, and reporting lines for AI risk management. Accountability for AI decisions and compliance obligations must be assigned at appropriate organisational levels and documented.',
    category: 'Governance',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-17', articleRef: 'Article 17', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-16', articleRef: 'Article 16', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-2-1', articleRef: 'GOVERN 2.1', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-1-2', articleRef: 'GOVERN 1.2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-010',
    title: 'Bias and Fairness Evaluation',
    description:
      'AI systems must be evaluated for potential bias and unfair outcomes, including disaggregated performance analysis across demographic groups. Data governance practices must address the potential for biased training data, and evaluation results must inform risk treatment decisions.',
    category: 'Technical',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-10', articleRef: 'Article 10', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-8', articleRef: 'MEASURE 2.8', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-3-1', articleRef: 'GOVERN 3.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-3-3', articleRef: 'MAP 3.3', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-3', articleRef: 'MEASURE 2.3', relevance: 'related' },
    ],
  },
  {
    id: 'AR-011',
    title: 'Privacy and Data Protection',
    description:
      'AI systems must be designed and operated in a manner that protects the privacy of individuals whose data is used for training, validation, or inference. Privacy risk assessments should be conducted, and privacy-by-design principles applied throughout the AI lifecycle.',
    category: 'Security',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-10', articleRef: 'Article 10', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-9', articleRef: 'MEASURE 2.9', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-10', articleRef: 'MEASURE 2.10', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-7', articleRef: 'MEASURE 2.7', relevance: 'related' },
    ],
  },
  {
    id: 'AR-012',
    title: 'Supply Chain and Third-Party Risk',
    description:
      'Organisations must identify and manage risks arising from the use of third-party AI components, datasets, tools, and services. Policies and procedures for due diligence, ongoing monitoring, and contractual obligations for supply chain partners should be established.',
    category: 'Governance',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-25', articleRef: 'Article 25', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-6-1', articleRef: 'GOVERN 6.1', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-3-4', articleRef: 'MAP 3.4', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-1-6', articleRef: 'GOVERN 1.6', relevance: 'related' },
    ],
  },
  {
    id: 'AR-013',
    title: 'User Disclosure and Information Rights',
    description:
      "Individuals interacting with AI systems or subject to AI-influenced decisions must be informed of the AI system's involvement and have access to meaningful information about how the system works and their rights. Disclosure obligations apply to AI-generated content, chatbots, and automated decision-making.",
    category: 'Transparency',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-50', articleRef: 'Article 50', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-85', articleRef: 'Article 85', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-13', articleRef: 'Article 13', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-1-1', articleRef: 'MAP 1.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-1-6', articleRef: 'MAP 1.6', relevance: 'related' },
    ],
  },
  {
    id: 'AR-014',
    title: 'Workforce Competence and Training',
    description:
      'Organisations must ensure that personnel involved in developing, deploying, and overseeing AI systems have the necessary competences and receive appropriate training. This includes understanding AI capabilities and limitations, recognising potential risks, and knowing how to escalate issues.',
    category: 'Governance',
    refs: [
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-3-2', articleRef: 'GOVERN 3.2', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-2-2', articleRef: 'GOVERN 2.2', relevance: 'related' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-16', articleRef: 'Article 16', relevance: 'related' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-25', articleRef: 'Article 25', relevance: 'related' },
    ],
  },
  {
    id: 'AR-015',
    title: 'Prohibited and Restricted AI Uses',
    description:
      'Certain AI applications that pose unacceptable risks to fundamental rights, safety, or democratic values are prohibited outright, while others are subject to strict conditions and limitations. Organisations must identify applicable prohibitions and restrictions and ensure their AI systems do not fall within prohibited categories.',
    category: 'Governance',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-5', articleRef: 'Article 5', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-5-1', articleRef: 'GOVERN 5.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-6-2', articleRef: 'GOVERN 6.2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-016',
    title: 'Quality Management System',
    description:
      'Providers of AI systems, particularly high-risk systems, must implement a quality management system that embeds compliance into design, development, testing, and post-market processes. The QMS must cover documentation standards, change management, and continuous improvement.',
    category: 'Governance',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-17', articleRef: 'Article 17', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-1-1', articleRef: 'GOVERN 1.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-4-1', articleRef: 'GOVERN 4.1', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-4-2', articleRef: 'GOVERN 4.2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-017',
    title: 'Record-Keeping and Audit Trail',
    description:
      'AI systems must maintain comprehensive logs and records of their operation, decisions, and any incidents or anomalies. Records should be retained for appropriate periods, be tamper-evident, and support post-incident investigation, regulatory inspection, and continuous improvement.',
    category: 'Documentation',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-12', articleRef: 'Article 12', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-1-7', articleRef: 'GOVERN 1.7', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-3-1', articleRef: 'MEASURE 3.1', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-1-2', articleRef: 'MANAGE 1.2', relevance: 'related' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MANAGE-2-3', articleRef: 'MANAGE 2.3', relevance: 'related' },
    ],
  },
  {
    id: 'AR-018',
    title: 'Risk Classification and Categorisation',
    description:
      'AI systems must be classified according to their risk level using established criteria, with the classification determining the applicable compliance obligations. Classification processes should consider the intended use, affected populations, and potential severity and breadth of harm.',
    category: 'Governance',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-6', articleRef: 'Article 6', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-1-3', articleRef: 'MAP 1.3', relevance: 'direct' },
    ],
  },
  {
    id: 'AR-019',
    title: 'Environmental and Societal Impact Assessment',
    description:
      'The broader environmental and societal impacts of AI systems should be assessed and documented as part of the risk management process. This includes energy consumption, carbon footprint, and potential cumulative societal harms including disparate impacts on vulnerable communities.',
    category: 'Data',
    refs: [
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MEASURE-2-11', articleRef: 'MEASURE 2.11', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-MAP-3-3', articleRef: 'MAP 3.3', relevance: 'related' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-2', articleRef: 'Article 2', relevance: 'related' },
    ],
  },
  {
    id: 'AR-020',
    title: 'General Purpose AI Model Obligations',
    description:
      'Providers of general-purpose AI models must comply with transparency, documentation, and copyright obligations, with enhanced requirements for models that present systemic risk due to their scale or capability. Systemic-risk GPAI models require adversarial testing, incident reporting, and ongoing risk assessment.',
    category: 'Technical',
    refs: [
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-53', articleRef: 'Article 53', relevance: 'direct' },
      { regulationId: 'eu-ai-act', articleId: 'EU-AIA-ART-55', articleRef: 'Article 55', relevance: 'direct' },
      { regulationId: 'nist-ai-rmf', articleId: 'NIST-GOVERN-5-1', articleRef: 'GOVERN 5.1', relevance: 'related' },
    ],
  },
]
