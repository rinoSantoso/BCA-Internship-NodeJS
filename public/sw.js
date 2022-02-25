const staticChacheName = 'site-static-v1.0';
const dynamicCacheName = 'site-dynamic-v1.0';
const userDefinedCacheName = 'site-user-defined';

const assets = [
    '/dashboard',
    '/no-connection',
    '/assets/css/material-dashboard.css',
    '/client.js',
    '/assets/js/core/jquery.min.js',
    '/assets/js/core/popper.min.js',
    '/assets/js/core/bootstrap-material-design.min.js',
    '/assets/js/plugins/perfect-scrollbar.jquery.min.js',
    '/assets/js/plugins/moment.min.js',
    '/assets/js/plugins/sweetalert2.js',
    '/assets/js/plugins/jquery.validate.min.js',
    '/assets/js/plugins/jquery.bootstrap-wizard.js',
    '/assets/js/plugins/bootstrap-selectpicker.js',
    '/assets/js/plugins/bootstrap-datetimepicker.min.js',
    '/assets/js/plugins/jquery.dataTables.min.js',
    '/assets/js/plugins/bootstrap-tagsinput.js',
    '/assets/js/plugins/jasny-bootstrap.min.js',
    '/assets/js/plugins/fullcalendar.min.js',
    '/assets/js/plugins/jquery-jvectormap.js',
    '/assets/js/plugins/nouislider.min.js',
    '/assets/js/plugins/arrive.min.js',
    '/assets/js/plugins/chartist.min.js',
    '/assets/js/plugins/bootstrap-notify.js',
    '/assets/js/material-dashboard.js',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons',
    'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css',
    '/assets/img/sidebar-1.jpg'
];


// install event
self.addEventListener('install', evt => {
    // console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticChacheName).then(cache => {
            console.log('caching all assets');
            cache.addAll(assets);
        })
    );
    
});

// activate service worker
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticChacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
})

// fetch event
self.addEventListener('fetch', evt => {
    console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        }).catch(() => caches.match('/no-connection'))
    );
})
