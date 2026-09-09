/**
 * Automated Academic Eligibility Gatekeeper Service
 * Evaluates candidate qualifications against drive-specific criteria and institutional placement policy.
 */
export function evaluateStudentEligibility(student, criteria, policy = {}) {
  const reasons = [];
  const checks = {
    cgpaOk: true,
    backlogsOk: true,
    branchOk: true,
    batchOk: true,
    verificationOk: true,
    notBlocked: true,
    tierPolicyOk: true
  };

  const minCgpa = criteria?.minCgpa ?? policy?.minCgpa ?? 7.0;
  const maxBacklogs = criteria?.maxBacklogs ?? policy?.maxBacklogs ?? 0;
  const allowedBranches = criteria?.allowedBranches ?? policy?.allowedBranches ?? [];
  const eligibleBatch = criteria?.eligibleBatch ?? policy?.eligibleBatch ?? '2026';
  const tier = criteria?.tier || 'Dream';

  const studentCgpa = student?.cgpa ?? 8.5;
  const studentBacklogs = student?.backlogs ?? 0;
  const studentBranch = student?.branch || 'Computer Science & Engineering';
  const studentBatch = student?.batch || '2026';
  const isBlocked = !!student?.isBlocked;
  const isVerified = student?.isVerified !== false;

  // 1. CGPA Cutoff Check
  if (studentCgpa < minCgpa) {
    checks.cgpaOk = false;
    reasons.push(`CGPA is ${studentCgpa.toFixed(2)}, below minimum cutoff of ${minCgpa.toFixed(2)}`);
  }

  // 2. Active Backlogs Check
  if (studentBacklogs > maxBacklogs) {
    checks.backlogsOk = false;
    reasons.push(`Student has ${studentBacklogs} active backlogs (Maximum permitted: ${maxBacklogs})`);
  }

  // 3. Discipline / Branch Match
  if (allowedBranches.length > 0) {
    const matchedBranch = allowedBranches.some(b => 
      studentBranch.toLowerCase().includes(b.toLowerCase()) || 
      b.toLowerCase().includes(studentBranch.toLowerCase())
    );
    if (!matchedBranch) {
      checks.branchOk = false;
      reasons.push(`Discipline "${studentBranch}" is not in the eligible department roster`);
    }
  }

  // 4. Cohort / Batch Match
  if (eligibleBatch && studentBatch !== eligibleBatch) {
    checks.batchOk = false;
    reasons.push(`Drive is restricted to Class of ${eligibleBatch} (Student is Batch ${studentBatch})`);
  }

  // 5. Blocked / Disciplinary Hold
  if (isBlocked) {
    checks.notBlocked = false;
    reasons.push(student?.blockReason || 'Student account is currently under disciplinary TPC freeze');
  }

  // 6. Institutional Tier Policy (One-Student-One-Dream policy)
  if (student?.placedCompany && !criteria?.allowMultipleOffers) {
    const studentStatus = (student?.offerStatus || '').toLowerCase();
    if (studentStatus.includes('super dream')) {
      checks.tierPolicyOk = false;
      reasons.push(`Student already secured a Super Dream offer (${student.placedCompany}). Further applications restricted.`);
    } else if (studentStatus.includes('dream') && tier !== 'Super Dream') {
      checks.tierPolicyOk = false;
      reasons.push(`Student holds a Dream offer (${student.placedCompany}). Eligible only for Super Dream tier drives.`);
    }
  }

  const isEligible = Object.values(checks).every(Boolean);

  return {
    isEligible,
    reasons,
    checks,
    evaluatedCriteria: {
      minCgpa,
      maxBacklogs,
      allowedBranchesCount: allowedBranches.length,
      eligibleBatch,
      tier
    }
  };
}
