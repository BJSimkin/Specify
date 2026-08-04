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

// ──────────────────────────────────────────────
// EU AI ACT EXPLORER — Full structured data
// Regulation (EU) 2024/1689
// ──────────────────────────────────────────────

export interface EUAIActArticle {
  id: string
  number: string
  title: string
  chapterId: string
  sectionId?: string
  text: string
  tags: string[]
  applicabilityDate?: string
}

export interface EUAIActSection {
  id: string
  title: string
  articles: EUAIActArticle[]
}

export interface EUAIActChapter {
  id: string
  number: string
  title: string
  sections?: EUAIActSection[]
  articles?: EUAIActArticle[]
}


export const EU_AI_ACT = {
  id: 'eu-ai-act-2024',
  name: 'Artificial Intelligence Act',
  shortName: 'EU AI Act',
  citation: 'Regulation (EU) 2024/1689',
  officialJournalRef: 'OJ L, 2024/1689, 12.7.2024',
  entryIntoForce: '2 August 2024',
  applicationDate: '2 August 2026',
  chapters: [
    {
      id: 'ch-1',
      number: 'I',
      title: 'General Provisions',
      articles: [
        {
          id: 'art-1',
          number: '1',
          title: 'Subject matter',
          chapterId: 'ch-1',
          tags: ['scope', 'general', 'purpose'],
          applicabilityDate: '2 August 2026',
          text: `1. The purpose of this Regulation is to improve the functioning of the internal market and promote the uptake of human-centric and trustworthy artificial intelligence (AI), while ensuring a high level of protection of health, safety, fundamental rights enshrined in the Charter, including democracy, the rule of law and environmental protection, against the harmful effects of AI systems in the Union and supporting innovation.

2. This Regulation lays down:
(a) harmonised rules for the placing on the market, the putting into service, and the use of AI systems in the Union;
(b) prohibitions of certain AI practices;
(c) specific requirements for high-risk AI systems and obligations for operators of such systems;
(d) harmonised transparency rules for certain AI systems;
(e) harmonised rules for the placing on the market of general-purpose AI models;
(f) rules on market monitoring, market surveillance, governance and enforcement;
(g) measures to support innovation, with a particular focus on SMEs, including start-ups.`,
        },
        {
          id: 'art-2',
          number: '2',
          title: 'Scope',
          chapterId: 'ch-1',
          tags: ['scope', 'applicability', 'territorial'],
          applicabilityDate: '2 August 2026',
          text: `1. This Regulation applies to:
(a) providers placing on the market or putting into service AI systems or placing on the market general-purpose AI models in the Union, irrespective of whether those providers are established or located within the Union or in a third country;
(b) deployers of AI systems that have their place of establishment or are located within the Union;
(c) providers and deployers of AI systems that have their place of establishment or are located in a third country, where the output produced by the AI system is used in the Union;
(d) importers and distributors of AI systems;
(e) product manufacturers placing on the market or putting into service an AI system together with their product and under their own name or trademark;
(f) authorised representatives of providers, which are not established in the Union;
(g) affected persons that are located in the Union.

2. For AI systems classified as high-risk AI systems in accordance with Article 6(1), in relation to the products covered by the Union harmonisation legislation listed in Section A of Annex I, only Article 6(1), Articles 102 to 109 and Article 112 shall apply if those products are not placed on the market or put into service in the Union.

3. This Regulation does not apply to AI systems or AI models, including their output, specifically developed and put into service for the sole purpose of scientific research and development.

4. This Regulation shall not apply to any research, testing or development activity regarding AI systems or AI models prior to their being placed on the market or put into service. Such activities shall be conducted in accordance with applicable Union law. Testing in real world conditions shall not be covered by that exclusion.

5. This Regulation shall not affect the application of Union law on the protection of personal data, privacy and the confidentiality of communications.

6. This Regulation shall not apply to AI systems where and insofar as they are placed on the market, put into service, or used with or without modification exclusively for military, defence or national security purposes, regardless of the type of entity carrying out those activities.

7. This Regulation shall not apply to AI systems which are not placed on the market or put into service in the Union, where the output is used exclusively for military, national security, defence or intelligence purposes.

8. This Regulation shall not apply to public authorities of a third country nor to international organisations falling within the scope of international public law, where those authorities or organisations use AI systems in the framework of international agreements for law enforcement and judicial cooperation with the Union or with one or more Member States.

9. This Regulation shall not apply to AI systems used for activities falling within the scope of Chapter 2 of Title V of the Treaty on European Union.`,
        },
        {
          id: 'art-3',
          number: '3',
          title: 'Definitions',
          chapterId: 'ch-1',
          tags: ['definitions', 'general'],
          applicabilityDate: '2 August 2026',
          text: `For the purposes of this Regulation, the following definitions apply:

(1) 'AI system' means a machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment, and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments;

(2) 'risk' means the combination of the probability of an occurrence of a harm and the severity of that harm;

(3) 'provider' means a natural or legal person, public authority, agency or other body that develops an AI system or a general-purpose AI model or that has an AI system or a general-purpose AI model developed and places it on the market or puts the AI system into service under its own name or trademark, whether for payment or free of charge;

(4) 'operator' means a provider, product manufacturer, deployer, authorised representative, importer or distributor;

(5) 'deployer' means a natural or legal person, public authority, agency or other body that uses an AI system under its authority except where the AI system is used in the course of a personal non-professional activity;

(6) 'authorised representative' means a natural or legal person located or established in the Union who has received and accepted a written mandate from a provider of an AI system or a general-purpose AI model to, respectively, perform and carry out on its behalf the obligations and procedures established by this Regulation;

(7) 'importer' means a natural or legal person located or established in the Union that places on the market an AI system that bears the name or trademark of a natural or legal person established in a third country;

(8) 'distributor' means a natural or legal person in the supply chain, other than the provider or the importer, that makes an AI system available on the Union market;

(9) 'operator' means a provider, product manufacturer, deployer, authorised representative, importer or distributor;

(10) 'intended purpose' means the use for which an AI system is intended by the provider, including the specific context and conditions of use, as specified in the information supplied by the provider in the instructions for use, promotional or sales materials and statements, as well as in the technical documentation;

(11) 'reasonably foreseeable misuse' means the use of an AI system in a way that is not in accordance with its intended purpose, but which may result from reasonably foreseeable human behaviour or interaction with other systems, including operational settings;

(12) 'safety component of a product or system' means a component of a product or of a system which fulfils a safety function for that product or system, or the failure or malfunctioning of which endangers the health and safety of persons or property;

(13) 'instructions for use' means the information provided by the provider to inform the deployer of in particular an AI system's intended purpose and proper use;

(14) 'recall of an AI system' means any measure aimed at achieving the return to the provider of an AI system made available to deployers;

(15) 'withdrawal of an AI system' means any measure aimed at preventing an AI system in the supply chain from being made available on the market;

(16) 'performance of an AI system' means the ability of an AI system to achieve its intended purpose;

(17) 'notifying authority' means the national authority responsible for setting up and carrying out the necessary procedures for the assessment, designation, notification and monitoring of conformity assessment bodies;

(18) 'conformity assessment' means the process of demonstrating whether the requirements of Chapter III, Section 2 relating to a high-risk AI system have been fulfilled;

(19) 'conformity assessment body' means a body that performs third-party conformity assessment activities, including testing, certification and inspection;

(20) 'notified body' means a conformity assessment body notified in accordance with this Regulation and other relevant Union harmonisation legislation;

(21) 'substantial modification' means a change to an AI system after its placing on the market or putting into service which is not foreseen or planned in the initial conformity assessment performed by the provider and as a result of which the compliance of the AI system with the requirements set out in Chapter III, Section 2 is affected or results in a modification to the intended purpose for which the AI system has been assessed;

(22) 'CE marking' means a marking by which a provider indicates that an AI system is in conformity with the requirements set out in Chapter III, Section 2 and other applicable Union legislation harmonising the conditions for the marketing of products providing for the affixing of that marking;

(23) 'post-market monitoring system' means all activities carried out by providers of AI systems to proactively collect and review experience gained from AI systems they have placed on the market or put into service for the purpose of identifying any need to immediately apply any necessary corrective or preventive actions;

(24) 'market surveillance authority' means a national authority carrying out the activities and taking the measures pursuant to Regulation (EU) 2019/1020;

(25) 'harmonised standard' means a harmonised standard as defined in Article 2(1), point (c), of Regulation (EU) No 1025/2012;

(26) 'common specification' means a set of technical specifications, as defined in point 4 of Article 2 of Regulation (EU) No 1025/2012, providing means to comply with certain requirements established under this Regulation;

(27) 'training data' means data used for training an AI system through fitting its learnable parameters, including the weights of a neural network;

(28) 'validation data' means data used for providing an evaluation of the trained AI system and for tuning its non-learnable parameters and its learning process in order, inter alia, to prevent underfitting or overfitting;

(29) 'testing data' means data used for providing an independent evaluation of the AI system in order to confirm the expected performance of that system before its placing on the market or putting into service;

(30) 'input data' means data provided to or directly acquired by an AI system on the basis of which the system produces an output;

(31) 'biometric data' means personal data resulting from specific technical processing relating to the physical, physiological or behavioural characteristics of a natural person, such as facial images or dactyloscopic data;

(32) 'biometric identification' means the automated recognition of physical, physiological, behavioural, or psychological human features for the purpose of establishing the identity of a natural person by comparing biometric data of that individual to biometric data of individuals stored in a reference database;

(33) 'biometric verification' means the automated, one-to-one verification of the identity of natural persons, including authentication, by comparing their biometric data to previously provided biometric data;

(34) 'special categories of personal data' means the categories of personal data referred to in Article 9(1) of Regulation (EU) 2016/679, Article 10 of Directive (EU) 2016/680 and Article 10(1) of Regulation (EU) 2018/1725;

(35) 'emotion recognition system' means an AI system for the purpose of identifying or inferring emotions or intentions of natural persons on the basis of their biometric data;

(36) 'biometric categorisation system' means an AI system for the purpose of assigning natural persons to specific categories on the basis of their biometric data unless this is ancillary to another commercial service and strictly necessary for objective technical reasons;

(37) 'remote biometric identification system' means an AI system for the purpose of identifying natural persons, without their active involvement, typically at a distance through the comparison of a person's biometric data with the biometric data contained in a reference database;

(38) 'real-time remote biometric identification system' means a remote biometric identification system whereby the capturing of biometric data, the comparison and the identification all occur without a significant delay. This comprises not only instantaneous identification, but also limited short delays in order to avoid circumvention;

(39) 'post remote biometric identification system' means a remote biometric identification system other than a real-time remote biometric identification system;

(40) 'publicly accessible space' means any physical place accessible to the public, regardless of whether certain conditions for access may apply;

(41) 'law enforcement authority' means any public authority competent for the prevention, investigation, detection or prosecution of criminal offences or the execution of criminal penalties, including the safeguarding against and the prevention of threats to public security;

(42) 'law enforcement' means activities carried out by law enforcement authorities or on their behalf for the prevention, investigation, detection or prosecution of criminal offences or the execution of criminal penalties, including the safeguarding against and prevention of threats to public security;

(43) 'national supervisory authority' means the authority or authorities designated by a Member State in accordance with Article 70 of this Regulation;

(44) 'general-purpose AI model' means an AI model, including where such an AI model is trained with a large amount of data using self-supervision at scale, that displays significant generality and is capable of competently performing a wide range of distinct tasks regardless of the way the model is placed on the market and that can be integrated into a variety of downstream systems or applications, except AI models that are used for research, development or prototyping activities before they are placed on the market;

(45) 'general-purpose AI system' means an AI system which is based on a general-purpose AI model and which has the capability to serve a variety of purposes, both for direct use as well as for integration in other AI systems;

(46) 'systemic risk' means a risk that is specific to the high-impact capabilities of general-purpose AI models, having a significant impact on the Union market due to their reach, or due to actual or reasonably foreseeable negative effects on public health, safety, public security, fundamental rights, or society as a whole, that can be propagated at scale across the value chain;

(47) 'FLOP' means a floating-point operation, used as a measure for the computing resources used to train or run an AI model;

(48) 'downstream provider' means a provider of an AI system, including a general-purpose AI system, which integrates an AI model, regardless of whether the AI model is provided by themselves and vertically integrated or provided by another entity based on contractual relations.`,
        },
        {
          id: 'art-4',
          number: '4',
          title: 'AI literacy',
          chapterId: 'ch-1',
          tags: ['ai-literacy', 'training', 'competence', 'general'],
          applicabilityDate: '2 August 2026',
          text: `Providers and deployers of AI systems shall take measures to ensure, to their best extent, a sufficient level of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf, taking into account their technical knowledge, experience, education and training and the context the AI systems are to be used in, and considering the persons or groups of persons on whom the AI systems are to be used.`,
        },
      ],
    },
    {
      id: 'ch-2',
      number: 'II',
      title: 'Prohibited AI Practices',
      articles: [
        {
          id: 'art-5',
          number: '5',
          title: 'Prohibited AI practices',
          chapterId: 'ch-2',
          tags: ['prohibited', 'manipulation', 'biometric', 'social-scoring', 'fundamental-rights', 'law-enforcement'],
          applicabilityDate: '2 February 2025',
          text: `1. The following AI practices shall be prohibited:

(a) the placing on the market, the putting into service or the use of an AI system that deploys subliminal techniques beyond a person's consciousness or purposefully manipulative or deceptive techniques, with the objective, or the effect, of materially distorting the behaviour of a person or a group of persons by appreciably impairing their ability to make an informed decision, thereby causing them to take a decision that they would not have otherwise taken in a manner that causes or is reasonably likely to cause that person, another person or group of persons significant harm;

(b) the placing on the market, the putting into service or the use of an AI system that exploits any of the vulnerabilities of a natural person or a specific group of persons due to their age, disability or a specific social or economic situation, with the objective, or the effect, of materially distorting the behaviour of that person or a person belonging to that group in a manner that causes or is reasonably likely to cause that person or another person significant harm;

(c) the placing on the market, the putting into service or the use of AI systems for the evaluation or classification of natural persons or groups of persons over a certain period of time based on their social behaviour or known, inferred or predicted personal or personality characteristics, with the social score leading to either or both of the following:
(i) detrimental or unfavourable treatment of certain natural persons or groups of persons in social contexts that are unrelated to the contexts in which the data was originally generated or collected;
(ii) detrimental or unfavourable treatment of certain natural persons or groups of persons that is unjustified or disproportionate to their social behaviour or its gravity;

(d) the placing on the market, the putting into service or the use of an AI system for making risk assessments of natural persons in order to assess or predict the risk of a natural person committing a criminal offence, based solely on the profiling of a natural person or on assessing their personality traits and characteristics; this prohibition shall not apply to AI systems used to support the human assessment of the involvement of a person in a criminal activity, which is already based on objective and verifiable facts directly linked to a criminal activity;

(e) the placing on the market, the putting into service or the use of AI systems that create or expand facial recognition databases through the untargeted scraping of facial images from the internet or CCTV footage;

(f) the placing on the market, the putting into service or the use of AI systems to infer emotions of a natural person in the areas of workplace and education institutions, except where the use of the AI system is intended for medical or safety reasons;

(g) the placing on the market, the putting into service or the use of biometric categorisation systems that categorise individually natural persons based on their biometric data to deduce or infer their race, political opinions, trade union membership, religious or philosophical beliefs, sex life or sexual orientation; this prohibition does not cover any labelling or filtering of lawfully acquired biometric datasets, such as images, based on biometric data or categorising of biometric data in the area of law enforcement;

(h) the use of real-time remote biometric identification systems in publicly accessible spaces for the purposes of law enforcement, unless and in as far as such use is strictly necessary for one of the following objectives:
(i) the targeted search for specific victims of abduction, trafficking in human beings or sexual exploitation of human beings, as well as the search for missing persons;
(ii) the prevention of a specific, substantial and imminent threat to the life or physical safety of natural persons or a genuine and present or genuine and foreseeable threat of a terrorist attack;
(iii) the identification of a person suspected of having committed a criminal offence, for the purpose of conducting a criminal investigation, prosecution or executing a criminal penalty for offences referred to in Annex II, and punishable in the Member State concerned by a custodial sentence or a detention order for a maximum period of at least four years.

2. The use of real-time remote biometric identification systems in publicly accessible spaces for the purposes of law enforcement for any of the objectives referred to in paragraph 1, point (h), shall be subject to the following conditions:
(a) the use is limited to what is strictly necessary in terms of the period of time as well as the geographic scope and the number of persons concerned;
(b) the use is subject to prior authorisation granted by a judicial authority or by an independent administrative authority of the Member State in whose territory the use is to take place, except in duly justified situations of urgency, in which case the authorisation may be requested during or after the use but without undue delay;
(c) the law enforcement authority shall submit a request for prior authorisation to a judicial authority or an independent administrative authority referred to in point (b) above specifying at least the grounds for requesting the authorisation and the expected period and geographic scope for which the use of the real-time remote biometric identification system is planned.

3. In duly justified situations of urgency, law enforcement authorities may start using a real-time remote biometric identification system in publicly accessible spaces without prior authorisation, provided that such authorisation is requested without undue delay. The competent judicial authority or the independent administrative authority shall decide on the authorisation as soon as possible.

4. Member States may decide to provide for the possibility to authorise the use of real-time remote biometric identification systems in publicly accessible spaces for the purposes of law enforcement within the limits and under the conditions listed in paragraphs 1, point (h), and 2. Member States concerned shall lay down in their national law the necessary detailed rules for the request, issuance and exercise of, as well as supervision and reporting relating to, the authorisations referred to in paragraph 2, point (b). Those rules shall also specify in respect of which of the objectives listed in paragraph 1, point (h), including which of the criminal offences referred to in point (h)(iii) thereof, the competent authorities may be authorised to use those systems for the purpose of law enforcement.`,
        },
      ],
    },
    {
      id: 'ch-3',
      number: 'III',
      title: 'High-Risk AI Systems',
      sections: [
        {
          id: 'ch3-s1',
          title: 'Section 1 — Classification of AI systems as high-risk',
          articles: [
            {
              id: 'art-6',
              number: '6',
              title: 'Classification rules for high-risk AI systems',
              chapterId: 'ch-3',
              sectionId: 'ch3-s1',
              tags: ['high-risk', 'classification', 'safety-component'],
              applicabilityDate: '2 August 2026',
              text: `1. Irrespective of whether an AI system is placed on the market or put into service independently from the products referred to in points (a) and (b), that AI system shall be considered to be high-risk where both of the following conditions are fulfilled:
(a) the AI system is intended to be used as a safety component of a product, or the AI system is itself a product, covered by the Union harmonisation legislation listed in Annex I;
(b) the product whose safety component pursuant to point (a) is the AI system, or the AI system itself as a product, is required to undergo a third-party conformity assessment with a view to the placing on the market or putting into service of that product pursuant to the Union harmonisation legislation listed in Annex I.

2. In addition to the high-risk AI systems referred to in paragraph 1, AI systems referred to in Annex III shall be considered to be high-risk.

3. By derogation from paragraph 2, an AI system referred to in Annex III shall not be considered to be high-risk where it does not pose a significant risk of harm to the health, safety or fundamental rights of natural persons, including by not materially influencing the outcome of decision making.

An AI system referred to in Annex III shall not be considered to be high-risk if it fulfils any of the following conditions:
(a) the AI system is intended to perform a narrow procedural task;
(b) the AI system is intended to improve the result of a previously completed human activity;
(c) the AI system is intended to detect decision-making patterns or deviations from prior decision-making patterns and is not meant to replace or influence the previously completed human assessment, without proper human review;
(d) the AI system is intended to perform a preparatory task to an assessment relevant for the purposes of the use cases listed in Annex III.

Notwithstanding the first and second subparagraphs, an AI system referred to in Annex III shall always be considered to be high-risk where the AI system performs profiling of natural persons.

4. A provider who considers that an AI system referred to in Annex III is not high-risk shall document its assessment before that system is placed on the market or put into service. Such provider shall be subject to the registration obligation set out in Article 49(2). Upon request of national competent authorities, the provider shall provide the documentation of the assessment.`,
            },
            {
              id: 'art-7',
              number: '7',
              title: 'Amendments to Annex III',
              chapterId: 'ch-3',
              sectionId: 'ch3-s1',
              tags: ['high-risk', 'classification', 'amendments', 'delegated-acts'],
              applicabilityDate: '2 August 2026',
              text: `1. The Commission is empowered to adopt delegated acts in accordance with Article 97 to amend the list in Annex III by adding or modifying use-cases of high-risk AI systems where both of the following conditions are fulfilled:
(a) the AI systems are intended to be used in any of the areas listed in Annex III;
(b) the AI systems pose a risk of harm to the health, safety or fundamental rights of natural persons, including the risk of not having access to justice or effective remedies.

2. When assessing the criteria listed in paragraph 1, the Commission shall take into account the following:
(a) the extent to which an AI system is used or is likely to be used;
(b) the extent to which the use of an AI system has already caused harm to the health, safety or fundamental rights of natural persons or has given rise to significant concerns in relation to the materialisation of such harm, as evidenced by reports or documented allegations submitted to national competent authorities;
(c) the extent to which potential harm or adverse impact is irreversible or difficult to mitigate;
(d) the extent to which natural persons that are subject to the use of an AI system are in a vulnerable position in relation to the provider or deployer of the AI system, in particular due to an imbalance of power, knowledge, economic or social circumstances, or age;
(e) the extent to which the outcome produced with or by the AI system is easily reviewable and correctable, taking into account the technical solutions available to do so, bearing in mind that solutions such as ex post identification of errors may not be sufficient to mitigate risk.

3. The Commission is also empowered to adopt delegated acts in accordance with Article 97 to amend the list in Annex III by removing use-cases of high-risk AI systems where both of the following conditions are fulfilled:
(a) the AI system concerned no longer poses significant risks to fundamental rights, health or safety in light of practical experience that has been gained;
(b) where an amendment would not decrease the overall level of protection of health, safety and fundamental rights under Union law.`,
            },
          ],
        },
        {
          id: 'ch3-s2',
          title: 'Section 2 — Requirements for high-risk AI systems',
          articles: [
            {
              id: 'art-8',
              number: '8',
              title: 'Compliance with the requirements',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['high-risk', 'compliance', 'requirements'],
              applicabilityDate: '2 August 2026',
              text: `1. High-risk AI systems shall comply with the requirements established in this Section, taking into account their intended purpose as well as the generally acknowledged state of the art on AI and AI-related technologies. When demonstrating compliance with these requirements, account shall be taken of the intended purpose of the AI system.

2. Where an AI system that has already been placed on the market or put into service is subject to a substantial modification, it shall be considered to be a new AI system for the purposes of this Regulation.

3. The intended purpose of an AI system shall be the use for which an AI system is intended by the provider, including the specific context and conditions of use, as specified in the information supplied by the provider in the instructions for use and in all communications to the competent authorities.`,
            },
            {
              id: 'art-9',
              number: '9',
              title: 'Risk management system',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['risk-management', 'high-risk', 'testing', 'residual-risk'],
              applicabilityDate: '2 August 2026',
              text: `1. A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.

2. The risk management system shall consist of a continuous iterative process run throughout the entire lifecycle of a high-risk AI system, requiring regular systematic review and updating. It shall comprise the following steps:
(a) the identification and analysis of the known and reasonably foreseeable risks that the high-risk AI system can pose to health, safety or fundamental rights when the high-risk AI system is used in accordance with its intended purpose;
(b) the estimation and evaluation of the risks that may emerge when the high-risk AI system is used in accordance with its intended purpose, and under conditions of reasonably foreseeable misuse;
(c) the evaluation of other risks possibly arising, based on the analysis of data gathered from the post-market monitoring system referred to in Article 72;
(d) the adoption of appropriate and targeted risk management measures designed to address the risks identified pursuant to point (a).

3. The risks referred to in this Article shall concern only those which may be reasonably mitigated or eliminated through the development or design of the high-risk AI system, or the provision of adequate technical information.

4. In implementing the risk management system, due consideration shall be given to whether the high-risk AI system is likely to be accessed by or have an impact on children or other vulnerable groups.

5. For high-risk AI systems referred to in point 1(a) of Annex III, in the context of the implementation of the risk management system, the technical robustness referred to in Article 15(1) shall include the examination of the robustness of the high-risk AI system in respect of attempts by third parties to alter its use, outputs or performance by exploiting the system vulnerabilities.

6. The risk management measures referred to in paragraph 2, point (d) shall give due consideration to the effects and possible interactions resulting from the combined application of the requirements set out in this Section 2, with a view to minimising risks more effectively while achieving an appropriate balance among the various requirements.

7. Risk management measures shall be such that the relevant residual risk associated with each hazard as well as the overall residual risk of the high-risk AI systems is judged to be acceptable.

8. When identifying the most appropriate risk management measures, the following shall be ensured:
(a) elimination or reduction of risks as far as technically possible through adequate design and development of the high-risk AI system;
(b) where appropriate, implementation of adequate mitigation and control measures in relation to risks that cannot be eliminated;
(c) provision of adequate information pursuant to Article 13 and, where appropriate, training to deployers.

9. High-risk AI systems shall be tested for the purposes of identifying the most appropriate and targeted risk management measures. Testing shall ensure that high-risk AI systems perform consistently for their intended purpose and they are in compliance with the requirements set out in this Section.

10. Testing shall be performed, as appropriate, at any point in time, and in particular prior to the placing on the market or the putting into service. Testing shall be performed against prior defined metrics and probabilistic thresholds that are appropriate to the intended purpose of the high-risk AI system.

11. When implementing the risk management system as provided for in paragraphs 1 to 7, providers shall give consideration to whether in view of its intended purpose the high-risk AI system has an adverse impact on persons under 18 years of age or other vulnerable groups.

12. For providers of high-risk AI systems that are subject to requirements regarding internal risk management processes under other relevant Union legislation, the aspects included in paragraphs 1 to 9 may be part of, or combined with, the risk management procedures established pursuant to that legislation.`,
            },
            {
              id: 'art-10',
              number: '10',
              title: 'Data and data governance',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['data', 'data-governance', 'training-data', 'high-risk', 'bias'],
              applicabilityDate: '2 August 2026',
              text: `1. High-risk AI systems which make use of techniques involving the training of AI models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria referred to in paragraphs 2 to 5 whenever such datasets are used.

2. Training, validation and testing data sets shall be subject to appropriate data governance and management practices. Those practices shall concern in particular:
(a) the relevant design choices;
(b) data collection processes and the origin of data, and in the case of personal data, the original purpose of the data collection;
(c) relevant data preparation processing operations, such as annotation, labelling, cleaning, updating, enrichment and aggregation;
(d) the formulation of relevant assumptions, notably with respect to the information that the data are supposed to measure and represent;
(e) an assessment of the availability, quantity and suitability of the data sets that are needed;
(f) examination in view of possible biases that are likely to affect health or safety of persons, result in discrimination prohibited by Union law, in particular with respect to the characteristics referred to in Article 21 of the Charter of Fundamental Rights of the European Union;
(g) appropriate measures to detect, prevent and mitigate possible biases;
(h) the identification of any possible data gaps or shortcomings, and how those gaps and shortcomings can be addressed.

3. Training, validation and testing data sets shall be relevant, sufficiently representative, and to the best extent possible, free of errors and complete in view of the intended purpose. They shall have the appropriate statistical properties, including, where applicable, as regards the persons or groups of persons in relation to whom the high-risk AI system is intended to be used. These characteristics of the data sets may be met at the level of individual data sets or a combination thereof.

4. Training, validation and testing data sets shall take into account, to the extent required by the intended purpose, the characteristics or elements that are particular to the specific geographical, contextual, behavioural or functional setting within which the high-risk AI system is intended to be used.

5. To the extent that it is strictly necessary for the purposes of ensuring bias detection and correction in relation to the high-risk AI systems in accordance with paragraph 2, points (f) and (g) of this Article, the providers of such systems may exceptionally process special categories of personal data referred to in Article 9(1) of Regulation (EU) 2016/679, Article 10 of Directive (EU) 2016/680 and Article 10(1) of Regulation (EU) 2018/1725, subject to appropriate safeguards for the fundamental rights and freedoms of natural persons, including technical limitations on the re-use and use of state-of-the-art security and privacy-preserving measures, such as pseudonymisation, or encryption where anonymisation may significantly affect the purpose pursued.

6. For the development of high-risk AI systems not using techniques involving the training of AI models, paragraphs 2 to 5 shall apply only to the testing data sets.`,
            },
            {
              id: 'art-11',
              number: '11',
              title: 'Technical documentation',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['technical-documentation', 'high-risk', 'documentation'],
              applicabilityDate: '2 August 2026',
              text: `1. The technical documentation of a high-risk AI system shall be drawn up before that system is placed on the market or put into service and shall be kept up-to date.

The technical documentation shall be drawn up in such a way as to demonstrate that the high-risk AI system complies with the requirements set out in this Section and shall provide national competent authorities and notified bodies with all the necessary information to assess the compliance of the AI system with those requirements. It shall contain, at a minimum, the elements set out in Annex IV.

2. Where a high-risk AI system related to a product covered by the Union harmonisation legislation listed in Section A of Annex I is placed on the market or put into service, a single set of technical documentation shall be drawn up containing all the information set out in paragraph 1 as well as the information required under those legal acts.

3. The Commission is empowered to adopt delegated acts in accordance with Article 97 to amend Annex IV where necessary to ensure that, in light of technical progress, the technical documentation provides all the necessary information to assess the compliance of the system with the requirements set out in this Section.`,
            },
            {
              id: 'art-12',
              number: '12',
              title: 'Record-keeping',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['record-keeping', 'logs', 'high-risk', 'documentation', 'traceability'],
              applicabilityDate: '2 August 2026',
              text: `1. High-risk AI systems shall technically allow for the automatic recording of events ('logs') over the lifetime of the system.

2. In order to ensure a level of traceability of the AI system's functioning that is appropriate to the intended purpose of the system, the logging capabilities shall enable the recording of events relevant for:
(a) identifying situations that may result in the high-risk AI system presenting a risk within the meaning of Article 79(1);
(b) facilitating the post-market monitoring as referred to in Article 72;
(c) monitoring the operation of high-risk AI systems referred to in Article 26(5).

3. For high-risk AI systems referred to in point 1(a) of Annex III, the logging capabilities shall provide, at a minimum:
(a) recording of the period of each use of the system (start date and time and end date and time of each use);
(b) the reference database against which the input data has been checked by the system;
(c) the input data for which the search has led to a match;
(d) the identification of the natural persons involved in the verification of the results, as referred to in Article 14(5).`,
            },
            {
              id: 'art-13',
              number: '13',
              title: 'Transparency and provision of information to deployers',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['transparency', 'deployer', 'instructions', 'high-risk'],
              applicabilityDate: '2 August 2026',
              text: `1. High-risk AI systems shall be designed and developed in such a way as to ensure that their operation is sufficiently transparent to enable deployers to interpret the system's output and use it appropriately. An appropriate type and degree of transparency shall be ensured with a view to achieving compliance with the relevant obligations of the provider and deployer set out in Section 3 of this Chapter.

2. High-risk AI systems shall be accompanied by instructions for use in an appropriate digital format or otherwise, which include concise, complete, correct and clear information that is relevant, accessible and comprehensible to deployers. The information referred to in paragraph 3 shall be provided in the language(s) determined by the Member State(s) in which the high-risk AI system is to be placed on the market.

3. The instructions for use shall contain at least the following information:
(a) the identity and the contact details of the provider and, where applicable, of its authorised representative;
(b) the characteristics, capabilities and limitations of performance of the high-risk AI system, including:
(i) its intended purpose;
(ii) the level of accuracy, including its metrics, robustness and cybersecurity referred to in Article 15 against which the high-risk AI system has been tested and validated and which can be expected, and any known and foreseeable circumstances that may have an impact on that expected level of accuracy, robustness and cybersecurity;
(iii) any known or foreseeable circumstance, related to the use of the high-risk AI system in accordance with its intended purpose or under conditions of reasonably foreseeable misuse, which may lead to risks to the health and safety or fundamental rights referred to in Article 9(2);
(iv) where applicable, the technical capabilities and characteristics of the high-risk AI system to provide information that is relevant to its explainability;
(v) where applicable, its performance regarding specific persons or groups of persons on whom the system is intended to be used;
(vi) where applicable, specifications for the input data, or any other relevant information in terms of the training, validation and testing data sets used, taking into account the intended purpose of the high-risk AI system;
(vii) where applicable, information to enable deployers to interpret the output of the AI system and use it appropriately;
(c) the changes to the high-risk AI system and its performance which have been pre-determined by the provider at the moment of the initial conformity assessment, if any;
(d) the human oversight measures referred to in Article 14, including the technical measures put in place to facilitate the interpretation of the outputs of AI systems by the deployers;
(e) the computational and hardware resources needed, the expected lifetime of the high-risk AI system and any necessary maintenance and care measures, including their frequency, to ensure the proper functioning of that AI system, including as regards software updates;
(f) where relevant, a description of the mechanisms included within the high-risk AI system that allows deployers to properly collect, store and interpret the logs in accordance with Article 12.`,
            },
            {
              id: 'art-14',
              number: '14',
              title: 'Human oversight',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['human-oversight', 'high-risk', 'monitoring', 'control'],
              applicabilityDate: '2 August 2026',
              text: `1. High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which the AI system is in use.

2. Human oversight shall aim at preventing or minimising the risks to health, safety or fundamental rights that may emerge when a high-risk AI system is used in accordance with its intended purpose or under conditions of reasonably foreseeable misuse, in particular where such risks persist despite the application of other requirements set out in this Section.

3. The oversight measures shall be commensurate with the risks, level of autonomy and context of use of the high-risk AI system, and shall be ensured through either one or both of the following types of built-in operational measures:
(a) measures identified and built into the high-risk AI system by the provider before placing it on the market or putting it into service;
(b) measures that the deployer can implement.

4. For the purposes of implementing paragraphs 1 to 3, the high-risk AI system shall be provided to the deployer with:
(a) appropriate measures enabling the natural persons to whom human oversight is assigned to understand the capabilities and limitations of the high-risk AI system and be able to duly monitor its operation, so that signs of anomalies, dysfunctions and unexpected performance can be detected and addressed as soon as possible;
(b) appropriate measures enabling the natural persons to whom human oversight is assigned to remain aware of the possible tendency of automatically relying or over-relying on the output produced by a high-risk AI system ('automation bias'), in particular for high-risk AI systems used to provide information or recommendations for decisions to be taken by natural persons;
(c) appropriate measures enabling the natural persons to whom human oversight is assigned to be able to correctly interpret the high-risk AI system's output, taking into account, for example, the interpretation tools and methods available;
(d) appropriate measures enabling the natural persons to whom human oversight is assigned to decide, in any particular situation, not to use the high-risk AI system or otherwise disregard, override or reverse the output of the high-risk AI system;
(e) appropriate measures enabling the natural persons to whom human oversight is assigned to intervene on the operation of the high-risk AI system or interrupt the system through a 'stop' button or a similar procedure that allows the system to come to a halt in a safe state.

5. For high-risk AI systems referred to in point 1(a) of Annex III, the measures referred to in paragraph 4 shall be such as to ensure that, in addition, no action or decision is taken by the deployer on the basis of the identification resulting from the system unless that identification has been separately verified and confirmed by at least two natural persons with the necessary competence, training and authority.`,
            },
            {
              id: 'art-15',
              number: '15',
              title: 'Accuracy, robustness and cybersecurity',
              chapterId: 'ch-3',
              sectionId: 'ch3-s2',
              tags: ['accuracy', 'robustness', 'cybersecurity', 'high-risk', 'technical'],
              applicabilityDate: '2 August 2026',
              text: `1. High-risk AI systems shall be designed and developed in such a way that they achieve an appropriate level of accuracy, robustness, and cybersecurity, and perform consistently in those respects throughout their lifecycle.

2. The levels of accuracy and the relevant accuracy metrics of high-risk AI systems shall be declared in the accompanying instructions of use.

3. High-risk AI systems shall be resilient as regards errors, faults or inconsistencies that may occur within the system or the environment in which the system operates, in particular due to their interaction with natural persons or other systems. Technical robustness measures shall include:
(a) redundancy and failsafe plans;
(b) back-up solutions;
(c) replication of components.

4. High-risk AI systems shall be resilient as regards attempts by third parties to alter their use, outputs or performance by exploiting the system vulnerabilities. The technical measures aimed at ensuring the cybersecurity of high-risk AI systems shall be appropriate to the relevant circumstances and the risks. The technical measures to address AI-specific vulnerabilities shall include, as appropriate, measures to prevent and control for attacks trying to manipulate the training dataset ('data poisoning attacks'), or pre-trained components used in training ('model poisoning'), attacks trying to exploit model vulnerabilities to make AI systems produce incorrect outputs ('adversarial attacks' or 'model evasion attacks'), attacks trying to make AI systems reveal confidential training data or proprietary model information ('model extraction attacks'), as well as attacks exploiting software or hardware vulnerabilities in the AI system.

5. Where a high-risk AI system continues to learn after being placed on the market or put into service, those measures shall also aim to ensure that the operation of the AI system continues to remain compliant with the requirements of this Section even after changes in the system's or environment's behaviour.`,
            },
          ],
        },
        {
          id: 'ch3-s3',
          title: 'Section 3 — Obligations of providers and deployers of high-risk AI systems',
          articles: [
            {
              id: 'art-16',
              number: '16',
              title: 'Obligations of providers of high-risk AI systems',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['provider', 'obligations', 'high-risk', 'compliance'],
              applicabilityDate: '2 August 2026',
              text: `Providers of high-risk AI systems shall:
(a) ensure that their high-risk AI systems are compliant with the requirements set out in Section 2 of this Chapter;
(b) have a quality management system in place pursuant to Article 17;
(c) draw up the technical documentation of the high-risk AI system pursuant to Article 11 and Annex IV;
(d) where applicable, follow and comply with the registration obligations referred to in Article 49(1);
(e) take the necessary corrective actions and provide information as required pursuant to Article 20;
(f) affix the CE marking to their high-risk AI systems to indicate the conformity with this Regulation in accordance with Article 48;
(g) upon request of a national competent authority, demonstrate the conformity of the high-risk AI system with the requirements set out in Section 2 of this Chapter;
(h) ensure that the AI system undergoes the relevant conformity assessment procedure referred to in Article 43, prior to its placing on the market or putting into service;
(i) draw up an EU declaration of conformity in accordance with Article 47;
(j) keep the technical documentation, the EU declaration of conformity, the relevant documentation on the quality management system and the documentation on the changes to systems approved by a notified body for a period of ten years after the high-risk AI system has been placed on the market or put into service;
(k) ensure that, where applicable, the notified body referred to in Article 43 has access to the technical documentation and the other relevant documentation;
(l) comply with the post-market monitoring obligations in accordance with Article 72;
(m) register high-risk AI systems in the EU database referred to in Article 71.`,
            },
            {
              id: 'art-17',
              number: '17',
              title: 'Quality management system',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['quality-management', 'provider', 'high-risk', 'governance'],
              applicabilityDate: '2 August 2026',
              text: `1. Providers of high-risk AI systems shall put a quality management system in place that ensures compliance with this Regulation. That system shall be documented in a systematic and orderly manner in the form of written policies, procedures and instructions, and shall cover at least the following aspects:
(a) a strategy for regulatory compliance, including compliance with conformity assessment procedures and procedures for the management of modifications to the high-risk AI system;
(b) techniques, procedures and systematic actions to be used for the design, design control and design verification of the high-risk AI system;
(c) techniques, procedures and systematic actions to be used for the development, quality control and quality assurance of the high-risk AI system;
(d) examination, test and validation procedures to be carried out before, during and after the development of the high-risk AI system, and the frequency with which they have to be carried out;
(e) technical specifications, including standards, to be applied and, where the relevant harmonised standards are not applied in full, the means to be used to ensure that the high-risk AI system complies with the requirements set out in Section 2;
(f) systems and procedures for data management, including data collection, data analysis, data labelling, data storage, data filtration, data mining, data aggregation, data retention and any other operation regarding the data that is performed before and for the purposes of the placing on the market or the putting into service of high-risk AI systems;
(g) the risk management system referred to in Article 9;
(h) the setting-up, implementation and maintenance of a post-market monitoring system, in accordance with Article 72;
(i) procedures related to the reporting of serious incidents in accordance with Article 73 and the malfunctioning of high-risk AI systems in compliance with the applicable legislation listed in Annex I;
(j) the handling of communication with national competent authorities, other national authorities, including those supervising or enforcing Union data protection legislation, notified bodies, other operators, customers or other interested parties;
(k) systems and procedures for record keeping of all relevant documentation and information;
(l) resource management, including security of supply related measures;
(m) an accountability framework setting out the responsibilities of the management and other staff with regard to all aspects listed in this paragraph.

2. The implementation of aspects referred to in paragraph 1 shall be proportionate to the size of the provider's organisation. Providers shall, in any event, respect the degree of rigour and the level of protection required to ensure the compliance of their high-risk AI systems with this Regulation.

3. For providers of high-risk AI systems that are subject to obligations regarding quality management systems or equivalent functions under relevant sectoral Union law, the aspects listed in paragraph 1 which are covered by the sectoral Union law may be taken into account. Where the sectoral legislation prevents the provider from being fully compliant with aspects listed in paragraph 1, those aspects may be omitted from the quality management system to the extent so required under sectoral law.`,
            },
            {
              id: 'art-18',
              number: '18',
              title: 'Documentation keeping',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['documentation', 'record-keeping', 'provider', 'high-risk'],
              applicabilityDate: '2 August 2026',
              text: `1. Providers of high-risk AI systems shall keep the technical documentation referred to in Article 11 and, where applicable, the documentation on the quality management system referred to in Article 17.

2. While placing on the market or the putting into service of a high-risk AI system, and for a period of 10 years after the high-risk AI system has been placed on the market or put into service, the provider shall keep at the disposal of the national competent authorities:
(a) the technical documentation referred to in Article 11;
(b) the documentation concerning the quality management system referred to in Article 17;
(c) the documentation concerning the changes approved by notified bodies, where applicable;
(d) the decisions and other documents issued by the notified bodies, where applicable;
(e) the EU declaration of conformity referred to in Article 47.

3. Each Member State shall determine the conditions under which the documentation referred to in paragraph 2 may remain available to national competent authorities after the end of the period referred to in that paragraph.`,
            },
            {
              id: 'art-19',
              number: '19',
              title: 'Automatically generated logs',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['logs', 'record-keeping', 'deployer', 'provider', 'high-risk'],
              applicabilityDate: '2 August 2026',
              text: `1. Providers and deployers of high-risk AI systems shall retain the logs automatically generated by that high-risk AI system to the extent such logs are under their control.

2. Without prejudice to applicable Union or national law, the logs referred to in paragraph 1 shall be retained for a period that is appropriate in the light of the intended purpose of the high-risk AI system and applicable legal obligations under Union or national law.

In particular, where the high-risk AI system is used by a law enforcement authority, border management or judicial authority for the purposes listed in points 1, 6 and 8 of Annex III respectively, such logs shall be retained for a minimum period of one year.`,
            },
            {
              id: 'art-20',
              number: '20',
              title: 'Corrective actions and duty of information',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['corrective-actions', 'provider', 'high-risk', 'market-surveillance'],
              applicabilityDate: '2 August 2026',
              text: `1. Providers of high-risk AI systems which consider or have reason to consider that a high-risk AI system which they have placed on the market or put into service is not in conformity with this Regulation shall immediately take the necessary corrective actions to bring that system into conformity, to withdraw it or to recall it, as appropriate. They shall inform the distributors of the high-risk AI system concerned and, where applicable, the authorised representative, the importers, and the deployers accordingly.

2. Where the high-risk AI system presents a risk within the meaning of Article 79(1) and the provider becomes aware of that risk, that provider shall immediately investigate the causes, in collaboration with the reporting deployer where applicable, and inform the market surveillance authorities competent for the high-risk AI system concerned and, where applicable, the notified body that issued a certificate for that high-risk AI system in accordance with Article 44, in particular, of the nature of the non-compliance and of any relevant corrective action taken.`,
            },
            {
              id: 'art-21',
              number: '21',
              title: 'Cooperation with competent authorities',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['cooperation', 'authorities', 'provider', 'high-risk', 'enforcement'],
              applicabilityDate: '2 August 2026',
              text: `Providers of high-risk AI systems shall, upon request by a national competent authority, provide that authority with all the information and documentation necessary to demonstrate the conformity of the high-risk AI system with the requirements set out in Section 2 of this Chapter, in a language which can be easily understood by the authority. Upon a reasoned request from a national competent authority, providers shall also give that authority access to the automatically generated logs of the high-risk AI system referred to in Article 12(1), where such logs are under their control. Member States' competent authorities shall take measures to preserve the confidentiality of the information and data obtained in accordance with Article 78.`,
            },
            {
              id: 'art-22',
              number: '22',
              title: 'Authorised representatives of providers of high-risk AI systems',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['authorised-representative', 'provider', 'high-risk', 'third-country'],
              applicabilityDate: '2 August 2026',
              text: `1. Prior to making their high-risk AI systems available on the Union market, providers established in third countries shall, by written mandate, appoint an authorised representative which is established in the Union.

2. The provider shall enable its authorised representative to perform the tasks specified in the mandate received from the provider.

3. The authorised representative shall perform the tasks specified in the mandate received from the provider. It shall provide a copy of the mandate to the market surveillance authority upon request, in one of the official languages of the Union, as determined by the Member State concerned. For the purposes of this Regulation, the mandate shall empower the authorised representative to carry out the following tasks:
(a) verify that the EU declaration of conformity referred to in Article 47 and the technical documentation referred to in Article 11 have been drawn up and that an appropriate conformity assessment procedure has been carried out by the provider;
(b) keep at the disposal of national competent authorities a copy of the EU declaration of conformity referred to in Article 47, the technical documentation and, if applicable, the certificate issued by the notified body;
(c) comply with the registration obligations referred to in Article 49;
(d) upon a reasoned request from a national competent authority, provide that authority with all the information and documentation necessary to demonstrate the conformity of a high-risk AI system with the requirements set out in Section 2, including access to the logs referred to in Article 12(1), to the extent that they are under the control of the provider, and, where applicable, to the provider's quality management system documentation referred to in Article 17;
(e) cooperate with national competent authorities, upon a reasoned request, on any action the latter takes in relation to the high-risk AI system, including when the AI system is recalled.

4. The mandate shall empower the authorised representative to be addressed, in addition to or instead of the provider, by the national competent authorities, on all issues related to ensuring compliance with this Regulation.`,
            },
            {
              id: 'art-23',
              number: '23',
              title: 'Obligations of importers',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['importer', 'obligations', 'high-risk', 'compliance'],
              applicabilityDate: '2 August 2026',
              text: `1. Before placing a high-risk AI system on the market, importers of such systems shall ensure that:
(a) the appropriate conformity assessment procedure referred to in Article 43 has been carried out by the provider of that AI system;
(b) the provider has drawn up the technical documentation in accordance with Article 11 and Annex IV;
(c) the system bears the required CE marking and is accompanied by the EU declaration of conformity referred to in Article 47 and instructions for use.

2. Where an importer considers or has reason to consider that a high-risk AI system is not in conformity with this Regulation, that importer shall not place that system on the market until that AI system has been brought into conformity. Where the high-risk AI system presents a risk within the meaning of Article 79(1), the importer shall inform the provider of the AI system and the market surveillance authorities to that effect.

3. Importers shall indicate their name, registered trade name or registered trade mark, and the address at which they can be contacted on the high-risk AI system or, where that is not possible, on its packaging or its accompanying documentation, as applicable.

4. Importers shall ensure that, while a high-risk AI system is under their responsibility, storage or transport conditions do not jeopardise its compliance with the requirements set out in Section 2.

5. Importers shall keep, for a period of 10 years after the high-risk AI system has been placed on the market or put into service, a copy of the certificate issued by the notified body, where applicable, of the instructions for use and of the EU declaration of conformity referred to in Article 47.

6. Importers shall provide national competent authorities with all necessary information and documentation, including that referred to in paragraph 5, to demonstrate the conformity of a high-risk AI system with the requirements set out in Section 2 in a language which can be easily understood by those authorities.`,
            },
            {
              id: 'art-24',
              number: '24',
              title: 'Obligations of distributors',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['distributor', 'obligations', 'high-risk', 'supply-chain'],
              applicabilityDate: '2 August 2026',
              text: `1. Before making a high-risk AI system available on the market, distributors shall verify that the high-risk AI system bears the required CE marking, that it is accompanied by the EU declaration of conformity referred to in Article 47 and by instructions for use, and that the provider and the importer of that system, as applicable, have complied with the obligations set out in Articles 16(d) and 23(3) respectively.

2. Where a distributor considers or has reason to consider that a high-risk AI system is not in conformity with the requirements set out in Section 2, that distributor shall not make the high-risk AI system available on the market until that system has been brought into conformity with those requirements. Furthermore, where the system presents a risk within the meaning of Article 79(1), the distributor shall inform the provider or the importer of the system, as applicable, to that effect.

3. Distributors shall ensure that, while a high-risk AI system is under their responsibility, storage or transport conditions do not jeopardise the compliance of the system with the requirements set out in Section 2.

4. A distributor that considers or has reason to consider that a high-risk AI system which it has made available on the market is not in conformity with the requirements set out in Section 2 shall take the corrective actions necessary to bring that system into conformity with those requirements, to withdraw it or recall it, if appropriate. Furthermore, where the system presents a risk within the meaning of Article 79(1), the distributor shall immediately inform the national competent authorities of the Member States in which it has made the product available to that effect, giving details, in particular, of the non-compliance and of any corrective action taken.`,
            },
            {
              id: 'art-25',
              number: '25',
              title: 'Responsibilities along the AI value chain',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['value-chain', 'provider', 'deployer', 'obligations', 'third-party'],
              applicabilityDate: '2 August 2026',
              text: `1. Any distributor, importer, deployer or other third-party shall be considered to be a provider for the purposes of this Regulation and shall be subject to the obligations of the provider under Article 16, in any of the following circumstances:
(a) they place on the market or put into service a high-risk AI system under their name or trademark;
(b) they modify the intended purpose of a high-risk AI system already placed on the market or already put into service;
(c) they make a substantial modification to a high-risk AI system that has already been placed on the market or already been put into service.

2. Where the circumstances referred to in paragraph 1 occur, the provider that initially placed the AI system on the market or put it into service shall no longer be considered to be a provider for the purposes of this Regulation for that specific system.

3. A distributor, importer, deployer or other third-party shall be subject to the obligations of the provider under Article 16 where they modify the intended purpose or make a substantial modification to a high-risk AI system.

4. Providers and third parties referred to in paragraphs 1 and 2 shall enter into written agreements to share the relevant information and access to documentation and the technical means of cooperation.

5. Where the agreement referred to in paragraph 4 concerns high-risk AI systems that are placed on the market or put into service by micro or small enterprises, the obligations shall be limited to the sharing of information and access to documentation.`,
            },
            {
              id: 'art-26',
              number: '26',
              title: 'Obligations of deployers of high-risk AI systems',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['deployer', 'obligations', 'high-risk', 'human-oversight', 'fundamental-rights'],
              applicabilityDate: '2 August 2026',
              text: `1. Deployers of high-risk AI systems shall take appropriate technical and organisational measures to ensure they use such systems in accordance with the instructions for use accompanying the systems, pursuant to paragraphs 3 and 6.

2. Deployers shall assign the task of human oversight referred to in Articles 14 and 26(1) to natural persons who have the necessary competence, training and authority, as well as the necessary support.

3. The obligations set out in paragraphs 1 and 2 are without prejudice to other deployer obligations under Union or national law and to the deployer's discretion in organising its own resources and activities for the purpose of implementing the human oversight measures indicated by the provider.

4. Without prejudice to paragraph 1, to the extent the deployer exercises control over the input data, that deployer shall ensure that input data is relevant in view of the intended purpose of the high-risk AI system.

5. Deployers shall monitor the operation of the high-risk AI system on the basis of the instructions for use and, where relevant, inform providers pursuant to Article 72(5). Where deployers have reason to consider that the use of the high-risk AI system in accordance with its intended purpose may present a risk within the meaning of Article 79(1), they shall, without undue delay, inform the provider or distributor and the relevant market surveillance authorities, and shall suspend the use of that system. Where deployers have identified a serious incident, they shall also immediately inform first the provider, and then the importer or distributor and the relevant market surveillance authorities.

6. Deployers of high-risk AI systems listed in Annex III shall inform natural persons when they are subject to the use of a high-risk AI system. This obligation shall not apply to AI systems used for the purposes referred to in Article 5(1), point (h).

7. Deployers shall cooperate with national competent authorities in any action those authorities take in relation to the high-risk AI system, including when national competent authorities request access to logs retained pursuant to Article 19.

8. Deployers of high-risk AI systems that are public bodies, or private entities providing public services, and deployers of high-risk AI systems referred to in points 2 and 3(b) of Annex III, shall carry out a fundamental rights impact assessment prior to putting high-risk AI systems into service for those use-cases.

9. For the purpose of the assessment referred to in paragraph 8, the deployers shall consult the provider and, where relevant, request technical assistance.`,
            },
            {
              id: 'art-27',
              number: '27',
              title: 'Fundamental rights impact assessment for high-risk AI systems',
              chapterId: 'ch-3',
              sectionId: 'ch3-s3',
              tags: ['fundamental-rights', 'impact-assessment', 'deployer', 'high-risk'],
              applicabilityDate: '2 August 2026',
              text: `1. Prior to deploying a high-risk AI system referred to in Article 26(8), deployers shall perform a fundamental rights impact assessment. That assessment shall concern the rights enshrined in the Charter of Fundamental Rights of the European Union.

2. The fundamental rights impact assessment shall cover the following:
(a) a description of the deployer's processes in which the high-risk AI system will be used in line with its intended purpose;
(b) a description of the period of time and frequency during which the high-risk AI system is intended to be used;
(c) the categories of natural persons and groups likely to be affected in the specific context of use;
(d) the specific risks of harm likely to have an impact on the categories of persons or groups of persons identified pursuant to point (c), taking into account the information given by the provider pursuant to Article 13;
(e) a description of the implementation of human oversight measures, according to the instructions for use;
(f) the measures to be taken in the case of the materialisation of those risks, including the arrangements for internal governance and complaint mechanisms.

3. Deployers shall register the fundamental rights impact assessment in the EU database referred to in Article 71(1).

4. The obligation set out in paragraph 1 shall apply to first use of the high-risk AI system in the context of the intended purpose. Where deployers have reason to expect that those circumstances are no longer representative, the deployer shall update the fundamental rights impact assessment accordingly.

5. For deployers that are required to carry out a data protection impact assessment pursuant to Article 35 of Regulation (EU) 2016/679 or Article 27 of Directive (EU) 2016/680, the fundamental rights impact assessment referred to in this Article may be performed together with such data protection impact assessment.`,
            },
          ],
        },
        {
          id: 'ch3-s4',
          title: 'Section 4 — Notifying authorities and notified bodies',
          articles: [
            {
              id: 'art-28',
              number: '28',
              title: 'Notifying authorities',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notifying-authority', 'governance', 'notified-body', 'conformity'],
              applicabilityDate: '2 August 2026',
              text: `1. Each Member State shall designate or establish a notifying authority responsible for setting up and carrying out the necessary procedures for the assessment, notification and monitoring of conformity assessment bodies, including bodies referred to in Article 44.

2. Member States may designate a national accreditation body within the meaning of Regulation (EC) No 765/2008 as a notifying authority.

3. Notifying authorities shall be established, organised and operated in such a way that no conflict of interest arises with conformity assessment bodies, and that the objectivity and impartiality of their activities are safeguarded.

4. Notifying authorities shall be organised in such a way that decisions relating to the notification of conformity assessment bodies are taken by competent persons different from those who carried out the assessment of those bodies.

5. Notifying authorities shall not offer or provide any activities that conformity assessment bodies perform, or consultancy services on a commercial or competitive basis.

6. Notifying authorities shall safeguard the confidentiality of the information they obtain.

7. Notifying authorities shall have an adequate number of competent personnel at their disposal for the proper performance of their tasks.`,
            },
            {
              id: 'art-29',
              number: '29',
              title: 'Application of a conformity assessment body for notification',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'conformity-assessment', 'application', 'accreditation'],
              applicabilityDate: '2 August 2026',
              text: `1. Conformity assessment bodies shall submit an application for notification to the notifying authority of the Member State in which they are established.

2. The application for notification shall be accompanied by a description of the conformity assessment activities, the conformity assessment module or modules and the types of AI systems for which the conformity assessment body claims to be competent, as well as by an accreditation certificate, where one exists, issued by a national accreditation body attesting that the conformity assessment body fulfils the requirements laid down in Article 31.

3. Where the conformity assessment body concerned cannot provide an accreditation certificate, it shall provide the notifying authority with all the documentary evidence necessary for the verification, recognition and regular monitoring of its compliance with the requirements laid down in Article 31.

4. For conformity assessment bodies that are designated under any acts of Union harmonisation legislation listed in Section A of Annex I, all documents and certificates linked to those designations may be used to support their application for notification under this Regulation as appropriate.

5. Any third-party conformity assessment body applying to become a notified body shall comply with the requirements laid down in Article 31 and in the applicable implementing acts.`,
            },
            {
              id: 'art-30',
              number: '30',
              title: 'Notification procedure',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notification', 'notified-body', 'procedure', 'NANDO'],
              applicabilityDate: '2 August 2026',
              text: `1. Notifying authorities may notify only conformity assessment bodies which have satisfied the requirements laid down in Article 31.

2. They shall notify the Commission and the other Member States using the electronic notification tool developed and managed by the Commission (NANDO).

3. The notification shall include full details of the conformity assessment activities, the conformity assessment module or modules, the types of AI systems concerned, and the relevant attestation of competence.

4. The conformity assessment body concerned may perform the activities of a notified body only where no objections are raised by the Commission or the other Member States within two weeks of a notification.

5. Only such a conformity assessment body shall be considered a notified body for the purposes of this Regulation.

6. The notifying authority shall notify the Commission and the other Member States of any subsequent relevant changes to the notification.`,
            },
            {
              id: 'art-31',
              number: '31',
              title: 'Requirements relating to notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'requirements', 'competence', 'independence'],
              applicabilityDate: '2 August 2026',
              text: `1. A notified body shall be established under national law and have legal personality.

2. Notified bodies shall satisfy the organisational, quality management, resource and process requirements that are necessary to fulfil their tasks and to ensure the quality of their conformity assessment activities.

3. The organisational structure, allocation of responsibilities, reporting lines and operation of notified bodies shall be such as to ensure that there is confidence in the performance and in the results of the conformity assessment activities that the notified bodies conduct.

4. Notified bodies shall be independent of the provider of a high-risk AI system in relation to which they perform conformity assessment activities. Notified bodies shall also be independent of any other operator having an economic interest in the high-risk AI system assessed, as well as of any competitors of the provider.

5. Notified bodies shall be organised and operated so as to safeguard the independence, objectivity and impartiality of their activities. Notified bodies shall document and implement a structure and procedures for safeguarding impartiality and for promoting and applying the principles of impartiality throughout their organisation, personnel and assessment activities.

6. Notified bodies shall have documented procedures in place ensuring that their personnel, committees, subsidiaries, subcontractors and any associated body or personnel of external bodies respect the confidentiality of the information which comes into their possession during the performance of conformity assessment activities.

7. Notified bodies shall have the appropriate financial stability to perform their conformity assessment activities and to contribute to costs arising from their participation in coordination activities.

8. Notified bodies shall be capable of carrying out all the tasks assigned to them under this Regulation with the highest degree of professional integrity and the requisite competence in the specific field.`,
            },
            {
              id: 'art-32',
              number: '32',
              title: 'Subsidiaries of and subcontracting by notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'subcontracting', 'subsidiaries'],
              applicabilityDate: '2 August 2026',
              text: `1. Where a notified body subcontracts specific tasks connected with the conformity assessment or has recourse to a subsidiary, it shall ensure that the subcontractor or the subsidiary meets the requirements laid down in Article 31 and shall inform the notifying authority accordingly.

2. Notified bodies shall take full responsibility for the tasks performed by subcontractors or subsidiaries wherever these are established.

3. Activities may be subcontracted or carried out by a subsidiary only with the agreement of the client.

4. Notified bodies shall keep at the disposal of the notifying authority the relevant documents concerning the assessment of the qualifications of the subcontractor or the subsidiary and the tasks carried out by them under this Regulation.`,
            },
            {
              id: 'art-33',
              number: '33',
              title: 'Operational obligations of notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'operations', 'conformity-assessment', 'obligations'],
              applicabilityDate: '2 August 2026',
              text: `1. Notified bodies shall carry out conformity assessments in accordance with the conformity assessment procedures provided for in Article 43.

2. Conformity assessments shall be performed in a proportionate manner, avoiding unnecessary burdens for providers. Conformity assessment bodies shall perform their activities taking due account of the size of the undertaking, the sector in which it operates, its structure, and the degree of complexity of the AI system concerned.

3. Notified bodies shall respect the confidentiality of the information obtained in the course of their conformity assessment activities in accordance with Article 78.

4. Notified bodies shall participate in coordination activities as referred to in Article 38. They shall also take part directly or be represented in European standardisation bodies, or ensure that they are aware and up to date in respect of relevant standards.

5. Notified bodies shall provide the notifying authority with relevant information, including information on technical changes in the state of the art and related matters.`,
            },
            {
              id: 'art-34',
              number: '34',
              title: 'Identification numbers and lists of notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'identification', 'register', 'Commission'],
              applicabilityDate: '2 August 2026',
              text: `1. The Commission shall assign an identification number to notified bodies. It shall assign a single number even where a body is notified under several Union acts.

2. The Commission shall make publicly available the list of the bodies notified under this Regulation, including the identification numbers that have been assigned to them and the activities for which they have been notified. The Commission shall ensure that this list is kept up to date.`,
            },
            {
              id: 'art-35',
              number: '35',
              title: 'Changes to notifications',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'notification', 'changes', 'suspension'],
              applicabilityDate: '2 August 2026',
              text: `1. Where a notifying authority has reason to consider that a notified body no longer meets the requirements laid down in Article 31, or that it is failing to fulfil its obligations, the notifying authority shall, without delay, investigate the matter with the utmost diligence. In that context, it shall inform the notified body concerned about the objections raised and give it the possibility to make its views known. If the notifying authority comes to the conclusion that the notified body no longer meets the requirements laid down in Article 31 or that it is failing to fulfil its obligations, it shall restrict, suspend or withdraw the notification as appropriate, depending on the seriousness of the failure to meet those requirements or fulfil those obligations. It shall immediately inform the Commission and the other Member States accordingly.

2. In the event of restriction, suspension or withdrawal of notification, or where the notified body has ceased its activity, the notifying authority shall take appropriate steps to ensure that the files of that notified body are either taken over by another notified body or kept available for the responsible notifying and market surveillance authorities at their request.`,
            },
            {
              id: 'art-36',
              number: '36',
              title: 'Challenge to the competence of notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'competence', 'challenge', 'Commission'],
              applicabilityDate: '2 August 2026',
              text: `1. The Commission shall, where necessary, investigate all cases where there are reasons to doubt whether a notified body fulfils the requirements laid down in Article 31.

2. The notifying authority shall provide the Commission, on request, with all information relating to the notification of the conformity assessment body concerned.

3. The Commission shall ensure that all sensitive information obtained in the course of its investigations pursuant to this Article is treated confidentially.

4. Where the Commission ascertains that a notified body does not meet or no longer meets the requirements laid down in Article 31, it shall adopt an implementing act requesting the notifying Member State to take the necessary corrective measures, including withdrawal of notification if necessary. That implementing act shall be adopted in accordance with the examination procedure referred to in Article 98(2).`,
            },
            {
              id: 'art-37',
              number: '37',
              title: 'Coordination of notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'coordination', 'harmonisation'],
              applicabilityDate: '2 August 2026',
              text: `The Commission shall ensure that appropriate coordination and cooperation between notified bodies active in the conformity assessment procedures pursuant to this Regulation are put in place and properly operated in the form of a sectoral group of notified bodies. Member States shall ensure that the bodies they have notified participate in the work of that group, directly or by means of designated representatives. The Commission shall provide for the exchange of views and information between notified bodies and the Commission on matters relevant to the application of this Regulation.`,
            },
            {
              id: 'art-38',
              number: '38',
              title: 'Review of notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['notified-body', 'review', 'monitoring', 'peer-evaluation'],
              applicabilityDate: '2 August 2026',
              text: `1. Notifying authorities shall carry out a review of the conformity assessment activities of the notified bodies under their supervision in order to ensure that technical progress is taken into account in the conformity assessment activities of the notified bodies.

2. The review of the notified bodies shall include information on the state of the art on AI and related technologies, and shall be carried out at regular intervals.

3. Notifying authorities shall ensure that the notified bodies they supervise maintain the qualification of their personnel with regard to technical knowledge and awareness of standards and requirements in the area of AI.`,
            },
            {
              id: 'art-39',
              number: '39',
              title: 'Conformity assessment bodies of third countries',
              chapterId: 'ch-3',
              sectionId: 'ch3-s4',
              tags: ['conformity-assessment', 'third-country', 'international', 'notified-body'],
              applicabilityDate: '2 August 2026',
              text: `Conformity assessment bodies established under the law of a third country and their subsidiaries established in the Union may be authorised to carry out the activities of a notified body under this Regulation where they comply with the requirements laid down in Article 31 and where the Union has concluded an agreement with the third country concerned allowing conformity assessment bodies established in that third country to carry out conformity assessment activities under this Regulation. The conformity assessment bodies shall be assessed and notified pursuant to the procedures of Articles 29 and 30.`,
            },
          ],
        },
        {
          id: 'ch3-s5',
          title: 'Section 5 — Standards, conformity assessment, certificates, registration',
          articles: [
            {
              id: 'art-40',
              number: '40',
              title: 'Harmonised standards and standardisation deliverables',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['standards', 'harmonised-standards', 'conformity', 'CEN-CENELEC'],
              applicabilityDate: '2 August 2026',
              text: `1. High-risk AI systems or general-purpose AI models which are in conformity with harmonised standards or parts thereof the references of which have been published in the Official Journal of the European Union shall be presumed to be in conformity with the requirements set out in Chapter III, Section 2 of this Regulation or the obligations set out in Chapter V, Sections 2 and 3, of this Regulation, to the extent those standards cover those requirements or obligations.

2. The Commission shall issue standardisation requests to the relevant European standardisation organisations in a timely manner and in accordance with Regulation (EU) No 1025/2012.

3. The European standardisation organisations shall deliver their standards and standardisation deliverables in accordance with Regulation (EU) No 1025/2012 taking into account the state of the art in AI technology.`,
            },
            {
              id: 'art-41',
              number: '41',
              title: 'Common specifications',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['common-specifications', 'conformity', 'implementing-acts'],
              applicabilityDate: '2 August 2026',
              text: `1. The Commission may, by means of implementing acts, adopt common specifications for the requirements set out in Section 2 of this Chapter or for the obligations set out in Chapter V, Sections 2 and 3, where:
(a) the Commission has requested one or more European standardisation organisations to draft a harmonised standard for the requirements set out in Section 2 in accordance with Article 10(1) of Regulation (EU) No 1025/2012, and the standardisation deliverable has not been delivered within the deadline set or the Commission considers that the relevant standardisation deliverable does not sufficiently address the concerns regarding health, safety or fundamental rights; or
(b) the Commission considers it necessary to address specific safety or fundamental rights concerns.

2. Before adopting common specifications, the Commission shall consult the advisory forum referred to in Article 67.

3. High-risk AI systems or general-purpose AI models which are in conformity with common specifications adopted pursuant to this Article shall be presumed to be in conformity with the requirements or obligations referred to in paragraph 1 to the extent those common specifications cover those requirements or obligations.`,
            },
            {
              id: 'art-42',
              number: '42',
              title: 'Presumption of conformity with certain requirements',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['conformity', 'presumption', 'cybersecurity', 'standards'],
              applicabilityDate: '2 August 2026',
              text: `1. Taking into account their intended purpose, high-risk AI systems that have been trained and tested on data concerning the specific geographical, behavioural, contextual or functional setting within which they are intended to be used shall be presumed to be in compliance with the requirement set out in Article 10(4).

2. High-risk AI systems that have been certified or for which a statement of conformity has been issued under a cybersecurity scheme pursuant to Regulation (EU) 2019/881 and the references of which have been published in the Official Journal of the European Union shall be presumed to be in compliance with the cybersecurity requirements set out in Article 15 of this Regulation in so far as the cybersecurity certificate or statement of conformity or parts thereof cover those requirements.`,
            },
            {
              id: 'art-43',
              number: '43',
              title: 'Conformity assessment',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['conformity-assessment', 'notified-body', 'high-risk', 'self-assessment'],
              applicabilityDate: '2 August 2026',
              text: `1. For high-risk AI systems listed in point 1 of Annex III, where in demonstrating compliance of a high-risk AI system with the requirements set out in Section 2, the provider has applied harmonised standards referred to in Article 40 covering all of the requirements set out in Section 2, or common specifications referred to in Article 41, the provider shall follow a conformity assessment procedure based on internal control as referred to in Annex VI.

2. For high-risk AI systems referred to in Annex III, other than those referred to in point 1 thereof, providers shall follow one of the following conformity assessment procedures:
(a) the conformity assessment procedure based on internal control as referred to in Annex VI; or
(b) the conformity assessment procedure based on assessment of the quality management system and assessment of the technical documentation with the involvement of a notified body as referred to in Annex VII.

3. For high-risk AI systems referred to in points 2 to 8 of Annex III, providers shall perform the conformity assessment procedure as referred to in paragraph 1 of this Article.

4. High-risk AI systems shall undergo a new conformity assessment procedure whenever they are substantially modified, regardless of whether the modified system is intended to be further distributed or continues to be used by the current deployer.

5. The Commission is empowered to adopt delegated acts in accordance with Article 97 in order to amend Annexes VI and VII by updating them in light of technical progress.`,
            },
            {
              id: 'art-44',
              number: '44',
              title: 'Certificates',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['certificates', 'notified-body', 'conformity', 'validity'],
              applicabilityDate: '2 August 2026',
              text: `1. Certificates issued by notified bodies in accordance with Annex VII shall be in an official Union language determined by the Member State in which the notified body is established or in an official Union language otherwise acceptable to the notified body.

2. Certificates shall be valid for the period they indicate, which shall not exceed four years. On application by the provider, the validity of a certificate may be extended for further periods, each not exceeding four years, based on a re-assessment in accordance with the applicable conformity assessment procedures.

3. Where a notified body finds that an AI system no longer meets the requirements set out in Section 2, it shall, taking account of the principle of proportionality, suspend or withdraw the certificate issued or impose restrictions on it, unless compliance with those requirements is ensured by appropriate corrective action taken by the provider of the system within an appropriate deadline set by the notified body. The notified body shall inform the relevant notifying authority of any suspension, withdrawal or restriction imposed on a certificate.

4. The Commission shall develop implementing acts to set out the technical and operational specifications for the European database.`,
            },
            {
              id: 'art-45',
              number: '45',
              title: 'Appeals against decisions of notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['appeals', 'notified-body', 'decisions', 'legal-remedies'],
              applicabilityDate: '2 August 2026',
              text: `Member States shall ensure that an appeal procedure against decisions of the notified bodies is available.`,
            },
            {
              id: 'art-46',
              number: '46',
              title: 'Information obligations of notified bodies',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['notified-body', 'information', 'reporting', 'obligations'],
              applicabilityDate: '2 August 2026',
              text: `1. Notified bodies shall inform the notifying authority of the following:
(a) any refusal, restriction, suspension or withdrawal of a certificate in accordance with the requirements of Annex VII;
(b) any circumstances affecting the scope of and conditions for notification;
(c) any request for information which they have received from market surveillance authorities regarding conformity assessment activities;
(d) on request, conformity assessment activities performed within the scope of their notification and any other activity performed, including cross-border activities and subcontracting.

2. Notified bodies shall provide the other bodies notified under this Regulation carrying out similar conformity assessment activities covering the same types of AI systems with relevant information on issues relating to negative and, on request, positive conformity assessment results.`,
            },
            {
              id: 'art-47',
              number: '47',
              title: 'EU declaration of conformity',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['declaration-of-conformity', 'provider', 'CE-marking', 'conformity'],
              applicabilityDate: '2 August 2026',
              text: `1. The provider shall draw up a written EU declaration of conformity for each high-risk AI system and keep it at the disposal of the national competent authorities for 10 years after the high-risk AI system has been placed on the market or put into service. The EU declaration of conformity shall identify the high-risk AI system for which it has been drawn up. A copy of the EU declaration of conformity shall be submitted to the relevant national competent authorities upon request.

2. The EU declaration of conformity shall state that the high-risk AI system in question meets the requirements set out in Section 2. The EU declaration of conformity shall contain the information set out in Annex V and shall be translated into the language(s) required by the Member State(s) in which the high-risk AI system is placed on the market or made available.

3. Where high-risk AI systems are subject to other Union harmonisation legislation which also requires an EU declaration of conformity, a single EU declaration of conformity shall be drawn up in respect of all Union law applicable to the high-risk AI system. The declaration shall contain all the information required for identification of the Union harmonisation legislation to which the declaration relates.

4. By drawing up the EU declaration of conformity, the provider assumes responsibility for compliance with the requirements set out in Section 2. The provider shall keep the EU declaration of conformity updated as appropriate.

5. The Commission is empowered to adopt delegated acts in accordance with Article 97 to amend Annex V by updating the content of the EU declaration of conformity set out in that Annex with a view to introducing elements that become necessary in light of technical progress.`,
            },
            {
              id: 'art-48',
              number: '48',
              title: 'CE marking',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['CE-marking', 'conformity', 'provider', 'high-risk'],
              applicabilityDate: '2 August 2026',
              text: `1. The CE marking shall be subject to the general principles set out in Article 30 of Regulation (EC) No 765/2008.

2. For high-risk AI systems provided digitally, a digital CE marking shall be used. Where the high-risk AI system is provided together with a product, the CE marking shall be affixed on the product. Where the high-risk AI system is provided separately, the CE marking shall be affixed to the technical documentation and, where applicable, to the packaging, as applicable.

3. The provider shall affix the CE marking before the high-risk AI system is placed on the market or put into service. It may be followed by the identification number of the notified body, where such a body is involved in the conformity assessment procedure.

4. The CE marking shall be affixed visibly, legibly and indelibly. Where that is not possible or not warranted on account of the nature of the high-risk AI system, it shall be affixed to the packaging and to the accompanying documentation.

5. Where applicable, the CE marking shall be accompanied by the identification number of the notified body responsible for the conformity assessment procedures set out in Article 43.

6. Member States shall build upon existing mechanisms to ensure correct application of the regime governing the CE marking and shall take appropriate action in the event of improper use of that marking.`,
            },
            {
              id: 'art-49',
              number: '49',
              title: 'Registration',
              chapterId: 'ch-3',
              sectionId: 'ch3-s5',
              tags: ['registration', 'EU-database', 'high-risk', 'provider', 'deployer'],
              applicabilityDate: '2 August 2026',
              text: `1. Before placing on the market or putting into service a high-risk AI system listed in Annex III, the provider of the system shall register themselves and their system in the EU database referred to in Article 71.

2. Before putting into service or using a high-risk AI system listed in Annex III, deployers that are public authorities, Union institutions, bodies, offices or agencies or persons acting on their behalf shall register themselves in the EU database referred to in Article 71.

3. Member States may decide that certain high-risk AI systems referred to in paragraph 1 listed in points 1 to 7 of Annex III by bodies or persons referred to in paragraph 2, shall be registered in accordance with this Article at national level in existing national registration systems, provided that the national system allows for equivalent transparency, access and use conditions compared to the EU database.

4. The registration data shall include at a minimum the information listed in Section A of Annex VIII for high-risk AI systems listed in Annex III and in Section B of Annex VIII for high-risk AI systems listed in Annex I.`,
            },
          ],
        },
      ],
    },
    {
      id: 'ch-4',
      number: 'IV',
      title: 'Transparency Obligations for Providers and Deployers of Certain AI Systems',
      articles: [
        {
          id: 'art-50',
          number: '50',
          title: 'Transparency obligations for providers and deployers of certain AI systems',
          chapterId: 'ch-4',
          tags: ['transparency', 'chatbot', 'deepfake', 'disclosure', 'emotion-recognition', 'biometric'],
          applicabilityDate: '2 August 2026',
          text: `1. Providers of AI systems intended to interact directly with natural persons shall design and develop those systems in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the circumstances and the context of use. This obligation shall not apply to AI systems authorised by law to detect, prevent, investigate, and prosecute criminal or administrative offences, subject to appropriate safeguards for the rights and freedoms of third parties.

2. Providers of AI systems, including general-purpose AI systems, generating synthetic audio, image, video or text content, shall ensure the outputs of the AI system are marked in a machine-readable format and detectable as artificially generated or manipulated. Providers shall ensure their technical solutions are effective, interoperable, robust and reliable as far as this is technically feasible, taking into account the specificities and limitations of various types of content, the costs of implementation and the generally acknowledged state of the art, as may be reflected in relevant technical standards.

3. The obligation set out in paragraph 2 shall not apply to AI systems performing an assistive function for standard editing or that do not substantially alter the input data provided by the deployer or the semantics thereof, or that have been authorised by law to detect, prevent, investigate and prosecute criminal offences.

4. Deployers of an AI system that generates or manipulates image, audio or video content constituting a deep fake, shall disclose that the content has been artificially generated or manipulated. This obligation shall not apply where use is authorised by law to detect, prevent, investigate and prosecute criminal or administrative offences, or where the content is part of an evidently artistic, creative, satirical, fictional or analogous work or programme.

5. Deployers of an AI system that generates or manipulates text which is published with the purpose of informing the public on matters of public interest shall disclose that the text has been artificially generated or manipulated. This obligation shall not apply where the use is authorised by law to detect, prevent, investigate and prosecute criminal or administrative offences, or where the AI-generated or manipulated content has undergone a process of human review or editorial control and where a natural or legal person bears editorial responsibility for the publication of the content.

6. Deployers of emotion recognition systems or biometric categorisation systems shall inform the natural persons exposed thereto of the operation of the system and shall process the personal data in accordance with Regulations (EU) 2016/679, (EU) 2018/1725 and Directive (EU) 2016/680, as applicable. This obligation shall not apply to AI systems used for biometric categorisation or emotion recognition which are permitted by law to detect, prevent, and investigate criminal offences.

7. The information referred to in paragraphs 1 to 6 shall be provided to the natural persons concerned in a clear and distinguishable manner at the latest at the time of the first interaction or exposure.`,
        },
      ],
    },
    {
      id: 'ch-5',
      number: 'V',
      title: 'General-Purpose AI Models',
      sections: [
        {
          id: 'ch5-s1',
          title: 'Section 1 — Classification of general-purpose AI models as general-purpose AI models with systemic risk',
          articles: [
            {
              id: 'art-51',
              number: '51',
              title: 'Classification of general-purpose AI models as general-purpose AI models with systemic risk',
              chapterId: 'ch-5',
              sectionId: 'ch5-s1',
              tags: ['GPAI', 'systemic-risk', 'classification', 'FLOP'],
              applicabilityDate: '2 August 2025',
              text: `1. A general-purpose AI model shall be classified as a general-purpose AI model with systemic risk if it meets any of the following conditions:
(a) it has high impact capabilities evaluated on the basis of appropriate technical tools and methodologies, including indicators and benchmarks;
(b) based on a decision of the Commission, ex officio or following a qualified alert from the scientific panel, it has capabilities or an impact equivalent to those set out in point (a).

2. A general-purpose AI model shall be presumed to have high impact capabilities pursuant to paragraph 1, point (a), when the cumulative amount of compute used for its training measured in floating point operations is greater than 10^25 FLOPs.

3. The Commission shall adopt implementing acts to specify the criteria for classifying a general-purpose AI model as having high-impact capabilities pursuant to paragraph 1 of this Article, in accordance with the examination procedure of Article 98(2). The Commission shall adopt those implementing acts by 2 August 2025.

4. The Commission shall, after consulting the AI Board and taking into account technical progress, adopt delegated acts in accordance with Article 97 to specify the threshold in paragraph 2 of this Article, as well as to update it in light of evolving technological developments.`,
            },
            {
              id: 'art-52',
              number: '52',
              title: 'Procedure',
              chapterId: 'ch-5',
              sectionId: 'ch5-s1',
              tags: ['GPAI', 'systemic-risk', 'procedure', 'Commission', 'AI-Office'],
              applicabilityDate: '2 August 2025',
              text: `1. Where the Commission considers that a general-purpose AI model has high-impact capabilities pursuant to Article 51(1), point (b), it shall take the following steps:
(a) initiate a procedure to assess whether the general-purpose AI model has high-impact capabilities;
(b) notify the provider of the general-purpose AI model, giving the provider the opportunity to submit its views within 30 days.

2. Where, after the procedure referred to in paragraph 1, the Commission determines that the general-purpose AI model has high-impact capabilities, it shall classify it as a general-purpose AI model with systemic risk by means of a decision.

3. The Commission shall make available to the public a list of general-purpose AI models with systemic risk classified as such pursuant to this Article. The Commission shall update this list as appropriate.

4. The AI Office shall perform the tasks of the Commission under this Article.`,
            },
          ],
        },
        {
          id: 'ch5-s2',
          title: 'Section 2 — Obligations for providers of general-purpose AI models',
          articles: [
            {
              id: 'art-53',
              number: '53',
              title: 'Obligations for providers of general-purpose AI models',
              chapterId: 'ch-5',
              sectionId: 'ch5-s2',
              tags: ['GPAI', 'provider', 'obligations', 'documentation', 'copyright', 'transparency'],
              applicabilityDate: '2 August 2025',
              text: `1. Providers of general-purpose AI models shall:
(a) draw up and keep up-to-date the technical documentation of the model, including its training process, and evaluate and mitigate possible risks to health and safety, fundamental rights, democratic processes and the rule of law throughout the model lifecycle, for the purpose of making it available for the purposes of Article 52 and upon request to the AI Office and the national competent authorities;
(b) draw up, keep up-to-date and make available information and documentation to providers of AI systems who intend to integrate the general-purpose AI model into their AI system. Without prejudice to the need to observe and protect intellectual property rights and confidential business information or trade secrets in accordance with Union and national law, the information and documentation shall:
(i) enable providers of AI systems to have a good understanding of the capabilities and limitations of the general-purpose AI model and to comply with their obligations pursuant to this Regulation; and
(ii) contain, at a minimum, the elements set out in Annex XII;
(c) put in place a policy to respect Union copyright law and in particular to identify and respect, including through state of the art technologies, the reservations of rights expressed pursuant to Article 4(3) of Directive (EU) 2019/790;
(d) draw up and make publicly available a sufficiently detailed summary about the content used for training of the general-purpose AI model, according to a template provided by the AI Office.

2. The obligations set out in paragraph 1, points (a) and (b), shall not apply to providers of general-purpose AI models that are released under a free and open-source licence that allows for the access, usage, modification, and distribution of the model, and whose parameters, including the weights, the information on the model architecture, and the information on model usage, are made publicly available. This exception shall not apply to general-purpose AI models with systemic risk.

3. Providers of general-purpose AI models shall cooperate with the Commission and the national competent authorities in the exercise of their competences and powers pursuant to this Regulation.

4. Providers of general-purpose AI models shall, upon request by the AI Office or a national competent authority, provide the documentation referred to in paragraph 1, points (a) and (b), to that AI Office or national competent authority.

5. In order to facilitate the compliance of downstream providers, providers of general-purpose AI models shall make the information and documentation referred to in paragraph 1, point (b), available in a machine-readable format and shall cooperate with downstream providers if requested.`,
            },
            {
              id: 'art-54',
              number: '54',
              title: 'Authorised representatives of providers of general-purpose AI models',
              chapterId: 'ch-5',
              sectionId: 'ch5-s2',
              tags: ['GPAI', 'authorised-representative', 'provider', 'third-country'],
              applicabilityDate: '2 August 2025',
              text: `1. Prior to making available on the Union market their general-purpose AI models, providers of general-purpose AI models established in third countries shall designate, in writing, a representative that is established in the Union.

2. Providers of general-purpose AI models established in third countries shall enable their authorised representative to perform the tasks referred to in the mandate received from the provider.

3. The authorised representative shall carry out the tasks specified in the mandate received from the provider. It shall provide a copy of the mandate to the AI Office upon request.

4. The authorised representative shall be addressed by the competent authorities and the AI Office on all issues related to the general-purpose AI model, in addition to or instead of the provider, with regard to the obligations of providers under this Regulation.`,
            },
          ],
        },
        {
          id: 'ch5-s3',
          title: 'Section 3 — Obligations for providers of general-purpose AI models with systemic risk',
          articles: [
            {
              id: 'art-55',
              number: '55',
              title: 'Obligations for providers of general-purpose AI models with systemic risk',
              chapterId: 'ch-5',
              sectionId: 'ch5-s3',
              tags: ['GPAI', 'systemic-risk', 'obligations', 'red-teaming', 'incident-reporting', 'cybersecurity'],
              applicabilityDate: '2 August 2025',
              text: `1. In addition to the obligations listed in Article 53, providers of general-purpose AI models with systemic risk shall:
(a) perform model evaluation in accordance with standardised protocols and tools reflecting the state of the art, including conducting and documenting adversarial testing of the model with a view to identify and mitigate systemic risks;
(b) assess and mitigate possible systemic risks, including their sources, that may stem from the development, the placing on the market, or the use of general-purpose AI models with systemic risk;
(c) keep track of, document and report, without undue delay, to the AI Office and, as appropriate, to relevant national competent authorities, relevant information about serious incidents and possible corrective measures to address them;
(d) ensure an adequate level of cybersecurity protection for the general-purpose AI model with systemic risk and the physical infrastructure of the model.

2. Providers of general-purpose AI models with systemic risk may rely on codes of practice as referred to in Article 56 to demonstrate compliance with the obligations set out in paragraph 1 of this Article, until a harmonised standard is published. Compliance with a European harmonised standard grants providers a presumption of conformity to the extent that those standards cover those obligations.

3. Providers of general-purpose AI models with systemic risk shall cooperate with the Commission and other relevant authorities, including by making available information, data and access to computation resources as necessary. Where the provider cannot provide adequate cooperation, the AI Office may use the information gathered from other entities in the AI supply chain.`,
            },
          ],
        },
        {
          id: 'ch5-s4',
          title: 'Section 4 — Codes of practice',
          articles: [
            {
              id: 'art-56',
              number: '56',
              title: 'Codes of practice',
              chapterId: 'ch-5',
              sectionId: 'ch5-s4',
              tags: ['GPAI', 'codes-of-practice', 'AI-Office', 'self-regulation', 'systemic-risk'],
              applicabilityDate: '2 August 2025',
              text: `1. The AI Office shall encourage and facilitate the drawing up of codes of practice at Union level in order to contribute to the proper application of this Regulation, taking into account international approaches.

2. The AI Office and the Board shall aim to ensure that the codes of practice cover at least the obligations provided for in Articles 53 and 55, including the following matters:
(a) the means to ensure that the information referred to in Article 53(1)(a)(b) is kept up to date taking into account the evolving nature of the general-purpose AI models;
(b) the means to identify the type and nature of the systemic risks at Union level, including their sources;
(c) the means to manage the systemic risks at Union level, including measures for their mitigation;
(d) the means to ensure an adequate level of cybersecurity protection.

3. The AI Office may invite all providers of general-purpose AI models, as well as relevant national competent authorities, to participate in the drawing up of codes of practice. Civil society organisations, industry, academia and other relevant stakeholders, such as downstream providers and independent experts may support the process.

4. The AI Office and the Board shall aim for codes of practice to be ready at the latest by 2 May 2025.

5. Pending the finalisation of a code of practice to be used by providers pursuant to Article 55, providers of general-purpose AI models with systemic risk may temporarily use the guidelines of the AI Office published for that purpose.

6. The AI Office shall assess the codes of practice drawn up pursuant to this Article. If the AI Office considers that the code of practice is appropriate, it shall recommend the code to providers and publish a notice in the Official Journal of the European Union.`,
            },
          ],
        },
      ],
    },
    {
      id: 'ch-6',
      number: 'VI',
      title: 'Measures in Support of Innovation',
      articles: [
        {
          id: 'art-57',
          number: '57',
          title: 'AI regulatory sandboxes',
          chapterId: 'ch-6',
          tags: ['innovation', 'regulatory-sandbox', 'SME', 'testing'],
          applicabilityDate: '2 August 2026',
          text: `1. Member States shall ensure that their competent authorities establish at least one AI regulatory sandbox at national level, which shall be operational by 2 August 2026. That sandbox may also be established jointly with the competent authorities of other Member States.

2. Additional AI regulatory sandboxes at regional or local level, or operating jointly at cross-border level, may also be established, in line with the applicable Union or national law. The Commission may provide technical support, expertise and tools for the establishment and operation of AI regulatory sandboxes.

3. Member States may also make existing sandboxes available for the purposes referred to in paragraph 1.

4. The national competent authorities shall also ensure that innovation activities are facilitated and that AI regulatory sandboxes function as a mechanism to provide advice and guidance for projects in the sandboxes. The national competent authorities shall make the capacity development support available, in particular to SMEs and start-ups.

5. AI regulatory sandboxes shall provide a controlled environment that facilitates the development, training, testing and validation of innovative AI systems for a limited time before their placing on the market or putting into service pursuant to a specific sandbox plan agreed between the prospective providers and the competent authority.

6. Participation in an AI regulatory sandbox shall not affect the supervisory and corrective powers of the competent authorities. Any significant risks to health and safety and fundamental rights identified during the development and testing of such systems shall result in adequate mitigation.

7. In order to ensure the uniform implementation of this Article, the Commission shall publish practical guidelines on the implementation of AI regulatory sandboxes.`,
        },
        {
          id: 'art-58',
          number: '58',
          title: 'Detailed arrangements for AI regulatory sandboxes',
          chapterId: 'ch-6',
          tags: ['innovation', 'regulatory-sandbox', 'arrangements', 'procedure'],
          applicabilityDate: '2 August 2026',
          text: `1. In order to avoid fragmentation across the Union, the Commission shall adopt implementing acts specifying the detailed arrangements for the establishment, operation and supervision of the AI regulatory sandboxes. The implementing acts shall cover aspects relating to eligibility conditions and procedures, the selection of participants, and the monitoring, reporting and evaluating of the outcomes of the sandbox activity.

2. Those implementing acts shall be adopted in accordance with the examination procedure referred to in Article 98(2).

3. The implementing acts referred to in paragraph 1 shall ensure:
(a) that AI regulatory sandboxes are open and accessible to any provider or prospective provider of an AI system, in particular SMEs and start-ups, subject to eligibility conditions set out in those implementing acts and the requirements of this Article;
(b) that a sufficient number of participants are admitted to the AI regulatory sandbox in order to allow for meaningful testing and monitoring, while at the same time ensuring that the sandbox is not overloaded;
(c) that AI regulatory sandboxes facilitate, where possible, and do not impose the obligation to transfer the rights to intellectual property and know-how of the participants.`,
        },
        {
          id: 'art-59',
          number: '59',
          title: 'Further processing of personal data for developing certain AI systems in the public interest in AI regulatory sandboxes',
          chapterId: 'ch-6',
          tags: ['innovation', 'regulatory-sandbox', 'personal-data', 'GDPR', 'public-interest'],
          applicabilityDate: '2 August 2026',
          text: `1. In the AI regulatory sandbox, personal data lawfully collected for other purposes may be processed solely for the purpose of developing, training and testing certain AI systems in the sandbox when all of the following conditions are met:
(a) the AI systems shall be developed for the safeguarding of substantial public interest in one or more of the following areas:
(i) public safety and public health, including disease detection, diagnosis prevention, control and treatment and improvement of health care systems;
(ii) a high level of protection and improvement of the quality of the environment, protection of biodiversity, protection against pollution and green transition measures, climate change mitigation and adaptation;
(iii) energy sustainability;
(iv) safety and resilience of transport systems and mobility;
(v) efficiency and quality of public administration and public services;
(b) the data processed are necessary for compliance with one or more of the requirements set out in Chapter III, Section 2, it is not possible to fulfil those requirements by processing anonymised, synthetic or other non-personal data, and the conditions in Article 6(4) of Regulation (EU) 2016/679 are met;
(c) there are effective monitoring mechanisms to identify if any high risks to the rights and freedoms of the data subjects, as referred to in Article 35 of Regulation (EU) 2016/679, may arise during the sandbox experimentation, as well as a response mechanism to promptly mitigate those risks and, where necessary, to stop the processing;
(d) any personal data to be processed in the context of the sandbox is in a functionally separate, isolated and protected data processing environment under the control of and only accessible by authorised persons and the data accessed are not transmitted, transferred or otherwise accessed by other parties;
(e) any personal data processed are not used for any other purpose;
(f) any personal data processed pursuant to this Article are deleted once the participation in the AI regulatory sandbox has terminated or the personal data has reached the end of its retention period;
(g) the logs of the processing of personal data pursuant to this Article are kept for the duration of the participation in the AI regulatory sandbox and one year after its termination, solely for the purpose of and to the extent necessary for fulfilling accountability and documentation obligations under this Article or other Union or national law;
(h) a complete and detailed description of the process and rationale behind the training, testing and validation of the AI system is kept and made available to the competent authority upon request;
(i) the operator complies with applicable Union and national data protection law.

2. Without prejudice to the applicability of Regulation (EU) 2016/679 and Directive 2002/58/EC, controllers and processors operating in the AI regulatory sandbox for the purposes referred to in paragraph 1 of this Article may, for the purposes of developing, training and testing certain innovative AI systems in the sandbox, continue processing personal data that was originally collected pursuant to Regulation (EU) 2016/679 or Directive 2002/58/EC for the purposes referred to in paragraph 1, point (a), notwithstanding the incompatibility of that processing with the initial purpose for which the data was collected, to the extent that the conditions laid down in this Article are met.`,
        },
        {
          id: 'art-60',
          number: '60',
          title: 'Testing of high-risk AI systems in real world conditions outside AI regulatory sandboxes',
          chapterId: 'ch-6',
          tags: ['innovation', 'real-world-testing', 'high-risk', 'participants'],
          applicabilityDate: '2 August 2026',
          text: `1. Testing of high-risk AI systems in real world conditions outside AI regulatory sandboxes may be conducted by providers or prospective providers of high-risk AI systems listed in Annex III in accordance with this Article and the real world testing plan referred to in this Article, without prejudice to the prohibitions under Article 5.

2. Providers or prospective providers may conduct testing in real world conditions at any time before placing the high-risk AI system on the market or putting it into service on their own or in partnership with one or more deployers or prospective deployers.

3. Testing of high-risk AI systems in real world conditions pursuant to this Article shall be subject to conditions provided by the competent authority of the Member State where the testing is to take place.

4. Providers or prospective providers of high-risk AI systems that intend to conduct testing in real world conditions in accordance with this Article shall notify the market surveillance authority in the Member State or Member States in which the testing is to be conducted at least 30 days prior to the commencement of the testing.

5. Testing in real world conditions shall not last longer than the time necessary to achieve its objectives and in any case not longer than 6 months, which may be extended for an additional 6-month period, subject to prior notification to the market surveillance authority.`,
        },
        {
          id: 'art-61',
          number: '61',
          title: 'Informed consent to participate in testing in real world conditions outside AI regulatory sandboxes',
          chapterId: 'ch-6',
          tags: ['innovation', 'real-world-testing', 'consent', 'participants'],
          applicabilityDate: '2 August 2026',
          text: `1. For the purposes of testing in real world conditions pursuant to Article 60, freely given and informed consent shall be obtained from the subjects of testing prior to their participation in such testing and after they have been duly informed with concise, clear, relevant, and understandable information regarding:
(a) the nature and objectives of the real world testing and possible inconvenience that may be associated with their participation;
(b) the conditions under which the testing in real world conditions is to be conducted, including the expected duration of the subject's participation;
(c) the subject's rights, and the means available to them to exercise those rights;
(d) the contact details of the provider or their legal representative and the market surveillance authority, from which further information can be obtained and complaints can be lodged;
(e) the purpose, data needed, and the storage, use and confidentiality of the data.

2. The consent referred to in paragraph 1 shall be documented and retained by the provider or prospective provider. Consent may be withdrawn by the subject of testing at any point without detriment to them.`,
        },
        {
          id: 'art-62',
          number: '62',
          title: 'Measures for providers and deployers, in particular SMEs, including start-ups',
          chapterId: 'ch-6',
          tags: ['innovation', 'SME', 'start-ups', 'support', 'access'],
          applicabilityDate: '2 August 2026',
          text: `1. Member States shall undertake the following actions:
(a) provide SMEs, including start-ups, having a registered office or a branch in the Union, with priority access to the AI regulatory sandboxes to the extent that they fulfil the eligibility conditions and selection criteria;
(b) organise specific awareness raising and training activities on the application of this Regulation tailored to the needs of SMEs and start-ups;
(c) where appropriate, establish a dedicated channel for communication with SMEs, start-ups, and other innovators in order to provide guidance and respond to queries about the implementation of this Regulation.

2. The specific interests and needs of the SME providers shall be taken into account when setting the fees for conformity assessment under Article 43, reducing those fees proportionately to their size and market size.

3. The AI Office shall undertake the following actions:
(a) provide standardised templates for the areas covered by this Regulation, as specified by the Board in its request;
(b) develop and maintain a single information platform providing easy-to-use information in relation to this Regulation for all operators across the Union;
(c) organise appropriate communication and dissemination campaigns to raise awareness about the obligations arising from this Regulation;
(d) evaluate and promote the convergence of best practices in public procurement procedures in relation to AI systems.`,
        },
        {
          id: 'art-63',
          number: '63',
          title: 'Derogations for specific operators',
          chapterId: 'ch-6',
          tags: ['innovation', 'SME', 'derogations', 'simplification'],
          applicabilityDate: '2 August 2026',
          text: `1. Microenterprises with limited resources may fulfil several of the obligations required under this Regulation in a simplified manner, provided it can be demonstrated that the simplified approach achieves an equivalent level of compliance and that the AI system does not pose a risk to health, safety or fundamental rights of persons.

2. Microenterprises may draw up a simplified version of the technical documentation provided that all the elements provided for in Annex IV are at least partially addressed in that documentation.

3. The Commission shall issue guidelines specifying how microenterprises may fulfil the obligations under this Regulation in a simplified manner.`,
        },
      ],
    },
    {
      id: 'ch-7',
      number: 'VII',
      title: 'Governance',
      sections: [
        {
          id: 'ch7-s1',
          title: 'Section 1 — Governance at Union level',
          articles: [
            {
              id: 'art-64',
              number: '64',
              title: 'AI Office',
              chapterId: 'ch-7',
              sectionId: 'ch7-s1',
              tags: ['governance', 'AI-Office', 'Commission', 'enforcement'],
              applicabilityDate: '2 August 2025',
              text: `1. The Commission shall establish an AI Office within its own structures. The AI Office shall be responsible for:
(a) contributing to the effective and consistent application of this Regulation across the Union;
(b) supporting national competent authorities on matters of AI governance;
(c) performing the tasks of the Commission related to general-purpose AI models under Chapter V of this Regulation.

2. The AI Office shall have the power to:
(a) request and collect information and data from providers of general-purpose AI models and other relevant parties;
(b) conduct evaluations of general-purpose AI models to check compliance with this Regulation;
(c) request that providers take corrective actions regarding serious incidents or non-compliance;
(d) impose fines and penalties on providers of general-purpose AI models for non-compliance.

3. The governance and oversight of the AI Office shall be ensured by a Board of Supervisors with representation from Member States and independent experts. The AI Office shall cooperate closely with the AI Board established under Article 65.

4. The Commission shall ensure that the AI Office is provided with the technical, human and financial resources necessary to carry out its mandate effectively.`,
            },
            {
              id: 'art-65',
              number: '65',
              title: 'Establishment and structure of the European Artificial Intelligence Board',
              chapterId: 'ch-7',
              sectionId: 'ch7-s1',
              tags: ['governance', 'AI-Board', 'Member-States', 'coordination'],
              applicabilityDate: '2 August 2025',
              text: `1. A European Artificial Intelligence Board (the 'Board') is hereby established.

2. The Board shall be composed of:
(a) one representative from each Member State. Where a Member State designates more than one national competent authority, they shall designate a single representative for the Board;
(b) the European Data Protection Supervisor, as an observer;
(c) a representative of the Commission, without voting right.

3. The Board representatives shall be persons with expertise in the field of AI, whose professional experience and competence are recognised in the field.

4. The term of office of members of the Board shall be three years, renewable once.

5. Each member of the Board shall have one vote. Decisions of the Board shall be taken by simple majority, except as otherwise provided in this Regulation. The Chair shall not vote.

6. The Board shall be chaired by the Commission. The Commission shall provide the secretariat to the Board.

7. Each member of the Board may be assisted by two alternates. In the absence of a member of the Board, the alternate may exercise the member's right to vote.

8. The Board shall adopt its rules of procedure, which shall include procedures on the declaration and management of conflicts of interest by Board members.`,
            },
            {
              id: 'art-66',
              number: '66',
              title: 'Tasks of the Board',
              chapterId: 'ch-7',
              sectionId: 'ch7-s1',
              tags: ['governance', 'AI-Board', 'tasks', 'coordination', 'standards'],
              applicabilityDate: '2 August 2025',
              text: `1. The Board shall advise and assist the Commission and the Member States in order to facilitate the consistent and effective application of this Regulation. To that end, the Board may in particular:
(a) collect and share expertise and best practices among Member States;
(b) contribute to the elaboration of guidance and codes of practice;
(c) provide opinions, recommendations or written contributions on questions related to the implementation of this Regulation, including on technical specifications or existing standards regarding the requirements set out in Chapter III, Section 2 and on the classification of AI systems;
(d) examine, on its own initiative or at the request of the Commission, any question concerning the application of this Regulation and issue opinions, recommendations or written contributions on such questions;
(e) support national competent authorities and cooperation mechanisms between Member States referred to in this Chapter with respect to matters related to this Regulation;
(f) provide assistance in identifying specific measures in the area of testing and of training with regard to implementation of this Regulation;
(g) issue opinions on the draft list of high-risk AI systems established pursuant to Article 7;
(h) address the Commission with a qualified alert pursuant to Article 89 as regards general-purpose AI models, where appropriate;
(i) promote cooperation and information sharing among national competent authorities and the AI Office, including with the relevant Union agencies.

2. In exercising its tasks, the Board shall have regard to the positions and findings of Member States' national supervisory authorities and shall take into account a broad range of stakeholders' views.`,
            },
            {
              id: 'art-67',
              number: '67',
              title: 'Advisory forum',
              chapterId: 'ch-7',
              sectionId: 'ch7-s1',
              tags: ['governance', 'advisory-forum', 'stakeholders', 'civil-society'],
              applicabilityDate: '2 August 2025',
              text: `1. An advisory forum shall be established to provide technical expertise and to advise the Board and the Commission, with the objective of contributing to a balance between the various interests along the AI value chain.

2. The membership of the advisory forum shall represent a balanced selection of stakeholders, including industry, start-ups, SMEs, civil society, academia, research organisations and international organisations active in AI. The advisory forum shall not include government representatives.

3. The advisory forum members shall be appointed by the Commission. The term of office of the advisory forum members shall be two years, which may be renewed.

4. The advisory forum shall draw up its own rules of procedure, which shall in particular provide for: selection procedures, quorum requirements, and voting conditions as well as the conditions under which the advisory forum may decide to take a position by written procedure and conditions for conflicts of interest.

5. The advisory forum shall make its opinions, recommendations or written contributions available to the Board and to the Commission, on request or on its own initiative.`,
            },
            {
              id: 'art-68',
              number: '68',
              title: 'Scientific panel of independent experts',
              chapterId: 'ch-7',
              sectionId: 'ch7-s1',
              tags: ['governance', 'scientific-panel', 'experts', 'GPAI', 'evaluation'],
              applicabilityDate: '2 August 2025',
              text: `1. The Commission shall, by means of an implementing act, make provisions for the establishment of a scientific panel of independent experts (the 'scientific panel') intended to support the enforcement activities under this Regulation.

2. The scientific panel shall consist of experts selected by the Commission on the basis of up-to-date scientific or technical expertise in the field of AI and shall, in particular, include expertise in areas such as cybersecurity, fundamental rights, safety, data analysis, and the relevant social, human, economic or environmental sciences, as necessary for the exercise of the scientific panel's tasks. The Commission shall ensure appropriate gender and geographical balance in the composition of the scientific panel.

3. The scientific panel shall have the following tasks, as requested by the AI Office or the Board:
(a) support the work of the AI Office related to general-purpose AI models and their systemic risks;
(b) provide independent advice and analysis on matters related to general-purpose AI models with systemic risk;
(c) issue alerts on possible systemic risks at Union level of general-purpose AI models;
(d) contribute to the development of tools, methodologies, testing procedures and benchmarks for the evaluation of capabilities and risks of general-purpose AI models.

4. The members of the scientific panel shall perform their duties impartially and in the public interest. They shall not seek or take instructions from any government, institution, body, office, entity or person. They shall disclose any situation that may reasonably give rise to a conflict of interest. Those disclosure obligations shall apply on a continuous basis.`,
            },
            {
              id: 'art-69',
              number: '69',
              title: 'Access to the pool of experts by the Member States',
              chapterId: 'ch-7',
              sectionId: 'ch7-s1',
              tags: ['governance', 'experts', 'Member-States', 'enforcement', 'support'],
              applicabilityDate: '2 August 2026',
              text: `1. Member States may draw on the pool of experts referred to in Article 68 to support their enforcement activities under this Regulation.

2. Member States may be required to pay fees for the experts' services. The structure and level of fees and the conditions and modalities for payment shall be established in the implementing act referred to in Article 68(1), taking into account the objectives of adequate implementation of this Regulation, cost-effectiveness, the necessity to ensure effective access by Member States to experts, in particular for SMEs and start-ups, and the need to contribute to the overall objective of this Regulation.`,
            },
          ],
        },
        {
          id: 'ch7-s2',
          title: 'Section 2 — National competent authorities',
          articles: [
            {
              id: 'art-70',
              number: '70',
              title: 'Designation of national competent authorities and single points of contact',
              chapterId: 'ch-7',
              sectionId: 'ch7-s2',
              tags: ['governance', 'national-authority', 'Member-States', 'enforcement'],
              applicabilityDate: '2 August 2026',
              text: `1. Each Member State shall establish or designate at least one notifying authority and at least one market surveillance authority as national competent authorities for the purpose of ensuring the application and implementation of this Regulation. These national competent authorities shall exercise their powers independently, impartially and without bias so as to safeguard the principles of objectivity of their activities and tasks and to ensure the application and implementation of this Regulation. The members of these authorities shall refrain from any action incompatible with their duties and shall not, during their term of office, engage in any incompatible occupation.

2. Member States shall notify the Commission of the designation of the notifying authority and the market surveillance authority by 2 August 2025. Member States shall notify the Commission of the establishment or designation of the national competent authority or authorities by 2 August 2025.

3. Member States may designate a single national competent authority that is responsible for all the tasks under this Regulation. The single national competent authority may also be the national supervisory authority for AI.

4. National competent authorities shall have adequate technical, financial and human resources, and infrastructure to fulfil their tasks effectively under this Regulation. In particular, national competent authorities shall have a sufficient number of staff permanently available whose competences and expertise shall include an in-depth understanding of AI technologies, data, and data computing, knowledge of the requirements set out in this Regulation, and knowledge of applicable data protection, cybersecurity, and other relevant legislation.

5. Member States shall, by 2 August 2025, report to the Commission on the establishment or designation of national competent authorities and their tasks and powers.

6. Competent authorities shall cooperate with each other, and with the Commission. The Commission shall facilitate the exchange of experience between national competent authorities.

7. Competent authorities shall annually report to the Commission on the status of implementation of this Regulation in their Member State, including activities carried out pursuant to Chapter IX.`,
            },
          ],
        },
      ],
    },
    {
      id: 'ch-8',
      number: 'VIII',
      title: 'EU Database for High-Risk AI Systems',
      articles: [
        {
          id: 'art-71',
          number: '71',
          title: 'EU database for high-risk AI systems listed in Annex III',
          chapterId: 'ch-8',
          tags: ['database', 'registration', 'high-risk', 'transparency', 'EU-database'],
          applicabilityDate: '2 August 2026',
          text: `1. The Commission shall, in collaboration with the Member States, set up and maintain an EU database containing information referred to in paragraphs 2 and 3 concerning high-risk AI systems referred to in Article 49(1) that are registered in accordance with Article 49.

2. The EU database shall contain the following data related to registered high-risk AI systems:
(a) the information specified in Annex VIII, Section A;
(b) the information specified in Annex VIII, Section B, in the case of high-risk AI systems referred to in Annex I.

3. The information in the EU database shall be accessible to the public.

4. The EU database shall contain only personal data that is necessary for its purpose and only to the extent necessary for the purposes referred to in paragraph 1. The personal data shall be processed in accordance with applicable Union data protection law.

5. The Commission shall be the controller of the EU database. It shall also make available to providers adequate technical and administrative support. The EU database shall comply with applicable accessibility requirements.

6. The Commission shall make information held in the EU database available to national competent authorities, notified bodies, market surveillance authorities and other relevant bodies. The Commission shall ensure that the information in the EU database is kept up to date.

7. In order to facilitate compliance with the registration obligations, the Commission shall adopt implementing acts specifying the technical requirements and administrative arrangements for the registration of the high-risk AI systems referred to in Annex III, including the format of the information referred to in Annex VIII, its processing and the technical means to be deployed.`,
        },
      ],
    },
    {
      id: 'ch-9',
      number: 'IX',
      title: 'Post-Market Monitoring, Information Sharing and Market Surveillance',
      sections: [
        {
          id: 'ch9-s1',
          title: 'Section 1 — Post-market monitoring',
          articles: [
            {
              id: 'art-72',
              number: '72',
              title: 'Post-market monitoring by providers and post-market monitoring plan for high-risk AI systems',
              chapterId: 'ch-9',
              sectionId: 'ch9-s1',
              tags: ['post-market', 'monitoring', 'provider', 'high-risk', 'lifecycle'],
              applicabilityDate: '2 August 2026',
              text: `1. Providers of high-risk AI systems shall establish and document a post-market monitoring system in a manner that is proportionate to the nature of the AI technologies and the risks of the high-risk AI system.

2. The post-market monitoring system shall actively and systematically collect, document and analyse relevant data which may be provided by deployers or which may be collected through other sources on the performance of high-risk AI systems throughout their lifetime, and which allow the provider to evaluate the continuous compliance of AI systems with the requirements set out in Chapter III, Section 2.

3. The post-market monitoring plan shall be part of the technical documentation referred to in Annex IV. Where the information referred to in paragraph 1 reveals risks within the meaning of Article 79(1), the provider shall take the appropriate corrective actions referred to in Article 20 without undue delay.

4. Common specifications for the post-market monitoring plan may be adopted pursuant to Article 41(1) where necessary to properly implement this Article.

5. Where the post-market monitoring referred to in paragraphs 1, 2 and 3 reveals that the high-risk AI system is not in conformity with this Regulation, the provider shall notify the relevant national competent authorities.

6. Where deployers or persons that the high-risk AI system is used against identify unexpected performance of the high-risk AI system, they may report this to the relevant providers. Providers shall actively collect and review such information.`,
            },
          ],
        },
        {
          id: 'ch9-s2',
          title: 'Section 2 — Reporting of serious incidents',
          articles: [
            {
              id: 'art-73',
              number: '73',
              title: 'Reporting of serious incidents',
              chapterId: 'ch-9',
              sectionId: 'ch9-s2',
              tags: ['incident-reporting', 'serious-incident', 'notification', 'provider', 'market-surveillance'],
              applicabilityDate: '2 August 2026',
              text: `1. Providers of high-risk AI systems placed on the Union market shall report any serious incident to the market surveillance authorities of the Member States where that incident occurred.

2. The report referred to in paragraph 1 shall be made immediately after the provider has established a causal link between the AI system and the serious incident or the reasonable likelihood of such a link, and, in any event, not later than 15 days after the provider becomes aware of the serious incident.

3. Notwithstanding paragraph 2, in the event of a widespread serious incident or a serious incident that involves a criminal offence, the report shall be provided immediately after the provider becomes aware of it.

4. For the purposes of the report referred to in paragraph 1, the provider shall submit to the national market surveillance authority any information available to that provider. The report shall contain, at least:
(a) a description of the serious incident and its consequences;
(b) information about the AI system involved;
(c) where applicable, information about the natural persons affected and their contact details or the relevant categories of natural persons;
(d) information about the measures taken or envisaged;
(e) where applicable, information about the notified body that issued a certificate pursuant to Article 44.

5. Upon receiving the report referred to in paragraph 1, the relevant market surveillance authority shall inform the national public authorities or bodies referred to in Article 77(1) of the Member State where the serious incident occurred. The Commission shall develop dedicated guidance for the implementation of the obligations set out in paragraph 1, in particular regarding the requirements for concurrent incident reporting set out in paragraph 3.`,
            },
          ],
        },
        {
          id: 'ch9-s3',
          title: 'Section 3 — Enforcement',
          articles: [
            {
              id: 'art-74',
              number: '74',
              title: 'Market surveillance and control of AI systems in the Union market',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['market-surveillance', 'enforcement', 'authorities', 'control'],
              applicabilityDate: '2 August 2026',
              text: `1. Regulation (EU) 2019/1020 shall apply to AI systems covered by this Regulation. For the purposes of the effective enforcement of this Regulation:
(a) any reference to an "economic operator" under Regulation (EU) 2019/1020 shall be understood as including all operators as defined under Article 3, point (8) of this Regulation;
(b) any reference to a "product" under Regulation (EU) 2019/1020 shall be understood as including all AI systems falling within the scope of this Regulation.

2. The national market surveillance authority shall report the results of relevant market surveillance activities to the national competent authority on a yearly basis. The national competent authority shall transmit annually this information to the Commission and the Board.

3. Market surveillance authorities shall be granted full access by operators to the documentation and to the source code of high-risk AI systems, where such access is strictly necessary to fulfil their tasks. Any information or documentation obtained in this context shall be treated in accordance with the confidentiality obligations set out in Article 78.

4. Market surveillance authorities shall carry out their activities with a high level of transparency and shall make available to the public any relevant information they deem appropriate. The market surveillance authorities shall ensure that deployers and other affected parties are notified of any action taken.`,
            },
            {
              id: 'art-75',
              number: '75',
              title: 'Supervision of testing in real world conditions by market surveillance authorities',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['market-surveillance', 'real-world-testing', 'supervision', 'enforcement'],
              applicabilityDate: '2 August 2026',
              text: `Market surveillance authorities shall have the power to require providers or prospective providers to provide the real world testing plan referred to in Article 60(3). The market surveillance authorities shall be informed without delay of any serious incident that occurred during testing in real world conditions pursuant to Article 60. Market surveillance authorities may, where necessary to ensure the safety and rights of participants, suspend or terminate the testing at any time.`,
            },
            {
              id: 'art-76',
              number: '76',
              title: 'Oversight of testing in real world conditions conducted under the sandbox',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['regulatory-sandbox', 'oversight', 'market-surveillance', 'testing'],
              applicabilityDate: '2 August 2026',
              text: `Without prejudice to the competences of market surveillance authorities, the competent authority responsible for AI regulatory sandboxes shall oversee the testing in real world conditions conducted as part of an AI regulatory sandbox. The competent authority shall ensure that providers or prospective providers participating in the AI regulatory sandbox comply with the applicable conditions set out in this Regulation and with any additional conditions set out in the sandbox plan agreed between the participants and the competent authority.`,
            },
            {
              id: 'art-77',
              number: '77',
              title: 'Powers of authorities protecting fundamental rights',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['fundamental-rights', 'enforcement', 'authorities', 'access'],
              applicabilityDate: '2 August 2026',
              text: `1. National public authorities or bodies which supervise or enforce the respect of obligations under Union law protecting fundamental rights, including equality bodies, data protection authorities, national human rights institutions and consumer protection authorities, as well as any other relevant bodies, shall have the power to request and access any documentation created or maintained pursuant to this Regulation when the request is reasoned and proportionate to the exercise of their tasks.

2. Those authorities shall inform the relevant market surveillance authority of their findings.

3. The powers set out in this Article shall not affect the powers of national supervisory authorities under Regulation (EU) 2016/679 or under Directive (EU) 2016/680 or other Union or national law.`,
            },
            {
              id: 'art-78',
              number: '78',
              title: 'Confidentiality',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['confidentiality', 'trade-secrets', 'enforcement', 'information'],
              applicabilityDate: '2 August 2026',
              text: `1. National competent authorities and notified bodies involved in the application of this Regulation shall respect the confidentiality of information and data obtained in carrying out their tasks and activities in such a manner as to protect, in particular:
(a) intellectual property rights, and confidential business information or trade secrets of a natural or legal person, including source code, except the cases referred to in Article 5 of Directive 2016/943/EU of the European Parliament and of the Council;
(b) the effective implementation of this Regulation, in particular for the purpose of inspections, investigations or audits;
(c) public and national security interests;
(d) the conduct of criminal or administrative proceedings;
(e) information classified pursuant to Union or national law.

2. The authorities and notified bodies involved shall be able to share information with one another and with the Commission where this is necessary for the purpose of implementing this Regulation. The relevant authority or notified body shall immediately inform the provider of the high-risk AI system concerned, as well as the notified body that certified that system, of any change in the classification or assessment of a high-risk AI system.

3. The obligations laid down in paragraph 1 of this Article shall not affect the rights and obligations of the Commission, Member States and notified bodies with regard to the exchange of information and the dissemination of warnings, nor shall they affect the obligations of the persons concerned to provide information under criminal law.`,
            },
            {
              id: 'art-79',
              number: '79',
              title: 'Procedure for dealing with AI systems presenting a risk at national level',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['enforcement', 'risk', 'national-procedure', 'market-surveillance'],
              applicabilityDate: '2 August 2026',
              text: `1. Where the market surveillance authority of a Member State has sufficient reason to consider that an AI system presents a risk to the health or safety of persons, to fundamental rights, or to the compliance with obligations under Union or national law, it shall carry out an evaluation of the AI system concerned in relation to its compliance with all the requirements and obligations laid down in this Regulation. The relevant operators shall cooperate as necessary with the market surveillance authority.

2. Where, in the course of that evaluation, the market surveillance authority finds that the AI system does not comply with the requirements and obligations laid down in this Regulation, it shall without delay require the relevant operator to take all appropriate corrective actions to bring the AI system into compliance with those requirements and obligations, to withdraw the AI system from the market, or to recall it within a period it prescribes.

3. Where the market surveillance authority considers that non-compliance is not restricted to its national territory, it shall inform the Commission and the other Member States of the results of the evaluation and of the actions which it has required the operator to take.

4. The operator shall ensure that all appropriate corrective action is taken in respect of all the AI systems concerned that it has made available on the market throughout the Union.`,
            },
            {
              id: 'art-80',
              number: '80',
              title: 'Procedure for dealing with AI systems classified by the provider as non-high-risk in application of Annex III',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['enforcement', 'classification', 'high-risk', 'market-surveillance'],
              applicabilityDate: '2 August 2026',
              text: `1. Where a market surveillance authority has sufficient reason to consider that an AI system which has been classified by the provider as non-high-risk in application of Article 6(3) is in fact high-risk, it may carry out an evaluation of that AI system as regards its classification on the basis of the conditions set out in Article 6 and Annex III.

2. In the course of that evaluation, the market surveillance authority shall give the operator of the AI system the opportunity to be heard.

3. If the evaluation confirms that the AI system is high-risk, the market surveillance authority shall require the operator to comply with the applicable requirements of this Regulation.`,
            },
            {
              id: 'art-81',
              number: '81',
              title: 'Union safeguard procedure',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['enforcement', 'safeguard', 'Commission', 'Union-procedure'],
              applicabilityDate: '2 August 2026',
              text: `1. Where, within three months of receipt of the notification referred to in Article 79(3), or as soon as possible in the case of a serious incident, objections are raised by a Member State against a measure taken by another Member State, or where the Commission considers that the measure is contrary to Union law, the Commission shall without delay enter into consultation with the relevant Member State and operator or operators and shall evaluate the national measure. On the basis of the results of that evaluation, the Commission shall decide whether the national measure is justified and, where necessary, propose an appropriate measure.

2. If the Commission considers a national measure to be justified, all Member States shall ensure that the non-compliant AI system is withdrawn from their market. If the Commission considers the national measure not to be justified, the Member State concerned shall withdraw that measure.

3. Where the national measure is considered justified and the non-compliance of the AI system is attributed to shortcomings in the harmonised standards or common specifications, the Commission shall apply the relevant provisions of Regulation (EU) No 1025/2012.`,
            },
            {
              id: 'art-82',
              number: '82',
              title: 'Compliant AI systems which present a risk',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['enforcement', 'compliant-system', 'risk', 'safeguard'],
              applicabilityDate: '2 August 2026',
              text: `1. Where a market surveillance authority of a Member State makes a finding that although a high-risk AI system is in compliance with this Regulation, it nevertheless presents a risk to the health or safety of persons, fundamental rights, or to other aspects of public interest protection, it shall require the relevant operator to take all appropriate measures to ensure that the AI system concerned, when placed on the market or put into service, no longer presents that risk, to withdraw the AI system from the market or to recall it within a reasonable period, commensurate with the nature of the risk, as it may prescribe.

2. The market surveillance authority shall immediately notify the Commission and the other Member States. The notification shall include all available details, in particular the data necessary for the identification of the AI system, the origin and the supply chain of the AI system, the nature of the risk involved and the nature and duration of the national measures taken.`,
            },
            {
              id: 'art-83',
              number: '83',
              title: 'Formal non-compliance',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['enforcement', 'non-compliance', 'formal', 'CE-marking', 'documentation'],
              applicabilityDate: '2 August 2026',
              text: `1. Where the market surveillance authority of a Member State makes one of the following findings, it shall require the relevant provider to put an end to the non-compliance concerned:
(a) the CE marking has been affixed in violation of Article 48;
(b) the CE marking has not been affixed;
(c) the EU declaration of conformity has not been drawn up;
(d) the EU declaration of conformity has not been drawn up correctly;
(e) the identification number of the notified body, which is involved in the conformity assessment procedure pursuant to Article 43, has not been affixed;
(f) technical documentation is not available or not complete.

2. Where the non-compliance referred to in paragraph 1 persists, the Member State concerned shall take all appropriate measures to restrict or prohibit the high-risk AI system being made available on the market or ensure that it is recalled or withdrawn from the market.`,
            },
            {
              id: 'art-84',
              number: '84',
              title: 'Union AI testing support structures',
              chapterId: 'ch-9',
              sectionId: 'ch9-s3',
              tags: ['testing', 'enforcement', 'support', 'infrastructure', 'AI-Office'],
              applicabilityDate: '2 August 2026',
              text: `1. The Commission shall designate one or more Union AI testing support structures to perform the technical testing of AI systems in accordance with this Regulation.

2. The Union AI testing support structures designated pursuant to paragraph 1 shall have adequate resources, including technical equipment and software tools, and the scientific and technical expertise to properly perform their tasks.

3. When carrying out tasks referred to in this Article, the Union AI testing support structures shall comply with all confidentiality requirements set out in Article 78.

4. The Commission shall make available the Union AI testing support structures to national market surveillance authorities, notified bodies, and other relevant entities.`,
            },
          ],
        },
        {
          id: 'ch9-s4',
          title: 'Section 4 — Remedies',
          articles: [
            {
              id: 'art-85',
              number: '85',
              title: 'Right to lodge a complaint with a market surveillance authority',
              chapterId: 'ch-9',
              sectionId: 'ch9-s4',
              tags: ['remedies', 'complaint', 'market-surveillance', 'rights', 'affected-persons'],
              applicabilityDate: '2 August 2026',
              text: `1. Without prejudice to other administrative or judicial remedies, any natural or legal person having grounds to consider that there has been an infringement of the provisions of this Regulation may submit complaints to the relevant market surveillance authority.

2. In accordance with Regulation (EU) 2019/1020, complaints shall be treated and dealt with in accordance with the procedures and timelines established by each Member State.

3. Market surveillance authorities shall inform the complainant of the status and the outcome of the complaint within a reasonable timeframe.

4. Where the complaint relates to an AI system used by a public authority in the area of law enforcement, border management, or justice, the market surveillance authority shall coordinate with the national supervisory authority.`,
            },
            {
              id: 'art-86',
              number: '86',
              title: 'Right to explanation of individual decision-making',
              chapterId: 'ch-9',
              sectionId: 'ch9-s4',
              tags: ['remedies', 'explainability', 'individual-rights', 'high-risk', 'transparency'],
              applicabilityDate: '2 August 2026',
              text: `1. Any affected person subject to a decision which is taken by the deployer on the basis of the output from a high-risk AI system listed in Annex III, and which produces legal effects or similarly significantly affects that person in a way that they consider to have an adverse impact on their health, safety or fundamental rights, shall have the right to obtain from the deployer clear and meaningful explanations of the role of the AI system in the decision-making procedure and the main elements of the decision taken.

2. The deployer shall provide a clear and meaningful explanation to the person concerned. Such explanation shall cover the main elements of the decision taken and provide information on the human oversight referred to in Article 14. The explanation shall be easy to understand.

3. The obligation laid down in paragraphs 1 and 2 shall not apply to the use of AI systems for which exceptions from, or restrictions to, the obligation to provide information exist pursuant to Union or national law, apply.

4. This Article shall not affect rights and obligations laid down in Regulation (EU) 2016/679, including Chapter III thereof.`,
            },
            {
              id: 'art-87',
              number: '87',
              title: 'Reporting of infringements and protection of reporting persons',
              chapterId: 'ch-9',
              sectionId: 'ch9-s4',
              tags: ['remedies', 'whistleblower', 'reporting', 'infringements', 'protection'],
              applicabilityDate: '2 August 2026',
              text: `Directive (EU) 2019/1937 of the European Parliament and of the Council shall apply to the reporting of infringements of this Regulation and the protection of persons reporting such infringements.`,
            },
          ],
        },
        {
          id: 'ch9-s5',
          title: 'Section 5 — Supervision, investigation, enforcement and monitoring in respect of providers of general-purpose AI models',
          articles: [
            {
              id: 'art-88',
              number: '88',
              title: 'Enforcement of the obligations of providers of general-purpose AI models',
              chapterId: 'ch-9',
              sectionId: 'ch9-s5',
              tags: ['GPAI', 'enforcement', 'AI-Office', 'obligations', 'compliance'],
              applicabilityDate: '2 August 2025',
              text: `1. The Commission shall have exclusive powers to supervise and enforce Chapter V related to general-purpose AI models, without prejudice to the powers of market surveillance authorities and national competent authorities under this Regulation.

2. The powers of the Commission under this Article shall be without prejudice to existing competences and powers in matters of competition law, in particular Articles 101 and 102 TFEU and Council Regulation (EC) No 1/2003.

3. For the purposes of this Chapter, the Commission shall have the power to:
(a) request providers of general-purpose AI models to provide any documentation, data, or other information for the performance of its duties;
(b) carry out evaluations of general-purpose AI models;
(c) request providers to take adequate corrective action to remedy a serious incident or other non-compliance with Chapter V.`,
            },
            {
              id: 'art-89',
              number: '89',
              title: 'Alerts of systemic risks by the scientific panel',
              chapterId: 'ch-9',
              sectionId: 'ch9-s5',
              tags: ['GPAI', 'systemic-risk', 'scientific-panel', 'alerts', 'AI-Office'],
              applicabilityDate: '2 August 2025',
              text: `1. The scientific panel may provide a qualified alert to the AI Office where it has reason to believe that:
(a) a general-purpose AI model poses concrete identifiable risk at Union level; or
(b) a general-purpose AI model meets the conditions referred to in Article 51.

2. Upon such a qualified alert, the AI Office may, through the AI Office, and after having given the provider of the general-purpose AI model the opportunity to submit its views, recommend that the model be classified as a general-purpose AI model with systemic risk.

3. The AI Board may, based on information provided by the AI Office, notify the Commission of models that may qualify as general-purpose AI models with systemic risk pursuant to Article 51.

4. Upon notification by the AI Office of a qualified alert, the Commission may request additional technical assessments from the scientific panel or other experts, and may initiate the classification procedure referred to in Article 52.`,
            },
            {
              id: 'art-90',
              number: '90',
              title: 'Powers of the Commission to request information and to conduct evaluations',
              chapterId: 'ch-9',
              sectionId: 'ch9-s5',
              tags: ['GPAI', 'Commission', 'information', 'evaluation', 'enforcement'],
              applicabilityDate: '2 August 2025',
              text: `1. For the purpose of carrying out its tasks under this Chapter, the Commission may, by simple request or by decision, require providers of general-purpose AI models or persons acting on behalf of those providers and other persons subject to this Regulation to provide all the information that is necessary.

2. Before sending a request for information, the AI Office may carry out all necessary preparatory investigations, including by requesting technical assistance from experts and by contacting the provider.

3. The Commission may also conduct evaluations of general-purpose AI models on its own initiative to:
(a) assess the compliance with this Regulation where the Commission has obtained information suggesting potential non-compliance with Chapter V;
(b) investigate systemic risks of general-purpose AI models with systemic risk at Union level, including following a qualified alert from the scientific panel.

4. Evaluations shall be carried out by the AI Office. The AI Office shall complete such evaluations within a reasonable timeframe, unless the complexity of the matter requires a longer period.`,
            },
            {
              id: 'art-91',
              number: '91',
              title: 'Power to request measures, to issue decisions finding non-compliance and to order emergency action',
              chapterId: 'ch-9',
              sectionId: 'ch9-s5',
              tags: ['GPAI', 'enforcement', 'non-compliance', 'Commission', 'corrective-action'],
              applicabilityDate: '2 August 2025',
              text: `1. Where the Commission finds that a provider of a general-purpose AI model has infringed this Regulation, in particular obligations set out in Chapter V, the Commission may take the following actions:
(a) request the provider to take specific corrective actions within a specific timeframe;
(b) impose periodic penalty payments pursuant to Article 101 of this Regulation;
(c) adopt an interim measure to avoid the risk of serious, irreparable harm.

2. Where necessary to avoid serious, irreparable harm to fundamental rights or to the safety of persons, the Commission may, without prior notice or consultation, request the provider to take urgent corrective action.

3. Where the Commission finds that an interim measure is no longer necessary, it shall lift it. Where a provider against which an interim measure is taken does not comply, the Commission may impose a fine pursuant to Article 101.`,
            },
            {
              id: 'art-92',
              number: '92',
              title: 'Ancillary provisions on enforcement actions by the Commission regarding general-purpose AI models',
              chapterId: 'ch-9',
              sectionId: 'ch9-s5',
              tags: ['GPAI', 'enforcement', 'procedure', 'rights-of-defence', 'Commission'],
              applicabilityDate: '2 August 2025',
              text: `1. Before taking any enforcement action regarding a general-purpose AI model, the Commission shall give the provider an opportunity to be heard.

2. The Commission shall notify the provider of its preliminary findings. The provider shall have the right to reply and to submit documents and evidence.

3. Where the Commission determines, after allowing the provider the opportunity to be heard, that a provider has infringed this Regulation, it may take the enforcement actions referred to in Article 91.

4. Any enforcement action taken by the Commission shall be proportionate to the seriousness of the infringement.

5. The Commission shall publish its decisions on infringements and on the measures taken, subject to the confidentiality requirements of Article 78.`,
            },
            {
              id: 'art-93',
              number: '93',
              title: 'Monitoring actions',
              chapterId: 'ch-9',
              sectionId: 'ch9-s5',
              tags: ['GPAI', 'monitoring', 'AI-Office', 'ongoing-compliance'],
              applicabilityDate: '2 August 2025',
              text: `1. For the purposes of this Regulation, the Commission may take actions to monitor the effective implementation and compliance with the obligations laid down in this Regulation with regard to general-purpose AI models.

2. The Commission shall regularly report to the Board and may, at any time, request that providers provide access to information and systems to permit evaluation in real time.

3. Member States' national competent authorities shall cooperate and provide information to support the Commission's monitoring activities under this Article.`,
            },
            {
              id: 'art-94',
              number: '94',
              title: 'Procedure in the case of specific restriction for model accessibility',
              chapterId: 'ch-9',
              sectionId: 'ch9-s5',
              tags: ['GPAI', 'access', 'restriction', 'enforcement', 'open-source'],
              applicabilityDate: '2 August 2025',
              text: `1. In the case of a specific restriction for model accessibility to third parties, including downstream deployers, where there are sufficient grounds to consider that the restriction is not in accordance with this Regulation, the Commission may, on its own initiative, request the provider to remove the restriction and to make the model accessible.

2. The Commission shall assess whether the measure requested under paragraph 1 is proportionate and may grant the provider a reasonable period to comply. The Commission shall provide the provider with the opportunity to be heard before any decision restricting access is formally communicated.

3. The Commission shall make the outcome of its assessment available to the AI Office and the AI Board.`,
            },
          ],
        },
      ],
    },
    {
      id: 'ch-10',
      number: 'X',
      title: 'Codes of Conduct and Guidelines',
      articles: [
        {
          id: 'art-95',
          number: '95',
          title: 'Codes of conduct for voluntary application of specific requirements',
          chapterId: 'ch-10',
          tags: ['codes-of-conduct', 'voluntary', 'non-high-risk', 'self-regulation', 'trustworthy-AI'],
          applicabilityDate: '2 August 2026',
          text: `1. The AI Office and the Member States shall encourage and facilitate the drawing up of codes of conduct, including related governance mechanisms, intended to foster the voluntary application to AI systems, other than high-risk AI systems, of some or all of the requirements set out in Chapter III, Section 2, taking into account the available technical solutions and industry best practices allowing for the application of such requirements.

2. The AI Office and the Member States shall facilitate the drawing up of codes of conduct concerning the voluntary application, including by deployers, of specific requirements to all AI systems, on the basis of clear objectives and key performance indicators to measure the achievement of those objectives.

3. Codes of conduct may be drawn up by individual providers or deployers of AI systems, their respective associations, or both, including with the involvement of any interested parties and their representative organisations, consumer organisations, academia, or civil society. Codes of conduct may cover one or more AI systems taking into account the similarity of the intended purpose of the relevant systems.

4. The AI Office and the Member States shall take into account the specific interests and needs of SMEs, including start-ups, when encouraging and facilitating the drawing up of codes of conduct.`,
        },
        {
          id: 'art-96',
          number: '96',
          title: 'Guidelines from the Commission on the implementation of this Regulation',
          chapterId: 'ch-10',
          tags: ['guidelines', 'Commission', 'implementation', 'clarification'],
          applicabilityDate: '2 August 2026',
          text: `1. The Commission shall issue guidelines on the practical implementation of this Regulation, and in particular on:
(a) the application of the requirements and obligations referred to in Articles 8 to 15 and Article 25;
(b) the prohibited AI practices referred to in Article 5;
(c) the practical implementation of the provisions related to substantial modification;
(d) the practical implementation of transparency obligations laid down in Article 50;
(e) the practical implementation of this Regulation for specific sectors or specific types of AI systems;
(f) the relationship between this Regulation and the Union law listed in Annex I.

2. When issuing the guidelines referred to in paragraph 1, the Commission shall pay particular attention to the needs of SMEs, including start-ups.

3. The Commission shall issue the guidelines referred to in this Article at the latest by 2 August 2025. The Commission shall update those guidelines as appropriate.`,
        },
      ],
    },
    {
      id: 'ch-11',
      number: 'XI',
      title: 'Delegation of Power and Committee Procedure',
      articles: [
        {
          id: 'art-97',
          number: '97',
          title: 'Exercise of the delegation',
          chapterId: 'ch-11',
          tags: ['delegation', 'delegated-acts', 'Commission', 'legislative-procedure'],
          applicabilityDate: '2 August 2024',
          text: `1. The power to adopt delegated acts is conferred on the Commission subject to the conditions laid down in this Article.

2. The power to adopt delegated acts referred to in Articles 6(6), 7(1) and (3), 11(3), 43(5) and (6), 47(5), 51(4), 52(4) and 53(5) shall be conferred on the Commission for a period of five years from the date of entry into force of this Regulation. The Commission shall draw up a report in respect of the delegation of power not later than nine months before the end of the five-year period. The delegation of power shall be tacitly extended for periods of an identical duration, unless the European Parliament or the Council opposes such extension not later than three months before the end of each period.

3. The delegation of power referred to in paragraph 2 may be revoked at any time by the European Parliament or by the Council. A decision to revoke shall put an end to the delegation of the power specified in that decision. It shall take effect the day following the publication of the decision in the Official Journal of the European Union or at a later date specified therein. It shall not affect the validity of any delegated acts already in force.

4. Before adopting a delegated act, the Commission shall consult experts designated by each Member State in accordance with the principles laid down in the Interinstitutional Agreement of 13 April 2016 on Better Law-Making.

5. As soon as it adopts a delegated act, the Commission shall notify it simultaneously to the European Parliament and to the Council.

6. A delegated act adopted pursuant to Articles 6(6), 7(1) and (3), 11(3), 43(5) and (6), 47(5), 51(4), 52(4) and 53(5) shall enter into force only if no objection has been expressed either by the European Parliament or the Council within a period of three months of notification of that act to the European Parliament and the Council or if, before the expiry of that period, the European Parliament and the Council have both informed the Commission that they will not object. That period shall be extended by three months at the initiative of the European Parliament or of the Council.`,
        },
        {
          id: 'art-98',
          number: '98',
          title: 'Committee procedure',
          chapterId: 'ch-11',
          tags: ['committee', 'implementing-acts', 'procedure', 'legislative'],
          applicabilityDate: '2 August 2024',
          text: `1. The Commission shall be assisted by a committee. That committee shall be a committee within the meaning of Regulation (EU) No 182/2011.

2. Where reference is made to this paragraph, Article 5 of Regulation (EU) No 182/2011 shall apply.

3. Where the committee delivers no opinion, the Commission shall not adopt the draft implementing act and the third subparagraph of Article 5(4) of Regulation (EU) No 182/2011 shall apply.`,
        },
      ],
    },
    {
      id: 'ch-12',
      number: 'XII',
      title: 'Penalties',
      articles: [
        {
          id: 'art-99',
          number: '99',
          title: 'Penalties',
          chapterId: 'ch-12',
          tags: ['penalties', 'fines', 'enforcement', 'prohibited', 'high-risk', 'SME'],
          applicabilityDate: '2 August 2026',
          text: `1. In accordance with the terms and conditions laid down in this Regulation, Member States shall lay down the rules on penalties, including administrative fines, applicable to infringements of this Regulation and shall take all measures necessary to ensure that they are properly and effectively implemented. The penalties provided for shall be effective, proportionate, and dissuasive.

2. Member States shall notify those rules and measures to the Commission by 2 August 2025 and shall notify it, without delay, of any subsequent amendment affecting them.

3. The following infringements shall be subject to administrative fines of up to EUR 35 000 000 or, if the offender is an undertaking, up to 7% of its total worldwide annual turnover for the preceding financial year, whichever is higher:
(a) non-compliance with the prohibition of the AI practices referred to in Article 5;
(b) non-compliance of the general-purpose AI model with systemic risk with the obligations pursuant to Article 55.

4. The following infringements shall be subject to administrative fines of up to EUR 15 000 000 or, if the offender is an undertaking, up to 3% of its total worldwide annual turnover for the preceding financial year, whichever is higher:
(a) non-compliance of the AI system with the requirements and obligations referred to in Articles 8 to 15 or Articles 25, 26 or 27, or failure to comply with the obligations referred to in Articles 16 to 24 (with the exception of Article 22) or Article 28, 29, 33, 38, 45, 46 or 47;
(b) non-compliance of the general-purpose AI model with the obligations pursuant to Article 53 or 54;
(c) failure by notified bodies to fulfil the obligations under this Regulation;
(d) failure to notify compliance within the time limits specified by competent authorities.

5. The following infringements shall be subject to administrative fines of up to EUR 7 500 000 or, if the offender is an undertaking, up to 1,5% of its total worldwide annual turnover for the preceding financial year, whichever is higher:
(a) non-compliance with the obligation to supply correct, complete, and non-misleading information to notified bodies, national competent authorities, the AI Office or the Commission.

6. In deciding whether to impose an administrative fine and in deciding on the amount of the administrative fine in each individual case, all relevant circumstances of the specific situation shall be taken into account and due regard shall be given to the following:
(a) the nature, gravity and duration of the infringement and of its consequences;
(b) whether administrative fines have been imposed by other market surveillance authorities on the same operator for the same infringement;
(c) the size and market share of the operator committing the infringement, in particular with regard to SMEs including start-ups;
(d) whether an infringement was intentional or the result of negligence;
(e) actions taken by the operator to mitigate the harm suffered by affected persons;
(f) the degree of cooperation with the national competent authorities, in order to remedy the infringement and mitigate the possible adverse effects of the infringement;
(g) the degree of responsibility of the operator taking into account the technical and organisational measures implemented by it;
(h) the manner in which the infringement became known to the national competent authority, in particular whether, and if so to what extent, the operator notified the infringement.

7. Each Member State shall lay down rules on whether and to what extent administrative fines may be imposed on public authorities and bodies established in that Member State.

8. Depending on the legal system of the Member States, the rules on administrative fines may be applied in such a way that the fines are imposed by competent national courts or by other bodies, as applicable in those Member States. The application of such rules in those Member States shall have an equivalent effect.`,
        },
        {
          id: 'art-100',
          number: '100',
          title: 'Administrative fines on Union institutions, bodies, offices and agencies',
          chapterId: 'ch-12',
          tags: ['penalties', 'fines', 'EU-institutions', 'enforcement', 'EDPS'],
          applicabilityDate: '2 August 2026',
          text: `1. The European Data Protection Supervisor may impose administrative fines on Union institutions, bodies, offices and agencies falling within the scope of this Regulation. When deciding whether to impose an administrative fine and deciding on the amount of the administrative fine in each individual case, all relevant circumstances of the specific situation shall be taken into account.

2. The fines referred to in paragraph 1 shall be effective, proportionate and dissuasive. The maximum amounts shall be:
(a) EUR 1 500 000 for non-compliance with the prohibition of the AI practices referred to in Article 5 or with the obligations pursuant to Article 55;
(b) EUR 750 000 for non-compliance with any other requirement or obligation under this Regulation.

3. Before taking a decision pursuant to paragraph 1, the European Data Protection Supervisor shall give the Union institution, body, office or agency concerned an opportunity to be heard regarding the matter.

4. The decisions of the European Data Protection Supervisor shall be subject to review by the Court of Justice of the European Union.`,
        },
        {
          id: 'art-101',
          number: '101',
          title: 'Fines for providers of general-purpose AI models',
          chapterId: 'ch-12',
          tags: ['penalties', 'fines', 'GPAI', 'Commission', 'enforcement'],
          applicabilityDate: '2 August 2025',
          text: `1. The Commission may impose fines on providers of general-purpose AI models where it finds that the provider, intentionally or negligently:
(a) has infringed the relevant provisions of this Regulation, including the obligations set out in Articles 53, 54 and 55;
(b) has supplied incorrect, incomplete or misleading information to the Commission;
(c) has failed to supply information requested by the Commission within the time limits set;
(d) has failed to submit to an evaluation ordered pursuant to Article 90(2);
(e) has failed to comply with the measures ordered pursuant to Article 91.

2. The fines imposed shall not exceed:
(a) 3% of the provider's total worldwide annual turnover in the preceding business year or EUR 15 000 000, whichever is higher, in the case of infringement of the obligations of this Regulation;
(b) 1% of the provider's total worldwide annual turnover in the preceding business year or EUR 7 500 000, whichever is higher, in the case of the supply of incorrect, incomplete or misleading information.

3. Where the same provider has repeatedly infringed this Regulation, the Commission may impose a periodic penalty payment. The periodic penalty payment shall not exceed 3% of its average daily turnover in the preceding business year for each day of non-compliance with the measure referred to in Article 91.

4. When deciding on the amount of the fine or periodic penalty payment, the Commission shall take into account the nature, gravity and duration of the infringement, the cooperation with the Commission to remedy the infringement, and any previous infringements by the same provider.`,
        },
      ],
    },
    {
      id: 'ch-13',
      number: 'XIII',
      title: 'Final Provisions',
      articles: [
        {
          id: 'art-102',
          number: '102',
          title: 'Amendment to Regulation (EC) No 300/2008',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'civil-aviation', 'security'],
          applicabilityDate: '2 August 2026',
          text: `In Regulation (EC) No 300/2008 of the European Parliament and of the Council, the following Article is inserted:

"Article 4a — AI systems used for aviation security
Member States shall ensure that AI systems used for the purpose of aviation security screening comply with the applicable requirements of Regulation (EU) 2024/1689 of the European Parliament and of the Council."`,
        },
        {
          id: 'art-103',
          number: '103',
          title: 'Amendment to Regulation (EU) No 167/2013',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'agricultural-vehicles'],
          applicabilityDate: '2 August 2026',
          text: `Regulation (EU) No 167/2013 of the European Parliament and of the Council is amended as follows: In Article 17, the following paragraph is added: "Where AI systems are used as safety components of agricultural and forestry vehicles, those AI systems shall comply with the requirements set out in Chapter III, Section 2 of Regulation (EU) 2024/1689."`,
        },
        {
          id: 'art-104',
          number: '104',
          title: 'Amendment to Regulation (EU) No 168/2013',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'two-three-wheel-vehicles'],
          applicabilityDate: '2 August 2026',
          text: `Regulation (EU) No 168/2013 of the European Parliament and of the Council is amended to ensure that AI systems used as safety components of two- or three-wheel vehicles and quadricycles comply with the applicable requirements of Regulation (EU) 2024/1689.`,
        },
        {
          id: 'art-105',
          number: '105',
          title: 'Amendment to Directive 2014/90/EU',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'marine-equipment'],
          applicabilityDate: '2 August 2026',
          text: `Directive 2014/90/EU of the European Parliament and of the Council is amended to ensure alignment with the requirements for AI systems that constitute safety components of marine equipment, in accordance with Chapter III, Section 2 of Regulation (EU) 2024/1689.`,
        },
        {
          id: 'art-106',
          number: '106',
          title: 'Amendment to Directive (EU) 2016/797',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'railway'],
          applicabilityDate: '2 August 2026',
          text: `Directive (EU) 2016/797 of the European Parliament and of the Council on the interoperability of the rail system within the European Union is amended to include alignment with the AI Act requirements for AI systems used as safety components in the railway sector.`,
        },
        {
          id: 'art-107',
          number: '107',
          title: 'Amendment to Regulation (EU) 2018/858',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'motor-vehicles'],
          applicabilityDate: '2 August 2026',
          text: `Regulation (EU) 2018/858 of the European Parliament and of the Council on the approval and market surveillance of motor vehicles and their trailers, and of systems, components and separate technical units intended for such vehicles is amended to ensure that AI systems used as safety components in motor vehicles comply with the requirements of Chapter III, Section 2 of Regulation (EU) 2024/1689.`,
        },
        {
          id: 'art-108',
          number: '108',
          title: 'Amendment to Regulation (EU) 2018/1139',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'aviation', 'EASA'],
          applicabilityDate: '2 August 2026',
          text: `Regulation (EU) 2018/1139 of the European Parliament and of the Council on common rules in the field of civil aviation and establishing a European Union Aviation Safety Agency is amended to align the existing aviation safety framework with the requirements set out in Regulation (EU) 2024/1689 for AI systems used in civil aviation safety.`,
        },
        {
          id: 'art-109',
          number: '109',
          title: 'Amendment to Regulation (EU) 2019/2144',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'vehicle-safety', 'type-approval'],
          applicabilityDate: '2 August 2026',
          text: `Regulation (EU) 2019/2144 of the European Parliament and of the Council on type-approval requirements for motor vehicles and their trailers, and systems, components and separate technical units, as regards their general safety, is amended to include a reference to AI systems used as safety components, requiring compliance with the applicable requirements of Regulation (EU) 2024/1689.`,
        },
        {
          id: 'art-110',
          number: '110',
          title: 'Amendment to Regulation (EU) 2020/1056',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'amendments', 'electronic-freight-transport'],
          applicabilityDate: '2 August 2026',
          text: `Regulation (EU) 2020/1056 of the European Parliament and of the Council on electronic freight transport information is amended to include alignment with the requirements of the AI Act for AI systems used in electronic freight transport information systems.`,
        },
        {
          id: 'art-111',
          number: '111',
          title: 'Transitional provisions',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'transitional', 'implementation', 'timeline', 'legacy-systems'],
          applicabilityDate: '2 August 2024',
          text: `1. This Regulation shall not apply to AI systems which are components of the large-scale IT systems established by the legal acts listed in Annex X until 31 December 2030, to the extent those AI systems are used for the purpose of those systems.

2. This Regulation shall not apply to AI systems that have been placed on the market or put into service before 2 August 2026, unless those systems are subject to significant changes in their design or intended purpose after that date.

3. Providers that have placed high-risk AI systems on the market or put them into service before 2 August 2026 shall comply with the requirements of this Regulation by 2 August 2027.

4. By way of derogation from paragraphs 2 and 3, this Regulation shall apply from 2 August 2026 to AI systems listed in Annex III, points 1, 2, 3, 4, 5, 6, and 7, where those systems are placed on the market or put into service after 2 August 2026.

5. AI systems that are components of large-scale IT systems established by the legal acts listed in Annex X that have been placed on the market or put into service before 31 December 2030 shall comply with this Regulation by 31 December 2030.

6. Providers and deployers of high-risk AI systems referred to in Annex III, point 1, that are already in use for the purpose of biometric identification of persons by law enforcement, border management, asylum or judicial cooperation shall comply with this Regulation by 2 August 2030.

7. The obligations set out in this Regulation related to GPAI models shall apply from 2 August 2025 in accordance with Article 113(3).`,
        },
        {
          id: 'art-112',
          number: '112',
          title: 'Evaluation and review',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'evaluation', 'review', 'Commission', 'reporting'],
          applicabilityDate: '2 August 2024',
          text: `1. The Commission shall carry out a periodic evaluation of this Regulation. The first evaluation shall be submitted to the European Parliament and to the Council by 2 August 2029 and every four years thereafter. The evaluation shall address the following:
(a) the need to amend the list of high-risk AI systems as set out in Annex III;
(b) the need to amend the list in Annex I;
(c) the need to update Articles 5 and 6;
(d) the scope of this Regulation, as regards AI systems excluded from the scope of this Regulation;
(e) the application of this Regulation to providers of general-purpose AI models;
(f) the appropriateness of the FLOPs threshold as set out in Article 51(2);
(g) the functioning and effectiveness of the AI regulatory sandboxes and measures to support innovation;
(h) the impact of this Regulation on the competitiveness of the Union's AI industry;
(i) the need to update Annexes I and III in light of technological developments.

2. Based on the evaluation referred to in paragraph 1, and in view of the objectives of this Regulation, the Commission shall assess the appropriateness of submitting a proposal to amend this Regulation.

3. The Commission shall evaluate and report to the European Parliament and to the Council on the state of enforcement of this Regulation, in cooperation with the AI Office and the Member States.`,
        },
        {
          id: 'art-113',
          number: '113',
          title: 'Entry into force and application',
          chapterId: 'ch-13',
          tags: ['final-provisions', 'entry-into-force', 'application-date', 'timeline', 'implementation'],
          applicabilityDate: '2 August 2024',
          text: `1. This Regulation shall enter into force on the twentieth day following that of its publication in the Official Journal of the European Union.

2. This Regulation shall apply from 2 August 2026.

3. However, the following shall apply from 2 February 2025:
(a) Chapter I (General Provisions) and Chapter II (Prohibited AI practices);
(b) Chapter III, Section 4 (Notifying authorities and notified bodies), except for Articles 28, 30, 31, 32, 33, 34 and 39;
(c) Chapter V (General-purpose AI models), Section 1 and Section 4;
(d) Chapter VII (Governance);
(e) Chapter XII (Penalties).

4. The following shall apply from 2 August 2025:
(a) Chapter V (General-purpose AI models) in full, including Sections 2, 3 and 4;
(b) Article 70(2) (notification of national competent authorities);
(c) Article 96 (guidelines from the Commission).

5. The following shall apply from 2 August 2027:
(a) High-risk AI systems listed in Section A of Annex I as safety components of products covered by Union harmonisation legislation shall comply with this Regulation by 2 August 2027.

6. By 2 August 2026, Member States shall have designated or established at least one national competent authority, notified the Commission of the designation of national competent authorities, and ensured that AI regulatory sandboxes are operational.

This Regulation shall be binding in its entirety and directly applicable in all Member States.

Done at Brussels, 13 June 2024.

For the European Parliament: The President
For the Council: The President`,
        },
      ],
    },
  ],
}
