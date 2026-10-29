
"use strict";

// CloudWise - Cloud Adoption Strategy Analyzer
// Educational rule-based decision support system.

const form = document.getElementById("assessmentForm");
const results = document.getElementById("results");
const resetButton = document.getElementById("resetButton");
const downloadButton = document.getElementById("downloadButton");

let latestReport = null;

// --------------------------------------------------
// 1. Read the user's assessment answers
// --------------------------------------------------

function getAssessment() {
    const data = new FormData(form);

    return {
        name: document.getElementById("startupName").value.trim() || "Your startup",
        companySize: document.getElementById("companySize").value,
        expertise: document.getElementById("expertise").value,
        budget: document.getElementById("budget").value,
        management: document.getElementById("management").value,
        workload: document.getElementById("workload").value,
        growth: document.getElementById("growth").value,
        security: document.getElementById("security").value,
        availability: document.getElementById("availability").value,
        providerNeed: document.getElementById("providerNeed").value,
        priority: data.get("priority") || "simplicity"
    };
}

// --------------------------------------------------
// 2. Calculate organizational readiness
// --------------------------------------------------

function calculateReadiness(a) {
    let score = 0;

    const expertisePoints = {
        low: 8,
        medium: 17,
        high: 25
    };

    const budgetPoints = {
        low: 10,
        medium: 17,
        high: 20
    };

    const managementPoints = {
        managed: 20,
        mixed: 12,
        self: 5
    };

    const sizePoints = {
        small: 15,
        medium: 12,
        large: 8
    };

    score += expertisePoints[a.expertise];
    score += budgetPoints[a.budget];
    score += managementPoints[a.management];
    score += sizePoints[a.companySize];

    // Readiness is about the ability to manage cloud adoption,
    // not whether the business has ambitious requirements.
    if (a.workload === "mixed" && a.expertise === "low") {
        score -= 5;
    }

    if (a.providerNeed === "mandatory" && a.expertise === "low") {
        score -= 5;
    }

    return Math.max(0, Math.min(100, Math.round((score / 80) * 100)));
}

// --------------------------------------------------
// 3. Score the cloud adoption strategies
// --------------------------------------------------

function compareStrategies(a) {
    const scores = {
        saas: 0,
        managed: 0,
        multicloud: 0
    };

    // Low expertise generally favors ready-made services.
    if (a.expertise === "low") {
        scores.saas += 24;
        scores.managed += 16;
        scores.multicloud -= 12;
    } else if (a.expertise === "medium") {
        scores.saas += 12;
        scores.managed += 22;
        scores.multicloud += 5;
    } else {
        scores.saas += 5;
        scores.managed += 15;
        scores.multicloud += 18;
    }

    // Budget constraints favor simple, cost-controlled adoption.
    if (a.budget === "low") {
        scores.saas += 18;
        scores.managed += 12;
        scores.multicloud -= 10;
    } else if (a.budget === "medium") {
        scores.saas += 10;
        scores.managed += 16;
        scores.multicloud += 5;
    } else {
        scores.saas += 3;
        scores.managed += 12;
        scores.multicloud += 15;
    }

    // Workload suitability.
    const workloadScores = {
        business: { saas: 25, managed: 5, multicloud: -5 },
        application: { saas: 5, managed: 25, multicloud: 5 },
        data: { saas: 5, managed: 20, multicloud: 12 },
        mixed: { saas: 8, managed: 16, multicloud: 15 }
    };

    for (const strategy of Object.keys(scores)) {
        scores[strategy] += workloadScores[a.workload][strategy];
    }

    // Growth and scaling needs.
    if (a.growth === "rapid") {
        scores.managed += 16;
        scores.multicloud += 8;
    } else if (a.growth === "moderate") {
        scores.managed += 10;
        scores.multicloud += 3;
    } else {
        scores.saas += 5;
    }

    // Preferred management approach.
    if (a.management === "managed") {
        scores.saas += 12;
        scores.managed += 12;
        scores.multicloud -= 8;
    } else if (a.management === "mixed") {
        scores.managed += 8;
        scores.multicloud += 5;
    } else {
        scores.managed += 4;
        scores.multicloud += 12;
    }

    // Multiple-provider requirements must have a real business reason.
    if (a.providerNeed === "specialist") {
        scores.multicloud += 22;
    } else if (a.providerNeed === "resilience") {
        scores.multicloud += 12;
        scores.managed += 4;
    } else if (a.providerNeed === "mandatory") {
        scores.multicloud += 30;
    }

    // A stronger team can manage more complex arrangements.
    if (a.expertise === "low") {
        scores.multicloud -= 8;
    }

    // A second provider is not automatically the best answer
    // to a high availability requirement.
    if (a.availability === "critical") {
        scores.managed += 10;
        scores.multicloud += 5;
    } else if (a.availability === "high") {
        scores.managed += 7;
        scores.multicloud += 3;
    }

    // Sensitive data calls for stronger governance, not automatically
    // for multiple providers.
    if (a.security === "sensitive") {
        scores.managed += 4;
    } else if (a.security === "regulated") {
        scores.managed += 5;
        scores.multicloud -= 3;
    }

    // User-selected primary business objective.
    if (a.priority === "simplicity") {
        scores.saas += 12;
        scores.managed += 5;
    } else if (a.priority === "cost") {
        scores.saas += 10;
        scores.managed += 5;
        scores.multicloud -= 5;
    } else if (a.priority === "scalability") {
        scores.managed += 12;
        scores.multicloud += 5;
    } else if (a.priority === "control") {
        scores.managed += 5;
        scores.multicloud += 10;
    }

    // Normalize the comparison values for the dashboard.
    // These are relative suitability scores, not probabilities.
    const minimum = Math.min(...Object.values(scores));
    const normalized = {};

    for (const key of Object.keys(scores)) {
        normalized[key] = Math.max(0, scores[key] - minimum + 5);
    }

    const highest = Math.max(...Object.values(normalized));

    for (const key of Object.keys(normalized)) {
        normalized[key] = Math.round((normalized[key] / highest) * 100);
    }

    return {
        raw: scores,
        normalized,
        winner: Object.keys(scores).sort(
            (x, y) => scores[y] - scores[x]
        )[0]
    };
}

// --------------------------------------------------
// 4. Define strategy descriptions
// --------------------------------------------------

const strategies = {
    saas: {
        name: "SaaS-First Cloud Adoption",
        description:
            "Prioritize ready-to-use cloud applications and adopt additional managed services only when needed. This minimizes infrastructure administration and helps the startup begin with the resources it already has.",
        tags: ["Low operational overhead", "Simple adoption", "Cost controls"],
        services: [
            "SaaS email and collaboration tools for daily operations.",
            "SaaS customer relationship management and accounting tools where needed.",
            "Managed cloud storage and backup for business documents.",
            "Centralized identity management, MFA, and billing alerts."
        ]
    },

    managed: {
        name: "Managed PaaS and Serverless Strategy",
        description:
            "Use ready-made SaaS applications alongside managed application hosting, managed databases, and serverless services where suitable. The provider handles much of the underlying infrastructure, allowing the startup to focus on its business.",
        tags: ["Managed infrastructure", "Scalable applications", "Balanced control"],
        services: [
            "SaaS collaboration and business applications.",
            "Managed PaaS hosting for the startup's website or application.",
            "Managed database and object storage services.",
            "Centralized monitoring, identity management, backup, and budget alerts."
        ]
    },

    multicloud: {
        name: "Phased Multi-Cloud Strategy",
        description:
            "Use selected services from more than one cloud provider where a specialist capability, contractual requirement, or justified resilience need exists. Establish governance and operational controls before expanding across providers.",
        tags: ["Selective multi-cloud", "Governance first", "Business-led expansion"],
        services: [
            "SaaS business applications selected for functional suitability.",
            "A primary cloud provider for core application hosting and data services.",
            "A second provider only for a justified specialist workload or tested recovery requirement.",
            "Centralized identity, cost tracking, monitoring, security policies, and recovery documentation."
        ]
    }
};

// --------------------------------------------------
// 5. Generate reasons for the recommendation
// --------------------------------------------------

function generateReasons(a, strategyKey, readiness) {
    const reasons = [];

    if (a.expertise === "low") {
        reasons.push(
            "Limited technical expertise makes reducing server administration and operational complexity a priority."
        );
    } else if (a.expertise === "medium") {
        reasons.push(
            "The existing IT capability supports managed cloud services, with training for more advanced responsibilities."
        );
    } else {
        reasons.push(
            "An experienced technical team can evaluate additional cloud architecture and operational responsibilities."
        );
    }

    if (a.budget === "low") {
        reasons.push(
            "A strict budget calls for spending limits, usage alerts, and avoiding unnecessary provider duplication."
        );
    } else if (a.budget === "medium") {
        reasons.push(
            "A controlled budget supports gradual adoption with regular cost and value reviews."
        );
    } else {
        reasons.push(
            "The available budget allows broader evaluation, provided each service delivers measurable business value."
        );
    }

    if (a.workload === "business") {
        reasons.push(
            "Standard business functions are generally well suited to ready-made SaaS applications."
        );
    } else if (a.workload === "application") {
        reasons.push(
            "An application workload benefits from managed hosting, deployment support, and a suitable managed database."
        );
    } else if (a.workload === "data") {
        reasons.push(
            "Data processing benefits from services selected for the workload's storage, processing, access, and governance requirements."
        );
    } else {
        reasons.push(
            "Multiple workloads require clear service ownership and a documented architecture."
        );
    }

    if (a.growth === "rapid") {
        reasons.push(
            "Expected rapid growth makes elastic capacity and scalability planning important."
        );
    }

    if (a.security === "sensitive" || a.security === "regulated") {
        reasons.push(
            "Sensitive data requires access controls, encryption, retention policies, and verification of applicable compliance obligations."
        );
    }

    if (a.providerNeed === "mandatory") {
        reasons.push(
            "The stated requirement for multiple providers makes explicit cross-provider governance necessary."
        );
    } else if (a.providerNeed === "specialist") {
        reasons.push(
            "Specialist capabilities may justify a second provider, but only for workloads that benefit from it."
        );
    } else if (a.providerNeed === "resilience") {
        reasons.push(
            "A cross-provider recovery design should be considered alongside simpler high-availability and backup options."
        );
    } else {
        reasons.push(
            "No confirmed need for multiple providers has been identified, so unnecessary complexity should be avoided."
        );
    }

    if (strategyKey === "saas") {
        reasons.push(
            "The assessment favors ready-to-use applications and a low-maintenance starting point."
        );
    } else if (strategyKey === "managed") {
        reasons.push(
            "The balance of application requirements and operational capacity favors managed platforms."
        );
    } else {
        reasons.push(
            "The assessment indicates a business justification for selective multi-cloud adoption, subject to governance readiness."
        );
    }

    if (readiness < 45) {
        reasons.push(
            "Current readiness is limited; adopt in small phases and build staff capability before expanding."
        );
    }

    return reasons;
}

// --------------------------------------------------
// 6. Generate a practical implementation roadmap
// --------------------------------------------------

function generateRoadmap(a, strategyKey) {
    const secondProviderTask =
        strategyKey === "multicloud"
            ? "Document cross-provider access, data transfer, cost ownership, and recovery procedures."
            : "Use one primary provider initially; assess a second provider only when a measurable need emerges.";

    return [
        {
            phase: "PHASE 01",
            title: "Assess and plan",
            description:
                "Inventory applications, data, costs, skills, compliance needs, and business priorities."
        },
        {
            phase: "PHASE 02",
            title: "Start with essentials",
            description:
                strategyKey === "saas"
                    ? "Introduce essential SaaS tools, MFA, user roles, and budget alerts."
                    : "Introduce essential SaaS tools and select a suitable managed application platform."
        },
        {
            phase: "PHASE 03",
            title: "Secure and integrate",
            description:
                "Configure access controls, encryption, monitoring, data transfer, and tested backups."
        },
        {
            phase: "PHASE 04",
            title: "Expand carefully",
            description: secondProviderTask
        },
        {
            phase: "PHASE 05",
            title: "Review and improve",
            description:
                "Review spending, availability, security, staff training, and business value before expansion."
        }
    ];
}

// --------------------------------------------------
// 7. Identify risks and controls
// --------------------------------------------------

function generateRisks(a, strategyKey) {
    const risks = [
        "Unexpected spending — set budgets, billing alerts, resource limits, and regular cost reviews.",
        "Security misconfiguration — enforce MFA, least privilege, encryption, and periodic access reviews.",
        "Data loss or downtime — configure backups and test recovery procedures against business recovery needs."
    ];

    if (strategyKey === "multicloud") {
        risks.push(
            "Multi-cloud complexity — assign clear service owners and standardize monitoring, identity, and incident procedures."
        );
    } else {
        risks.push(
            "Provider dependency — document service dependencies and assess data export and migration options."
        );
    }

    if (a.security === "regulated") {
        risks.push(
            "Compliance exposure — verify applicable legal, regulatory, data residency, and contractual requirements before deployment."
        );
    }

    if (a.availability === "critical") {
        risks.push(
            "Critical outages — define recovery time and recovery point objectives, and test the actual recovery design."
        );
    }

    return risks;
}

// --------------------------------------------------
// 8. Define success indicators
// --------------------------------------------------

function generateMetrics(a, strategyKey) {
    const metrics = [
        "Monthly cloud expenditure versus the approved budget.",
        "Application availability and recovery test results.",
        "Time required to onboard staff and launch business services.",
        "Number of unresolved security findings and access-control issues."
    ];

    if (strategyKey === "multicloud") {
        metrics.push(
            "Integration effort and operating cost per provider."
        );
    }

    if (a.growth === "rapid") {
        metrics.push(
            "Application performance and capacity during increasing demand."
        );
    }

    return metrics;
}

// --------------------------------------------------
// 9. Render list items safely
// --------------------------------------------------

function renderList(elementId, items) {
    const list = document.getElementById(elementId);
    list.replaceChildren();

    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

// --------------------------------------------------
// 10. Display the assessment results
// --------------------------------------------------

function showResults(a, readiness, comparison) {
    let strategyKey = comparison.winner;

    // A mandatory multi-provider requirement takes priority.
    // A resilience goal alone does not automatically justify multi-cloud.
    if (a.providerNeed === "mandatory") {
        strategyKey = "multicloud";
    }

    const strategy = strategies[strategyKey];

    document.getElementById("resultTitle").textContent =
        `Cloud strategy for ${a.name}`;

    document.getElementById("resultSubtitle").textContent =
        "Your recommendation is based on the capabilities and business requirements you selected.";

    document.getElementById("strategyName").textContent = strategy.name;

    document.getElementById("strategyDescription").textContent =
        strategy.description;

    const tags = document.getElementById("strategyTags");
    tags.replaceChildren();

    strategy.tags.forEach(tagText => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagText;
        tags.appendChild(tag);
    });

    document.getElementById("readinessScore").textContent = readiness;

    const scoreCircle = document.getElementById("scoreCircle");
    const degrees = readiness * 3.6;

    scoreCircle.style.background =
        `conic-gradient(#8f83ff ${degrees}deg, rgba(255,255,255,.17) ${degrees}deg)`;

    let readinessLabel;
    let readinessDescription;

    if (readiness < 45) {
        readinessLabel = "Early-stage readiness";
        readinessDescription = "Build skills and governance first.";
    } else if (readiness < 70) {
        readinessLabel = "Developing readiness";
        readinessDescription = "Adopt in phases with support.";
    } else {
        readinessLabel = "Stronger readiness";
        readinessDescription = "Prepare a governed rollout.";
    }

    document.getElementById("readinessLabel").textContent = readinessLabel;
    document.getElementById("readinessDescription").textContent =
        readinessDescription;

    renderList(
        "reasonList",
        generateReasons(a, strategyKey, readiness)
    );

    renderList("serviceList", strategy.services);

    // Display strategy comparison.
    const comparisonList = document.getElementById("comparisonList");
    comparisonList.replaceChildren();

    const comparisonNames = {
        saas: "SaaS-first",
        managed: "Managed PaaS",
        multicloud: "Selective multi-cloud"
    };

    Object.keys(comparison.normalized)
        .sort((x, y) => comparison.raw[y] - comparison.raw[x])
        .forEach(key => {
            const row = document.createElement("div");
            row.className = "comparison-row";

            const name = document.createElement("div");
            name.className = "comparison-name";
            name.textContent =
                comparisonNames[key] +
                (key === strategyKey ? " ★" : "");

            const track = document.createElement("div");
            track.className = "bar-track";

            const fill = document.createElement("div");
            fill.className =
                "bar-fill" + (key === strategyKey ? " recommended" : "");

            fill.style.width = comparison.normalized[key] + "%";
            track.appendChild(fill);

            const score = document.createElement("div");
            score.className = "comparison-score";
            score.textContent = comparison.normalized[key];

            row.append(name, track, score);
            comparisonList.appendChild(row);
        });

    const comparisonNote = document.createElement("p");
    comparisonNote.className = "comparison-note";
    comparisonNote.textContent =
        "Scores are normalized relative suitability indicators generated by the project's rule-based model. They are not probabilities or measured market benchmarks.";

    comparisonList.appendChild(comparisonNote);

    renderRoadmap(a, strategyKey);
    renderList("riskList", generateRisks(a, strategyKey));
    renderList("metricList", generateMetrics(a, strategyKey));

    document.getElementById("outcomeText").textContent =
        `The assessment aligns cloud adoption with ${a.expertise} technical expertise, ` +
        `a ${a.budget}-budget profile, the selected ${a.workload} workload, ` +
        `and the startup's growth, security, and availability needs. ` +
        `The recommendation prioritizes organizational readiness and business value ` +
        `rather than adopting multiple providers without justification.`;

    latestReport = {
        startup: a,
        readiness,
        strategyKey,
        strategyName: strategy.name,
        strategyDescription: strategy.description,
        strategyServices: strategy.services,
        reasons: generateReasons(a, strategyKey, readiness),
        roadmap: generateRoadmap(a, strategyKey),
        risks: generateRisks(a, strategyKey),
        metrics: generateMetrics(a, strategyKey),
        comparison: comparison.normalized
    };

    results.hidden = false;

    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderRoadmap(a, strategyKey) {
    const roadmapList = document.getElementById("roadmapList");
    roadmapList.replaceChildren();

    generateRoadmap(a, strategyKey).forEach(step => {
        const card = document.createElement("article");
        card.className = "roadmap-step";

        const phase = document.createElement("span");
        phase.className = "roadmap-phase";
        phase.textContent = step.phase;

        const title = document.createElement("h4");
        title.textContent = step.title;

        const description = document.createElement("p");
        description.textContent = step.description;

        card.append(phase, title, description);
        roadmapList.appendChild(card);
    });
}

// --------------------------------------------------
// 11. Handle form submission
// --------------------------------------------------

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
        return;
    }

    const assessment = getAssessment();
    const readiness = calculateReadiness(assessment);
    const comparison = compareStrategies(assessment);

    showResults(assessment, readiness, comparison);
});

// --------------------------------------------------
// 12. Reset the assessment
// --------------------------------------------------

resetButton.addEventListener("click", function () {
    // Wait until the browser restores the form defaults.
    window.setTimeout(function () {
        results.hidden = true;
        latestReport = null;
        form.querySelector("input[type='text']").focus();
    }, 0);
});

// --------------------------------------------------
// 13. Export the results as a text report
// --------------------------------------------------

downloadButton.addEventListener("click", function () {
    if (!latestReport) {
        return;
    }

    const r = latestReport;
    const comparisonNames = {
        saas: "SaaS-first",
        managed: "Managed PaaS",
        multicloud: "Selective multi-cloud"
    };

    const report = [
        "CLOUDWISE - CLOUD ADOPTION STRATEGY ANALYSIS",
        "Cloud Service Management Mini Project",
        "=".repeat(48),
        "",
        `Startup: ${r.startup.name}`,
        `Organization size: ${r.startup.companySize}`,
        `Technical expertise: ${r.startup.expertise}`,
        `Budget: ${r.startup.budget}`,
        `Workload: ${r.startup.workload}`,
        `Expected growth: ${r.startup.growth}`,
        `Data sensitivity: ${r.startup.security}`,
        `Availability: ${r.startup.availability}`,
        `Primary objective: ${r.startup.priority}`,
        `Multiple-provider requirement: ${r.startup.providerNeed}`,
        "",
        `READINESS SCORE: ${r.readiness}/100`,
        "",
        `RECOMMENDED STRATEGY: ${r.strategyName}`,
        r.strategyDescription,
        "",
        "STRATEGY COMPARISON",
        ...Object.entries(r.comparison).map(
            ([key, value]) => `${comparisonNames[key]}: ${value}/100 (relative score)`
        ),
        "",
        "REASONS FOR THE RECOMMENDATION",
        ...r.reasons.map((item, i) => `${i + 1}. ${item}`),
        "",
        "RECOMMENDED SERVICES",
        ...r.strategyServices.map((item, i) => `${i + 1}. ${item}`),
        "",
        "IMPLEMENTATION ROADMAP",
        ...r.roadmap.map(
            (step, i) =>
                `${i + 1}. ${step.title}: ${step.description}`
        ),
        "",
        "RISKS AND CONTROLS",
        ...r.risks.map((item, i) => `${i + 1}. ${item}`),
        "",
        "SUCCESS INDICATORS",
        ...r.metrics.map((item, i) => `${i + 1}. ${item}`),
        "",
        "COURSE OUTCOME",
        "Aligns cloud adoption strategy with organizational capability and business needs.",
        "",
        "Note: This is an educational rule-based analysis. Validate actual provider",
        "pricing, service availability, compliance, and technical requirements before deployment."
    ].join("\n");

    const blob = new Blob(
        [report],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CloudWise_Adoption_Report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
});
