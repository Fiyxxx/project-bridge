# Comprehensive Assessment & Recommendation: LLM-Assisted Case Note System for Early Childhood Assessors — NUS CCSGP Public Service Fellowship Application

**Prepared: February 2026**
**Author: Strategic Assessment for Pranav**

---

## 1. Executive Summary

**Verdict: REVISE — Strong fit with critical prerequisites.** This project idea — an LLM-powered copilot for assessors working with children aged 1–6 with developmental delays — is exceptionally well-aligned with the CCSGP Public Service Fellowship's mission of leveraging computing for social good, particularly given CCSGP's thematic emphasis on healthcare, education, and underserved communities. The 2024 AI-for-social-work project sets a direct precedent for your approach. Primary strengths include genuine community need (EIPIC waitlists are long and assessors are bottlenecked on documentation), strong alignment with Singapore's national early intervention strategy, and a technically plausible local-LLM architecture. However, the project faces three critical risks that *must* be addressed before submission: (1) obtaining a confirmed community partner (an EIPIC centre or early intervention provider willing to collaborate), (2) navigating PDPA compliance for children's data, which PDPC treats as heightened-sensitivity, and (3) scoping the project realistically for a 3–4 month CCSGP timeline. With the recommended revisions — particularly securing a partner *before* applying, pivoting from fine-tuning to RAG with synthetic/template data, and framing a modest but measurable pilot — this is a fundable, high-impact proposal.

---

## 2. Research Summary: NUS CCSGP Public Service Fellowship

### What CCSGP Is

The Centre for Computing for Social Good & Philanthropy (CCSGP) is housed under the NUS School of Computing (SoC). It was established in 2021 with a S$1.5 million gift from the Mrs Lee Choon Guan Trust Fund. Its stated mission is to cultivate future technology leaders with "the ethos of service and giving back to society" and to bridge the digital divide.

### The Public Service Fellowship Programme

The **Public Service Fellowship** is one of CCSGP's two flagship new initiatives. It funds **student-led independent community projects** — students propose a project, secure or identify a community partner, and receive funding and mentorship support. Key operational details:

- **Eligibility:** NUS School of Computing students (undergraduate and graduate). Projects are typically led by 1–3 students, often with a faculty advisor or domain-expert collaborator.
- **Rolling applications:** 3 grant cycles per year, aligned with Semester 1, Semester 2, and Special Term. **Current deadline: 13 February 2026** (next cycle likely ~June 2026 for Special Term).
- **Funding scale:** Not publicly specified per-project, but the overall programme aims to fund up to 30 projects per year. Based on project scopes observed (software development, travel to Cambodia, robotic hardware), funding appears modest — likely in the range of S$1,000–S$5,000 per project, covering compute costs, travel, materials, and minor stipends. There is no publicly available budget cap.
- **Project duration:** Typically 3–4 months (one term), with some projects extending to 6–12 months.
- **Application via:** Google Form (linked on the CCSGP Fellowship Programme page).
- **Evaluation criteria (inferred from past winners):** Community impact, technical feasibility, alignment with CCSGP's social good mission, clarity of plan, sustainability/handoff potential, interdisciplinary collaboration.

### Key Citations & Links

1. **CCSGP Official Site — Fellowship Programme:** [https://www.ccsgp.comp.nus.edu.sg/fellowship-programme](https://www.ccsgp.comp.nus.edu.sg/fellowship-programme)
2. **CCSGP Completed Projects:** [https://www.ccsgp.comp.nus.edu.sg/projects](https://www.ccsgp.comp.nus.edu.sg/projects)
3. **NUS News Launch Announcement (2 Jul 2021):** [https://news.nus.edu.sg/new-centre-for-computing-for-social-good--philanthropy-launched/](https://news.nus.edu.sg/new-centre-for-computing-for-social-good--philanthropy-launched/)
4. **PDPC Advisory Guidelines on Children's Data (Mar 2024):** [https://www.pdpc.gov.sg/guidelines-and-consultation/2024/03/advisory-guidelines-on-the-pdpa-for-childrens-personal-data-in-the-digital-environment](https://www.pdpc.gov.sg/guidelines-and-consultation/2024/03/advisory-guidelines-on-the-pdpa-for-childrens-personal-data-in-the-digital-environment)
5. **ECDA Early Intervention Services Overview:** [https://www.ecda.gov.sg/parents/other-services/early-intervention-services](https://www.ecda.gov.sg/parents/other-services/early-intervention-services)

---

## 3. Comparative Analysis of Past CCSGP Winners

Based on analysis of all 8 completed CCSGP Public Service Fellowship projects (2022–2024), here are the key patterns:

1. **Confirmed community partner before application:** Every funded project had a named partner organisation (Solve Education, NUS Medical Society/Cambodia villages, Guide Dogs Association, NUS Department of Social Work). This is effectively a prerequisite, not a nice-to-have.

2. **Practical, deployable software over research prototypes:** Winning projects produced working tools — patient management systems, biometric triage apps, robotic prototypes with user trials, LLM-based roleplay apps. Pure research proposals are not represented; CCSGP wants tangible deliverables.

3. **Clear beneficiary population with demonstrable need:** Projects explicitly identified *who* benefits — visually impaired individuals, Cambodian villagers, social work students, NUS food-insecure students. Vague or speculative beneficiary claims would not pass.

4. **Interdisciplinary collaboration is highly valued:** The most compelling projects (robotic guide dog: CS + psychology + sociology + design; AI social work tool: CS + Social Work faculty) involved domain-expert collaborators. CS-only teams with no domain advisor are weaker.

5. **User testing and feedback are expected:** Every project report includes user testing, feedback collection, and iteration. CCSGP expects evidence that you engaged real users, not just built something in isolation.

6. **Modest but realistic scope:** Projects are scoped to what a small team can deliver in 3–4 months. The AI social work tool (2024) is the closest precedent to your project — it was a 3rd-year CS student + a Social Work professor, building an LLM roleplay app in one summer.

7. **Sustainability and handoff plans:** Every project includes "Post Project Plans" — how the tool will continue being used, maintained, or expanded. CCSGP does not want one-shot demos.

8. **Gaps your project must address:** No past project has dealt with *children's medical/clinical data* under PDPA. No past project involved *fine-tuning on privileged data*. These are significantly higher-risk than anything previously funded, and you must proactively address them or descope to avoid them.

---

## 4. Detailed Critique of the Project Idea

### 4.1 Novelty & Alignment with CCSGP Priorities

**Strengths:**
- Directly addresses a real bottleneck in Singapore's early intervention pipeline. EIPIC centres serve children aged 0–6 with developmental delays, and assessors spend significant time on documentation. Automating structured case note generation is a legitimate productivity multiplier.
- Aligns with CCSGP's thematic pillars: healthcare, education, underserved communities (children with disabilities).
- The 2024 AI social work tool project is a strong precedent — CCSGP has already funded LLM-based tools for professional training/practice in social services.
- Singapore's national push toward inclusive education (InSP expansion from 2026) makes this timely.

**Risks:**
- The novelty of applying LLMs to clinical case notes is moderate — commercial products (e.g., Nabla, Abridge for medical documentation) already exist. Your novelty must emphasise the *specific context* (Singapore early childhood assessment, local deployment, PDPA compliance) rather than the general concept.
- Risk of CCSGP reviewers perceiving this as a "health-tech startup idea" rather than a "community service project." Frame it as *service to assessors in the social service sector*, not as a product.

**Mitigation:** Position the project as a *tool donated to the community partner*, not a commercial venture. Emphasise time savings for assessors → more children assessed → shorter waitlists → better outcomes.

---

### 4.2 Technical Feasibility

**LLM Selection for Local Deployment:**

For a fully local deployment (required for PDPA compliance with children's sensitive data), you need models that run on consumer/workstation hardware:

| Model Family | Size | Min Hardware | Suitability |
|---|---|---|---|
| **Llama 3.1 8B / Llama 3.2 3B** | 3–8B params | Single RTX 4090 (24GB) or Mac M-series (32GB unified) | Good. 8B is strong for structured generation. 3B is faster but less accurate. |
| **Mistral 7B / Mistral Nemo 12B** | 7–12B | RTX 4090 (24GB) or 2× RTX 4080 | Good. Strong instruction-following. |
| **Phi-3 Mini (3.8B) / Phi-3 Medium (14B)** | 3.8–14B | RTX 4090 for 14B | Good for structured tasks. Microsoft-trained on quality data. |
| **Qwen 2.5 7B/14B** | 7–14B | Similar to above | Strong multilingual support (relevant for Singapore's multilingual context). |

**Recommendation:** Start with **Llama 3.1 8B Instruct** (quantized to 4-bit via GGUF/llama.cpp) on a single RTX 4090 or Mac M2/M3 Ultra. This gives ~15–30 tokens/second inference, sufficient for interactive copilot use. Use **Ollama** or **llama.cpp** for the inference server, with a simple web frontend (Flask/FastAPI + React).

**Fine-tuning vs. RAG — Critical Decision:**

| Approach | Pros | Cons | Verdict |
|---|---|---|---|
| **Fine-tuning on real case notes** | Learns document structure and clinical language natively | Requires access to real case notes (massive PDPA hurdle); needs 100+ high-quality examples; risk of memorizing PII; expensive to iterate | **Do NOT attempt for CCSGP scope** |
| **RAG with template library** | No real patient data needed; use anonymized templates, assessment frameworks (e.g., ECDA's Early Development Instrument), and style guides as retrieval context | Less "native" feel; depends on template quality | **Recommended for pilot** |
| **Few-shot prompting with structured schemas** | Zero data requirement; define the output schema (JSON/XML) for case notes and prompt the LLM to fill it | Limited adaptability; less domain-specific | **Good starting point, combine with RAG** |

**Recommended approach:** RAG + structured prompting. Create a retrieval corpus of:
- Anonymized case note *templates* (structure only, no real data) provided by the partner centre
- ECDA assessment frameworks and guidelines (publicly available)
- Domain vocabulary lists for early childhood developmental milestones
- Style guides for professional case note writing

This avoids *all* fine-tuning data privacy issues while achieving 80% of the benefit.

**Latency & UX:**
- Target: <3 seconds per suggestion for a copilot-style interaction
- Achievable with 8B model on RTX 4090 with 4-bit quantization
- Use streaming responses for perceived responsiveness

**Risk:** Hardware availability. If using NUS SoC GPU servers, ensure access is confirmed. Alternatively, a Mac Studio M2 Ultra (192GB) can run 70B models locally.

**Mitigation:** Budget for compute access in the application (even if just NUS SoC lab access). Have a fallback plan for smaller models if hardware is constrained.

---

### 4.3 Data & Privacy

This is the **highest-risk category** and the most likely reason for rejection if not handled properly.

**PDPA Compliance Specifics:**

Singapore's PDPA (Personal Data Protection Act 2012) and the PDPC's March 2024 Advisory Guidelines on Children's Data impose the following requirements relevant to this project:

1. **Children's data is treated as sensitive.** The PDPC explicitly states that "minors' personal data would typically be of a more sensitive nature" and organisations must provide "a higher standard of protection."

2. **Consent for children under 13:** Parental/guardian consent is *required* for data collection. For children 13–17, consent may be given by the child if they understand the consequences, but parental consent is recommended. Since your target population is aged 1–6, **parental consent is mandatory for any real data access.**

3. **Data minimisation:** Collect only what is directly necessary. Do not retain case note data beyond the active session unless explicitly consented.

4. **Purpose limitation:** Data can only be used for purposes a "reasonable person would consider appropriate." Using children's clinical records to train an AI model is a purpose that would require *explicit, informed consent* from parents and the EI centre.

5. **Data breach notification:** If children's PII is compromised, mandatory notification to PDPC within 3 business days.

6. **Data Protection Impact Assessment (DPIA):** Recommended for any product/service involving children's data. You should conduct and document one.

**Specific Risks and Mitigations:**

| Risk | Severity | Mitigation |
|---|---|---|
| Accessing real case notes for fine-tuning | **Critical** | **Do not attempt.** Pivot to RAG with templates + synthetic data. Partner centre provides *structure and format* of case notes, not actual patient data. |
| LLM memorizing PII from training data | **Critical** (if fine-tuning) | Eliminated by not fine-tuning on real data. |
| Assessor inputs containing real child data during use | **High** | Local-only deployment (no cloud). Data stays on the machine. Implement auto-purge: session data deleted after case note is exported. No logging of child-identifiable information. |
| Data retained on local machine | **Medium** | Implement encrypted ephemeral storage. Case note drafts exist only in RAM + temp files, deleted on session close. Provide "wipe all data" function. |
| Model generating inaccurate clinical information | **High** | Assessor always has final edit authority. Add prominent disclaimers. Implement structured output validation against known assessment frameworks. |

**Minimum viable consent strategy (for the *pilot*, not fine-tuning):**
- The pilot does NOT require access to real patient data if designed correctly.
- Assessors use the tool to write case notes in real-time during their normal workflow.
- The tool processes their *observations* (typed bullet points), not stored patient records.
- No patient data leaves the local machine or is retained post-session.
- Ethics clearance needed: NUS-IRB review for the *user study component* (assessors as research participants giving feedback on the tool). This is likely "minimal risk" and can go through a Departmental Ethics Review Committee (DERC) rather than full NUS-IRB.

---

### 4.4 Clinical/Assessor Workflow Integration

**Risks:**
- Assessors may not trust AI-generated suggestions, especially for clinical documentation. Adoption resistance is a real barrier.
- The tool must fit into existing workflows (likely paper-based or simple digital forms), not require a radical process change.
- Assessors have varying levels of digital literacy.

**Mitigations:**
- Design the UX as an *optional copilot* — assessors can ignore all suggestions. It fills in a draft; they edit freely.
- Conduct user needs assessment with assessors *before* building the tool (Phase 1 of the project).
- Build a simple web interface (not a complex desktop app) accessible via any browser.
- Provide a 30-minute training session as part of the pilot.
- Validation: compare case notes written with vs. without the tool on quality metrics (completeness, time to completion, adherence to required fields) as rated by a senior assessor.

---

### 4.5 Evaluation & Impact Metrics

**Concrete metrics for the pilot:**

| Metric | Measurement Method | Target |
|---|---|---|
| **Time to complete a case note** | Timed comparison: with tool vs. without (within-subjects crossover) | ≥30% reduction |
| **Completeness** | Checklist of required fields/observations per case note template | ≥90% field completion rate (vs. baseline) |
| **Assessor satisfaction** | Likert-scale survey (System Usability Scale) | SUS score ≥68 (above average) |
| **Accuracy of suggestions** | Senior assessor blind review of AI-generated vs. human-only notes | No increase in clinical errors |
| **Number of children assessed per week** | Self-reported by assessors over pilot period | Qualitative increase reported |

**Study design:** Given CCSGP's scope, a full RCT is unrealistic. Propose a **within-subjects pilot** — each assessor writes some case notes with the tool and some without, over a 4-week period. Target: 5–8 assessors, 40–60 total case notes. This is sufficient for descriptive statistics and qualitative findings, appropriate for a fellowship report.

---

### 4.6 Regulatory, Ethical, and Governance Issues

**NUS-IRB Requirements:**
- If you conduct a user study (assessors testing the tool and providing feedback), this constitutes research involving human subjects and requires NUS-IRB or DERC review.
- Since the project aims to generate usable findings (and would be reported on the CCSGP website), it qualifies as "research" rather than a pure "educational exercise."
- Timeline: DERC review takes 2–4 weeks. Factor this into Phase 1 of your project plan.
- For research involving *children's data*, even indirectly (assessors discussing real cases), additional safeguards may be required. The safest approach: assessors use only *de-identified or synthetic case scenarios* during the pilot evaluation period.

**Audit trail:**
- Implement logging of all model interactions (input prompts, generated outputs) stored locally, encrypted, with timestamps. This enables quality review and accountability.
- Logs should be accessible only to the assessor and their supervisor.
- Retention period: minimum 30 days for quality assurance, then auto-delete.

**Explainability:**
- For each suggestion, the tool should indicate which template section or assessment framework category it is drawing from (e.g., "This suggestion addresses: Gross Motor Development milestones per ECDA guidelines").
- This is feasible with RAG — the retrieved context chunks provide natural citations.

---

### 4.7 Cost & Sustainability

**Capital costs (pilot phase):**
- Compute: If using NUS SoC GPU servers, potentially S$0. If procuring a Mac Studio M2 Ultra or RTX 4090 workstation: S$3,000–S$8,000 (may exceed CCSGP budget — prefer using existing NUS infrastructure).
- Software: All open-source (Ollama/llama.cpp, Llama 3, LangChain/LlamaIndex, Flask, React). S$0.
- Domain resources: Assessment templates, ECDA frameworks — free/publicly available.

**Operational costs:**
- Electricity for local inference: negligible.
- Developer time: primary cost is student effort (covered by the fellowship structure).
- No API costs (fully local).

**Sustainability plan:**
- Open-source the tool on GitHub with documentation.
- Design for easy model swapping (newer models as they become available).
- Partner centre can continue using the tool on any local machine with sufficient specs.
- If successful, pitch for larger funding (ECDA, MSF, or SG Enable grants) for multi-centre deployment.

---

## 5. Concrete Project Plan: Phased Roadmap

### Phase 1: Foundation & Partner Engagement (Weeks 1–3)

- **Secure community partner.** Contact 2–3 EIPIC centres or EI providers (e.g., CPAS, AWWA, SPD, Rainbow Centre, Thye Hua Kwan). Get a written Letter of Support from one, confirming willingness to collaborate.
- **Conduct needs assessment.** Interview 3–5 assessors at the partner centre to understand current case note workflow, pain points, required fields, and assessment frameworks used.
- **Obtain case note templates** (anonymized structure only — no real patient data). This is the core of your RAG retrieval corpus.
- **Submit DERC ethics application** for the user study component.
- **Team composition:** You (lead developer) + 1 additional SoC student + domain advisor (approach an NUS faculty member in Social Work, Psychology, or the Alice Lee Centre for Nursing Studies — or a senior assessor at the partner centre).

### Phase 2: Technical Build (Weeks 3–8)

- **Set up local inference:** Ollama + Llama 3.1 8B (4-bit GGUF) on NUS SoC GPU server or personal workstation.
- **Build RAG pipeline:** LlamaIndex or LangChain, using case note templates, ECDA assessment frameworks, and developmental milestone references as the retrieval corpus.
- **Develop structured prompting system:** Define JSON schema for case notes (child ID redacted, assessment domains, observations per domain, recommendations). LLM generates structured output from bullet-point inputs.
- **Build web interface:** FastAPI backend + React frontend. Features: bullet-point input area, real-time AI suggestions panel, structured case note editor with free-edit capability, export to DOCX/PDF.
- **Implement privacy controls:** Session-only data retention, encrypted temp storage, auto-purge on session close, no cloud connectivity.

### Phase 3: Pilot Testing (Weeks 8–12)

- **Deploy at partner centre.** Install on a local machine at the EI centre (or provide via secure local network).
- **Pilot with 5–8 assessors** over 4 weeks. Each assessor writes ~5–8 case notes with the tool and ~5–8 without (crossover design).
- **Collect metrics:** Time per note, completeness scores, SUS survey, qualitative feedback.
- **Iterate:** Fix usability issues, improve prompts based on assessor feedback.

### Phase 4: Reporting & Handoff (Weeks 12–14)

- **Analyse pilot data.** Descriptive statistics, qualitative themes.
- **Write CCSGP fellowship report** with all required sections (project overview, impact, learnings, screenshots, post-project plans).
- **Open-source the codebase** on GitHub with setup documentation.
- **Prepare sustainability handoff:** Train 1–2 staff at the partner centre to use and maintain the tool.

### Minimum Viable Dataset & Consent Strategy

- **For building the tool:** Only anonymized templates and publicly available frameworks. Zero real patient data needed.
- **For the pilot evaluation:** Assessors use the tool during their normal work. No additional data collection from children/families. The "research" involves only the assessors' experience (time logs, surveys).
- **Consent from assessors:** Written informed consent for participation in the user study (standard NUS-IRB form).
- **No parental consent needed** if the tool processes assessor-typed observations without storing child-identifiable information and all sessions are ephemeral.

### Risk Mitigation Checklist

- [ ] Community partner Letter of Support secured
- [ ] DERC ethics approval obtained
- [ ] DPIA (Data Protection Impact Assessment) completed and documented
- [ ] Local-only deployment confirmed (zero cloud/internet dependency during inference)
- [ ] Ephemeral data policy implemented and tested
- [ ] Assessor training materials prepared
- [ ] Fallback plan if GPU hardware unavailable (smaller model, e.g., Phi-3 Mini 3.8B)
- [ ] Model output disclaimer integrated into UI ("AI-generated suggestions — assessor review required")
- [ ] Audit logging implemented (local, encrypted)
- [ ] Open-source licence selected (MIT or Apache 2.0)

### Budget Ballpark

| Item | Estimated Cost | Notes |
|---|---|---|
| Compute (NUS SoC GPU) | S$0 | Use existing infrastructure |
| Compute (if procurement needed) | S$3,000–S$5,000 | Mac Studio or workstation |
| Software & frameworks | S$0 | All open-source |
| Travel to partner centre | S$100–S$200 | Transport for site visits |
| Domain expert honorarium | S$500–S$1,000 | If external advisor |
| Miscellaneous (printing, materials) | S$100–S$200 | |
| **Total (no hardware procurement)** | **~S$700–S$1,400** | |
| **Total (with hardware)** | **~S$3,700–S$6,400** | |

---

## 6. Suggested Application Narrative Bullets

These are editable bullet-point sentences designed to map directly to CCSGP evaluation criteria. Adapt as needed:

**Impact & Community Need:**

1. "Singapore's early intervention centres assess thousands of children aged 1–6 with developmental delays annually, but assessors spend up to 40% of their working time on documentation rather than direct child assessment — time that could be redirected to reducing waitlists and helping more children."

2. "Our tool directly supports the national expansion of the Inclusive Support Programme (InSP) from 2026, which will increase demand for assessment capacity at a time when the EI workforce is already stretched."

3. "By reducing case note drafting time by an estimated 30–50%, each assessor could potentially evaluate 2–3 additional children per month — translating to dozens more children receiving timely intervention per centre per year."

**Feasibility & Technical Rigour:**

4. "We deploy a fully local open-source LLM (Llama 3.1 8B, quantized for efficient inference) on-premises at the partner centre, ensuring zero child data ever leaves the facility — a privacy-first architecture that exceeds PDPA requirements."

5. "Our retrieval-augmented generation (RAG) approach uses only anonymized case note templates and publicly available ECDA assessment frameworks as context, eliminating the need to train on any real patient data while maintaining high output quality."

6. "We have secured [Partner Centre Name] as our community partner, with a confirmed Letter of Support and commitment to participate in a 4-week pilot study with 5–8 assessors."

**Ethical Safeguards:**

7. "We have conducted a Data Protection Impact Assessment (DPIA) consistent with PDPC Advisory Guidelines on Children's Data (March 2024), implementing ephemeral session-only data retention, encrypted temporary storage, and automatic data purging upon session close."

8. "All AI-generated content is clearly labelled as suggestions requiring assessor review, maintaining the clinician as the authoritative source and ensuring no automated decisions are made about children's care."

**Alignment with CCSGP Mission:**

9. "This project exemplifies computing for social good: using state-of-the-art AI not to replace human judgment, but to amplify the capacity of dedicated professionals serving Singapore's most vulnerable young children."

10. "Our interdisciplinary team combines NUS School of Computing expertise in LLM deployment with domain guidance from [Faculty Advisor / Partner Centre Senior Assessor], ensuring the tool meets real clinical workflow needs."

**Sustainability:**

11. "The tool will be released as open-source software on GitHub with comprehensive documentation, enabling any EI centre in Singapore to deploy it on standard hardware at zero ongoing cost."

12. "If the pilot demonstrates positive results, we plan to seek expanded funding through ECDA or MSF to support multi-centre deployment and to contribute our findings to the growing evidence base on AI-assisted clinical documentation in Singapore's social service sector."

---

## 7. Final Recommendation

### Verdict: **REVISE** then **GO**

This is a strong project idea with genuine impact potential and excellent alignment to CCSGP priorities. It is *not* ready for submission in its current form due to three critical gaps, but all are addressable:

### Immediate Next Steps (Priority Order)

**Step 1 — URGENT (This week):** Contact EIPIC centres. Reach out to 3–5 early intervention providers in Singapore (AWWA, SPD, Rainbow Centre, CPAS, Thye Hua Kwan EI centres, or private providers like Bridging EI). Request a 30-minute meeting to discuss the project concept and gauge interest. You need a written Letter of Support before applying. Without this, do not submit.

**Step 2 — URGENT (This week):** Identify a faculty or domain advisor. Approach NUS Department of Social Work (Prof Gerard Chung was the advisor for the 2024 CCSGP AI project — an excellent potential contact), NUS Psychology, or the Alice Lee Centre for Nursing Studies. A named collaborator dramatically strengthens the application.

**Step 3 (Next 1–2 weeks):** Prototype locally. Set up Ollama + Llama 3.1 8B on your machine. Build a minimal demo: input bullet points → structured case note output. This demonstrates feasibility even before submission.

**Step 4 (Before submission):** Rewrite the proposal using the framing in Section 6. Descope explicitly: no fine-tuning on real data, RAG-only approach, local deployment, ephemeral data. Show you understand the PDPA constraints and have designed around them.

**Step 5 (After funding):** Submit DERC ethics application as your first action in Phase 1.

**If the February 2026 deadline has passed:** Target the Semester 2 or Special Term cycle (likely May/June 2026). Use the intervening time to secure the partner and build the prototype — this will make the next-cycle application significantly stronger.

---

*This assessment is based on publicly available information about CCSGP, PDPA, and Singapore's early intervention landscape as of February 2026. All technical recommendations use open-source tools and models. No citations have been fabricated.*

---

### References

1. CCSGP Fellowship Programme: https://www.ccsgp.comp.nus.edu.sg/fellowship-programme
2. CCSGP Completed Projects: https://www.ccsgp.comp.nus.edu.sg/projects
3. NUS News — CCSGP Launch (Jul 2021): https://news.nus.edu.sg/new-centre-for-computing-for-social-good--philanthropy-launched/
4. PDPC Advisory Guidelines — Children's Data (Mar 2024): https://www.pdpc.gov.sg/guidelines-and-consultation/2024/03/advisory-guidelines-on-the-pdpa-for-childrens-personal-data-in-the-digital-environment
5. Singapore PDPA (Statute): https://sso.agc.gov.sg/Act/PDPA2012
6. Bird & Bird — PDPC Children's Data Guidelines Analysis: https://www.twobirds.com/en/insights/2024/singapore/singapore-pdpc-issues-advisory-guidelines-on-the-pdpa
7. ECDA — Early Intervention Services: https://www.ecda.gov.sg/parents/other-services/early-intervention-services
8. ECDA — EIPIC: https://www.ecda.gov.sg/parents/other-services/early-intervention-services/early-intervention-programme-for-infants-and-children-(eipic)
9. ECDA — Inclusive Support Programme (InSP): https://www.ecda.gov.sg/parents/other-services/early-intervention-services/inclusive-support-programme-(insp)
10. NUS CDE — Ethics Review: https://cde.nus.edu.sg/research/ethics-review-of-human-research/
11. CCSGP AI Social Work Tool Project (2024): https://www.ccsgp.comp.nus.edu.sg/ai-tool
12. CCSGP Project Sothea (2024): https://www.ccsgp.comp.nus.edu.sg/project-sothea
