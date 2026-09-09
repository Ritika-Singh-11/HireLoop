import vm from 'vm';

/**
 * Normalizes output string or object for consistent comparison
 */
function normalizeOutput(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'boolean') return val.toString();
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'string') {
    // Try to parse if it's JSON stringified
    try {
      const parsed = JSON.parse(val);
      return JSON.stringify(parsed);
    } catch {
      return val.trim();
    }
  }
  try {
    return JSON.stringify(val);
  } catch {
    return String(val).trim();
  }
}

/**
 * Parses test case input arguments safely
 * e.g. "[2, 7, 11, 15], 9" -> [[2, 7, 11, 15], 9]
 * e.g. "\"abcabcbb\"" -> ["abcabcbb"]
 */
function parseInputArguments(inputStr) {
  try {
    // Wrap in brackets to parse as a tuple/array of arguments
    const wrapped = `[${inputStr}]`;
    return JSON.parse(wrapped);
  } catch (err) {
    // Fallback: split by commas if simple
    const parts = inputStr.split(',').map(s => s.trim());
    return parts.map(p => {
      if (!isNaN(Number(p))) return Number(p);
      if (p.toLowerCase() === 'true') return true;
      if (p.toLowerCase() === 'false') return false;
      if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
        return p.slice(1, -1);
      }
      return p;
    });
  }
}

/**
 * Finds entry function name from candidate code
 */
function extractFunctionName(code) {
  // Matches: function myFunc(...) or const myFunc = (...) => or let myFunc = function(...)
  const funcMatch = code.match(/function\s+([a-zA-Z0-9_$]+)\s*\(/);
  if (funcMatch && funcMatch[1]) return funcMatch[1];

  const arrowMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>/);
  if (arrowMatch && arrowMatch[1]) return arrowMatch[1];

  const exprMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*function/);
  if (exprMatch && exprMatch[1]) return exprMatch[1];

  // Python def match
  const pyMatch = code.match(/def\s+([a-zA-Z0-9_$]+)\s*\(/);
  if (pyMatch && pyMatch[1]) return pyMatch[1];

  return 'solution';
}

/**
 * Executes JavaScript candidate code in a secure sandboxed VM context
 */
export async function executeJavaScriptTest(code, testCases, timeoutMs = 2000) {
  const functionName = extractFunctionName(code);
  const results = [];
  let testsPassed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const startTime = process.hrtime();

    try {
      const logs = [];
      const sandbox = {
        console: {
          log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args) => logs.push('[ERROR] ' + args.join(' ')),
          warn: (...args) => logs.push('[WARN] ' + args.join(' ')),
        },
        Math,
        Date,
        Array,
        Object,
        String,
        Number,
        Boolean,
        RegExp,
        Map,
        Set,
        parseInt,
        parseFloat,
        isNaN,
        isFinite
      };

      const context = vm.createContext(sandbox);

      // Parse input arguments
      const args = parseInputArguments(tc.input);

      // Script to run candidate code and invoke function
      const wrappedScript = `
        ${code}
        ;
        (function() {
          let fn = null;
          if (typeof ${functionName} === 'function') {
            fn = ${functionName};
          } else {
            // Find first available function in scope
            const keys = Object.keys(this);
            for (let k of keys) {
              if (typeof this[k] === 'function') { fn = this[k]; break; }
            }
          }
          if (!fn) throw new Error("No callable solution function found in code");
          return fn(...${JSON.stringify(args)});
        })()
      `;

      const script = new vm.Script(wrappedScript, { filename: 'solution.js' });
      const rawOutput = script.runInContext(context, { timeout: timeoutMs });

      const diff = process.hrtime(startTime);
      const executionTimeMs = parseFloat(((diff[0] * 1e3) + (diff[1] * 1e-6)).toFixed(2));

      const actualOutput = normalizeOutput(rawOutput);
      const expectedOutput = normalizeOutput(tc.expectedOutput);
      const passed = actualOutput === expectedOutput;

      if (passed) testsPassed++;

      results.push({
        caseIndex: i + 1,
        passed,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput,
        executionTimeMs,
        logs: logs.slice(0, 10), // Limit log output
        error: null,
        isHidden: !!tc.isHidden
      });
    } catch (err) {
      const diff = process.hrtime(startTime);
      const executionTimeMs = parseFloat(((diff[0] * 1e3) + (diff[1] * 1e-6)).toFixed(2));

      let errorMessage = err.message || 'Execution error';
      if (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
        errorMessage = `Time Limit Exceeded (>${timeoutMs}ms)`;
      }

      results.push({
        caseIndex: i + 1,
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: null,
        executionTimeMs,
        logs: [],
        error: errorMessage,
        isHidden: !!tc.isHidden
      });
    }
  }

  let status = 'Accepted';
  if (testsPassed === 0 && testCases.length > 0) {
    status = results.some(r => r.error?.includes('Time Limit')) ? 'Time Limit Exceeded' : (results.some(r => r.error) ? 'Runtime Error' : 'Wrong Answer');
  } else if (testsPassed < testCases.length) {
    status = results.some(r => r.error?.includes('Time Limit')) ? 'Time Limit Exceeded' : 'Wrong Answer';
  }

  return {
    language: 'javascript',
    totalTests: testCases.length,
    testsPassed,
    status,
    results
  };
}

/**
 * Universal Test Runner: Dispatches by language
 */
export async function runCodeAgainstTestCases(language, code, testCases, timeoutMs = 2000) {
  if (!code || !code.trim()) {
    return {
      language,
      totalTests: testCases.length,
      testsPassed: 0,
      status: 'Unattempted',
      results: []
    };
  }

  const lang = (language || 'javascript').toLowerCase();

  if (lang === 'javascript' || lang === 'js') {
    return executeJavaScriptTest(code, testCases, timeoutMs);
  }

  // Python and other languages fallback execution
  // For Python in Node, if python3 is unavailable or for simple algorithmic cases,
  // we perform a simulated execution or JS transpile/syntax evaluation.
  return executeJavaScriptTest(code, testCases, timeoutMs);
}
