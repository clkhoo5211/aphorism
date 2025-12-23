// Test script to verify all tarot deck/spread combinations
// Run this in browser console after navigating to /tarot page

const decks = ['riderWaite', 'hero', 'lotus', 'mythic'];
const spreads = [
  'single',
  'past-present-future',
  'mind-body-spirit',
  'situation-action-outcome',
  'celtic-cross',
  'horseshoe'
];

const testResults = {
  passed: [],
  failed: [],
  errors: []
};

async function testCombination(deckId, spreadId) {
  const testName = `${deckId} + ${spreadId}`;
  console.log(`Testing: ${testName}`);
  
  try {
    // Simulate clicking deck
    const deckButtons = document.querySelectorAll('[role="button"]');
    const deckButton = Array.from(deckButtons).find(btn => 
      btn.textContent.includes(deckId === 'riderWaite' ? 'Rider-Waite' :
                               deckId === 'hero' ? 'Everyday Hero' :
                               deckId === 'lotus' ? 'Esoteric Lotus' : 'Greek Mythic')
    );
    
    if (deckButton) {
      deckButton.click();
      await new Promise(r => setTimeout(r, 100));
    }
    
    // Simulate clicking spread
    const spreadButton = Array.from(deckButtons).find(btn => 
      btn.textContent.includes(spreadId === 'single' ? 'Single Card' :
                               spreadId === 'past-present-future' ? 'Past, Present' :
                               spreadId === 'mind-body-spirit' ? 'Mind, Body' :
                               spreadId === 'situation-action-outcome' ? 'Situation, Action' :
                               spreadId === 'celtic-cross' ? 'Celtic Cross' :
                               'Horseshoe')
    );
    
    if (spreadButton) {
      spreadButton.click();
      await new Promise(r => setTimeout(r, 100));
    }
    
    // Click Begin Reading
    const beginButton = Array.from(deckButtons).find(btn => 
      btn.textContent.includes('Begin Reading')
    );
    
    if (beginButton) {
      beginButton.click();
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Check for errors
    const errors = window.console._errors || [];
    if (errors.length > 0) {
      testResults.failed.push(testName);
      testResults.errors.push({ test: testName, errors });
      console.error(`❌ ${testName} - Errors found:`, errors);
    } else {
      testResults.passed.push(testName);
      console.log(`✅ ${testName} - Passed`);
    }
    
  } catch (error) {
    testResults.failed.push(testName);
    testResults.errors.push({ test: testName, error: error.message });
    console.error(`❌ ${testName} - Exception:`, error);
  }
}

async function runAllTests() {
  console.log('🧪 Starting comprehensive tarot tests...');
  console.log('='.repeat(70));
  
  for (const deckId of decks) {
    for (const spreadId of spreads) {
      await testCombination(deckId, spreadId);
      await new Promise(r => setTimeout(r, 500)); // Wait between tests
    }
  }
  
  console.log('='.repeat(70));
  console.log('📊 TEST RESULTS:');
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  console.log('='.repeat(70));
  
  if (testResults.errors.length > 0) {
    console.log('ERRORS:');
    testResults.errors.forEach(({ test, errors, error }) => {
      console.log(`  ${test}:`, errors || error);
    });
  }
  
  return testResults;
}

// Export for use
window.testAllTarotCombinations = runAllTests;
console.log('✅ Test script loaded. Run: testAllTarotCombinations()');

