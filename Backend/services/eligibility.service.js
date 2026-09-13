/**
 * Automated Academic Eligibility Gatekeeper Service
 * 
 * Synchronizes institutional placement policy and company-specific criteria.
 * College Placement Directorate Eligibility Policy takes strict precedence:
 * Even if a company has lower requirements or offers high compensation,
 * any student failing College Eligibility Rules is strictly INELIGIBLE.
 */
export function evaluateStudentEligibility(student, companyCriteria = {}, collegePolicy = {}) {
  const collegeReasons = [];
  const companyReasons = [];

  const checks = {
    collegeCgpaOk: true,
    companyCgpaOk: true,
    collegeBacklogsOk: true,
    companyBacklogsOk: true,
    collegeBranchOk: true,
    companyBranchOk: true,
    batchOk: true,
    verificationOk: true,
    notBlocked: true,
    tierPolicyOk: true,
  };

  const studentCgpa = student?.cgpa !== undefined ? parseFloat(student.cgpa) : 8.5;
  const studentBacklogs = student?.backlogs !== undefined ? parseInt(student.backlogs) : 0;
  const studentBranch = (student?.branch || 'Computer Science & Engineering').trim();
  const studentBatch = String(student?.batch || '2026').trim();
  const isBlocked = !!student?.isBlocked;
  const isVerified = student?.isVerified !== false;

  // ----------------------------------------------------
  // 1. COLLEGE / UNIVERSITY PLACEMENT DIRECTORATE POLICY
  // ----------------------------------------------------
  const clgMinCgpa = collegePolicy?.minCgpa !== undefined ? parseFloat(collegePolicy.minCgpa) : 7.0;
  const clgMaxBacklogs = collegePolicy?.maxBacklogs !== undefined ? parseInt(collegePolicy.maxBacklogs) : 0;
  const clgAllowedBranches = collegePolicy?.allowedBranches || [];
  const clgEligibleBatch = collegePolicy?.eligibleBatch ? String(collegePolicy.eligibleBatch).trim() : null;

  // College CGPA Check
  if (studentCgpa < clgMinCgpa) {
    checks.collegeCgpaOk = false;
    collegeReasons.push(
      `University Placement Directorate requires minimum CGPA of ${clgMinCgpa.toFixed(1)} (Student CGPA: ${studentCgpa.toFixed(1)})`
    );
  }

  // College Backlogs Check
  if (studentBacklogs > clgMaxBacklogs) {
    checks.collegeBacklogsOk = false;
    collegeReasons.push(
      `University Placement Policy restricts to max ${clgMaxBacklogs} active backlogs (Student has ${studentBacklogs})`
    );
  }

  // College Branch Roster Check
  if (clgAllowedBranches.length > 0) {
    const sBranchLow = studentBranch.toLowerCase();
    const matchedBranch = clgAllowedBranches.some(b => {
      const bLow = b.toLowerCase();
      return bLow.includes('all') || sBranchLow.includes(bLow) || bLow.includes(sBranchLow);
    });
    if (!matchedBranch) {
      checks.collegeBranchOk = false;
      collegeReasons.push(`Department "${studentBranch}" is not in the approved College placement roster`);
    }
  }

  // Disciplinary & Verification Checks
  if (isBlocked) {
    checks.notBlocked = false;
    collegeReasons.push(student?.blockReason || 'Student account is currently under disciplinary TPC freeze');
  }
  if (!isVerified) {
    checks.verificationOk = false;
    collegeReasons.push('Student academic profile is pending authentication by TPO Cell');
  }

  // College Eligible Cohort
  if (clgEligibleBatch && clgEligibleBatch.toLowerCase() !== 'all' && studentBatch !== clgEligibleBatch) {
    checks.batchOk = false;
    collegeReasons.push(`University placement cycle restricted to Class of ${clgEligibleBatch}`);
  }

  // ----------------------------------------------------
  // 2. COMPANY JOB / DRIVE CRITERIA EVALUATION
  // ----------------------------------------------------
  const compMinCgpa = companyCriteria?.minCgpa !== undefined && companyCriteria.minCgpa !== null
    ? parseFloat(companyCriteria.minCgpa)
    : null;
  const compMaxBacklogs = companyCriteria?.maxBacklogs !== undefined && companyCriteria.maxBacklogs !== null
    ? parseInt(companyCriteria.maxBacklogs)
    : null;
  const compAllowedBranches = companyCriteria?.eligibleBranches || companyCriteria?.allowedBranches || [];
  const compBatch = companyCriteria?.eligibleBatch ? String(companyCriteria.eligibleBatch).trim() : null;

  // Company CGPA Check
  if (compMinCgpa !== null && studentCgpa < compMinCgpa) {
    checks.companyCgpaOk = false;
    companyReasons.push(`Company requires minimum CGPA of ${compMinCgpa.toFixed(1)} (Student CGPA: ${studentCgpa.toFixed(1)})`);
  }

  // Company Backlogs Check
  if (compMaxBacklogs !== null && studentBacklogs > compMaxBacklogs) {
    checks.companyBacklogsOk = false;
    companyReasons.push(`Company restricts to maximum ${compMaxBacklogs} backlogs (Student has ${studentBacklogs})`);
  }

  // Company Branch Check
  if (compAllowedBranches.length > 0) {
    const sBranchLow = studentBranch.toLowerCase();
    const matchedCompBranch = compAllowedBranches.some(b => {
      const bLow = b.toLowerCase();
      return bLow.includes('all') || sBranchLow.includes(bLow) || bLow.includes(sBranchLow);
    });
    if (!matchedCompBranch) {
      checks.companyBranchOk = false;
      companyReasons.push(`Company role restricted to disciplines: ${compAllowedBranches.join(', ')}`);
    }
  }

  // ----------------------------------------------------
  // 3. MULTI-OFFER & TIER POLICY
  // ----------------------------------------------------
  if (student?.placedCompany) {
    const allowMultiple = collegePolicy?.allowMultipleOffers !== undefined ? collegePolicy.allowMultipleOffers : true;
    const tier = companyCriteria?.tier || 'Dream';
    const studentStatus = (student?.offerStatus || '').toLowerCase();

    if (!allowMultiple) {
      checks.tierPolicyOk = false;
      collegeReasons.push(`Under Single-Offer Policy, placed candidate (${student.placedCompany}) cannot apply for further drives`);
    } else if (studentStatus.includes('super dream')) {
      checks.tierPolicyOk = false;
      collegeReasons.push(`Student secured a Super Dream offer (${student.placedCompany}). Further campus applications frozen.`);
    } else if (studentStatus.includes('dream') && tier !== 'Super Dream') {
      checks.tierPolicyOk = false;
      collegeReasons.push(`Student holds a Dream offer (${student.placedCompany}). Eligible only for Super Dream tier drives.`);
    }
  }

  const passesCollege = collegeReasons.length === 0;
  const passesCompany = companyReasons.length === 0;
  const isEligible = passesCollege && passesCompany;

  const allReasons = [...collegeReasons, ...companyReasons];

  return {
    isEligible,
    passesCollege,
    passesCompany,
    reasons: allReasons,
    collegeReasons,
    companyReasons,
    checks,
    evaluatedCriteria: {
      effectiveMinCgpa: Math.max(compMinCgpa || 0, clgMinCgpa || 0),
      effectiveMaxBacklogs: Math.min(compMaxBacklogs ?? 99, clgMaxBacklogs ?? 99),
      collegeMinCgpa: clgMinCgpa,
      companyMinCgpa: compMinCgpa,
    }
  };
}
