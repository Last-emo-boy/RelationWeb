// Service Worker for Love Graph PWA
const CACHE_NAME = 'love-graph-v3.1.0';
const STATIC_CACHE = 'love-graph-static-v3.1.0';
const DYNAMIC_CACHE = 'love-graph-dynamic-v3.1.0';

// 需要预缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/animation_styles.css',
  '/main.js',
  '/data.js',
  '/share.js',
  '/manifest.json',
  '/Changelog.html'
];

// 外部 CDN 资源（尝试缓存但不阻塞安装）
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/cytoscape@3.28.1/dist/cytoscape.min.js',
  'https://unpkg.com/layout-base@2.0.1/layout-base.js',
  'https://unpkg.com/cose-base@2.2.0/cose-base.js',
  'https://unpkg.com/cytoscape-cose-bilkent@4.1.0/cytoscape-cose-bilkent.js',
  'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js'
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // 尝试缓存 CDN 资源，但不阻塞安装
        return caches.open(DYNAMIC_CACHE)
          .then(cache => {
            return Promise.allSettled(
              CDN_ASSETS.map(url => 
                fetch(url, { mode: 'cors' })
                  .then(response => {
                    if (response.ok) {
                      return cache.put(url, response);
                    }
                  })
                  .catch(() => console.log(`[SW] Failed to cache: ${url}`))
              )
            );
          });
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName.startsWith('love-graph-');
            })
            .map(cacheName => {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 请求拦截 - 缓存策略
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') return;
  
  // 跳过 chrome-extension 和其他非 http(s) 请求
  if (!url.protocol.startsWith('http')) return;
  
  // 跳过 Google Analytics
  if (url.hostname.includes('google')) return;
  
  // 跳过 utterances 评论
  if (url.hostname.includes('utteranc')) return;

  // 本地资源 - 缓存优先策略
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // 后台更新缓存
            fetchAndCache(request, STATIC_CACHE);
            return cachedResponse;
          }
          return fetchAndCache(request, STATIC_CACHE);
        })
        .catch(() => {
          // 离线回退
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
    return;
  }

  // CDN 资源 - 网络优先，缓存回退
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// 辅助函数：获取并缓存
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// 后台同步（可选功能）
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
});

// 推送通知（可选功能）
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || '有新的更新',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Love Graph', options)
    );
  }
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        const url = event.notification.data?.url || '/';
        
        // 如果已有窗口打开，则聚焦
        for (const client of clientList) {
          if (client.url.includes(location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// 消息处理
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[SW] Service Worker loaded');
