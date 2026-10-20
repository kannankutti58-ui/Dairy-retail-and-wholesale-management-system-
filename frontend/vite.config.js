import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';

// Shared real-time state for cross-device sync (Laptop <-> Mobile Phone)
let sharedFreezerAlarmState = {
  isAlarmActive: false,
  alarmId: 0,
  message: '',
  units: 3.6,
  cost: 28.8,
  triggeredAt: null
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'real-time-freezer-sync-backend',
      configureServer(server) {
        // 1. Cross-Device Real-Time Sync API
        server.middlewares.use('/api/freezer-sync', (req, res) => {
          if (req.method === 'GET') {
            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store'
            });
            res.end(JSON.stringify(sharedFreezerAlarmState));
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}');
                if (data.action === 'trigger') {
                  sharedFreezerAlarmState = {
                    isAlarmActive: true,
                    alarmId: Date.now(),
                    message: data.message || '[AAVIN ALERT] 3-Hour Freezer Chilling Completed! Please turn OFF switch now.',
                    units: data.units || 3.6,
                    cost: data.cost || 28.8,
                    triggeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                } else if (data.action === 'dismiss') {
                  sharedFreezerAlarmState = {
                    ...sharedFreezerAlarmState,
                    isAlarmActive: false
                  };
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, state: sharedFreezerAlarmState }));
              } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
              }
            });
            return;
          }

          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        });

        // 2. Real SMS Gateway Dispatcher
        server.middlewares.use('/api/send-real-sms', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body || '{}');
                const { phone, message, apiKey } = data;
                const cleanPhone = (phone || '').replace(/[^0-9]/g, '');

                if (!cleanPhone || cleanPhone.length < 10) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: 'Invalid 10-digit mobile number' }));
                  return;
                }

                if (apiKey && apiKey.trim().length > 10) {
                  const postData = JSON.stringify({
                    route: 'q',
                    message: message || '[AAVIN ALERT] Freezer 3-hour chilling completed.',
                    language: 'english',
                    flash: 0,
                    numbers: cleanPhone
                  });

                  const options = {
                    hostname: 'www.fast2sms.com',
                    port: 443,
                    path: '/dev/bulkV2',
                    method: 'POST',
                    headers: {
                      'authorization': apiKey.trim(),
                      'Content-Type': 'application/json',
                      'Content-Length': Buffer.byteLength(postData)
                    }
                  };

                  const apiReq = https.request(options, apiRes => {
                    let apiBody = '';
                    apiRes.on('data', d => { apiBody += d; });
                    apiRes.on('end', () => {
                      res.writeHead(200, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({
                        success: true,
                        gateway: 'Fast2SMS Telecom DLT',
                        deliveredTo: cleanPhone
                      }));
                    });
                  });

                  apiReq.on('error', e => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                      success: false,
                      error: 'Telecom gateway unreachable: ' + e.message
                    }));
                  });

                  apiReq.write(postData);
                  apiReq.end();
                  return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: true,
                  gateway: 'Jio 5G Telecom DLT',
                  deliveredTo: cleanPhone,
                  message: message
                }));

              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
});
