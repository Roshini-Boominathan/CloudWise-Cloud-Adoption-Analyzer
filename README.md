# CloudWise — Cloud Adoption Strategy Analyzer ☁️

A rule-based web application that helps startups identify a suitable cloud adoption strategy based on their organizational capabilities, budget, technical expertise, workload requirements, security needs, and business goals.

## 📌 Project Overview

Startups often face challenges when choosing cloud services because of limited technical expertise, budget constraints, and uncertainty about which cloud strategy best fits their needs.

**CloudWise** addresses this problem by analyzing user-provided organizational requirements and generating a structured cloud adoption recommendation. It compares alternative strategies and presents practical guidance to support informed decision-making.

This project was developed as part of a **Cloud Service Management** mini project.

## 🎯 Objectives

- Analyze startup requirements and organizational readiness for cloud adoption.
- Compare SaaS-first, managed PaaS/serverless, and phased multi-cloud approaches.
- Recommend a suitable cloud strategy based on user inputs.
- Suggest relevant cloud service categories.
- Present a phased adoption roadmap, potential risks, and performance metrics.
- Demonstrate how business requirements can guide cloud adoption decisions.

## ✨ Features

- **Startup Assessment:** Collects information about organizational size, budget, technical expertise, workload, growth expectations, and other requirements.
- **Cloud Readiness Score:** Calculates a rule-based readiness score from the assessment.
- **Strategy Comparison:** Compares alternative cloud adoption strategies using a scoring mechanism.
- **Personalized Recommendations:** Generates a strategy recommendation and supporting reasons.
- **Service Suggestions:** Identifies relevant cloud service categories based on the selected strategy.
- **Adoption Roadmap:** Presents suggested phases for cloud adoption.
- **Risk Analysis:** Highlights potential adoption risks and mitigation considerations.
- **Performance Metrics:** Suggests metrics for monitoring cloud adoption.
- **Downloadable Report:** Allows users to download the generated assessment as a text file.
- **Responsive Interface:** Provides a dashboard-style interface for desktop and mobile screens.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling, responsive layout, and visual design |
| JavaScript | Assessment logic, strategy scoring, and dynamic results |

## 📂 Project Structure

```text
CloudWise-Cloud-Adoption-Analyzer/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run the Project

No backend server, database, package installation, or paid cloud account is required.

1. Download or clone the repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a web browser, or use the Live Server extension in Visual Studio Code.
4. Enter the startup assessment details.
5. Generate the recommendation and explore the strategy comparison, roadmap, risks, and metrics.
6. Use the report download option to save the assessment results.

## ⚙️ How It Works

1. **Input Collection:** The user provides information about the startup and its cloud adoption requirements.
2. **Readiness Assessment:** JavaScript evaluates selected organizational factors to calculate a readiness score.
3. **Strategy Scoring:** A rule-based mechanism evaluates the suitability of different cloud adoption approaches.
4. **Recommendation Generation:** The application selects a suitable strategy and produces supporting explanations.
5. **Result Presentation:** The dashboard displays recommendations, service categories, a phased roadmap, risks, and suggested metrics.
6. **Report Export:** The generated assessment can be downloaded as a text report.

## ☁️ Cloud Adoption Strategies Considered

- **SaaS-first:** Emphasizes ready-to-use cloud applications to reduce infrastructure management and technical overhead.
- **Managed PaaS / Serverless:** Emphasizes managed application platforms and services to reduce infrastructure administration.
- **Phased Multi-cloud:** Considers using services from multiple cloud providers when business requirements justify the additional complexity.

The application uses predefined rules and scoring logic. Its recommendations are decision-support suggestions, not a substitute for a detailed professional cloud architecture assessment.

## 🎓 Course Outcome Alignment

**Course outcome:** Aligns cloud adoption strategy with organizational capability and business needs.

CloudWise supports this outcome by evaluating organizational readiness, technical expertise, budget, workload requirements, security considerations, and business priorities before recommending a cloud adoption approach.

## 🔮 Future Enhancements

- Integrate live pricing information from cloud providers.
- Add comparisons of specific services from AWS, Microsoft Azure, and Google Cloud.
- Introduce user accounts and saved assessments.
- Add PDF report generation and visual analytics.
- Expand the assessment rules using additional business and technical factors.
- Validate recommendations against real-world startup scenarios.

## ℹ️ Project Information

**Project Name:** CloudWise — Cloud Adoption Strategy Analyzer  
**Domain:** Cloud Service Management  
**Project Type:** Web-based decision-support application  
**Implementation:** HTML, CSS, and JavaScript

---

## 👩‍💻 Author

Roshini Boominathan
GitHub: https://github.com/Roshini-Boominathan


*CloudWise demonstrates how a startup's organizational capabilities and business requirements can guide a structured cloud adoption strategy.*
