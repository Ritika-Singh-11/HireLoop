/**
 * Centralized Placement Eligibility Synchronizer
 * 
 * Synchronizes University/College Directorate Placement Policy with Company Job/Drive Criteria.
 * 
 * CORE RULE: College Directorate Eligibility Policy STRICTLY OVERRIDES.
 * Even if a company offers compensation and the student meets company criteria,
 * if the student fails the College Eligibility Criteria, they CANNOT apply or register.
 */

const ALL_CAMPUS_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Comm.',
  'Electrical Engg.',
  'Mechanical Engg.',
  'Civil Engg.',
  'Chemical Engg.',
  'Data Science & AI'
];

export function checkCandidateEligibility({
  student = {},
  companyRequirement = {},
  collegePolicy = {},
  userApplications = [],
}) {
  const companyReasons = [];
  const collegeReasons = [];

  const studentCgpa = parseFloat(student?.cgpa) || 0;
  const studentBacklogs = parseInt(student?.backlogs) || 0;
  const studentBranch = (student?.branch || '').trim();
  const studentBatch = String(student?.batch || '').trim();
  const isBlocked = !!student?.isBlocked;
  const isVerified = student?.isVerified !== false;
  const studentAttendance = student?.attendance !== undefined ? parseFloat(student.attendance) : 85;

  // ----------------------------------------------------
  // 1. COMPANY CRITERIA EVALUATION
  // ----------------------------------------------------
  const compMinCgpa = companyRequirement?.minCgpa !== undefined && companyRequirement.minCgpa !== null
    ? parseFloat(companyRequirement.minCgpa)
    : null;
  const compMaxBacklogs = companyRequirement?.maxBacklogs !== undefined && companyRequirement.maxBacklogs !== null
    ? parseInt(companyRequirement.maxBacklogs)
    : null;
  const compBatch = companyRequirement?.eligibleBatch ? String(companyRequirement.eligibleBatch).trim() : null;
  const compBranches = companyRequirement?.eligibleBranches || companyRequirement?.allowedBranches || [];

  if (compMinCgpa !== null && studentCgpa < compMinCgpa) {
    companyReasons.push(`Company requires min CGPA of ${compMinCgpa.toFixed(1)} (Your CGPA: ${studentCgpa.toFixed(1)})`);
  }

  if (compMaxBacklogs !== null && studentBacklogs > compMaxBacklogs) {
    companyReasons.push(`Company permits max ${compMaxBacklogs} backlogs (You have ${studentBacklogs})`);
  }

  if (compBatch && compBatch.toLowerCase() !== 'all' && studentBatch && studentBatch !== compBatch) {
    companyReasons.push(`Company role restricted to Batch ${compBatch} (Your batch: ${studentBatch})`);
  }

  if (compBranches.length > 0) {
    const sBranchLow = studentBranch.toLowerCase();
    const isCompBranchAllowed = compBranches.some(b => {
      const bLow = b.toLowerCase();
      return bLow.includes('all') || sBranchLow.includes(bLow) || bLow.includes(sBranchLow);
    });
    if (!isCompBranchAllowed) {
      companyReasons.push(`Company role open only to: ${compBranches.join(', ')}`);
    }
  }

  const passesCompany = companyReasons.length === 0;

  // ----------------------------------------------------
  // 2. COLLEGE / UNIVERSITY PLACEMENT DIRECTORATE POLICY
  // ----------------------------------------------------
  const clgMinCgpa = collegePolicy?.minCgpa !== undefined ? parseFloat(collegePolicy.minCgpa) : 7.0;
  const clgMaxBacklogs = collegePolicy?.maxBacklogs !== undefined ? parseInt(collegePolicy.maxBacklogs) : 0;
  const clgBatch = collegePolicy?.eligibleBatch ? String(collegePolicy.eligibleBatch).trim() : null;
  const clgBranches = collegePolicy?.allowedBranches || ALL_CAMPUS_BRANCHES;
  const clgMinAttendance = collegePolicy?.minAttendancePercentage !== undefined ? parseFloat(collegePolicy.minAttendancePercentage) : 75;

  // A. College Minimum CGPA Threshold
  if (studentCgpa < clgMinCgpa) {
    collegeReasons.push(
      `College Placement Policy requires min CGPA of ${clgMinCgpa.toFixed(1)} (Your CGPA: ${studentCgpa.toFixed(1)})`
    );
  }

  // B. College Maximum Backlogs Policy
  if (studentBacklogs > clgMaxBacklogs) {
    collegeReasons.push(
      `College Placement Policy restricts to max ${clgMaxBacklogs} backlogs (You have ${studentBacklogs} active)`
    );
  }

  // C. College Permitted Academic Disciplines
  if (clgBranches.length > 0 && studentBranch) {
    const sBranchLow = studentBranch.toLowerCase();
    const isClgBranchAllowed = clgBranches.some(b => {
      const bLow = b.toLowerCase();
      return bLow.includes('all') || sBranchLow.includes(bLow) || bLow.includes(sBranchLow);
    });
    if (!isClgBranchAllowed) {
      collegeReasons.push(
        `Your discipline (${studentBranch}) is not in the College approved placement discipline roster`
      );
    }
  }

  // D. College Eligible Batch
  if (clgBatch && clgBatch.toLowerCase() !== 'all' && studentBatch && studentBatch !== clgBatch) {
    collegeReasons.push(
      `College recruitment cycle is restricted to Batch ${clgBatch} (Your batch: ${studentBatch})`
    );
  }

  // E. Disciplinary Freeze & Verification
  if (isBlocked) {
    collegeReasons.push(student?.blockReason || 'Student account is under disciplinary freeze by University Placement Directorate');
  }
  if (!isVerified) {
    collegeReasons.push('Academic records not yet authenticated by TPO Verification Cell');
  }

  // F. Minimum Training & Placement Attendance
  if (studentAttendance < clgMinAttendance) {
    collegeReasons.push(
      `College requires min ${clgMinAttendance}% T&P attendance (Your attendance: ${studentAttendance}%)`
    );
  }

  // G. Multi-Offer & CTC Tier Rules (One-Student-One-Tier Rule)
  const existingAcceptedOffers = (userApplications || []).filter(a =>
    a.status === 'Offered' || a.status === 'Accepted' || a.offerAccepted || a.offerStatus === 'accepted'
  );
  const currentPlacedCompany = student?.placedCompany || (existingAcceptedOffers.length > 0 ? existingAcceptedOffers[0].companyName : null);

  if (currentPlacedCompany) {
    const allowMultiple = collegePolicy?.allowMultipleOffers !== undefined ? collegePolicy.allowMultipleOffers : true;
    const dreamThreshold = parseFloat(collegePolicy?.dreamThreshold) || 15.0;
    const superDreamThreshold = parseFloat(collegePolicy?.superDreamThreshold) || 25.0;
    const companyCtc = parseFloat(companyRequirement?.salaryMax || companyRequirement?.ctcMax || companyRequirement?.ctc?.totalLpa || 0);

    if (!allowMultiple) {
      collegeReasons.push(
        `Under College Placement Policy (Single Offer Rule), placed candidates (${currentPlacedCompany}) cannot apply for further drives`
      );
    } else {
      let currentBestLpa = 0;
      for (const off of existingAcceptedOffers) {
        const lpa = parseFloat(off.package || off.ctc?.totalLpa || off.salaryMax || 0);
        if (lpa > currentBestLpa) currentBestLpa = lpa;
      }

      if (currentBestLpa >= superDreamThreshold) {
        collegeReasons.push(
          `You have secured a Super Dream offer (≥₹${superDreamThreshold} LPA). Further campus applications are frozen to maintain peer equity.`
        );
      } else if (currentBestLpa >= dreamThreshold && companyCtc > 0 && companyCtc < superDreamThreshold) {
        collegeReasons.push(
          `You hold a Dream offer. Under University policy, you may only upgrade to Super Dream tier companies (≥₹${superDreamThreshold} LPA).`
        );
      } else if (companyCtc > 0 && companyCtc <= currentBestLpa) {
        collegeReasons.push(
          `Under University policy, you cannot apply to a company offering lower or equal CTC (₹${companyCtc} LPA) than your current offer (₹${currentBestLpa} LPA).`
        );
      }
    }
  }

  const passesCollege = collegeReasons.length === 0;

  // OVERALL ELIGIBILITY: MUST PASS BOTH
  const isEligible = passesCompany && passesCollege;

  // Effective stricter synchronized values
  const effectiveMinCgpa = Math.max(compMinCgpa || 0, clgMinCgpa || 0);
  const effectiveMaxBacklogs = Math.min(
    compMaxBacklogs !== null ? compMaxBacklogs : 99,
    clgMaxBacklogs !== null ? clgMaxBacklogs : 99
  );

  return {
    isEligible,
    passesCompany,
    passesCollege,
    companyReasons,
    collegeReasons,
    allReasons: [...collegeReasons, ...companyReasons],
    effectiveMinCgpa,
    effectiveMaxBacklogs,
    clgMinCgpa,
    clgMaxBacklogs,
    compMinCgpa,
    compMaxBacklogs,
  };
}
