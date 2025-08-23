import fs from 'fs';
import path from 'path';

const monitorIndexing = async () => {
    const baseUrl = 'https://project-nightfall.pages.dev';
    const testUrls = [
        '/',
        '/sitemap.xml',
        '/video-sitemap.xml',
        '/category-sitemap.xml',
        '/robots.txt'
    ];
    
    const results = {
        timestamp: new Date().toISOString(),
        tests: []
    };
    
    console.log('🔍 Monitoring indexing accessibility...\n');
    
    for (const testUrl of testUrls) {
        try {
            const url = `${baseUrl}${testUrl}`;
            const response = await fetch(url);
            const content = await response.text();
            
            const test = {
                url: testUrl,
                status: response.status,
                contentType: response.headers.get('content-type'),
                contentLength: content.length,
                isXML: content.includes('<?xml'),
                isHTML: content.includes('<html'),
                hasRedirectIssue: testUrl.endsWith('.xml') && content.includes('<html')
            };
            
            results.tests.push(test);
            
            const status = test.hasRedirectIssue ? '❌ REDIRECT ISSUE' : 
                          response.ok ? '✅ OK' : '❌ ERROR';
            
            console.log(`${status} ${testUrl} (${response.status})`);
            
        } catch (error) {
            results.tests.push({
                url: testUrl,
                error: error.message
            });
            console.log(`❌ ERROR ${testUrl}: ${error.message}`);
        }
    }
    
    // Save results
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logFile = path.join(logsDir, `indexing-monitor-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📊 Results saved to: ${logFile}`);
    
    // Check for critical issues
    const criticalIssues = results.tests.filter(test => test.hasRedirectIssue);
    if (criticalIssues.length > 0) {
        console.log('\n🚨 CRITICAL ISSUES DETECTED:');
        criticalIssues.forEach(issue => {
            console.log(`   - ${issue.url}: XML file returning HTML (redirect issue)`);
        });
        process.exit(1);
    }
};

monitorIndexing().catch(console.error);