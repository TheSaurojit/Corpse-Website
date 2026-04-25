"use client";

import React, { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TableRow {
  cells: string[];
}

interface Section {
  id: string;
  number: string;
  title: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TOC_PARTS = [
  {
    label: "PART I — Introduction and Purpose",
    sections: ["1. Purpose of This Policy", "2. Scope and Applicability", "3. Regulatory and App Store Compliance Context"],
  },
  {
    label: "PART II — Age Classification System",
    sections: ["4. How Age Is Collected and Verified", "5. User Tiers Based on Age and KYC Status", "6. The Three-Tier Access Framework"],
  },
  {
    label: "PART III — Tier 1 — Minor Users (Ages 13–17)",
    sections: [
      "7. What Minor Users Can Do",
      "8. What Minor Users Cannot Do",
      "9. How Platform Controls Enforce These Restrictions",
      "10. Parental and Guardian Consent Framework",
      "11. Data Protections for Minor Users",
    ],
  },
  {
    label: "PART IV — Tier 2 — Adult Users Without KYC",
    sections: [
      "12. What Tier 2 Users Can Do",
      "13. Financial Restrictions Without KYC",
      "14. Prize Escrow Hold Mechanism",
      "15. Notifications to Captain and Squad Members",
      "16. Maximum Escrow Hold Period",
    ],
  },
  {
    label: "PART V — Tier 3 — KYC-Verified Adult Users",
    sections: ["17. Full Platform Access", "18. KYC Requirements"],
  },
  {
    label: "PART VI — Feature Access Matrix",
    sections: ["19. Complete Feature Access Table by Tier"],
  },
  {
    label: "PART VII — In-App Controls and Enforcement",
    sections: ["20. Technical Enforcement", "21. Account Flags and Age Verification Events", "22. Parental Contact and Guardian Rights"],
  },
  {
    label: "PART VIII — App Store Compliance Statement",
    sections: ["23. Apple App Store Compliance", "24. Google Play Store Compliance"],
  },
  {
    label: "PART IX — Governing Law and Contact",
    sections: ["25. Governing Law"],
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function PartHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="part-header">
      {children}
    </div>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 id={`section-${number}`} className="section-heading">
      <span className="section-number">{number}.</span> {title}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="sub-heading">{children}</h3>;
}

function Callout({ children }: { children: React.ReactNode }) {
  return <div className="callout">{children}</div>;
}

function NoticeBold({ children }: { children: React.ReactNode }) {
  return <div className="notice-bold">{children}</div>;
}

function PolicyTable({ headers, rows }: { headers: string[]; rows: TableRow[] }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.cells.map((cell, ci) => (
                <td key={ci} dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="policy-list">
      {items.map((item, i) => (
        <li key={i}>{typeof item === "string" ? <span dangerouslySetInnerHTML={{ __html: item }} /> : item}</li>
      ))}
    </ul>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AgeAssurancePolicy() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
          --black: #0a0a0a;
          --dark: #1a1a1a;
          --mid: #3d3d3d;
          --muted: #666;
          --border: #c8c8c8;
          --light-bg: #f5f4f0;
          --accent: #b22222;
          --font-body: 'EB Garamond', Georgia, serif;
          --font-head: 'Libre Baskerville', Georgia, serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .policy-root {
          font-family: var(--font-body);
          font-size: 15.5px;
          line-height: 1.72;
          color: var(--black);
          background: #edecea;
          min-height: 100vh;
          padding: 36px 20px 80px;
        }

        .policy-page {
          max-width: 860px;
          margin: 0 auto;
          background: #fff;
          padding: 64px 72px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
        }

        /* Header */
        .doc-header {
          text-align: center;
          border-bottom: 2.5px solid var(--black);
          padding-bottom: 28px;
          margin-bottom: 32px;
        }
        .brand-name {
          font-family: var(--font-head);
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--black);
          margin-bottom: 2px;
        }
        .brand-tagline {
          font-family: var(--font-body);
          font-style: italic;
          font-size: 13.5px;
          color: var(--muted);
          margin-bottom: 22px;
        }
        .doc-title {
          font-family: var(--font-head);
          font-size: 22px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 6px;
          color: var(--dark);
        }
        .doc-subtitle {
          font-style: italic;
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 4px;
        }
        .doc-binding {
          font-style: italic;
          font-size: 12.5px;
          color: var(--muted);
        }

        /* Preamble */
        .doc-preamble {
          font-style: italic;
          font-size: 13.5px;
          color: var(--mid);
          border-left: 3px solid var(--border);
          padding-left: 14px;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        /* TOC */
        .toc-block {
          background: var(--light-bg);
          border: 1px solid var(--border);
          margin-bottom: 36px;
          font-size: 13.5px;
        }
        .toc-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--dark);
          color: #fff;
          padding: 10px 16px;
          border: none;
          cursor: pointer;
          font-family: var(--font-head);
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .toc-toggle svg {
          transition: transform 0.2s;
        }
        .toc-toggle.open svg {
          transform: rotate(180deg);
        }
        .toc-content {
          padding: 16px 20px;
          display: none;
        }
        .toc-content.open {
          display: block;
        }
        .toc-part {
          margin-bottom: 10px;
        }
        .toc-part-label {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 12px;
          color: var(--dark);
          margin-bottom: 3px;
        }
        .toc-section-list {
          list-style: none;
          padding-left: 14px;
        }
        .toc-section-list li {
          color: var(--mid);
          font-size: 12.5px;
          margin-bottom: 2px;
        }
        .toc-section-list a {
          color: inherit;
          text-decoration: none;
        }
        .toc-section-list a:hover {
          color: var(--accent);
          text-decoration: underline;
        }

        /* Part Header */
        .part-header {
          font-family: var(--font-head);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          text-align: center;
          color: #fff;
          background: var(--dark);
          padding: 9px 0;
          margin: 44px 0 24px;
        }

        /* Section Headings */
        .section-heading {
          font-family: var(--font-head);
          font-size: 16.5px;
          font-weight: 700;
          margin: 28px 0 10px;
          color: var(--dark);
          border-bottom: 1px solid var(--border);
          padding-bottom: 5px;
          scroll-margin-top: 20px;
        }
        .section-number {
          color: var(--accent);
        }
        .sub-heading {
          font-family: var(--font-head);
          font-size: 14.5px;
          font-weight: 700;
          margin: 20px 0 8px;
          color: var(--dark);
        }

        /* Body text */
        p.policy-p {
          margin-bottom: 10px;
        }

        /* Lists */
        .policy-list {
          margin: 8px 0 12px 22px;
        }
        .policy-list li {
          margin-bottom: 5px;
        }

        /* Tables */
        .table-wrapper {
          overflow-x: auto;
          margin: 14px 0 18px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 12.5px;
          background: var(--dark);
          color: #fff;
          padding: 8px 10px;
          text-align: left;
          border: 1px solid var(--dark);
        }
        td {
          padding: 7px 10px;
          border: 1px solid var(--border);
          vertical-align: top;
          line-height: 1.55;
        }
        tr:nth-child(even) td {
          background: var(--light-bg);
        }

        /* Callout */
        .callout {
          background: var(--light-bg);
          border-left: 3px solid var(--accent);
          padding: 11px 16px;
          font-style: italic;
          font-size: 13.5px;
          color: var(--mid);
          margin: 14px 0 16px;
          line-height: 1.62;
        }

        /* Notice Bold */
        .notice-bold {
          font-weight: 700;
          font-size: 13.5px;
          color: var(--dark);
          margin: 14px 0;
          padding: 10px 14px;
          border: 1.5px solid var(--dark);
          background: #faf9f6;
        }

        /* Contact Table */
        .contact-table td:first-child {
          font-weight: 700;
          background: var(--light-bg);
          white-space: nowrap;
          width: 26%;
        }

        /* Footer */
        .doc-footer {
          margin-top: 52px;
          border-top: 2px solid var(--dark);
          padding-top: 16px;
          text-align: center;
          font-size: 12px;
          color: var(--muted);
          font-style: italic;
          line-height: 1.8;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .policy-page { padding: 32px 22px; }
          .policy-root { padding: 12px 6px 40px; }
        }

        /* Print */
        @media print {
          .policy-root { background: #fff; padding: 0; }
          .policy-page { box-shadow: none; padding: 40px 50px; }
          .toc-block { display: none; }
        }
      `}</style>

      <div className="policy-root">
        <div className="policy-page">

          {/* ── HEADER ── */}
          <div className="doc-header">
            <div className="brand-name">CORPSE</div>
            <div className="brand-tagline">The Operating System for Esports</div>
            <div className="doc-title">
              Age Assurance and<br />Parental Controls Policy
            </div>
            <div className="doc-subtitle">For Apple App Store and Google Play Store Compliance</div>
            <div className="doc-binding">Binding on All Users &nbsp;|&nbsp; Effective at Account Creation</div>
          </div>

          {/* ── PREAMBLE ── */}
          <p className="doc-preamble">
            This Policy describes the age assurance mechanisms, parental controls, and feature access restrictions implemented on the Corpse platform to protect minor users. It is published in compliance with Apple App Store Review Guidelines and Google Play Developer Programme Policy requirements.
          </p>

          {/* ── TABLE OF CONTENTS ── */}
          <div className="toc-block">
            <button
              className={`toc-toggle ${tocOpen ? "open" : ""}`}
              onClick={() => setTocOpen((o) => !o)}
              aria-expanded={tocOpen}
            >
              Table of Contents
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5L7 10L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={`toc-content ${tocOpen ? "open" : ""}`}>
              {TOC_PARTS.map((part, pi) => (
                <div className="toc-part" key={pi}>
                  <div className="toc-part-label">{part.label}</div>
                  <ul className="toc-section-list">
                    {part.sections.map((sec, si) => {
                      const num = sec.split(".")[0];
                      return (
                        <li key={si}>
                          <a href={`#section-${num}`}>{sec}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════
               PART I — INTRODUCTION AND PURPOSE
          ══════════════════════════════════════════════ */}
          <PartHeader>PART I &nbsp;—&nbsp; INTRODUCTION AND PURPOSE</PartHeader>

          <SectionHeading number="1" title="Purpose of This Policy" />
          <p className="policy-p">
            This Age Assurance and Parental Controls Policy ("Policy") describes the mechanisms by which{" "}
            <strong>[CORPSE ESPORTS PRIVATE LIMITED]</strong> ("Company", "we", "us", "our") classifies users by age,
            restricts access to age-inappropriate features, enforces parental consent requirements for minor users, and
            controls financial transactions on the Corpse platform ("Platform").
          </p>
          <p className="policy-p">
            This Policy is published to satisfy the requirements of the Apple App Store Review Guidelines (specifically
            Guideline 1.3 — Kids Category and age rating requirements) and the Google Play Developer Programme Policy
            (specifically the Families Policy and age-appropriate design requirements). It serves as the formal
            documentation of the Platform's in-app age assurance and parental control mechanisms for the purposes of app
            store review and compliance.
          </p>

          <SectionHeading number="2" title="Scope and Applicability" />
          <p className="policy-p">
            This Policy applies to every registered user and guest user of the Platform on iOS and Android. It governs:
          </p>
          <BulletList
            items={[
              "How the Platform collects and uses age information to classify users.",
              "What features each user tier can access based on their age and KYC verification status.",
              "How the Platform technically enforces these restrictions within the application.",
              "The parental and guardian consent framework for minor users.",
              "The prize escrow hold mechanism for adult users who have not completed KYC.",
              "The rights of parents and guardians to request data access, correction, and deletion for minor accounts.",
            ]}
          />

          <SectionHeading number="3" title="Regulatory and App Store Compliance Context" />
          <p className="policy-p">
            The Platform operates as an e-sports tournament platform. In India, e-sports is classified as a legitimate
            competitive sport under the Online Gaming (Regulation) Act 2025 and is explicitly excluded from the definition
            of online money gaming. The Platform is governed by the following laws and guidelines relevant to age assurance:
          </p>
          <PolicyTable
            headers={["Instrument", "Relevance to This Policy"]}
            rows={[
              {
                cells: [
                  "Digital Personal Data Protection Act 2023 (DPDP Act)",
                  "Requires verifiable parental consent for processing personal data of children below 18 years. Imposes data minimisation obligations for minor data subjects.",
                ],
              },
              {
                cells: [
                  "Indian Contract Act 1872",
                  "Persons below 18 years lack contractual capacity. All financial agreements on the Platform are restricted to adults aged 18 years and above.",
                ],
              },
              {
                cells: [
                  "IT Act 2000 and IT Rules 2021",
                  "Intermediary due diligence obligations including age-appropriate content and access controls.",
                ],
              },
              {
                cells: [
                  "Apple App Store Review Guidelines",
                  "Requires documentation of in-app age assurance and parental controls where the content rating indicates age-restricted features.",
                ],
              },
              {
                cells: [
                  "Google Play Families Policy",
                  "Requires age-appropriate design, parental controls, and disclosure of age-gating mechanisms for apps available to users under 18.",
                ],
              },
            ]}
          />

          {/* ══════════════════════════════════════════════
               PART II — AGE CLASSIFICATION SYSTEM
          ══════════════════════════════════════════════ */}
          <PartHeader>PART II &nbsp;—&nbsp; AGE CLASSIFICATION SYSTEM</PartHeader>

          <SectionHeading number="4" title="How Age Is Collected and Verified" />
          <p className="policy-p">
            The Platform collects date of birth from every user at the point of account creation. This is a mandatory
            field — account creation cannot proceed without a valid date of birth entry in DD/MM/YYYY format. The date of
            birth is used exclusively to:
          </p>
          <BulletList
            items={[
              "Classify the user as a Minor User (ages 13 to 17 inclusive) or an adult user (18 years and above) at the moment of account creation.",
              "Determine the user's access tier, which governs which Platform features are available to that user.",
              "Apply the appropriate data protection framework — the DPDP Act parental consent framework for minor users, and the standard adult framework for users aged 18 and above.",
            ]}
          />
          <p className="policy-p">
            Users who declare a date of birth indicating they are below 13 years of age cannot complete the account
            creation process. Account creation is technically blocked for dates of birth that indicate an age below 13
            years — the registration form rejects such entries before the account is created.
          </p>
          <p className="policy-p">
            The Platform does not perform biometric or document-based age verification at the point of registration. Age
            classification is based on the date of birth self-declared by the user. However, the Platform's KYC
            verification process — which is required for all financial transactions — independently verifies the user's
            identity against their Aadhaar record, which includes their date of birth as held by UIDAI. Any discrepancy
            between the self-declared date of birth and the Aadhaar-verified date of birth is flagged for manual review by
            the Platform's trust and safety team.
          </p>
          <Callout>
            A user who provides a false date of birth to circumvent age restrictions violates the Platform's Master Terms
            and Conditions and is subject to immediate account suspension and permanent ban upon detection. KYC
            verification acts as a secondary check that detects age misrepresentation for all users who seek access to
            financial features.
          </Callout>

          <SectionHeading number="5" title="User Tiers Based on Age and KYC Status" />
          <p className="policy-p">
            The Platform operates a three-tier user access framework based on the user's age and KYC verification status.
            Every registered user falls into exactly one of the following tiers at any given time:
          </p>
          <PolicyTable
            headers={["Tier", "Classification", "Criteria", "Primary Characteristics"]}
            rows={[
              {
                cells: [
                  "Tier 1",
                  "Minor User",
                  "Age between 13 and 17 years inclusive at account creation",
                  "Restricted to non-financial participation only. Cannot be Captain. Cannot pay entry fees. Cannot receive prize money. Can join free arenas and accept squad invites from adult Captains.",
                ],
              },
              {
                cells: [
                  "Tier 2",
                  "Adult User — No KYC",
                  "Age 18 years or above. KYC verification not completed.",
                  "Can participate freely in all non-financial features. Can act as Captain. Can register and pay entry fees for paid arenas. Prize money won is held in escrow until KYC is completed. Full feature access on KYC completion.",
                ],
              },
              {
                cells: [
                  "Tier 3",
                  "Adult User — KYC Verified",
                  "Age 18 years or above. KYC verification successfully completed.",
                  "Full unrestricted access to all Platform features including paying entry fees, receiving prize money, creating guilds, and organiser functions.",
                ],
              },
            ]}
          />

          <SectionHeading number="6" title="The Three-Tier Access Framework" />
          <p className="policy-p">
            The three-tier framework is the core mechanism by which the Platform enforces age-appropriate access. Each
            tier has a defined set of permitted and restricted features. The tier assignment is:
          </p>
          <BulletList
            items={[
              "<strong>Automatic</strong> — determined at account creation based on the declared date of birth, with no user action required.",
              "<strong>Persistent</strong> — the tier assignment remains active throughout the user's session and across all devices.",
              "<strong>Upgradeable</strong> — a Tier 1 user who turns 18 years of age can request a tier upgrade by contacting support. A Tier 2 user upgrades to Tier 3 automatically upon completing KYC verification.",
              "<strong>Technically enforced</strong> — feature restrictions are enforced at the API level within the Platform's backend infrastructure. A restricted feature is inaccessible both in the UI and at the server level — UI-level restriction alone is not relied upon.",
            ]}
          />

          {/* ══════════════════════════════════════════════
               PART III — TIER 1 MINOR USERS
          ══════════════════════════════════════════════ */}
          <PartHeader>PART III &nbsp;—&nbsp; TIER 1 — MINOR USERS (AGES 13 TO 17)</PartHeader>

          <SectionHeading number="7" title="What Minor Users Can Do" />
          <p className="policy-p">
            Minor Users (users between the ages of 13 and 17 inclusive) are permitted to access the following Platform
            features:
          </p>
          <BulletList
            items={[
              "Create and maintain a registered account with a username, avatar, and in-game ID.",
              "Browse the arena discovery feed and view tournament listings, prize pool information, and organiser profiles.",
              "Join free arenas (arenas with no entry fee and no monetary prize pool) by accepting an invite from a KYC-verified adult Captain.",
              "Participate as a squad member in paid arenas when invited by a KYC-verified adult Captain. The minor user does not pay any entry fee — the Captain pays on behalf of the squad.",
              "Accumulate ELO points from arena participation in both free and paid arenas.",
              "Progress through the Ecosystem Pipeline competitive tiers based on ELO performance.",
              "View the Platform leaderboards (player and guild).",
              "Browse guild profiles and guild leaderboards.",
              "Access the Help Centre and platform documentation.",
              "Submit result screenshots via the auto-capture system after matches.",
              "View their own match history and performance statistics.",
            ]}
          />

          <SectionHeading number="8" title="What Minor Users Cannot Do" />
          <p className="policy-p">
            The following features are technically blocked for all Minor Users and cannot be accessed regardless of any
            action taken within the app:
          </p>
          <BulletList
            items={[
              "Act as squad Captain in any arena — free or paid.",
              "Create a squad as Captain.",
              "Register for any arena independently as Captain.",
              "Pay an entry fee for any arena.",
              "Receive prize money directly. If a minor user is part of a winning squad, the prize is disbursed exclusively to the adult KYC-verified Captain's bank account.",
              "Complete KYC verification. KYC requires Aadhaar OTP, PAN verification, and bank account verification — none of which are available to minors in their own name under Indian law.",
              "Create a guild (KYC verification is required to create a guild).",
              "Act as an Organiser on the Platform.",
              "Make any financial transaction of any kind on the Platform.",
            ]}
          />
          <NoticeBold>
            These restrictions are enforced at the server (API) level, not only in the user interface. Attempts to access
            restricted features via API calls or any other technical means will be rejected by the Platform's backend
            regardless of the method used.
          </NoticeBold>

          <SectionHeading number="9" title="How Platform Controls Enforce These Restrictions" />
          <p className="policy-p">
            The following technical controls are implemented in the Platform's backend infrastructure to enforce Minor User
            restrictions:
          </p>
          <PolicyTable
            headers={["Restriction", "Enforcement Mechanism", "Layer"]}
            rows={[
              {
                cells: [
                  "Cannot be Captain",
                  "The 'Create Squad as Captain' API endpoint validates the user's age tier before processing the request. Tier 1 requests are rejected with an error code indicating the age restriction.",
                  "Backend API",
                ],
              },
              {
                cells: [
                  "Cannot pay entry fees",
                  "The payment initiation endpoint validates the user's age tier and KYC status. Tier 1 users cannot initiate a Razorpay payment session for entry fees.",
                  "Backend API + Payment Gateway",
                ],
              },
              {
                cells: [
                  "Cannot receive prize money",
                  "Prize disbursement is processed only to the Captain's KYC-verified bank account. Minor users have no bank account on file and no disbursement path.",
                  "Backend financial system",
                ],
              },
              {
                cells: [
                  "Cannot complete KYC",
                  "The KYC initiation endpoint is blocked for users classified as Tier 1 (ages 13 to 17). The KYC section is hidden from the Minor User's Settings UI.",
                  "Backend API + UI",
                ],
              },
              {
                cells: [
                  "Cannot create guild",
                  "Guild creation requires KYC verification. Guild creation API rejects Tier 1 requests.",
                  "Backend API",
                ],
              },
              {
                cells: [
                  "Cannot act as Organiser",
                  "Organiser dashboard access requires KYC verification. Blocked at API level for Tier 1.",
                  "Backend API",
                ],
              },
              {
                cells: [
                  "UI presentation",
                  "Features unavailable to Tier 1 users are either hidden from the UI or displayed with an explanatory message indicating the age or KYC requirement.",
                  "Frontend UI",
                ],
              },
            ]}
          />

          <SectionHeading number="10" title="Parental and Guardian Consent Framework" />
          <p className="policy-p">
            The Platform implements the following parental and guardian consent framework for Minor Users, in compliance
            with the Digital Personal Data Protection Act 2023:
          </p>

          <SubHeading>10.1 Consent at Registration</SubHeading>
          <p className="policy-p">
            During account creation, users who declare a date of birth indicating they are between 13 and 17 years are
            presented with a mandatory disclosure screen that:
          </p>
          <BulletList
            items={[
              "Informs the minor user that the Platform requires parental or guardian consent for users between 13 and 17 years.",
              "Requires the minor user to confirm that a parent or legal guardian has reviewed the Platform's Terms and Conditions and Privacy Policy and has consented to the minor's registration.",
              "Explains the restrictions that apply to minor accounts.",
              "Provides the parent or guardian's contact email for the Company (legal@corpsearena.com) for any queries about their child's account.",
            ]}
          />
          <p className="policy-p">
            This confirmation is recorded as a consent event on the minor user's account with a timestamp. The Platform
            acknowledges that this confirmation is self-declared by the minor and relies on the parent or guardian actively
            enforcing their right to review and withdraw consent.
          </p>

          <SubHeading>10.2 Guardian Rights Over Minor Accounts</SubHeading>
          <p className="policy-p">
            A parent or legal guardian of a Minor User has the following rights in relation to their child's account,
            exercisable by contacting legal@corpsearena.com with proof of guardianship:
          </p>
          <BulletList
            items={[
              "<strong>Right to access</strong> — the guardian may request a summary of what data the Platform holds on their child's account.",
              "<strong>Right to correction</strong> — the guardian may request correction of any inaccurate data on the minor's account.",
              "<strong>Right to deletion</strong> — the guardian may request deletion of the minor's account and all associated personal data.",
              "<strong>Right to withdraw consent</strong> — the guardian may withdraw consent for the Platform's processing of the minor's personal data. Withdrawal of consent results in account deactivation and data deletion.",
            ]}
          />
          <p className="policy-p">
            The Company will respond to all guardian requests within 30 days of receipt of a valid request with proof of
            guardianship.
          </p>

          <SectionHeading number="11" title="Data Protections for Minor Users" />
          <p className="policy-p">
            In addition to the feature restrictions described above, the following data minimisation and protection
            measures apply specifically to Minor Users:
          </p>
          <BulletList
            items={[
              "No financial data is collected from Minor Users — no entry fee transaction records, no prize disbursement records, no KYC data.",
              "No phone number is collected from Minor Users in connection with any account feature.",
              "Minor Users are not displayed in prize-related leaderboards or financial standings.",
              "Minor User ELO scores and competitive rankings are publicly visible on the standard leaderboard.",
              "Match participation records for Minor Users are retained for the duration of the account and anonymised upon account deletion.",
            ]}
          />

          {/* ══════════════════════════════════════════════
               PART IV — TIER 2 ADULT USERS WITHOUT KYC
          ══════════════════════════════════════════════ */}
          <PartHeader>PART IV &nbsp;—&nbsp; TIER 2 — ADULT USERS WITHOUT KYC (AGES 18+)</PartHeader>

          <SectionHeading number="12" title="What Tier 2 Users Can Do" />
          <p className="policy-p">
            Adult users aged 18 years and above who have not yet completed KYC verification (Tier 2) have access to the
            full Platform experience except for prize money disbursement. Specifically, Tier 2 users can:
          </p>
          <BulletList
            items={[
              "Access all features available to Tier 1 (Minor Users).",
              "Act as squad Captain — creating squads, inviting members, and registering for arenas.",
              "Register for and participate in paid arenas as Captain, including paying entry fees via Razorpay.",
              "Register for and participate in paid arenas as a squad member under any Captain.",
              "Win prize money in paid arenas — prize amounts are calculated and assigned to the winning Captain's account.",
              "Create and lead guilds — guild creation does not require KYC at the Tier 2 level.",
            ]}
          />
          <Callout>
            A Tier 2 user can pay entry fees and compete for prizes. The restriction is on receiving prize money — not on
            competing. This distinction is important: the Platform allows competitive participation while maintaining
            financial controls that comply with Indian regulatory requirements (PMLA 2002 and RBI guidelines) by requiring
            KYC before any money is disbursed.
          </Callout>

          <SectionHeading number="13" title="Financial Restrictions Without KYC" />
          <p className="policy-p">
            The following financial activities are restricted for Tier 2 users (adult users without KYC):
          </p>
          <BulletList
            items={[
              "Cannot receive prize money directly into a bank account — no bank account is on file without KYC completion.",
              "Cannot receive organiser settlement payments — organiser settlement requires a KYC-verified bank account.",
              "Cannot make withdrawals of any kind — there is no wallet system on the Platform that would allow fund accumulation and withdrawal without a KYC-verified bank account.",
            ]}
          />
          <p className="policy-p">
            The entry fee payment restriction is explicitly not applied to Tier 2 users. An adult user may pay entry fees
            and participate in paid contests without KYC. KYC is only required at the point of receiving funds — not at
            the point of spending them.
          </p>
          <NoticeBold>
            The decision to allow entry fee payment without KYC but restrict prize disbursement without KYC is a
            deliberate design choice compliant with RBI guidelines for payment aggregators, which require KYC for fund
            outflows but not for all fund inflows where the payer is a registered user.
          </NoticeBold>

          <SectionHeading number="14" title="Prize Escrow Hold Mechanism" />
          <p className="policy-p">
            When a Tier 2 user (adult without KYC) wins prize money as Captain of a winning squad, the following prize
            escrow hold mechanism is activated:
          </p>
          <BulletList
            items={[
              "<strong>Step 1 — Prize calculation:</strong> The Platform calculates the prize amount owed to the winning squad, including TDS deduction at 30% and the Rs 5.90 bank payout fee.",
              "<strong>Step 2 — Escrow hold:</strong> Instead of disbursing the prize to a bank account, the net prize amount is held in the Platform's escrow account against the Captain's account record.",
              "<strong>Step 3 — In-app notification:</strong> The Captain receives an immediate in-app notification and email informing them that their prize money is being held pending KYC completion.",
              "<strong>Step 4 — Squad member notification:</strong> All squad members who participated in the winning match also receive an in-app notification and email.",
              "<strong>Step 5 — KYC completion:</strong> When the Captain completes KYC verification, the held prize amount is disbursed to their newly verified bank account within 24 hours of KYC approval.",
              "<strong>Step 6 — Hold period:</strong> The escrow hold remains in place for an indefinite period pending KYC completion. The maximum hold period is 12 months from the date the prize was won.",
            ]}
          />

          <SectionHeading number="15" title="Notifications to Captain and Squad Members" />
          <p className="policy-p">
            The following notifications are sent in connection with the prize escrow hold mechanism:
          </p>
          <PolicyTable
            headers={["Notification", "Recipient", "Channel", "Content", "Timing"]}
            rows={[
              {
                cells: [
                  "Prize hold — Captain",
                  "Winning Captain (Tier 2)",
                  "In-app + Email",
                  "Your squad won [Arena Name]. Your prize of Rs [Net Amount] (after 30% TDS deduction) is being held pending KYC completion.",
                  "Immediately after result verification",
                ],
              },
              {
                cells: [
                  "Prize hold — Squad members",
                  "All squad members",
                  "In-app + Email",
                  "Your squad won [Arena Name]. Prize disbursement to your Captain is pending because the Captain has not yet completed KYC verification.",
                  "Immediately after result verification",
                ],
              },
              {
                cells: [
                  "KYC reminder — 30 days",
                  "Winning Captain (Tier 2)",
                  "In-app + Email",
                  "Your prize of Rs [Net Amount] from [Arena Name] remains held pending KYC completion.",
                  "30 days after hold begins",
                ],
              },
              {
                cells: [
                  "KYC reminder — 10 months",
                  "Winning Captain (Tier 2)",
                  "In-app + Email",
                  "Your prize of Rs [Net Amount] will be forfeited in 60 days if KYC is not completed.",
                  "10 months after hold begins",
                ],
              },
              {
                cells: [
                  "KYC reminder — 11 months",
                  "Winning Captain (Tier 2)",
                  "In-app + Email",
                  "Final notice: Your prize of Rs [Net Amount] will be permanently forfeited in 30 days if KYC is not completed.",
                  "11 months after hold begins",
                ],
              },
              {
                cells: [
                  "Disbursement confirmation",
                  "Winning Captain (Tier 3)",
                  "In-app + Email",
                  "KYC verification complete. Your held prize of Rs [Net Amount] from [Arena Name] has been disbursed to your verified bank account ending XXXX.",
                  "Within 24 hours of KYC approval",
                ],
              },
              {
                cells: [
                  "Forfeiture notice",
                  "Winning Captain (Tier 2)",
                  "In-app + Email",
                  "Your prize of Rs [Net Amount] from [Arena Name] has been forfeited as KYC was not completed within the 12-month hold period.",
                  "At 12-month mark if KYC not done",
                ],
              },
            ]}
          />

          <SectionHeading number="16" title="Maximum Escrow Hold Period" />
          <p className="policy-p">
            The Platform cannot hold prize money in escrow indefinitely. The maximum hold period is 12 calendar months
            from the date the prize was won and the hold was initiated. The following applies:
          </p>
          <BulletList
            items={[
              "The 12-month period is disclosed to the Captain at the time the hold is initiated.",
              "The Captain receives three reminder notifications at 30 days, 10 months, and 11 months.",
              "If KYC is not completed within 12 months, the held prize amount is permanently forfeited.",
              "The forfeited amount is transferred to the Company's revenue account and is not redistributed to other platform users or squad members.",
              "Forfeiture is permanent and irreversible. The Company will not reinstate forfeited prize amounts under any circumstances.",
            ]}
          />

          {/* ══════════════════════════════════════════════
               PART V — TIER 3 KYC-VERIFIED ADULT USERS
          ══════════════════════════════════════════════ */}
          <PartHeader>PART V &nbsp;—&nbsp; TIER 3 — KYC-VERIFIED ADULT USERS (AGES 18+)</PartHeader>

          <SectionHeading number="17" title="Full Platform Access" />
          <p className="policy-p">
            Tier 3 users — adults aged 18 and above who have completed KYC verification — have full and unrestricted
            access to all Platform features. No feature is blocked for Tier 3 users except as may result from disciplinary
            action applied under the Account Suspension and Ban Terms and Conditions.
          </p>
          <p className="policy-p">Tier 3 users can:</p>
          <BulletList
            items={[
              "Pay entry fees and participate in paid arenas as Captain or squad member.",
              "Receive prize money directly to their KYC-verified bank account within 24 hours of result verification.",
              "Create guilds and act as Guild Captain with full leadership authority.",
              "Act as Organiser — creating and managing arenas, depositing security pools, and receiving organiser settlement payments.",
              "Complete all financial transactions on the Platform without restriction.",
            ]}
          />

          <SectionHeading number="18" title="KYC Requirements" />
          <p className="policy-p">
            KYC verification for Tier 3 status requires the successful completion of the following three verification
            steps via the Platform's authorised eKYC service provider:
          </p>
          <BulletList
            items={[
              "<strong>Aadhaar OTP verification</strong> — the user's Aadhaar number is verified against the UIDAI database via OTP authentication to the Aadhaar-linked mobile number.",
              "<strong>PAN verification</strong> — the user's PAN card number is verified against the Income Tax Department database. The name on the PAN must match the name on the Aadhaar.",
              "<strong>Bank account verification</strong> — the user's bank account number and IFSC code are verified via penny drop to confirm the account is active and belongs to the user.",
            ]}
          />
          <p className="policy-p">
            Successful completion of all three steps upgrades the user from Tier 2 to Tier 3 automatically. The KYC
            process serves dual purposes: financial compliance (PMLA 2002, RBI guidelines) and secondary age verification.
          </p>

          {/* ══════════════════════════════════════════════
               PART VI — FEATURE ACCESS MATRIX
          ══════════════════════════════════════════════ */}
          <PartHeader>PART VI &nbsp;—&nbsp; FEATURE ACCESS MATRIX</PartHeader>

          <SectionHeading number="19" title="Complete Feature Access Table by Tier" />
          <p className="policy-p">
            The following table is the complete reference for feature access across all three user tiers. This is the
            authoritative reference for app store review purposes.
          </p>
          <PolicyTable
            headers={["Feature", "Tier 1 (Minor, Ages 13–17)", "Tier 2 (Adult, No KYC)", "Tier 3 (Adult, KYC Done)"]}
            rows={[
              { cells: ["Create registered account", "Yes", "Yes", "Yes"] },
              { cells: ["Browse arena listings", "Yes", "Yes", "Yes"] },
              { cells: ["Join free arenas as squad member (invited)", "Yes", "Yes", "Yes"] },
              { cells: ["Join paid arenas as squad member (invited)", "Yes — no payment made", "Yes — no payment made", "Yes — no payment made"] },
              { cells: ["Play matches and submit results", "Yes", "Yes", "Yes"] },
              { cells: ["Accumulate ELO from matches", "Yes", "Yes", "Yes"] },
              { cells: ["Progress through Ecosystem Pipeline tiers", "Yes", "Yes", "Yes"] },
              { cells: ["View leaderboards", "Yes", "Yes", "Yes"] },
              { cells: ["View match history", "Yes", "Yes", "Yes"] },
              { cells: ["Access Help Centre", "Yes", "Yes", "Yes"] },
              { cells: ["Act as squad Captain", "No — blocked", "Yes", "Yes"] },
              { cells: ["Pay entry fees as Captain", "No — blocked", "Yes", "Yes"] },
              { cells: ["Register squad for paid arena", "No — blocked", "Yes", "Yes"] },
              { cells: ["Receive prize money", "No — blocked", "Held in escrow until KYC", "Yes — within 24 hours"] },
              { cells: ["Create a guild", "No — blocked", "No — requires KYC", "Yes"] },
              { cells: ["Act as Guild Captain", "No — blocked", "No — requires KYC", "Yes"] },
              { cells: ["Complete KYC verification", "No — blocked", "Yes — to upgrade", "Completed"] },
              { cells: ["Act as Organiser", "No — blocked", "No — requires KYC", "Yes"] },
              { cells: ["Receive organiser settlement", "No — blocked", "No — requires KYC", "Yes"] },
            ]}
          />

          {/* ══════════════════════════════════════════════
               PART VII — IN-APP CONTROLS AND ENFORCEMENT
          ══════════════════════════════════════════════ */}
          <PartHeader>PART VII &nbsp;—&nbsp; IN-APP CONTROLS AND ENFORCEMENT MECHANISMS</PartHeader>

          <SectionHeading number="20" title="Technical Enforcement — How Controls Are Implemented" />
          <p className="policy-p">
            The Platform's age assurance and access control mechanisms are implemented at two layers — the user interface
            layer and the backend API layer. Dual-layer enforcement ensures that restrictions cannot be circumvented by
            manipulating the UI or making direct API calls.
          </p>

          <SubHeading>20.1 User Interface Layer</SubHeading>
          <p className="policy-p">At the UI layer, the following controls are applied:</p>
          <BulletList
            items={[
              "Features unavailable to a user's tier are either hidden from the navigation or displayed in a disabled state with an explanatory message.",
              "The KYC section in Settings is hidden entirely for Tier 1 users.",
              "The 'Create Squad as Captain' button is disabled and non-tappable for Tier 1 users.",
              "The payment flow cannot be initiated from the UI by Tier 1 users.",
              "The prize hold status is displayed prominently in the Tier 2 Captain's account dashboard when a prize is in escrow.",
            ]}
          />

          <SubHeading>20.2 Backend API Layer</SubHeading>
          <p className="policy-p">At the backend API layer, the following server-side controls are enforced:</p>
          <BulletList
            items={[
              "Every API request to a protected endpoint includes a JWT session token. The backend validates the token and extracts the user's tier classification before processing any request.",
              "Protected endpoints include: squad creation, arena registration as Captain, payment initiation, KYC initiation, guild creation, organiser dashboard access, and prize disbursement.",
              "A Tier 1 request to any protected endpoint returns an HTTP 403 Forbidden response with an error code indicating the specific age restriction.",
              "A Tier 2 request to prize disbursement or organiser settlement endpoints returns an HTTP 403 Forbidden response with an error code indicating the KYC requirement.",
              "Backend validation is independent of the UI state — even if a UI control is present, the backend will reject a non-compliant request.",
            ]}
          />

          <SectionHeading number="21" title="Account Flags and Age Verification Events" />
          <p className="policy-p">
            The Platform maintains an internal log of the following age-related events on each user account:
          </p>
          <BulletList
            items={[
              "Account creation timestamp and declared date of birth — retained as part of the account record.",
              "Age tier classification event — recorded at account creation, confirming the tier assigned.",
              "Age tier upgrade event — recorded if a Tier 1 user turns 18 and requests an upgrade.",
              "KYC initiation and completion events — recorded with timestamps.",
              "Prize escrow hold events — recorded for each prize held, including the amount, the arena, the date held, and the date of disbursement or forfeiture.",
              "Parental consent confirmation — recorded at account creation for Tier 1 users.",
            ]}
          />
          <p className="policy-p">
            These logs are retained for the duration of the account and for 5 years after account deletion for compliance
            and audit purposes.
          </p>

          <SectionHeading number="22" title="Parental Contact and Guardian Rights" />
          <p className="policy-p">
            Parents and legal guardians of Minor Users (Tier 1) who have concerns about their child's use of the Platform
            or wish to exercise their rights under the DPDP Act 2023 should contact:
          </p>
          <div className="table-wrapper">
            <table className="contact-table">
              <tbody>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>legal@corpsearena.com</td>
                </tr>
                <tr>
                  <td><strong>Subject Line</strong></td>
                  <td>PARENTAL CONTROL REQUEST — [Child's Username]</td>
                </tr>
                <tr>
                  <td><strong>Include</strong></td>
                  <td>
                    Proof of guardianship (e.g., birth certificate or government ID), the minor user's registered email
                    address or username, and a description of the action requested
                  </td>
                </tr>
                <tr>
                  <td><strong>Response Time</strong></td>
                  <td>30 days from receipt of a valid request with proof of guardianship</td>
                </tr>
                <tr>
                  <td><strong>Available Actions</strong></td>
                  <td>
                    Account access review, data correction, account deletion, consent withdrawal, or escalation to the
                    Data Protection Board of India (once operational)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ══════════════════════════════════════════════
               PART VIII — APP STORE COMPLIANCE
          ══════════════════════════════════════════════ */}
          <PartHeader>PART VIII &nbsp;—&nbsp; APP STORE COMPLIANCE STATEMENT</PartHeader>

          <SectionHeading number="23" title="Apple App Store Compliance" />
          <p className="policy-p">
            This section is addressed to Apple Inc.'s App Review team and provides the information requested regarding
            in-app age assurance and parental controls on the Corpse platform.
          </p>

          <SubHeading>23.1 Age Assurance Mechanism</SubHeading>
          <BulletList
            items={[
              "<strong>Minimum age enforcement:</strong> Account creation is technically blocked for users below 13 years.",
              "<strong>Mandatory date of birth collection at account creation</strong> — the user cannot create an account without providing a valid date of birth.",
              "<strong>Automatic age tier classification</strong> — the declared date of birth is used to classify the user as Minor or adult at the moment of account creation.",
              "<strong>Secondary age verification via KYC</strong> — all users seeking financial features must complete Aadhaar-based eKYC.",
            ]}
          />

          <SubHeading>23.2 Parental Controls</SubHeading>
          <BulletList
            items={[
              "<strong>Financial transaction blocking</strong> — Minor Users cannot pay entry fees, receive prize money, or complete KYC.",
              "<strong>Captain role blocking</strong> — Minor Users cannot act as squad Captain, create squads, or register squads for arenas.",
              "<strong>Guild creation blocking</strong> — Minor Users cannot create guilds.",
              "<strong>Parental consent confirmation</strong> — Minor Users are required to confirm parental consent at account creation.",
              "<strong>Guardian rights</strong> — Parents and legal guardians can request account access, data correction, account deletion, and consent withdrawal by contacting legal@corpsearena.com.",
            ]}
          />

          <SubHeading>23.3 How to Locate These Controls in the App</SubHeading>
          <p className="policy-p">The Apple App Review team can verify the in-app controls as follows:</p>
          <BulletList
            items={[
              "Create an account with a date of birth indicating age between 13 and 17 inclusive (e.g., 01/01/2013). The parental consent disclosure screen appears before account creation completes.",
              "After account creation, navigate to Settings. The KYC Verification option is absent from the Settings menu for Minor User accounts.",
              "Tap Arena and select any paid arena. The 'Register as Captain' option is disabled and displays the message indicating the age restriction.",
              "Attempt to access Guild > Create Guild. The option is disabled for Minor User accounts.",
              "All of the above restrictions are also enforced at the backend API level.",
            ]}
          />

          <SectionHeading number="24" title="Google Play Store Compliance" />
          <p className="policy-p">
            This section is addressed to Google's Play Store review team and provides the information requested regarding
            in-app age assurance and parental controls on the Corpse platform.
          </p>

          <SubHeading>24.1 Age Assurance Mechanism</SubHeading>
          <BulletList
            items={[
              "Mandatory date of birth entry at registration — the Platform cannot be used to create an account without providing a date of birth.",
              "Automatic tier classification — users below 18 are classified as Tier 1 (Minor Users) with restricted access.",
              "KYC-based secondary verification — Aadhaar eKYC independently verifies age for users seeking financial access.",
            ]}
          />

          <SubHeading>24.2 Families Policy Compliance</SubHeading>
          <BulletList
            items={[
              "The app is rated for users aged 13 and above. Account creation is technically blocked for users below 13 years.",
              "Users aged 13 to 17 (Minor Users) are restricted from all financial features. No purchase or financial transaction is possible for Minor Users.",
              "Parental consent is sought and recorded for Minor Users at account creation.",
              "Parents and guardians can contact legal@corpsearena.com to request data access, correction, deletion, or consent withdrawal for their child's account.",
              "The app does not collect or share Minor User data for advertising or commercial profiling purposes.",
              "All financial features (in-app purchases, entry fees, prize money) are restricted to Tier 3 users — KYC-verified adults aged 18 and above.",
            ]}
          />

          <SubHeading>24.3 How to Locate These Controls in the App</SubHeading>
          <p className="policy-p">
            The Google Play review team can verify the in-app controls using the same steps described in Section 23.3
            above.
          </p>

          <PartHeader>PART IX &nbsp;—&nbsp; GOVERNING LAW AND CONTACT</PartHeader>

          <SectionHeading number="25" title="Governing Law" />
          <p className="policy-p">
            This Age Assurance and Parental Controls Policy is governed by the laws of India, including the Digital
            Personal Data Protection Act 2023, the Information Technology Act 2000, and the Indian Contract Act 1872.
            This Policy forms part of the Corpse platform's legal framework and must be read alongside the Master Terms
            and Conditions, the Master Privacy Policy, the KYC and KYC Modification Terms and Conditions, and all other
            applicable Corpse legal documents accessible under Settings &gt; Legal within the Platform.
          </p>

          <div className="doc-footer">
            <p>CORPSE ESPORTS PRIVATE LIMITED &nbsp;·&nbsp; legal@corpsearena.com</p>
            <p>Age Assurance and Parental Controls Policy &nbsp;·&nbsp; Effective at Account Creation</p>
          </div>

        </div>
      </div>
    </>
  );
}