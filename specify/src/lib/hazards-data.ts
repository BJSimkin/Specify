// Auto-generated from AI_Hazards_Controls_DB.xlsx — do not edit manually

export interface Hazard {
  id: string
  type: string | null
  name: string
}

export interface Control {
  id: string
  attribute: string | null
  concept: string | null
  module: string | null
  component: string | null
}

export interface HazardControlMapping {
  hazardId: string
  controlId: string
}

export const HAZARDS: Hazard[] = [
  {
    "id": "H001",
    "type": "Adversarial attacks",
    "name": "Adversarial patch attacks"
  },
  {
    "id": "H003",
    "type": "Cognitive bias",
    "name": "Automation bias"
  },
  {
    "id": "H004",
    "type": "Cognitive bias",
    "name": "Confirmation bias"
  },
  {
    "id": "H005",
    "type": "Cognitive bias",
    "name": "Label bias"
  },
  {
    "id": "H006",
    "type": "Cognitive bias",
    "name": "Selection bias"
  },
  {
    "id": "H007",
    "type": "Computational resource",
    "name": "Compute resource limitations"
  },
  {
    "id": "H008",
    "type": "Computational resource",
    "name": "High query costs"
  },
  {
    "id": "H009",
    "type": "Computational resource",
    "name": "Large datasets required"
  },
  {
    "id": "H010",
    "type": "Computational resource",
    "name": "Scalable model architecture"
  },
  {
    "id": "H012",
    "type": "Data quality issues",
    "name": "Coverage bias"
  },
  {
    "id": "H013",
    "type": "Data quality issues",
    "name": "Data entry mistakes"
  },
  {
    "id": "H014",
    "type": "Data quality issues",
    "name": "Data loss"
  },
  {
    "id": "H015",
    "type": "Data quality issues",
    "name": "Data noise"
  },
  {
    "id": "H016",
    "type": "Data quality issues",
    "name": "Feature scaling issues"
  },
  {
    "id": "H017",
    "type": "Data quality issues",
    "name": "Imbalanced data"
  },
  {
    "id": "H018",
    "type": "Data quality issues",
    "name": "Incomplete data"
  },
  {
    "id": "H019",
    "type": "Data quality issues",
    "name": "Inconsistent data"
  },
  {
    "id": "H020",
    "type": "Data quality issues",
    "name": "Invalid data"
  },
  {
    "id": "H021",
    "type": "Data quality issues",
    "name": "Measurement bias"
  },
  {
    "id": "H022",
    "type": "Data quality issues",
    "name": "Natural variations in the data"
  },
  {
    "id": "H023",
    "type": "Data quality issues",
    "name": "Negative data samples"
  },
  {
    "id": "H024",
    "type": "Data quality issues",
    "name": "Omissions bias"
  },
  {
    "id": "H025",
    "type": "Data quality issues",
    "name": "Outliers"
  },
  {
    "id": "H026",
    "type": "Data quality issues",
    "name": "Recency bias"
  },
  {
    "id": "H027",
    "type": "Data quality issues",
    "name": "Reporting bias"
  },
  {
    "id": "H028",
    "type": "Data quality issues",
    "name": "Sensitive to data quality"
  },
  {
    "id": "H029",
    "type": "Data quality issues",
    "name": "Sensitive to the quality of prior knowledge"
  },
  {
    "id": "H030",
    "type": "Data quality issues",
    "name": "Transmission issues"
  },
  {
    "id": "H032",
    "type": "Distribution shift",
    "name": "Data shift"
  },
  {
    "id": "H033",
    "type": "Distribution shift",
    "name": "Model shift"
  },
  {
    "id": "H035",
    "type": "Epistemic uncertainty",
    "name": "Sensor inaccuracies"
  },
  {
    "id": "H036",
    "type": "Evasion attacks",
    "name": "Black-box attacks"
  },
  {
    "id": "H037",
    "type": "Evasion attacks",
    "name": "False authentication methods"
  },
  {
    "id": "H038",
    "type": "Evasion attacks",
    "name": "White-box attacks"
  },
  {
    "id": "H040",
    "type": "Exploitation attacks",
    "name": "Server-side request forgery"
  },
  {
    "id": "H041",
    "type": "Functional insufficiencies",
    "name": "Difficult to detect novel anomalies"
  },
  {
    "id": "H042",
    "type": "Functional insufficiencies",
    "name": "Difficult with complex concepts"
  },
  {
    "id": "H043",
    "type": "Functional insufficiencies",
    "name": "Incorrect identification of anomalies"
  },
  {
    "id": "H044",
    "type": "Functional insufficiencies",
    "name": "Inefficient hyperparameters"
  },
  {
    "id": "H045",
    "type": "Functional insufficiencies",
    "name": "Lack of versatility"
  },
  {
    "id": "H046",
    "type": "Functional insufficiencies",
    "name": "Limited flexibility"
  },
  {
    "id": "H047",
    "type": "Functional insufficiencies",
    "name": "Limited to linear or stationary relationships"
  },
  {
    "id": "H048",
    "type": "Functional insufficiencies",
    "name": "Low accessibility"
  },
  {
    "id": "H049",
    "type": "Functional insufficiencies",
    "name": "Misaligned objectives"
  },
  {
    "id": "H050",
    "type": "Functional insufficiencies",
    "name": "Overly complex model"
  },
  {
    "id": "H051",
    "type": "Functional insufficiencies",
    "name": "Poor performance on high-dimensional data"
  },
  {
    "id": "H052",
    "type": "Functional insufficiencies",
    "name": "Prediction accuracy degrades for longer forecast horizons"
  },
  {
    "id": "H053",
    "type": "Functional insufficiencies",
    "name": "Wrong number of clusters"
  },
  {
    "id": "H055",
    "type": "Generalisation issues",
    "name": "Catastrophic forgetting"
  },
  {
    "id": "H057",
    "type": "Hardware limitations",
    "name": "Heat generation"
  },
  {
    "id": "H058",
    "type": "Hardware limitations",
    "name": "Reliance on network connectivity"
  },
  {
    "id": "H059",
    "type": "Hardware limitations",
    "name": "Single point faults"
  },
  {
    "id": "H060",
    "type": "Inference attacks",
    "name": "Attribution inference"
  },
  {
    "id": "H061",
    "type": "Inference attacks",
    "name": "Membership inference attacks"
  },
  {
    "id": "H062",
    "type": "Inference attacks",
    "name": "Reconstruction attacks"
  },
  {
    "id": "H063",
    "type": "Insufficient knowledge",
    "name": "Lack of contextual information"
  },
  {
    "id": "H064",
    "type": "Insufficient knowledge",
    "name": "Lack of ground truth"
  },
  {
    "id": "H065",
    "type": "Insufficient knowledge",
    "name": "Missing contextual information"
  },
  {
    "id": "H066",
    "type": "Lack of transparency",
    "name": "High quality AI content"
  },
  {
    "id": "H067",
    "type": "Lack of transparency",
    "name": "Lack of explanations"
  },
  {
    "id": "H068",
    "type": "Lack of transparency",
    "name": "Less interpretable data"
  },
  {
    "id": "H069",
    "type": "Lack of transparency",
    "name": "Misinterpretation of output"
  },
  {
    "id": "H070",
    "type": "Model instability",
    "name": "Converging difficulties"
  },
  {
    "id": "H071",
    "type": "Model instability",
    "name": "Exploding gradients"
  },
  {
    "id": "H072",
    "type": "Model instability",
    "name": "Model inconsistency"
  },
  {
    "id": "H073",
    "type": "Model instability",
    "name": "Non-deterministic behaviour"
  },
  {
    "id": "H074",
    "type": "Model instability",
    "name": "Overshooting minimum"
  },
  {
    "id": "H075",
    "type": "Model instability",
    "name": "Sensitive to hyperparameters"
  },
  {
    "id": "H076",
    "type": "Model instability",
    "name": "Vanishing gradients"
  },
  {
    "id": "H077",
    "type": "Model instability",
    "name": "Vanishing or exploding gradients"
  },
  {
    "id": "H079",
    "type": "Operational hazards",
    "name": "Lack of accountability"
  },
  {
    "id": "H080",
    "type": "Operational hazards",
    "name": "Scaling difficulties"
  },
  {
    "id": "H081",
    "type": "Operational hazards",
    "name": "Significant upfront investment"
  },
  {
    "id": "H082",
    "type": "Operational hazards",
    "name": "Supplier lock in"
  },
  {
    "id": "H083",
    "type": "Performance insufficiency",
    "name": "Model error"
  },
  {
    "id": "H084",
    "type": "Performance insufficiency",
    "name": "Overfitting"
  },
  {
    "id": "H086",
    "type": "Poisoning attack",
    "name": "Data poisoning"
  },
  {
    "id": "H088",
    "type": "Privacy violation",
    "name": "Unlawful processing"
  },
  {
    "id": "H089",
    "type": "Privacy violation",
    "name": "Violating Intellectual property rights"
  },
  {
    "id": "H090",
    "type": "Resource limitations",
    "name": "Computational scalability"
  },
  {
    "id": "H091",
    "type": "Resource limitations",
    "name": "Compute resource limitations"
  },
  {
    "id": "H092",
    "type": "Social and behavioral hazards",
    "name": "Disinformation"
  },
  {
    "id": "H093",
    "type": "Social and behavioral hazards",
    "name": "Job simplification / displacement"
  },
  {
    "id": "H094",
    "type": "Social and behavioral hazards",
    "name": "Misinformation"
  },
  {
    "id": "H095",
    "type": "System complexity",
    "name": "Complex infrastructure"
  },
  {
    "id": "H096",
    "type": "System complexity",
    "name": "Complex parameter selection process"
  },
  {
    "id": "H097",
    "type": "System dependencies",
    "name": "Connectivity dependencies"
  },
  {
    "id": "H098",
    "type": "Unfair behaviour",
    "name": "Algorithmic bias"
  },
  {
    "id": "H100",
    "type": "User experience",
    "name": "High latency"
  },
  {
    "id": "H101",
    "type": "User experience",
    "name": "Misleading consumer information"
  },
  {
    "id": "H102",
    "type": "User experience",
    "name": "Misuse"
  }
]

export const CONTROLS: Control[] = [
  {
    "id": "C0001",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "Attribute-based access control",
    "component": "Age verification"
  },
  {
    "id": "C0002",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "Discretionary access control",
    "component": null
  },
  {
    "id": "C0003",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "Role-based access control",
    "component": null
  },
  {
    "id": "C0004",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "User authentication",
    "component": "Digital certificates"
  },
  {
    "id": "C0005",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "User authentication",
    "component": "Hardware identifiers"
  },
  {
    "id": "C0006",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "User authentication",
    "component": "Mutual authentication"
  },
  {
    "id": "C0007",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "User authentication",
    "component": "Two-Factor authentication"
  },
  {
    "id": "C0008",
    "attribute": "AI System",
    "concept": "Access control",
    "module": "User authentication",
    "component": "User credentials"
  },
  {
    "id": "C0009",
    "attribute": "AI System",
    "concept": "Bias detection algorithms",
    "module": "Model bias detection",
    "component": "Fairness aware techniques"
  },
  {
    "id": "C0010",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Automated moderation",
    "component": "AI model self detection"
  },
  {
    "id": "C0011",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Automated moderation",
    "component": "Neural network-based detectors"
  },
  {
    "id": "C0012",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Automated moderation",
    "component": "Retrieval-based detectors"
  },
  {
    "id": "C0013",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Automated moderation",
    "component": "Zero-shot detectors"
  },
  {
    "id": "C0014",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Distributed moderation",
    "component": null
  },
  {
    "id": "C0015",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Post-moderation",
    "component": null
  },
  {
    "id": "C0016",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Pre-moderation",
    "component": null
  },
  {
    "id": "C0017",
    "attribute": "AI System",
    "concept": "Content moderation",
    "module": "Reactive moderation",
    "component": null
  },
  {
    "id": "C0018",
    "attribute": "AI System",
    "concept": "Fail safe",
    "module": "Emergency override",
    "component": "Manual emergency override"
  },
  {
    "id": "C0019",
    "attribute": "AI System",
    "concept": "Human machine interface",
    "module": "User information",
    "component": "Clear method for deactivation"
  },
  {
    "id": "C0020",
    "attribute": "AI System",
    "concept": "Human machine interface",
    "module": "User information",
    "component": "User alerts"
  },
  {
    "id": "C0021",
    "attribute": "AI System",
    "concept": "Human machine interface",
    "module": "User information",
    "component": "User instructions"
  },
  {
    "id": "C0022",
    "attribute": "AI System",
    "concept": "Human machine interface",
    "module": "User interface",
    "component": "Challenge-response protocol"
  },
  {
    "id": "C0023",
    "attribute": "AI System",
    "concept": "Human machine interface",
    "module": "User interface",
    "component": "Response latency"
  },
  {
    "id": "C0024",
    "attribute": "AI System",
    "concept": "In-use monitoring",
    "module": "Data logging",
    "component": null
  },
  {
    "id": "C0025",
    "attribute": "AI System",
    "concept": "In-use monitoring",
    "module": "ODD monitoring",
    "component": null
  },
  {
    "id": "C0026",
    "attribute": "AI System",
    "concept": "In-use monitoring",
    "module": "OOD detection",
    "component": null
  },
  {
    "id": "C0027",
    "attribute": "AI System",
    "concept": "In-use monitoring",
    "module": "System health monitoring",
    "component": null
  },
  {
    "id": "C0028",
    "attribute": "AI System",
    "concept": "Label AI content",
    "module": "Explicit watermark",
    "component": "Auditory watermarks"
  },
  {
    "id": "C0029",
    "attribute": "AI System",
    "concept": "Label AI content",
    "module": "Explicit watermark",
    "component": "Metadata watermarks"
  },
  {
    "id": "C0030",
    "attribute": "AI System",
    "concept": "Label AI content",
    "module": "Explicit watermark",
    "component": "Textual watermarks"
  },
  {
    "id": "C0031",
    "attribute": "AI System",
    "concept": "Label AI content",
    "module": "Explicit watermark",
    "component": "Visual watermarks"
  },
  {
    "id": "C0032",
    "attribute": "AI System",
    "concept": "Oversight",
    "module": "Human-in-the-loop",
    "component": "Human confirmation"
  },
  {
    "id": "C0033",
    "attribute": "AI System",
    "concept": "Oversight",
    "module": "Human-in-the-loop",
    "component": "Human performance monitoring"
  },
  {
    "id": "C0034",
    "attribute": "AI System",
    "concept": "Oversight",
    "module": "Human-in-the-loop",
    "component": "Iterative human feedback"
  },
  {
    "id": "C0035",
    "attribute": "AI System",
    "concept": "Oversight",
    "module": null,
    "component": null
  },
  {
    "id": "C0036",
    "attribute": "AI System",
    "concept": "Regular updates",
    "module": null,
    "component": null
  },
  {
    "id": "C0037",
    "attribute": "AI System",
    "concept": "Workload scheduling",
    "module": null,
    "component": null
  },
  {
    "id": "C0038",
    "attribute": "Data",
    "concept": "Apply domain knowledge",
    "module": "Embed contextual data",
    "component": null
  },
  {
    "id": "C0039",
    "attribute": "Data",
    "concept": "Apply domain knowledge",
    "module": "Fine tuning",
    "component": "Reinforcement learning human feedback"
  },
  {
    "id": "C0040",
    "attribute": "Data",
    "concept": "Apply domain knowledge",
    "module": "Online learning",
    "component": null
  },
  {
    "id": "C0041",
    "attribute": "Data",
    "concept": "Apply domain knowledge",
    "module": null,
    "component": null
  },
  {
    "id": "C0042",
    "attribute": "Data",
    "concept": "Bias detection algorithm",
    "module": "Data bias detection",
    "component": "Label bias detection"
  },
  {
    "id": "C0043",
    "attribute": "Data",
    "concept": "Bias detection algorithm",
    "module": "Data bias detection",
    "component": "Measurement bias detection"
  },
  {
    "id": "C0044",
    "attribute": "Data",
    "concept": "Bias detection algorithm",
    "module": "Data bias detection",
    "component": "Representation bias detection"
  },
  {
    "id": "C0045",
    "attribute": "Data",
    "concept": "Cryptographic protection",
    "module": "Digital signatures",
    "component": null
  },
  {
    "id": "C0046",
    "attribute": "Data",
    "concept": "Cryptographic protection",
    "module": "Encryption",
    "component": null
  },
  {
    "id": "C0047",
    "attribute": "Data",
    "concept": "Cryptographic protection",
    "module": "Hash functions",
    "component": null
  },
  {
    "id": "C0048",
    "attribute": "Data",
    "concept": "Cryptographic protection",
    "module": "Key exchange protocols",
    "component": null
  },
  {
    "id": "C0049",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Density-based clustering"
  },
  {
    "id": "C0050",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Ensemble-based clustering"
  },
  {
    "id": "C0051",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Feature learning-based clustering"
  },
  {
    "id": "C0052",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Graph-based clustering"
  },
  {
    "id": "C0053",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Hierarchical clustering"
  },
  {
    "id": "C0054",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Model-based clustering"
  },
  {
    "id": "C0055",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Spectral clustering"
  },
  {
    "id": "C0056",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Clustering",
    "component": "Subspace and high-dimensional clustering"
  },
  {
    "id": "C0057",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Data visualisation",
    "component": null
  },
  {
    "id": "C0058",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Data visualization",
    "component": null
  },
  {
    "id": "C0059",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Distribution estimation",
    "component": "Non-Parametric distribution estimation"
  },
  {
    "id": "C0060",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Distribution estimation",
    "component": "Parametric distribution estimation"
  },
  {
    "id": "C0061",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Exploratory data analysis",
    "component": "Multi-faceted data analysis"
  },
  {
    "id": "C0062",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Exploratory data analysis",
    "component": null
  },
  {
    "id": "C0063",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Outlier detection",
    "component": "Autoencoder-based outlier detection"
  },
  {
    "id": "C0064",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Outlier detection",
    "component": "Distance-based outlier detection"
  },
  {
    "id": "C0065",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Outlier detection",
    "component": "Spectral-based outlier detection"
  },
  {
    "id": "C0066",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Outlier detection",
    "component": "Statistical-based outlier detection"
  },
  {
    "id": "C0067",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Outlier detection",
    "component": "Tree-based outlier detection"
  },
  {
    "id": "C0068",
    "attribute": "Data",
    "concept": "Data analysis",
    "module": "Outlier detection",
    "component": null
  },
  {
    "id": "C0069",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Blurring",
    "component": "Attribute blurring"
  },
  {
    "id": "C0070",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Blurring",
    "component": "Spatial blurring"
  },
  {
    "id": "C0071",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Blurring",
    "component": "Temporal blurring"
  },
  {
    "id": "C0072",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Data aggregation",
    "component": "Categorical aggregation"
  },
  {
    "id": "C0073",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Data aggregation",
    "component": "Spatial aggregation"
  },
  {
    "id": "C0074",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Data aggregation",
    "component": "Temporal aggregation"
  },
  {
    "id": "C0075",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Data encryption",
    "component": null
  },
  {
    "id": "C0076",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Data perturbation",
    "component": null
  },
  {
    "id": "C0077",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Data swapping",
    "component": null
  },
  {
    "id": "C0078",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Generalisation",
    "component": null
  },
  {
    "id": "C0079",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Masking",
    "component": null
  },
  {
    "id": "C0080",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Nulling out",
    "component": null
  },
  {
    "id": "C0081",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Number and date variance",
    "component": null
  },
  {
    "id": "C0082",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Pseudonymisation",
    "component": null
  },
  {
    "id": "C0083",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Redaction",
    "component": null
  },
  {
    "id": "C0084",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Scrambling",
    "component": null
  },
  {
    "id": "C0085",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Substitution",
    "component": null
  },
  {
    "id": "C0086",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": "Tokenization",
    "component": null
  },
  {
    "id": "C0087",
    "attribute": "Data",
    "concept": "Data anonymisation",
    "module": null,
    "component": null
  },
  {
    "id": "C0088",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Data perturbation",
    "component": "Adversarial data samples"
  },
  {
    "id": "C0089",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Data perturbation",
    "component": "Randomisation"
  },
  {
    "id": "C0090",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Data perturbation",
    "component": "Scaling or translation"
  },
  {
    "id": "C0091",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Data perturbation",
    "component": "Swapping or shuffling"
  },
  {
    "id": "C0092",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Geometric transformations",
    "component": null
  },
  {
    "id": "C0093",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Normalization techniques",
    "component": null
  },
  {
    "id": "C0094",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Photometric transformations",
    "component": null
  },
  {
    "id": "C0095",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": "Synthetic data generation",
    "component": null
  },
  {
    "id": "C0096",
    "attribute": "Data",
    "concept": "Data augmentation",
    "module": null,
    "component": null
  },
  {
    "id": "C0097",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Adversarial data extraction",
    "component": "Generative data reconstruction"
  },
  {
    "id": "C0098",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Data deletion",
    "component": "Hard deletion"
  },
  {
    "id": "C0099",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Data deletion",
    "component": "Soft deletion"
  },
  {
    "id": "C0100",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Data filtering",
    "component": "Binning data"
  },
  {
    "id": "C0101",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Data filtering",
    "component": "Capping data"
  },
  {
    "id": "C0102",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Data filtering",
    "component": null
  },
  {
    "id": "C0103",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Data imputation",
    "component": null
  },
  {
    "id": "C0104",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Duplicate removal",
    "component": "Exact duplicate removal"
  },
  {
    "id": "C0105",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Duplicate removal",
    "component": "Near duplicate removal"
  },
  {
    "id": "C0106",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": "Outlier removal",
    "component": null
  },
  {
    "id": "C0107",
    "attribute": "Data",
    "concept": "Data cleaning",
    "module": null,
    "component": null
  },
  {
    "id": "C0108",
    "attribute": "Data",
    "concept": "Data control",
    "module": "Data compression",
    "component": "Lossless compression"
  },
  {
    "id": "C0109",
    "attribute": "Data",
    "concept": "Data control",
    "module": "Data compression",
    "component": "Lossy compression"
  },
  {
    "id": "C0110",
    "attribute": "Data",
    "concept": "Data enrichment",
    "module": "Add contextual information",
    "component": "Domain expert embedding"
  },
  {
    "id": "C0111",
    "attribute": "Data",
    "concept": "Data enrichment",
    "module": "Add contextual information",
    "component": "NLP-based embeddings"
  },
  {
    "id": "C0112",
    "attribute": "Data",
    "concept": "Data enrichment",
    "module": "Auto labelling",
    "component": "Partial labels"
  },
  {
    "id": "C0113",
    "attribute": "Data",
    "concept": "Data enrichment",
    "module": "Auto labelling",
    "component": null
  },
  {
    "id": "C0114",
    "attribute": "Data",
    "concept": "Data enrichment",
    "module": "Human labelling",
    "component": "Crowdsourcing for labeling"
  },
  {
    "id": "C0115",
    "attribute": "Data",
    "concept": "Data generation",
    "module": "Crowdsource data generation",
    "component": null
  },
  {
    "id": "C0116",
    "attribute": "Data",
    "concept": "Data generation",
    "module": "Data Interpolation",
    "component": null
  },
  {
    "id": "C0117",
    "attribute": "Data",
    "concept": "Data generation",
    "module": "Data scraping",
    "component": null
  },
  {
    "id": "C0118",
    "attribute": "Data",
    "concept": "Data generation",
    "module": "Oversampling",
    "component": null
  },
  {
    "id": "C0119",
    "attribute": "Data",
    "concept": "Data generation",
    "module": "Public data",
    "component": "Open source datasets"
  },
  {
    "id": "C0120",
    "attribute": "Data",
    "concept": "Data generation",
    "module": "Public data",
    "component": "Web scraping"
  },
  {
    "id": "C0121",
    "attribute": "Data",
    "concept": "Data generation",
    "module": "Synthetic data",
    "component": null
  },
  {
    "id": "C0122",
    "attribute": "Data",
    "concept": "Data governance",
    "module": "Data usage agreements",
    "component": null
  },
  {
    "id": "C0123",
    "attribute": "Data",
    "concept": "Data minimisation",
    "module": "Consent",
    "component": "Explicit consent"
  },
  {
    "id": "C0124",
    "attribute": "Data",
    "concept": "Data minimisation",
    "module": "Consent",
    "component": "Implicit consent"
  },
  {
    "id": "C0125",
    "attribute": "Data",
    "concept": "Data minimisation",
    "module": "Consent",
    "component": "Implied consent"
  },
  {
    "id": "C0126",
    "attribute": "Data",
    "concept": "Data minimisation",
    "module": null,
    "component": null
  },
  {
    "id": "C0127",
    "attribute": "Data",
    "concept": "Data noise",
    "module": null,
    "component": null
  },
  {
    "id": "C0128",
    "attribute": "Data",
    "concept": "Data normalisation",
    "module": "Batch normalisation",
    "component": "Backward pass batch normalization"
  },
  {
    "id": "C0129",
    "attribute": "Data",
    "concept": "Data normalisation",
    "module": "Batch normalisation",
    "component": "Forward pass batch normalization"
  },
  {
    "id": "C0130",
    "attribute": "Data",
    "concept": "Data preprocessing",
    "module": null,
    "component": null
  },
  {
    "id": "C0131",
    "attribute": "Data",
    "concept": "Data provenance",
    "module": "Data ownership",
    "component": null
  },
  {
    "id": "C0132",
    "attribute": "Data",
    "concept": "Data provenance",
    "module": null,
    "component": null
  },
  {
    "id": "C0133",
    "attribute": "Data",
    "concept": "Data provisioning",
    "module": null,
    "component": null
  },
  {
    "id": "C0134",
    "attribute": "Data",
    "concept": "Data quality",
    "module": "Data diversity",
    "component": "Diverse data formats"
  },
  {
    "id": "C0135",
    "attribute": "Data",
    "concept": "Data quality",
    "module": "Data diversity",
    "component": "Diverse data sources"
  },
  {
    "id": "C0136",
    "attribute": "Data",
    "concept": "Data quality",
    "module": "Data diversity",
    "component": "Diverse data types"
  },
  {
    "id": "C0137",
    "attribute": "Data",
    "concept": "Data quality",
    "module": "Data diversity",
    "component": "Diverse spatial data"
  },
  {
    "id": "C0138",
    "attribute": "Data",
    "concept": "Data quality",
    "module": "Data diversity",
    "component": "Diverse temporal data"
  },
  {
    "id": "C0139",
    "attribute": "Data",
    "concept": "Data quality",
    "module": "Labelling guidelines",
    "component": "Multiple labellers"
  },
  {
    "id": "C0140",
    "attribute": "Data",
    "concept": "Data quality",
    "module": "Labelling guidelines",
    "component": null
  },
  {
    "id": "C0141",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Active learning",
    "component": "Diversity sampling"
  },
  {
    "id": "C0142",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Active learning",
    "component": "Pool-based sampling"
  },
  {
    "id": "C0143",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Active learning",
    "component": "Query by Committee"
  },
  {
    "id": "C0144",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Active learning",
    "component": "Stream-based selective sampling"
  },
  {
    "id": "C0145",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Active learning",
    "component": "Uncertainty sampling"
  },
  {
    "id": "C0146",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Attention mechanisms",
    "component": "Hard attention"
  },
  {
    "id": "C0147",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Attention mechanisms",
    "component": "Multi-head attention"
  },
  {
    "id": "C0148",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Attention mechanisms",
    "component": "Self-attention"
  },
  {
    "id": "C0149",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Attention mechanisms",
    "component": "Soft attention"
  },
  {
    "id": "C0150",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Clustered sampling",
    "component": null
  },
  {
    "id": "C0151",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Convenience sampling",
    "component": null
  },
  {
    "id": "C0152",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Multiphase sampling",
    "component": null
  },
  {
    "id": "C0153",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Negative data sampling",
    "component": "Adversarial negative sampling"
  },
  {
    "id": "C0154",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Negative data sampling",
    "component": "Dynamic negative sampling"
  },
  {
    "id": "C0155",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Negative data sampling",
    "component": "Hard negative mining"
  },
  {
    "id": "C0156",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Negative data sampling",
    "component": "Heuristic-based sampling"
  },
  {
    "id": "C0157",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Random Sampling",
    "component": null
  },
  {
    "id": "C0158",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Resampling",
    "component": null
  },
  {
    "id": "C0159",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Stratified sampling",
    "component": null
  },
  {
    "id": "C0160",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Subjective sampling",
    "component": null
  },
  {
    "id": "C0161",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Systematic sampling",
    "component": null
  },
  {
    "id": "C0162",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": "Uncertainty sampling",
    "component": null
  },
  {
    "id": "C0163",
    "attribute": "Data",
    "concept": "Data sampling",
    "module": null,
    "component": null
  },
  {
    "id": "C0164",
    "attribute": "Data",
    "concept": "Data storage",
    "module": "Data compression",
    "component": "Lossless compression"
  },
  {
    "id": "C0165",
    "attribute": "Data",
    "concept": "Data storage",
    "module": "Data compression",
    "component": "Lossy compression"
  },
  {
    "id": "C0166",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Data  stationarization",
    "component": "Detrending"
  },
  {
    "id": "C0167",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Data  stationarization",
    "component": "Differencing"
  },
  {
    "id": "C0168",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Data normalisation",
    "component": null
  },
  {
    "id": "C0169",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Data standardization",
    "component": "Decimal scaling"
  },
  {
    "id": "C0170",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Data standardization",
    "component": "Unit conversion"
  },
  {
    "id": "C0171",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Dataset partition",
    "component": "Random data splitting"
  },
  {
    "id": "C0172",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Dataset partition",
    "component": "Stratified data splitting"
  },
  {
    "id": "C0173",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Dataset partition",
    "component": "Time-based data splitting"
  },
  {
    "id": "C0174",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Dimensionality reduction",
    "component": "Linear dimensionality reduction"
  },
  {
    "id": "C0175",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Dimensionality reduction",
    "component": "Non-linear dimensionality reduction"
  },
  {
    "id": "C0176",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Discretization techniques",
    "component": "Adaptive Binning"
  },
  {
    "id": "C0177",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Discretization techniques",
    "component": "Custom Binning"
  },
  {
    "id": "C0178",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Discretization techniques",
    "component": "Decision tree-based binning"
  },
  {
    "id": "C0179",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Discretization techniques",
    "component": "Equal-Frequency binning"
  },
  {
    "id": "C0180",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Discretization techniques",
    "component": "Equal-Width binning"
  },
  {
    "id": "C0181",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Discretization techniques",
    "component": "K-Means Binning"
  },
  {
    "id": "C0182",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": "Discretization techniques",
    "component": "Quantile binning"
  },
  {
    "id": "C0183",
    "attribute": "Data",
    "concept": "Data transformation",
    "module": null,
    "component": null
  },
  {
    "id": "C0184",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": "Dimensionality reduction",
    "component": "Linear dimensionality reduction"
  },
  {
    "id": "C0185",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": "Dimensionality reduction",
    "component": "Non-linear dimensionality reduction"
  },
  {
    "id": "C0186",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": "Feature ablation",
    "component": null
  },
  {
    "id": "C0187",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": "Feature embedding",
    "component": null
  },
  {
    "id": "C0188",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": "Feature selection",
    "component": "Filter-based feature selection"
  },
  {
    "id": "C0189",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": "Feature selection",
    "component": "Wrapper-based filter selection"
  },
  {
    "id": "C0190",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": "Feature selection",
    "component": null
  },
  {
    "id": "C0191",
    "attribute": "Data",
    "concept": "Feature engineering",
    "module": null,
    "component": null
  },
  {
    "id": "C0192",
    "attribute": "Data",
    "concept": "Workload scheduling",
    "module": "Batch Processing",
    "component": "Inference batching"
  },
  {
    "id": "C0193",
    "attribute": "Data",
    "concept": "Workload scheduling",
    "module": "Batch processing",
    "component": "Batch training"
  },
  {
    "id": "C0194",
    "attribute": "Data",
    "concept": "Workload scheduling",
    "module": "Batch processing",
    "component": "Inference batching"
  },
  {
    "id": "C0195",
    "attribute": "Hardware",
    "concept": "Cold redundancy",
    "module": "Data backup",
    "component": "Differential data backup"
  },
  {
    "id": "C0196",
    "attribute": "Hardware",
    "concept": "Cold redundancy",
    "module": "Data backup",
    "component": "Full data backup"
  },
  {
    "id": "C0197",
    "attribute": "Hardware",
    "concept": "Cold redundancy",
    "module": "Data backup",
    "component": "Incremental data backup"
  },
  {
    "id": "C0198",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Accelerator",
    "component": "No local reuse"
  },
  {
    "id": "C0199",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Accelerator",
    "component": "Output stationary"
  },
  {
    "id": "C0200",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Accelerator",
    "component": "Row stationary"
  },
  {
    "id": "C0201",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Accelerator",
    "component": "Weight stationary"
  },
  {
    "id": "C0202",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Advanced memory Technologies",
    "component": "Embedded DRAM"
  },
  {
    "id": "C0203",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Advanced memory Technologies",
    "component": "Hybrid memory cube"
  },
  {
    "id": "C0204",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Near-Memory Computing",
    "component": null
  },
  {
    "id": "C0205",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Processing-in-Memory",
    "component": null
  },
  {
    "id": "C0206",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Resistive computing",
    "component": null
  },
  {
    "id": "C0207",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Sensor-Level Processing",
    "component": null
  },
  {
    "id": "C0208",
    "attribute": "Hardware",
    "concept": "Data control",
    "module": "Switched Capacitor MAC",
    "component": null
  },
  {
    "id": "C0209",
    "attribute": "Hardware",
    "concept": "Efficient hardware",
    "module": "CPU",
    "component": null
  },
  {
    "id": "C0210",
    "attribute": "Hardware",
    "concept": "Efficient hardware",
    "module": "GPU",
    "component": null
  },
  {
    "id": "C0211",
    "attribute": "Hardware",
    "concept": "Efficient hardware",
    "module": "Solid state drives",
    "component": null
  },
  {
    "id": "C0212",
    "attribute": "Hardware",
    "concept": "Hardware redundancy",
    "module": "Cold hardware redundancy",
    "component": null
  },
  {
    "id": "C0213",
    "attribute": "Hardware",
    "concept": "Hardware redundancy",
    "module": "Hot hardware redundancy",
    "component": null
  },
  {
    "id": "C0214",
    "attribute": "Hardware",
    "concept": "Hardware redundancy",
    "module": "Warm hardware redundancy",
    "component": null
  },
  {
    "id": "C0215",
    "attribute": "Hardware",
    "concept": "Heat dissipation",
    "module": "Cooling systems",
    "component": "Air cooled"
  },
  {
    "id": "C0216",
    "attribute": "Hardware",
    "concept": "Heat dissipation",
    "module": "Cooling systems",
    "component": "Liquid cooled"
  },
  {
    "id": "C0217",
    "attribute": "Hardware",
    "concept": "Heat dissipation",
    "module": "Passive cooling systems",
    "component": "Heat sinks"
  },
  {
    "id": "C0218",
    "attribute": "Hardware",
    "concept": "Heat dissipation solution",
    "module": "Heat transfer",
    "component": "Heat pipes"
  },
  {
    "id": "C0219",
    "attribute": "Hardware",
    "concept": "Heat dissipation solution",
    "module": "Heat transfer",
    "component": "Phase change materials"
  },
  {
    "id": "C0220",
    "attribute": "Hardware",
    "concept": "Heat dissipation solution",
    "module": "Heat transfer",
    "component": "Thermal interface materials"
  },
  {
    "id": "C0221",
    "attribute": "Hardware",
    "concept": "Heat dissipation solution",
    "module": "Heat transfer",
    "component": "Vapor chambers"
  },
  {
    "id": "C0222",
    "attribute": "Hardware",
    "concept": "Parallel processing",
    "module": null,
    "component": null
  },
  {
    "id": "C0223",
    "attribute": "Hardware",
    "concept": "Power consumption control",
    "module": "Reduce precision",
    "component": null
  },
  {
    "id": "C0224",
    "attribute": "Hardware",
    "concept": "Power consumption control",
    "module": "Software library optimisation",
    "component": null
  },
  {
    "id": "C0225",
    "attribute": "Hardware",
    "concept": "Power consumption control",
    "module": "Sparsity",
    "component": null
  },
  {
    "id": "C0226",
    "attribute": "Hardware",
    "concept": "Power consumption control",
    "module": "Throttling dowm",
    "component": null
  },
  {
    "id": "C0227",
    "attribute": "Hardware",
    "concept": "Power consumption control",
    "module": null,
    "component": "Thermal throttling"
  },
  {
    "id": "C0228",
    "attribute": "Infrastructure",
    "concept": "Cloud computing",
    "module": "On-Premises",
    "component": null
  },
  {
    "id": "C0229",
    "attribute": "Infrastructure",
    "concept": "Cloud computing",
    "module": "Private Cloud",
    "component": null
  },
  {
    "id": "C0230",
    "attribute": "Infrastructure",
    "concept": "Cloud computing",
    "module": "Public Cloud",
    "component": null
  },
  {
    "id": "C0231",
    "attribute": "Infrastructure",
    "concept": "Distributed computing",
    "module": "Client-server distributed computing",
    "component": null
  },
  {
    "id": "C0232",
    "attribute": "Infrastructure",
    "concept": "Distributed computing",
    "module": "N-tier distributed computing",
    "component": null
  },
  {
    "id": "C0233",
    "attribute": "Infrastructure",
    "concept": "Distributed computing",
    "module": "Peer-to-peer distributed computing",
    "component": null
  },
  {
    "id": "C0234",
    "attribute": "Infrastructure",
    "concept": "Distributed computing",
    "module": "Three-tier distributed computing",
    "component": null
  },
  {
    "id": "C0235",
    "attribute": "Model",
    "concept": "Align objectives",
    "module": "Clearly define objectives",
    "component": null
  },
  {
    "id": "C0236",
    "attribute": "Model",
    "concept": "Align objectives",
    "module": "Fine tuning",
    "component": "Reinforcement learning AI feedback"
  },
  {
    "id": "C0237",
    "attribute": "Model",
    "concept": "Align objectives",
    "module": "Fine tuning",
    "component": "Reinforcement learning human feedback"
  },
  {
    "id": "C0238",
    "attribute": "Model",
    "concept": "Align objectives",
    "module": "Retrieval augmented generation",
    "component": null
  },
  {
    "id": "C0239",
    "attribute": "Model",
    "concept": "Align objectives",
    "module": "Transfer learning",
    "component": "Few-shot learning"
  },
  {
    "id": "C0240",
    "attribute": "Model",
    "concept": "Bias detection algorithm",
    "module": "Model bias detection",
    "component": "Counterfactual fairness detection"
  },
  {
    "id": "C0241",
    "attribute": "Model",
    "concept": "Bias detection algorithm",
    "module": "Model bias detection",
    "component": "Group fairness detection"
  },
  {
    "id": "C0242",
    "attribute": "Model",
    "concept": "Bias detection algorithm",
    "module": "Model bias detection",
    "component": "Individual fairness detection"
  },
  {
    "id": "C0243",
    "attribute": "Model",
    "concept": "Bias mitigation algorithm",
    "module": "In-processing bias mitigation",
    "component": null
  },
  {
    "id": "C0244",
    "attribute": "Model",
    "concept": "Bias mitigation algorithm",
    "module": "Post-processing bias mitigation",
    "component": null
  },
  {
    "id": "C0245",
    "attribute": "Model",
    "concept": "Bias mitigation algorithm",
    "module": "Pre-processing bias mitigation",
    "component": null
  },
  {
    "id": "C0246",
    "attribute": "Model",
    "concept": "Continuous learning",
    "module": "Online learning",
    "component": null
  },
  {
    "id": "C0247",
    "attribute": "Model",
    "concept": "Continuous learning",
    "module": "Unsupervised learning",
    "component": null
  },
  {
    "id": "C0248",
    "attribute": "Model",
    "concept": "Data analysis",
    "module": null,
    "component": "Silhouette analysis"
  },
  {
    "id": "C0249",
    "attribute": "Model",
    "concept": "Distribution shift detection",
    "module": "Data shift detection",
    "component": "Distance-based drift detection"
  },
  {
    "id": "C0250",
    "attribute": "Model",
    "concept": "Distribution shift detection",
    "module": "Data shift detection",
    "component": "Learning-based drift detection"
  },
  {
    "id": "C0251",
    "attribute": "Model",
    "concept": "Distribution shift detection",
    "module": "Data shift detection",
    "component": "Model-based drift detection"
  },
  {
    "id": "C0252",
    "attribute": "Model",
    "concept": "Distribution shift detection",
    "module": "Data shift detection",
    "component": "Statistical-based drift detection"
  },
  {
    "id": "C0253",
    "attribute": "Model",
    "concept": "Distribution shift detection",
    "module": "Data shift detection",
    "component": "Uncertainty-based drift detection"
  },
  {
    "id": "C0254",
    "attribute": "Model",
    "concept": "Distribution shift detection",
    "module": "Data shift detection",
    "component": null
  },
  {
    "id": "C0255",
    "attribute": "Model",
    "concept": "Education and training",
    "module": "User training",
    "component": "Experience replay"
  },
  {
    "id": "C0256",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Fine tuning",
    "component": null
  },
  {
    "id": "C0257",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Incremental learning",
    "component": "Elastic weight consolidation"
  },
  {
    "id": "C0258",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Incremental learning",
    "component": "Layer-wise pretraining"
  },
  {
    "id": "C0259",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Incremental learning",
    "component": "Mini-batch data"
  },
  {
    "id": "C0260",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Progressive neural networks",
    "component": null
  },
  {
    "id": "C0261",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Regular model evaluation on old tasks",
    "component": null
  },
  {
    "id": "C0262",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Retrieval models",
    "component": null
  },
  {
    "id": "C0263",
    "attribute": "Model",
    "concept": "Maintain knowledge",
    "module": "Transfer learning",
    "component": null
  },
  {
    "id": "C0264",
    "attribute": "Model",
    "concept": "Model architecture",
    "module": null,
    "component": null
  },
  {
    "id": "C0265",
    "attribute": "Model",
    "concept": "Model complexity",
    "module": "Hierarchical models",
    "component": null
  },
  {
    "id": "C0266",
    "attribute": "Model",
    "concept": "Model explanation",
    "module": "Citing sources",
    "component": null
  },
  {
    "id": "C0267",
    "attribute": "Model",
    "concept": "Model explanation",
    "module": "Feature importance analysis",
    "component": null
  },
  {
    "id": "C0268",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Activation mapping",
    "component": "Class Activation Mapping (CAM)"
  },
  {
    "id": "C0269",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Activation mapping",
    "component": "Grad-CAM++"
  },
  {
    "id": "C0270",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Activation mapping",
    "component": "Gradient-weighted Class Activation Mapping (Grad-CAM)"
  },
  {
    "id": "C0271",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Activation mapping",
    "component": "Guided Backpropagation"
  },
  {
    "id": "C0272",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Activation mapping",
    "component": "Integrated Gradients"
  },
  {
    "id": "C0273",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Activation mapping",
    "component": "Layer-wise Relevance Propagation (LRP)"
  },
  {
    "id": "C0274",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Activation mapping",
    "component": "SmoothGrad"
  },
  {
    "id": "C0275",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Reduce model complexity",
    "component": null
  },
  {
    "id": "C0276",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": "Rule based explanations",
    "component": null
  },
  {
    "id": "C0277",
    "attribute": "Model",
    "concept": "Model explanations",
    "module": null,
    "component": null
  },
  {
    "id": "C0278",
    "attribute": "Model",
    "concept": "Model generalisation",
    "module": "Domain adaptation",
    "component": "Feature-based domain adaptation"
  },
  {
    "id": "C0279",
    "attribute": "Model",
    "concept": "Model generalisation",
    "module": "Domain adaptation",
    "component": "Instance-based domain adaptation"
  },
  {
    "id": "C0280",
    "attribute": "Model",
    "concept": "Model generalisation",
    "module": "Domain adaptation",
    "component": "Model-based domain adaptation"
  },
  {
    "id": "C0281",
    "attribute": "Model",
    "concept": "Model hardening",
    "module": "Defensive distillation",
    "component": null
  },
  {
    "id": "C0282",
    "attribute": "Model",
    "concept": "Model hardening",
    "module": "Model distillation",
    "component": null
  },
  {
    "id": "C0283",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Approximation methods",
    "component": "Heuristic methods"
  },
  {
    "id": "C0284",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Approximation methods",
    "component": "Lower precision"
  },
  {
    "id": "C0285",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Approximation methods",
    "component": "Numerical approximations"
  },
  {
    "id": "C0286",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Approximation methods",
    "component": "Sampling-Based approximation methods"
  },
  {
    "id": "C0287",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Automated parameter selection"
  },
  {
    "id": "C0288",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Bayesian Optimisation"
  },
  {
    "id": "C0289",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Bayesian optimisation"
  },
  {
    "id": "C0290",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Elbow method"
  },
  {
    "id": "C0291",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Genetic algorithms"
  },
  {
    "id": "C0292",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Grid search"
  },
  {
    "id": "C0293",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Random Search"
  },
  {
    "id": "C0294",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": "Random search"
  },
  {
    "id": "C0295",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Hyperparameter tuning",
    "component": null
  },
  {
    "id": "C0296",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Initialization techniques",
    "component": "He Initialization"
  },
  {
    "id": "C0297",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Initialization techniques",
    "component": "K-means++ algorithm for initialization"
  },
  {
    "id": "C0298",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Initialization techniques",
    "component": "Pretrained Initialization"
  },
  {
    "id": "C0299",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Initialization techniques",
    "component": "Random Initialization"
  },
  {
    "id": "C0300",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Initialization techniques",
    "component": "Xavier/Glorot Initialization"
  },
  {
    "id": "C0301",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Initialization techniques",
    "component": "Zero Initialization"
  },
  {
    "id": "C0302",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Initialization techniques",
    "component": null
  },
  {
    "id": "C0303",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model architecture search",
    "component": "Gradient-based architecture search"
  },
  {
    "id": "C0304",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model complexity management",
    "component": null
  },
  {
    "id": "C0305",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model pruning",
    "component": "Neuron pruning"
  },
  {
    "id": "C0306",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model pruning",
    "component": "Structured pruning"
  },
  {
    "id": "C0307",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model pruning",
    "component": "Weight pruning"
  },
  {
    "id": "C0308",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model pruning",
    "component": null
  },
  {
    "id": "C0309",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model quantization",
    "component": "Dynamic quantization"
  },
  {
    "id": "C0310",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model quantization",
    "component": "Post-training quantization"
  },
  {
    "id": "C0311",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model quantization",
    "component": "Quantization-aware training"
  },
  {
    "id": "C0312",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model quantization",
    "component": null
  },
  {
    "id": "C0313",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Model simplification",
    "component": null
  },
  {
    "id": "C0314",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Optimized algorithms",
    "component": null
  },
  {
    "id": "C0315",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Pruning",
    "component": "Parameter Pruning"
  },
  {
    "id": "C0316",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Reduce depth of network",
    "component": null
  },
  {
    "id": "C0317",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Surrogate model",
    "component": "Decision trees"
  },
  {
    "id": "C0318",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Surrogate model",
    "component": "Gaussian process models"
  },
  {
    "id": "C0319",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Surrogate model",
    "component": "Polynomial regression models"
  },
  {
    "id": "C0320",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": "Surrogate model",
    "component": "Radial basis function networks"
  },
  {
    "id": "C0321",
    "attribute": "Model",
    "concept": "Model optimisation",
    "module": null,
    "component": "Second-order optimisation methods"
  },
  {
    "id": "C0322",
    "attribute": "Model",
    "concept": "Model stability",
    "module": "Activation functions",
    "component": "Non-linear activation functions"
  },
  {
    "id": "C0323",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Adaptive learning rate",
    "component": "Exponential moving average methods"
  },
  {
    "id": "C0324",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Adaptive learning rate",
    "component": "Gradient accumulation methods"
  },
  {
    "id": "C0325",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Adaptive learning rate",
    "component": "Momentum-based methods"
  },
  {
    "id": "C0326",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Adaptive learning rate",
    "component": "Regularisation-aware methods"
  },
  {
    "id": "C0327",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Adaptive learning rate",
    "component": "Windowed methods"
  },
  {
    "id": "C0328",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Gradient clipping",
    "component": "Elastic weight consolidation"
  },
  {
    "id": "C0329",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Gradient clipping",
    "component": "Norm gradient clipping"
  },
  {
    "id": "C0330",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Gradient clipping",
    "component": "Value gradient clipping"
  },
  {
    "id": "C0331",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Gradient clipping",
    "component": null
  },
  {
    "id": "C0332",
    "attribute": "Model",
    "concept": "Momentum damping",
    "module": "Incremental processing",
    "component": "Mini-batch data"
  },
  {
    "id": "C0333",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": "Bagging"
  },
  {
    "id": "C0334",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": "Boosting"
  },
  {
    "id": "C0335",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": "Feature diversity"
  },
  {
    "id": "C0336",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": "Hyperparameter diversity"
  },
  {
    "id": "C0337",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": "Model diversity"
  },
  {
    "id": "C0338",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": "Multiple clustering techniques"
  },
  {
    "id": "C0339",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": "Stacking"
  },
  {
    "id": "C0340",
    "attribute": "Model",
    "concept": "N-version programming",
    "module": "Hybrid models",
    "component": null
  },
  {
    "id": "C0341",
    "attribute": "Model",
    "concept": "Obfuscation",
    "module": "Gradient masking",
    "component": "Defensive Distillation"
  },
  {
    "id": "C0342",
    "attribute": "Model",
    "concept": "Obfuscation",
    "module": "Gradient masking",
    "component": "Defensive distillation"
  },
  {
    "id": "C0343",
    "attribute": "Model",
    "concept": "Obfuscation",
    "module": "Gradient masking",
    "component": "Gradient regularization"
  },
  {
    "id": "C0344",
    "attribute": "Model",
    "concept": "Obfuscation",
    "module": "Gradient masking",
    "component": "Randomized gradients"
  },
  {
    "id": "C0345",
    "attribute": "Model",
    "concept": "Obfuscation",
    "module": "Gradient masking",
    "component": "Shattered gradients"
  },
  {
    "id": "C0346",
    "attribute": "Model",
    "concept": "Pre-training techniques",
    "module": null,
    "component": null
  },
  {
    "id": "C0347",
    "attribute": "Model",
    "concept": "Regular update",
    "module": "Periodic model update",
    "component": null
  },
  {
    "id": "C0348",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Dropout",
    "component": "Alpha dropout"
  },
  {
    "id": "C0349",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Dropout",
    "component": "Monte Carlo dropout"
  },
  {
    "id": "C0350",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Dropout",
    "component": "Random dropout"
  },
  {
    "id": "C0351",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Dropout",
    "component": "Spatial dropout"
  },
  {
    "id": "C0352",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Dropout",
    "component": "Variational dropout"
  },
  {
    "id": "C0353",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Early stopping",
    "component": "Degradation stopping"
  },
  {
    "id": "C0354",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Early stopping",
    "component": "Dynamic expansion"
  },
  {
    "id": "C0355",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Early stopping",
    "component": "Patience-based stopping"
  },
  {
    "id": "C0356",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Early stopping",
    "component": "Scheduled stopping"
  },
  {
    "id": "C0357",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Early stopping",
    "component": "Threshold stopping"
  },
  {
    "id": "C0358",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Weight decay",
    "component": null
  },
  {
    "id": "C0359",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": "Weight regularization",
    "component": null
  },
  {
    "id": "C0360",
    "attribute": "Model",
    "concept": "Regularisation",
    "module": null,
    "component": null
  },
  {
    "id": "C0361",
    "attribute": "Model",
    "concept": "Sensitivity analysis",
    "module": "Global sensitivity analysis",
    "component": null
  },
  {
    "id": "C0362",
    "attribute": "Model",
    "concept": "Sensitivity analysis",
    "module": "Local sensitivity analysis",
    "component": null
  },
  {
    "id": "C0363",
    "attribute": "Model",
    "concept": "Software architecture",
    "module": "Modularization",
    "component": "Design patterns"
  },
  {
    "id": "C0364",
    "attribute": "Model",
    "concept": "Software architecture",
    "module": "Modularization",
    "component": "Refactoring"
  },
  {
    "id": "C0365",
    "attribute": "Organisation",
    "concept": "Documentation package",
    "module": null,
    "component": null
  },
  {
    "id": "C0366",
    "attribute": "Organisation",
    "concept": "Education and training",
    "module": "AI culture",
    "component": "Job displacement programs"
  },
  {
    "id": "C0367",
    "attribute": "Organisation",
    "concept": "Education and training",
    "module": "AI culture",
    "component": "Retraining initiatives"
  },
  {
    "id": "C0368",
    "attribute": "Organisation",
    "concept": "Education and training",
    "module": "Public education",
    "component": null
  },
  {
    "id": "C0369",
    "attribute": "Organisation",
    "concept": "Education and training",
    "module": null,
    "component": null
  },
  {
    "id": "C0370",
    "attribute": "Organisation",
    "concept": "Human machine interface",
    "module": "User training",
    "component": "In person training"
  },
  {
    "id": "C0371",
    "attribute": "Organisation",
    "concept": "Human machine interface",
    "module": "User training",
    "component": "Online training"
  },
  {
    "id": "C0372",
    "attribute": "Organisation",
    "concept": "Human machine interface",
    "module": "User training",
    "component": "Simulation based training"
  },
  {
    "id": "C0373",
    "attribute": "Organisation",
    "concept": "Risk Governance",
    "module": "Governing body",
    "component": "Ethical development guidelines"
  },
  {
    "id": "C0374",
    "attribute": "Organisation",
    "concept": "Risk Governance",
    "module": "Governing body",
    "component": "Ethical frameworks"
  },
  {
    "id": "C0375",
    "attribute": "Organisation",
    "concept": "Risk Governance",
    "module": "Governing body",
    "component": "Ethical review boards"
  },
  {
    "id": "C0376",
    "attribute": "Organisation",
    "concept": "Risk Governance",
    "module": "Governing body",
    "component": "Ethics review board"
  },
  {
    "id": "C0377",
    "attribute": "Organisation",
    "concept": "Risk Governance",
    "module": "Incident response plan",
    "component": null
  },
  {
    "id": "C0378",
    "attribute": "Organisation",
    "concept": "Risk Governance",
    "module": "Process based objectives",
    "component": "Clear roles and responsibilities"
  },
  {
    "id": "C0379",
    "attribute": "Organisation",
    "concept": "Risk governance",
    "module": "Governance tools",
    "component": "Automated legal monitoring systems"
  },
  {
    "id": "C0380",
    "attribute": "Organisation",
    "concept": "Stakeholder feedback",
    "module": "Obtain diverse feedback",
    "component": "Multidisciplinary team"
  },
  {
    "id": "C0381",
    "attribute": "Organisation",
    "concept": "Stakeholder feedback",
    "module": null,
    "component": null
  },
  {
    "id": "C0382",
    "attribute": "Organisation",
    "concept": "Usage policies",
    "module": "End user license agreements",
    "component": null
  },
  {
    "id": "C0383",
    "attribute": "Organisation",
    "concept": "Usage policies",
    "module": "Insurance and liability policies",
    "component": null
  },
  {
    "id": "C0384",
    "attribute": null,
    "concept": "Apply domain knowledge",
    "module": "Expert knowledge",
    "component": null
  },
  {
    "id": "C0385",
    "attribute": null,
    "concept": "Data analysis",
    "module": "Exploratory data analysis",
    "component": null
  },
  {
    "id": "C0386",
    "attribute": null,
    "concept": "Data encryption",
    "module": "Secure data storage",
    "component": null
  },
  {
    "id": "C0387",
    "attribute": null,
    "concept": "Data encryption",
    "module": "Secure data transmission",
    "component": null
  },
  {
    "id": "C0388",
    "attribute": null,
    "concept": "Data generation",
    "module": "Public data",
    "component": "Open source ground truth"
  },
  {
    "id": "C0389",
    "attribute": null,
    "concept": "Data minimisation",
    "module": "Control input",
    "component": "Reduce field of view"
  },
  {
    "id": "C0390",
    "attribute": null,
    "concept": "Data provenance",
    "module": "Data processing records",
    "component": null
  },
  {
    "id": "C0391",
    "attribute": null,
    "concept": "Data provenance",
    "module": null,
    "component": null
  },
  {
    "id": "C0392",
    "attribute": null,
    "concept": "Data sampling",
    "module": "Resampling",
    "component": null
  },
  {
    "id": "C0393",
    "attribute": null,
    "concept": "Data sampling",
    "module": "Reweighting",
    "component": null
  },
  {
    "id": "C0394",
    "attribute": null,
    "concept": "Data sampling",
    "module": null,
    "component": null
  },
  {
    "id": "C0395",
    "attribute": null,
    "concept": "Data transformation",
    "module": "Adversarial data transformation",
    "component": null
  },
  {
    "id": "C0396",
    "attribute": null,
    "concept": "Data transformation",
    "module": null,
    "component": null
  },
  {
    "id": "C0397",
    "attribute": null,
    "concept": "Model optimisation",
    "module": "Reduce model complexity",
    "component": null
  },
  {
    "id": "C0398",
    "attribute": null,
    "concept": "N-version programming",
    "module": "Ensemble methods",
    "component": null
  }
]

export const MAPPINGS: HazardControlMapping[] = [
  {
    "hazardId": "H002",
    "controlId": "C0025"
  },
  {
    "hazardId": "H002",
    "controlId": "C0026"
  },
  {
    "hazardId": "H002",
    "controlId": "C0027"
  },
  {
    "hazardId": "H002",
    "controlId": "C0088"
  },
  {
    "hazardId": "H002",
    "controlId": "C0089"
  },
  {
    "hazardId": "H002",
    "controlId": "C0090"
  },
  {
    "hazardId": "H002",
    "controlId": "C0091"
  },
  {
    "hazardId": "H003",
    "controlId": "C0277"
  },
  {
    "hazardId": "H003",
    "controlId": "C0370"
  },
  {
    "hazardId": "H003",
    "controlId": "C0371"
  },
  {
    "hazardId": "H003",
    "controlId": "C0372"
  },
  {
    "hazardId": "H004",
    "controlId": "C0163"
  },
  {
    "hazardId": "H005",
    "controlId": "C0139"
  },
  {
    "hazardId": "H005",
    "controlId": "C0140"
  },
  {
    "hazardId": "H007",
    "controlId": "C0112"
  },
  {
    "hazardId": "H008",
    "controlId": "C0049"
  },
  {
    "hazardId": "H008",
    "controlId": "C0050"
  },
  {
    "hazardId": "H008",
    "controlId": "C0051"
  },
  {
    "hazardId": "H008",
    "controlId": "C0052"
  },
  {
    "hazardId": "H008",
    "controlId": "C0053"
  },
  {
    "hazardId": "H008",
    "controlId": "C0054"
  },
  {
    "hazardId": "H008",
    "controlId": "C0055"
  },
  {
    "hazardId": "H008",
    "controlId": "C0056"
  },
  {
    "hazardId": "H008",
    "controlId": "C0162"
  },
  {
    "hazardId": "H008",
    "controlId": "C0193"
  },
  {
    "hazardId": "H009",
    "controlId": "C0096"
  },
  {
    "hazardId": "H009",
    "controlId": "C0113"
  },
  {
    "hazardId": "H009",
    "controlId": "C0114"
  },
  {
    "hazardId": "H009",
    "controlId": "C0121"
  },
  {
    "hazardId": "H009",
    "controlId": "C0141"
  },
  {
    "hazardId": "H009",
    "controlId": "C0142"
  },
  {
    "hazardId": "H009",
    "controlId": "C0143"
  },
  {
    "hazardId": "H009",
    "controlId": "C0144"
  },
  {
    "hazardId": "H009",
    "controlId": "C0145"
  },
  {
    "hazardId": "H009",
    "controlId": "C0191"
  },
  {
    "hazardId": "H009",
    "controlId": "C0257"
  },
  {
    "hazardId": "H009",
    "controlId": "C0259"
  },
  {
    "hazardId": "H009",
    "controlId": "C0260"
  },
  {
    "hazardId": "H009",
    "controlId": "C0263"
  },
  {
    "hazardId": "H009",
    "controlId": "C0360"
  },
  {
    "hazardId": "H011",
    "controlId": "C0164"
  },
  {
    "hazardId": "H011",
    "controlId": "C0165"
  },
  {
    "hazardId": "H011",
    "controlId": "C0192"
  },
  {
    "hazardId": "H011",
    "controlId": "C0194"
  },
  {
    "hazardId": "H011",
    "controlId": "C0210"
  },
  {
    "hazardId": "H011",
    "controlId": "C0228"
  },
  {
    "hazardId": "H011",
    "controlId": "C0229"
  },
  {
    "hazardId": "H011",
    "controlId": "C0230"
  },
  {
    "hazardId": "H011",
    "controlId": "C0231"
  },
  {
    "hazardId": "H011",
    "controlId": "C0232"
  },
  {
    "hazardId": "H011",
    "controlId": "C0233"
  },
  {
    "hazardId": "H011",
    "controlId": "C0234"
  },
  {
    "hazardId": "H011",
    "controlId": "C0308"
  },
  {
    "hazardId": "H011",
    "controlId": "C0312"
  },
  {
    "hazardId": "H011",
    "controlId": "C0314"
  },
  {
    "hazardId": "H011",
    "controlId": "C0332"
  },
  {
    "hazardId": "H014",
    "controlId": "C0134"
  },
  {
    "hazardId": "H014",
    "controlId": "C0135"
  },
  {
    "hazardId": "H014",
    "controlId": "C0136"
  },
  {
    "hazardId": "H014",
    "controlId": "C0137"
  },
  {
    "hazardId": "H014",
    "controlId": "C0138"
  },
  {
    "hazardId": "H014",
    "controlId": "C0190"
  },
  {
    "hazardId": "H014",
    "controlId": "C0267"
  },
  {
    "hazardId": "H014",
    "controlId": "C0304"
  },
  {
    "hazardId": "H015",
    "controlId": "C0026"
  },
  {
    "hazardId": "H015",
    "controlId": "C0107"
  },
  {
    "hazardId": "H015",
    "controlId": "C0130"
  },
  {
    "hazardId": "H015",
    "controlId": "C0191"
  },
  {
    "hazardId": "H015",
    "controlId": "C0246"
  },
  {
    "hazardId": "H015",
    "controlId": "C0295"
  },
  {
    "hazardId": "H015",
    "controlId": "C0308"
  },
  {
    "hazardId": "H015",
    "controlId": "C0339"
  },
  {
    "hazardId": "H015",
    "controlId": "C0360"
  },
  {
    "hazardId": "H015",
    "controlId": "C0398"
  },
  {
    "hazardId": "H016",
    "controlId": "C0191"
  },
  {
    "hazardId": "H016",
    "controlId": "C0361"
  },
  {
    "hazardId": "H016",
    "controlId": "C0362"
  },
  {
    "hazardId": "H017",
    "controlId": "C0009"
  },
  {
    "hazardId": "H017",
    "controlId": "C0042"
  },
  {
    "hazardId": "H017",
    "controlId": "C0043"
  },
  {
    "hazardId": "H017",
    "controlId": "C0044"
  },
  {
    "hazardId": "H017",
    "controlId": "C0121"
  },
  {
    "hazardId": "H017",
    "controlId": "C0134"
  },
  {
    "hazardId": "H017",
    "controlId": "C0135"
  },
  {
    "hazardId": "H017",
    "controlId": "C0136"
  },
  {
    "hazardId": "H017",
    "controlId": "C0137"
  },
  {
    "hazardId": "H017",
    "controlId": "C0138"
  },
  {
    "hazardId": "H017",
    "controlId": "C0150"
  },
  {
    "hazardId": "H017",
    "controlId": "C0151"
  },
  {
    "hazardId": "H017",
    "controlId": "C0152"
  },
  {
    "hazardId": "H017",
    "controlId": "C0157"
  },
  {
    "hazardId": "H017",
    "controlId": "C0158"
  },
  {
    "hazardId": "H017",
    "controlId": "C0159"
  },
  {
    "hazardId": "H017",
    "controlId": "C0160"
  },
  {
    "hazardId": "H017",
    "controlId": "C0161"
  },
  {
    "hazardId": "H017",
    "controlId": "C0240"
  },
  {
    "hazardId": "H017",
    "controlId": "C0241"
  },
  {
    "hazardId": "H017",
    "controlId": "C0242"
  },
  {
    "hazardId": "H017",
    "controlId": "C0243"
  },
  {
    "hazardId": "H017",
    "controlId": "C0244"
  },
  {
    "hazardId": "H017",
    "controlId": "C0245"
  },
  {
    "hazardId": "H017",
    "controlId": "C0333"
  },
  {
    "hazardId": "H017",
    "controlId": "C0334"
  },
  {
    "hazardId": "H017",
    "controlId": "C0339"
  },
  {
    "hazardId": "H017",
    "controlId": "C0381"
  },
  {
    "hazardId": "H017",
    "controlId": "C0392"
  },
  {
    "hazardId": "H017",
    "controlId": "C0393"
  },
  {
    "hazardId": "H018",
    "controlId": "C0036"
  },
  {
    "hazardId": "H018",
    "controlId": "C0096"
  },
  {
    "hazardId": "H018",
    "controlId": "C0103"
  },
  {
    "hazardId": "H018",
    "controlId": "C0134"
  },
  {
    "hazardId": "H018",
    "controlId": "C0135"
  },
  {
    "hazardId": "H018",
    "controlId": "C0136"
  },
  {
    "hazardId": "H018",
    "controlId": "C0137"
  },
  {
    "hazardId": "H018",
    "controlId": "C0138"
  },
  {
    "hazardId": "H018",
    "controlId": "C0150"
  },
  {
    "hazardId": "H018",
    "controlId": "C0151"
  },
  {
    "hazardId": "H018",
    "controlId": "C0152"
  },
  {
    "hazardId": "H018",
    "controlId": "C0157"
  },
  {
    "hazardId": "H018",
    "controlId": "C0159"
  },
  {
    "hazardId": "H018",
    "controlId": "C0160"
  },
  {
    "hazardId": "H018",
    "controlId": "C0161"
  },
  {
    "hazardId": "H018",
    "controlId": "C0191"
  },
  {
    "hazardId": "H018",
    "controlId": "C0361"
  },
  {
    "hazardId": "H018",
    "controlId": "C0362"
  },
  {
    "hazardId": "H018",
    "controlId": "C0384"
  },
  {
    "hazardId": "H019",
    "controlId": "C0384"
  },
  {
    "hazardId": "H021",
    "controlId": "C0096"
  },
  {
    "hazardId": "H023",
    "controlId": "C0025"
  },
  {
    "hazardId": "H023",
    "controlId": "C0026"
  },
  {
    "hazardId": "H023",
    "controlId": "C0027"
  },
  {
    "hazardId": "H023",
    "controlId": "C0134"
  },
  {
    "hazardId": "H023",
    "controlId": "C0135"
  },
  {
    "hazardId": "H023",
    "controlId": "C0136"
  },
  {
    "hazardId": "H023",
    "controlId": "C0137"
  },
  {
    "hazardId": "H023",
    "controlId": "C0138"
  },
  {
    "hazardId": "H023",
    "controlId": "C0153"
  },
  {
    "hazardId": "H023",
    "controlId": "C0154"
  },
  {
    "hazardId": "H023",
    "controlId": "C0155"
  },
  {
    "hazardId": "H023",
    "controlId": "C0156"
  },
  {
    "hazardId": "H025",
    "controlId": "C0026"
  },
  {
    "hazardId": "H025",
    "controlId": "C0063"
  },
  {
    "hazardId": "H025",
    "controlId": "C0064"
  },
  {
    "hazardId": "H025",
    "controlId": "C0065"
  },
  {
    "hazardId": "H025",
    "controlId": "C0066"
  },
  {
    "hazardId": "H025",
    "controlId": "C0067"
  },
  {
    "hazardId": "H025",
    "controlId": "C0068"
  },
  {
    "hazardId": "H025",
    "controlId": "C0102"
  },
  {
    "hazardId": "H025",
    "controlId": "C0103"
  },
  {
    "hazardId": "H025",
    "controlId": "C0104"
  },
  {
    "hazardId": "H025",
    "controlId": "C0105"
  },
  {
    "hazardId": "H025",
    "controlId": "C0106"
  },
  {
    "hazardId": "H025",
    "controlId": "C0107"
  },
  {
    "hazardId": "H025",
    "controlId": "C0183"
  },
  {
    "hazardId": "H025",
    "controlId": "C0191"
  },
  {
    "hazardId": "H025",
    "controlId": "C0361"
  },
  {
    "hazardId": "H025",
    "controlId": "C0362"
  },
  {
    "hazardId": "H028",
    "controlId": "C0107"
  },
  {
    "hazardId": "H029",
    "controlId": "C0132"
  },
  {
    "hazardId": "H029",
    "controlId": "C0381"
  },
  {
    "hazardId": "H031",
    "controlId": "C0100"
  },
  {
    "hazardId": "H031",
    "controlId": "C0101"
  },
  {
    "hazardId": "H031",
    "controlId": "C0333"
  },
  {
    "hazardId": "H031",
    "controlId": "C0334"
  },
  {
    "hazardId": "H032",
    "controlId": "C0059"
  },
  {
    "hazardId": "H032",
    "controlId": "C0060"
  },
  {
    "hazardId": "H032",
    "controlId": "C0063"
  },
  {
    "hazardId": "H032",
    "controlId": "C0064"
  },
  {
    "hazardId": "H032",
    "controlId": "C0065"
  },
  {
    "hazardId": "H032",
    "controlId": "C0066"
  },
  {
    "hazardId": "H032",
    "controlId": "C0067"
  },
  {
    "hazardId": "H032",
    "controlId": "C0127"
  },
  {
    "hazardId": "H032",
    "controlId": "C0134"
  },
  {
    "hazardId": "H032",
    "controlId": "C0135"
  },
  {
    "hazardId": "H032",
    "controlId": "C0136"
  },
  {
    "hazardId": "H032",
    "controlId": "C0137"
  },
  {
    "hazardId": "H032",
    "controlId": "C0138"
  },
  {
    "hazardId": "H032",
    "controlId": "C0186"
  },
  {
    "hazardId": "H032",
    "controlId": "C0246"
  },
  {
    "hazardId": "H032",
    "controlId": "C0249"
  },
  {
    "hazardId": "H032",
    "controlId": "C0250"
  },
  {
    "hazardId": "H032",
    "controlId": "C0251"
  },
  {
    "hazardId": "H032",
    "controlId": "C0252"
  },
  {
    "hazardId": "H032",
    "controlId": "C0253"
  },
  {
    "hazardId": "H032",
    "controlId": "C0278"
  },
  {
    "hazardId": "H033",
    "controlId": "C0025"
  },
  {
    "hazardId": "H033",
    "controlId": "C0026"
  },
  {
    "hazardId": "H033",
    "controlId": "C0027"
  },
  {
    "hazardId": "H033",
    "controlId": "C0036"
  },
  {
    "hazardId": "H033",
    "controlId": "C0246"
  },
  {
    "hazardId": "H033",
    "controlId": "C0279"
  },
  {
    "hazardId": "H033",
    "controlId": "C0280"
  },
  {
    "hazardId": "H033",
    "controlId": "C0381"
  },
  {
    "hazardId": "H034",
    "controlId": "C0025"
  },
  {
    "hazardId": "H034",
    "controlId": "C0026"
  },
  {
    "hazardId": "H034",
    "controlId": "C0027"
  },
  {
    "hazardId": "H034",
    "controlId": "C0036"
  },
  {
    "hazardId": "H034",
    "controlId": "C0246"
  },
  {
    "hazardId": "H034",
    "controlId": "C0247"
  },
  {
    "hazardId": "H034",
    "controlId": "C0254"
  },
  {
    "hazardId": "H034",
    "controlId": "C0278"
  },
  {
    "hazardId": "H034",
    "controlId": "C0279"
  },
  {
    "hazardId": "H034",
    "controlId": "C0280"
  },
  {
    "hazardId": "H034",
    "controlId": "C0347"
  },
  {
    "hazardId": "H036",
    "controlId": "C0342"
  },
  {
    "hazardId": "H036",
    "controlId": "C0398"
  },
  {
    "hazardId": "H037",
    "controlId": "C0010"
  },
  {
    "hazardId": "H037",
    "controlId": "C0011"
  },
  {
    "hazardId": "H037",
    "controlId": "C0012"
  },
  {
    "hazardId": "H037",
    "controlId": "C0013"
  },
  {
    "hazardId": "H038",
    "controlId": "C0088"
  },
  {
    "hazardId": "H038",
    "controlId": "C0089"
  },
  {
    "hazardId": "H038",
    "controlId": "C0090"
  },
  {
    "hazardId": "H038",
    "controlId": "C0091"
  },
  {
    "hazardId": "H038",
    "controlId": "C0097"
  },
  {
    "hazardId": "H038",
    "controlId": "C0183"
  },
  {
    "hazardId": "H038",
    "controlId": "C0282"
  },
  {
    "hazardId": "H038",
    "controlId": "C0341"
  },
  {
    "hazardId": "H038",
    "controlId": "C0360"
  },
  {
    "hazardId": "H038",
    "controlId": "C0395"
  },
  {
    "hazardId": "H039",
    "controlId": "C0036"
  },
  {
    "hazardId": "H039",
    "controlId": "C0088"
  },
  {
    "hazardId": "H039",
    "controlId": "C0089"
  },
  {
    "hazardId": "H039",
    "controlId": "C0090"
  },
  {
    "hazardId": "H039",
    "controlId": "C0091"
  },
  {
    "hazardId": "H039",
    "controlId": "C0281"
  },
  {
    "hazardId": "H039",
    "controlId": "C0342"
  },
  {
    "hazardId": "H039",
    "controlId": "C0343"
  },
  {
    "hazardId": "H039",
    "controlId": "C0344"
  },
  {
    "hazardId": "H039",
    "controlId": "C0345"
  },
  {
    "hazardId": "H041",
    "controlId": "C0032"
  },
  {
    "hazardId": "H041",
    "controlId": "C0033"
  },
  {
    "hazardId": "H041",
    "controlId": "C0034"
  },
  {
    "hazardId": "H041",
    "controlId": "C0246"
  },
  {
    "hazardId": "H042",
    "controlId": "C0057"
  },
  {
    "hazardId": "H042",
    "controlId": "C0174"
  },
  {
    "hazardId": "H042",
    "controlId": "C0175"
  },
  {
    "hazardId": "H042",
    "controlId": "C0176"
  },
  {
    "hazardId": "H042",
    "controlId": "C0177"
  },
  {
    "hazardId": "H042",
    "controlId": "C0178"
  },
  {
    "hazardId": "H042",
    "controlId": "C0179"
  },
  {
    "hazardId": "H042",
    "controlId": "C0180"
  },
  {
    "hazardId": "H042",
    "controlId": "C0181"
  },
  {
    "hazardId": "H042",
    "controlId": "C0182"
  },
  {
    "hazardId": "H042",
    "controlId": "C0187"
  },
  {
    "hazardId": "H042",
    "controlId": "C0190"
  },
  {
    "hazardId": "H042",
    "controlId": "C0267"
  },
  {
    "hazardId": "H043",
    "controlId": "C0025"
  },
  {
    "hazardId": "H043",
    "controlId": "C0026"
  },
  {
    "hazardId": "H043",
    "controlId": "C0027"
  },
  {
    "hazardId": "H043",
    "controlId": "C0096"
  },
  {
    "hazardId": "H043",
    "controlId": "C0101"
  },
  {
    "hazardId": "H043",
    "controlId": "C0361"
  },
  {
    "hazardId": "H043",
    "controlId": "C0362"
  },
  {
    "hazardId": "H043",
    "controlId": "C0381"
  },
  {
    "hazardId": "H044",
    "controlId": "C0039"
  },
  {
    "hazardId": "H044",
    "controlId": "C0040"
  },
  {
    "hazardId": "H044",
    "controlId": "C0057"
  },
  {
    "hazardId": "H044",
    "controlId": "C0248"
  },
  {
    "hazardId": "H044",
    "controlId": "C0265"
  },
  {
    "hazardId": "H044",
    "controlId": "C0288"
  },
  {
    "hazardId": "H044",
    "controlId": "C0290"
  },
  {
    "hazardId": "H044",
    "controlId": "C0292"
  },
  {
    "hazardId": "H044",
    "controlId": "C0293"
  },
  {
    "hazardId": "H044",
    "controlId": "C0361"
  },
  {
    "hazardId": "H044",
    "controlId": "C0362"
  },
  {
    "hazardId": "H047",
    "controlId": "C0039"
  },
  {
    "hazardId": "H047",
    "controlId": "C0040"
  },
  {
    "hazardId": "H047",
    "controlId": "C0110"
  },
  {
    "hazardId": "H047",
    "controlId": "C0111"
  },
  {
    "hazardId": "H047",
    "controlId": "C0166"
  },
  {
    "hazardId": "H047",
    "controlId": "C0167"
  },
  {
    "hazardId": "H047",
    "controlId": "C0191"
  },
  {
    "hazardId": "H047",
    "controlId": "C0264"
  },
  {
    "hazardId": "H047",
    "controlId": "C0327"
  },
  {
    "hazardId": "H047",
    "controlId": "C0385"
  },
  {
    "hazardId": "H047",
    "controlId": "C0396"
  },
  {
    "hazardId": "H049",
    "controlId": "C0036"
  },
  {
    "hazardId": "H049",
    "controlId": "C0277"
  },
  {
    "hazardId": "H049",
    "controlId": "C0365"
  },
  {
    "hazardId": "H049",
    "controlId": "C0376"
  },
  {
    "hazardId": "H049",
    "controlId": "C0379"
  },
  {
    "hazardId": "H049",
    "controlId": "C0380"
  },
  {
    "hazardId": "H050",
    "controlId": "C0057"
  },
  {
    "hazardId": "H050",
    "controlId": "C0191"
  },
  {
    "hazardId": "H050",
    "controlId": "C0295"
  },
  {
    "hazardId": "H050",
    "controlId": "C0346"
  },
  {
    "hazardId": "H050",
    "controlId": "C0348"
  },
  {
    "hazardId": "H050",
    "controlId": "C0349"
  },
  {
    "hazardId": "H050",
    "controlId": "C0350"
  },
  {
    "hazardId": "H050",
    "controlId": "C0351"
  },
  {
    "hazardId": "H050",
    "controlId": "C0352"
  },
  {
    "hazardId": "H050",
    "controlId": "C0353"
  },
  {
    "hazardId": "H050",
    "controlId": "C0355"
  },
  {
    "hazardId": "H050",
    "controlId": "C0356"
  },
  {
    "hazardId": "H050",
    "controlId": "C0357"
  },
  {
    "hazardId": "H051",
    "controlId": "C0141"
  },
  {
    "hazardId": "H051",
    "controlId": "C0142"
  },
  {
    "hazardId": "H051",
    "controlId": "C0143"
  },
  {
    "hazardId": "H051",
    "controlId": "C0144"
  },
  {
    "hazardId": "H051",
    "controlId": "C0145"
  },
  {
    "hazardId": "H051",
    "controlId": "C0150"
  },
  {
    "hazardId": "H051",
    "controlId": "C0151"
  },
  {
    "hazardId": "H051",
    "controlId": "C0152"
  },
  {
    "hazardId": "H051",
    "controlId": "C0157"
  },
  {
    "hazardId": "H051",
    "controlId": "C0159"
  },
  {
    "hazardId": "H051",
    "controlId": "C0160"
  },
  {
    "hazardId": "H051",
    "controlId": "C0161"
  },
  {
    "hazardId": "H051",
    "controlId": "C0168"
  },
  {
    "hazardId": "H051",
    "controlId": "C0169"
  },
  {
    "hazardId": "H051",
    "controlId": "C0170"
  },
  {
    "hazardId": "H051",
    "controlId": "C0174"
  },
  {
    "hazardId": "H051",
    "controlId": "C0175"
  },
  {
    "hazardId": "H051",
    "controlId": "C0191"
  },
  {
    "hazardId": "H051",
    "controlId": "C0210"
  },
  {
    "hazardId": "H051",
    "controlId": "C0231"
  },
  {
    "hazardId": "H051",
    "controlId": "C0232"
  },
  {
    "hazardId": "H051",
    "controlId": "C0233"
  },
  {
    "hazardId": "H051",
    "controlId": "C0234"
  },
  {
    "hazardId": "H051",
    "controlId": "C0257"
  },
  {
    "hazardId": "H051",
    "controlId": "C0259"
  },
  {
    "hazardId": "H051",
    "controlId": "C0260"
  },
  {
    "hazardId": "H051",
    "controlId": "C0360"
  },
  {
    "hazardId": "H052",
    "controlId": "C0092"
  },
  {
    "hazardId": "H052",
    "controlId": "C0094"
  },
  {
    "hazardId": "H052",
    "controlId": "C0095"
  },
  {
    "hazardId": "H052",
    "controlId": "C0115"
  },
  {
    "hazardId": "H052",
    "controlId": "C0116"
  },
  {
    "hazardId": "H052",
    "controlId": "C0117"
  },
  {
    "hazardId": "H052",
    "controlId": "C0118"
  },
  {
    "hazardId": "H052",
    "controlId": "C0119"
  },
  {
    "hazardId": "H052",
    "controlId": "C0120"
  },
  {
    "hazardId": "H052",
    "controlId": "C0121"
  },
  {
    "hazardId": "H052",
    "controlId": "C0246"
  },
  {
    "hazardId": "H052",
    "controlId": "C0304"
  },
  {
    "hazardId": "H053",
    "controlId": "C0338"
  },
  {
    "hazardId": "H054",
    "controlId": "C0018"
  },
  {
    "hazardId": "H054",
    "controlId": "C0212"
  },
  {
    "hazardId": "H054",
    "controlId": "C0213"
  },
  {
    "hazardId": "H054",
    "controlId": "C0214"
  },
  {
    "hazardId": "H054",
    "controlId": "C0246"
  },
  {
    "hazardId": "H055",
    "controlId": "C0141"
  },
  {
    "hazardId": "H055",
    "controlId": "C0142"
  },
  {
    "hazardId": "H055",
    "controlId": "C0143"
  },
  {
    "hazardId": "H055",
    "controlId": "C0144"
  },
  {
    "hazardId": "H055",
    "controlId": "C0145"
  },
  {
    "hazardId": "H055",
    "controlId": "C0255"
  },
  {
    "hazardId": "H055",
    "controlId": "C0257"
  },
  {
    "hazardId": "H055",
    "controlId": "C0259"
  },
  {
    "hazardId": "H055",
    "controlId": "C0260"
  },
  {
    "hazardId": "H055",
    "controlId": "C0261"
  },
  {
    "hazardId": "H055",
    "controlId": "C0264"
  },
  {
    "hazardId": "H055",
    "controlId": "C0328"
  },
  {
    "hazardId": "H055",
    "controlId": "C0354"
  },
  {
    "hazardId": "H056",
    "controlId": "C0036"
  },
  {
    "hazardId": "H056",
    "controlId": "C0096"
  },
  {
    "hazardId": "H056",
    "controlId": "C0171"
  },
  {
    "hazardId": "H056",
    "controlId": "C0172"
  },
  {
    "hazardId": "H056",
    "controlId": "C0173"
  },
  {
    "hazardId": "H056",
    "controlId": "C0256"
  },
  {
    "hazardId": "H056",
    "controlId": "C0263"
  },
  {
    "hazardId": "H057",
    "controlId": "C0037"
  },
  {
    "hazardId": "H057",
    "controlId": "C0209"
  },
  {
    "hazardId": "H057",
    "controlId": "C0211"
  },
  {
    "hazardId": "H057",
    "controlId": "C0215"
  },
  {
    "hazardId": "H057",
    "controlId": "C0216"
  },
  {
    "hazardId": "H057",
    "controlId": "C0217"
  },
  {
    "hazardId": "H057",
    "controlId": "C0218"
  },
  {
    "hazardId": "H057",
    "controlId": "C0219"
  },
  {
    "hazardId": "H057",
    "controlId": "C0220"
  },
  {
    "hazardId": "H057",
    "controlId": "C0221"
  },
  {
    "hazardId": "H057",
    "controlId": "C0226"
  },
  {
    "hazardId": "H057",
    "controlId": "C0227"
  },
  {
    "hazardId": "H059",
    "controlId": "C0195"
  },
  {
    "hazardId": "H059",
    "controlId": "C0196"
  },
  {
    "hazardId": "H059",
    "controlId": "C0197"
  },
  {
    "hazardId": "H063",
    "controlId": "C0174"
  },
  {
    "hazardId": "H063",
    "controlId": "C0175"
  },
  {
    "hazardId": "H063",
    "controlId": "C0361"
  },
  {
    "hazardId": "H063",
    "controlId": "C0362"
  },
  {
    "hazardId": "H064",
    "controlId": "C0361"
  },
  {
    "hazardId": "H064",
    "controlId": "C0362"
  },
  {
    "hazardId": "H064",
    "controlId": "C0388"
  },
  {
    "hazardId": "H065",
    "controlId": "C0146"
  },
  {
    "hazardId": "H065",
    "controlId": "C0147"
  },
  {
    "hazardId": "H065",
    "controlId": "C0148"
  },
  {
    "hazardId": "H065",
    "controlId": "C0149"
  },
  {
    "hazardId": "H065",
    "controlId": "C0191"
  },
  {
    "hazardId": "H065",
    "controlId": "C0265"
  },
  {
    "hazardId": "H066",
    "controlId": "C0010"
  },
  {
    "hazardId": "H066",
    "controlId": "C0011"
  },
  {
    "hazardId": "H066",
    "controlId": "C0012"
  },
  {
    "hazardId": "H066",
    "controlId": "C0013"
  },
  {
    "hazardId": "H066",
    "controlId": "C0028"
  },
  {
    "hazardId": "H066",
    "controlId": "C0029"
  },
  {
    "hazardId": "H066",
    "controlId": "C0030"
  },
  {
    "hazardId": "H066",
    "controlId": "C0031"
  },
  {
    "hazardId": "H066",
    "controlId": "C0132"
  },
  {
    "hazardId": "H066",
    "controlId": "C0133"
  },
  {
    "hazardId": "H066",
    "controlId": "C0368"
  },
  {
    "hazardId": "H067",
    "controlId": "C0057"
  },
  {
    "hazardId": "H067",
    "controlId": "C0267"
  },
  {
    "hazardId": "H067",
    "controlId": "C0268"
  },
  {
    "hazardId": "H067",
    "controlId": "C0269"
  },
  {
    "hazardId": "H067",
    "controlId": "C0270"
  },
  {
    "hazardId": "H067",
    "controlId": "C0271"
  },
  {
    "hazardId": "H067",
    "controlId": "C0272"
  },
  {
    "hazardId": "H067",
    "controlId": "C0273"
  },
  {
    "hazardId": "H067",
    "controlId": "C0274"
  },
  {
    "hazardId": "H067",
    "controlId": "C0275"
  },
  {
    "hazardId": "H067",
    "controlId": "C0276"
  },
  {
    "hazardId": "H067",
    "controlId": "C0313"
  },
  {
    "hazardId": "H067",
    "controlId": "C0340"
  },
  {
    "hazardId": "H067",
    "controlId": "C0361"
  },
  {
    "hazardId": "H067",
    "controlId": "C0362"
  },
  {
    "hazardId": "H068",
    "controlId": "C0390"
  },
  {
    "hazardId": "H069",
    "controlId": "C0057"
  },
  {
    "hazardId": "H069",
    "controlId": "C0235"
  },
  {
    "hazardId": "H070",
    "controlId": "C0289"
  },
  {
    "hazardId": "H070",
    "controlId": "C0291"
  },
  {
    "hazardId": "H070",
    "controlId": "C0296"
  },
  {
    "hazardId": "H070",
    "controlId": "C0297"
  },
  {
    "hazardId": "H070",
    "controlId": "C0298"
  },
  {
    "hazardId": "H070",
    "controlId": "C0299"
  },
  {
    "hazardId": "H070",
    "controlId": "C0300"
  },
  {
    "hazardId": "H070",
    "controlId": "C0301"
  },
  {
    "hazardId": "H070",
    "controlId": "C0323"
  },
  {
    "hazardId": "H070",
    "controlId": "C0324"
  },
  {
    "hazardId": "H070",
    "controlId": "C0325"
  },
  {
    "hazardId": "H070",
    "controlId": "C0326"
  },
  {
    "hazardId": "H070",
    "controlId": "C0327"
  },
  {
    "hazardId": "H070",
    "controlId": "C0329"
  },
  {
    "hazardId": "H070",
    "controlId": "C0330"
  },
  {
    "hazardId": "H070",
    "controlId": "C0360"
  },
  {
    "hazardId": "H071",
    "controlId": "C0323"
  },
  {
    "hazardId": "H071",
    "controlId": "C0324"
  },
  {
    "hazardId": "H071",
    "controlId": "C0325"
  },
  {
    "hazardId": "H071",
    "controlId": "C0326"
  },
  {
    "hazardId": "H071",
    "controlId": "C0327"
  },
  {
    "hazardId": "H073",
    "controlId": "C0025"
  },
  {
    "hazardId": "H073",
    "controlId": "C0026"
  },
  {
    "hazardId": "H073",
    "controlId": "C0027"
  },
  {
    "hazardId": "H073",
    "controlId": "C0163"
  },
  {
    "hazardId": "H074",
    "controlId": "C0296"
  },
  {
    "hazardId": "H074",
    "controlId": "C0297"
  },
  {
    "hazardId": "H074",
    "controlId": "C0298"
  },
  {
    "hazardId": "H074",
    "controlId": "C0299"
  },
  {
    "hazardId": "H074",
    "controlId": "C0300"
  },
  {
    "hazardId": "H074",
    "controlId": "C0301"
  },
  {
    "hazardId": "H074",
    "controlId": "C0321"
  },
  {
    "hazardId": "H074",
    "controlId": "C0323"
  },
  {
    "hazardId": "H074",
    "controlId": "C0324"
  },
  {
    "hazardId": "H074",
    "controlId": "C0325"
  },
  {
    "hazardId": "H074",
    "controlId": "C0326"
  },
  {
    "hazardId": "H074",
    "controlId": "C0327"
  },
  {
    "hazardId": "H074",
    "controlId": "C0329"
  },
  {
    "hazardId": "H074",
    "controlId": "C0330"
  },
  {
    "hazardId": "H074",
    "controlId": "C0331"
  },
  {
    "hazardId": "H074",
    "controlId": "C0353"
  },
  {
    "hazardId": "H074",
    "controlId": "C0355"
  },
  {
    "hazardId": "H074",
    "controlId": "C0356"
  },
  {
    "hazardId": "H074",
    "controlId": "C0357"
  },
  {
    "hazardId": "H075",
    "controlId": "C0141"
  },
  {
    "hazardId": "H075",
    "controlId": "C0142"
  },
  {
    "hazardId": "H075",
    "controlId": "C0143"
  },
  {
    "hazardId": "H075",
    "controlId": "C0144"
  },
  {
    "hazardId": "H075",
    "controlId": "C0145"
  },
  {
    "hazardId": "H075",
    "controlId": "C0257"
  },
  {
    "hazardId": "H075",
    "controlId": "C0259"
  },
  {
    "hazardId": "H075",
    "controlId": "C0260"
  },
  {
    "hazardId": "H075",
    "controlId": "C0289"
  },
  {
    "hazardId": "H075",
    "controlId": "C0292"
  },
  {
    "hazardId": "H075",
    "controlId": "C0294"
  },
  {
    "hazardId": "H075",
    "controlId": "C0296"
  },
  {
    "hazardId": "H075",
    "controlId": "C0297"
  },
  {
    "hazardId": "H075",
    "controlId": "C0298"
  },
  {
    "hazardId": "H075",
    "controlId": "C0299"
  },
  {
    "hazardId": "H075",
    "controlId": "C0300"
  },
  {
    "hazardId": "H075",
    "controlId": "C0301"
  },
  {
    "hazardId": "H075",
    "controlId": "C0348"
  },
  {
    "hazardId": "H075",
    "controlId": "C0349"
  },
  {
    "hazardId": "H075",
    "controlId": "C0350"
  },
  {
    "hazardId": "H075",
    "controlId": "C0351"
  },
  {
    "hazardId": "H075",
    "controlId": "C0352"
  },
  {
    "hazardId": "H075",
    "controlId": "C0353"
  },
  {
    "hazardId": "H075",
    "controlId": "C0355"
  },
  {
    "hazardId": "H075",
    "controlId": "C0356"
  },
  {
    "hazardId": "H075",
    "controlId": "C0357"
  },
  {
    "hazardId": "H075",
    "controlId": "C0358"
  },
  {
    "hazardId": "H076",
    "controlId": "C0296"
  },
  {
    "hazardId": "H076",
    "controlId": "C0297"
  },
  {
    "hazardId": "H076",
    "controlId": "C0298"
  },
  {
    "hazardId": "H076",
    "controlId": "C0299"
  },
  {
    "hazardId": "H076",
    "controlId": "C0300"
  },
  {
    "hazardId": "H076",
    "controlId": "C0301"
  },
  {
    "hazardId": "H076",
    "controlId": "C0322"
  },
  {
    "hazardId": "H077",
    "controlId": "C0093"
  },
  {
    "hazardId": "H077",
    "controlId": "C0128"
  },
  {
    "hazardId": "H077",
    "controlId": "C0129"
  },
  {
    "hazardId": "H077",
    "controlId": "C0258"
  },
  {
    "hazardId": "H077",
    "controlId": "C0264"
  },
  {
    "hazardId": "H077",
    "controlId": "C0296"
  },
  {
    "hazardId": "H077",
    "controlId": "C0297"
  },
  {
    "hazardId": "H077",
    "controlId": "C0298"
  },
  {
    "hazardId": "H077",
    "controlId": "C0299"
  },
  {
    "hazardId": "H077",
    "controlId": "C0300"
  },
  {
    "hazardId": "H077",
    "controlId": "C0301"
  },
  {
    "hazardId": "H077",
    "controlId": "C0316"
  },
  {
    "hazardId": "H077",
    "controlId": "C0323"
  },
  {
    "hazardId": "H077",
    "controlId": "C0324"
  },
  {
    "hazardId": "H077",
    "controlId": "C0325"
  },
  {
    "hazardId": "H077",
    "controlId": "C0326"
  },
  {
    "hazardId": "H077",
    "controlId": "C0327"
  },
  {
    "hazardId": "H077",
    "controlId": "C0329"
  },
  {
    "hazardId": "H077",
    "controlId": "C0330"
  },
  {
    "hazardId": "H077",
    "controlId": "C0353"
  },
  {
    "hazardId": "H077",
    "controlId": "C0355"
  },
  {
    "hazardId": "H077",
    "controlId": "C0356"
  },
  {
    "hazardId": "H077",
    "controlId": "C0357"
  },
  {
    "hazardId": "H077",
    "controlId": "C0359"
  },
  {
    "hazardId": "H078",
    "controlId": "C0096"
  },
  {
    "hazardId": "H078",
    "controlId": "C0191"
  },
  {
    "hazardId": "H078",
    "controlId": "C0296"
  },
  {
    "hazardId": "H078",
    "controlId": "C0297"
  },
  {
    "hazardId": "H078",
    "controlId": "C0298"
  },
  {
    "hazardId": "H078",
    "controlId": "C0299"
  },
  {
    "hazardId": "H078",
    "controlId": "C0300"
  },
  {
    "hazardId": "H078",
    "controlId": "C0301"
  },
  {
    "hazardId": "H078",
    "controlId": "C0333"
  },
  {
    "hazardId": "H078",
    "controlId": "C0334"
  },
  {
    "hazardId": "H078",
    "controlId": "C0335"
  },
  {
    "hazardId": "H078",
    "controlId": "C0336"
  },
  {
    "hazardId": "H078",
    "controlId": "C0337"
  },
  {
    "hazardId": "H078",
    "controlId": "C0339"
  },
  {
    "hazardId": "H078",
    "controlId": "C0353"
  },
  {
    "hazardId": "H078",
    "controlId": "C0355"
  },
  {
    "hazardId": "H078",
    "controlId": "C0356"
  },
  {
    "hazardId": "H078",
    "controlId": "C0357"
  },
  {
    "hazardId": "H078",
    "controlId": "C0360"
  },
  {
    "hazardId": "H078",
    "controlId": "C0398"
  },
  {
    "hazardId": "H079",
    "controlId": "C0024"
  },
  {
    "hazardId": "H079",
    "controlId": "C0377"
  },
  {
    "hazardId": "H079",
    "controlId": "C0378"
  },
  {
    "hazardId": "H079",
    "controlId": "C0383"
  },
  {
    "hazardId": "H083",
    "controlId": "C0025"
  },
  {
    "hazardId": "H083",
    "controlId": "C0026"
  },
  {
    "hazardId": "H083",
    "controlId": "C0027"
  },
  {
    "hazardId": "H083",
    "controlId": "C0032"
  },
  {
    "hazardId": "H083",
    "controlId": "C0033"
  },
  {
    "hazardId": "H083",
    "controlId": "C0034"
  },
  {
    "hazardId": "H083",
    "controlId": "C0036"
  },
  {
    "hazardId": "H083",
    "controlId": "C0134"
  },
  {
    "hazardId": "H083",
    "controlId": "C0135"
  },
  {
    "hazardId": "H083",
    "controlId": "C0136"
  },
  {
    "hazardId": "H083",
    "controlId": "C0137"
  },
  {
    "hazardId": "H083",
    "controlId": "C0138"
  },
  {
    "hazardId": "H083",
    "controlId": "C0333"
  },
  {
    "hazardId": "H083",
    "controlId": "C0334"
  },
  {
    "hazardId": "H083",
    "controlId": "C0339"
  },
  {
    "hazardId": "H084",
    "controlId": "C0025"
  },
  {
    "hazardId": "H084",
    "controlId": "C0026"
  },
  {
    "hazardId": "H084",
    "controlId": "C0027"
  },
  {
    "hazardId": "H084",
    "controlId": "C0092"
  },
  {
    "hazardId": "H084",
    "controlId": "C0094"
  },
  {
    "hazardId": "H084",
    "controlId": "C0095"
  },
  {
    "hazardId": "H084",
    "controlId": "C0096"
  },
  {
    "hazardId": "H084",
    "controlId": "C0115"
  },
  {
    "hazardId": "H084",
    "controlId": "C0116"
  },
  {
    "hazardId": "H084",
    "controlId": "C0118"
  },
  {
    "hazardId": "H084",
    "controlId": "C0119"
  },
  {
    "hazardId": "H084",
    "controlId": "C0120"
  },
  {
    "hazardId": "H084",
    "controlId": "C0121"
  },
  {
    "hazardId": "H084",
    "controlId": "C0128"
  },
  {
    "hazardId": "H084",
    "controlId": "C0129"
  },
  {
    "hazardId": "H084",
    "controlId": "C0134"
  },
  {
    "hazardId": "H084",
    "controlId": "C0135"
  },
  {
    "hazardId": "H084",
    "controlId": "C0136"
  },
  {
    "hazardId": "H084",
    "controlId": "C0137"
  },
  {
    "hazardId": "H084",
    "controlId": "C0138"
  },
  {
    "hazardId": "H084",
    "controlId": "C0171"
  },
  {
    "hazardId": "H084",
    "controlId": "C0172"
  },
  {
    "hazardId": "H084",
    "controlId": "C0173"
  },
  {
    "hazardId": "H084",
    "controlId": "C0295"
  },
  {
    "hazardId": "H084",
    "controlId": "C0303"
  },
  {
    "hazardId": "H084",
    "controlId": "C0308"
  },
  {
    "hazardId": "H084",
    "controlId": "C0333"
  },
  {
    "hazardId": "H084",
    "controlId": "C0334"
  },
  {
    "hazardId": "H084",
    "controlId": "C0335"
  },
  {
    "hazardId": "H084",
    "controlId": "C0336"
  },
  {
    "hazardId": "H084",
    "controlId": "C0337"
  },
  {
    "hazardId": "H084",
    "controlId": "C0339"
  },
  {
    "hazardId": "H084",
    "controlId": "C0348"
  },
  {
    "hazardId": "H084",
    "controlId": "C0349"
  },
  {
    "hazardId": "H084",
    "controlId": "C0350"
  },
  {
    "hazardId": "H084",
    "controlId": "C0351"
  },
  {
    "hazardId": "H084",
    "controlId": "C0352"
  },
  {
    "hazardId": "H084",
    "controlId": "C0353"
  },
  {
    "hazardId": "H084",
    "controlId": "C0355"
  },
  {
    "hazardId": "H084",
    "controlId": "C0356"
  },
  {
    "hazardId": "H084",
    "controlId": "C0357"
  },
  {
    "hazardId": "H084",
    "controlId": "C0358"
  },
  {
    "hazardId": "H084",
    "controlId": "C0360"
  },
  {
    "hazardId": "H084",
    "controlId": "C0397"
  },
  {
    "hazardId": "H085",
    "controlId": "C0001"
  },
  {
    "hazardId": "H085",
    "controlId": "C0002"
  },
  {
    "hazardId": "H085",
    "controlId": "C0003"
  },
  {
    "hazardId": "H085",
    "controlId": "C0004"
  },
  {
    "hazardId": "H085",
    "controlId": "C0005"
  },
  {
    "hazardId": "H085",
    "controlId": "C0006"
  },
  {
    "hazardId": "H085",
    "controlId": "C0007"
  },
  {
    "hazardId": "H085",
    "controlId": "C0008"
  },
  {
    "hazardId": "H085",
    "controlId": "C0019"
  },
  {
    "hazardId": "H085",
    "controlId": "C0020"
  },
  {
    "hazardId": "H085",
    "controlId": "C0021"
  },
  {
    "hazardId": "H085",
    "controlId": "C0036"
  },
  {
    "hazardId": "H085",
    "controlId": "C0069"
  },
  {
    "hazardId": "H085",
    "controlId": "C0070"
  },
  {
    "hazardId": "H085",
    "controlId": "C0071"
  },
  {
    "hazardId": "H085",
    "controlId": "C0072"
  },
  {
    "hazardId": "H085",
    "controlId": "C0073"
  },
  {
    "hazardId": "H085",
    "controlId": "C0074"
  },
  {
    "hazardId": "H085",
    "controlId": "C0075"
  },
  {
    "hazardId": "H085",
    "controlId": "C0076"
  },
  {
    "hazardId": "H085",
    "controlId": "C0077"
  },
  {
    "hazardId": "H085",
    "controlId": "C0078"
  },
  {
    "hazardId": "H085",
    "controlId": "C0079"
  },
  {
    "hazardId": "H085",
    "controlId": "C0080"
  },
  {
    "hazardId": "H085",
    "controlId": "C0081"
  },
  {
    "hazardId": "H085",
    "controlId": "C0082"
  },
  {
    "hazardId": "H085",
    "controlId": "C0083"
  },
  {
    "hazardId": "H085",
    "controlId": "C0084"
  },
  {
    "hazardId": "H085",
    "controlId": "C0085"
  },
  {
    "hazardId": "H085",
    "controlId": "C0086"
  },
  {
    "hazardId": "H085",
    "controlId": "C0087"
  },
  {
    "hazardId": "H085",
    "controlId": "C0123"
  },
  {
    "hazardId": "H085",
    "controlId": "C0125"
  },
  {
    "hazardId": "H085",
    "controlId": "C0386"
  },
  {
    "hazardId": "H085",
    "controlId": "C0387"
  },
  {
    "hazardId": "H085",
    "controlId": "C0389"
  },
  {
    "hazardId": "H086",
    "controlId": "C0025"
  },
  {
    "hazardId": "H086",
    "controlId": "C0026"
  },
  {
    "hazardId": "H086",
    "controlId": "C0027"
  },
  {
    "hazardId": "H086",
    "controlId": "C0063"
  },
  {
    "hazardId": "H086",
    "controlId": "C0064"
  },
  {
    "hazardId": "H086",
    "controlId": "C0065"
  },
  {
    "hazardId": "H086",
    "controlId": "C0066"
  },
  {
    "hazardId": "H086",
    "controlId": "C0067"
  },
  {
    "hazardId": "H086",
    "controlId": "C0068"
  },
  {
    "hazardId": "H086",
    "controlId": "C0088"
  },
  {
    "hazardId": "H086",
    "controlId": "C0089"
  },
  {
    "hazardId": "H086",
    "controlId": "C0090"
  },
  {
    "hazardId": "H086",
    "controlId": "C0091"
  },
  {
    "hazardId": "H086",
    "controlId": "C0107"
  },
  {
    "hazardId": "H086",
    "controlId": "C0132"
  },
  {
    "hazardId": "H087",
    "controlId": "C0088"
  },
  {
    "hazardId": "H087",
    "controlId": "C0089"
  },
  {
    "hazardId": "H087",
    "controlId": "C0090"
  },
  {
    "hazardId": "H087",
    "controlId": "C0091"
  },
  {
    "hazardId": "H087",
    "controlId": "C0391"
  },
  {
    "hazardId": "H088",
    "controlId": "C0075"
  },
  {
    "hazardId": "H088",
    "controlId": "C0098"
  },
  {
    "hazardId": "H088",
    "controlId": "C0099"
  },
  {
    "hazardId": "H088",
    "controlId": "C0122"
  },
  {
    "hazardId": "H088",
    "controlId": "C0123"
  },
  {
    "hazardId": "H088",
    "controlId": "C0124"
  },
  {
    "hazardId": "H088",
    "controlId": "C0126"
  },
  {
    "hazardId": "H088",
    "controlId": "C0131"
  },
  {
    "hazardId": "H090",
    "controlId": "C0174"
  },
  {
    "hazardId": "H090",
    "controlId": "C0175"
  },
  {
    "hazardId": "H090",
    "controlId": "C0222"
  },
  {
    "hazardId": "H090",
    "controlId": "C0231"
  },
  {
    "hazardId": "H090",
    "controlId": "C0232"
  },
  {
    "hazardId": "H090",
    "controlId": "C0233"
  },
  {
    "hazardId": "H090",
    "controlId": "C0234"
  },
  {
    "hazardId": "H090",
    "controlId": "C0314"
  },
  {
    "hazardId": "H090",
    "controlId": "C0394"
  },
  {
    "hazardId": "H091",
    "controlId": "C0108"
  },
  {
    "hazardId": "H091",
    "controlId": "C0109"
  },
  {
    "hazardId": "H091",
    "controlId": "C0164"
  },
  {
    "hazardId": "H091",
    "controlId": "C0165"
  },
  {
    "hazardId": "H091",
    "controlId": "C0198"
  },
  {
    "hazardId": "H091",
    "controlId": "C0199"
  },
  {
    "hazardId": "H091",
    "controlId": "C0200"
  },
  {
    "hazardId": "H091",
    "controlId": "C0201"
  },
  {
    "hazardId": "H091",
    "controlId": "C0202"
  },
  {
    "hazardId": "H091",
    "controlId": "C0203"
  },
  {
    "hazardId": "H091",
    "controlId": "C0204"
  },
  {
    "hazardId": "H091",
    "controlId": "C0205"
  },
  {
    "hazardId": "H091",
    "controlId": "C0206"
  },
  {
    "hazardId": "H091",
    "controlId": "C0207"
  },
  {
    "hazardId": "H091",
    "controlId": "C0208"
  },
  {
    "hazardId": "H091",
    "controlId": "C0223"
  },
  {
    "hazardId": "H091",
    "controlId": "C0224"
  },
  {
    "hazardId": "H091",
    "controlId": "C0225"
  },
  {
    "hazardId": "H092",
    "controlId": "C0010"
  },
  {
    "hazardId": "H092",
    "controlId": "C0011"
  },
  {
    "hazardId": "H092",
    "controlId": "C0012"
  },
  {
    "hazardId": "H092",
    "controlId": "C0013"
  },
  {
    "hazardId": "H092",
    "controlId": "C0022"
  },
  {
    "hazardId": "H092",
    "controlId": "C0023"
  },
  {
    "hazardId": "H092",
    "controlId": "C0028"
  },
  {
    "hazardId": "H092",
    "controlId": "C0029"
  },
  {
    "hazardId": "H092",
    "controlId": "C0030"
  },
  {
    "hazardId": "H092",
    "controlId": "C0031"
  },
  {
    "hazardId": "H092",
    "controlId": "C0045"
  },
  {
    "hazardId": "H092",
    "controlId": "C0046"
  },
  {
    "hazardId": "H092",
    "controlId": "C0047"
  },
  {
    "hazardId": "H092",
    "controlId": "C0048"
  },
  {
    "hazardId": "H092",
    "controlId": "C0132"
  },
  {
    "hazardId": "H092",
    "controlId": "C0133"
  },
  {
    "hazardId": "H092",
    "controlId": "C0368"
  },
  {
    "hazardId": "H092",
    "controlId": "C0382"
  },
  {
    "hazardId": "H093",
    "controlId": "C0366"
  },
  {
    "hazardId": "H093",
    "controlId": "C0367"
  },
  {
    "hazardId": "H093",
    "controlId": "C0369"
  },
  {
    "hazardId": "H094",
    "controlId": "C0004"
  },
  {
    "hazardId": "H094",
    "controlId": "C0005"
  },
  {
    "hazardId": "H094",
    "controlId": "C0006"
  },
  {
    "hazardId": "H094",
    "controlId": "C0007"
  },
  {
    "hazardId": "H094",
    "controlId": "C0008"
  },
  {
    "hazardId": "H094",
    "controlId": "C0010"
  },
  {
    "hazardId": "H094",
    "controlId": "C0011"
  },
  {
    "hazardId": "H094",
    "controlId": "C0012"
  },
  {
    "hazardId": "H094",
    "controlId": "C0013"
  },
  {
    "hazardId": "H094",
    "controlId": "C0014"
  },
  {
    "hazardId": "H094",
    "controlId": "C0015"
  },
  {
    "hazardId": "H094",
    "controlId": "C0016"
  },
  {
    "hazardId": "H094",
    "controlId": "C0017"
  },
  {
    "hazardId": "H094",
    "controlId": "C0022"
  },
  {
    "hazardId": "H094",
    "controlId": "C0023"
  },
  {
    "hazardId": "H094",
    "controlId": "C0028"
  },
  {
    "hazardId": "H094",
    "controlId": "C0029"
  },
  {
    "hazardId": "H094",
    "controlId": "C0030"
  },
  {
    "hazardId": "H094",
    "controlId": "C0031"
  },
  {
    "hazardId": "H094",
    "controlId": "C0045"
  },
  {
    "hazardId": "H094",
    "controlId": "C0046"
  },
  {
    "hazardId": "H094",
    "controlId": "C0047"
  },
  {
    "hazardId": "H094",
    "controlId": "C0048"
  },
  {
    "hazardId": "H094",
    "controlId": "C0134"
  },
  {
    "hazardId": "H094",
    "controlId": "C0135"
  },
  {
    "hazardId": "H094",
    "controlId": "C0136"
  },
  {
    "hazardId": "H094",
    "controlId": "C0137"
  },
  {
    "hazardId": "H094",
    "controlId": "C0138"
  },
  {
    "hazardId": "H094",
    "controlId": "C0262"
  },
  {
    "hazardId": "H094",
    "controlId": "C0266"
  },
  {
    "hazardId": "H094",
    "controlId": "C0368"
  },
  {
    "hazardId": "H094",
    "controlId": "C0370"
  },
  {
    "hazardId": "H094",
    "controlId": "C0371"
  },
  {
    "hazardId": "H094",
    "controlId": "C0372"
  },
  {
    "hazardId": "H094",
    "controlId": "C0382"
  },
  {
    "hazardId": "H096",
    "controlId": "C0024"
  },
  {
    "hazardId": "H096",
    "controlId": "C0287"
  },
  {
    "hazardId": "H096",
    "controlId": "C0295"
  },
  {
    "hazardId": "H096",
    "controlId": "C0302"
  },
  {
    "hazardId": "H096",
    "controlId": "C0360"
  },
  {
    "hazardId": "H098",
    "controlId": "C0009"
  },
  {
    "hazardId": "H098",
    "controlId": "C0025"
  },
  {
    "hazardId": "H098",
    "controlId": "C0026"
  },
  {
    "hazardId": "H098",
    "controlId": "C0027"
  },
  {
    "hazardId": "H098",
    "controlId": "C0042"
  },
  {
    "hazardId": "H098",
    "controlId": "C0043"
  },
  {
    "hazardId": "H098",
    "controlId": "C0044"
  },
  {
    "hazardId": "H098",
    "controlId": "C0062"
  },
  {
    "hazardId": "H098",
    "controlId": "C0134"
  },
  {
    "hazardId": "H098",
    "controlId": "C0135"
  },
  {
    "hazardId": "H098",
    "controlId": "C0136"
  },
  {
    "hazardId": "H098",
    "controlId": "C0137"
  },
  {
    "hazardId": "H098",
    "controlId": "C0138"
  },
  {
    "hazardId": "H098",
    "controlId": "C0140"
  },
  {
    "hazardId": "H098",
    "controlId": "C0240"
  },
  {
    "hazardId": "H098",
    "controlId": "C0241"
  },
  {
    "hazardId": "H098",
    "controlId": "C0242"
  },
  {
    "hazardId": "H098",
    "controlId": "C0246"
  },
  {
    "hazardId": "H098",
    "controlId": "C0381"
  },
  {
    "hazardId": "H099",
    "controlId": "C0035"
  },
  {
    "hazardId": "H099",
    "controlId": "C0236"
  },
  {
    "hazardId": "H099",
    "controlId": "C0237"
  },
  {
    "hazardId": "H099",
    "controlId": "C0238"
  },
  {
    "hazardId": "H099",
    "controlId": "C0239"
  },
  {
    "hazardId": "H099",
    "controlId": "C0373"
  },
  {
    "hazardId": "H101",
    "controlId": "C0020"
  },
  {
    "hazardId": "H101",
    "controlId": "C0021"
  },
  {
    "hazardId": "H101",
    "controlId": "C0370"
  },
  {
    "hazardId": "H101",
    "controlId": "C0371"
  },
  {
    "hazardId": "H101",
    "controlId": "C0372"
  },
  {
    "hazardId": "H102",
    "controlId": "C0001"
  },
  {
    "hazardId": "H102",
    "controlId": "C0002"
  },
  {
    "hazardId": "H102",
    "controlId": "C0003"
  },
  {
    "hazardId": "H102",
    "controlId": "C0004"
  },
  {
    "hazardId": "H102",
    "controlId": "C0005"
  },
  {
    "hazardId": "H102",
    "controlId": "C0006"
  },
  {
    "hazardId": "H102",
    "controlId": "C0007"
  },
  {
    "hazardId": "H102",
    "controlId": "C0008"
  }
]

// Derived lookup maps
export const CONTROL_MAP = Object.fromEntries(CONTROLS.map((c) => [c.id, c]))
export const HAZARD_MAP = Object.fromEntries(HAZARDS.map((h) => [h.id, h]))
export const HAZARD_TYPES = [...new Set(HAZARDS.map((h) => h.type).filter(Boolean))] as string[]

// hazardId -> controlIds
export const HAZARD_CONTROLS: Record<string, string[]> = {}
for (const m of MAPPINGS) {
  if (!HAZARD_CONTROLS[m.hazardId]) HAZARD_CONTROLS[m.hazardId] = []
  HAZARD_CONTROLS[m.hazardId].push(m.controlId)
}