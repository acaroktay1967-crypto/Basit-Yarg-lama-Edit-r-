#!/usr/bin/env node

/**
 * CMK 250 Mahkeme Kararları Test Suite
 * Test suite for court decisions data validation
 */

const fs = require('fs');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

let testsPassed = 0;
let testsFailed = 0;

// Test helper functions
function assert(condition, testName) {
    if (condition) {
        console.log(`${colors.green}✓${colors.reset} ${testName}`);
        testsPassed++;
        return true;
    } else {
        console.log(`${colors.red}✗${colors.reset} ${testName}`);
        testsFailed++;
        return false;
    }
}

function testSection(title) {
    console.log(`\n${colors.bold}${colors.blue}${title}${colors.reset}`);
}

// Load JSON data
function loadData() {
    try {
        const data = fs.readFileSync('cmk250_mahkeme_kararlari.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`${colors.red}Error loading JSON file:${colors.reset}`, error.message);
        process.exit(1);
    }
}

// Test functions
function testMetadata(data) {
    testSection('📋 Metadata Tests');
    
    assert(data.metadata !== undefined, 'Metadata exists');
    assert(data.metadata.version !== undefined, 'Version field exists');
    assert(data.metadata.last_updated !== undefined, 'Last updated field exists');
    assert(data.metadata.description !== undefined, 'Description field exists');
    assert(data.metadata.legal_basis !== undefined, 'Legal basis field exists');
    assert(data.metadata.legal_basis.includes('CMK'), 'Legal basis mentions CMK');
}

function testCourtDecisions(data) {
    testSection('⚖️ Court Decisions Structure Tests');
    
    assert(Array.isArray(data.court_decisions), 'Court decisions is an array');
    assert(data.court_decisions.length > 0, 'Court decisions array is not empty');
    
    const totalDecisions = data.court_decisions.length;
    console.log(`${colors.yellow}ℹ${colors.reset} Total court decisions: ${totalDecisions}`);
}

function testDecisionFields(data) {
    testSection('📄 Decision Fields Validation');
    
    const requiredFields = [
        'id',
        'case_number',
        'court_name',
        'decision_date',
        'identity_information',
        'crime_definition',
        'case_summary',
        'mediation_outcome',
        'decision_rationale',
        'decision_outcome'
    ];
    
    let allValid = true;
    
    data.court_decisions.forEach((decision, index) => {
        requiredFields.forEach(field => {
            if (!decision.hasOwnProperty(field)) {
                console.log(`${colors.red}✗${colors.reset} Decision ${index + 1} missing field: ${field}`);
                testsFailed++;
                allValid = false;
            }
        });
    });
    
    if (allValid) {
        console.log(`${colors.green}✓${colors.reset} All decisions have required fields`);
        testsPassed++;
    }
}

function testIdentityInformation(data) {
    testSection('👤 Identity Information Tests');
    
    let allValid = true;
    
    data.court_decisions.forEach((decision, index) => {
        const identity = decision.identity_information;
        
        // Check defendant
        if (!identity.defendant) {
            console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Missing defendant information`);
            testsFailed++;
            allValid = false;
        } else {
            const defendant = identity.defendant;
            const requiredDefendantFields = ['name', 'father_name', 'mother_name', 'birth_date', 'birth_place', 'tc_id', 'address', 'occupation'];
            
            requiredDefendantFields.forEach(field => {
                if (!defendant[field]) {
                    console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Defendant missing ${field}`);
                    testsFailed++;
                    allValid = false;
                }
            });
            
            // Validate TC ID (should be 11 digits)
            if (defendant.tc_id && !/^\d{11}$/.test(defendant.tc_id)) {
                console.log(`${colors.yellow}⚠${colors.reset} Decision ${index + 1}: Invalid TC ID format for defendant`);
            }
        }
        
        // Check plaintiff
        if (!identity.plaintiff) {
            console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Missing plaintiff information`);
            testsFailed++;
            allValid = false;
        } else {
            const plaintiff = identity.plaintiff;
            const requiredPlaintiffFields = ['name', 'father_name', 'mother_name', 'birth_date', 'birth_place', 'tc_id', 'address'];
            
            requiredPlaintiffFields.forEach(field => {
                if (!plaintiff[field]) {
                    console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Plaintiff missing ${field}`);
                    testsFailed++;
                    allValid = false;
                }
            });
            
            // Validate TC ID
            if (plaintiff.tc_id && !/^\d{11}$/.test(plaintiff.tc_id)) {
                console.log(`${colors.yellow}⚠${colors.reset} Decision ${index + 1}: Invalid TC ID format for plaintiff`);
            }
        }
    });
    
    if (allValid) {
        console.log(`${colors.green}✓${colors.reset} All identity information is complete`);
        testsPassed++;
    }
}

function testCrimeDefinition(data) {
    testSection('⚖️ Crime Definition Tests');
    
    let allValid = true;
    
    data.court_decisions.forEach((decision, index) => {
        const crime = decision.crime_definition;
        
        if (!crime) {
            console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Missing crime definition`);
            testsFailed++;
            allValid = false;
            return;
        }
        
        const requiredFields = ['crime_name', 'tck_article', 'crime_description', 'crime_category', 'penalty_range', 'eligible_for_mediation'];
        
        requiredFields.forEach(field => {
            if (crime[field] === undefined) {
                console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Crime definition missing ${field}`);
                testsFailed++;
                allValid = false;
            }
        });
        
        // Check if TCK article format is valid
        if (crime.tck_article && !crime.tck_article.includes('TCK')) {
            console.log(`${colors.yellow}⚠${colors.reset} Decision ${index + 1}: TCK article format might be incorrect`);
        }
    });
    
    if (allValid) {
        console.log(`${colors.green}✓${colors.reset} All crime definitions are complete`);
        testsPassed++;
    }
}

function testMediationOutcome(data) {
    testSection('🤝 Mediation Outcome Tests');
    
    const successful = data.court_decisions.filter(d => d.mediation_outcome?.mediation_successful === true).length;
    const failed = data.court_decisions.filter(d => d.mediation_outcome?.mediation_successful === false).length;
    
    console.log(`${colors.yellow}ℹ${colors.reset} Successful mediations: ${successful}`);
    console.log(`${colors.yellow}ℹ${colors.reset} Failed mediations: ${failed}`);
    
    assert(successful + failed === data.court_decisions.length, 'All decisions have mediation outcome status');
    
    // Check successful mediation have agreement terms
    let allSuccessfulHaveTerms = true;
    data.court_decisions.forEach((decision, index) => {
        if (decision.mediation_outcome?.mediation_successful === true) {
            if (!decision.mediation_outcome.agreement_terms || decision.mediation_outcome.agreement_terms.length === 0) {
                console.log(`${colors.yellow}⚠${colors.reset} Decision ${index + 1}: Successful mediation without agreement terms`);
                allSuccessfulHaveTerms = false;
            }
        }
    });
    
    if (allSuccessfulHaveTerms) {
        console.log(`${colors.green}✓${colors.reset} All successful mediations have agreement terms`);
        testsPassed++;
    } else {
        testsFailed++;
    }
}

function testDecisionOutcome(data) {
    testSection('📜 Decision Outcome Tests');
    
    let allValid = true;
    
    data.court_decisions.forEach((decision, index) => {
        const outcome = decision.decision_outcome;
        
        if (!outcome) {
            console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Missing decision outcome`);
            testsFailed++;
            allValid = false;
            return;
        }
        
        const requiredFields = ['decision_type', 'main_decision'];
        
        requiredFields.forEach(field => {
            if (!outcome[field]) {
                console.log(`${colors.red}✗${colors.reset} Decision ${index + 1}: Decision outcome missing ${field}`);
                testsFailed++;
                allValid = false;
            }
        });
    });
    
    if (allValid) {
        console.log(`${colors.green}✓${colors.reset} All decision outcomes are complete`);
        testsPassed++;
    }
}

function testDataConsistency(data) {
    testSection('🔍 Data Consistency Tests');
    
    // Test 1: Successful mediation should lead to dismissal decision
    let consistentMediationOutcome = true;
    data.court_decisions.forEach((decision, index) => {
        if (decision.mediation_outcome?.mediation_successful === true) {
            if (!decision.decision_outcome?.decision_type?.includes('Düşme') && 
                !decision.decision_outcome?.decision_type?.includes('Takipsizlik')) {
                console.log(`${colors.yellow}⚠${colors.reset} Decision ${index + 1}: Successful mediation but decision type is not dismissal`);
                consistentMediationOutcome = false;
            }
        }
    });
    
    if (consistentMediationOutcome) {
        console.log(`${colors.green}✓${colors.reset} Mediation outcomes are consistent with decision types`);
        testsPassed++;
    } else {
        testsFailed++;
    }
    
    // Test 2: Check unique IDs
    const ids = data.court_decisions.map(d => d.id);
    const uniqueIds = new Set(ids);
    assert(ids.length === uniqueIds.size, 'All decision IDs are unique');
    
    // Test 3: Check date formats
    let allDatesValid = true;
    data.court_decisions.forEach((decision, index) => {
        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
        if (decision.decision_date && !datePattern.test(decision.decision_date)) {
            console.log(`${colors.yellow}⚠${colors.reset} Decision ${index + 1}: Date format might be incorrect (${decision.decision_date})`);
            allDatesValid = false;
        }
    });
    
    if (allDatesValid) {
        console.log(`${colors.green}✓${colors.reset} All dates follow correct format`);
        testsPassed++;
    } else {
        testsFailed++;
    }
}

function testStatistics(data) {
    testSection('📊 Statistics Tests');
    
    if (data.statistics) {
        assert(data.statistics.total_decisions === data.court_decisions.length, 'Statistics total matches actual count');
        
        const actualSuccessful = data.court_decisions.filter(d => d.mediation_outcome?.mediation_successful === true).length;
        const actualFailed = data.court_decisions.filter(d => d.mediation_outcome?.mediation_successful === false).length;
        
        assert(data.statistics.successful_mediations === actualSuccessful, 'Successful mediations count is accurate');
        assert(data.statistics.failed_mediations === actualFailed, 'Failed mediations count is accurate');
        
        console.log(`${colors.yellow}ℹ${colors.reset} Average compensation: ${data.statistics.average_compensation}`);
    } else {
        console.log(`${colors.yellow}⚠${colors.reset} Statistics section not found`);
    }
}

function testValidationMechanism(data) {
    testSection('✅ Validation Mechanism Tests');
    
    let missingFieldsCount = 0;
    const missingFieldsReport = [];
    
    data.court_decisions.forEach((decision, index) => {
        const issues = [];
        
        // Check all critical fields
        if (!decision.case_number) issues.push('case_number');
        if (!decision.court_name) issues.push('court_name');
        if (!decision.decision_date) issues.push('decision_date');
        if (!decision.identity_information?.defendant?.name) issues.push('defendant name');
        if (!decision.identity_information?.plaintiff?.name) issues.push('plaintiff name');
        if (!decision.crime_definition?.crime_name) issues.push('crime name');
        if (!decision.crime_definition?.tck_article) issues.push('TCK article');
        if (!decision.case_summary) issues.push('case summary');
        if (decision.mediation_outcome?.mediation_successful === undefined) issues.push('mediation outcome');
        if (!decision.decision_outcome?.decision_type) issues.push('decision type');
        if (!decision.decision_outcome?.main_decision) issues.push('main decision');
        
        if (issues.length > 0) {
            missingFieldsCount++;
            missingFieldsReport.push({
                id: decision.id,
                case_number: decision.case_number || 'N/A',
                missing: issues
            });
        }
    });
    
    if (missingFieldsCount === 0) {
        console.log(`${colors.green}✓${colors.reset} All decisions have required fields - validation passed`);
        testsPassed++;
    } else {
        console.log(`${colors.red}✗${colors.reset} ${missingFieldsCount} decisions have missing required fields`);
        missingFieldsReport.forEach(report => {
            console.log(`  ${colors.yellow}Decision ${report.id} (${report.case_number}):${colors.reset} Missing ${report.missing.join(', ')}`);
        });
        testsFailed++;
    }
}

// Main test runner
function runTests() {
    console.log(`${colors.bold}${colors.blue}
╔════════════════════════════════════════════════════════════╗
║   CMK 250 Mahkeme Kararları - Test Suite                  ║
║   Court Decisions Data Validation Tests                   ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
    
    const data = loadData();
    
    testMetadata(data);
    testCourtDecisions(data);
    testDecisionFields(data);
    testIdentityInformation(data);
    testCrimeDefinition(data);
    testMediationOutcome(data);
    testDecisionOutcome(data);
    testDataConsistency(data);
    testStatistics(data);
    testValidationMechanism(data);
    
    // Summary
    console.log(`\n${colors.bold}${colors.blue}════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bold}Test Summary:${colors.reset}`);
    console.log(`  ${colors.green}Passed:${colors.reset} ${testsPassed}`);
    console.log(`  ${colors.red}Failed:${colors.reset} ${testsFailed}`);
    console.log(`  ${colors.blue}Total:${colors.reset}  ${testsPassed + testsFailed}`);
    
    if (testsFailed === 0) {
        console.log(`\n${colors.green}${colors.bold}✓ All tests passed!${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`\n${colors.red}${colors.bold}✗ Some tests failed!${colors.reset}\n`);
        process.exit(1);
    }
}

// Run the tests
runTests();
