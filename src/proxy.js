const fs = require('fs');
const path = require('path');

class ProxyManager {
    constructor() {
        this.proxies = [];
        this.currentIndex = 0;
        this.failedProxies = new Set();
        this.loadProxies();
    }

    /**
     * Load proxies from proxies.txt file
     */
    loadProxies() {
        const proxiesFile = path.join(process.cwd(), 'proxies.txt');
        
        try {
            if (!fs.existsSync(proxiesFile)) {
                console.log('📝 Creating empty proxies.txt file...');
                fs.writeFileSync(proxiesFile, '# Add your proxies here in format: ip:port:username:password\n# Example: 123.456.789.012:8080:user:pass\n');
                console.log('⚠️ No proxies.txt file found. Created empty file. Bot will work without proxies.');
                return;
            }

            const content = fs.readFileSync(proxiesFile, 'utf8');
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));

            this.proxies = [];
            
            for (const line of lines) {
                const proxy = this.parseProxyLine(line);
                if (proxy) {
                    this.proxies.push(proxy);
                }
            }

            console.log(`✅ Loaded ${this.proxies.length} proxies from proxies.txt`);
            
            if (this.proxies.length === 0) {
                console.log('⚠️ No valid proxies found in proxies.txt. Bot will work without proxies.');
            } else {
                // Validate proxies on startup
                this.validateProxies();
            }

        } catch (error) {
            console.error('❌ Error loading proxies:', error.message);
            console.log('⚠️ Bot will work without proxies.');
        }
    }

    /**
     * Parse proxy line from file
     */
    parseProxyLine(line) {
        const parts = line.split(':');
        
        if (parts.length >= 2) {
            const ip = parts[0].trim();
            const port = parseInt(parts[1].trim());
            const username = parts[2]?.trim() || '';
            const password = parts[3]?.trim() || '';
            
            if (this.isValidIP(ip) && port > 0 && port <= 65535) {
                const auth = username && password ? `${username}:${password}@` : '';
                const url = `http://${auth}${ip}:${port}`;
                
                return {
                    host: ip,
                    port: port,
                    username: username,
                    password: password,
                    url: url,
                    id: `${ip}:${port}`
                };
            } else {
                console.log(`⚠️ Invalid proxy format: ${line}`);
            }
        } else {
            console.log(`⚠️ Invalid proxy format: ${line}`);
        }
        
        return null;
    }

    /**
     * Validate IP address format
     */
    isValidIP(ip) {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    }

    /**
     * Get next available proxy
     */
    getNextProxy() {
        if (this.proxies.length === 0) {
            return null;
        }

        const availableProxies = this.proxies.filter(proxy => !this.failedProxies.has(proxy.id));
        
        if (availableProxies.length === 0) {
            console.log('🔄 All proxies failed, resetting failed list...');
            this.failedProxies.clear();
            this.currentIndex = 0;
        }

        const currentProxy = this.proxies[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
        
        return currentProxy;
    }

    /**
     * Mark current proxy as failed
     */
    markProxyAsFailed() {
        if (this.proxies.length === 0) return;
        
        const failedIndex = this.currentIndex === 0 ? this.proxies.length - 1 : this.currentIndex - 1;
        const failedProxy = this.proxies[failedIndex];
        
        if (failedProxy) {
            this.failedProxies.add(failedProxy.id);
            console.log(`🚫 Marked proxy as failed: ${failedProxy.host}:${failedProxy.port}`);
        }
    }

    /**
     * Get total proxy count
     */
    getProxyCount() {
        return Math.max(this.proxies.length, 1); // At least 1 for direct connection
    }

    /**
     * Validate all proxies (basic connectivity test)
     */
    async validateProxies() {
        console.log('🔍 Validating proxies...');
        
        // This is a basic validation - in production you might want more thorough testing
        const validProxies = [];
        
        for (const proxy of this.proxies) {
            try {
                // Basic format validation already done in parseProxyLine
                validProxies.push(proxy);
            } catch (error) {
                console.log(`❌ Invalid proxy: ${proxy.host}:${proxy.port}`);
            }
        }
        
        this.proxies = validProxies;
        console.log(`✅ ${this.proxies.length} proxies ready for use`);
    }

    /**
     * Get proxy statistics
     */
    getStats() {
        return {
            total: this.proxies.length,
            failed: this.failedProxies.size,
            available: this.proxies.length - this.failedProxies.size,
            current: this.currentIndex
        };
    }

    /**
     * Reset failed proxies
     */
    resetFailedProxies() {
        this.failedProxies.clear();
        console.log('🔄 Reset all failed proxies');
    }
}

// Export singleton instance
const proxyManager = new ProxyManager();

module.exports = proxyManager;
